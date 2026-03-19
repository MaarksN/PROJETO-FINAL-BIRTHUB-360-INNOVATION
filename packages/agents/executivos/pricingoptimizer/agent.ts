// [SOURCE] BirthHub360_Agentes_Parallel_Plan - PricingOptimizer
import { access, readFile } from "node:fs/promises";
import path from "node:path";

import {
  DEFAULT_PRICINGOPTIMIZER_CONTRACT,
  type PricingEvent,
  type PricingFailureMode,
  type PricingMetrics,
  type PricingOptimizerContract,
  PricingOptimizerContractSchema,
  type PricingOptimizerInput,
  PricingOptimizerInputSchema,
  type PricingOptimizerOutput,
  PricingOptimizerOutputSchema
} from "./schemas.js";
import {
  DiscountLeakSnapshotSchema,
  PriceElasticitySnapshotSchema,
  PRICINGOPTIMIZER_TOOL_IDS,
  PricingToolInputSchema,
  type PricingOptimizerToolAdapters,
  type PricingToolId,
  type PricingToolInput,
  WinRateSnapshotSchema,
  createDefaultPricingOptimizerToolAdapters,
  normalizePricingToolId
} from "./tools.js";

const DEFAULT_AUDIT_CONTRACT_PATH = path.resolve(
  process.cwd(),
  "audit",
  "pending_review",
  "ciclo1_pricingoptimizer",
  "contract.yaml"
);
const DEFAULT_AUDIT_CONTRACT_PATH_FROM_PACKAGE = path.resolve(
  process.cwd(),
  "..",
  "..",
  "audit",
  "pending_review",
  "ciclo1_pricingoptimizer",
  "contract.yaml"
);
const DEFAULT_PACKAGE_CONTRACT_PATH = path.resolve(
  process.cwd(),
  "packages",
  "agents",
  "executives",
  "PricingOptimizer",
  "contract.yaml"
);
const DEFAULT_PACKAGE_CONTRACT_PATH_FROM_PACKAGE = path.resolve(
  process.cwd(),
  "executives",
  "PricingOptimizer",
  "contract.yaml"
);
const DEFAULT_CONTRACT_PATHS = [
  DEFAULT_AUDIT_CONTRACT_PATH,
  DEFAULT_AUDIT_CONTRACT_PATH_FROM_PACKAGE,
  DEFAULT_PACKAGE_CONTRACT_PATH,
  DEFAULT_PACKAGE_CONTRACT_PATH_FROM_PACKAGE
] as const;

interface PricingOptimizerAgentOptions {
  contractPath?: string;
  now?: () => Date;
  sleep?: (delayMs: number) => Promise<void>;
  toolAdapters?: PricingOptimizerToolAdapters;
}

interface LoadedContract {
  contract: PricingOptimizerContract;
  source: "audit_file" | "custom_file" | "default" | "file" | "package_file";
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

function toFailureMode(rawValue: string | undefined): PricingFailureMode | undefined {
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
    return DEFAULT_PRICINGOPTIMIZER_CONTRACT.retry.maxAttempts;
  }
  return Math.min(3, Math.max(1, Math.trunc(value)));
}

function classifyContractSource(contractPath: string): LoadedContract["source"] {
  const normalized = path.normalize(contractPath).toLowerCase();
  if (
    normalized.endsWith(
      path
        .join("audit", "pending_review", "ciclo1_pricingoptimizer", "contract.yaml")
        .toLowerCase()
    )
  ) {
    return "audit_file";
  }
  if (
    normalized.endsWith(
      path.join("executives", "PricingOptimizer", "contract.yaml").toLowerCase()
    )
  ) {
    return "file";
  }
  return "custom_file";
}

