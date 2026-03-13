import Link from "next/link";

import { listAgentSnapshots } from "../../../lib/agents.js";

function toPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export default function AgentsPage() {
  const agents = listAgentSnapshots();
  const totalCost = agents.reduce((acc, agent) => acc + agent.executions.length * 0.0015, 0);
  const recentFailures = agents.flatMap((agent) =>
    agent.executions
      .filter((execution) => execution.status === "FAILED")
      .map((execution) => ({ agent: agent.name, execution }))
  );

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <header>
        <h2 style={{ margin: 0 }}>Agents</h2>
        <p style={{ color: "var(--muted)", marginBottom: 0 }}>
          Lista de agentes por tenant com versão, status, última execução e taxa de falha.
        </p>
      </header>

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "1rem",
          display: "grid",
          gap: "0.75rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          padding: "1rem"
        }}
      >
        <div>
          <small style={{ color: "var(--muted)" }}>Agentes mais usados</small>
          <ul style={{ marginBottom: 0, marginTop: "0.35rem", paddingLeft: "1rem" }}>
            {agents
              .slice()
              .sort((left, right) => right.executions.length - left.executions.length)
              .map((agent) => (
                <li key={`usage-${agent.id}`}>
                  {agent.name}: {agent.executions.length} execuções
                </li>
              ))}
          </ul>
        </div>
        <div>
          <small style={{ color: "var(--muted)" }}>Falhas recentes</small>
          <ul style={{ marginBottom: 0, marginTop: "0.35rem", paddingLeft: "1rem" }}>
            {recentFailures.length === 0 ? <li>Sem falhas recentes</li> : null}
            {recentFailures.slice(0, 4).map(({ agent, execution }) => (
              <li key={`failure-${execution.id}`}>
                {agent}: {execution.id}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <small style={{ color: "var(--muted)" }}>Custo acumulado</small>
          <p style={{ fontSize: "1.4rem", margin: 0 }}>${totalCost.toFixed(3)}</p>
        </div>
      </div>

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "1rem",
          overflow: "hidden"
        }}
      >
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead style={{ background: "rgba(19, 93, 102, 0.09)" }}>
            <tr>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Nome</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Versão</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Status</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Última execução</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Fail rate</th>
              <th style={{ padding: "0.75rem", textAlign: "left" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td style={{ borderTop: "1px solid var(--border)", padding: "0.75rem" }}>{agent.name}</td>
                <td style={{ borderTop: "1px solid var(--border)", padding: "0.75rem" }}>{agent.version}</td>
                <td style={{ borderTop: "1px solid var(--border)", padding: "0.75rem" }}>{agent.status}</td>
                <td style={{ borderTop: "1px solid var(--border)", padding: "0.75rem" }}>
                  {new Date(agent.lastRun).toLocaleString("pt-BR")}
                </td>
                <td style={{ borderTop: "1px solid var(--border)", padding: "0.75rem" }}>
                  {toPercent(agent.failRate)}
                </td>
                <td style={{ borderTop: "1px solid var(--border)", padding: "0.75rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link href={`/agents/${agent.id}`}>Overview</Link>
                    <Link href={`/agents/${agent.id}/run`}>Run</Link>
                    <Link href={`/agents/${agent.id}/policies`}>Policies</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
