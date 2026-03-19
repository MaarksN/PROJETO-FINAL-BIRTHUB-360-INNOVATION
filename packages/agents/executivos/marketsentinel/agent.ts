// [SOURCE] BirthHub360_Agentes_Parallel_Plan - MarketSentinel
import { access, readFile } from "node:fs/promises";
import path from "node:path";

import {
  DEFAULT_MARKETSENTINEL_CONTRACT,
  type MarketEvent,
  type MarketFailureMode,
  type MarketMetrics,
  type MarketSentinelContract,
  MarketSentinelContractSchema,
  type MarketSentinelInput,
  MarketSentinelInputSchema,
  type MarketSentinelOutput,
  MarketSentinelOutputSchema
} from "./schemas.js";
import {
  CompetitorWatchSnapshotSchema,
  MARKETSENTINEL_TOOL_IDS,
  type MarketSentinelToolAdapters,
  type MarketToolId,
  type MarketToolInput,
  MacroSignalSnapshotSchema,
  SentimentStreamSnapshotSchema,
  createDefaultMarketSentinelToolAdapters,
  normalizeMarketToolId
} from "./tools.js";

const DEFAULT_CONTRACT_PATH = path.resolve(
  process.cwd(),
  "audit",
  "pending_review",
  "ciclo1_marketsentinel",
  "contract.yaml"
);

interface MarketSentinelAgentOptions {
  contractPath?: string;
  now?: () => Date;
  sleep?: (delayMs: number) => Promise<void>;
  toolAdapters?: MarketSentinelToolAdapters;
}

