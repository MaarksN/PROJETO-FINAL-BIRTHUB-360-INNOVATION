// [SOURCE] BirthHub360_Agentes_Parallel_Plan - CapitalAllocator
import { createHash } from "node:crypto";

import { z } from "zod";

import { AllocationObjectiveSchema } from "./schemas.js";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const CAPITALALLOCATOR_TOOL_IDS = [
  "cashflow-forecast-feed",
  "portfolio-scenario-engine",
  "strategic-priority-feed"
] as const;
export type CapitalToolId = (typeof CAPITALALLOCATOR_TOOL_IDS)[number];

export const CapitalToolInputSchema = z
  .object({
    businessUnits: z.array(z.string().trim().min(1)).min(1),
    capitalBudget: z.number().positive(),
    endDate: isoDateSchema,
    objectives: z.array(AllocationObjectiveSchema).min(1),
    planningHorizonMonths: z.number().int().min(1).max(36),
    startDate: isoDateSchema,
    tenantId: z.string().trim().min(1)
  })
  .strict();
export type CapitalToolInput = z.infer<typeof CapitalToolInputSchema>;

export const CashflowForecastSnapshotSchema = z
  .object({
    monthlyRunwayMonths: z.number().min(0),
    reserveBufferPct: z.number().min(0).max(100),
    stressLiquidityPct: z.number().min(0).max(100)
  })
  .strict();
export type CashflowForecastSnapshot = z.infer<
  typeof CashflowForecastSnapshotSchema
>;

export const PortfolioScenarioSnapshotSchema = z
  .object({
    baselineReturnPct: z.number(),
    downsideRiskPct: z.number().min(0).max(100),
    upsideReturnPct: z.number()
  })
  .strict();
export type PortfolioScenarioSnapshot = z.infer<
  typeof PortfolioScenarioSnapshotSchema
>;

export const StrategicPrioritySnapshotSchema = z
  .object({
    topObjective: AllocationObjectiveSchema,
    transformationUrgencyPct: z.number().min(0).max(100),
    unitPriorityScore: z.number().min(0).max(100)
  })
  .strict();
export type StrategicPrioritySnapshot = z.infer<
  typeof StrategicPrioritySnapshotSchema
>;

export interface CapitalAllocatorToolAdapters {
  fetchCashflowForecast(input: CapitalToolInput): Promise<CashflowForecastSnapshot>;
  fetchPortfolioScenario(input: CapitalToolInput): Promise<PortfolioScenarioSnapshot>;
  fetchStrategicPriority(input: CapitalToolInput): Promise<StrategicPrioritySnapshot>;
}

function deterministic(seed: string, min: number, max: number): number {
  const digest = createHash("sha256").update(seed).digest("hex");
  const parsed = Number.parseInt(digest.slice(0, 10), 16);
  const ratio = parsed / Number.parseInt("ffffffffff", 16);
  return min + (max - min) * ratio;
}

export function normalizeCapitalToolId(toolId: string): CapitalToolId | null {
  const normalized = toolId
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

  if (normalized === "cashflow-forecast-feed") {
    return "cashflow-forecast-feed";
  }
  if (normalized === "portfolio-scenario-engine") {
    return "portfolio-scenario-engine";
  }
  if (normalized === "strategic-priority-feed") {
    return "strategic-priority-feed";
  }
  return null;
}

export function createDefaultCapitalAllocatorToolAdapters(): CapitalAllocatorToolAdapters {
  return {
    async fetchCashflowForecast(
      input: CapitalToolInput
    ): Promise<CashflowForecastSnapshot> {
      CapitalToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.capitalBudget}:${input.startDate}:${input.endDate}:cashflow`;
      return CashflowForecastSnapshotSchema.parse({
        monthlyRunwayMonths: Number(deterministic(`${seed}:runway`, 8, 26).toFixed(2)),
        reserveBufferPct: Number(deterministic(`${seed}:buffer`, 9, 41).toFixed(2)),
        stressLiquidityPct: Number(deterministic(`${seed}:stress`, 7, 54).toFixed(2))
      });
    },

    async fetchPortfolioScenario(
      input: CapitalToolInput
    ): Promise<PortfolioScenarioSnapshot> {
      CapitalToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.planningHorizonMonths}:${input.objectives.join(",")}:portfolio`;
      return PortfolioScenarioSnapshotSchema.parse({
        baselineReturnPct: Number(deterministic(`${seed}:baseline`, 3, 19).toFixed(2)),
        downsideRiskPct: Number(deterministic(`${seed}:downside`, 8, 49).toFixed(2)),
        upsideReturnPct: Number(deterministic(`${seed}:upside`, 10, 34).toFixed(2))
      });
    },

    async fetchStrategicPriority(
      input: CapitalToolInput
    ): Promise<StrategicPrioritySnapshot> {
      CapitalToolInputSchema.parse(input);
      const seed = `${input.tenantId}:${input.businessUnits.join(",")}:${input.objectives.join(",")}:priority`;
      const chosenObjective =
        input.objectives[Math.floor(deterministic(`${seed}:idx`, 0, input.objectives.length))] ??
        "growth";

      return StrategicPrioritySnapshotSchema.parse({
        topObjective: chosenObjective,
        transformationUrgencyPct: Number(
          deterministic(`${seed}:urgency`, 15, 93).toFixed(2)
        ),
        unitPriorityScore: Number(deterministic(`${seed}:score`, 22, 96).toFixed(2))
      });
    }
  };
}
