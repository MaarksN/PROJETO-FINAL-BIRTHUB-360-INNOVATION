"use client";

import {
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState
} from "react";

import type { SupportedLocale } from "../../lib/i18n";
import { useToastStore } from "../../stores/toast-store";
import type { SdrAutomaticCopy, SdrAutomaticLead } from "./sdr-automatic-data";
import {
  applyPollingFrameToLeads,
  applyPollingFrameToMetrics,
  applyPollingFrameToTrend,
  AVAILABLE_LEAD_COLUMNS,
  buildLeadCsv,
  buildSupportReply,
  createInitialMetrics,
  createInitialTasks,
  createInitialTrendSeries,
  createLeadInsightFallback,
  DEFAULT_LEAD_FILTERS,
  DEFAULT_PAGE_SIZE,
  DEFAULT_VISIBLE_COLUMNS,
  filterLeads,
  getLeadDashboardCopy,
  getStageDistribution,
  LEAD_POLLING_FRAMES,
  paginateLeads,
  resolveSlaLabel,
  type LeadColumnId,
  type LeadFilters,
  type LeadScoreBandId,
  type PendingTask
} from "./sdr-automatic-dashboard";
import {
  buildId,
  compactInsight,
  type LeadInsightState,
  type SupportMessage
} from "./SdrLeadScoreWorkspace.helpers";
import { SdrLeadScoreWorkspaceSide } from "./SdrLeadScoreWorkspace.side";
import { SdrLeadScoreWorkspaceTable } from "./SdrLeadScoreWorkspace.table";
import { SdrLeadScoreWorkspaceTop } from "./SdrLeadScoreWorkspace.top";
import styles from "./sdr-lead-score.module.css";

const TASKS_STORAGE_KEY = "bh_sdr_pending_tasks";
const COLUMNS_STORAGE_KEY = "bh_sdr_visible_columns";

