import type { SupportedLocale } from "../../lib/i18n";

export type SdrAutomaticLead = {
  action: string;
  company: string;
  name: string;
  priority: string;
  priorityTone: "critical" | "high" | "warm";
  role: string;
  score: number;
  source: string;
};

export type SdrAutomaticTimeSlot = {
  label: string;
  recommended?: boolean;
};

export type SdrAutomaticCopy = {
  actionPrimary: string;
  agendaCaption: string;
  agendaHelper: string;
  agendaSubtitle: string;
  agendaTitle: string;
  assistantHint: string;
  assistantSubtitle: string;
  assistantTitle: string;
  callFocus: string;
  handoffSubtitle: string;
  handoffTitle: string;
  heroDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  leadSubtitle: string;
  leadTitle: string;
  metrics: Array<{ label: string; value: string }>;
  moduleLabel: string;
  nextStepLabel: string;
  quickBrief: string;
  salesRepName: string;
  salesRepRole: string;
  sidebarTitle: string;
  spinLabel: string;
  summaryLabel: string;
  tableAction: string;
  tableLead: string;
  tablePriority: string;
  tableScore: string;
  tableSource: string;
  timelineLabel: string;
};

export function toneForScore(score: number): "critical" | "high" | "warm" {
  if (score >= 90) {
    return "critical";
  }

  if (score >= 75) {
    return "high";
  }

  return "warm";
}

export function getSdrAutomaticConfig(locale: SupportedLocale): {
  copy: SdrAutomaticCopy;
  leads: SdrAutomaticLead[];
  timeSlots: SdrAutomaticTimeSlot[];
} {
  const english = locale === "en-US";

  const copy: SdrAutomaticCopy = english
    ? {
        actionPrimary: "Send to closer",
        agendaCaption: "Three best-fit slots based on segment, conversion history, and calendar load.",
        agendaHelper: "Recommended closer",
        agendaSubtitle: "Schedule the demo with the best closer for the account.",
        agendaTitle: "Co-pilot: Intelligent Scheduler",
        assistantHint: "Qualification call with Julia Andrade at Connecta Corp.",
        assistantSubtitle: "Conversation support grounded in SPIN Selling.",
        assistantTitle: "Co-pilot: Method Assistant",
        callFocus: "Live notes",
        handoffSubtitle: "Give the closer enough context to enter the meeting with precision.",
        handoffTitle: "Co-pilot: Handoff Briefing",
        heroDescription:
          "Interactive prototype of the SDR Automatic 360 platform inside the BirthHub Sales OS.",
        heroEyebrow: "SDR Platform",
        heroTitle: "BirthHub 360 SDR Automatic",
        leadSubtitle: "Rank the hottest opportunities before the queue gets noisy.",
        leadTitle: "Co-pilot: Predictive Lead Score",
        metrics: [
          { label: "Critical leads", value: "06" },
          { label: "Calls this morning", value: "11" },
          { label: "Meetings in pipeline", value: "04" }
        ],
        moduleLabel: "SDR module",
        nextStepLabel: "Next move",
        quickBrief: "Account signal",
        salesRepName: "Lucas Mendes",
        salesRepRole: "SDR",
        sidebarTitle: "Birth Hub 360",
        spinLabel: "SPIN guidance",
        summaryLabel: "Conversion path",
        tableAction: "Action",
        tableLead: "Lead",
        tablePriority: "Priority",
        tableScore: "Lead score",
        tableSource: "Source",
        timelineLabel: "Calendar fit"
      }
    : {
        actionPrimary: "Enviar para o closer",
        agendaCaption: "Tres melhores horarios com base em segmento, historico de conversao e carga de agenda.",
        agendaHelper: "Closer recomendado",
        agendaSubtitle: "Agende a demonstracao com o closer certo para essa conta.",
        agendaTitle: "Co-piloto: Agendador Inteligente",
        assistantHint: "Ligacao de qualificacao com Julia Andrade na Connecta Corp.",
        assistantSubtitle: "Suporte de conversa orientado por SPIN Selling.",
        assistantTitle: "Co-piloto: Assistente Metodologico",
        callFocus: "Anotacoes da chamada",
        handoffSubtitle: "Entregue contexto suficiente para o closer entrar na reuniao com precisao.",
        handoffTitle: "Co-piloto: Briefing de Handoff",
        heroDescription:
          "Prototipo interativo da plataforma SDR Automatic 360 dentro do ecossistema Sales OS da BirthHub.",
        heroEyebrow: "Plataforma SDR",
        heroTitle: "BirthHub 360 SDR Automatic",
        leadSubtitle: "Priorize as oportunidades mais quentes antes que a fila fique ruidosa.",
        leadTitle: "Co-piloto: Lead Score Preditivo",
        metrics: [
          { label: "Leads criticos", value: "06" },
          { label: "Ligacoes hoje cedo", value: "11" },
          { label: "Reunioes no pipeline", value: "04" }
        ],
        moduleLabel: "Modulo SDR",
        nextStepLabel: "Proximo passo",
        quickBrief: "Sinal da conta",
        salesRepName: "Lucas Mendes",
        salesRepRole: "SDR",
        sidebarTitle: "Birth Hub 360",
        spinLabel: "Sugestoes SPIN",
        summaryLabel: "Rota de conversao",
        tableAction: "Acoes",
        tableLead: "Lead",
        tablePriority: "Prioridade",
        tableScore: "Lead score",
        tableSource: "Origem",
        timelineLabel: "Encaixe de agenda"
      };

  const leads: SdrAutomaticLead[] = [
    {
      action: english ? "Call now" : "Ligar agora",
      company: "Connecta Corp",
      name: "Julia Andrade",
      priority: english ? "Critical" : "Critica",
      priorityTone: "critical",
      role: english ? "Marketing Director" : "Diretora de Marketing",
      score: 98,
      source: english ? "Downloaded \"Sales 4.0\" ebook" : "Download do ebook \"Vendas 4.0\""
    },
    {
      action: english ? "Qualify" : "Qualificar",
      company: "LogiBrasil",
      name: "Fernando Costa",
      priority: english ? "High" : "Alta",
      priorityTone: "high",
      role: english ? "IT Manager" : "Gerente de TI",
      score: 82,
      source: english ? "Webinar registration" : "Inscricao em webinar"
    },
    {
      action: english ? "Open sequence" : "Abrir cadencia",
      company: "Midia Sul",
      name: "Patricia Nogueira",
      priority: english ? "Warm" : "Quente",
      priorityTone: "warm",
      role: english ? "Revenue Ops Lead" : "Lider de RevOps",
      score: 74,
      source: english ? "Intent signal on pricing page" : "Sinal de intencao na pagina de precos"
    }
  ];

  const timeSlots: SdrAutomaticTimeSlot[] = [
    { label: "09:30", recommended: true },
    { label: "11:00" },
    { label: "14:30" },
    { label: "16:00" }
  ];

  return { copy, leads, timeSlots };
}
