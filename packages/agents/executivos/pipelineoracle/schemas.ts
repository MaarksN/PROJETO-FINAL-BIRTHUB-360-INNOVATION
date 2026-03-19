// [SOURCE] BirthHub360_Agentes_Parallel_Plan - PipelineOracle
import { z } from "zod";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const PipelineSegmentSchema = z.enum([
  "commercial",
  "enterprise",
  "mid_market",
  "partnerships",
  "self_serve"
]);
export type PipelineSegment = z.infer<typeof PipelineSegmentSchema>;

export const PipelineSectionSchema = z.enum([
  "coverage",
  "deal_risk",
  "forecast",
  "stage_velocity",
  "target_gap"
]);
export type PipelineSection = z.infer<typeof PipelineSectionSchema>;

export const PipelineOracleInputSchema = z
  .object({
    constraints: z
      .object({
        currency: z.string().trim().length(3),
        language: z.enum(["pt-BR", "en-US"]),
        maxActions: z.number().int().min(1).max(12)
      })
      .strict(),
    requestId: z.string().trim().min(1),
    sections: z.array(PipelineSectionSchema).min(1),
    segments: z.array(PipelineSegmentSchema).min(1),
    targetArr: z.number().positive(),
    tenantId: z.string().trim().min(1),
    window: z
      .object({
        endDate: isoDateSchema,
        startDate: isoDateSchema
      })
      .strict()
  })
  .strict();
export type PipelineOracleInput = z.infer<typeof PipelineOracleInputSchema>;

export const PipelineFailureModeSchema = z.enum([
  "degraded_report",
  "human_handoff",
  "hard_fail"
]);
export type PipelineFailureMode = z.infer<typeof PipelineFailureModeSchema>;

export const PipelineEventNameSchema = z.enum([
  "pipelineoracle.request.received",
  "pipelineoracle.contract.loaded",
  "pipelineoracle.tool.call.started",
  "pipelineoracle.tool.call.succeeded",
  "pipelineoracle.tool.call.failed",
  "pipelineoracle.retry.scheduled",
  "pipelineoracle.fallback.applied",
  "pipelineoracle.response.generated"
]);
export type PipelineEventName = z.infer<typeof PipelineEventNameSchema>;

export const PipelineEventSchema = z
  .object({
    details: z
      .object({
        attempt: z.number().int().min(1).optional(),
        errorCode: z.string().min(1).optional(),
        fallbackMode: PipelineFailureModeSchema.optional(),
        maxAttempts: z.number().int().min(1).optional(),
        source: z.string().min(1).optional(),
        toolId: z.string().min(1).optional()
      })
      .strict(),
    level: z.enum(["error", "info", "warning"]),
    message: z.string().min(1),
    name: PipelineEventNameSchema,
    timestamp: z.string().datetime()
  })
  .strict();
export type PipelineEvent = z.infer<typeof PipelineEventSchema>;

export const PipelineMetricsSchema = z
  .object({
    durationMs: z.number().nonnegative(),
    retries: z.number().int().nonnegative(),
    toolCalls: z.number().int().nonnegative(),
    toolFailures: z.number().int().nonnegative()
  })
  .strict();
export type PipelineMetrics = z.infer<typeof PipelineMetricsSchema>;

export const PipelineOracleContractSchema = z
  .object({
    failureMode: PipelineFailureModeSchema,
    observability: z
      .object({
        events: z.array(PipelineEventNameSchema).min(1),
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
export type PipelineOracleContract = z.infer<typeof PipelineOracleContractSchema>;

export const DEFAULT_PIPELINEORACLE_CONTRACT: PipelineOracleContract = {
  failureMode: "degraded_report",
  observability: {
    events: [
      "pipelineoracle.request.received",
      "pipelineoracle.contract.loaded",
      "pipelineoracle.tool.call.started",
      "pipelineoracle.tool.call.succeeded",
      "pipelineoracle.tool.call.failed",
      "pipelineoracle.retry.scheduled",
      "pipelineoracle.fallback.applied",
      "pipelineoracle.response.generated"
    ],
    metrics: ["duration_ms", "tool_calls", "tool_failures", "retries"]
  },
  retry: {
    baseDelayMs: 500,
    maxAttempts: 3
  },
  toolIds: ["deal-risk-engine", "pipeline-health-feed", "revenue-attainment-feed"]
};

const PrioritySchema = z.enum(["critical", "high", "medium", "low"]);

export const ForecastSignalSchema = z
  .object({
    confidence: z.enum(["high", "low", "medium"]),
    interpretation: z.string().min(1),
    metric: z.string().min(1),
    value: z.number()
  })
  .strict();
export type ForecastSignal = z.infer<typeof ForecastSignalSchema>;

export const PipelineRiskSchema = z
  .object({
    mitigation: z.string().min(1),
    severity: PrioritySchema,
    signal: z.string().min(1)
  })
  .strict();
export type PipelineRisk = z.infer<typeof PipelineRiskSchema>;

export const PipelineActionSchema = z
  .object({
    owner: z.string().min(1),
    priority: PrioritySchema,
    recommendation: z.string().min(1),
    targetDate: isoDateSchema
  })
  .strict();
export type PipelineAction = z.infer<typeof PipelineActionSchema>;

export const PipelineOracleOutputSchema = z
  .object({
    agent: z.literal("PipelineOracle"),
    domain: z.literal("executivos"),
    fallback: z
      .object({
        applied: z.boolean(),
        mode: PipelineFailureModeSchema.nullable(),
        reasons: z.array(z.string().min(1))
      })
      .strict(),
    generatedAt: z.string().datetime(),
    observability: z
      .object({
        events: z.array(PipelineEventSchema),
        metrics: PipelineMetricsSchema
      })
      .strict(),
    pipelineBrief: z
      .object({
        actions: z.array(PipelineActionSchema),
        forecastSignals: z.array(ForecastSignalSchema),
        headline: z.string().min(1),
        riskSignals: z.array(PipelineRiskSchema)
      })
      .strict(),
    status: z.enum(["error", "fallback", "success"]),
    summary: z.string().min(1)
  })
  .strict();
export type PipelineOracleOutput = z.infer<typeof PipelineOracleOutputSchema>;
