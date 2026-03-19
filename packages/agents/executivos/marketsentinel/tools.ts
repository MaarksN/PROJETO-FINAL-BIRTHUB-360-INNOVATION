// [SOURCE] BirthHub360_Agentes_Parallel_Plan - MarketSentinel
import { createHash } from "node:crypto";

import { z } from "zod";

import { MarketScopeSchema } from "./schemas.js";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const MARKETSENTINEL_TOOL_IDS = [
  "macro-signal-feed",
  "competitor-watch",
  "sentiment-stream"
] as const;
export type MarketToolId = (typeof MARKETSENTINEL_TOOL_IDS)[number];

export const MarketToolInputSchema = z
  .object({
    endDate: isoDateSchema,
    scope: MarketScopeSchema,
    startDate: isoDateSchema,
    tenantId: z.string().trim().min(1)
  })
  .strict();
export type MarketToolInput = z.infer<typeof MarketToolInputSchema>;

export const MacroSignalSnapshotSchema = z
  .object({
    inflationPressure: z.number().min(0).max(100),
    liquidityIndex: z.number().min(0).max(100),
    demandMomentum: z.number().min(-100).max(100)
  })
  .strict();
export type MacroSignalSnapshot = z.infer<typeof MacroSignalSnapshotSchema>;

export const CompetitorWatchSnapshotSchema = z
  .object({
    leadingMove: z.string().min(1),
    pricingAggressiveness: z.number().min(0).max(100),
    releaseVelocity: z.number().min(0).max(100)
  })
  .strict();
export type CompetitorWatchSnapshot = z.infer<typeof CompetitorWatchSnapshotSchema>;

export const SentimentStreamSnapshotSchema = z
  .object({
    negativeMentionsPct: z.number().min(0).max(100),
    positiveMentionsPct: z.number().min(0).max(100),
    topicShift: z.string().min(1)
  })
  .strict();
export type SentimentStreamSnapshot = z.infer<typeof SentimentStreamSnapshotSchema>;

export interface MarketSentinelToolAdapters {
  fetchCompetitorWatch(input: MarketToolInput): Promise<CompetitorWatchSnapshot>;
  fetchMacroSignalFeed(input: MarketToolInput): Promise<MacroSignalSnapshot>;
  fetchSentimentStream(input: MarketToolInput): Promise<SentimentStreamSnapshot>;
}

function deterministic(seed: string, min: number, max: number): number {
  const digest = createHash("sha256").update(seed).digest("hex");
  const parsed = Number.parseInt(digest.slice(0, 10), 16);
  const ratio = parsed / Number.parseInt("ffffffffff", 16);
  return min + (max - min) * ratio;
}

export function normalizeMarketToolId(toolId: string): MarketToolId | null {
  const normalized = toolId
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

  if (normalized === "macro-signal-feed") {
    return "macro-signal-feed";
  }
  if (normalized === "competitor-watch") {
    return "competitor-watch";
  }
  if (normalized === "sentiment-stream") {
    return "sentiment-stream";
  }

  return null;
}

export function createDefaultMarketSentinelToolAdapters(): MarketSentinelToolAdapters {
  return {
    async fetchCompetitorWatch(
      input: MarketToolInput
    ): Promise<CompetitorWatchSnapshot> {
      MarketToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.scope}:${input.startDate}:${input.endDate}:cw`;
      return CompetitorWatchSnapshotSchema.parse({
        leadingMove:
          deterministic(`${seed}:move`, 0, 1) > 0.5
            ? "major competitor launched bundled annual pricing."
            : "top competitor expanded enterprise channel partnerships.",
        pricingAggressiveness: Number(deterministic(`${seed}:price`, 25, 82).toFixed(2)),
        releaseVelocity: Number(deterministic(`${seed}:release`, 30, 95).toFixed(2))
      });
    },

    async fetchMacroSignalFeed(input: MarketToolInput): Promise<MacroSignalSnapshot> {
      MarketToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.scope}:${input.startDate}:${input.endDate}:macro`;
      return MacroSignalSnapshotSchema.parse({
        demandMomentum: Number(deterministic(`${seed}:demand`, -40, 55).toFixed(2)),
        inflationPressure: Number(deterministic(`${seed}:inflation`, 22, 71).toFixed(2)),
        liquidityIndex: Number(deterministic(`${seed}:liquidity`, 35, 88).toFixed(2))
      });
    },

    async fetchSentimentStream(
      input: MarketToolInput
    ): Promise<SentimentStreamSnapshot> {
      MarketToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.scope}:${input.startDate}:${input.endDate}:sentiment`;
      const positive = Number(deterministic(`${seed}:positive`, 31, 76).toFixed(2));
      const negative = Number(deterministic(`${seed}:negative`, 9, 38).toFixed(2));
      return SentimentStreamSnapshotSchema.parse({
        negativeMentionsPct: negative,
        positiveMentionsPct: positive,
        topicShift:
          positive >= negative
            ? "market narrative shifted to efficiency-led growth."
            : "market narrative shifted to risk and retention concerns."
      });
    }
  };
}

