// [SOURCE] BirthHub360_Agentes_Parallel_Plan - CulturePulse
import { access, readFile } from "node:fs/promises";
import path from "node:path";

import {
  type CultureEvent,
  type CultureFailureMode,
  type CultureMetrics,
  type CulturePulseContract,
  CulturePulseContractSchema,
  type CulturePulseInput,
  CulturePulseInputSchema,
  type CulturePulseOutput,
  CulturePulseOutputSchema,
  DEFAULT_CULTUREPULSE_CONTRACT
} from "./schemas.js";
import {
  CULTUREPULSE_TOOL_IDS,
  EngagementSurveySnapshotSchema,
  ManagerSentimentSnapshotSchema,
  RetentionRiskSnapshotSchema,
  type CulturePulseToolAdapters,
  type CultureToolId,
  type CultureToolInput,
  createDefaultCulturePulseToolAdapters,
  normalizeCultureToolId
} from "./tools.js";

const DEFAULT_AUDIT_CONTRACT_PATH = path.resolve(
  process.cwd(),
  "audit",
  "pending_review",
  "ciclo1_culturepulse",
  "contract.yaml"
);
const DEFAULT_AUDIT_CONTRACT_PATH_FROM_PACKAGE = path.resolve(
  process.cwd(),
  "..",
  "..",
  "audit",
  "pending_review",
  "ciclo1_culturepulse",
  "contract.yaml"
);
const DEFAULT_PACKAGE_CONTRACT_PATH = path.resolve(
  process.cwd(),
  "packages",
  "agents",
  "executives",
  "CulturePulse",
  "contract.yaml"
);
const DEFAULT_PACKAGE_CONTRACT_PATH_FROM_PACKAGE = path.resolve(
  process.cwd(),
  "executives",
  "CulturePulse",
  "contract.yaml"
);
const DEFAULT_CONTRACT_PATHS = [
  DEFAULT_AUDIT_CONTRACT_PATH,
  DEFAULT_AUDIT_CONTRACT_PATH_FROM_PACKAGE,
  DEFAULT_PACKAGE_CONTRACT_PATH,
  DEFAULT_PACKAGE_CONTRACT_PATH_FROM_PACKAGE
] as const;

interface CulturePulseAgentOptions {
  contractPath?: string;
  now?: () => Date;
  sleep?: (delayMs: number) => Promise<void>;
  toolAdapters?: CulturePulseToolAdapters;
}

