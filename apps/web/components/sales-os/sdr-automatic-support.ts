import type { SupportedLocale } from "../../lib/i18n";

import type { SdrAutomaticLead } from "./sdr-automatic-data";
import type {
  LeadFilters,
  LiveDashboardMetrics
} from "./sdr-automatic-dashboard";
import {
  getLeadDashboardCopy,
  isEnglish,
  resolveSlaLabel
} from "./sdr-automatic-dashboard.copy";

function findMatchedLead(leads: SdrAutomaticLead[], normalizedQuestion: string): SdrAutomaticLead | undefined {
  return leads.find((lead) => {
    return (
      normalizedQuestion.includes(lead.name.toLowerCase()) ||
      normalizedQuestion.includes(lead.company.toLowerCase()) ||
      normalizedQuestion.includes(lead.email.toLowerCase())
    );
  });
}

function buildSlaReply(
  locale: SupportedLocale,
  metrics: LiveDashboardMetrics,
  breachedLeads: SdrAutomaticLead[]
): string {
  const leadNames = breachedLeads.slice(0, 2).map((lead) => lead.name);
  const highlightedQueue = leadNames.join(isEnglish(locale) ? " and " : " e ");

  if (isEnglish(locale)) {
    return `${metrics.slaViolations} SLA breaches are active right now. The hardest pressure sits on ${highlightedQueue || "the filtered queue"}, so the safest next move is to clear those owners first.`;
  }

  return `${metrics.slaViolations} violacoes de SLA estao ativas agora. A maior pressao esta em ${highlightedQueue || "toda a fila filtrada"}, entao o proximo passo mais seguro e destravar esses owners primeiro.`;
}

function buildMetricsReply(locale: SupportedLocale, metrics: LiveDashboardMetrics): string {
  if (isEnglish(locale)) {
    return `The dashboard is tracking ${metrics.activeLeads} active leads, ${metrics.mqlsGenerated} MQLs, ${metrics.slaViolations} SLA breaches, and ${metrics.aiExecutions} AI runs. The conversion signal remains strongest at the top of the filtered queue.`;
  }

  return `O dashboard esta acompanhando ${metrics.activeLeads} leads ativos, ${metrics.mqlsGenerated} MQLs, ${metrics.slaViolations} violacoes de SLA e ${metrics.aiExecutions} execucoes de IA. O melhor sinal de conversao continua no topo da fila filtrada.`;
}

function buildScoreReply(locale: SupportedLocale, leads: SdrAutomaticLead[]): string {
  const summary = leads
    .slice(0, 3)
    .map((lead) => `${lead.name} (${lead.score})`)
    .join(", ");

  if (isEnglish(locale)) {
    return `The highest scores in the current view are ${summary}. Prioritize the first lead if the team only has one slot this cycle.`;
  }

  return `Os maiores scores na visao atual sao ${summary}. Priorize o primeiro lead se o time tiver apenas um slot neste ciclo.`;
}

function buildFilterReply(locale: SupportedLocale, filters: LeadFilters): string {
  const copy = getLeadDashboardCopy(locale);
  const activeFilters = [
    filters.query ? `${copy.emailColumn}: ${filters.query}` : null,
    filters.stages.length > 0
      ? `${copy.stageFilterLabel}: ${filters.stages.map((stage) => copy.stageLabels[stage]).join(", ")}`
      : null,
    filters.scoreBands.length > 0
      ? `${copy.scoreFilterLabel}: ${filters.scoreBands.map((band) => copy.scoreBandLabels[band]).join(", ")}`
      : null
  ].filter((value): value is string => Boolean(value));

  if (activeFilters.length > 0) {
    return activeFilters.join(" | ");
  }

  return isEnglish(locale)
    ? "No filter is active right now. The table is showing the full recent lead queue."
    : "Nenhum filtro esta ativo agora. A tabela esta mostrando a fila completa de leads recentes.";
}

export function createLeadInsightFallback(
  lead: SdrAutomaticLead,
  locale: SupportedLocale
): string {
  const copy = getLeadDashboardCopy(locale);
  const stageLabel = copy.stageLabels[lead.stage];
  const slaLabel = resolveSlaLabel(locale, lead.slaStatus);

  if (isEnglish(locale)) {
    return `${lead.name} is at ${lead.score} points in ${stageLabel}. The account shows ${slaLabel.toLowerCase()} SLA pressure, solid intent from ${lead.source.toLowerCase()}, and should move with ${lead.action.toLowerCase()}.`;
  }

  return `${lead.name} esta com ${lead.score} pontos em ${stageLabel}. A conta mostra SLA ${slaLabel.toLowerCase()}, sinal forte vindo de ${lead.source.toLowerCase()} e deve avancar com ${lead.action.toLowerCase()}.`;
}

export function buildSupportReply(input: {
  filters: LeadFilters;
  leads: SdrAutomaticLead[];
  locale: SupportedLocale;
  metrics: LiveDashboardMetrics;
  question: string;
}): string {
  const { filters, leads, locale, metrics, question } = input;
  const normalizedQuestion = question.toLowerCase();
  const orderedLeads = [...leads].sort((left, right) => right.score - left.score);
  const matchedLead = findMatchedLead(orderedLeads, normalizedQuestion);

  if (matchedLead) {
    return createLeadInsightFallback(matchedLead, locale);
  }

  if (normalizedQuestion.includes("sla")) {
    return buildSlaReply(
      locale,
      metrics,
      orderedLeads.filter((lead) => lead.slaStatus === "breached")
    );
  }

  if (
    normalizedQuestion.includes("mql") ||
    normalizedQuestion.includes("metrica") ||
    normalizedQuestion.includes("metric")
  ) {
    return buildMetricsReply(locale, metrics);
  }

  if (normalizedQuestion.includes("score") || normalizedQuestion.includes("top")) {
    return buildScoreReply(locale, orderedLeads);
  }

  if (normalizedQuestion.includes("filtro") || normalizedQuestion.includes("filter")) {
    return buildFilterReply(locale, filters);
  }

  const [topLead] = orderedLeads;
  if (topLead) {
    return createLeadInsightFallback(topLead, locale);
  }

  return isEnglish(locale)
    ? "I can help with top leads, SLA pressure, MQL momentum, or the current filter state."
    : "Posso ajudar com top leads, pressao de SLA, ritmo de MQLs ou o estado atual dos filtros.";
}
