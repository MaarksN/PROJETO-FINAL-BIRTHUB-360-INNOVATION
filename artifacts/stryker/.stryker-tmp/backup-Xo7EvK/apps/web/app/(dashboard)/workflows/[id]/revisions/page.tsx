"use client";

import { use, useEffect, useMemo, useState, useTransition } from "react";
import ReactFlow, { Background, MiniMap, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";

import type { WorkflowCanvas } from "@birthub/workflows-core";

import { fetchWithSession } from "../../../../../lib/auth-client";
import { nodeTypes, canvasToFlow } from "../edit/workflow-editor-helpers";

type WorkflowRevisionSnapshot = {
  id: string;
  version: number;
  definition: WorkflowCanvas;
  createdAt: string;
};

export default function WorkflowRevisionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [revisions, setRevisions] = useState<WorkflowRevisionSnapshot[]>([]);
  const [selectedRevisionId, setSelectedRevisionId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    async function loadRevisions(): Promise<void> {
      try {
        const response = await fetchWithSession(`/api/v1/workflows/${id}/revisions`);
        if (!response.ok) {
          throw new Error("Falha ao carregar historico.");
        }
        const payload = await response.json();
        if (cancelled) {
          return;
        }

        setRevisions(payload.items);
        if (payload.items.length > 0) {
          setSelectedRevisionId(payload.items[0].id);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Falha ao carregar historico.");
        }
      }
    }

    void loadRevisions();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const selectedRevision = useMemo(
    () => revisions.find((rev) => rev.id === selectedRevisionId) ?? revisions[0],
    [revisions, selectedRevisionId]
  );

  const graph = useMemo(() => {
    if (!selectedRevision) return { edges: [], nodes: [] };
    // Assuming status as PUBLISHED for the graph visualization for diff
    return canvasToFlow(selectedRevision.definition, "PUBLISHED");
  }, [selectedRevision]);

  const handleRevert = () => {
    if (!selectedRevision) return;

    startTransition(() => {
      setError(null);
      setSaveMessage(null);
      void (async () => {
        try {
          const response = await fetchWithSession(`/api/v1/workflows/${id}/revert`, {
            body: JSON.stringify({ version: selectedRevision.version }),
            headers: {
              "content-type": "application/json"
            },
            method: "POST"
          });

          if (!response.ok) {
             throw new Error("Falha ao reverter fluxo.");
          }

          setSaveMessage(`Revertido com sucesso para a versao ${selectedRevision.version}. O workflow foi salvo como rascunho (DRAFT).`);

          // Reload revisions
          const revisionsResponse = await fetchWithSession(`/api/v1/workflows/${id}/revisions`);
          if (revisionsResponse.ok) {
             const payload = await revisionsResponse.json();
             setRevisions(payload.items);
             if (payload.items.length > 0) {
               setSelectedRevisionId(payload.items[0].id);
             }
          }
        } catch (revertError) {
          setError(revertError instanceof Error ? revertError.message : "Falha ao reverter fluxo.");
        }
      })();
    });
  };

  return (
    <section style={{ display: "grid", gap: "0.85rem", height: "calc(100vh - 110px)", gridTemplateRows: "auto 1fr" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ margin: 0 }}>Workflow Revisions - {id}</h2>
          <p style={{ color: "var(--muted)", marginBottom: 0 }}>
            Historico de alteracoes no workflow. Ver diff visual e restaurar versoes.
          </p>
        </div>
        {saveMessage && <div style={{ color: "#1b4332", background: "#edfdf4", padding: "0.5rem 1rem", borderRadius: "8px" }}>{saveMessage}</div>}
        {error && <div style={{ color: "#9d0208", background: "#fff5f5", padding: "0.5rem 1rem", borderRadius: "8px" }}>{error}</div>}
      </header>

      <div
        style={{
          display: "grid",
          gap: "0.75rem",
          gridTemplateColumns: "300px minmax(0, 1fr)",
          minHeight: 0
        }}
      >
        <div style={{ border: "1px solid #d9e2ec", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "#f1f5f9", padding: "0.65rem", fontWeight: 600, borderBottom: "1px solid #d9e2ec" }}>Versoes</div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {revisions.map((rev) => (
              <div
                key={rev.id}
                onClick={() => setSelectedRevisionId(rev.id)}
                style={{
                  padding: "0.85rem",
                  borderBottom: "1px solid #e2e8f0",
                  cursor: "pointer",
                  background: selectedRevisionId === rev.id ? "#e0f2fe" : "white",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>v{rev.version}</div>
                  <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{new Date(rev.createdAt).toLocaleString("pt-BR")}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ border: "1px solid #d9e2ec", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "0.65rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #d9e2ec", background: "white" }}>
                <div style={{ fontWeight: 600 }}>Visualizacao do Canvas - v{selectedRevision?.version}</div>
                <button
                    disabled={isPending || revisions[0]?.id === selectedRevisionId}
                    onClick={handleRevert}
                    style={{ padding: "0.4rem 1rem", background: revisions[0]?.id === selectedRevisionId ? "#e2e8f0" : "#2563eb", color: revisions[0]?.id === selectedRevisionId ? "#94a3b8" : "white", borderRadius: "6px", border: "none", cursor: revisions[0]?.id === selectedRevisionId ? "not-allowed" : "pointer", fontWeight: 600 }}
                >
                    Reverter para v{selectedRevision?.version}
                </button>
            </div>
          <div style={{ flex: 1, position: "relative" }}>
             {graph.nodes.length > 0 && (
                <ReactFlow
                    edges={graph.edges}
                    fitView
                    nodes={graph.nodes}
                    nodeTypes={nodeTypes}
                    nodesDraggable={false}
                    panOnDrag={true}
                >
                    <MiniMap />
                    <Background gap={20} />
                </ReactFlow>
             )}
          </div>
        </div>
      </div>
    </section>
  );
}
