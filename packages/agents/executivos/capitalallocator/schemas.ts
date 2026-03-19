// [SOURCE] BirthHub360_Agentes_Parallel_Plan - CapitalAllocator
import { z } from "zod";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const AllocationObjectiveSchema = z.enum([
  "compliance",
  "efficiency",
  "growth",
  "risk_reduction"
]);
export type AllocationObjective = z.infer<typeof AllocationObjectiveSchema>;

export const CapitalAllocatorInputSchema = z
  .object({
    businessUnits: z.array(z.string().trim().min(1)).min(1),
    capitalBudget: z.number().positive(),
    constraints: z
      .object({
        currency: z.string().trim().length(3),
        language: z.enum(["pt-BR", "en-US"]),
        maxAllocations: z.number().int().min(1).max(20)
      })
      .strict(),
    objectives: z.array(AllocationObjectiveSchema).min(1),
    planningHorizonMonths: z.number().int().min(1).max(36),
    requestId: z.string().trim().min(1),
    tenantId: z.string().trim().min(1),
    window: z
      .object({
        endDate: isoDateSchema,
        startDate: isoDateSchema
      })
      .strict()
  })
  .strict();
export type CapitalAllocatorInput = z.infer<typeof CapitalAllocatorInputSchema>;

export const CapitalFailureModeSchema = z.enum([
  "degraded_report",
  "human_handoff",
  "hard_fail"
]);
export type CapitalFailureMode = z.infer<typeof CapitalFailureModeSchema>;

export const CapitalEventNameSchema = z.enum([
  "capitalallocator.request.received",
  "capitalallocator.contract.loaded",
  "capitalallocator.tool.call.started",
  "capitalallocator.tool.call.succeeded",
  "capitalallocator.tool.call.failed",
  "capitalallocator.retry.scheduled",
  "capitalallocator.fallback.applied",
  "capitalallocator.response.generated"
]);
export type CapitalEventName = z.infer<typeof CapitalEventNameSchema>;

export const CapitalEventSchema = z
  .object({
    details: z
      .object({
        attempt: z.number().int().min(1).optional(),
        errorCode: z.string().min(1).optional(),
        fallbackMode: CapitalFailureModeSchema.optional(),
        maxAttempts: z.number().int().min(1).optional(),
        source: z.string().min(1).optional(),
        toolId: z.string().min(1).optional()
      })
      .strict(),
    level: z.enum(["error", "info", "warning"]),
    message: z.string().min(1),
    name: CapitalEventNameSchema,
    timestamp: z.string().datetime()
  })
  .strict();
export type CapitalEvent = z.infer<typeof CapitalEventSchema>;

export const CapitalMetricsSchema = z
  .object({
    durationMs: z.number().nonnegative(),
    retries: z.number().int().nonnegative(),
    toolCalls: z.number().int().nonnegative(),
    toolFailures: z.number().int().nonnegative()
  })
  .strict();
export type CapitalMetrics = z.infer<typeof CapitalMetricsSchema>;

export const CapitalAllocatorContractSchema = z
  .object({
    failureMode: CapitalFailureModeSchema,
    observability: z
      .object({
        events: z.array(CapitalEventNameSchema).min(1),
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
export type CapitalAllocatorContract = z.infer<
  typeof CapitalAllocatorContractSchema
>;

export const DEFAULT_CAPITALALLOCATOR_CONTRACT: CapitalAllocatorContract = {
  failureMode: "degraded_report",
  observability: {
    events: [
      "capitalallocator.request.received",
      "capitalallocator.contract.loaded",
      "capitalallocator.tool.call.started",
      "capitalallocator.tool.call.succeeded",
      "capitalallocator.tool.call.failed",
      "capitalallocator.retry.scheduled",
      "capitalallocator.fallback.applied",
      "capitalallocator.response.generated"
    ],
    metrics: ["duration_ms", "tool_calls", "tool_failures", "retries"]
  },
  retry: {
    baseDelayMs: 500,
    maxAttempts: 3
  },
  toolIds: [
    "cashflow-forecast-feed",
    "portfolio-scenario-engine",
    "strategic-priority-feed"
  ]
};

const PrioritySchema = z.enum(["critical", "high", "medium", "low"]);

export const AllocationEntrySchema = z
  .object({
    businessUnit: z.string().min(1),
    confidence: z.enum(["high", "low", "medium"]),
    expectedReturnPct: z.number(),
    priority: PrioritySchema,
    rationale: z.string().min(1),
    recommendedAmount: z.number().nonnegative()
  })
  .strict();
export type AllocationEntry = z.infer<typeof AllocationEntrySchema>;

export const ScenarioEntrySchema = z
  .object({
    downsideRiskPct: z.number().min(0).max(100),
    expectedUpsidePct: z.number(),
    scenario: z.string().min(1)
  })
  .strict();
export type ScenarioEntry = z.infer<typeof ScenarioEntrySchema>;

export const CapitalRecommendationSchema = z
  .object({
    owner: z.string().min(1),
    priority: PrioritySchema,
    recommendation: z.string().min(1),
    targetDate: isoDateSchema
  })
  .strict();
export type CapitalRecommendation = z.infer<typeof CapitalRecommendationSchema>;

export const CapitalAllocatorOutputSchema = z
  .object({
    agent: z.literal("CapitalAllocator"),
    allocationBrief: z
      .object({
        allocations: z.array(AllocationEntrySchema),
        guardrails: z.array(CapitalRecommendationSchema),
        headline: z.string().min(1),
        scenarioSummary: z.array(ScenarioEntrySchema)
      })
      .strict(),
    domain: z.literal("executivos"),
    fallback: z
      .object({
        applied: z.boolean(),
        mode: CapitalFailureModeSchema.nullable(),
        reasons: z.array(z.string().min(1))
      })
      .strict(),
    generatedAt: z.string().datetime(),
    observability: z
      .object({
        events: z.array(CapitalEventSchema),
        metrics: CapitalMetricsSchema
      })
      .strict(),
    status: z.enum(["error", "fallback", "success"]),
    summary: z.string().min(1)
  })
  .strict();
export type CapitalAllocatorOutput = z.infer<typeof CapitalAllocatorOutputSchema>;
