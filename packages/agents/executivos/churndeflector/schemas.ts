// [SOURCE] BirthHub360_Agentes_Parallel_Plan - ChurnDeflector
import { z } from "zod";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const ChurnSegmentSchema = z.enum([
  "enterprise",
  "mid_market",
  "new_logo",
  "smb",
  "strategic_accounts"
]);
export type ChurnSegment = z.infer<typeof ChurnSegmentSchema>;

export const ChurnSectionSchema = z.enum([
  "health_drift",
  "retention_actions",
  "revenue_exposure",
  "risk_cohorts",
  "save_playbooks"
]);
export type ChurnSection = z.infer<typeof ChurnSectionSchema>;

export const ChurnDeflectorInputSchema = z
  .object({
    constraints: z
      .object({
        currency: z.string().trim().length(3),
        language: z.enum(["pt-BR", "en-US"]),
        maxActions: z.number().int().min(1).max(12)
      })
      .strict(),
    requestId: z.string().trim().min(1),
    sections: z.array(ChurnSectionSchema).min(1),
    segments: z.array(ChurnSegmentSchema).min(1),
    targetGrossRevenueRetentionPct: z.number().positive(),
    tenantId: z.string().trim().min(1),
    window: z
      .object({
        endDate: isoDateSchema,
        startDate: isoDateSchema
      })
      .strict()
  })
  .strict();
export type ChurnDeflectorInput = z.infer<typeof ChurnDeflectorInputSchema>;

export const ChurnFailureModeSchema = z.enum([
  "degraded_report",
  "human_handoff",
  "hard_fail"
]);
export type ChurnFailureMode = z.infer<typeof ChurnFailureModeSchema>;

export const ChurnEventNameSchema = z.enum([
  "churndeflector.request.received",
  "churndeflector.contract.loaded",
  "churndeflector.tool.call.started",
  "churndeflector.tool.call.succeeded",
  "churndeflector.tool.call.failed",
  "churndeflector.retry.scheduled",
  "churndeflector.fallback.applied",
  "churndeflector.response.generated"
]);
export type ChurnEventName = z.infer<typeof ChurnEventNameSchema>;

export const ChurnEventSchema = z
  .object({
    details: z
      .object({
        attempt: z.number().int().min(1).optional(),
        errorCode: z.string().min(1).optional(),
        fallbackMode: ChurnFailureModeSchema.optional(),
        maxAttempts: z.number().int().min(1).optional(),
        source: z.string().min(1).optional(),
        toolId: z.string().min(1).optional()
      })
      .strict(),
    level: z.enum(["error", "info", "warning"]),
    message: z.string().min(1),
    name: ChurnEventNameSchema,
    timestamp: z.string().datetime()
  })
  .strict();
export type ChurnEvent = z.infer<typeof ChurnEventSchema>;

export const ChurnMetricsSchema = z
  .object({
    durationMs: z.number().nonnegative(),
    retries: z.number().int().nonnegative(),
    toolCalls: z.number().int().nonnegative(),
    toolFailures: z.number().int().nonnegative()
  })
  .strict();
export type ChurnMetrics = z.infer<typeof ChurnMetricsSchema>;

export const ChurnDeflectorContractSchema = z
  .object({
    failureMode: ChurnFailureModeSchema,
    observability: z
      .object({
        events: z.array(ChurnEventNameSchema).min(1),
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
export type ChurnDeflectorContract = z.infer<typeof ChurnDeflectorContractSchema>;

export const DEFAULT_CHURNDEFLECTOR_CONTRACT: ChurnDeflectorContract = {
  failureMode: "degraded_report",
  observability: {
    events: [
      "churndeflector.request.received",
      "churndeflector.contract.loaded",
      "churndeflector.tool.call.started",
      "churndeflector.tool.call.succeeded",
      "churndeflector.tool.call.failed",
      "churndeflector.retry.scheduled",
      "churndeflector.fallback.applied",
      "churndeflector.response.generated"
    ],
    metrics: ["duration_ms", "tool_calls", "tool_failures", "retries"]
  },
  retry: {
    baseDelayMs: 500,
    maxAttempts: 3
  },
  toolIds: ["churn-risk-engine", "customer-health-feed", "renewal-likelihood-feed"]
};

const PrioritySchema = z.enum(["critical", "high", "low", "medium"]);

export const CohortSignalSchema = z
  .object({
    confidence: z.enum(["high", "low", "medium"]),
    interpretation: z.string().min(1),
    metric: z.string().min(1),
    value: z.number()
  })
  .strict();
export type CohortSignal = z.infer<typeof CohortSignalSchema>;

export const RetentionRiskSchema = z
  .object({
    mitigation: z.string().min(1),
    severity: PrioritySchema,
    signal: z.string().min(1)
  })
  .strict();
export type RetentionRisk = z.infer<typeof RetentionRiskSchema>;

export const RetentionActionSchema = z
  .object({
    owner: z.string().min(1),
    priority: PrioritySchema,
    recommendation: z.string().min(1),
    targetDate: isoDateSchema
  })
  .strict();
export type RetentionAction = z.infer<typeof RetentionActionSchema>;

export const ChurnDeflectorOutputSchema = z
  .object({
    agent: z.literal("ChurnDeflector"),
    churnBrief: z
      .object({
        actions: z.array(RetentionActionSchema),
        cohortSignals: z.array(CohortSignalSchema),
        headline: z.string().min(1),
        revenueExposurePct: z.number(),
        riskSignals: z.array(RetentionRiskSchema)
      })
      .strict(),
    domain: z.literal("executivos"),
    fallback: z
      .object({
        applied: z.boolean(),
        mode: ChurnFailureModeSchema.nullable(),
        reasons: z.array(z.string().min(1))
      })
      .strict(),
    generatedAt: z.string().datetime(),
    observability: z
      .object({
        events: z.array(ChurnEventSchema),
        metrics: ChurnMetricsSchema
      })
      .strict(),
    status: z.enum(["error", "fallback", "success"]),
    summary: z.string().min(1)
  })
  .strict();
export type ChurnDeflectorOutput = z.infer<typeof ChurnDeflectorOutputSchema>;
