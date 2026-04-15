import Link from "next/link";

import {
  formatNumber,
  translateLabel,
  type Dictionary,
  type SupportedLocale
} from "../../../lib/i18n";
import { loadDashboardHomePage } from "./page.data";

type DashboardHomeCopy = Dictionary["dashboardHome"];
type DashboardHomeData = Awaited<ReturnType<typeof loadDashboardHomePage>>;
type ExecutivePremiumResult = {
  agent: {
    description: string;
    id: string;
    name: string;
  };
  tags: {
    domain: string[];
    level: string[];
  };
};

type DashboardStaticCopy = ReturnType<typeof getDashboardStaticCopy>;

function formatOnboardingSummary(
  locale: SupportedLocale,
  completedSteps: number,
  totalSteps: number
): string {
  if (locale === "pt-BR") {
    return `${completedSteps} de ${totalSteps} passos fechados.`;
  }

  return `${completedSteps} of ${totalSteps} steps completed.`;
}

function formatConsentSummary(
  locale: SupportedLocale,
  input: {
    legalBasis: string;
    status: string;
    version: string;
  },
  labels: {
    consentLegalBasisLabels: Record<string, string>;
    consentStatusLabels: Record<string, string>;
  }
): string {
  const statusLabel = translateLabel(labels.consentStatusLabels, input.status);
  const legalBasisLabel = translateLabel(labels.consentLegalBasisLabels, input.legalBasis);

  if (locale === "pt-BR") {
    return `Status atual: ${statusLabel} · base legal ${legalBasisLabel} · versao ${input.version}.`;
  }

  return `Current status: ${statusLabel} · legal basis ${legalBasisLabel} · version ${input.version}.`;
}

function formatOnboardingProgress(locale: SupportedLocale, progress: number): string {
  return locale === "pt-BR" ? `${progress}% concluido` : `${progress}% complete`;
}

export function getDashboardStaticCopy(locale: SupportedLocale) {
  if (locale === "pt-BR") {
    return {
      entryPoints: [
        "Use BDR, SDR e LDR para mapear contas, enriquecer contexto e preparar outreach.",
        "Simule gatekeepers, CFOs e cenarios tensos antes de entrar na call real.",
        "Abra o mentor para transformar contexto disperso em proximo passo comercial."
      ],
      entryPointTitles: ["Pesquisa e prospeccao", "Roleplay e negociacao", "Mentoria contextual"],
      premiumDashboardBadge: "Colecao premium executiva",
      premiumDashboardCta: "Abrir colecao premium",
      premiumDashboardDescription:
        "Linha oficial para board, C-level e liderancas com score de evidencia, memoria decisoria, radar de risco e handoff governado entre especialistas.",
      premiumDashboardManage: "Ver packs premium",
      premiumDashboardMetricSubtitles: [
        "Agentes destacados por default no dashboard",
        "Camadas compartilhadas de governanca, memoria e prescricao",
        "Marketplace, Sales OS e Packs conectados"
      ],
      premiumDashboardMetrics: ["Agentes premium", "Camadas premium", "Entrada padrao"],
      premiumDashboardTitle: "Executive premium agora aparece na home",
      productAlignmentCopy: {
        badge: "Alinhamento de dominio",
        description:
          "Superficies clinicas, FHIR e privacy avancada permanecem fora do produto ativo nesta implantacao. O produto segue com dashboard operacional, workflows, billing, analytics, notificacoes e privacidade self-service, enquanto o clinico fica restrito a avaliacao controlada por flag.",
        title: "Capacidades fora do produto ativo ficaram explicitamente isoladas"
      },
      salesOsCta: "Abrir Sales OS",
      salesOsDescription:
        "Acesse pre-sales, vendas, marketing, CS, revops, financeiro e risco em uma unica superficie.",
      salesOsMetricSubtitles: [
        "Estruturas operacionais disponiveis",
        "Protocolos importados do blueprint",
        "Simulacoes para objecoes e negociacao"
      ],
      salesOsMetrics: ["Modulos", "Ferramentas", "Roleplays"],
      salesOsSecondaryCta: "Abrir plataforma SDR",
      salesOsTitle: "Cockpit comercial unificado"
    };
  }

  return {
    entryPoints: [
      "Use BDR, SDR, and LDR to map accounts, enrich context, and prepare outreach.",
      "Simulate gatekeepers, CFOs, and tense scenarios before the live call.",
      "Open the mentor to turn scattered context into the next commercial move."
    ],
    entryPointTitles: ["Research and prospecting", "Roleplay and negotiation", "Contextual mentoring"],
    premiumDashboardBadge: "Executive premium collection",
    premiumDashboardCta: "Open premium collection",
    premiumDashboardDescription:
      "The official board and C-level lineup now lands on the home dashboard with evidence scorecards, decision memory, risk radar, and governed specialist handoffs.",
    premiumDashboardManage: "View premium packs",
    premiumDashboardMetricSubtitles: [
      "Agents highlighted by default on the dashboard",
      "Shared layers for governance, memory, and prescription",
      "Marketplace, Sales OS, and Packs are now connected"
    ],
    premiumDashboardMetrics: ["Premium agents", "Premium layers", "Default entry"],
    premiumDashboardTitle: "Executive premium now lands on home",
    productAlignmentCopy: {
      badge: "Domain alignment",
      description:
        "Clinical, FHIR, and advanced privacy surfaces remain outside the active product for this deployment. The product keeps the operational dashboard, workflows, billing, analytics, notifications, and self-service privacy active, while clinical stays restricted to flag-driven controlled evaluation.",
      title: "Out-of-scope capabilities were explicitly isolated"
    },
    salesOsCta: "Open Sales OS",
    salesOsDescription:
      "Access pre-sales, sales, marketing, CS, revops, finance, and risk in one operating surface.",
    salesOsMetricSubtitles: [
      "Available operating structures",
      "Protocols imported from the blueprint",
      "Simulations for objections and negotiation"
    ],
    salesOsMetrics: ["Modules", "Tools", "Roleplays"],
    salesOsSecondaryCta: "Open SDR platform",
    salesOsTitle: "Unified commercial cockpit"
  };
}

