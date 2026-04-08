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
        <section
          className="panel"
          style={{
            border: "1px solid rgba(180, 83, 9, 0.22)",
            boxShadow: "0 18px 48px rgba(180, 83, 9, 0.08)"
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.85rem",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "grid", gap: "0.3rem" }}>
              <span className="badge">{copy.dashboardHome.consentBadge}</span>
              <strong>{copy.dashboardHome.consentAttentionTitle}</strong>
              <span style={{ color: "var(--muted)" }}>
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
        <section className="panel">
          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.85rem",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "grid", gap: "0.3rem" }}>
              <span className="badge">{copy.dashboardHome.onboardingBadge}</span>
              <strong>{formatOnboardingProgress(locale, data.onboarding.progress)}</strong>
              <span style={{ color: "var(--muted)" }}>
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
            <p style={{ color: "var(--muted)", marginBottom: 0 }}>{item.delta}</p>
          </article>
        ))}
        {data.metrics.pipeline.map((item) => (
          <article key={item.stage}>
            <span className="badge">{item.stage}</span>
            <strong>{formatNumber(locale, item.value)}</strong>
            <p style={{ color: "var(--muted)", marginBottom: 0 }}>{item.trend}</p>
          </article>
        ))}
      </section>

      <section
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)"
        }}
      >
        <article className="panel">
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.9rem"
            }}
          >
            <div>
              <h2 style={{ marginBottom: "0.15rem" }}>{copy.dashboardHome.clinicalHeading}</h2>
              <p style={{ color: "var(--muted)", margin: 0 }}>
                {copy.dashboardHome.clinicalDescription}
              </p>
            </div>
            <Link href="/patients">{copy.dashboardHome.openClinicalModule}</Link>
          </div>

          <section className="stats-grid" style={{ marginBottom: "1rem" }}>
            {data.clinical.metrics.map((item) => (
              <article key={item.label}>
                <span className="badge">{item.label}</span>
                <strong>{formatNumber(locale, item.value)}</strong>
                <p style={{ color: "var(--muted)", marginBottom: 0 }}>{item.delta}</p>
              </article>
            ))}
          </section>

          {data.clinical.spotlight.length === 0 ? (
            <ProductEmptyState
              description={copy.dashboardHome.noClinicalSpotlightDescription}
              title={copy.dashboardHome.noClinicalSpotlightTitle}
            />
          ) : (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {data.clinical.spotlight.map((patient) => (
                <article
                  key={patient.patientId}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 22,
                    display: "grid",
                    gap: "0.4rem",
                    padding: "1rem"
                  }}
                >
                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <strong>{patient.patientName}</strong>
                    <span className="status-pill">
                      {translateLabel(copy.dashboardHome.clinicalRiskLabels, patient.riskLevel)} ·{" "}
                      {translateLabel(copy.dashboardHome.clinicalStatusLabels, patient.status)}
                    </span>
                  </div>
                  <span style={{ color: "var(--muted)" }}>
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
                  <span style={{ color: "var(--muted)" }}>
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
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {data.clinical.alerts.map((alert) => (
                <article
                  key={alert.id}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 22,
                    display: "grid",
                    gap: "0.35rem",
                    padding: "1rem"
                  }}
                >
                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <strong>{alert.title}</strong>
                    <span className={`status-pill status-${alert.severity === "high" ? "red" : alert.severity === "medium" ? "yellow" : "green"}`}>
                      {translateLabel(copy.dashboardHome.alertSeverityLabels, alert.severity)}
                    </span>
                  </div>
                  <p style={{ color: "var(--muted)", marginBottom: 0 }}>{alert.description}</p>
                  <Link href={alert.href}>{copy.dashboardHome.openQueue}</Link>
                </article>
              ))}
            </div>
          )}
        </article>
      </section>

      <section
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 0.9fr)"
        }}
      >
        <article className="panel">
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.9rem"
            }}
          >
            <div>
              <h2 style={{ marginBottom: "0.15rem" }}>
                {copy.dashboardHome.highlightedWorkflowsHeading}
              </h2>
              <p style={{ color: "var(--muted)", margin: 0 }}>
                {copy.dashboardHome.highlightedWorkflowsDescription}
              </p>
            </div>
            <Link href="/workflows">{copy.dashboardHome.viewFullWorkflowList}</Link>
          </div>

          {data.workflows.items.length === 0 ? (
            <ProductEmptyState
              description={copy.dashboardHome.noWorkflowsDescription}
              title={copy.dashboardHome.noWorkflowsTitle}
            />
          ) : (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {data.workflows.items.slice(0, 3).map((workflow) => (
                <article
                  key={workflow.id}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 22,
                    display: "grid",
                    gap: "0.45rem",
                    padding: "1rem"
                  }}
                >
                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <strong>{workflow.name}</strong>
                    <span className="status-pill">
                      {translateLabel(copy.dashboardHome.workflowStatusLabels, workflow.status)}
                    </span>
                  </div>
                  <span style={{ color: "var(--muted)" }}>
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
          <p style={{ color: "var(--muted)" }}>
            {data.billing.plan.name} · {copy.dashboardHome.planStatusLabel} {data.billing.status}
          </p>
          {usageEntries.length === 0 ? (
            <ProductEmptyState
              description={copy.dashboardHome.noUsageDescription}
              title={copy.dashboardHome.noUsageTitle}
            />
          ) : (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              {usageEntries.map(([metric, value]) => (
                <div key={metric} style={{ display: "grid", gap: "0.35rem" }}>
                  <div
                    style={{
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                  >
                    <strong>{metric.replace(/_/g, " ")}</strong>
                    <span>{formatNumber(locale, value)}</span>
                  </div>
                  <div className="meter" aria-hidden="true">
                    <span style={{ width: `${Math.min(100, Math.max(12, value % 100))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)"
        }}
      >
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
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {data.recent.contracts.map((contract) => (
                <div
                  key={`${contract.customer}-${contract.owner}`}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: 20,
                    display: "grid",
                    gap: "0.35rem",
                    padding: "0.9rem"
                  }}
                >
                  <strong>{contract.customer}</strong>
                  <span style={{ color: "var(--muted)" }}>
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
