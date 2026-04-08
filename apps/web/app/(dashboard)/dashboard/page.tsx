import Link from "next/link";

import {
  ProductEmptyState,
  ProductPageHeader
} from "../../../components/dashboard/page-fragments";
import {
  formatDateTime,
  formatNumber,
  getDictionary,
  translateLabel,
  type SupportedLocale
} from "../../../lib/i18n";
import { getRequestLocale } from "../../../lib/i18n.server";
import { loadDashboardHomePage, formatRiskTone } from "./page.data";

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

function formatHealthRisk(locale: SupportedLocale, risk: string): string {
  if (locale === "pt-BR") {
    return risk;
  }

  const labels: Record<string, string> = {
    alto: "High",
    baixo: "Low",
    medio: "Medium",
    moderado: "Moderate"
  };

  return labels[risk.toLowerCase()] ?? risk;
}

export default async function DashboardHomePage() {
  const locale = await getRequestLocale();
  const copy = getDictionary(locale);
  const data = await loadDashboardHomePage();
  const usageEntries = Object.entries(data.billing.usage ?? {});
  const consentNeedsAttention = data.consents.preferences.lgpdConsentStatus === "PENDING";
  const completedOnboardingSteps = data.onboarding.items.filter((item) => item.complete).length;

  return (
    <main className="dashboard-content">
      <ProductPageHeader
        actions={
          <div className="hero-actions">
            <Link href="/workflows">{copy.dashboardHome.openWorkflows}</Link>
            <Link href="/reports">{copy.dashboardHome.viewReports}</Link>
            <Link className="ghost-button" href={data.onboarding.nextHref}>
              {copy.dashboardHome.continueOnboarding}
            </Link>
          </div>
        }
        badge={copy.dashboardHome.badge}
        description={copy.dashboardHome.description}
        title={copy.dashboardHome.title}
      />

      {consentNeedsAttention ? (
        <section className="panel dashboard-callout dashboard-callout--warning">
          <div className="dashboard-callout__row">
            <div className="dashboard-callout__copy">
              <span className="badge">{copy.dashboardHome.consentBadge}</span>
              <strong>{copy.dashboardHome.consentAttentionTitle}</strong>
              <span className="dashboard-muted">
                {formatConsentSummary(
                  locale,
                  {
                    legalBasis: data.consents.preferences.lgpdLegalBasis,
                    status: data.consents.preferences.lgpdConsentStatus,
                    version: data.consents.preferences.lgpdConsentVersion
                  },
                  copy.dashboardHome
                )}
              </span>
            </div>
            <Link className="action-button" href="/settings/privacy">
              {copy.dashboardHome.reviewConsents}
            </Link>
          </div>
        </section>
      ) : null}

      {data.onboarding.enabled && data.onboarding.progress < 100 ? (
        <section className="panel dashboard-callout">
          <div className="dashboard-callout__row">
            <div className="dashboard-callout__copy">
              <span className="badge">{copy.dashboardHome.onboardingBadge}</span>
              <strong>{formatOnboardingProgress(locale, data.onboarding.progress)}</strong>
              <span className="dashboard-muted">
                {formatOnboardingSummary(
                  locale,
                  completedOnboardingSteps,
                  data.onboarding.items.length
                )}
              </span>
            </div>
            <Link className="action-button" href={data.onboarding.nextHref}>
              {copy.dashboardHome.continueLabel}
            </Link>
          </div>
        </section>
      ) : null}

      <section className="stats-grid">
        {data.metrics.finance.map((item) => (
          <article key={item.label}>
            <span className="badge">{item.label}</span>
            <strong>{item.value}</strong>
            <p className="dashboard-muted dashboard-muted--compact">{item.delta}</p>
          </article>
        ))}
        {data.metrics.pipeline.map((item) => (
          <article key={item.stage}>
            <span className="badge">{item.stage}</span>
            <strong>{formatNumber(locale, item.value)}</strong>
            <p className="dashboard-muted dashboard-muted--compact">{item.trend}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-grid dashboard-grid--primary">
        <article className="panel">
          <div className="dashboard-panel__header">
            <div className="dashboard-panel__copy">
              <h2>{copy.dashboardHome.clinicalHeading}</h2>
              <p className="dashboard-muted">{copy.dashboardHome.clinicalDescription}</p>
            </div>
            <Link href="/patients">{copy.dashboardHome.openClinicalModule}</Link>
          </div>

          <section className="stats-grid dashboard-stats-grid">
            {data.clinical.metrics.map((item) => (
              <article key={item.label}>
                <span className="badge">{item.label}</span>
                <strong>{formatNumber(locale, item.value)}</strong>
                <p className="dashboard-muted dashboard-muted--compact">{item.delta}</p>
              </article>
            ))}
          </section>

          {data.clinical.spotlight.length === 0 ? (
            <ProductEmptyState
              description={copy.dashboardHome.noClinicalSpotlightDescription}
              title={copy.dashboardHome.noClinicalSpotlightTitle}
            />
          ) : (
            <div className="dashboard-card-list">
              {data.clinical.spotlight.map((patient) => (
                <article className="dashboard-record-card" key={patient.patientId}>
                  <div className="dashboard-card__header">
                    <strong>{patient.patientName}</strong>
                    <span className="status-pill">
                      {translateLabel(copy.dashboardHome.clinicalRiskLabels, patient.riskLevel)} ·{" "}
                      {translateLabel(copy.dashboardHome.clinicalStatusLabels, patient.status)}
                    </span>
                  </div>
                  <span className="dashboard-record-card__meta">
                    {patient.gestationalAgeLabel ?? copy.dashboardHome.gestationalAgeUnknown} ·{" "}
                    {patient.nextAppointmentAt
                      ? `${copy.dashboardHome.returnPrefix} ${formatDateTime(
                          locale,
                          patient.nextAppointmentAt,
                          {
                            dateStyle: "medium",
                            timeStyle: "short"
                          }
                        )}`
                      : copy.dashboardHome.noReturnScheduled}
                  </span>
                  <span className="dashboard-record-card__meta">
                    {patient.latestNoteTitle ?? copy.dashboardHome.noClinicalNote}
                  </span>
                  <div className="hero-actions">
                    <Link href={`/patients/${patient.patientId}`}>{copy.dashboardHome.openPatient}</Link>
                    <Link className="ghost-button" href="/appointments">
                      {copy.dashboardHome.viewSchedule}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>

        <article className="panel">
          <h2>{copy.dashboardHome.goLiveAlertsHeading}</h2>
          {data.clinical.alerts.length === 0 ? (
            <ProductEmptyState
              description={copy.dashboardHome.noClinicalAlertsDescription}
              title={copy.dashboardHome.noClinicalAlertsTitle}
            />
          ) : (
            <div className="dashboard-card-list">
              {data.clinical.alerts.map((alert) => (
                <article className="dashboard-alert-card" key={alert.id}>
                  <div className="dashboard-card__header">
                    <strong>{alert.title}</strong>
                    <span className={`status-pill status-${alert.severity === "high" ? "red" : alert.severity === "medium" ? "yellow" : "green"}`}>
                      {translateLabel(copy.dashboardHome.alertSeverityLabels, alert.severity)}
                    </span>
                  </div>
                  <p className="dashboard-muted dashboard-muted--compact">{alert.description}</p>
                  <Link href={alert.href}>{copy.dashboardHome.openQueue}</Link>
                </article>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--secondary">
        <article className="panel">
          <div className="dashboard-panel__header">
            <div className="dashboard-panel__copy">
              <h2>{copy.dashboardHome.highlightedWorkflowsHeading}</h2>
              <p className="dashboard-muted">{copy.dashboardHome.highlightedWorkflowsDescription}</p>
            </div>
            <Link href="/workflows">{copy.dashboardHome.viewFullWorkflowList}</Link>
          </div>

          {data.workflows.items.length === 0 ? (
            <ProductEmptyState
              description={copy.dashboardHome.noWorkflowsDescription}
              title={copy.dashboardHome.noWorkflowsTitle}
            />
          ) : (
            <div className="dashboard-card-list">
              {data.workflows.items.slice(0, 3).map((workflow) => (
                <article className="dashboard-record-card" key={workflow.id}>
                  <div className="dashboard-card__header">
                    <strong>{workflow.name}</strong>
                    <span className="status-pill">
                      {translateLabel(copy.dashboardHome.workflowStatusLabels, workflow.status)}
                    </span>
                  </div>
                  <span className="dashboard-record-card__meta">
                    {translateLabel(copy.dashboardHome.workflowTriggerLabels, workflow.triggerType)} ·{" "}
                    {workflow._count.steps} {copy.dashboardHome.stepsLabel} ·{" "}
                    {workflow._count.executions} {copy.dashboardHome.executionsLabel}
                  </span>
                  <div className="hero-actions">
                    <Link href={`/workflows/${workflow.id}/edit`}>
                      {copy.dashboardHome.openEditor}
                    </Link>
                    <Link className="ghost-button" href={`/workflows/${workflow.id}/runs`}>
                      {copy.dashboardHome.viewExecutions}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>

        <article className="panel">
          <h2>{copy.dashboardHome.usageHeading}</h2>
          <p className="dashboard-muted">
            {data.billing.plan.name} · {copy.dashboardHome.planStatusLabel} {data.billing.status}
          </p>
          {usageEntries.length === 0 ? (
            <ProductEmptyState
              description={copy.dashboardHome.noUsageDescription}
              title={copy.dashboardHome.noUsageTitle}
            />
          ) : (
            <div className="dashboard-usage">
              {usageEntries.map(([metric, value]) => (
                <div className="dashboard-usage__item" key={metric}>
                  <div className="dashboard-usage__row">
                    <strong>{metric.replace(/_/g, " ")}</strong>
                    <span>{formatNumber(locale, value)}</span>
                  </div>
                  <progress
                    aria-hidden="true"
                    className="dashboard-meter"
                    max={100}
                    value={Math.min(100, Math.max(12, value % 100))}
                  />
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--equal">
        <article className="panel">
          <h2>{copy.dashboardHome.customerHealthHeading}</h2>
          {data.health.healthScore.length === 0 ? (
            <ProductEmptyState
              description={copy.dashboardHome.noCustomerHealthDescription}
              title={copy.dashboardHome.noCustomerHealthTitle}
            />
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>{copy.dashboardHome.customerColumn}</th>
                    <th>{copy.dashboardHome.scoreColumn}</th>
                    <th>{copy.dashboardHome.npsColumn}</th>
                    <th>{copy.dashboardHome.riskColumn}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.health.healthScore.map((item) => (
                    <tr key={item.client}>
                      <td>{item.client}</td>
                      <td>{item.score}</td>
                      <td>{item.nps}</td>
                      <td className={formatRiskTone(item.risk)}>{formatHealthRisk(locale, item.risk)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <article className="panel">
          <h2>{copy.dashboardHome.recentContractsHeading}</h2>
          {data.recent.contracts.length === 0 ? (
            <ProductEmptyState
              description={copy.dashboardHome.noRecentContractsDescription}
              title={copy.dashboardHome.noRecentContractsTitle}
            />
          ) : (
            <div className="dashboard-contract-list">
              {data.recent.contracts.map((contract) => (
                <div className="dashboard-contract-card" key={`${contract.customer}-${contract.owner}`}>
                  <strong>{contract.customer}</strong>
                  <span className="dashboard-record-card__meta">
                    {contract.status} · {contract.owner}
                  </span>
                  <span>{contract.mrr}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="panel">
        <h2>{copy.dashboardHome.attributionHeading}</h2>
        {data.recent.attribution.length === 0 ? (
          <ProductEmptyState
            description={copy.dashboardHome.noAttributionDescription}
            title={copy.dashboardHome.noAttributionTitle}
          />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>{copy.dashboardHome.sourceColumn}</th>
                  <th>{copy.dashboardHome.leadsColumn}</th>
                  <th>{copy.dashboardHome.conversionColumn}</th>
                  <th>{copy.dashboardHome.cacColumn}</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.attribution.map((item) => (
                  <tr key={item.source}>
                    <td>{item.source}</td>
                    <td>{item.leads}</td>
                    <td>{item.conversion}</td>
                    <td>{item.cac}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
