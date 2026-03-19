// [SOURCE] BirthHub360_Agentes_Parallel_Plan - ExpansionMapper
import { z } from "zod";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const ExpansionSegmentSchema = z.enum([
  "enterprise",
  "mid_market",
  "public_sector",
  "smb",
  "strategic_accounts"
]);
export type ExpansionSegment = z.infer<typeof ExpansionSegmentSchema>;

export const ExpansionSectionSchema = z.enum([
  "geo_opportunities",
  "investment_priorities",
  "partner_paths",
  "risk_constraints",
  "segment_whitespace"
]);
export type ExpansionSection = z.infer<typeof ExpansionSectionSchema>;

export const ExpansionMapperInputSchema = z
  .object({
    constraints: z
      .object({
        currency: z.string().trim().length(3),
        language: z.enum(["pt-BR", "en-US"]),
        maxActions: z.number().int().min(1).max(12)
      })
      .strict(),
    requestId: z.string().trim().min(1),
    sections: z.array(ExpansionSectionSchema).min(1),
    segments: z.array(ExpansionSegmentSchema).min(1),
    targetExpansionArr: z.number().positive(),
    tenantId: z.string().trim().min(1),
    window: z
      .object({
        endDate: isoDateSchema,
        startDate: isoDateSchema
      })
      .strict()
  })
  .strict();
export type ExpansionMapperInput = z.infer<typeof ExpansionMapperInputSchema>;

export const ExpansionFailureModeSchema = z.enum([
  "degraded_report",
  "human_handoff",
  "hard_fail"
]);
export type ExpansionFailureMode = z.infer<typeof ExpansionFailureModeSchema>;

export const ExpansionEventNameSchema = z.enum([
  "expansionmapper.request.received",
  "expansionmapper.contract.loaded",
  "expansionmapper.tool.call.started",
  "expansionmapper.tool.call.succeeded",
  "expansionmapper.tool.call.failed",
  "expansionmapper.retry.scheduled",
  "expansionmapper.fallback.applied",
  "expansionmapper.response.generated"
]);
export type ExpansionEventName = z.infer<typeof ExpansionEventNameSchema>;

export const ExpansionEventSchema = z
  .object({
    details: z
      .object({
        attempt: z.number().int().min(1).optional(),
        errorCode: z.string().min(1).optional(),
        fallbackMode: ExpansionFailureModeSchema.optional(),
        maxAttempts: z.number().int().min(1).optional(),
        source: z.string().min(1).optional(),
        toolId: z.string().min(1).optional()
      })
      .strict(),
    level: z.enum(["error", "info", "warning"]),
    message: z.string().min(1),
    name: ExpansionEventNameSchema,
    timestamp: z.string().datetime()
  })
  .strict();
export type ExpansionEvent = z.infer<typeof ExpansionEventSchema>;

export const ExpansionMetricsSchema = z
  .object({
    durationMs: z.number().nonnegative(),
    retries: z.number().int().nonnegative(),
    toolCalls: z.number().int().nonnegative(),
    toolFailures: z.number().int().nonnegative()
  })
  .strict();
export type ExpansionMetrics = z.infer<typeof ExpansionMetricsSchema>;

export const ExpansionMapperContractSchema = z
  .object({
    failureMode: ExpansionFailureModeSchema,
    observability: z
      .object({
        events: z.array(ExpansionEventNameSchema).min(1),
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
export type ExpansionMapperContract = z.infer<typeof ExpansionMapperContractSchema>;

export const DEFAULT_EXPANSIONMAPPER_CONTRACT: ExpansionMapperContract = {
  failureMode: "degraded_report",
  observability: {
    events: [
      "expansionmapper.request.received",
      "expansionmapper.contract.loaded",
      "expansionmapper.tool.call.started",
      "expansionmapper.tool.call.succeeded",
      "expansionmapper.tool.call.failed",
      "expansionmapper.retry.scheduled",
      "expansionmapper.fallback.applied",
      "expansionmapper.response.generated"
    ],
    metrics: ["duration_ms", "tool_calls", "tool_failures", "retries"]
  },
  retry: {
    baseDelayMs: 500,
    maxAttempts: 3
  },
  toolIds: [
    "territory-intelligence-feed",
    "product-adoption-map",
    "whitespace-scoring-engine"
  ]
};

const PrioritySchema = z.enum(["critical", "high", "medium", "low"]);

export const ExpansionSignalSchema = z
  .object({
    confidence: z.enum(["high", "medium", "low"]),
    interpretation: z.string().min(1),
    metric: z.string().min(1),
    value: z.number()
  })
  .strict();
export type ExpansionSignal = z.infer<typeof ExpansionSignalSchema>;

export const ExpansionRiskSchema = z
  .object({
    mitigation: z.string().min(1),
    severity: PrioritySchema,
    signal: z.string().min(1)
  })
  .strict();
export type ExpansionRisk = z.infer<typeof ExpansionRiskSchema>;

export const ExpansionActionSchema = z
  .object({
    owner: z.string().min(1),
    priority: PrioritySchema,
    recommendation: z.string().min(1),
    targetDate: isoDateSchema
  })
  .strict();
export type ExpansionAction = z.infer<typeof ExpansionActionSchema>;

export const ExpansionMapperOutputSchema = z
  .object({
    agent: z.literal("ExpansionMapper"),
    domain: z.literal("executivos"),
    expansionBrief: z
      .object({
        actions: z.array(ExpansionActionSchema),
        headline: z.string().min(1),
        projectedExpansionArr: z.number(),
        riskSignals: z.array(ExpansionRiskSchema),
        signals: z.array(ExpansionSignalSchema)
      })
      .strict(),
    fallback: z
      .object({
        applied: z.boolean(),
        mode: ExpansionFailureModeSchema.nullable(),
        reasons: z.array(z.string().min(1))
      })
      .strict(),
    generatedAt: z.string().datetime(),
    observability: z
      .object({
        events: z.array(ExpansionEventSchema),
        metrics: ExpansionMetricsSchema
      })
      .strict(),
    status: z.enum(["error", "fallback", "success"]),
    summary: z.string().min(1)
  })
  .strict();
export type ExpansionMapperOutput = z.infer<typeof ExpansionMapperOutputSchema>;