function parseContractOverridesFromObject(
  value: Record<string, unknown>
): Partial<PricingOptimizerContract> {
  const overrides: Partial<PricingOptimizerContract> = {};

  const toolIds =
    toStringArray(value.toolIds) ??
    toStringArray(value.tools) ??
    toStringArray(value.required_tools);
  if (toolIds) {
    overrides.toolIds = toolIds;
  }

  const retry = toRecord(value.retry);
  if (retry) {
    const retryOverride: Partial<PricingOptimizerContract["retry"]> = {};
    if (typeof retry.maxAttempts === "number") {
      retryOverride.maxAttempts = clampMaxAttempts(retry.maxAttempts);
    }
    if (typeof retry.baseDelayMs === "number") {
      retryOverride.baseDelayMs = retry.baseDelayMs;
    }
    if (Object.keys(retryOverride).length > 0) {
      overrides.retry = retryOverride as PricingOptimizerContract["retry"];
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
    const retryOverride: Partial<PricingOptimizerContract["retry"]> = {};

    if (toolUnavailable && typeof toolUnavailable.retry_attempts === "number") {
      retryOverride.maxAttempts = clampMaxAttempts(toolUnavailable.retry_attempts);
    }
    if (toolUnavailable && typeof toolUnavailable.base_delay_ms === "number") {
      retryOverride.baseDelayMs = toolUnavailable.base_delay_ms;
    }
    if (Object.keys(retryOverride).length > 0) {
      overrides.retry = {
        ...DEFAULT_PRICINGOPTIMIZER_CONTRACT.retry,
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
        (entry): entry is PricingOptimizerContract["observability"]["events"][number] =>
          DEFAULT_PRICINGOPTIMIZER_CONTRACT.observability.events.includes(
            entry as PricingOptimizerContract["observability"]["events"][number]
          )
      );
      const filteredMetrics = metrics?.filter(
        (entry): entry is PricingOptimizerContract["observability"]["metrics"][number] =>
          DEFAULT_PRICINGOPTIMIZER_CONTRACT.observability.metrics.includes(
            entry as PricingOptimizerContract["observability"]["metrics"][number]
          )
      );
      overrides.observability = {
        events:
          filteredEvents && filteredEvents.length > 0
            ? filteredEvents
            : DEFAULT_PRICINGOPTIMIZER_CONTRACT.observability.events,
        metrics:
          filteredMetrics && filteredMetrics.length > 0
            ? filteredMetrics
            : DEFAULT_PRICINGOPTIMIZER_CONTRACT.observability.metrics
      };
    }
  }

  return overrides;
}

function parseContractOverrides(rawText: string): Partial<PricingOptimizerContract> {
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

  const overrides: Partial<PricingOptimizerContract> = {};
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
      ...DEFAULT_PRICINGOPTIMIZER_CONTRACT.retry,
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
      (entry): entry is PricingOptimizerContract["observability"]["events"][number] =>
        DEFAULT_PRICINGOPTIMIZER_CONTRACT.observability.events.includes(
          entry as PricingOptimizerContract["observability"]["events"][number]
        )
    );
    const filteredMetrics = metrics?.filter(
      (entry): entry is PricingOptimizerContract["observability"]["metrics"][number] =>
        DEFAULT_PRICINGOPTIMIZER_CONTRACT.observability.metrics.includes(
          entry as PricingOptimizerContract["observability"]["metrics"][number]
        )
    );
    overrides.observability = {
      events:
        filteredEvents && filteredEvents.length > 0
          ? filteredEvents
          : DEFAULT_PRICINGOPTIMIZER_CONTRACT.observability.events,
      metrics:
        filteredMetrics && filteredMetrics.length > 0
          ? filteredMetrics
          : DEFAULT_PRICINGOPTIMIZER_CONTRACT.observability.metrics
    };
  }

  return overrides;
}

