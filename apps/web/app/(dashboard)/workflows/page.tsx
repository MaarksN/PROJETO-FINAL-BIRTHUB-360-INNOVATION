import Link from "next/link";

import { listWorkflows, type WorkflowListItem } from "../../../lib/workflows";

function statusClass(status: WorkflowListItem["status"]): string {
  if (status === "PUBLISHED") {
    return "status-green";
  }

  if (status === "DRAFT") {
    return "status-yellow";
  }

  return "status-red";
}

function lintLabel(workflow: WorkflowListItem): string {
  if (!workflow.stepLint) {
    return "Sem lint disponivel";
  }

  const { critical, warning } = workflow.stepLint.summary;
  if (critical === 0 && warning === 0) {
    return "Sem alertas";
  }

  return `${critical} critico(s) · ${warning} aviso(s)`;
}

export default async function WorkflowsPage() {
  const workflows = await listWorkflows();
  const published = workflows.filter((workflow) => workflow.status === "PUBLISHED").length;
  const drafts = workflows.filter((workflow) => workflow.status === "DRAFT").length;
  const archived = workflows.filter((workflow) => workflow.status === "ARCHIVED").length;
  const executions = workflows.reduce((sum, workflow) => sum + workflow._count.executions, 0);

  return (
    <>
      <section className="hero-card">
        <span className="badge">Listagem canonica</span>
        <h1>Workflows reais do tenant</h1>
        <p>
          Superficie oficial para descobrir, revisar e operar workflows publicados, draft e
          arquivados sem depender de URL direta.
        </p>
        <div className="hero-actions">
          <Link href="/dashboard">Voltar ao dashboard</Link>
          <Link href="/settings/developers/webhooks">Webhooks</Link>
        </div>
      </section>

      <section className="stats-grid">
        <article>
          <span className="badge">Publicados</span>
          <strong>{published.toLocaleString("pt-BR")}</strong>
        </article>
        <article>
          <span className="badge">Drafts</span>
          <strong>{drafts.toLocaleString("pt-BR")}</strong>
        </article>
        <article>
          <span className="badge">Arquivados</span>
          <strong>{archived.toLocaleString("pt-BR")}</strong>
        </article>
        <article>
          <span className="badge">Execucoes rastreadas</span>
          <strong>{executions.toLocaleString("pt-BR")}</strong>
        </article>
      </section>

      {workflows.length === 0 ? (
        <section className="panel">
          <h2>Nenhum workflow encontrado</h2>
          <p>
            A rota canonica de listagem ja existe. Quando o tenant publicar ou salvar fluxos, eles
            aparecerao aqui automaticamente a partir da API real.
          </p>
        </section>
      ) : (
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
              <h2>Inventário operacional</h2>
              <p style={{ color: "var(--muted)", marginBottom: 0 }}>
                Status, trigger, lint semantico, passos e historico de execucoes.
              </p>
            </div>
            <Link href="/settings/developers/webhooks">Configurar entradas</Link>
          </div>

          <div className="table-wrapper" style={{ marginTop: "1rem" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Workflow</th>
                  <th>Status</th>
                  <th>Trigger</th>
                  <th>Versão</th>
                  <th>Passos</th>
                  <th>Execuções</th>
                  <th>Lint</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {workflows.map((workflow) => (
                  <tr key={workflow.id}>
                    <td>
                      <strong>{workflow.name}</strong>
                      <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                        {workflow.description ?? "Sem descricao operacional."}
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${statusClass(workflow.status)}`}>
                        {workflow.status}
                      </span>
                    </td>
                    <td>{workflow.triggerType}</td>
                    <td>v{workflow.version}</td>
                    <td>{workflow._count.steps}</td>
                    <td>{workflow._count.executions}</td>
                    <td>{lintLabel(workflow)}</td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        <Link href={`/workflows/${workflow.id}/edit`}>Editar</Link>
                        <Link href={`/workflows/${workflow.id}/runs`}>Runs</Link>
                        <Link href={`/workflows/${workflow.id}/revisions`}>Revisoes</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
