// [SOURCE] BirthHub360_Agentes_Parallel_Plan — BoardPrep AI
import { access, readFile } from "node:fs/promises";
import path from "node:path";

import {
  type BoardPrepContract,
  type BoardPrepEvent,
  type BoardPrepInput,
  BoardPrepInputSchema,
  type BoardPrepMetrics,
  type BoardPrepOutput,
  BoardPrepOutputSchema,
  type ToolFailureMode,
  BoardPrepContractSchema,
  DEFAULT_BOARDPREP_CONTRACT
} from "./schemas.js";
import {
  type BoardPrepToolAdapters,
  type BoardPrepToolId,
  type BoardPrepToolInput,
  BOARDPREP_TOOL_IDS,
  BoardReportTemplateSchema,
  BudgetForecastSchema,
  KpiDashboardSnapshotSchema,
  createDefaultBoardPrepToolAdapters,
  normalizeToolId
} from "./tools.js";

const DEFAULT_PACKAGE_CONTRACT_PATH = path.resolve(
  process.cwd(),
  "packages",
  "agents",
  "executivos",
  "boardprep-ai",
  "contract.yaml"
);
const DEFAULT_PACKAGE_CONTRACT_PATH_FROM_PACKAGE = path.resolve(
  process.cwd(),
  "executivos",
  "boardprep-ai",
  "contract.yaml"
);
const DEFAULT_CONTRACT_PATHS = [
  DEFAULT_PACKAGE_CONTRACT_PATH,
  DEFAULT_PACKAGE_CONTRACT_PATH_FROM_PACKAGE
] as const;

interface BoardPrepAIAgentOptions {
  contractPath?: string;
  now?: () => Date;
  sleep?: (delayMs: number) => Promise<void>;
  toolAdapters?: BoardPrepToolAdapters;
}

interface LoadedContract {
  contract: BoardPrepContract;
  source: "default" | "file";
}

function sleep(delayMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

function toRecord(value: unknown): Record<string, unknown> | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function toStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const items = value.filter(
    (entry): entry is string => typeof entry === "string" && entry.trim().length > 0
  );
  return items.length > 0 ? items : undefined;
}

function toFailureMode(rawValue: string | undefined): ToolFailureMode | undefined {
  if (!rawValue) {
    return undefined;
  }

  const normalized = rawValue.trim().toLowerCase();
  if (normalized.includes("degrad")) {
    return "degraded_report";
  }
  if (normalized.includes("human")) {
    return "human_handoff";
  }
  if (normalized.includes("hard") || normalized.includes("fail")) {
    return "hard_fail";
  }
  return undefined;
}

