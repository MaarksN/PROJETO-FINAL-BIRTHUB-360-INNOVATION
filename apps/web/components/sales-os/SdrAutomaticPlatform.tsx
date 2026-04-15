"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BrainCircuit,
  CalendarClock,
  CalendarPlus,
  Clock3,
  Filter,
  MessageSquareQuote,
  PhoneCall,
  Send,
  Sparkles,
  Target,
  UserRound
} from "lucide-react";

import type { SupportedLocale } from "../../lib/i18n";
import styles from "./sdr-automatic-platform.module.css";

type ViewId = "agendador" | "assistente" | "handoff" | "leadScore";

type ViewDefinition = {
  description: string;
  icon: LucideIcon;
  id: ViewId;
  label: string;
};

type LeadItem = {
  action: string;
  company: string;
  name: string;
  priority: string;
  priorityTone: "critical" | "high" | "warm";
  role: string;
  score: number;
  source: string;
};

type TimeSlot = {
  label: string;
  recommended?: boolean;
};

function toneForScore(score: number): "critical" | "high" | "warm" {
  if (score >= 90) {
    return "critical";
  }

  if (score >= 75) {
    return "high";
  }

  return "warm";
}

function getCopy(locale: SupportedLocale) {
  if (locale === "en-US") {
    return {
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
    };
  }

  return {
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
}

export function SdrAutomaticPlatform(input: { locale: SupportedLocale }) {
  const copy = getCopy(input.locale);
  const [activeView, setActiveView] = useState<ViewId>("leadScore");

  const views = useMemo<ViewDefinition[]>(
    () => [
      {
        description: copy.leadSubtitle,
        icon: Filter,
        id: "leadScore",
        label: copy.leadTitle
      },
      {
        description: copy.assistantSubtitle,
        icon: MessageSquareQuote,
        id: "assistente",
        label: copy.assistantTitle
      },
      {
        description: copy.agendaSubtitle,
        icon: CalendarPlus,
        id: "agendador",
        label: copy.agendaTitle
      },
      {
        description: copy.handoffSubtitle,
        icon: Send,
        id: "handoff",
        label: copy.handoffTitle
      }
    ],
    [copy]
  );

  const currentView = views.find((view) => view.id === activeView) ?? views[0];

  const leads: LeadItem[] = [
    {
      action: input.locale === "en-US" ? "Call now" : "Ligar agora",
      company: "Connecta Corp",
      name: "Julia Andrade",
      priority: input.locale === "en-US" ? "Critical" : "Critica",
      priorityTone: "critical",
      role: input.locale === "en-US" ? "Marketing Director" : "Diretora de Marketing",
      score: 98,
      source: input.locale === "en-US" ? "Downloaded \"Sales 4.0\" ebook" : "Download do ebook \"Vendas 4.0\""
    },
    {
      action: input.locale === "en-US" ? "Qualify" : "Qualificar",
      company: "LogiBrasil",
      name: "Fernando Costa",
      priority: input.locale === "en-US" ? "High" : "Alta",
      priorityTone: "high",
      role: input.locale === "en-US" ? "IT Manager" : "Gerente de TI",
      score: 82,
      source: input.locale === "en-US" ? "Webinar registration" : "Inscricao em webinar"
    },
    {
      action: input.locale === "en-US" ? "Open sequence" : "Abrir cadencia",
      company: "Midia Sul",
      name: "Patricia Nogueira",
      priority: input.locale === "en-US" ? "Warm" : "Quente",
      priorityTone: "warm",
      role: input.locale === "en-US" ? "Revenue Ops Lead" : "Lider de RevOps",
      score: 74,
      source: input.locale === "en-US" ? "Intent signal on pricing page" : "Sinal de intencao na pagina de precos"
    }
  ];

  const timeSlots: TimeSlot[] = [
    { label: "09:30", recommended: true },
    { label: "11:00" },
    { label: "14:30" },
    { label: "16:00" }
  ];

  return (
    <section className={styles.platformShell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <BrainCircuit size={22} />
          </div>
          <div>
            <span className={styles.sectionEyebrow}>{copy.moduleLabel}</span>
            <strong>{copy.sidebarTitle}</strong>
          </div>
        </div>

        <div className={styles.heroCard}>
          <span className={styles.sectionEyebrow}>{copy.heroEyebrow}</span>
          <h2>{copy.heroTitle}</h2>
          <p>{copy.heroDescription}</p>
          <div className={styles.metricStack}>
            {copy.metrics.map((metric) => (
              <article className={styles.metricCard} key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </div>
        </div>

        <nav aria-label={copy.moduleLabel} className={styles.navList}>
          {views.map((view) => {
            const Icon = view.icon;
            const active = view.id === activeView;

            return (
              <button
                className={styles.navItem}
                data-active={active ? "true" : "false"}
                key={view.id}
                onClick={() => setActiveView(view.id)}
                type="button"
              >
                <span className={styles.navIcon}>
                  <Icon size={18} />
                </span>
                <span className={styles.navCopy}>
                  <strong>{view.label}</strong>
                  <small>{view.description}</small>
                </span>
              </button>
            );
          })}
        </nav>

        <div className={styles.userCard}>
          <div className={styles.userAvatar}>
            <UserRound size={18} />
          </div>
          <div>
            <strong>{copy.salesRepName}</strong>
            <span>{copy.salesRepRole}</span>
          </div>
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.workspaceHeader}>
          <div>
            <span className={styles.sectionEyebrow}>{copy.moduleLabel}</span>
            <h2>{currentView.label}</h2>
            <p>{currentView.description}</p>
          </div>
          <div className={styles.workspacePills}>
            <span>{copy.quickBrief}</span>
            <span>{copy.summaryLabel}</span>
            <span>{copy.nextStepLabel}</span>
          </div>
        </header>

        {activeView === "leadScore" ? (
          <section className={styles.viewGrid}>
            <article className={styles.surfaceCard}>
              <div className={styles.cardHeader}>
                <div>
                  <strong>{copy.leadTitle}</strong>
                  <p>{copy.leadSubtitle}</p>
                </div>
                <div className={styles.inlineMetrics}>
                  {leads.slice(0, 2).map((lead) => (
                    <span key={lead.name}>{lead.name.split(" ")[0]} {lead.score}</span>
                  ))}
                </div>
              </div>

              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{copy.tableLead}</th>
                      <th>{copy.tableScore}</th>
                      <th>{copy.tableSource}</th>
                      <th>{copy.tablePriority}</th>
                      <th>{copy.tableAction}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.name}>
                        <td>
                          <div className={styles.tableLead}>
                            <strong>{lead.name}</strong>
                            <span>{lead.role}, {lead.company}</span>
                          </div>
                        </td>
                        <td>
                          <div className={styles.scoreWrap}>
                            <div className={styles.scoreBar}>
                              <span
                                className={styles.scoreFill}
                                data-tone={toneForScore(lead.score)}
                                style={{ width: `${lead.score}%` }}
                              />
                            </div>
                            <strong>{lead.score}</strong>
                          </div>
                        </td>
                        <td>{lead.source}</td>
                        <td>
                          <span className={styles.priorityPill} data-tone={lead.priorityTone}>
                            {lead.priority}
                          </span>
                        </td>
                        <td>
                          <button className={styles.actionButton} type="button">
                            <PhoneCall size={16} />
                            <span>{lead.action}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className={styles.surfaceCard}>
              <div className={styles.cardHeader}>
                <div>
                  <strong>{copy.quickBrief}</strong>
                  <p>{input.locale === "en-US" ? "Signals that pushed Julia to the top." : "Sinais que levaram Julia para o topo da fila."}</p>
                </div>
                <Target size={18} />
              </div>
              <div className={styles.signalList}>
                <article>
                  <strong>{input.locale === "en-US" ? "Urgency spike" : "Pico de urgencia"}</strong>
                  <p>{input.locale === "en-US" ? "Two visits to the pricing page and one request for an implementation deck." : "Duas visitas a pagina de precos e um pedido pelo deck de implantacao."}</p>
                </article>
                <article>
                  <strong>{input.locale === "en-US" ? "Persona fit" : "Fit de persona"}</strong>
                  <p>{input.locale === "en-US" ? "Director-level profile with budget influence and active campaign ownership." : "Perfil de diretoria com influencia de budget e ownership de campanhas ativas."}</p>
                </article>
                <article>
                  <strong>{copy.nextStepLabel}</strong>
                  <p>{input.locale === "en-US" ? "Enter with SPIN discovery and book a focused demo." : "Entrar com discovery SPIN e agendar uma demo focada."}</p>
                </article>
              </div>
            </article>
          </section>
        ) : null}

        {activeView === "assistente" ? (
          <section className={styles.viewGrid}>
            <article className={styles.surfaceCard}>
              <div className={styles.cardHeader}>
                <div>
                  <strong>{copy.callFocus}</strong>
                  <p>{copy.assistantHint}</p>
                </div>
                <Sparkles size={18} />
              </div>

              <div className={styles.notesPanel}>
                <article className={styles.noteBlock}>
                  <strong>{input.locale === "en-US" ? "Current pains" : "Dores atuais"}</strong>
                  <p>{input.locale === "en-US" ? "Lead flow is unstable, conversion is low, and the team spends too much time searching for qualified contacts." : "Fluxo de leads instavel, conversao baixa e excesso de tempo gasto procurando contatos qualificados."}</p>
                </article>
                <article className={styles.noteBlock}>
                  <strong>{input.locale === "en-US" ? "Target outcome" : "Objetivo principal"}</strong>
                  <p>{input.locale === "en-US" ? "Increase booked meetings by 30 percent without expanding headcount this quarter." : "Aumentar em 30 por cento as reunioes agendadas sem ampliar headcount neste trimestre."}</p>
                </article>
                <article className={styles.noteBlock}>
                  <strong>{input.locale === "en-US" ? "Buying signal" : "Sinal de compra"}</strong>
                  <p>{input.locale === "en-US" ? "Asked how long the team would need to go live and which integrations come out of the box." : "Perguntou sobre tempo de go-live e quais integracoes entram prontas no pacote."}</p>
                </article>
              </div>
            </article>

            <article className={styles.surfaceCard}>
              <div className={styles.cardHeader}>
                <div>
                  <strong>{copy.spinLabel}</strong>
                  <p>{input.locale === "en-US" ? "Questions suggested in real time." : "Perguntas sugeridas em tempo real."}</p>
                </div>
                <MessageSquareQuote size={18} />
              </div>

              <div className={styles.stack}>
                <article className={styles.promptCard}>
                  <span>{input.locale === "en-US" ? "Situation" : "Situacao"}</span>
                  <p>{input.locale === "en-US" ? "\"How does your qualification process work today from first touch to demo handoff?\"" : "\"Como funciona hoje o processo de qualificacao do primeiro toque ate o handoff para demo?\""}</p>
                </article>
                <article className={styles.promptCard}>
                  <span>{input.locale === "en-US" ? "Problem" : "Problema"}</span>
                  <p>{input.locale === "en-US" ? "\"Where does the team lose the most time before a meeting gets booked?\"" : "\"Onde a equipe mais perde tempo antes de uma reuniao ser agendada?\""}</p>
                </article>
                <article className={styles.promptCard}>
                  <span>{input.locale === "en-US" ? "Implication" : "Implicacao"}</span>
                  <p>{input.locale === "en-US" ? "\"What happens to monthly targets when qualified contacts take too long to surface?\"" : "\"O que acontece com a meta mensal quando os contatos qualificados demoram a aparecer?\""}</p>
                </article>
                <article className={styles.promptCard}>
                  <span>{input.locale === "en-US" ? "Need-payoff" : "Necessidade"}</span>
                  <p>{input.locale === "en-US" ? "\"If the team received ranked leads with next actions, what would improve first?\"" : "\"Se a equipe recebesse leads ranqueados com proximo passo claro, o que melhoraria primeiro?\""}</p>
                </article>
              </div>
            </article>
          </section>
        ) : null}

        {activeView === "agendador" ? (
          <section className={styles.viewGrid}>
            <article className={styles.surfaceCard}>
              <div className={styles.cardHeader}>
                <div>
                  <strong>{copy.agendaTitle}</strong>
                  <p>{copy.agendaCaption}</p>
                </div>
                <CalendarClock size={18} />
              </div>

              <div className={styles.recommendationCard}>
                <div>
                  <span>{copy.agendaHelper}</span>
                  <strong>Ricardo Mendes</strong>
                  <p>{input.locale === "en-US" ? "Strongest closer for media and demand-gen accounts with mid-market sales cycles." : "Closer mais aderente para contas de midia e demand gen com ciclo mid-market."}</p>
                </div>
                <div className={styles.recommendationMeta}>
                  <span>Win rate 34%</span>
                  <span>{input.locale === "en-US" ? "Segment fit" : "Fit de segmento"}</span>
                </div>
              </div>

              <div className={styles.slotGrid}>
                {timeSlots.map((slot) => (
                  <button
                    className={styles.slotCard}
                    data-recommended={slot.recommended ? "true" : "false"}
                    key={slot.label}
                    type="button"
                  >
                    <Clock3 size={16} />
                    <strong>{slot.label}</strong>
                    <span>
                      {slot.recommended
                        ? input.locale === "en-US"
                          ? "Best match"
                          : "Melhor encaixe"
                        : input.locale === "en-US"
                          ? "Available"
                          : "Disponivel"}
                    </span>
                  </button>
                ))}
              </div>
            </article>

            <article className={styles.surfaceCard}>
              <div className={styles.cardHeader}>
                <div>
                  <strong>{copy.timelineLabel}</strong>
                  <p>{input.locale === "en-US" ? "The platform crosses rep capacity, segment expertise, and speed-to-demo." : "A plataforma cruza capacidade do closer, expertise de segmento e velocidade para demo."}</p>
                </div>
                <CalendarPlus size={18} />
              </div>
              <div className={styles.timelineList}>
                <article>
                  <strong>{input.locale === "en-US" ? "Segment knowledge" : "Conhecimento de segmento"}</strong>
                  <p>{input.locale === "en-US" ? "Ricardo already closed three media clients in the last 60 days." : "Ricardo fechou tres contas de midia nos ultimos 60 dias."}</p>
                </article>
                <article>
                  <strong>{input.locale === "en-US" ? "Speed to first meeting" : "Velocidade para primeira reuniao"}</strong>
                  <p>{input.locale === "en-US" ? "Earliest premium slot is tomorrow at 09:30 with room for prep." : "Primeiro horario premium e amanha as 09:30 com tempo para prep."}</p>
                </article>
                <article>
                  <strong>{copy.nextStepLabel}</strong>
                  <p>{input.locale === "en-US" ? "Lock 09:30, send the handoff, and preload the discovery plan." : "Fechar 09:30, enviar briefing e pre-carregar o plano de discovery."}</p>
                </article>
              </div>
            </article>
          </section>
        ) : null}

        {activeView === "handoff" ? (
          <section className={styles.viewGrid}>
            <article className={styles.surfaceCard}>
              <div className={styles.cardHeader}>
                <div>
                  <strong>{copy.handoffTitle}</strong>
                  <p>{copy.handoffSubtitle}</p>
                </div>
                <Send size={18} />
              </div>

              <div className={styles.summaryGrid}>
                <article className={styles.noteBlock}>
                  <strong>{input.locale === "en-US" ? "Pain points identified" : "Dores identificadas"}</strong>
                  <p>{input.locale === "en-US" ? "Low lead conversion, team fatigue, and difficulty surfacing qualified contacts fast enough." : "Baixa conversao de leads, equipe desmotivada e dificuldade para encontrar contatos qualificados no ritmo certo."}</p>
                </article>
                <article className={styles.noteBlock}>
                  <strong>{input.locale === "en-US" ? "Primary objective" : "Objetivo principal"}</strong>
                  <p>{input.locale === "en-US" ? "Book 30 percent more meetings per month with a more predictable SDR motion." : "Aumentar em 30 por cento as reunioes por mes com uma operacao SDR mais previsivel."}</p>
                </article>
                <article className={styles.noteBlock}>
                  <strong>{input.locale === "en-US" ? "Demo angle" : "Angulo da demo"}</strong>
                  <p>{input.locale === "en-US" ? "Focus on predictive ranking, qualification support, and automated handoff into closing." : "Focar em ranking preditivo, suporte de qualificacao e handoff automatizado para fechamento."}</p>
                </article>
              </div>
            </article>

            <article className={styles.surfaceCard}>
              <div className={styles.cardHeader}>
                <div>
                  <strong>{copy.summaryLabel}</strong>
                  <p>{input.locale === "en-US" ? "What the closer needs before the call." : "O que o closer precisa antes da reuniao."}</p>
                </div>
                <Sparkles size={18} />
              </div>

              <div className={styles.stack}>
                <article className={styles.promptCard}>
                  <span>{input.locale === "en-US" ? "Recommended opening" : "Abertura recomendada"}</span>
                  <p>{input.locale === "en-US" ? "Start from revenue waste in qualification and bridge directly into demo velocity." : "Entrar pela perda de receita na qualificacao e conectar direto com velocidade de demo."}</p>
                </article>
                <article className={styles.promptCard}>
                  <span>{input.locale === "en-US" ? "Competitive risk" : "Risco competitivo"}</span>
                  <p>{input.locale === "en-US" ? "The account is also evaluating a generic sequencing tool with weaker ranking logic." : "A conta tambem esta avaliando uma ferramenta generica de sequencia com ranking mais fraco."}</p>
                </article>
                <article className={styles.promptCard}>
                  <span>{copy.nextStepLabel}</span>
                  <p>{input.locale === "en-US" ? "Confirm KPIs, show the SDR workflow, and close on a pilot with one pod." : "Confirmar KPIs, mostrar o fluxo SDR e fechar piloto com um pod inicial."}</p>
                </article>
              </div>

              <button className={styles.primaryCta} type="button">
                <Send size={16} />
                <span>{copy.actionPrimary}</span>
              </button>
            </article>
          </section>
        ) : null}
      </div>
    </section>
  );
}
