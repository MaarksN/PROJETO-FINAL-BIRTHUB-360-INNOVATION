// [SOURCE] BirthHub360_Agentes_Parallel_Plan - PricingOptimizer
import { z } from "zod";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const PricingSegmentSchema = z.enum([
  "enterprise",
  "mid_market",
  "self_serve",
  "smb",
  "strategic_accounts"
]);
export type PricingSegment = z.infer<typeof PricingSegmentSchema>;

export const PricingSectionSchema = z.enum([
  "discount_leakage",
  "elasticity",
  "margin_guardrails",
  "packaging_recommendations",
  "win_rate_impact"
]);
export type PricingSection = z.infer<typeof PricingSectionSchema>;

export const PricingOptimizerInputSchema = z
  .object({
    constraints: z
      .object({
        currency: z.string().trim().length(3),
        language: z.enum(["pt-BR", "en-US"]),
        maxActions: z.number().int().min(1).max(12)
      })
      .strict(),
    requestId: z.string().trim().min(1),
    sections: z.array(PricingSectionSchema).min(1),
    segments: z.array(PricingSegmentSchema).min(1),
    targetGrossMarginPct: z.number().min(1).max(100),
    tenantId: z.string().trim().min(1),
    window: z
      .object({
        endDate: isoDateSchema,
        startDate: isoDateSchema
      })
      .strict()
  })
  .strict();
export type PricingOptimizerInput = z.infer<typeof PricingOptimizerInputSchema>;

export const PricingFailureModeSchema = z.enum([
  "degraded_report",
  "human_handoff",
  "hard_fail"
]);
export type PricingFailureMode = z.infer<typeof PricingFailureModeSchema>;

export const PricingEventNameSchema = z.enum([
  "pricingoptimizer.request.received",
  "pricingoptimizer.contract.loaded",
  "pricingoptimizer.tool.call.started",
  "pricingoptimizer.tool.call.succeeded",
  "pricingoptimizer.tool.call.failed",
  "pricingoptimizer.retry.scheduled",
  "pricingoptimizer.fallback.applied",
  "pricingoptimizer.response.generated"
]);
export type PricingEventName = z.infer<typeof PricingEventNameSchema>;

export const PricingEventSchema = z
  .object({
    details: z
      .object({
        attempt: z.number().int().min(1).optional(),
        errorCode: z.string().min(1).optional(),
        fallbackMode: PricingFailureModeSchema.optional(),
        maxAttempts: z.number().int().min(1).optional(),
        source: z.string().min(1).optional(),
        toolId: z.string().min(1).optional()
      })
      .strict(),
    level: z.enum(["error", "info", "warning"]),
    message: z.string().min(1),
    name: PricingEventNameSchema,
    timestamp: z.string().datetime()
  })
  .strict();
export type PricingEvent = z.infer<typeof PricingEventSchema>;

export const PricingMetricsSchema = z
  .object({
    durationMs: z.number().nonnegative(),
    retries: z.number().int().nonnegative(),
    toolCalls: z.number().int().nonnegative(),
    toolFailures: z.number().int().nonnegative()
  })
  .strict();
export type PricingMetrics = z.infer<typeof PricingMetricsSchema>;

export const PricingOptimizerContractSchema = z
  .object({
    failureMode: PricingFailureModeSchema,
    observability: z
      .object({
        events: z.array(PricingEventNameSchema).min(1),
        metrics: z
          .array(
            z.enum(["duration_ms", "retries", "tool_calls", "tool_failures"])
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
export type PricingOptimizerContract = z.infer<typeof PricingOptimizerContractSchema>;

export const DEFAULT_PRICINGOPTIMIZER_CONTRACT: PricingOptimizerContract = {
  failureMode: "degraded_report",
  observability: {
    events: [
      "pricingoptimizer.request.received",
      "pricingoptimizer.contract.loaded",
      "pricingoptimizer.tool.call.started",
      "pricingoptimizer.tool.call.succeeded",
      "pricingoptimizer.tool.call.failed",
      "pricingoptimizer.retry.scheduled",
      "pricingoptimizer.fallback.applied",
      "pricingoptimizer.response.generated"
    ],
    metrics: ["duration_ms", "tool_calls", "tool_failures", "retries"]
  },
  retry: {
    baseDelayMs: 500,
    maxAttempts: 3
  },
  toolIds: ["price-elasticity-model", "discount-leak-feed", "win-rate-feed"]
};

const PrioritySchema = z.enum(["critical", "high", "medium", "low"]);

export const PricingSignalSchema = z
  .object({
    confidence: z.enum(["high", "medium", "low"]),
    interpretation: z.string().min(1),
    metric: z.string().min(1),
    value: z.number()
  })
  .strict();
export type PricingSignal = z.infer<typeof PricingSignalSchema>;

export const PricingRiskSchema = z
  .object({
    mitigation: z.string().min(1),
    severity: PrioritySchema,
    signal: z.string().min(1)
  })
  .strict();
export type PricingRisk = z.infer<typeof PricingRiskSchema>;

export const PricingActionSchema = z
  .object({
    owner: z.string().min(1),
    priority: PrioritySchema,
    recommendation: z.string().min(1),
    targetDate: isoDateSchema
  })
  .strict();
export type PricingAction = z.infer<typeof PricingActionSchema>;

export const PricingOptimizerOutputSchema = z
  .object({
    agent: z.literal("PricingOptimizer"),
    domain: z.literal("executivos"),
    fallback: z
      .object({
        applied: z.boolean(),
        mode: PricingFailureModeSchema.nullable(),
        reasons: z.array(z.string().min(1))
      })
      .strict(),
    generatedAt: z.string().datetime(),
    observability: z
      .object({
        events: z.array(PricingEventSchema),
        metrics: PricingMetricsSchema
      })
      .strict(),
    pricingBrief: z
      .object({
        actions: z.array(PricingActionSchema),
        expectedGrossMarginPct: z.number(),
        headline: z.string().min(1),
        recommendedListPriceDeltaPct: z.number(),
        riskSignals: z.array(PricingRiskSchema),
        signals: z.array(PricingSignalSchema)
      })
      .strict(),
    status: z.enum(["error", "fallback", "success"]),
    summary: z.string().min(1)
  })
  .strict();
export type PricingOptimizerOutput = z.infer<typeof PricingOptimizerOutputSchema>;
