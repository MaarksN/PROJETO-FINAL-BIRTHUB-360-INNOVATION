// [SOURCE] BirthHub360_Agentes_Parallel_Plan - CulturePulse
import { createHash } from "node:crypto";

import { z } from "zod";

import { CultureSegmentSchema } from "./schemas.js";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const CULTUREPULSE_TOOL_IDS = [
  "engagement-survey",
  "retention-risk-feed",
  "manager-sentiment-stream"
] as const;
export type CultureToolId = (typeof CULTUREPULSE_TOOL_IDS)[number];

export const CultureToolInputSchema = z
  .object({
    endDate: isoDateSchema,
    segments: z.array(CultureSegmentSchema).min(1),
    startDate: isoDateSchema,
    tenantId: z.string().trim().min(1)
  })
  .strict();
export type CultureToolInput = z.infer<typeof CultureToolInputSchema>;

export const EngagementSurveySnapshotSchema = z
  .object({
    eNps: z.number().min(-100).max(100),
    engagementIndex: z.number().min(0).max(100),
    participationRatePct: z.number().min(0).max(100)
  })
  .strict();
export type EngagementSurveySnapshot = z.infer<
  typeof EngagementSurveySnapshotSchema
>;

export const RetentionRiskSnapshotSchema = z
  .object({
    burnoutRiskPct: z.number().min(0).max(100),
    highRiskPopulationPct: z.number().min(0).max(100),
    topDriver: z.string().min(1)
  })
  .strict();
export type RetentionRiskSnapshot = z.infer<typeof RetentionRiskSnapshotSchema>;

export const ManagerSentimentSnapshotSchema = z
  .object({
    coachingEffectivenessPct: z.number().min(0).max(100),
    communicationClarityPct: z.number().min(0).max(100),
    topTheme: z.string().min(1)
  })
  .strict();
export type ManagerSentimentSnapshot = z.infer<
  typeof ManagerSentimentSnapshotSchema
>;

export interface CulturePulseToolAdapters {
  fetchEngagementSurvey(input: CultureToolInput): Promise<EngagementSurveySnapshot>;
  fetchManagerSentiment(input: CultureToolInput): Promise<ManagerSentimentSnapshot>;
  fetchRetentionRisk(input: CultureToolInput): Promise<RetentionRiskSnapshot>;
}

function deterministic(seed: string, min: number, max: number): number {
  const digest = createHash("sha256").update(seed).digest("hex");
  const parsed = Number.parseInt(digest.slice(0, 10), 16);
  const ratio = parsed / Number.parseInt("ffffffffff", 16);
  return min + (max - min) * ratio;
}

export function normalizeCultureToolId(toolId: string): CultureToolId | null {
  const normalized = toolId
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

  if (normalized === "engagement-survey") {
    return "engagement-survey";
  }
  if (normalized === "retention-risk-feed") {
    return "retention-risk-feed";
  }
  if (normalized === "manager-sentiment-stream") {
    return "manager-sentiment-stream";
  }

  return null;
}

export function createDefaultCulturePulseToolAdapters(): CulturePulseToolAdapters {
  return {
    async fetchEngagementSurvey(
      input: CultureToolInput
    ): Promise<EngagementSurveySnapshot> {
      CultureToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.startDate}:${input.endDate}:engagement`;

      return EngagementSurveySnapshotSchema.parse({
        eNps: Number(deterministic(`${seed}:enps`, -20, 62).toFixed(2)),
        engagementIndex: Number(
          deterministic(`${seed}:engagement-index`, 48, 89).toFixed(2)
        ),
        participationRatePct: Number(
          deterministic(`${seed}:participation`, 62, 97).toFixed(2)
        )
      });
    },

    async fetchManagerSentiment(
      input: CultureToolInput
    ): Promise<ManagerSentimentSnapshot> {
      CultureToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.startDate}:${input.endDate}:manager`;

      return ManagerSentimentSnapshotSchema.parse({
        coachingEffectivenessPct: Number(
          deterministic(`${seed}:coaching`, 41, 90).toFixed(2)
        ),
        communicationClarityPct: Number(
          deterministic(`${seed}:communication`, 39, 93).toFixed(2)
        ),
        topTheme:
          deterministic(`${seed}:theme`, 0, 1) > 0.5
            ? "leadership visibility and decision transparency"
            : "manager coaching consistency across teams"
      });
    },

    async fetchRetentionRisk(input: CultureToolInput): Promise<RetentionRiskSnapshot> {
      CultureToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.startDate}:${input.endDate}:retention`;

      return RetentionRiskSnapshotSchema.parse({
        burnoutRiskPct: Number(deterministic(`${seed}:burnout`, 11, 46).toFixed(2)),
        highRiskPopulationPct: Number(
          deterministic(`${seed}:high-risk`, 6, 32).toFixed(2)
        ),
        topDriver:
          deterministic(`${seed}:driver`, 0, 1) > 0.5
            ? "workload concentration in strategic squads"
            : "career progression visibility below expectations"
      });
    }
  };
}
