// [SOURCE] BirthHub360_Agentes_Parallel_Plan — BoardPrep AI
import { createHash } from "node:crypto";

import { z } from "zod";

import { BoardAudienceSchema } from "./schemas.js";

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected date in YYYY-MM-DD format.");

export const BOARDPREP_TOOL_IDS = [
  "board-report-generator",
  "kpi-dashboard",
  "budget-forecaster"
] as const;
export type BoardPrepToolId = (typeof BOARDPREP_TOOL_IDS)[number];

export const BoardPrepToolInputSchema = z
  .object({
    audience: BoardAudienceSchema,
    currency: z.string().trim().length(3),
    endDate: isoDateSchema,
    startDate: isoDateSchema,
    tenantId: z.string().trim().min(1)
  })
  .strict();
export type BoardPrepToolInput = z.infer<typeof BoardPrepToolInputSchema>;

export const KpiDashboardSnapshotSchema = z
  .object({
    churnRatePct: z.number().min(0),
    npsScore: z.number().min(0).max(100),
    pipelineCoverageRatio: z.number().min(0),
    revenueGrowthPct: z.number(),
    topRisk: z.string().min(1)
  })
  .strict();
export type KpiDashboardSnapshot = z.infer<typeof KpiDashboardSnapshotSchema>;

export const BoardReportTemplateSchema = z
  .object({
    mandatorySections: z.array(z.string().min(1)).min(1),
    narrativeLens: z.string().min(1),
    tone: z.enum(["assertive", "neutral"])
  })
  .strict();
export type BoardReportTemplate = z.infer<typeof BoardReportTemplateSchema>;

export const BudgetForecastSchema = z
  .object({
    cashRunwayMonths: z.number().min(0),
    fxRiskLevel: z.enum(["high", "low", "medium"]),
    investmentCapacityPct: z.number().min(0).max(100),
    monthlyBurnRate: z.number().min(0)
  })
  .strict();
export type BudgetForecast = z.infer<typeof BudgetForecastSchema>;

export interface BoardPrepToolAdapters {
  fetchBoardReportTemplate(input: BoardPrepToolInput): Promise<BoardReportTemplate>;
  fetchBudgetForecast(input: BoardPrepToolInput): Promise<BudgetForecast>;
  fetchKpiDashboard(input: BoardPrepToolInput): Promise<KpiDashboardSnapshot>;
}

function deterministicNumber(seed: string, min: number, max: number): number {
  const hash = createHash("sha256").update(seed).digest("hex");
  const numeric = Number.parseInt(hash.slice(0, 10), 16);
  const ratio = numeric / Number.parseInt("ffffffffff", 16);
  return min + (max - min) * ratio;
}

export function normalizeToolId(toolId: string): BoardPrepToolId | null {
  const normalized = toolId
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");

  if (normalized === "board-report-generator") {
    return "board-report-generator";
  }
  if (normalized === "kpi-dashboard") {
    return "kpi-dashboard";
  }
  if (normalized === "budget-forecaster") {
    return "budget-forecaster";
  }

  return null;
}

export function createDefaultBoardPrepToolAdapters(): BoardPrepToolAdapters {
  return {
    async fetchBoardReportTemplate(
      input: BoardPrepToolInput
    ): Promise<BoardReportTemplate> {
      BoardPrepToolInputSchema.parse(input);
      return BoardReportTemplateSchema.parse({
        mandatorySections: [
          "Strategic KPIs",
          "Risk Radar",
          "Capital Allocation",
          "Next Board Decisions"
        ],
        narrativeLens:
          input.audience === "investors"
            ? "capital discipline and growth resilience"
            : "execution focus and risk-adjusted growth",
        tone: "assertive"
      });
    },

    async fetchBudgetForecast(input: BoardPrepToolInput): Promise<BudgetForecast> {
      BoardPrepToolInputSchema.parse(input);
      const baseSeed = `${input.tenantId}:${input.startDate}:${input.endDate}:budget`;

      return BudgetForecastSchema.parse({
        cashRunwayMonths: Number(deterministicNumber(baseSeed, 8, 24).toFixed(1)),
        fxRiskLevel:
          deterministicNumber(`${baseSeed}:fx`, 0, 1) > 0.66
            ? "high"
            : deterministicNumber(`${baseSeed}:fx-mid`, 0, 1) > 0.33
              ? "medium"
              : "low",
        investmentCapacityPct: Number(
          deterministicNumber(`${baseSeed}:cap`, 12, 48).toFixed(1)
        ),
        monthlyBurnRate: Number(
          deterministicNumber(`${baseSeed}:burn`, 250_000, 780_000).toFixed(2)
        )
      });
    },

    async fetchKpiDashboard(input: BoardPrepToolInput): Promise<KpiDashboardSnapshot> {
      BoardPrepToolInputSchema.parse(input);
      const baseSeed = `${input.tenantId}:${input.startDate}:${input.endDate}:kpi`;
      const churn = Number(deterministicNumber(`${baseSeed}:churn`, 1.1, 6.8).toFixed(2));
      const growth = Number(
        deterministicNumber(`${baseSeed}:growth`, -4.2, 16.4).toFixed(2)
      );

      return KpiDashboardSnapshotSchema.parse({
        churnRatePct: churn,
        npsScore: Number(deterministicNumber(`${baseSeed}:nps`, 28, 77).toFixed(0)),
        pipelineCoverageRatio: Number(
          deterministicNumber(`${baseSeed}:coverage`, 1.1, 4.2).toFixed(2)
        ),
        revenueGrowthPct: growth,
        topRisk:
          churn > 5
            ? "renewal deterioration on enterprise segment"
            : "pipeline concentration above target threshold"
      });
    }
  };
}