function extractYamlArray(text: string, acceptedKeys: string[]): string[] | undefined {
  const lines = text.split(/\r?\n/);
  const normalizedKeys = new Set(acceptedKeys.map((entry) => entry.toLowerCase()));
  const items: string[] = [];
  let collecting = false;
  let collectorIndent = 0;

  for (const line of lines) {
    const keyMatch = line.match(/^(\s*)([A-Za-z0-9_-]+)\s*:\s*$/);
    if (keyMatch) {
      const key = keyMatch[2]?.toLowerCase();
      if (key && normalizedKeys.has(key)) {
        collecting = true;
        collectorIndent = keyMatch[1]?.length ?? 0;
        continue;
      }
      collecting = false;
    }

    if (!collecting) {
      continue;
    }

    const lineIndent = line.match(/^(\s*)/)?.[1]?.length ?? 0;
    const arrayItemMatch = line.match(/^\s*-\s*(.+)\s*$/);

    if (!arrayItemMatch && line.trim().length > 0 && lineIndent <= collectorIndent) {
      collecting = false;
      continue;
    }

    if (!arrayItemMatch) {
      continue;
    }

    const cleaned = (arrayItemMatch[1] ?? "")
      .trim()
      .replace(/^['"]/, "")
      .replace(/['"]$/, "");
    if (cleaned.length > 0) {
      items.push(cleaned);
    }
  }

  return items.length > 0 ? items : undefined;
}

function extractFirstNumber(text: string, patterns: RegExp[]): number | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const parsed = Number.parseInt(match[1], 10);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}

function clampMaxAttempts(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_BOARDPREP_CONTRACT.retry.maxAttempts;
  }
  return Math.min(3, Math.max(1, Math.trunc(value)));
}

function parseContractOverridesFromObject(
  value: Record<string, unknown>
): Partial<BoardPrepContract> {
  const overrides: Partial<BoardPrepContract> = {};

  const toolIds =
    toStringArray(value.toolIds) ??
    toStringArray(value.tools) ??
    toStringArray(value.required_tools);
  if (toolIds) {
    overrides.toolIds = toolIds;
  }

  const retryRecord = toRecord(value.retry);
  if (retryRecord) {
    const retryOverride: Partial<BoardPrepContract["retry"]> = {};
    if (typeof retryRecord.maxAttempts === "number") {
      retryOverride.maxAttempts = clampMaxAttempts(retryRecord.maxAttempts);
    }
    if (typeof retryRecord.baseDelayMs === "number") {
      retryOverride.baseDelayMs = retryRecord.baseDelayMs;
    }
    if (Object.keys(retryOverride).length > 0) {
      overrides.retry = retryOverride as BoardPrepContract["retry"];
    }
  }

  if (typeof value.failureMode === "string") {
    const mode = toFailureMode(value.failureMode);
    if (mode) {
      overrides.failureMode = mode;
    }
  }

  const fallbackBehavior = toRecord(value.fallback_behavior);
  if (fallbackBehavior) {
    const toolUnavailable = toRecord(fallbackBehavior.tool_unavailable);
    const exhausted = toRecord(fallbackBehavior.exhausted);
    const retryOverride: Partial<BoardPrepContract["retry"]> = {};

    if (toolUnavailable && typeof toolUnavailable.retry_attempts === "number") {
      retryOverride.maxAttempts = clampMaxAttempts(toolUnavailable.retry_attempts);
    }
    if (toolUnavailable && typeof toolUnavailable.base_delay_ms === "number") {
      retryOverride.baseDelayMs = toolUnavailable.base_delay_ms;
    }
    if (Object.keys(retryOverride).length > 0) {
      overrides.retry = {
        ...DEFAULT_BOARDPREP_CONTRACT.retry,
        ...retryOverride
      };
    }
    if (exhausted && exhausted.notify_human === true) {
      overrides.failureMode = "human_handoff";
    }
  }

  if (typeof value.failure_behavior === "string") {
    const mode = toFailureMode(value.failure_behavior);
    if (mode) {
      overrides.failureMode = mode;
    }
  }
  if (typeof value.fallback === "string") {
    const mode = toFailureMode(value.fallback);
    if (mode) {
      overrides.failureMode = mode;
    }
  }

  const observability = toRecord(value.observability);
  if (observability) {
    const events =
      toStringArray(observability.events_to_log) ??
      toStringArray(observability.events);
    const metrics = toStringArray(observability.metrics);
    if (events || metrics) {
      const filteredEvents = events?.filter(
        (entry): entry is BoardPrepContract["observability"]["events"][number] =>
          DEFAULT_BOARDPREP_CONTRACT.observability.events.includes(
            entry as BoardPrepContract["observability"]["events"][number]
          )
      );
      const filteredMetrics = metrics?.filter(
        (entry): entry is BoardPrepContract["observability"]["metrics"][number] =>
          DEFAULT_BOARDPREP_CONTRACT.observability.metrics.includes(
            entry as BoardPrepContract["observability"]["metrics"][number]
          )
      );
      overrides.observability = {
        events:
          filteredEvents && filteredEvents.length > 0
            ? filteredEvents
            : DEFAULT_BOARDPREP_CONTRACT.observability.events,
        metrics:
          filteredMetrics && filteredMetrics.length > 0
            ? filteredMetrics
            : DEFAULT_BOARDPREP_CONTRACT.observability.metrics
      };
    }
  }

  return overrides;
}

function parseContractOverrides(rawText: string): Partial<BoardPrepContract> {
  const trimmed = rawText.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      const asRecord = toRecord(parsed);
      if (asRecord) {
        return parseContractOverridesFromObject(asRecord);
      }
    } catch {
      // Keep YAML/regex parsing fallback.
    }
  }

  const overrides: Partial<BoardPrepContract> = {};
  const attempts = extractFirstNumber(rawText, [
    /retry_attempts\s*:\s*(\d+)/i,
    /maxAttempts\s*:\s*(\d+)/i,
    /max_attempts\s*:\s*(\d+)/i,
    /attempts\s*:\s*(\d+)/i
  ]);
  const baseDelayMs = extractFirstNumber(rawText, [
    /base_delay_ms\s*:\s*(\d+)/i,
    /baseDelayMs\s*:\s*(\d+)/i,
    /backoff_ms\s*:\s*(\d+)/i,
    /wait_ms\s*:\s*(\d+)/i
  ]);

  if (attempts !== undefined || baseDelayMs !== undefined) {
    overrides.retry = {
      ...DEFAULT_BOARDPREP_CONTRACT.retry,
      ...(attempts !== undefined
        ? { maxAttempts: clampMaxAttempts(attempts) }
        : {}),
      ...(baseDelayMs !== undefined ? { baseDelayMs } : {})
    };
  }

  const inlineModeMatch = rawText.match(
    /(?:failureMode|failure_mode|fallback_mode|failure_behavior|fallback|mode)\s*:\s*["']?([a-zA-Z_-]+)["']?/i
  );
  if (inlineModeMatch?.[1]) {
    const mapped = toFailureMode(inlineModeMatch[1]);
    if (mapped) {
      overrides.failureMode = mapped;
    }
  }
  if (/notify_human\s*:\s*true/i.test(rawText)) {
    overrides.failureMode = "human_handoff";
  }
  if (/notificar|human|analyst|chief of staff/i.test(rawText)) {
    overrides.failureMode = overrides.failureMode ?? "human_handoff";
  }

  const toolIds =
    extractYamlArray(rawText, ["toolIds", "tools", "required_tools"]) ??
    (() => {
      const inlineTools = rawText.match(
        /(?:toolIds|tools|required_tools)\s*:\s*\[([^\]]+)\]/i
      );
      if (!inlineTools?.[1]) {
        return undefined;
      }
      const items = inlineTools[1]
        .split(",")
        .map((entry) => entry.trim().replace(/^['"]/, "").replace(/['"]$/, ""))
        .filter((entry) => entry.length > 0);
      return items.length > 0 ? items : undefined;
    })();

  if (toolIds) {
    overrides.toolIds = toolIds;
  }

  const eventValues = extractYamlArray(rawText, ["events_to_log", "events"]);
  const metricValues = extractYamlArray(rawText, ["metrics"]);
  if (eventValues || metricValues) {
    const filteredEvents = eventValues?.filter(
      (entry): entry is BoardPrepContract["observability"]["events"][number] =>
        DEFAULT_BOARDPREP_CONTRACT.observability.events.includes(
          entry as BoardPrepContract["observability"]["events"][number]
        )
    );
    const filteredMetrics = metricValues?.filter(
      (entry): entry is BoardPrepContract["observability"]["metrics"][number] =>
        DEFAULT_BOARDPREP_CONTRACT.observability.metrics.includes(
          entry as BoardPrepContract["observability"]["metrics"][number]
        )
    );
    overrides.observability = {
      events:
        filteredEvents && filteredEvents.length > 0
          ? filteredEvents
          : DEFAULT_BOARDPREP_CONTRACT.observability.events,
      metrics:
        filteredMetrics && filteredMetrics.length > 0
          ? filteredMetrics
          : DEFAULT_BOARDPREP_CONTRACT.observability.metrics
    };
  }

  return overrides;
}

function mergeContract(
  overrides: Partial<BoardPrepContract>,
  fallback: BoardPrepContract
): BoardPrepContract {
  return BoardPrepContractSchema.parse({
    ...fallback,
    ...overrides,
    observability: {
      ...fallback.observability,
      ...overrides.observability
    },
    retry: {
      ...fallback.retry,
      ...overrides.retry
    },
    toolIds: overrides.toolIds ?? fallback.toolIds
  });
}

function toIsoDateWithOffset(isoDate: string, offsetDays: number): string {
  const asDate = new Date(`${isoDate}T00:00:00.000Z`);
  asDate.setUTCDate(asDate.getUTCDate() + offsetDays);
  return asDate.toISOString().slice(0, 10);
}

export class BoardPrepAIAgent {
  private readonly contractPaths: string[];

  private readonly now: () => Date;

  private readonly sleepFn: (delayMs: number) => Promise<void>;

  private readonly toolAdapters: BoardPrepToolAdapters;

  private lastMetrics: BoardPrepMetrics = {
    durationMs: 0,
    retries: 0,
    toolCalls: 0,
    toolFailures: 0
  };

  constructor(options: BoardPrepAIAgentOptions = {}) {
    this.contractPaths = options.contractPath
      ? [options.contractPath]
      : [...DEFAULT_CONTRACT_PATHS];
    this.now = options.now ?? (() => new Date());
    this.sleepFn = options.sleep ?? sleep;
    this.toolAdapters = options.toolAdapters ?? createDefaultBoardPrepToolAdapters();
  }

  getMetricsSnapshot(): BoardPrepMetrics {
    return {
      ...this.lastMetrics
    };
  }

  async run(input: BoardPrepInput): Promise<BoardPrepOutput> {
    const parsedInput = BoardPrepInputSchema.parse(input);
    const startedAt = this.now();
    const events: BoardPrepEvent[] = [];
    const metrics: BoardPrepMetrics = {
      durationMs: 0,
      retries: 0,
      toolCalls: 0,
      toolFailures: 0
    };
    const fallbackReasons: string[] = [];

    const emitEvent = (
      event: Omit<BoardPrepEvent, "timestamp"> & { timestamp?: string }
    ): void => {
      const normalized: BoardPrepEvent = {
        ...event,
        timestamp: event.timestamp ?? this.now().toISOString()
      };
      events.push(normalized);
      const logPayload = JSON.stringify({
        level: normalized.level,
        message: normalized.message,
        name: normalized.name
      });
      if (normalized.level === "error") {
        console.error(logPayload);
      } else if (normalized.level === "warning") {
        console.warn(logPayload);
      } else {
        console.log(logPayload);
      }
    };

    emitEvent({
      details: {
        source: "request",
        toolId: "boardprep-ai"
      },
      level: "info",
      message: "BoardPrep request accepted.",
      name: "boardprep.request.received"
    });

    const loadedContract = await this.loadContract();
    emitEvent({
      details: {
        source: loadedContract.source
      },
      level: "info",
      message: `Contract loaded from ${loadedContract.source}.`,
      name: "boardprep.contract.loaded"
    });

    const resolvedTools = this.resolveToolIds(loadedContract.contract.toolIds);
    const effectiveTools =
      resolvedTools.length > 0 ? resolvedTools : [...BOARDPREP_TOOL_IDS];

    const executeWithRetry = async <T>(
      toolId: BoardPrepToolId,
      operation: () => Promise<T>
    ): Promise<T> => {
      const maxAttempts = loadedContract.contract.retry.maxAttempts;
      const baseDelayMs = loadedContract.contract.retry.baseDelayMs;
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        emitEvent({
          details: {
            attempt,
            maxAttempts,
            toolId
          },
          level: "info",
          message: `Running ${toolId} (attempt ${attempt}/${maxAttempts}).`,
          name: "boardprep.tool.call.started"
        });

        try {
          metrics.toolCalls += 1;
          const result = await operation();
          emitEvent({
            details: {
              attempt,
              toolId
            },
            level: "info",
            message: `${toolId} completed.`,
            name: "boardprep.tool.call.succeeded"
          });
          return result;
        } catch (error) {
          const asError =
            error instanceof Error ? error : new Error("Unknown tool failure.");
          lastError = asError;

          emitEvent({
            details: {
              attempt,
              errorCode: asError.message,
              maxAttempts,
              toolId
            },
            level: "warning",
            message: `${toolId} failed at attempt ${attempt}.`,
            name: "boardprep.tool.call.failed"
          });

          if (attempt >= maxAttempts) {
            break;
          }

          const delayMs = baseDelayMs * 2 ** (attempt - 1);
          metrics.retries += 1;
          emitEvent({
            details: {
              attempt,
              maxAttempts,
              toolId
            },
            level: "info",
            message: `${toolId} retry scheduled after ${delayMs}ms.`,
            name: "boardprep.retry.scheduled"
          });
          await this.sleepFn(delayMs);
        }
      }

      metrics.toolFailures += 1;
      throw lastError ?? new Error(`${toolId} failed with no details.`);
    };

    const toolInput: BoardPrepToolInput = {
      audience: parsedInput.audience,
      currency: parsedInput.constraints.currency,
      endDate: parsedInput.period.endDate,
      startDate: parsedInput.period.startDate,
      tenantId: parsedInput.tenantId
    };

    let boardTemplate = null;
    let budgetForecast = null;
    let kpiDashboard = null;

    if (effectiveTools.includes("board-report-generator")) {
      try {
        boardTemplate = BoardReportTemplateSchema.parse(
          await executeWithRetry("board-report-generator", () =>
            this.toolAdapters.fetchBoardReportTemplate(toolInput)
          )
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "board-report-generator failed without error payload.";
        fallbackReasons.push(`board-report-generator: ${message}`);
      }
    }

    if (effectiveTools.includes("budget-forecaster")) {
      try {
        budgetForecast = BudgetForecastSchema.parse(
          await executeWithRetry("budget-forecaster", () =>
            this.toolAdapters.fetchBudgetForecast(toolInput)
          )
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "budget-forecaster failed without error payload.";
        fallbackReasons.push(`budget-forecaster: ${message}`);
      }
    }

    if (effectiveTools.includes("kpi-dashboard")) {
      try {
        kpiDashboard = KpiDashboardSnapshotSchema.parse(
          await executeWithRetry("kpi-dashboard", () =>
            this.toolAdapters.fetchKpiDashboard(toolInput)
          )
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "kpi-dashboard failed without error payload.";
        fallbackReasons.push(`kpi-dashboard: ${message}`);
      }
    }

    const fallbackApplied = fallbackReasons.length > 0;
    const fallbackMode: ToolFailureMode | null = fallbackApplied
      ? loadedContract.contract.failureMode
      : null;

    if (fallbackApplied) {
      emitEvent({
        details: {
          fallbackMode: fallbackMode ?? undefined,
          source: "failure_behavior"
        },
        level: "warning",
        message: "Fallback behavior applied for BoardPrep output.",
        name: "boardprep.fallback.applied"
      });
    }

    const safeTemplate = boardTemplate ?? {
      mandatorySections: [
        "Strategic KPIs",
        "Risk Radar",
        "Capital Allocation",
        "Board Action Queue"
      ],
      narrativeLens: "degraded_data_mode",
      tone: "neutral" as const
    };
    const safeBudget = budgetForecast ?? {
      cashRunwayMonths: 0,
      fxRiskLevel: "medium" as const,
      investmentCapacityPct: 0,
      monthlyBurnRate: 0
    };
    const safeKpis = kpiDashboard ?? {
      churnRatePct: 0,
      npsScore: 0,
      pipelineCoverageRatio: 0,
      revenueGrowthPct: 0,
      topRisk: "critical data unavailable"
    };

    const direction = (value: number): "down" | "stable" | "up" => {
      if (value > 0.05) {
        return "up";
      }
      if (value < -0.05) {
        return "down";
      }
      return "stable";
    };

    const summary = fallbackApplied
      ? "BoardPrep generated under fallback mode due to tool execution failures."
      : "BoardPrep generated with full strategic tool coverage.";

    const maxRecommendations = parsedInput.constraints.maxRecommendations;
    const recommendationPool = [
      {
        owner: "CFO",
        priority:
          safeBudget.cashRunwayMonths < 10
            ? ("critical" as const)
            : ("high" as const),
        recommendation:
          safeBudget.cashRunwayMonths < 10
            ? "Freeze discretionary spend and re-sequence hiring for runway protection."
            : "Protect growth investments with quarterly spend checkpoints.",
        targetDate: toIsoDateWithOffset(parsedInput.period.endDate, 14)
      },
      {
        owner: "CRO",
        priority:
          safeKpis.pipelineCoverageRatio < 2
            ? ("critical" as const)
            : ("high" as const),
        recommendation:
          safeKpis.pipelineCoverageRatio < 2
            ? "Launch executive deal rescue sprint for top 10 late-stage opportunities."
            : "Increase qualification rigor to prevent late-stage slippage.",
        targetDate: toIsoDateWithOffset(parsedInput.period.endDate, 7)
      },
      {
        owner: "COO",
        priority:
          safeKpis.churnRatePct > 4.5 ? ("high" as const) : ("medium" as const),
        recommendation:
          safeKpis.churnRatePct > 4.5
            ? "Prioritize churn containment task force with weekly escalation ritual."
            : "Keep operating cadence and monitor churn by cohort weekly.",
        targetDate: toIsoDateWithOffset(parsedInput.period.endDate, 21)
      },
      {
        owner: "CEO",
        priority: "medium" as const,
        recommendation:
          "Align board narrative with risk-adjusted growth and explicit trade-off framing.",
        targetDate: toIsoDateWithOffset(parsedInput.period.endDate, 5)
      }
    ];

    const status: BoardPrepOutput["status"] =
      fallbackApplied && fallbackMode === "hard_fail"
        ? "error"
        : fallbackApplied
          ? "fallback"
          : "success";

    metrics.durationMs = Math.max(0, this.now().getTime() - startedAt.getTime());
    emitEvent({
      details: {
        source: "response"
      },
      level: status === "error" ? "error" : "info",
      message: "BoardPrep response generated.",
      name: "boardprep.response.generated"
    });

    const outputCandidate: BoardPrepOutput = {
      agent: "BoardPrep AI",
      domain: "executivos",
      executiveBrief: {
        allocationGuidance: [
          {
            confidence:
              safeBudget.investmentCapacityPct > 30
                ? "high"
                : safeBudget.investmentCapacityPct > 15
                  ? "medium"
                  : "low",
            rationale: `Runway at ${safeBudget.cashRunwayMonths.toFixed(
              1
            )} months with FX risk level ${safeBudget.fxRiskLevel}.`,
            recommendation:
              safeBudget.investmentCapacityPct > 20
                ? "Maintain selective growth bets and preserve downside buffers."
                : "Consolidate cash and prioritize retention-led growth motions."
          }
        ],
        headline: `${safeTemplate.narrativeLens} | Revenue growth ${safeKpis.revenueGrowthPct.toFixed(
          2
        )}%`,
        kpiHighlights: [
          {
            direction: direction(safeKpis.revenueGrowthPct),
            metric: "Revenue Growth %",
            rationale: "Quarter-over-quarter growth trend from KPI dashboard.",
            value: safeKpis.revenueGrowthPct
          },
          {
            direction: direction(-safeKpis.churnRatePct),
            metric: "Churn Rate %",
            rationale: "Lower churn drives renewal stability for board commitments.",
            value: safeKpis.churnRatePct
          },
          {
            direction: direction(safeKpis.pipelineCoverageRatio - 3),
            metric: "Pipeline Coverage Ratio",
            rationale:
              "Pipeline coverage benchmarked against strategic target of 3x.",
            value: safeKpis.pipelineCoverageRatio
          }
        ],
        nextBoardActions: recommendationPool.slice(0, maxRecommendations),
        riskSignals: [
          {
            impact:
              safeKpis.churnRatePct > 5
                ? "critical"
                : safeKpis.churnRatePct > 3.5
                  ? "high"
                  : "medium",
            mitigation:
              "Escalate proactive retention playbook for top ARR cohorts.",
            signal: safeKpis.topRisk
          },
          {
            impact:
              safeBudget.fxRiskLevel === "high"
                ? "high"
                : safeBudget.fxRiskLevel === "medium"
                  ? "medium"
                  : "low",
            mitigation:
              "Review hedging policy and stress test downside scenarios before board meeting.",
            signal: `FX risk level is ${safeBudget.fxRiskLevel}.`
          }
        ]
      },
      fallback: {
        applied: fallbackApplied,
        mode: fallbackMode,
        reasons: fallbackReasons
      },
      generatedAt: this.now().toISOString(),
      observability: {
        events,
        metrics
      },
      status,
      summary
    };

    const parsedOutput = BoardPrepOutputSchema.parse(outputCandidate);
    this.lastMetrics = {
      ...parsedOutput.observability.metrics
    };
    return parsedOutput;
  }

  private resolveToolIds(toolIds: string[]): BoardPrepToolId[] {
    const mapped = toolIds
      .map((toolId) => normalizeToolId(toolId))
      .filter((toolId): toolId is BoardPrepToolId => toolId !== null);
    return Array.from(new Set(mapped));
  }

  private async loadContract(): Promise<LoadedContract> {
    for (const contractPath of this.contractPaths) {
      try {
        await access(contractPath);
      } catch {
        continue;
      }

      try {
        const content = await readFile(contractPath, "utf8");
        const merged = mergeContract(
          parseContractOverrides(content),
          DEFAULT_BOARDPREP_CONTRACT
        );
        return {
          contract: merged,
          source: "file"
        };
      } catch {
        continue;
      }
    }

    return {
      contract: DEFAULT_BOARDPREP_CONTRACT,
      source: "default"
    };
  }
}