export function DashboardNoticeSections(props: {
  copy: DashboardHomeCopy;
  data: DashboardHomeData;
  locale: SupportedLocale;
  staticCopy: DashboardStaticCopy;
}) {
  const consentPreferences = props.data.consents?.preferences;
  const consentNeedsAttention =
    props.data.capabilities.privacyAdvancedEnabled &&
    consentPreferences?.lgpdConsentStatus === "PENDING";
  const completedOnboardingSteps = props.data.onboarding.items.filter((item) => item.complete).length;
  const showProductAlignmentNotice =
    !props.data.capabilities.clinicalWorkspaceEnabled ||
    !props.data.capabilities.privacyAdvancedEnabled;

  return (
    <>
      {showProductAlignmentNotice ? (
        <section className="panel dashboard-callout">
          <div className="dashboard-callout__copy">
            <span className="badge">{props.staticCopy.productAlignmentCopy.badge}</span>
            <strong>{props.staticCopy.productAlignmentCopy.title}</strong>
            <span className="dashboard-muted">
              {props.staticCopy.productAlignmentCopy.description}
            </span>
          </div>
        </section>
      ) : null}

      {consentNeedsAttention && consentPreferences ? (
        <section className="panel dashboard-callout dashboard-callout--warning">
          <div className="dashboard-callout__row">
            <div className="dashboard-callout__copy">
              <span className="badge">{props.copy.consentBadge}</span>
              <strong>{props.copy.consentAttentionTitle}</strong>
              <span className="dashboard-muted">
                {formatConsentSummary(
                  props.locale,
                  {
                    legalBasis: consentPreferences.lgpdLegalBasis,
                    status: consentPreferences.lgpdConsentStatus,
                    version: consentPreferences.lgpdConsentVersion
                  },
                  props.copy
                )}
              </span>
            </div>
            <Link className="action-button" href="/settings/privacy">
              {props.copy.reviewConsents}
            </Link>
          </div>
        </section>
      ) : null}

      {props.data.onboarding.enabled && props.data.onboarding.progress < 100 ? (
        <section className="panel dashboard-callout">
          <div className="dashboard-callout__row">
            <div className="dashboard-callout__copy">
              <span className="badge">{props.copy.onboardingBadge}</span>
              <strong>
                {formatOnboardingProgress(props.locale, props.data.onboarding.progress)}
              </strong>
              <span className="dashboard-muted">
                {formatOnboardingSummary(
                  props.locale,
                  completedOnboardingSteps,
                  props.data.onboarding.items.length
                )}
              </span>
            </div>
            <Link className="action-button" href={props.data.onboarding.nextHref}>
              {props.copy.continueLabel}
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}

export function DashboardExecutivePremiumSection(props: {
  executivePremiumCount: number;
  executivePremiumResults: ExecutivePremiumResult[];
  locale: SupportedLocale;
  staticCopy: DashboardStaticCopy;
}) {
  if (props.executivePremiumResults.length === 0) {
    return null;
  }

  return (
    <section
      className="panel"
      style={{
        background: "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,58,138,0.92))",
        border: "1px solid rgba(148, 163, 184, 0.24)",
        color: "#f8fafc"
      }}
    >
      <div className="dashboard-panel__header">
        <div className="dashboard-panel__copy">
          <span
            className="badge"
            style={{
              background: "rgba(255,255,255,0.12)",
              borderColor: "rgba(255,255,255,0.18)",
              color: "#f8fafc"
            }}
          >
            {props.staticCopy.premiumDashboardBadge}
          </span>
          <h2>{props.staticCopy.premiumDashboardTitle}</h2>
          <p style={{ color: "rgba(248,250,252,0.86)" }}>
            {props.staticCopy.premiumDashboardDescription}
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/marketplace?tags=executive-premium">
            {props.staticCopy.premiumDashboardCta}
          </Link>
          <Link className="ghost-button" href="/packs">
            {props.staticCopy.premiumDashboardManage}
          </Link>
        </div>
      </div>

      <section className="stats-grid dashboard-stats-grid">
        <article>
          <span className="badge">{props.staticCopy.premiumDashboardMetrics[0]}</span>
          <strong>{formatNumber(props.locale, props.executivePremiumCount)}</strong>
          <p className="dashboard-muted dashboard-muted--compact" style={{ color: "rgba(248,250,252,0.72)" }}>
            {props.staticCopy.premiumDashboardMetricSubtitles[0]}
          </p>
        </article>
        <article>
          <span className="badge">{props.staticCopy.premiumDashboardMetrics[1]}</span>
          <strong>14</strong>
          <p className="dashboard-muted dashboard-muted--compact" style={{ color: "rgba(248,250,252,0.72)" }}>
            {props.staticCopy.premiumDashboardMetricSubtitles[1]}
          </p>
        </article>
        <article>
          <span className="badge">{props.staticCopy.premiumDashboardMetrics[2]}</span>
          <strong>3</strong>
          <p className="dashboard-muted dashboard-muted--compact" style={{ color: "rgba(248,250,252,0.72)" }}>
            {props.staticCopy.premiumDashboardMetricSubtitles[2]}
          </p>
        </article>
      </section>

      <div className="dashboard-card-list">
        {props.executivePremiumResults.map((item) => (
          <article
            className="dashboard-record-card"
            key={item.agent.id}
            style={{
              background: "rgba(255,255,255,0.1)",
              borderColor: "rgba(255,255,255,0.12)",
              color: "#f8fafc"
            }}
          >
            <div className="dashboard-card__header">
              <strong>{item.agent.name}</strong>
              <span
                className="status-pill"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  borderColor: "rgba(255,255,255,0.16)",
                  color: "#f8fafc"
                }}
              >
                Executive Premium
              </span>
            </div>
            <span className="dashboard-record-card__meta" style={{ color: "rgba(248,250,252,0.72)" }}>
              {item.tags.domain.join(", ")} · {item.tags.level.join(", ")}
            </span>
            <span className="dashboard-record-card__meta" style={{ color: "rgba(248,250,252,0.86)" }}>
              {item.agent.description}
            </span>
            <div className="hero-actions">
              <Link href={`/marketplace?tags=executive-premium&agentId=${encodeURIComponent(item.agent.id)}`}>
                {props.locale === "pt-BR" ? "Abrir agente" : "Open agent"}
              </Link>
              <Link className="ghost-button" href="/sales-os">
                Sales OS
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
