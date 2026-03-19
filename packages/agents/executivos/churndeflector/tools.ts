// [SOURCE] BirthHub360_Agentes_Parallel_Plan - ChurnDeflector
import { createHash } from "node:crypto";

import { z } from "zod";

import { ChurnSegmentSchema } from "./schemas.js";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const CHURNDEFLECTOR_TOOL_IDS = [
  "churn-risk-engine",
  "customer-health-feed",
  "renewal-likelihood-feed"
] as const;
export type ChurnToolId = (typeof CHURNDEFLECTOR_TOOL_IDS)[number];

export const ChurnToolInputSchema = z
  .object({
    endDate: isoDateSchema,
    segments: z.array(ChurnSegmentSchema).min(1),
    startDate: isoDateSchema,
    targetGrossRevenueRetentionPct: z.number().positive(),
    tenantId: z.string().trim().min(1)
  })
  .strict();
export type ChurnToolInput = z.infer<typeof ChurnToolInputSchema>;

export const ChurnRiskSnapshotSchema = z
  .object({
    atRiskRevenuePct: z.number().min(0).max(100),
    highRiskAccountsPct: z.number().min(0).max(100),
    topDriver: z.string().min(1)
  })
  .strict();
export type ChurnRiskSnapshot = z.infer<typeof ChurnRiskSnapshotSchema>;

export const CustomerHealthSnapshotSchema = z
  .object({
    healthIndex: z.number().min(0).max(100),
    productAdoptionPct: z.number().min(0).max(100),
    sentimentDriftPct: z.number().min(-100).max(100)
  })
  .strict();
export type CustomerHealthSnapshot = z.infer<typeof CustomerHealthSnapshotSchema>;

export const RenewalLikelihoodSnapshotSchema = z
  .object({
    forecastedRenewalPct: z.number().min(0).max(100),
    nearTermRenewalPct: z.number().min(0).max(100),
    renewalVolatilityPct: z.number().min(0).max(100)
  })
  .strict();
export type RenewalLikelihoodSnapshot = z.infer<
  typeof RenewalLikelihoodSnapshotSchema
>;

export interface ChurnDeflectorToolAdapters {
  fetchChurnRisk(input: ChurnToolInput): Promise<ChurnRiskSnapshot>;
  fetchCustomerHealth(input: ChurnToolInput): Promise<CustomerHealthSnapshot>;
  fetchRenewalLikelihood(input: ChurnToolInput): Promise<RenewalLikelihoodSnapshot>;
}

function deterministic(seed: string, min: number, max: number): number {
  const digest = createHash("sha256").update(seed).digest("hex");
  const parsed = Number.parseInt(digest.slice(0, 10), 16);
  const ratio = parsed / Number.parseInt("ffffffffff", 16);
  return min + (max - min) * ratio;
}

export function normalizeChurnToolId(toolId: string): ChurnToolId | null {
  const normalized = toolId
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

  if (normalized === "churn-risk-engine") {
    return "churn-risk-engine";
  }
  if (normalized === "customer-health-feed") {
    return "customer-health-feed";
  }
  if (normalized === "renewal-likelihood-feed") {
    return "renewal-likelihood-feed";
  }
  return null;
}

export function createDefaultChurnDeflectorToolAdapters(): ChurnDeflectorToolAdapters {
  return {
    async fetchChurnRisk(input: ChurnToolInput): Promise<ChurnRiskSnapshot> {
      ChurnToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.segments.join(",")}:churn-risk`;
      return ChurnRiskSnapshotSchema.parse({
        atRiskRevenuePct: Number(deterministic(`${seed}:revenue`, 8, 39).toFixed(2)),
        highRiskAccountsPct: Number(deterministic(`${seed}:accounts`, 6, 33).toFixed(2)),
        topDriver:
          deterministic(`${seed}:driver`, 0, 1) > 0.5
            ? "adoption decline in expansion modules"
            : "renewal negotiation delays with strategic sponsors"
      });
    },

    async fetchCustomerHealth(
      input: ChurnToolInput
    ): Promise<CustomerHealthSnapshot> {
      ChurnToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.startDate}:${input.endDate}:customer-health`;
      return CustomerHealthSnapshotSchema.parse({
        healthIndex: Number(deterministic(`${seed}:health`, 32, 89).toFixed(2)),
        productAdoptionPct: Number(deterministic(`${seed}:adoption`, 28, 91).toFixed(2)),
        sentimentDriftPct: Number(deterministic(`${seed}:sentiment`, -32, 24).toFixed(2))
      });
    },

    async fetchRenewalLikelihood(
      input: ChurnToolInput
    ): Promise<RenewalLikelihoodSnapshot> {
      ChurnToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.targetGrossRevenueRetentionPct}:renewal`;
      return RenewalLikelihoodSnapshotSchema.parse({
        forecastedRenewalPct: Number(deterministic(`${seed}:forecast`, 61, 96).toFixed(2)),
        nearTermRenewalPct: Number(deterministic(`${seed}:near-term`, 49, 93).toFixed(2)),
        renewalVolatilityPct: Number(deterministic(`${seed}:volatility`, 6, 37).toFixed(2))
      });
    }
  };
}
