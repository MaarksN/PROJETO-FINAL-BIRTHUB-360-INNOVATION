// [SOURCE] BirthHub360_Agentes_Parallel_Plan - CrisisNavigator
import { createHash } from "node:crypto";

import { z } from "zod";

import { CrisisRegionSchema, CrisisScenarioSchema, CrisisSeveritySchema } from "./schemas.js";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const CRISISNAVIGATOR_TOOL_IDS = [
  "comms-draft-assistant",
  "incident-signal-feed",
  "stakeholder-impact-engine"
] as const;
export type CrisisToolId = (typeof CRISISNAVIGATOR_TOOL_IDS)[number];

export const CrisisToolInputSchema = z
  .object({
    endDate: isoDateSchema,
    regions: z.array(CrisisRegionSchema).min(1),
    scenario: CrisisScenarioSchema,
    severity: CrisisSeveritySchema,
    startDate: isoDateSchema,
    tenantId: z.string().trim().min(1)
  })
  .strict();
export type CrisisToolInput = z.infer<typeof CrisisToolInputSchema>;

export const IncidentSignalSnapshotSchema = z
  .object({
    confidencePct: z.number().min(0).max(100),
    incidentVelocity: z.number().min(0).max(100),
    topSignal: z.string().min(1)
  })
  .strict();
export type IncidentSignalSnapshot = z.infer<typeof IncidentSignalSnapshotSchema>;

export const StakeholderImpactSnapshotSchema = z
  .object({
    boardImpact: z.string().min(1),
    customerImpact: z.string().min(1),
    regulatoryExposurePct: z.number().min(0).max(100)
  })
  .strict();
export type StakeholderImpactSnapshot = z.infer<
  typeof StakeholderImpactSnapshotSchema
>;

export const CommsDraftSnapshotSchema = z
  .object({
    externalTone: z.enum(["neutral", "reassuring", "transparent"]),
    internalTone: z.enum(["calm", "directive", "urgent"]),
    keyMessage: z.string().min(1)
  })
  .strict();
export type CommsDraftSnapshot = z.infer<typeof CommsDraftSnapshotSchema>;

export interface CrisisNavigatorToolAdapters {
  fetchCommsDraft(input: CrisisToolInput): Promise<CommsDraftSnapshot>;
  fetchIncidentSignal(input: CrisisToolInput): Promise<IncidentSignalSnapshot>;
  fetchStakeholderImpact(input: CrisisToolInput): Promise<StakeholderImpactSnapshot>;
}

function deterministic(seed: string, min: number, max: number): number {
  const digest = createHash("sha256").update(seed).digest("hex");
  const parsed = Number.parseInt(digest.slice(0, 10), 16);
  const ratio = parsed / Number.parseInt("ffffffffff", 16);
  return min + (max - min) * ratio;
}

export function normalizeCrisisToolId(toolId: string): CrisisToolId | null {
  const normalized = toolId
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

  if (normalized === "comms-draft-assistant") {
    return "comms-draft-assistant";
  }
  if (normalized === "incident-signal-feed") {
    return "incident-signal-feed";
  }
  if (normalized === "stakeholder-impact-engine") {
    return "stakeholder-impact-engine";
  }
  return null;
}

export function createDefaultCrisisNavigatorToolAdapters(): CrisisNavigatorToolAdapters {
  return {
    async fetchCommsDraft(input: CrisisToolInput): Promise<CommsDraftSnapshot> {
      CrisisToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.scenario}:${input.severity}:comms`;
      return CommsDraftSnapshotSchema.parse({
        externalTone:
          deterministic(`${seed}:ext-tone`, 0, 1) > 0.6
            ? "transparent"
            : deterministic(`${seed}:ext-tone-mid`, 0, 1) > 0.3
              ? "reassuring"
              : "neutral",
        internalTone:
          input.severity === "sev1"
            ? "urgent"
            : input.severity === "sev2"
              ? "directive"
              : "calm",
        keyMessage:
          input.severity === "sev1"
            ? "Immediate coordinated response is required with hourly leadership updates."
            : "Response is active and leadership accountability remains explicit."
      });
    },

    async fetchIncidentSignal(
      input: CrisisToolInput
    ): Promise<IncidentSignalSnapshot> {
      CrisisToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.scenario}:${input.startDate}:${input.endDate}:incident`;
      return IncidentSignalSnapshotSchema.parse({
        confidencePct: Number(deterministic(`${seed}:confidence`, 51, 97).toFixed(2)),
        incidentVelocity: Number(deterministic(`${seed}:velocity`, 18, 92).toFixed(2)),
        topSignal:
          deterministic(`${seed}:signal`, 0, 1) > 0.5
            ? "public narrative acceleration in strategic channels"
            : "operational degradation affecting high-value accounts"
      });
    },

    async fetchStakeholderImpact(
      input: CrisisToolInput
    ): Promise<StakeholderImpactSnapshot> {
      CrisisToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.scenario}:${input.regions.join(",")}:impact`;
      return StakeholderImpactSnapshotSchema.parse({
        boardImpact:
          input.severity === "sev1" || input.severity === "sev2"
            ? "Board visibility required within current business day."
            : "Board visibility required in periodic executive update.",
        customerImpact:
          deterministic(`${seed}:customer`, 0, 1) > 0.5
            ? "Customer trust may degrade without transparent communication cadence."
            : "Customer operations potentially affected in targeted segments.",
        regulatoryExposurePct: Number(
          deterministic(`${seed}:regulatory`, 7, 68).toFixed(2)
        )
      });
    }
  };
}
