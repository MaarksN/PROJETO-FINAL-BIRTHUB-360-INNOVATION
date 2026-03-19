// [SOURCE] BirthHub360_Agentes_Parallel_Plan - PipelineOracle
import { createHash } from "node:crypto";

import { z } from "zod";

import { PipelineSegmentSchema } from "./schemas.js";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const PIPELINEORACLE_TOOL_IDS = [
  "deal-risk-engine",
  "pipeline-health-feed",
  "revenue-attainment-feed"
] as const;
export type PipelineToolId = (typeof PIPELINEORACLE_TOOL_IDS)[number];

export const PipelineToolInputSchema = z
  .object({
    endDate: isoDateSchema,
    segments: z.array(PipelineSegmentSchema).min(1),
    startDate: isoDateSchema,
    targetArr: z.number().positive(),
    tenantId: z.string().trim().min(1)
  })
  .strict();
export type PipelineToolInput = z.infer<typeof PipelineToolInputSchema>;

export const PipelineHealthSnapshotSchema = z
  .object({
    coverageRatio: z.number().min(0),
    slippagePct: z.number().min(0).max(100),
    stageVelocityIndex: z.number().min(0).max(100)
  })
  .strict();
export type PipelineHealthSnapshot = z.infer<typeof PipelineHealthSnapshotSchema>;

export const DealRiskSnapshotSchema = z
  .object({
    atRiskDealPct: z.number().min(0).max(100),
    forecastConfidencePct: z.number().min(0).max(100),
    topRiskDriver: z.string().min(1)
  })
  .strict();
export type DealRiskSnapshot = z.infer<typeof DealRiskSnapshotSchema>;

export const RevenueAttainmentSnapshotSchema = z
  .object({
    currentAttainmentPct: z.number().min(0).max(300),
    gapToTargetPct: z.number(),
    projectedAttainmentPct: z.number().min(0).max(300)
  })
  .strict();
export type RevenueAttainmentSnapshot = z.infer<
  typeof RevenueAttainmentSnapshotSchema
>;

export interface PipelineOracleToolAdapters {
  fetchDealRisk(input: PipelineToolInput): Promise<DealRiskSnapshot>;
  fetchPipelineHealth(input: PipelineToolInput): Promise<PipelineHealthSnapshot>;
  fetchRevenueAttainment(input: PipelineToolInput): Promise<RevenueAttainmentSnapshot>;
}

function deterministic(seed: string, min: number, max: number): number {
  const digest = createHash("sha256").update(seed).digest("hex");
  const parsed = Number.parseInt(digest.slice(0, 10), 16);
  const ratio = parsed / Number.parseInt("ffffffffff", 16);
  return min + (max - min) * ratio;
}

export function normalizePipelineToolId(toolId: string): PipelineToolId | null {
  const normalized = toolId
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

  if (normalized === "deal-risk-engine") {
    return "deal-risk-engine";
  }
  if (normalized === "pipeline-health-feed") {
    return "pipeline-health-feed";
  }
  if (normalized === "revenue-attainment-feed") {
    return "revenue-attainment-feed";
  }
  return null;
}

export function createDefaultPipelineOracleToolAdapters(): PipelineOracleToolAdapters {
  return {
    async fetchDealRisk(input: PipelineToolInput): Promise<DealRiskSnapshot> {
      PipelineToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.segments.join(",")}:dealrisk`;
      return DealRiskSnapshotSchema.parse({
        atRiskDealPct: Number(deterministic(`${seed}:atrisk`, 12, 58).toFixed(2)),
        forecastConfidencePct: Number(
          deterministic(`${seed}:confidence`, 45, 92).toFixed(2)
        ),
        topRiskDriver:
          deterministic(`${seed}:driver`, 0, 1) > 0.5
            ? "late-stage multithreading gaps in top enterprise deals"
            : "pricing pressure in high-volume mid-market opportunities"
      });
    },

    async fetchPipelineHealth(
      input: PipelineToolInput
    ): Promise<PipelineHealthSnapshot> {
      PipelineToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.startDate}:${input.endDate}:health`;
      return PipelineHealthSnapshotSchema.parse({
        coverageRatio: Number(deterministic(`${seed}:coverage`, 0.9, 4.8).toFixed(2)),
        slippagePct: Number(deterministic(`${seed}:slippage`, 6, 43).toFixed(2)),
        stageVelocityIndex: Number(
          deterministic(`${seed}:velocity`, 28, 91).toFixed(2)
        )
      });
    },

    async fetchRevenueAttainment(
      input: PipelineToolInput
    ): Promise<RevenueAttainmentSnapshot> {
      PipelineToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.targetArr}:${input.endDate}:attainment`;
      const projected = Number(deterministic(`${seed}:projected`, 65, 134).toFixed(2));
      return RevenueAttainmentSnapshotSchema.parse({
        currentAttainmentPct: Number(deterministic(`${seed}:current`, 54, 118).toFixed(2)),
        gapToTargetPct: Number((100 - projected).toFixed(2)),
        projectedAttainmentPct: projected
      });
    }
  };
}
