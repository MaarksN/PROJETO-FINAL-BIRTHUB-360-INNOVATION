// [SOURCE] BirthHub360_Agentes_Parallel_Plan - CulturePulse
import { z } from "zod";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const CultureSegmentSchema = z.enum([
  "executive_team",
  "people_managers",
  "individual_contributors",
  "go_to_market",
  "product_engineering"
]);
export type CultureSegment = z.infer<typeof CultureSegmentSchema>;

export const CultureSectionSchema = z.enum([
  "engagement",
  "retention_risk",
  "manager_effectiveness",
  "psychological_safety",
  "burnout"
]);
export type CultureSection = z.infer<typeof CultureSectionSchema>;

export const CulturePulseInputSchema = z
  .object({
    constraints: z
      .object({
        language: z.enum(["pt-BR", "en-US"]),
        maxInsights: z.number().int().min(1).max(10)
      })
      .strict(),
    requestId: z.string().trim().min(1),
    sections: z.array(CultureSectionSchema).min(1),
    segments: z.array(CultureSegmentSchema).min(1),
    tenantId: z.string().trim().min(1),
    window: z
      .object({
        endDate: isoDateSchema,
        startDate: isoDateSchema
      })
      .strict()
  })
  .strict();
export type CulturePulseInput = z.infer<typeof CulturePulseInputSchema>;

export const CultureFailureModeSchema = z.enum([
  "degraded_report",
  "human_handoff",
  "hard_fail"
]);
export type CultureFailureMode = z.infer<typeof CultureFailureModeSchema>;

export const CultureEventNameSchema = z.enum([
  "culturepulse.request.received",
  "culturepulse.contract.loaded",
  "culturepulse.tool.call.started",
  "culturepulse.tool.call.succeeded",
  "culturepulse.tool.call.failed",
  "culturepulse.retry.scheduled",
  "culturepulse.fallback.applied",
  "culturepulse.response.generated"
]);
export type CultureEventName = z.infer<typeof CultureEventNameSchema>;

export const CultureEventSchema = z
  .object({
    details: z
      .object({
        attempt: z.number().int().min(1).optional(),
        errorCode: z.string().min(1).optional(),
        fallbackMode: CultureFailureModeSchema.optional(),
        maxAttempts: z.number().int().min(1).optional(),
        source: z.string().min(1).optional(),
        toolId: z.string().min(1).optional()
      })
      .strict(),
    level: z.enum(["info", "warning", "error"]),
    message: z.string().min(1),
    name: CultureEventNameSchema,
    timestamp: z.string().datetime()
  })
  .strict();
export type CultureEvent = z.infer<typeof CultureEventSchema>;

export const CultureMetricsSchema = z
  .object({
    durationMs: z.number().nonnegative(),
    retries: z.number().int().nonnegative(),
    toolCalls: z.number().int().nonnegative(),
    toolFailures: z.number().int().nonnegative()
  })
  .strict();
export type CultureMetrics = z.infer<typeof CultureMetricsSchema>;

export const CulturePulseContractSchema = z
  .object({
    failureMode: CultureFailureModeSchema,
    observability: z
      .object({
        events: z.array(CultureEventNameSchema).min(1),
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
export type CulturePulseContract = z.infer<typeof CulturePulseContractSchema>;

export const DEFAULT_CULTUREPULSE_CONTRACT: CulturePulseContract = {
  failureMode: "degraded_report",
  observability: {
    events: [
      "culturepulse.request.received",
      "culturepulse.contract.loaded",
      "culturepulse.tool.call.started",
      "culturepulse.tool.call.succeeded",
      "culturepulse.tool.call.failed",
      "culturepulse.retry.scheduled",
      "culturepulse.fallback.applied",
      "culturepulse.response.generated"
    ],
    metrics: ["duration_ms", "tool_calls", "tool_failures", "retries"]
  },
  retry: {
    baseDelayMs: 500,
    maxAttempts: 3
  },
  toolIds: [
    "engagement-survey",
    "retention-risk-feed",
    "manager-sentiment-stream"
  ]
};

const PrioritySchema = z.enum(["critical", "high", "medium", "low"]);

export const EngagementSignalSchema = z
  .object({
    interpretation: z.string().min(1),
    metric: z.string().min(1),
    trend: z.enum(["down", "stable", "up"]),
    value: z.number()
  })
  .strict();
export type EngagementSignal = z.infer<typeof EngagementSignalSchema>;

export const CultureRiskSignalSchema = z
  .object({
    impact: z.string().min(1),
    mitigation: z.string().min(1),
    severity: PrioritySchema,
    signal: z.string().min(1)
  })
  .strict();
export type CultureRiskSignal = z.infer<typeof CultureRiskSignalSchema>;

export const ManagerSignalSchema = z
  .object({
    note: z.string().min(1),
    strength: z.enum(["low", "medium", "high"]),
    theme: z.string().min(1)
  })
  .strict();
export type ManagerSignal = z.infer<typeof ManagerSignalSchema>;

export const CultureRecommendationSchema = z
  .object({
    owner: z.string().min(1),
    priority: PrioritySchema,
    recommendation: z.string().min(1),
    targetDate: isoDateSchema
  })
  .strict();
export type CultureRecommendation = z.infer<typeof CultureRecommendationSchema>;

export const CulturePulseOutputSchema = z
  .object({
    agent: z.literal("CulturePulse"),
    cultureBrief: z
      .object({
        coverage: z
          .object({
            dataCompletenessPct: z.number().min(0).max(100),
            segmentsAnalyzed: z.array(CultureSegmentSchema).min(1)
          })
          .strict(),
        engagementSignals: z.array(EngagementSignalSchema),
        headline: z.string().min(1),
        managerSignals: z.array(ManagerSignalSchema),
        nextActions: z.array(CultureRecommendationSchema),
        riskSignals: z.array(CultureRiskSignalSchema)
      })
      .strict(),
    domain: z.literal("executivos"),
    fallback: z
      .object({
        applied: z.boolean(),
        mode: CultureFailureModeSchema.nullable(),
        reasons: z.array(z.string().min(1))
      })
      .strict(),
    generatedAt: z.string().datetime(),
    observability: z
      .object({
        events: z.array(CultureEventSchema),
        metrics: CultureMetricsSchema
      })
      .strict(),
    status: z.enum(["error", "fallback", "success"]),
    summary: z.string().min(1)
  })
  .strict();
export type CulturePulseOutput = z.infer<typeof CulturePulseOutputSchema>;
