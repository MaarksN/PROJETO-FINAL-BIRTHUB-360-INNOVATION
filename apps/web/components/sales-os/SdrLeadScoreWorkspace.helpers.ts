import type { SupportedLocale } from "../../lib/i18n";

import type { SdrAutomaticLead } from "./sdr-automatic-data";
import {
  calculateChurnRiskScore,
  getLeadDashboardCopy,
  getLeadEngagementBoost,
  getLeadSupportPenalty,
  getScoreBand,
  getSequencePlan,
  resolveSlaLabel
} from "./sdr-automatic-dashboard";
import { createLeadInsightFallback } from "./sdr-automatic-support";

export type SupportMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

export type LeadInsightDetail = {
  highlights: string[];
  recommendedActions: string[];
  scoreBreakdown: Array<{
    label: string;
    value: string;
  }>;
  summary: string;
};

export type LeadInsightState = {
  detail: LeadInsightDetail;
  source: string;
  status: "error" | "loading" | "ready";
};

export function buildId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export function buildScoreFillColor(score: number): string {
  const band = getScoreBand(score);

  if (band === "critical") {
    return "#f97316";
  }

  if (band === "high") {
    return "#f59e0b";
  }

  return "#0ea5e9";
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
      return "#22c55e";
  }
}

export function buildSequenceStatusTone(status: SdrAutomaticLead["sequenceStatus"]) {
  if (status === "completed") {
    return "healthy" as const;
  }

  if (status === "paused") {
    return "watch" as const;
  }

  return "active" as const;
}

export function compactInsight(text: string): string {
  const compact = text.replace(/\s+/g, " ").trim();
  return compact.length > 420 ? `${compact.slice(0, 417)}...` : compact;
}

export function buildLeadInsightDetail(
  lead: SdrAutomaticLead,
  locale: SupportedLocale,
  agentSummary?: string
): LeadInsightDetail {
  const copy = getLeadDashboardCopy(locale);
  const engagement = lead.engagement ?? {
    emailClicks: 0,
    hotPages: [],
    lastTouchpointAt: lead.createdAt,
    pageVisits: 0
  };
  const engagementBoost = getLeadEngagementBoost(lead);
  const supportPenalty = getLeadSupportPenalty(lead);
  const sequencePlan = getSequencePlan(lead, locale);
  const churnRisk = calculateChurnRiskScore(lead);
  const fallbackSummary = createLeadInsightFallback(lead, locale);
  const summary = compactInsight(agentSummary && agentSummary.trim().length > 0 ? agentSummary : fallbackSummary);

  return {
    highlights: [
      locale === "en-US"
        ? `${engagement.emailClicks} email clicks and ${engagement.pageVisits} high-intent page visits from ${copy.regionLabels[lead.region ?? "latin-america"]}.`
        : `${engagement.emailClicks} cliques em e-mail e ${engagement.pageVisits} visitas de alta intencao vindas de ${copy.regionLabels[lead.region ?? "latin-america"]}.`,
      locale === "en-US"
        ? `Key pages: ${engagement.hotPages.slice(0, 3).join(", ")}.`
        : `Paginas-chave: ${engagement.hotPages.slice(0, 3).join(", ")}.`,
      locale === "en-US"
        ? `SLA is ${resolveSlaLabel(locale, lead.slaStatus).toLowerCase()} and churn pressure is ${churnRisk}/100.`
        : `SLA esta ${resolveSlaLabel(locale, lead.slaStatus).toLowerCase()} e a pressao de churn esta em ${churnRisk}/100.`
    ],
    recommendedActions: [
      locale === "en-US"
        ? `Primary next step: ${lead.action}.`
        : `Proximo passo principal: ${lead.action}.`,
      locale === "en-US"
        ? `Trigger sequence: ${sequencePlan.primarySubject}.`
        : `Disparar sequencia: ${sequencePlan.primarySubject}.`,
      locale === "en-US"
        ? `Owner focus: unblock ${lead.owner} before the score cools down.`
        : `Foco do owner: destravar ${lead.owner} antes que o score esfrie.`
    ],
    scoreBreakdown: [
      {
        label: locale === "en-US" ? "Base fit" : "Fit base",
        value: `${lead.baseScore}`
      },
      {
        label: locale === "en-US" ? "Engagement lift" : "Ganho de engajamento",
        value: `+${engagementBoost}`
      },
      {
        label: locale === "en-US" ? "Churn drag" : "Arrasto de churn",
        value: `-${supportPenalty}`
      },
      {
        label: locale === "en-US" ? "Final predictive score" : "Score preditivo final",
        value: `${lead.score}`
      }
    ],
    summary
  };
}
