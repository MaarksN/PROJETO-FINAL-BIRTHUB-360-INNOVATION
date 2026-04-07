import Link from "next/link";

import { loadDashboardSnapshot, type DashboardSnapshot } from "../../../lib/dashboard";

function riskClass(risk: string): string {
  if (risk === "baixo") {
    return "status-green";
  }

  if (risk === "médio") {
    return "status-yellow";
  }

  return "status-red";
}

function averageHealthScore(snapshot: DashboardSnapshot): number {
  if (snapshot.agentStatuses.healthScore.length === 0) {
    return 0;
  }

  const total = snapshot.agentStatuses.healthScore.reduce((sum, item) => sum + item.score, 0);
  return Math.round(total / snapshot.agentStatuses.healthScore.length);
}

function totalPipeline(snapshot: DashboardSnapshot): number {
  return snapshot.metrics.pipeline.reduce((sum, item) => sum + item.value, 0);
}

export default async function DashboardHomePage() {
  let snapshot: DashboardSnapshot | null = null;
  let errorMessage: string | null = null;

  try {
    snapshot = await loadDashboardSnapshot();
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "Falha ao carregar os indicadores administrativos do tenant.";
  }

  return (
    <>
      <section className="hero-card">
        <span className="badge">Home canonica</span>
        <h1>Dashboard operacional do tenant</h1>
        <p>
          Entrada oficial pos-login para acompanhar financas, saude operacional, carteira e
          workflows sem depender de URL manual ou rotas soltas.
        </p>
        <div className="hero-actions">
          <Link href="/workflows">Ver workflows</Link>
          <Link href="/agents">Acompanhar agentes</Link>
          <Link href="/settings/privacy">Privacidade</Link>
          <Link href="/profile/notifications">Notificacoes</Link>
        </div>
      </section>

      {snapshot ? (
        <>
          <section className="stats-grid">
            <article>
              <span className="badge">Saude media</span>
              <strong>{averageHealthScore(snapshot)}</strong>
            </article>
            <article>
              <span className="badge">Fluxo em 30d</span>
              <strong>{totalPipeline(snapshot).toLocaleString("pt-BR")}</strong>
            </article>
            <article>
              <span className="badge">Clientes monitorados</span>
              <strong>{snapshot.agentStatuses.healthScore.length.toLocaleString("pt-BR")}</strong>
            </article>
            <article>
              <span className="badge">Receita rastreada</span>
              <strong>{snapshot.billingSummary.finance[1]?.value ?? "R$ 0,00"}</strong>
            </article>
          </section>

          <section className="panel">
            <div
              style={{
                alignItems: "center",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                justifyContent: "space-between"
              }}
            >
              <div>
                <h2>Resumo financeiro e pipeline</h2>
                <p style={{ color: "var(--muted)", marginBottom: 0 }}>
                  Metricas reais do backend canonico de dashboard.
                </p>
              </div>
              <Link href="/settings/billing">Abrir billing</Link>
            </div>

            <div className="stats-grid" style={{ marginTop: "1rem" }}>
              {snapshot.metrics.finance.map((item) => (
                <article key={item.label}>
                  <span className="badge">{item.label}</span>
                  <strong>{item.value}</strong>
                  <p style={{ color: "var(--muted)", marginBottom: 0 }}>{item.delta}</p>
                </article>
              ))}
            </div>

            <div className="table-wrapper" style={{ marginTop: "1rem" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Stage</th>
                    <th>Valor</th>
                    <th>Tendência</th>
                  </tr>
                </thead>
                <tbody>
                  {snapshot.metrics.pipeline.map((item) => (
                    <tr key={item.stage}>
                      <td>{item.stage}</td>
                      <td>{item.value.toLocaleString("pt-BR")}</td>
                      <td>{item.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
            }}
          >
            <article className="panel">
              <h2>Saude de clientes</h2>
              <p style={{ color: "var(--muted)" }}>
                Score, risco e NPS derivado do backend administrativo.
              </p>

              {snapshot.agentStatuses.healthScore.length === 0 ? (
                <p style={{ marginBottom: 0 }}>Nenhum cliente monitorado para o tenant atual.</p>
              ) : (
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Score</th>
                        <th>Risco</th>
                        <th>NPS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {snapshot.agentStatuses.healthScore.map((item) => (
                        <tr key={item.client}>
                          <td>{item.client}</td>
                          <td>{item.score}</td>
                          <td>
                            <span className={`status-pill ${riskClass(item.risk)}`}>{item.risk}</span>
                          </td>
                          <td>{item.nps}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>

            <article className="panel">
              <h2>Carteira e aquisição</h2>
              <p style={{ color: "var(--muted)" }}>
                Contratos recentes e canais de origem mais ativos.
              </p>

              {snapshot.recentTasks.contracts.length === 0 ? (
                <p>Nenhum contrato recente disponível.</p>
              ) : (
                <div className="table-wrapper" style={{ marginBottom: "1rem" }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>MRR</th>
                        <th>Owner</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {snapshot.recentTasks.contracts.map((item) => (
                        <tr key={`${item.customer}-${item.owner}`}>
                          <td>{item.customer}</td>
                          <td>{item.mrr}</td>
                          <td>{item.owner}</td>
                          <td>{item.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {snapshot.recentTasks.attribution.length === 0 ? (
                <p style={{ marginBottom: 0 }}>Nenhuma fonte de aquisição consolidada ainda.</p>
              ) : (
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Fonte</th>
                        <th>Leads</th>
                        <th>Conversão</th>
                        <th>CAC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {snapshot.recentTasks.attribution.map((item) => (
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
            </article>
          </section>
        </>
      ) : (
        <section className="panel">
          <h2>Visao administrativa indisponivel</h2>
          <p>
            A rota canonica do dashboard ja existe, mas os indicadores administrativos nao puderam
            ser carregados para esta sessao.
          </p>
          <p style={{ color: "var(--muted)", marginBottom: 0 }}>
            Detalhe tecnico: {errorMessage ?? "Falha nao identificada."}
          </p>
        </section>
      )}
    </>
  );
}
