// [SOURCE] BirthHub360_Agentes_Parallel_Plan - ExpansionMapper
import { createHash } from "node:crypto";

import { z } from "zod";

import { ExpansionSegmentSchema } from "./schemas.js";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const EXPANSIONMAPPER_TOOL_IDS = [
  "territory-intelligence-feed",
  "product-adoption-map",
  "whitespace-scoring-engine"
] as const;
export type ExpansionToolId = (typeof EXPANSIONMAPPER_TOOL_IDS)[number];

export const ExpansionToolInputSchema = z
  .object({
    endDate: isoDateSchema,
    segments: z.array(ExpansionSegmentSchema).min(1),
    startDate: isoDateSchema,
    targetExpansionArr: z.number().positive(),
    tenantId: z.string().trim().min(1)
  })
  .strict();
export type ExpansionToolInput = z.infer<typeof ExpansionToolInputSchema>;

export const TerritoryIntelligenceSnapshotSchema = z
  .object({
    expansionCoveragePct: z.number().min(0).max(100),
    geoMomentumIndex: z.number().min(0).max(100),
    topRegion: z.string().min(1)
  })
  .strict();
export type TerritoryIntelligenceSnapshot = z.infer<
  typeof TerritoryIntelligenceSnapshotSchema
>;

export const ProductAdoptionSnapshotSchema = z
  .object({
    attachPotentialPct: z.number().min(0).max(100),
    moduleAdoptionGapPct: z.number().min(0).max(100),
    strongestUseCase: z.string().min(1)
  })
  .strict();
export type ProductAdoptionSnapshot = z.infer<typeof ProductAdoptionSnapshotSchema>;

export const WhitespaceScoreSnapshotSchema = z
  .object({
    expansionReadinessPct: z.number().min(0).max(100),
    projectedExpansionArr: z.number().nonnegative(),
    whitespaceScore: z.number().min(0).max(100)
  })
  .strict();
export type WhitespaceScoreSnapshot = z.infer<typeof WhitespaceScoreSnapshotSchema>;

export interface ExpansionMapperToolAdapters {
  fetchProductAdoption(input: ExpansionToolInput): Promise<ProductAdoptionSnapshot>;
  fetchTerritoryIntelligence(
    input: ExpansionToolInput
  ): Promise<TerritoryIntelligenceSnapshot>;
  fetchWhitespaceScoring(input: ExpansionToolInput): Promise<WhitespaceScoreSnapshot>;
}

function deterministic(seed: string, min: number, max: number): number {
  const digest = createHash("sha256").update(seed).digest("hex");
  const parsed = Number.parseInt(digest.slice(0, 10), 16);
  const ratio = parsed / Number.parseInt("ffffffffff", 16);
  return min + (max - min) * ratio;
}

export function normalizeExpansionToolId(toolId: string): ExpansionToolId | null {
  const normalized = toolId
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

  if (normalized === "territory-intelligence-feed") {
    return "territory-intelligence-feed";
  }
  if (normalized === "product-adoption-map") {
    return "product-adoption-map";
  }
  if (normalized === "whitespace-scoring-engine") {
    return "whitespace-scoring-engine";
  }
  return null;
}

export function createDefaultExpansionMapperToolAdapters(): ExpansionMapperToolAdapters {
  return {
    async fetchProductAdoption(
      input: ExpansionToolInput
    ): Promise<ProductAdoptionSnapshot> {
      ExpansionToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.segments.join(",")}:adoption`;
      return ProductAdoptionSnapshotSchema.parse({
        attachPotentialPct: Number(deterministic(`${seed}:attach`, 24, 76).toFixed(2)),
        moduleAdoptionGapPct: Number(deterministic(`${seed}:gap`, 8, 43).toFixed(2)),
        strongestUseCase:
          deterministic(`${seed}:usecase`, 0, 1) > 0.5
            ? "workflow automation bundles for enterprise accounts"
            : "analytics expansion packs for strategic customer segments"
      });
    },

    async fetchTerritoryIntelligence(
      input: ExpansionToolInput
    ): Promise<TerritoryIntelligenceSnapshot> {
      ExpansionToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.startDate}:${input.endDate}:territory`;
      return TerritoryIntelligenceSnapshotSchema.parse({
        expansionCoveragePct: Number(deterministic(`${seed}:coverage`, 31, 87).toFixed(2)),
        geoMomentumIndex: Number(deterministic(`${seed}:momentum`, 26, 92).toFixed(2)),
        topRegion:
          deterministic(`${seed}:region`, 0, 1) > 0.5
            ? "LatAm South"
            : "Iberia and Southern Europe"
      });
    },

    async fetchWhitespaceScoring(
      input: ExpansionToolInput
    ): Promise<WhitespaceScoreSnapshot> {
      ExpansionToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.targetExpansionArr}:whitespace`;
      const readiness = Number(deterministic(`${seed}:readiness`, 38, 91).toFixed(2));
      const projected = Number(
        (input.targetExpansionArr * (readiness / 100) * 0.94).toFixed(2)
      );
      return WhitespaceScoreSnapshotSchema.parse({
        expansionReadinessPct: readiness,
        projectedExpansionArr: projected,
        whitespaceScore: Number(deterministic(`${seed}:score`, 22, 95).toFixed(2))
      });
    }
  };
}
