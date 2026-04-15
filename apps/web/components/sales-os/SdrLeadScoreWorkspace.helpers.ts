import type { SdrAutomaticLead } from "./sdr-automatic-data";
import { getScoreBand } from "./sdr-automatic-dashboard";

export type SupportMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

export type LeadInsightState = {
  source: string;
  status: "error" | "loading" | "ready";
  text: string;
};

export function buildId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export function buildScoreFillColor(score: number): string {
  const band = getScoreBand(score);

  if (band === "critical") {
    return "#ef4444";
  }

  if (band === "high") {
    return "#f59e0b";
  }

  return "#38bdf8";
}

export function buildStageColor(stage: SdrAutomaticLead["stage"]): string {
  switch (stage) {
    case "proposal":
      return "#f97316";
    case "negotiation":
      return "#ef4444";
    case "demo":
      return "#0ea5e9";
    case "qualified":
      return "#14b8a6";
    case "new":
    default:
      return "#8b5cf6";
  }
}

export function compactInsight(text: string): string {
  const compact = text.replace(/\s+/g, " ").trim();
  return compact.length > 320 ? `${compact.slice(0, 317)}...` : compact;
}