function mergeContract(
  overrides: Partial<PricingOptimizerContract>,
  fallback: PricingOptimizerContract
): PricingOptimizerContract {
  return PricingOptimizerContractSchema.parse({
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

function toPriority(score: number): "critical" | "high" | "low" | "medium" {
  if (score >= 80) {
    return "critical";
  }
  if (score >= 60) {
    return "high";
  }
  if (score >= 35) {
    return "medium";
  }
  return "low";
}

function toConfidence(score: number): "high" | "low" | "medium" {
  if (score >= 75) {
    return "high";
  }
  if (score >= 45) {
    return "medium";
  }
  return "low";
}

export class PricingOptimizerAgent {
  private readonly contractPaths: string[];

  private readonly now: () => Date;

  private readonly sleepFn: (delayMs: number) => Promise<void>;

  private readonly toolAdapters: PricingOptimizerToolAdapters;

  private lastMetrics: PricingMetrics = {
    durationMs: 0,
    retries: 0,
    toolCalls: 0,
    toolFailures: 0
  };

  constructor(options: PricingOptimizerAgentOptions = {}) {
    this.contractPaths = options.contractPath
      ? [options.contractPath]
      : [...DEFAULT_CONTRACT_PATHS];
    this.now = options.now ?? (() => new Date());
    this.sleepFn = options.sleep ?? sleep;
    this.toolAdapters =
      options.toolAdapters ?? createDefaultPricingOptimizerToolAdapters();
  }

  getMetricsSnapshot(): PricingMetrics {
    return {
      ...this.lastMetrics
    };
  }

  async run(input: PricingOptimizerInput): Promise<PricingOptimizerOutput> {
    const parsedInput = PricingOptimizerInputSchema.parse(input);
    const startedAt = this.now();
    const events: PricingEvent[] = [];
    const metrics: PricingMetrics = {
      durationMs: 0,
      retries: 0,
      toolCalls: 0,
      toolFailures: 0
    };
    const fallbackReasons: string[] = [];

    const emitEvent = (
      event: Omit<PricingEvent, "timestamp"> & { timestamp?: string }
    ): void => {
      const normalized: PricingEvent = {
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
        toolId: "pricingoptimizer"
      },
      level: "info",
      message: "PricingOptimizer request accepted.",
      name: "pricingoptimizer.request.received"
    });

    const loadedContract = await this.loadContract();
    emitEvent({
      details: {
        source: loadedContract.source
      },
      level: "info",
      message: `Contract loaded from ${loadedContract.source}.`,
      name: "pricingoptimizer.contract.loaded"
    });

    const mappedTools = this.resolveToolIds(loadedContract.contract.toolIds);
    const effectiveTools =
      mappedTools.length > 0 ? mappedTools : [...PRICINGOPTIMIZER_TOOL_IDS];

    const runWithRetry = async <T>(
      toolId: PricingToolId,
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
          name: "pricingoptimizer.tool.call.started"
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
            name: "pricingoptimizer.tool.call.succeeded"
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
            name: "pricingoptimizer.tool.call.failed"
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
            name: "pricingoptimizer.retry.scheduled"
          });
          await this.sleepFn(delay);
        }
      }

      metrics.toolFailures += 1;
      throw lastError ?? new Error(`${toolId} failed with no details.`);
    };

    const toolInput: PricingToolInput = PricingToolInputSchema.parse({
      endDate: parsedInput.window.endDate,
      segments: parsedInput.segments,
      startDate: parsedInput.window.startDate,
      targetGrossMarginPct: parsedInput.targetGrossMarginPct,
      tenantId: parsedInput.tenantId
    });

    let elasticity = null;
    let discountLeak = null;
    let winRate = null;

    if (effectiveTools.includes("price-elasticity-model")) {
      try {
        elasticity = PriceElasticitySnapshotSchema.parse(
          await runWithRetry("price-elasticity-model", () =>
            this.toolAdapters.fetchPriceElasticity(toolInput)
          )
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "price-elasticity-model failed.";
        fallbackReasons.push(`price-elasticity-model: ${message}`);
      }
    }

    if (effectiveTools.includes("discount-leak-feed")) {
      try {
        discountLeak = DiscountLeakSnapshotSchema.parse(
          await runWithRetry("discount-leak-feed", () =>
            this.toolAdapters.fetchDiscountLeak(toolInput)
          )
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "discount-leak-feed failed.";
        fallbackReasons.push(`discount-leak-feed: ${message}`);
      }
    }

    if (effectiveTools.includes("win-rate-feed")) {
      try {
        winRate = WinRateSnapshotSchema.parse(
          await runWithRetry("win-rate-feed", () =>
            this.toolAdapters.fetchWinRateImpact(toolInput)
          )
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "win-rate-feed failed.";
        fallbackReasons.push(`win-rate-feed: ${message}`);
      }
    }

    const fallbackApplied = fallbackReasons.length > 0;
    const fallbackMode: PricingFailureMode | null = fallbackApplied
      ? loadedContract.contract.failureMode
      : null;

    if (fallbackApplied) {
      emitEvent({
        details: {
          fallbackMode: fallbackMode ?? undefined,
          source: "failure_behavior"
        },
        level: "warning",
        message: "Fallback behavior applied for PricingOptimizer output.",
        name: "pricingoptimizer.fallback.applied"
      });
    }

    const safeElasticity = elasticity ?? {
      confidencePct: 0,
      elasticityIndex: 0,
      optimalDeltaPct: 0
    };
    const safeDiscount = discountLeak ?? {
      averageDiscountPct: 0,
      leakageDriver: "discount signal unavailable",
      unauthorizedDiscountPct: 0
    };
    const safeWinRate = winRate ?? {
      baselineWinRatePct: 0,
      projectedWinRatePct: 0,
      sensitivityPct: 0
    };

    const expectedGrossMarginPct = Number(
      Math.max(
        0,
        Math.min(
          100,
          parsedInput.targetGrossMarginPct +
            safeElasticity.optimalDeltaPct * 0.35 -
            safeDiscount.unauthorizedDiscountPct * 0.42
        )
      ).toFixed(2)
    );

    const status: PricingOptimizerOutput["status"] =
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
      message: "PricingOptimizer response generated.",
      name: "pricingoptimizer.response.generated"
    });

    const output = PricingOptimizerOutputSchema.parse({
      agent: "PricingOptimizer",
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
      pricingBrief: {
        actions: [
          {
            owner: "VP Revenue",
            priority: toPriority(100 - expectedGrossMarginPct + safeDiscount.averageDiscountPct),
            recommendation:
              "Raise approval threshold for non-standard discounts and route outliers to deal desk.",
            targetDate: addDays(parsedInput.window.endDate, 5)
          },
          {
            owner: "Pricing PM",
            priority: toPriority(safeElasticity.confidencePct),
            recommendation:
              "Run controlled A/B test on list price delta by segment before broad rollout.",
            targetDate: addDays(parsedInput.window.endDate, 10)
          },
          {
            owner: "Sales Ops",
            priority: toPriority(safeWinRate.sensitivityPct + safeDiscount.unauthorizedDiscountPct),
            recommendation:
              "Introduce guardrails that tie discount bands to expected win-rate lift.",
            targetDate: addDays(parsedInput.window.endDate, 14)
          }
        ].slice(0, parsedInput.constraints.maxActions),
        expectedGrossMarginPct,
        headline: `Recommended list price delta ${safeElasticity.optimalDeltaPct.toFixed(
          2
        )}% with projected gross margin ${expectedGrossMarginPct.toFixed(2)}%.`,
        recommendedListPriceDeltaPct: safeElasticity.optimalDeltaPct,
        riskSignals: [
          {
            mitigation:
              "Enforce exception policy by region and account tier with daily leakage alerts.",
            severity: toPriority(
              safeDiscount.unauthorizedDiscountPct + safeDiscount.averageDiscountPct
            ),
            signal: safeDiscount.leakageDriver
          },
          {
            mitigation:
              "Calibrate packaging and value messaging where win-rate sensitivity is above threshold.",
            severity: toPriority(safeWinRate.sensitivityPct + (100 - safeElasticity.confidencePct)),
            signal: `Projected win rate ${safeWinRate.projectedWinRatePct.toFixed(2)}% under proposed pricing.`
          }
        ],
        signals: [
          {
            confidence: toConfidence(safeElasticity.confidencePct),
            interpretation:
              safeElasticity.elasticityIndex > 1.3
                ? "Demand is elastic and requires cautious price increases."
                : "Demand is relatively inelastic, enabling margin-focused moves.",
            metric: "Elasticity Index",
            value: safeElasticity.elasticityIndex
          },
          {
            confidence: toConfidence(100 - safeDiscount.unauthorizedDiscountPct),
            interpretation:
              safeDiscount.unauthorizedDiscountPct > 10
                ? "Unauthorized discount leakage is materially impacting margin capture."
                : "Discount leakage is within acceptable control range.",
            metric: "Unauthorized Discount %",
            value: safeDiscount.unauthorizedDiscountPct
          },
          {
            confidence: toConfidence(100 - safeWinRate.sensitivityPct),
            interpretation: "Win-rate sensitivity estimates conversion risk to list price changes.",
            metric: "Win Rate Sensitivity %",
            value: safeWinRate.sensitivityPct
          }
        ]
      },
      status,
      summary: fallbackApplied
        ? "PricingOptimizer generated under fallback mode due to tool failures."
        : "PricingOptimizer generated with complete pricing and win-rate signal coverage."
    });

    this.lastMetrics = {
      ...output.observability.metrics
    };
    return output;
  }

  private resolveToolIds(toolIds: string[]): PricingToolId[] {
    const mapped = toolIds
      .map((toolId) => normalizePricingToolId(toolId))
      .filter((toolId): toolId is PricingToolId => toolId !== null);
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
          DEFAULT_PRICINGOPTIMIZER_CONTRACT
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
      contract: DEFAULT_PRICINGOPTIMIZER_CONTRACT,
      source: "default"
    };
  }
}
