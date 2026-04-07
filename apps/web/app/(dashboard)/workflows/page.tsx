import Link from "next/link";

import {
  ProductEmptyState,
  ProductPageHeader
} from "../../../components/dashboard/page-fragments";
import { CreateWorkflowButton } from "../../../components/workflows/CreateWorkflowButton";
import { RunWorkflowButton } from "../../../components/workflows/RunWorkflowButton";
import { fetchProductJson } from "../../../lib/product-api.server";

type WorkflowListPayload = {
  items: Array<{
    _count: {
      executions: number;
      steps: number;
    };
    createdAt: string;
    id: string;
    name: string;
    status: "ARCHIVED" | "DRAFT" | "PUBLISHED";
    triggerType: string;
    updatedAt: string;
  }>;
};

export default async function WorkflowsPage() {
  const data = await fetchProductJson<WorkflowListPayload>("/api/v1/workflows");

  return (
    <main className="dashboard-content">
      <ProductPageHeader
        actions={
          <div className="hero-actions">
            <CreateWorkflowButton />
            <Link className="ghost-button" href="/dashboard">
              Voltar para home
            </Link>
          </div>
        }
        badge="Workflow list"
        description="Lista central de fluxos com status, trigger, CTA principal e acesso rapido ao editor real."
        title="Operar workflows sem sair da interface"
      />

      {data.items.length === 0 ? (
        <ProductEmptyState
          action={<CreateWorkflowButton />}
          description="Crie o primeiro workflow para começar a operar a automacao pelo produto."
          title="Nenhum workflow criado"
        />
      ) : (
        <section
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
          }}
        >
          {data.items.map((workflow) => (
            <article className="panel" key={workflow.id}>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.65rem"
                }}
              >
                <strong>{workflow.name}</strong>
                <span className="status-pill">{workflow.status}</span>
              </div>
              <p style={{ color: "var(--muted)", marginTop: 0 }}>
                {workflow.triggerType} · {workflow._count.steps} etapas · {workflow._count.executions} execucoes
              </p>
              <p style={{ color: "var(--muted)" }}>
                Atualizado em {new Date(workflow.updatedAt).toLocaleString("pt-BR")}
              </p>

              <div style={{ display: "grid", gap: "0.75rem" }}>
                {workflow.status === "PUBLISHED" ? (
                  <RunWorkflowButton workflowId={workflow.id} />
                ) : (
                  <Link className="action-button" href={`/workflows/${workflow.id}/edit`}>
                    Continuar edicao
                  </Link>
                )}
                <div className="hero-actions">
                  <Link className="ghost-button" href={`/workflows/${workflow.id}/edit`}>
                    Abrir editor
                  </Link>
                  <Link className="ghost-button" href={`/workflows/${workflow.id}/runs`}>
                    Ver execucoes
                  </Link>
                  <Link className="ghost-button" href={`/workflows/${workflow.id}/revisions`}>
                    Revisoes
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