interface LoadedContract {
  contract: CulturePulseContract;
  source: "audit_file" | "custom_file" | "default" | "package_file";
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

function toFailureMode(rawValue: string | undefined): CultureFailureMode | undefined {
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
    const itemMatch = line.match(/^\s*-\s*(.+)\s*$/);
    if (!itemMatch && line.trim().length > 0 && lineIndent <= collectorIndent) {
      collecting = false;
      continue;
    }
    if (!itemMatch) {
      continue;
    }

    const cleaned = (itemMatch[1] ?? "")
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
    if (!match?.[1]) {
      continue;
    }
    const parsed = Number.parseInt(match[1], 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function clampMaxAttempts(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_CULTUREPULSE_CONTRACT.retry.maxAttempts;
  }
  return Math.min(3, Math.max(1, Math.trunc(value)));
}

function classifyContractSource(contractPath: string): LoadedContract["source"] {
  const normalized = path.normalize(contractPath).toLowerCase();
  if (
    normalized.endsWith(
      path
        .join("audit", "pending_review", "ciclo1_culturepulse", "contract.yaml")
        .toLowerCase()
    )
  ) {
    return "audit_file";
  }
  if (
    normalized.endsWith(
      path.join("executives", "CulturePulse", "contract.yaml").toLowerCase()
    )
  ) {
    return "package_file";
  }
  return "custom_file";
}

function parseContractOverridesFromObject(
  value: Record<string, unknown>
): Partial<CulturePulseContract> {
  const overrides: Partial<CulturePulseContract> = {};

  const toolIds =
    toStringArray(value.toolIds) ??
    toStringArray(value.tools) ??
    toStringArray(value.required_tools);
  if (toolIds) {
    overrides.toolIds = toolIds;
  }

  const retry = toRecord(value.retry);
  if (retry) {
    const retryOverride: Partial<CulturePulseContract["retry"]> = {};
    if (typeof retry.maxAttempts === "number") {
      retryOverride.maxAttempts = clampMaxAttempts(retry.maxAttempts);
    }
    if (typeof retry.baseDelayMs === "number") {
      retryOverride.baseDelayMs = retry.baseDelayMs;
    }
    if (Object.keys(retryOverride).length > 0) {
      overrides.retry = retryOverride as CulturePulseContract["retry"];
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
    const retryOverride: Partial<CulturePulseContract["retry"]> = {};

    if (toolUnavailable && typeof toolUnavailable.retry_attempts === "number") {
      retryOverride.maxAttempts = clampMaxAttempts(toolUnavailable.retry_attempts);
    }
    if (toolUnavailable && typeof toolUnavailable.base_delay_ms === "number") {
      retryOverride.baseDelayMs = toolUnavailable.base_delay_ms;
    }
    if (Object.keys(retryOverride).length > 0) {
      overrides.retry = {
        ...DEFAULT_CULTUREPULSE_CONTRACT.retry,
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
        (entry): entry is CulturePulseContract["observability"]["events"][number] =>
          DEFAULT_CULTUREPULSE_CONTRACT.observability.events.includes(
            entry as CulturePulseContract["observability"]["events"][number]
          )
      );
      const filteredMetrics = metrics?.filter(
        (entry): entry is CulturePulseContract["observability"]["metrics"][number] =>
          DEFAULT_CULTUREPULSE_CONTRACT.observability.metrics.includes(
            entry as CulturePulseContract["observability"]["metrics"][number]
          )
      );
      overrides.observability = {
        events:
          filteredEvents && filteredEvents.length > 0
            ? filteredEvents
            : DEFAULT_CULTUREPULSE_CONTRACT.observability.events,
        metrics:
          filteredMetrics && filteredMetrics.length > 0
            ? filteredMetrics
            : DEFAULT_CULTUREPULSE_CONTRACT.observability.metrics
      };
    }
  }

  return overrides;
}

function parseContractOverrides(rawText: string): Partial<CulturePulseContract> {
  const trimmed = rawText.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      const asRecord = toRecord(parsed);
      if (asRecord) {
        return parseContractOverridesFromObject(asRecord);
      }
    } catch {
      // keep fallback parsing
    }
  }

  const overrides: Partial<CulturePulseContract> = {};
  const maxAttempts = extractFirstNumber(rawText, [
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

  if (maxAttempts !== undefined || baseDelayMs !== undefined) {
    overrides.retry = {
      ...DEFAULT_CULTUREPULSE_CONTRACT.retry,
      ...(maxAttempts !== undefined
        ? { maxAttempts: clampMaxAttempts(maxAttempts) }
        : {}),
      ...(baseDelayMs !== undefined ? { baseDelayMs } : {})
    };
  }

  const modeMatch = rawText.match(
    /(?:failureMode|failure_mode|fallback_mode|failure_behavior|fallback|mode)\s*:\s*["']?([a-zA-Z_-]+)["']?/i
  );
  if (modeMatch?.[1]) {
    const mapped = toFailureMode(modeMatch[1]);
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
      const inline = rawText.match(
        /(?:toolIds|tools|required_tools)\s*:\s*\[([^\]]+)\]/i
      );
      if (!inline?.[1]) {
        return undefined;
      }
      const list = inline[1]
        .split(",")
        .map((entry) => entry.trim().replace(/^['"]/, "").replace(/['"]$/, ""))
        .filter((entry) => entry.length > 0);
      return list.length > 0 ? list : undefined;
    })();
  if (toolIds) {
    overrides.toolIds = toolIds;
  }

  const events = extractYamlArray(rawText, ["events_to_log", "events"]);
  const metrics = extractYamlArray(rawText, ["metrics"]);
  if (events || metrics) {
    const filteredEvents = events?.filter(
      (entry): entry is CulturePulseContract["observability"]["events"][number] =>
        DEFAULT_CULTUREPULSE_CONTRACT.observability.events.includes(
          entry as CulturePulseContract["observability"]["events"][number]
        )
    );
    const filteredMetrics = metrics?.filter(
      (entry): entry is CulturePulseContract["observability"]["metrics"][number] =>
        DEFAULT_CULTUREPULSE_CONTRACT.observability.metrics.includes(
          entry as CulturePulseContract["observability"]["metrics"][number]
        )
    );
    overrides.observability = {
      events:
        filteredEvents && filteredEvents.length > 0
          ? filteredEvents
          : DEFAULT_CULTUREPULSE_CONTRACT.observability.events,
      metrics:
        filteredMetrics && filteredMetrics.length > 0
          ? filteredMetrics
          : DEFAULT_CULTUREPULSE_CONTRACT.observability.metrics
    };
  }

  return overrides;
}

function mergeContract(
  overrides: Partial<CulturePulseContract>,
  fallback: CulturePulseContract
): CulturePulseContract {
  return CulturePulseContractSchema.parse({
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

function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export class CulturePulseAgent {
  private readonly contractPaths: string[];

  private readonly now: () => Date;

  private readonly sleepFn: (delayMs: number) => Promise<void>;

  private readonly toolAdapters: CulturePulseToolAdapters;

  private lastMetrics: CultureMetrics = {
    durationMs: 0,
    retries: 0,
    toolCalls: 0,
    toolFailures: 0
  };

  constructor(options: CulturePulseAgentOptions = {}) {
    this.contractPaths = options.contractPath
      ? [options.contractPath]
      : [...DEFAULT_CONTRACT_PATHS];
    this.now = options.now ?? (() => new Date());
    this.sleepFn = options.sleep ?? sleep;
    this.toolAdapters = options.toolAdapters ?? createDefaultCulturePulseToolAdapters();
  }

  getMetricsSnapshot(): CultureMetrics {
    return {
      ...this.lastMetrics
    };
  }

  async run(input: CulturePulseInput): Promise<CulturePulseOutput> {
    const parsedInput = CulturePulseInputSchema.parse(input);
    const startedAt = this.now();
    const events: CultureEvent[] = [];
    const metrics: CultureMetrics = {
      durationMs: 0,
      retries: 0,
      toolCalls: 0,
      toolFailures: 0
    };
    const fallbackReasons: string[] = [];

    const emitEvent = (
      event: Omit<CultureEvent, "timestamp"> & { timestamp?: string }
    ): void => {
      const normalized: CultureEvent = {
        ...event,
        timestamp: event.timestamp ?? this.now().toISOString()
      };
      events.push(normalized);
      const payload = JSON.stringify({
        level: normalized.level,
        message: normalized.message,
        name: normalized.name
      });
      if (normalized.level === "error") {
        console.error(payload);
      } else if (normalized.level === "warning") {
        console.warn(payload);
      } else {
        console.log(payload);
      }
    };

    emitEvent({
      details: {
        source: "request",
        toolId: "culturepulse"
      },
      level: "info",
      message: "CulturePulse request accepted.",
      name: "culturepulse.request.received"
    });

    const loadedContract = await this.loadContract();
    emitEvent({
      details: {
        source: loadedContract.source
      },
      level: "info",
      message: `Contract loaded from ${loadedContract.source}.`,
      name: "culturepulse.contract.loaded"
    });

    const mappedTools = this.resolveToolIds(loadedContract.contract.toolIds);
    const effectiveTools =
      mappedTools.length > 0 ? mappedTools : [...CULTUREPULSE_TOOL_IDS];

    const runWithRetry = async <T>(
      toolId: CultureToolId,
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
          name: "culturepulse.tool.call.started"
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
            name: "culturepulse.tool.call.succeeded"
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
            name: "culturepulse.tool.call.failed"
          });
          if (attempt >= maxAttempts) {
            break;
          }
          metrics.retries += 1;
          const delay = baseDelayMs * 2 ** (attempt - 1);
          emitEvent({
            details: {
              attempt,
              maxAttempts,
              toolId
            },
            level: "info",
            message: `${toolId} retry scheduled after ${delay}ms.`,
            name: "culturepulse.retry.scheduled"
          });
          await this.sleepFn(delay);
        }
      }

      metrics.toolFailures += 1;
      throw lastError ?? new Error(`${toolId} failed with no details.`);
    };

    const toolInput: CultureToolInput = {
      endDate: parsedInput.window.endDate,
      segments: parsedInput.segments,
      startDate: parsedInput.window.startDate,
      tenantId: parsedInput.tenantId
    };

    let engagement = null;
    let retention = null;
    let manager = null;

    if (effectiveTools.includes("engagement-survey")) {
      try {
        engagement = EngagementSurveySnapshotSchema.parse(
          await runWithRetry("engagement-survey", () =>
            this.toolAdapters.fetchEngagementSurvey(toolInput)
          )
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "engagement-survey failed.";
        fallbackReasons.push(`engagement-survey: ${message}`);
      }
    }

    if (effectiveTools.includes("retention-risk-feed")) {
      try {
        retention = RetentionRiskSnapshotSchema.parse(
          await runWithRetry("retention-risk-feed", () =>
            this.toolAdapters.fetchRetentionRisk(toolInput)
          )
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "retention-risk-feed failed.";
        fallbackReasons.push(`retention-risk-feed: ${message}`);
      }
    }

    if (effectiveTools.includes("manager-sentiment-stream")) {
      try {
        manager = ManagerSentimentSnapshotSchema.parse(
          await runWithRetry("manager-sentiment-stream", () =>
            this.toolAdapters.fetchManagerSentiment(toolInput)
          )
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "manager-sentiment-stream failed.";
        fallbackReasons.push(`manager-sentiment-stream: ${message}`);
      }
    }

    const fallbackApplied = fallbackReasons.length > 0;
    const fallbackMode: CultureFailureMode | null = fallbackApplied
      ? loadedContract.contract.failureMode
      : null;

    if (fallbackApplied) {
      emitEvent({
        details: {
          fallbackMode: fallbackMode ?? undefined,
          source: "failure_behavior"
        },
        level: "warning",
        message: "Fallback behavior applied for CulturePulse output.",
        name: "culturepulse.fallback.applied"
      });
    }

    const safeEngagement = engagement ?? {
      eNps: 0,
      engagementIndex: 0,
      participationRatePct: 0
    };
    const safeRetention = retention ?? {
      burnoutRiskPct: 0,
      highRiskPopulationPct: 0,
      topDriver: "retention signal unavailable"
    };
    const safeManager = manager ?? {
      coachingEffectivenessPct: 0,
      communicationClarityPct: 0,
      topTheme: "manager sentiment unavailable"
    };

    const trendDirection = (value: number): "down" | "stable" | "up" => {
      if (value > 0.5) {
        return "up";
      }
      if (value < -0.5) {
        return "down";
      }
      return "stable";
    };

    const status: CulturePulseOutput["status"] =
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
      message: "CulturePulse response generated.",
      name: "culturepulse.response.generated"
    });

    const maxInsights = parsedInput.constraints.maxInsights;
    const output = CulturePulseOutputSchema.parse({
      agent: "CulturePulse",
      cultureBrief: {
        coverage: {
          dataCompletenessPct: fallbackApplied ? 66 : 100,
          segmentsAnalyzed: parsedInput.segments
        },
        engagementSignals: [
          {
            interpretation:
              safeEngagement.engagementIndex >= 70
                ? "Overall engagement is stable and supportive of execution."
                : "Engagement requires immediate leadership attention.",
            metric: "Engagement Index",
            trend: trendDirection(safeEngagement.engagementIndex - 65),
            value: safeEngagement.engagementIndex
          },
          {
            interpretation:
              safeEngagement.eNps >= 20
                ? "Employee advocacy remains net positive."
                : "Employee advocacy trend is fragile.",
            metric: "eNPS",
            trend: trendDirection(safeEngagement.eNps),
            value: safeEngagement.eNps
          }
        ].slice(0, maxInsights),
        headline: `Culture health snapshot: engagement ${safeEngagement.engagementIndex.toFixed(
          1
        )}, high-risk population ${safeRetention.highRiskPopulationPct.toFixed(1)}%.`,
        managerSignals: [
          {
            note: `Manager communication clarity at ${safeManager.communicationClarityPct.toFixed(
              1
            )}%.`,
            strength:
              safeManager.communicationClarityPct > 75
                ? "high"
                : safeManager.communicationClarityPct > 55
                  ? "medium"
                  : "low",
            theme: safeManager.topTheme
          },
          {
            note: `Coaching effectiveness at ${safeManager.coachingEffectivenessPct.toFixed(
              1
            )}%.`,
            strength:
              safeManager.coachingEffectivenessPct > 75
                ? "high"
                : safeManager.coachingEffectivenessPct > 55
                  ? "medium"
                  : "low",
            theme: "manager coaching maturity"
          }
        ].slice(0, maxInsights),
        nextActions: [
          {
            owner: "CHRO",
            priority:
              safeRetention.highRiskPopulationPct > 20 ? "high" : "medium",
            recommendation:
              safeRetention.highRiskPopulationPct > 20
                ? "Launch retention taskforce for high-risk talent cohorts."
                : "Maintain quarterly pulse cadence with segment-level monitoring.",
            targetDate: addDays(parsedInput.window.endDate, 7)
          },
          {
            owner: "CEO",
            priority:
              safeEngagement.engagementIndex < 65 ? "high" : "medium",
            recommendation:
              safeEngagement.engagementIndex < 65
                ? "Run executive listening sprint with transparent commitments."
                : "Reinforce positive practices through leadership all-hands.",
            targetDate: addDays(parsedInput.window.endDate, 10)
          }
        ].slice(0, maxInsights),
        riskSignals: [
          {
            impact:
              safeRetention.highRiskPopulationPct > 20
                ? "Potential attrition in critical roles."
                : "Attrition risk currently contained.",
            mitigation:
              "Prioritize stay interviews and manager-led action plans for at-risk teams.",
            severity:
              safeRetention.highRiskPopulationPct > 25
                ? "critical"
                : safeRetention.highRiskPopulationPct > 15
                  ? "high"
                  : "medium",
            signal: safeRetention.topDriver
          },
          {
            impact:
              safeRetention.burnoutRiskPct > 30
                ? "Sustained burnout pressure may impact delivery and retention."
                : "Burnout trend is monitorable but controlled.",
            mitigation:
              "Apply workload rebalance and enforce recovery windows in high-demand squads.",
            severity:
              safeRetention.burnoutRiskPct > 35
                ? "high"
                : safeRetention.burnoutRiskPct > 20
                  ? "medium"
                  : "low",
            signal: `Burnout risk at ${safeRetention.burnoutRiskPct.toFixed(1)}%.`
          }
        ].slice(0, maxInsights)
      },
      domain: "executivos",
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
      summary: fallbackApplied
        ? "CulturePulse generated under fallback mode due to tool failures."
        : "CulturePulse generated with complete culture intelligence coverage."
    });

    this.lastMetrics = {
      ...output.observability.metrics
    };
    return output;
  }

  private resolveToolIds(toolIds: string[]): CultureToolId[] {
    const mapped = toolIds
      .map((toolId) => normalizeCultureToolId(toolId))
      .filter((toolId): toolId is CultureToolId => toolId !== null);
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
          DEFAULT_CULTUREPULSE_CONTRACT
        );
        return {
          contract: merged,
          source: classifyContractSource(contractPath)
        };
      } catch {
        continue;
      }
    }

    return {
      contract: DEFAULT_CULTUREPULSE_CONTRACT,
      source: "default"
    };
  }
}