interface LoadedContract {
  contract: MarketSentinelContract;
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

function toFailureMode(rawValue: string | undefined): MarketFailureMode | undefined {
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

function parseContractOverridesFromObject(
  value: Record<string, unknown>
): Partial<MarketSentinelContract> {
  const overrides: Partial<MarketSentinelContract> = {};

  const toolIds =
    toStringArray(value.toolIds) ??
    toStringArray(value.tools) ??
    toStringArray(value.required_tools);
  if (toolIds) {
    overrides.toolIds = toolIds;
  }

  const retry = toRecord(value.retry);
  if (retry) {
    const retryOverride: Partial<MarketSentinelContract["retry"]> = {};
    if (typeof retry.maxAttempts === "number") {
      retryOverride.maxAttempts = retry.maxAttempts;
    }
    if (typeof retry.baseDelayMs === "number") {
      retryOverride.baseDelayMs = retry.baseDelayMs;
    }
    if (Object.keys(retryOverride).length > 0) {
      overrides.retry = retryOverride as MarketSentinelContract["retry"];
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
    const retryOverride: Partial<MarketSentinelContract["retry"]> = {};

    if (toolUnavailable && typeof toolUnavailable.retry_attempts === "number") {
      retryOverride.maxAttempts = toolUnavailable.retry_attempts;
    }
    if (toolUnavailable && typeof toolUnavailable.base_delay_ms === "number") {
      retryOverride.baseDelayMs = toolUnavailable.base_delay_ms;
    }
    if (Object.keys(retryOverride).length > 0) {
      overrides.retry = {
        ...DEFAULT_MARKETSENTINEL_CONTRACT.retry,
        ...retryOverride
      };
    }
    if (exhausted && exhausted.notify_human === true) {
      overrides.failureMode = "human_handoff";
    }
  }

  const observability = toRecord(value.observability);
  if (observability) {
    const events = toStringArray(observability.events);
    const metrics = toStringArray(observability.metrics);
    if (events || metrics) {
      overrides.observability = {
        events:
          events?.filter((entry): entry is MarketSentinelContract["observability"]["events"][number] =>
            DEFAULT_MARKETSENTINEL_CONTRACT.observability.events.includes(
              entry as MarketSentinelContract["observability"]["events"][number]
            )
          ) ?? DEFAULT_MARKETSENTINEL_CONTRACT.observability.events,
        metrics:
          metrics?.filter((entry): entry is MarketSentinelContract["observability"]["metrics"][number] =>
            DEFAULT_MARKETSENTINEL_CONTRACT.observability.metrics.includes(
              entry as MarketSentinelContract["observability"]["metrics"][number]
            )
          ) ?? DEFAULT_MARKETSENTINEL_CONTRACT.observability.metrics
      };
    }
  }

  return overrides;
}

function parseContractOverrides(rawText: string): Partial<MarketSentinelContract> {
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

  const overrides: Partial<MarketSentinelContract> = {};
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
      ...DEFAULT_MARKETSENTINEL_CONTRACT.retry,
      ...(maxAttempts !== undefined ? { maxAttempts } : {}),
      ...(baseDelayMs !== undefined ? { baseDelayMs } : {})
    };
  }

  const modeMatch = rawText.match(
    /(?:failureMode|failure_mode|fallback_mode|mode)\s*:\s*["']?([a-zA-Z_-]+)["']?/i
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

  const events = extractYamlArray(rawText, ["events"]);
  const metrics = extractYamlArray(rawText, ["metrics"]);
  if (events || metrics) {
    overrides.observability = {
      events:
        events?.filter(
          (entry): entry is MarketSentinelContract["observability"]["events"][number] =>
            DEFAULT_MARKETSENTINEL_CONTRACT.observability.events.includes(
              entry as MarketSentinelContract["observability"]["events"][number]
            )
        ) ?? DEFAULT_MARKETSENTINEL_CONTRACT.observability.events,
      metrics:
        metrics?.filter(
          (entry): entry is MarketSentinelContract["observability"]["metrics"][number] =>
            DEFAULT_MARKETSENTINEL_CONTRACT.observability.metrics.includes(
              entry as MarketSentinelContract["observability"]["metrics"][number]
            )
        ) ?? DEFAULT_MARKETSENTINEL_CONTRACT.observability.metrics
    };
  }

  return overrides;
}

function mergeContract(
  overrides: Partial<MarketSentinelContract>,
  fallback: MarketSentinelContract
): MarketSentinelContract {
  return MarketSentinelContractSchema.parse({
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

export class MarketSentinelAgent {
  private readonly contractPath: string;

  private readonly now: () => Date;

  private readonly sleepFn: (delayMs: number) => Promise<void>;

  private readonly toolAdapters: MarketSentinelToolAdapters;

  private lastMetrics: MarketMetrics = {
    durationMs: 0,
    retries: 0,
    toolCalls: 0,
    toolFailures: 0
  };

  constructor(options: MarketSentinelAgentOptions = {}) {
    this.contractPath = options.contractPath ?? DEFAULT_CONTRACT_PATH;
    this.now = options.now ?? (() => new Date());
    this.sleepFn = options.sleep ?? sleep;
    this.toolAdapters = options.toolAdapters ?? createDefaultMarketSentinelToolAdapters();
  }

  getMetricsSnapshot(): MarketMetrics {
    return {
      ...this.lastMetrics
    };
  }

  async run(input: MarketSentinelInput): Promise<MarketSentinelOutput> {
    const parsedInput = MarketSentinelInputSchema.parse(input);
    const startedAt = this.now();
    const events: MarketEvent[] = [];
    const metrics: MarketMetrics = {
      durationMs: 0,
      retries: 0,
      toolCalls: 0,
      toolFailures: 0
    };
    const fallbackReasons: string[] = [];

    const emitEvent = (
      event: Omit<MarketEvent, "timestamp"> & { timestamp?: string }
    ): void => {
      const normalized: MarketEvent = {
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
        toolId: "marketsentinel"
      },
      level: "info",
      message: "MarketSentinel request accepted.",
      name: "marketsentinel.request.received"
    });

    const loadedContract = await this.loadContract();
    emitEvent({
      details: {
        source: loadedContract.source
      },
      level: "info",
      message: `Contract loaded from ${loadedContract.source}.`,
      name: "marketsentinel.contract.loaded"
    });

    const mappedTools = this.resolveToolIds(loadedContract.contract.toolIds);
    const effectiveTools =
      mappedTools.length > 0 ? mappedTools : [...MARKETSENTINEL_TOOL_IDS];

    const runWithRetry = async <T>(
      toolId: MarketToolId,
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
          name: "marketsentinel.tool.call.started"
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
            name: "marketsentinel.tool.call.succeeded"
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
            name: "marketsentinel.tool.call.failed"
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
            name: "marketsentinel.retry.scheduled"
          });
          await this.sleepFn(delay);
        }
      }

      metrics.toolFailures += 1;
      throw lastError ?? new Error(`${toolId} failed with no details.`);
    };

    const toolInput: MarketToolInput = {
      endDate: parsedInput.window.endDate,
      scope: parsedInput.scope,
      startDate: parsedInput.window.startDate,
      tenantId: parsedInput.tenantId
    };

    let macro = null;
    let competitors = null;
    let sentiment = null;

    if (effectiveTools.includes("macro-signal-feed")) {
      try {
        macro = MacroSignalSnapshotSchema.parse(
          await runWithRetry("macro-signal-feed", () =>
            this.toolAdapters.fetchMacroSignalFeed(toolInput)
          )
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "macro-signal-feed failed.";
        fallbackReasons.push(`macro-signal-feed: ${message}`);
      }
    }

    if (effectiveTools.includes("competitor-watch")) {
      try {
        competitors = CompetitorWatchSnapshotSchema.parse(
          await runWithRetry("competitor-watch", () =>
            this.toolAdapters.fetchCompetitorWatch(toolInput)
          )
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "competitor-watch failed.";
        fallbackReasons.push(`competitor-watch: ${message}`);
      }
    }

    if (effectiveTools.includes("sentiment-stream")) {
      try {
        sentiment = SentimentStreamSnapshotSchema.parse(
          await runWithRetry("sentiment-stream", () =>
            this.toolAdapters.fetchSentimentStream(toolInput)
          )
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "sentiment-stream failed.";
        fallbackReasons.push(`sentiment-stream: ${message}`);
      }
    }

    const fallbackApplied = fallbackReasons.length > 0;
    const fallbackMode: MarketFailureMode | null = fallbackApplied
      ? loadedContract.contract.failureMode
      : null;

    if (fallbackApplied) {
      emitEvent({
        details: {
          fallbackMode: fallbackMode ?? undefined,
          source: "failure_behavior"
        },
        level: "warning",
        message: "Fallback behavior applied for MarketSentinel output.",
        name: "marketsentinel.fallback.applied"
      });
    }

    const safeMacro = macro ?? {
      demandMomentum: 0,
      inflationPressure: 0,
      liquidityIndex: 0
    };
    const safeCompetitors = competitors ?? {
      leadingMove: "competitor data unavailable",
      pricingAggressiveness: 0,
      releaseVelocity: 0
    };
    const safeSentiment = sentiment ?? {
      negativeMentionsPct: 0,
      positiveMentionsPct: 0,
      topicShift: "sentiment feed unavailable"
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

    const status: MarketSentinelOutput["status"] =
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
      message: "MarketSentinel response generated.",
      name: "marketsentinel.response.generated"
    });

    const output = MarketSentinelOutputSchema.parse({
      agent: "MarketSentinel",
      domain: "executivos",
      fallback: {
        applied: fallbackApplied,
        mode: fallbackMode,
        reasons: fallbackReasons
      },
      generatedAt: this.now().toISOString(),
      marketBrief: {
        competitorMoves: [
          {
            impact:
              safeCompetitors.pricingAggressiveness > 70
                ? "high"
                : safeCompetitors.pricingAggressiveness > 45
                  ? "medium"
                  : "low",
            move: safeCompetitors.leadingMove,
            response:
              safeCompetitors.pricingAggressiveness > 60
                ? "Defend premium position with value proof and expansion bundles."
                : "Keep win-loss tracking and avoid unnecessary discounting."
          }
        ],
        demandIndicators: [
          {
            indicator: "Demand Momentum",
            interpretation:
              safeMacro.demandMomentum > 0
                ? "Demand shows positive trajectory."
                : "Demand softening requires pipeline protection.",
            value: safeMacro.demandMomentum
          },
          {
            indicator: "Market Sentiment Delta",
            interpretation: safeSentiment.topicShift,
            value: safeSentiment.positiveMentionsPct - safeSentiment.negativeMentionsPct
          }
        ],
        headline: `Scope ${parsedInput.scope}: demand momentum ${safeMacro.demandMomentum.toFixed(2)} and competitor pressure ${safeCompetitors.pricingAggressiveness.toFixed(
          2
        )}.`,
        nextActions: [
          {
            owner: "CRO",
            priority:
              safeMacro.demandMomentum < 0 ? "high" : "medium",
            recommendation:
              safeMacro.demandMomentum < 0
                ? "Launch verticalized campaign defense for at-risk segments."
                : "Accelerate high-conversion segment expansion while momentum holds.",
            targetDate: addDays(parsedInput.window.endDate, 7)
          },
          {
            owner: "CMO",
            priority:
              safeSentiment.negativeMentionsPct > 25 ? "high" : "medium",
            recommendation:
              safeSentiment.negativeMentionsPct > 25
                ? "Deploy sentiment recovery plan with executive messaging cadence."
                : "Maintain social proof amplification on positive signals.",
            targetDate: addDays(parsedInput.window.endDate, 10)
          }
        ],
        trendSignals: [
          {
            confidence:
              Math.abs(safeMacro.demandMomentum) > 20 ? "high" : "medium",
            signal: "Demand momentum signal",
            trend: trendDirection(safeMacro.demandMomentum)
          },
          {
            confidence:
              safeCompetitors.releaseVelocity > 80 ? "high" : "medium",
            signal: "Competitor release velocity",
            trend: trendDirection(safeCompetitors.releaseVelocity - 60)
          }
        ]
      },
      observability: {
        events,
        metrics
      },
      status,
      summary: fallbackApplied
        ? "MarketSentinel generated under fallback mode due to tool failures."
        : "MarketSentinel generated with complete market signal coverage."
    });

    this.lastMetrics = {
      ...output.observability.metrics
    };
    return output;
  }

  private resolveToolIds(toolIds: string[]): MarketToolId[] {
    const mapped = toolIds
      .map((toolId) => normalizeMarketToolId(toolId))
      .filter((toolId): toolId is MarketToolId => toolId !== null);
    return Array.from(new Set(mapped));
  }

  private async loadContract(): Promise<LoadedContract> {
    try {
      await access(this.contractPath);
    } catch {
      return {
        contract: DEFAULT_MARKETSENTINEL_CONTRACT,
        source: "default"
      };
    }

    try {
      const content = await readFile(this.contractPath, "utf8");
      const merged = mergeContract(
        parseContractOverrides(content),
        DEFAULT_MARKETSENTINEL_CONTRACT
      );
      return {
        contract: merged,
        source: "file"
      };
    } catch {
      return {
        contract: DEFAULT_MARKETSENTINEL_CONTRACT,
        source: "default"
      };
    }
  }
}

