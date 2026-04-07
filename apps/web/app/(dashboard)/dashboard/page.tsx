import Link from "next/link";

import {
  ProductEmptyState,
  ProductPageHeader
} from "../../../components/dashboard/page-fragments";
import { loadDashboardHomePage, formatRiskTone } from "./page.data";

export default async function DashboardHomePage() {
  const data = await loadDashboardHomePage();
  const usageEntries = Object.entries(data.billing.usage ?? {});
  const consentNeedsAttention = data.consents.preferences.lgpdConsentStatus === "PENDING";

  return (
    <main className="dashboard-content">
      <ProductPageHeader
        actions={
          <div className="hero-actions">
            <Link href="/workflows">Abrir workflows</Link>
            <Link href="/reports">Ver reports</Link>
            <Link className="ghost-button" href={data.onboarding.nextHref}>
              Continuar onboarding
            </Link>
          </div>
        }
        badge="Home do produto"
        description="Resumo operacional da conta com acesso direto para as jornadas principais, sem depender de URL manual."
        title="Central diaria de operacao"
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
              <span className="badge">LGPD pendente</span>
              <strong>O centro de consentimento ainda precisa de atencao antes do go-live.</strong>
              <span style={{ color: "var(--muted)" }}>
                Status atual: {data.consents.preferences.lgpdConsentStatus} · base legal{" "}
                {data.consents.preferences.lgpdLegalBasis.toLowerCase().replaceAll("_", " ")} ·
                versao {data.consents.preferences.lgpdConsentVersion}.
              </span>
            </div>
            <Link className="action-button" href="/settings/privacy">
              Revisar consentimentos
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
              <span className="badge">Onboarding guiado</span>
              <strong>{data.onboarding.progress}% concluido</strong>
              <span style={{ color: "var(--muted)" }}>
                {data.onboarding.items.filter((item) => item.complete).length} de {data.onboarding.items.length} passos fechados.
              </span>
            </div>
            <Link className="action-button" href={data.onboarding.nextHref}>
              Continuar
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
            <strong>{item.value.toLocaleString("pt-BR")}</strong>
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
              <h2 style={{ marginBottom: "0.15rem" }}>Resumo clinico</h2>
              <p style={{ color: "var(--muted)", margin: 0 }}>
                Baseline materno-infantil com gestacoes ativas, agenda e spotlight operacional.
              </p>
            </div>
            <Link href="/patients">Abrir modulo clinico</Link>
          </div>

          <section className="stats-grid" style={{ marginBottom: "1rem" }}>
            {data.clinical.metrics.map((item) => (
              <article key={item.label}>
                <span className="badge">{item.label}</span>
                <strong>{item.value.toLocaleString("pt-BR")}</strong>
                <p style={{ color: "var(--muted)", marginBottom: 0 }}>{item.delta}</p>
              </article>
            ))}
          </section>

          {data.clinical.spotlight.length === 0 ? (
            <ProductEmptyState
              description="Assim que o tenant tiver pacientes, consultas e notas clinicas, o spotlight aparece aqui."
              title="Sem spotlight clinico"
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
                      {patient.riskLevel} · {patient.status}
                    </span>
                  </div>
                  <span style={{ color: "var(--muted)" }}>
                    {patient.gestationalAgeLabel ?? "Idade gestacional nao calculada"} ·
                    {patient.nextAppointmentAt
                      ? ` retorno ${new Date(patient.nextAppointmentAt).toLocaleString("pt-BR")}`
                      : " sem retorno agendado"}
                  </span>
                  <span style={{ color: "var(--muted)" }}>
                    {patient.latestNoteTitle ?? "Sem nota clinica versionada"}
                  </span>
                  <div className="hero-actions">
                    <Link href={`/patients/${patient.patientId}`}>Abrir paciente</Link>
                    <Link className="ghost-button" href="/appointments">
                      Ver agenda
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>

        <article className="panel">
          <h2>Alertas de go-live</h2>
          {data.clinical.alerts.length === 0 ? (
            <ProductEmptyState
              description="Nenhum alerta clinico critico detectado no tenant ativo."
              title="Sem alertas clinicos"
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
                      {alert.severity}
                    </span>
                  </div>
                  <p style={{ color: "var(--muted)", marginBottom: 0 }}>{alert.description}</p>
                  <Link href={alert.href}>Abrir fila correspondente</Link>
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
              <h2 style={{ marginBottom: "0.15rem" }}>Workflows em destaque</h2>
              <p style={{ color: "var(--muted)", margin: 0 }}>
                Acesso rapido para editar ou executar os fluxos mais recentes.
              </p>
            </div>
            <Link href="/workflows">Ver lista completa</Link>
          </div>

          {data.workflows.items.length === 0 ? (
            <ProductEmptyState
              description="Nenhum workflow criado ainda. Comece pela lista de workflows para montar o primeiro fluxo."
              title="Sem workflows ativos"
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
                    <span className="status-pill">{workflow.status}</span>
                  </div>
                  <span style={{ color: "var(--muted)" }}>
                    {workflow.triggerType} · {workflow._count.steps} etapas · {workflow._count.executions} execucoes
                  </span>
                  <div className="hero-actions">
                    <Link href={`/workflows/${workflow.id}/edit`}>Abrir editor</Link>
                    <Link className="ghost-button" href={`/workflows/${workflow.id}/runs`}>
                      Ver execucoes
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>

        <article className="panel">
          <h2>Uso e plano</h2>
          <p style={{ color: "var(--muted)" }}>
            {data.billing.plan.name} · status {data.billing.status}
          </p>
          {usageEntries.length === 0 ? (
            <ProductEmptyState
              description="Ainda nao ha metricas de uso para a organizacao ativa."
              title="Sem consumo registrado"
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
                    <span>{value.toLocaleString("pt-BR")}</span>
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
          <h2>Saude de clientes</h2>
          {data.health.healthScore.length === 0 ? (
            <ProductEmptyState
              description="Assim que houver clientes vinculados, a saude operacional aparecera aqui."
              title="Sem saude calculada"
            />
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Score</th>
                    <th>NPS</th>
                    <th>Risco</th>
                  </tr>
                </thead>
                <tbody>
                  {data.health.healthScore.map((item) => (
                    <tr key={item.client}>
                      <td>{item.client}</td>
                      <td>{item.score}</td>
                      <td>{item.nps}</td>
                      <td className={formatRiskTone(item.risk)}>{item.risk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <article className="panel">
          <h2>Contratos recentes</h2>
          {data.recent.contracts.length === 0 ? (
            <ProductEmptyState
              description="Quando a organizacao tiver clientes ou contratos, eles aparecerao nesta lista."
              title="Sem contratos recentes"
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
        <h2>Attribution</h2>
        {data.recent.attribution.length === 0 ? (
          <ProductEmptyState
            description="A origem dos leads aparecera aqui assim que a organizacao tiver dados de atribuicao."
            title="Sem atribuicao suficiente"
          />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Origem</th>
                  <th>Leads</th>
                  <th>Conversao</th>
                  <th>CAC</th>
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
