// [SOURCE] BirthHub360_Agentes_Parallel_Plan — BoardPrep AI
import { z } from "zod";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const BoardAudienceSchema = z.enum([
  "board",
  "c_level",
  "investors",
  "vp_staff"
]);
export type BoardAudience = z.infer<typeof BoardAudienceSchema>;

export const BoardSectionSchema = z.enum([
  "kpis",
  "risks",
  "capital_allocation",
  "market_sentiment",
  "operational_blocks"
]);
export type BoardSection = z.infer<typeof BoardSectionSchema>;

export const BoardPrepInputSchema = z
  .object({
    tenantId: z.string().trim().min(1),
    requestId: z.string().trim().min(1),
    audience: BoardAudienceSchema,
    period: z
      .object({
        endDate: isoDateSchema,
        startDate: isoDateSchema
      })
      .strict(),
    sections: z.array(BoardSectionSchema).min(1),
    constraints: z
      .object({
        currency: z.string().trim().length(3),
        language: z.enum(["pt-BR", "en-US"]),
        maxRecommendations: z.number().int().min(1).max(10)
      })
      .strict()
  })
  .strict();
export type BoardPrepInput = z.infer<typeof BoardPrepInputSchema>;

export const ToolFailureModeSchema = z.enum([
  "degraded_report",
  "human_handoff",
  "hard_fail"
]);
export type ToolFailureMode = z.infer<typeof ToolFailureModeSchema>;

export const BoardPrepEventNameSchema = z.enum([
  "boardprep.request.received",
  "boardprep.contract.loaded",
  "boardprep.tool.call.started",
  "boardprep.tool.call.succeeded",
  "boardprep.tool.call.failed",
  "boardprep.retry.scheduled",
  "boardprep.fallback.applied",
  "boardprep.response.generated"
]);
export type BoardPrepEventName = z.infer<typeof BoardPrepEventNameSchema>;

export const BoardPrepEventSchema = z
  .object({
    details: z
      .object({
        attempt: z.number().int().min(1).optional(),
        errorCode: z.string().min(1).optional(),
        fallbackMode: ToolFailureModeSchema.optional(),
        maxAttempts: z.number().int().min(1).optional(),
        source: z.string().min(1).optional(),
        toolId: z.string().min(1).optional()
      })
      .strict(),
    level: z.enum(["info", "warning", "error"]),
    message: z.string().min(1),
    name: BoardPrepEventNameSchema,
    timestamp: z.string().datetime()
  })
  .strict();
export type BoardPrepEvent = z.infer<typeof BoardPrepEventSchema>;

export const BoardPrepMetricsSchema = z
  .object({
    durationMs: z.number().nonnegative(),
    retries: z.number().int().nonnegative(),
    toolCalls: z.number().int().nonnegative(),
    toolFailures: z.number().int().nonnegative()
  })
  .strict();
export type BoardPrepMetrics = z.infer<typeof BoardPrepMetricsSchema>;

export const BoardPrepContractSchema = z
  .object({
    failureMode: ToolFailureModeSchema,
    observability: z
      .object({
        events: z.array(BoardPrepEventNameSchema).min(1),
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
export type BoardPrepContract = z.infer<typeof BoardPrepContractSchema>;

export const DEFAULT_BOARDPREP_CONTRACT: BoardPrepContract = {
  failureMode: "degraded_report",
  observability: {
    events: [
      "boardprep.request.received",
      "boardprep.contract.loaded",
      "boardprep.tool.call.started",
      "boardprep.tool.call.succeeded",
      "boardprep.tool.call.failed",
      "boardprep.retry.scheduled",
      "boardprep.fallback.applied",
      "boardprep.response.generated"
    ],
    metrics: ["duration_ms", "tool_calls", "tool_failures", "retries"]
  },
  retry: {
    baseDelayMs: 500,
    maxAttempts: 3
  },
  toolIds: ["board-report-generator", "kpi-dashboard", "budget-forecaster"]
};

const PrioritySchema = z.enum(["critical", "high", "medium", "low"]);

export const KpiHighlightSchema = z
  .object({
    direction: z.enum(["down", "stable", "up"]),
    metric: z.string().min(1),
    rationale: z.string().min(1),
    value: z.number()
  })
  .strict();
export type KpiHighlight = z.infer<typeof KpiHighlightSchema>;

export const RiskSignalSchema = z
  .object({
    impact: PrioritySchema,
    mitigation: z.string().min(1),
    signal: z.string().min(1)
  })
  .strict();
export type RiskSignal = z.infer<typeof RiskSignalSchema>;

export const CapitalAllocationSuggestionSchema = z
  .object({
    confidence: z.enum(["low", "medium", "high"]),
    rationale: z.string().min(1),
    recommendation: z.string().min(1)
  })
  .strict();
export type CapitalAllocationSuggestion = z.infer<
  typeof CapitalAllocationSuggestionSchema
>;

export const BoardRecommendationSchema = z
  .object({
    owner: z.string().min(1),
    priority: PrioritySchema,
    recommendation: z.string().min(1),
    targetDate: isoDateSchema
  })
  .strict();
export type BoardRecommendation = z.infer<typeof BoardRecommendationSchema>;

export const BoardPrepOutputSchema = z
  .object({
    agent: z.literal("BoardPrep AI"),
    domain: z.literal("executivos"),
    executiveBrief: z
      .object({
        allocationGuidance: z.array(CapitalAllocationSuggestionSchema),
        headline: z.string().min(1),
        kpiHighlights: z.array(KpiHighlightSchema),
        nextBoardActions: z.array(BoardRecommendationSchema),
        riskSignals: z.array(RiskSignalSchema)
      })
      .strict(),
    fallback: z
      .object({
        applied: z.boolean(),
        mode: ToolFailureModeSchema.nullable(),
        reasons: z.array(z.string().min(1))
      })
      .strict(),
    generatedAt: z.string().datetime(),
    observability: z
      .object({
        events: z.array(BoardPrepEventSchema),
        metrics: BoardPrepMetricsSchema
      })
      .strict(),
    status: z.enum(["error", "fallback", "success"]),
    summary: z.string().min(1)
  })
  .strict();
export type BoardPrepOutput = z.infer<typeof BoardPrepOutputSchema>;

