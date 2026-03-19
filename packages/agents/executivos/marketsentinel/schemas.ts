// [SOURCE] BirthHub360_Agentes_Parallel_Plan - MarketSentinel
import { z } from "zod";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const MarketScopeSchema = z.enum([
  "global",
  "latam",
  "north_america",
  "europe",
  "custom"
]);
export type MarketScope = z.infer<typeof MarketScopeSchema>;

export const MarketSectionSchema = z.enum([
  "macro_trends",
  "competitors",
  "demand_signals",
  "customer_sentiment",
  "regulatory_alerts"
]);
export type MarketSection = z.infer<typeof MarketSectionSchema>;

export const MarketSentinelInputSchema = z
  .object({
    requestId: z.string().trim().min(1),
    scope: MarketScopeSchema,
    sections: z.array(MarketSectionSchema).min(1),
    tenantId: z.string().trim().min(1),
    window: z
      .object({
        endDate: isoDateSchema,
        startDate: isoDateSchema
      })
      .strict()
  })
  .strict();
export type MarketSentinelInput = z.infer<typeof MarketSentinelInputSchema>;

export const MarketFailureModeSchema = z.enum([
  "degraded_report",
  "human_handoff",
  "hard_fail"
]);
export type MarketFailureMode = z.infer<typeof MarketFailureModeSchema>;

export const MarketEventNameSchema = z.enum([
  "marketsentinel.request.received",
  "marketsentinel.contract.loaded",
  "marketsentinel.tool.call.started",
  "marketsentinel.tool.call.succeeded",
  "marketsentinel.tool.call.failed",
  "marketsentinel.retry.scheduled",
  "marketsentinel.fallback.applied",
  "marketsentinel.response.generated"
]);
export type MarketEventName = z.infer<typeof MarketEventNameSchema>;

export const MarketEventSchema = z
  .object({
    details: z
      .object({
        attempt: z.number().int().min(1).optional(),
        errorCode: z.string().min(1).optional(),
        fallbackMode: MarketFailureModeSchema.optional(),
        maxAttempts: z.number().int().min(1).optional(),
        source: z.string().min(1).optional(),
        toolId: z.string().min(1).optional()
      })
      .strict(),
    level: z.enum(["info", "warning", "error"]),
    message: z.string().min(1),
    name: MarketEventNameSchema,
    timestamp: z.string().datetime()
  })
  .strict();
export type MarketEvent = z.infer<typeof MarketEventSchema>;

export const MarketMetricsSchema = z
  .object({
    durationMs: z.number().nonnegative(),
    retries: z.number().int().nonnegative(),
    toolCalls: z.number().int().nonnegative(),
    toolFailures: z.number().int().nonnegative()
  })
  .strict();
export type MarketMetrics = z.infer<typeof MarketMetricsSchema>;

export const MarketSentinelContractSchema = z
  .object({
    failureMode: MarketFailureModeSchema,
    observability: z
      .object({
        events: z.array(MarketEventNameSchema).min(1),
        metrics: z
          .array(
            z.enum(["duration_ms", "tool_calls", "tool_failures", "retries"])
          )
          .min(1)
      })
      .strict(),
    retry: z
      .object({
        baseDelayMs: z.number().int().min(1).max(30_000),
        maxAttempts: z.number().int().min(1).max(3)
      })
      .strict(),
    toolIds: z.array(z.string().trim().min(1)).min(1)
  })
  .strict();
export type MarketSentinelContract = z.infer<typeof MarketSentinelContractSchema>;

export const DEFAULT_MARKETSENTINEL_CONTRACT: MarketSentinelContract = {
  failureMode: "degraded_report",
  observability: {
    events: [
      "marketsentinel.request.received",
      "marketsentinel.contract.loaded",
      "marketsentinel.tool.call.started",
      "marketsentinel.tool.call.succeeded",
      "marketsentinel.tool.call.failed",
      "marketsentinel.retry.scheduled",
      "marketsentinel.fallback.applied",
      "marketsentinel.response.generated"
    ],
    metrics: ["duration_ms", "tool_calls", "tool_failures", "retries"]
  },
  retry: {
    baseDelayMs: 500,
    maxAttempts: 3
  },
  toolIds: ["macro-signal-feed", "competitor-watch", "sentiment-stream"]
};

const PrioritySchema = z.enum(["critical", "high", "medium", "low"]);

export const TrendSignalSchema = z
  .object({
    confidence: z.enum(["low", "medium", "high"]),
    signal: z.string().min(1),
    trend: z.enum(["down", "stable", "up"])
  })
  .strict();
export type TrendSignal = z.infer<typeof TrendSignalSchema>;

export const CompetitorMoveSchema = z
  .object({
    impact: PrioritySchema,
    move: z.string().min(1),
    response: z.string().min(1)
  })
  .strict();
export type CompetitorMove = z.infer<typeof CompetitorMoveSchema>;

export const DemandIndicatorSchema = z
  .object({
    indicator: z.string().min(1),
    interpretation: z.string().min(1),
    value: z.number()
  })
  .strict();
export type DemandIndicator = z.infer<typeof DemandIndicatorSchema>;

export const MarketRecommendationSchema = z
  .object({
    owner: z.string().min(1),
    priority: PrioritySchema,
    recommendation: z.string().min(1),
    targetDate: isoDateSchema
  })
  .strict();
export type MarketRecommendation = z.infer<typeof MarketRecommendationSchema>;

export const MarketSentinelOutputSchema = z
  .object({
    agent: z.literal("MarketSentinel"),
    domain: z.literal("executivos"),
    fallback: z
      .object({
        applied: z.boolean(),
        mode: MarketFailureModeSchema.nullable(),
        reasons: z.array(z.string().min(1))
      })
      .strict(),
    generatedAt: z.string().datetime(),
    marketBrief: z
      .object({
        competitorMoves: z.array(CompetitorMoveSchema),
        demandIndicators: z.array(DemandIndicatorSchema),
        headline: z.string().min(1),
        nextActions: z.array(MarketRecommendationSchema),
        trendSignals: z.array(TrendSignalSchema)
      })
      .strict(),
    observability: z
      .object({
        events: z.array(MarketEventSchema),
        metrics: MarketMetricsSchema
      })
      .strict(),
    status: z.enum(["error", "fallback", "success"]),
    summary: z.string().min(1)
  })
  .strict();
export type MarketSentinelOutput = z.infer<typeof MarketSentinelOutputSchema>;