export function SdrLeadScoreWorkspace(input: {
  copy: SdrAutomaticCopy;
  leads: SdrAutomaticLead[];
  locale: SupportedLocale;
}) {
  const dashboardCopy = getLeadDashboardCopy(input.locale);
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_LEAD_FILTERS);
  const [page, setPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState<LeadColumnId[]>(() => [...DEFAULT_VISIBLE_COLUMNS]);
  const [liveLeads, setLiveLeads] = useState(input.leads);
  const [metrics, setMetrics] = useState(() => createInitialMetrics(input.leads));
  const [trendPoints, setTrendPoints] = useState(() => createInitialTrendSeries(input.locale));
  const [pollStep, setPollStep] = useState(0);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(Date.now());
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0);
  const [tasks, setTasks] = useState<PendingTask[]>(() => createInitialTasks(input.locale));
  const [taskInput, setTaskInput] = useState("");
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportInput, setSupportInput] = useState("");
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([
    { id: "support_greeting", role: "assistant", text: dashboardCopy.chatbotGreeting }
  ]);
  const [openInsightLeadId, setOpenInsightLeadId] = useState<string | null>(null);
  const [insights, setInsights] = useState<Record<string, LeadInsightState>>({});
  const deferredQuery = useDeferredValue(filters.query);
  const pushToast = useToastStore((state) => state.push);
  const breachedIdsRef = useRef(
    new Set(input.leads.filter((lead) => lead.slaStatus === "breached").map((lead) => lead.id))
  );

  const effectiveFilters = useMemo(
    () => ({
      ...filters,
      query: deferredQuery
    }),
    [deferredQuery, filters]
  );

  const filteredLeads = useMemo(
    () => filterLeads(liveLeads, effectiveFilters),
    [effectiveFilters, liveLeads]
  );
  const stageDistribution = useMemo(
    () => getStageDistribution(filteredLeads, input.locale),
    [filteredLeads, input.locale]
  );
  const pagination = useMemo(
    () => paginateLeads(filteredLeads, page, DEFAULT_PAGE_SIZE),
    [filteredLeads, page]
  );
  const highlightedLeads = useMemo(
    () => [...filteredLeads].sort((left, right) => right.score - left.score).slice(0, 3),
    [filteredLeads]
  );

  const columnLabels = useMemo(
    () =>
      ({
        action: input.copy.tableAction,
        company: input.locale === "en-US" ? "Company" : "Empresa",
        createdAt: dashboardCopy.createdAtColumn,
        email: dashboardCopy.emailColumn,
        lead: input.copy.tableLead,
        owner: input.locale === "en-US" ? "Owner" : "Responsavel",
        score: dashboardCopy.scoreColumn,
        sla: dashboardCopy.slaColumn,
        source: dashboardCopy.sourceColumn,
        stage: dashboardCopy.stageColumn
      }) satisfies Record<LeadColumnId, string>,
    [dashboardCopy, input.copy.tableAction, input.copy.tableLead, input.locale]
  );

  useEffect(() => {
    try {
      const storedColumns = window.localStorage.getItem(COLUMNS_STORAGE_KEY);

      if (storedColumns) {
        const parsed = JSON.parse(storedColumns) as LeadColumnId[];
        const nextColumns = parsed.filter((column) => AVAILABLE_LEAD_COLUMNS.includes(column));

        if (nextColumns.length > 0) {
          setVisibleColumns(nextColumns);
        }
      }

      const storedTasks = window.localStorage.getItem(TASKS_STORAGE_KEY);

      if (storedTasks) {
        const parsed = JSON.parse(storedTasks) as PendingTask[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
        }
      }
    } catch {
      // Ignore malformed local state and keep the seeded defaults.
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  useEffect(() => {
    window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    setSupportMessages([{ id: "support_greeting", role: "assistant", text: dashboardCopy.chatbotGreeting }]);
  }, [dashboardCopy.chatbotGreeting]);

  useEffect(() => {
    setPage(1);
  }, [
    effectiveFilters.createdFrom,
    effectiveFilters.createdTo,
    effectiveFilters.query,
    effectiveFilters.scoreBands.join(","),
    effectiveFilters.stages.join(",")
  ]);

  useEffect(() => {
    if (page !== pagination.currentPage) {
      setPage(pagination.currentPage);
    }
  }, [page, pagination.currentPage]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSecondsSinceUpdate(Math.max(0, Math.floor((Date.now() - lastUpdatedAt) / 1000)));
    }, 1_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [lastUpdatedAt]);

  const runPollingFrame = useEffectEvent((frameIndex: number) => {
    const frame = LEAD_POLLING_FRAMES[frameIndex];

    if (!frame || document.hidden) {
      return;
    }

    startTransition(() => {
      setLiveLeads((current) => applyPollingFrameToLeads(current, frame));
      setMetrics((current) => applyPollingFrameToMetrics(current, frame));
      setTrendPoints((current) => applyPollingFrameToTrend(current, frame));
      setLastUpdatedAt(Date.now());
      setSecondsSinceUpdate(0);
      setPollStep((current) => Math.min(current + 1, LEAD_POLLING_FRAMES.length));
    });
  });

  useEffect(() => {
    if (pollStep >= LEAD_POLLING_FRAMES.length) {
      return;
    }

    const intervalId = window.setInterval(() => {
      runPollingFrame(pollStep);
    }, 8_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [pollStep, runPollingFrame]);

  useEffect(() => {
    const breachedIds = new Set(
      liveLeads.filter((lead) => lead.slaStatus === "breached").map((lead) => lead.id)
    );
    const previousBreachedIds = breachedIdsRef.current;

    for (const lead of liveLeads) {
      if (lead.slaStatus !== "breached" || previousBreachedIds.has(lead.id)) {
        continue;
      }

      pushToast({
        description:
          input.locale === "en-US"
            ? `${lead.name} exceeded the response target and needs intervention now.`
            : `${lead.name} ultrapassou o tempo de resposta e precisa de intervencao agora.`,
        title:
          input.locale === "en-US"
            ? `SLA breach on ${lead.company}`
            : `Violacao de SLA em ${lead.company}`,
        tone: "critical"
      });
    }

    breachedIdsRef.current = breachedIds;
  }, [input.locale, liveLeads, pushToast]);

  function updateFilter<K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) {
    setFilters((current) => ({
      ...current,
      [key]: value
    }));
  }

  function toggleSelection<T extends string>(values: T[], value: T): T[] {
    return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
  }

  function toggleStage(stage: SdrAutomaticLead["stage"]) {
    setFilters((current) => ({
      ...current,
      stages: toggleSelection(current.stages, stage)
    }));
  }

  function toggleScoreBand(band: LeadScoreBandId) {
    setFilters((current) => ({
      ...current,
      scoreBands: toggleSelection(current.scoreBands, band)
    }));
  }

  function toggleColumn(column: LeadColumnId) {
    setVisibleColumns((current) => {
      if (current.includes(column)) {
        if (current.length === 1) {
          return current;
        }

        return current.filter((item) => item !== column);
      }

      return [...current, column];
    });
  }

  function handleExportCsv() {
    const csv = buildLeadCsv(filteredLeads, input.locale);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "recent-leads.csv";
    anchor.click();
    URL.revokeObjectURL(url);

    pushToast({
      description:
        input.locale === "en-US"
          ? "The current filtered lead list was exported successfully."
          : "A lista atual filtrada de leads foi exportada com sucesso.",
      title: dashboardCopy.exportCsvLabel,
      tone: "success"
    });
  }

  async function handleLeadInsight(lead: SdrAutomaticLead) {
    setOpenInsightLeadId((current) => (current === lead.id ? null : lead.id));

    if (insights[lead.id]?.status === "ready") {
      return;
    }

    setInsights((current) => ({
      ...current,
      [lead.id]: {
        source: dashboardCopy.aiAgentLabel,
        status: "loading",
        text: dashboardCopy.aiTooltipLoading
      }
    }));

    const context = [
      `Agent: ${dashboardCopy.aiAgentLabel}`,
      `Lead: ${lead.name}`,
      `Email: ${lead.email}`,
      `Company: ${lead.company}`,
      `Role: ${lead.role}`,
      `Stage: ${dashboardCopy.stageLabels[lead.stage]}`,
      `Score: ${lead.score}`,
      `Priority: ${lead.priority}`,
      `Source: ${lead.source}`,
      `SLA: ${resolveSlaLabel(input.locale, lead.slaStatus)}`,
      `Owner: ${lead.owner}`,
      `Action: ${lead.action}`
    ].join("\n");

    try {
      const response = await fetch("/api/sales-os/execute", {
        body: JSON.stringify({
          fields: {
            context
          },
          toolId: "predictive_lead_scoring"
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      const payload = (await response.json()) as {
        error?: string;
        output?: string;
        provider?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to generate insight.");
      }

      setInsights((current) => ({
        ...current,
        [lead.id]: {
          source: payload.provider ?? dashboardCopy.aiAgentLabel,
          status: "ready",
          text: compactInsight(payload.output ?? createLeadInsightFallback(lead, input.locale))
        }
      }));
    } catch {
      setInsights((current) => ({
        ...current,
        [lead.id]: {
          source: dashboardCopy.aiAgentLabel,
          status: "error",
          text: createLeadInsightFallback(lead, input.locale)
        }
      }));
    }
  }

  function handleAddTask() {
    const nextTitle = taskInput.trim();

    if (!nextTitle) {
      return;
    }

    setTasks((current) => [
      {
        completed: false,
        id: buildId("task"),
        title: nextTitle
      },
      ...current
    ]);
    setTaskInput("");
  }

  function toggleTask(taskId: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed
            }
          : task
      )
    );
  }

  function handleSupportSubmit(question = supportInput) {
    const nextQuestion = question.trim();

    if (!nextQuestion) {
      return;
    }

    const reply = buildSupportReply({
      filters,
      leads: filteredLeads.length > 0 ? filteredLeads : liveLeads,
      locale: input.locale,
      metrics,
      question: nextQuestion
    });

    setSupportMessages((current) => [
      ...current,
      {
        id: buildId("support_user"),
        role: "user",
        text: nextQuestion
      },
      {
        id: buildId("support_assistant"),
        role: "assistant",
        text: reply
      }
    ]);
    setSupportInput("");
    setSupportOpen(true);
  }

  return (
    <section className={styles.dashboardStack}>
      <SdrLeadScoreWorkspaceTop
        copy={input.copy}
        dashboardCopy={dashboardCopy}
        highlightedLeads={highlightedLeads}
        metrics={metrics}
        secondsSinceUpdate={secondsSinceUpdate}
        trendPoints={trendPoints}
      />

      <section className={styles.contentGrid}>
        <SdrLeadScoreWorkspaceTable
          columnLabels={columnLabels}
          dashboardCopy={dashboardCopy}
          filteredLeadsLength={filteredLeads.length}
          filters={filters}
          handleExportCsv={handleExportCsv}
          handleLeadInsight={handleLeadInsight}
          insights={insights}
          liveLeadsLength={liveLeads.length}
          locale={input.locale}
          openInsightLeadId={openInsightLeadId}
          pagination={pagination}
          setFilters={setFilters}
          setPage={setPage}
          toggleColumn={toggleColumn}
          toggleScoreBand={toggleScoreBand}
          toggleStage={toggleStage}
          updateFilter={updateFilter}
          visibleColumns={visibleColumns}
        />

        <SdrLeadScoreWorkspaceSide
          dashboardCopy={dashboardCopy}
          handleAddTask={handleAddTask}
          handleSupportSubmit={handleSupportSubmit}
          locale={input.locale}
          setSupportInput={setSupportInput}
          setSupportOpen={setSupportOpen}
          setTaskInput={setTaskInput}
          stageDistribution={stageDistribution}
          supportInput={supportInput}
          supportMessages={supportMessages}
          supportOpen={supportOpen}
          taskInput={taskInput}
          tasks={tasks}
          toggleTask={toggleTask}
        />
      </section>
    </section>
  );
}
