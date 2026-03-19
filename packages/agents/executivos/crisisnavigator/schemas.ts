// [SOURCE] BirthHub360_Agentes_Parallel_Plan - CrisisNavigator
import { z } from "zod";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const CrisisScenarioSchema = z.enum([
  "compliance_breach",
  "executive_misconduct",
  "market_shock",
  "pr_incident",
  "service_outage"
]);
export type CrisisScenario = z.infer<typeof CrisisScenarioSchema>;

export const CrisisSeveritySchema = z.enum(["sev1", "sev2", "sev3", "sev4"]);
export type CrisisSeverity = z.infer<typeof CrisisSeveritySchema>;

export const CrisisRegionSchema = z.enum([
  "apac",
  "emea",
  "global",
  "latam",
  "north_america"
]);
export type CrisisRegion = z.infer<typeof CrisisRegionSchema>;

export const CrisisSectionSchema = z.enum([
  "communications",
  "response_timeline",
  "risk_signals",
  "situation_assessment",
  "stakeholder_impact"
]);
export type CrisisSection = z.infer<typeof CrisisSectionSchema>;

export const CrisisNavigatorInputSchema = z
  .object({
    constraints: z
      .object({
        language: z.enum(["pt-BR", "en-US"]),
        maxActions: z.number().int().min(1).max(12),
        requireHumanApproval: z.boolean()
      })
      .strict(),
    requestId: z.string().trim().min(1),
    regions: z.array(CrisisRegionSchema).min(1),
    scenario: CrisisScenarioSchema,
    sections: z.array(CrisisSectionSchema).min(1),
    severity: CrisisSeveritySchema,
    tenantId: z.string().trim().min(1),
    window: z
      .object({
        endDate: isoDateSchema,
        startDate: isoDateSchema
      })
      .strict()
  })
  .strict();
export type CrisisNavigatorInput = z.infer<typeof CrisisNavigatorInputSchema>;

export const CrisisFailureModeSchema = z.enum([
  "degraded_report",
  "human_handoff",
  "hard_fail"
]);
export type CrisisFailureMode = z.infer<typeof CrisisFailureModeSchema>;

export const CrisisEventNameSchema = z.enum([
  "crisisnavigator.request.received",
  "crisisnavigator.contract.loaded",
  "crisisnavigator.tool.call.started",
  "crisisnavigator.tool.call.succeeded",
  "crisisnavigator.tool.call.failed",
  "crisisnavigator.retry.scheduled",
  "crisisnavigator.fallback.applied",
  "crisisnavigator.response.generated"
]);
export type CrisisEventName = z.infer<typeof CrisisEventNameSchema>;

export const CrisisEventSchema = z
  .object({
    details: z
      .object({
        attempt: z.number().int().min(1).optional(),
        errorCode: z.string().min(1).optional(),
        fallbackMode: CrisisFailureModeSchema.optional(),
        maxAttempts: z.number().int().min(1).optional(),
        source: z.string().min(1).optional(),
        toolId: z.string().min(1).optional()
      })
      .strict(),
    level: z.enum(["info", "warning", "error"]),
    message: z.string().min(1),
    name: CrisisEventNameSchema,
    timestamp: z.string().datetime()
  })
  .strict();
export type CrisisEvent = z.infer<typeof CrisisEventSchema>;

export const CrisisMetricsSchema = z
  .object({
    durationMs: z.number().nonnegative(),
    retries: z.number().int().nonnegative(),
    toolCalls: z.number().int().nonnegative(),
    toolFailures: z.number().int().nonnegative()
  })
  .strict();
export type CrisisMetrics = z.infer<typeof CrisisMetricsSchema>;

export const CrisisNavigatorContractSchema = z
  .object({
    failureMode: CrisisFailureModeSchema,
    observability: z
      .object({
        events: z.array(CrisisEventNameSchema).min(1),
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
export type CrisisNavigatorContract = z.infer<
  typeof CrisisNavigatorContractSchema
>;

export const DEFAULT_CRISISNAVIGATOR_CONTRACT: CrisisNavigatorContract = {
  failureMode: "degraded_report",
  observability: {
    events: [
      "crisisnavigator.request.received",
      "crisisnavigator.contract.loaded",
      "crisisnavigator.tool.call.started",
      "crisisnavigator.tool.call.succeeded",
      "crisisnavigator.tool.call.failed",
      "crisisnavigator.retry.scheduled",
      "crisisnavigator.fallback.applied",
      "crisisnavigator.response.generated"
    ],
    metrics: ["duration_ms", "tool_calls", "tool_failures", "retries"]
  },
  retry: {
    baseDelayMs: 500,
    maxAttempts: 3
  },
  toolIds: [
    "comms-draft-assistant",
    "incident-signal-feed",
    "stakeholder-impact-engine"
  ]
};

const PrioritySchema = z.enum(["critical", "high", "medium", "low"]);

export const ImpactEntrySchema = z
  .object({
    impact: z.string().min(1),
    stakeholder: z.string().min(1),
    severity: PrioritySchema
  })
  .strict();
export type ImpactEntry = z.infer<typeof ImpactEntrySchema>;

export const ResponseStepSchema = z
  .object({
    owner: z.string().min(1),
    priority: PrioritySchema,
    step: z.string().min(1),
    targetDate: isoDateSchema
  })
  .strict();
export type ResponseStep = z.infer<typeof ResponseStepSchema>;

export const RiskSignalSchema = z
  .object({
    mitigation: z.string().min(1),
    severity: PrioritySchema,
    signal: z.string().min(1)
  })
  .strict();
export type RiskSignal = z.infer<typeof RiskSignalSchema>;

export const CrisisNavigatorOutputSchema = z
  .object({
    agent: z.literal("CrisisNavigator"),
    crisisBrief: z
      .object({
        communications: z
          .object({
            externalHoldingStatement: z.string().min(1),
            internalMessage: z.string().min(1),
            mediaQATopics: z.array(z.string().min(1)).min(1)
          })
          .strict(),
        headline: z.string().min(1),
        impactMatrix: z.array(ImpactEntrySchema),
        responseTimeline: z.array(ResponseStepSchema),
        riskSignals: z.array(RiskSignalSchema),
        situationAssessment: z.string().min(1)
      })
      .strict(),
    domain: z.literal("executivos"),
    fallback: z
      .object({
        applied: z.boolean(),
        mode: CrisisFailureModeSchema.nullable(),
        reasons: z.array(z.string().min(1))
      })
      .strict(),
    generatedAt: z.string().datetime(),
    observability: z
      .object({
        events: z.array(CrisisEventSchema),
        metrics: CrisisMetricsSchema
      })
      .strict(),
    status: z.enum(["error", "fallback", "success"]),
    summary: z.string().min(1)
  })
  .strict();
export type CrisisNavigatorOutput = z.infer<typeof CrisisNavigatorOutputSchema>;
