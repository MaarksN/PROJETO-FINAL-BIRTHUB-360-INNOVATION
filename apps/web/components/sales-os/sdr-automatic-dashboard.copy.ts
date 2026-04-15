import type { SupportedLocale } from "../../lib/i18n";

import type { SdrAutomaticLead } from "./sdr-automatic-data";
import type { LeadDashboardCopy } from "./sdr-automatic-dashboard";

export function isEnglish(locale: SupportedLocale): boolean {
  return locale === "en-US";
}

export function getLeadDashboardCopy(locale: SupportedLocale): LeadDashboardCopy {
  if (isEnglish(locale)) {
    return {
      activeLeadsLabel: "Active leads",
      addTaskLabel: "Add task",
      aiAgentLabel: "predictive_lead_scoring",
      aiAnalysisLabel: "AI analysis",
      aiExecutionsLabel: "AI runs",
      aiTooltipEmpty: "No analysis available yet.",
      aiTooltipLoading: "Generating a short analysis...",
      chatbotEmpty: "Ask about top leads, SLA pressure, MQL volume, or the current filters.",
      chatbotGreeting:
        "I can summarize hot leads, explain SLA pressure, and translate the dashboard metrics into next actions.",
      chatbotPromptPlaceholder: "Ask about leads, SLAs, MQLs, or next steps...",
      chatbotQuickPrompts: [
        "Which leads need attention now?",
        "Summarize SLA risk",
        "Who has the highest score?"
      ],
      chatbotSend: "Send",
      chatbotTitle: "Support bot",
      clearFiltersLabel: "Clear filters",
      columnsLabel: "Columns",
      createdAtColumn: "Created at",
      dateFromLabel: "From",
      dateToLabel: "To",
      distributionTitle: "Leads by stage",
      emailColumn: "Email",
      emailSearchPlaceholder: "Search by email...",
      exportCsvLabel: "Export CSV",
      filtersTitle: "Recent leads",
      leadsByStageHint: "Distribution follows the filtered list.",
      leadsTrendTitle: "Lead volume trend",
      leadsTrendSubtitle: "Lead flow and MQL creation over the latest polling windows.",
      leadsVisibleLabel: (visible, total) => `${visible} of ${total} leads visible`,
      metricsUpdatedLabel: (seconds) =>
        seconds === 0 ? "Updated just now" : `Updated ${seconds}s ago`,
      mqlsGeneratedLabel: "MQLs generated",
      nextPageLabel: "Next",
      noLeadsLabel: "No leads match the current filters.",
      noTasksLabel: "No pending tasks yet.",
      pageLabel: (page, totalPages) => `Page ${page} of ${totalPages}`,
      previousPageLabel: "Previous",
      scoreBandLabels: {
        critical: "Critical",
        high: "High",
        warm: "Warm"
      },
      scoreColumn: "Score",
      scoreFilterLabel: "Score bands",
      slaBreachedLabel: "Breached",
      slaColumn: "SLA",
      slaHealthyLabel: "Healthy",
      slaTrendTitle: "SLA trend",
      slaTrendSubtitle: "Violations and compliance rate update with live polling.",
      slaViolationsLabel: "SLA breaches",
      slaWatchLabel: "Watch",
      sourceColumn: "Source",
      stageColumn: "Stage",
      stageFilterLabel: "Stages",
      stageLabels: {
        demo: "Demo",
        negotiation: "Negotiation",
        new: "New",
        proposal: "Proposal",
        qualified: "Qualified"
      },
      taskPlaceholder: "Add a pending task...",
      tasksTitle: "Pending tasks"
    };
  }

  return {
    activeLeadsLabel: "Leads ativos",
    addTaskLabel: "Adicionar tarefa",
    aiAgentLabel: "predictive_lead_scoring",
    aiAnalysisLabel: "Analise de IA",
    aiExecutionsLabel: "Execucoes de IA",
    aiTooltipEmpty: "Nenhuma analise disponivel ainda.",
    aiTooltipLoading: "Gerando uma analise curta...",
    chatbotEmpty: "Pergunte sobre top leads, pressao de SLA, volume de MQLs ou os filtros atuais.",
    chatbotGreeting:
      "Consigo resumir os leads mais quentes, explicar o risco de SLA e traduzir as metricas do dashboard em proximos passos.",
    chatbotPromptPlaceholder: "Pergunte sobre leads, SLAs, MQLs ou proximos passos...",
    chatbotQuickPrompts: [
      "Quais leads exigem atencao agora?",
      "Resuma o risco de SLA",
      "Quem tem maior score?"
    ],
    chatbotSend: "Enviar",
    chatbotTitle: "Chat de suporte",
    clearFiltersLabel: "Limpar filtros",
    columnsLabel: "Colunas",
    createdAtColumn: "Criado em",
    dateFromLabel: "De",
    dateToLabel: "Ate",
    distributionTitle: "Leads por estagio",
    emailColumn: "E-mail",
    emailSearchPlaceholder: "Buscar por e-mail...",
    exportCsvLabel: "Exportar CSV",
    filtersTitle: "Leads Recentes",
    leadsByStageHint: "A distribuicao acompanha a lista filtrada.",
    leadsTrendTitle: "Tendencia de leads",
    leadsTrendSubtitle: "Fluxo de leads e criacao de MQLs nas janelas mais recentes de polling.",
    leadsVisibleLabel: (visible, total) => `${visible} de ${total} leads visiveis`,
    metricsUpdatedLabel: (seconds) =>
      seconds === 0 ? "Atualizado agora" : `Atualizado ha ${seconds}s`,
    mqlsGeneratedLabel: "MQLs gerados",
    nextPageLabel: "Proxima",
    noLeadsLabel: "Nenhum lead corresponde aos filtros atuais.",
    noTasksLabel: "Nenhuma tarefa pendente ainda.",
    pageLabel: (page, totalPages) => `Pagina ${page} de ${totalPages}`,
    previousPageLabel: "Anterior",
    scoreBandLabels: {
      critical: "Critico",
      high: "Alto",
      warm: "Quente"
    },
    scoreColumn: "Score",
    scoreFilterLabel: "Faixas de score",
    slaBreachedLabel: "Violado",
    slaColumn: "SLA",
    slaHealthyLabel: "Saudavel",
    slaTrendTitle: "Tendencia de SLA",
    slaTrendSubtitle: "Violacoes e taxa de conformidade atualizadas com polling em tempo real.",
    slaViolationsLabel: "Violacoes de SLA",
    slaWatchLabel: "Atencao",
    sourceColumn: "Origem",
    stageColumn: "Estagio",
    stageFilterLabel: "Estagios",
    stageLabels: {
      demo: "Demo",
      negotiation: "Negociacao",
      new: "Novo",
      proposal: "Proposta",
      qualified: "Qualificado"
    },
    taskPlaceholder: "Adicionar uma tarefa pendente...",
    tasksTitle: "Tarefas Pendentes"
  };
}

export function resolveSlaLabel(
  locale: SupportedLocale,
  status: SdrAutomaticLead["slaStatus"]
): string {
  const copy = getLeadDashboardCopy(locale);

  if (status === "breached") {
    return copy.slaBreachedLabel;
  }

  if (status === "watch") {
    return copy.slaWatchLabel;
  }

  return copy.slaHealthyLabel;
}
