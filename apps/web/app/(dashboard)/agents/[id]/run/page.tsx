import { notFound } from "next/navigation";

import { getWebConfig } from "@birthub/config";

import { AgentRunPanel } from "../../../../../components/agents/agent-run-panel";
import { getAgentSnapshotById } from "../../../../../lib/agents";

export default function AgentRunPage({ params }: Readonly<{ params: { id: string } }>) {
  const agent = getAgentSnapshotById(params.id);
  if (!agent) {
    notFound();
  }

  const config = getWebConfig();

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <header>
        <h2 style={{ margin: 0 }}>Run Agent</h2>
        <p style={{ color: "var(--muted)", marginBottom: 0 }}>
          Execução manual com input customizado e logs em tempo real via SSE.
        </p>
      </header>
      <AgentRunPanel agentId={agent.id} apiUrl={config.NEXT_PUBLIC_API_URL} />
    </section>
  );
}
