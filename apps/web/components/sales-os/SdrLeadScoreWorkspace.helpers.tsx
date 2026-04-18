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
  text: React.ReactNode;
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

import React from "react";

export function compactInsight(text: string): React.ReactNode {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length <= 1) {
    const compact = text.replace(/\s+/g, " ").trim();
    return compact.length > 320 ? `${compact.slice(0, 317)}...` : compact;
  }

  return (
    <ul style={{ margin: 0, paddingLeft: "1.25rem", display: "grid", gap: "0.25rem" }}>
      {lines.slice(0, 5).map((line, index) => {
        // Simple bold parser for markdown **bold**
        const parts = line.split(/(\*\*.*?\*\*)/g).map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });
        return <li key={index}>{parts}</li>;
      })}
      {lines.length > 5 ? <li>...</li> : null}
    </ul>
  );
}
