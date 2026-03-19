// [SOURCE] BirthHub360_Agentes_Parallel_Plan - PricingOptimizer
import { createHash } from "node:crypto";

import { z } from "zod";

import { PricingSegmentSchema } from "./schemas.js";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const PRICINGOPTIMIZER_TOOL_IDS = [
  "price-elasticity-model",
  "discount-leak-feed",
  "win-rate-feed"
] as const;
export type PricingToolId = (typeof PRICINGOPTIMIZER_TOOL_IDS)[number];

export const PricingToolInputSchema = z
  .object({
    endDate: isoDateSchema,
    segments: z.array(PricingSegmentSchema).min(1),
    startDate: isoDateSchema,
    targetGrossMarginPct: z.number().min(1).max(100),
    tenantId: z.string().trim().min(1)
  })
  .strict();
export type PricingToolInput = z.infer<typeof PricingToolInputSchema>;

export const PriceElasticitySnapshotSchema = z
  .object({
    confidencePct: z.number().min(0).max(100),
    elasticityIndex: z.number().min(0),
    optimalDeltaPct: z.number().min(-30).max(30)
  })
  .strict();
export type PriceElasticitySnapshot = z.infer<typeof PriceElasticitySnapshotSchema>;

export const DiscountLeakSnapshotSchema = z
  .object({
    averageDiscountPct: z.number().min(0).max(100),
    leakageDriver: z.string().min(1),
    unauthorizedDiscountPct: z.number().min(0).max(100)
  })
  .strict();
export type DiscountLeakSnapshot = z.infer<typeof DiscountLeakSnapshotSchema>;

export const WinRateSnapshotSchema = z
  .object({
    baselineWinRatePct: z.number().min(0).max(100),
    projectedWinRatePct: z.number().min(0).max(100),
    sensitivityPct: z.number().min(0).max(100)
  })
  .strict();
export type WinRateSnapshot = z.infer<typeof WinRateSnapshotSchema>;

export interface PricingOptimizerToolAdapters {
  fetchDiscountLeak(input: PricingToolInput): Promise<DiscountLeakSnapshot>;
  fetchPriceElasticity(input: PricingToolInput): Promise<PriceElasticitySnapshot>;
  fetchWinRateImpact(input: PricingToolInput): Promise<WinRateSnapshot>;
}

function deterministic(seed: string, min: number, max: number): number {
  const digest = createHash("sha256").update(seed).digest("hex");
  const parsed = Number.parseInt(digest.slice(0, 10), 16);
  const ratio = parsed / Number.parseInt("ffffffffff", 16);
  return min + (max - min) * ratio;
}

export function normalizePricingToolId(toolId: string): PricingToolId | null {
  const normalized = toolId
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

  if (normalized === "price-elasticity-model") {
    return "price-elasticity-model";
  }
  if (normalized === "discount-leak-feed") {
    return "discount-leak-feed";
  }
  if (normalized === "win-rate-feed") {
    return "win-rate-feed";
  }
  return null;
}

export function createDefaultPricingOptimizerToolAdapters(): PricingOptimizerToolAdapters {
  return {
    async fetchDiscountLeak(input: PricingToolInput): Promise<DiscountLeakSnapshot> {
      PricingToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.segments.join(",")}:discount`;
      return DiscountLeakSnapshotSchema.parse({
        averageDiscountPct: Number(deterministic(`${seed}:avg`, 7, 28).toFixed(2)),
        leakageDriver:
          deterministic(`${seed}:driver`, 0, 1) > 0.5
            ? "manual approvals outside deal desk policy"
            : "regional promo exceptions exceeding approved floor",
        unauthorizedDiscountPct: Number(
          deterministic(`${seed}:unauthorized`, 2, 17).toFixed(2)
        )
      });
    },

    async fetchPriceElasticity(
      input: PricingToolInput
    ): Promise<PriceElasticitySnapshot> {
      PricingToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.startDate}:${input.endDate}:elasticity`;
      return PriceElasticitySnapshotSchema.parse({
        confidencePct: Number(deterministic(`${seed}:confidence`, 58, 93).toFixed(2)),
        elasticityIndex: Number(deterministic(`${seed}:index`, 0.6, 2.4).toFixed(3)),
        optimalDeltaPct: Number(deterministic(`${seed}:delta`, -6, 14).toFixed(2))
      });
    },

    async fetchWinRateImpact(input: PricingToolInput): Promise<WinRateSnapshot> {
      PricingToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.targetGrossMarginPct}:winrate`;
      const baseline = Number(deterministic(`${seed}:baseline`, 19, 46).toFixed(2));
      const sensitivity = Number(deterministic(`${seed}:sensitivity`, 4, 24).toFixed(2));
      return WinRateSnapshotSchema.parse({
        baselineWinRatePct: baseline,
        projectedWinRatePct: Number(
          Math.max(0, Math.min(100, baseline - sensitivity / 2)).toFixed(2)
        ),
        sensitivityPct: sensitivity
      });
    }
  };
}
