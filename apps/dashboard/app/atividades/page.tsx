// [SOURCE] CI-TS-004
import { AgentActivityLog } from "../../components/agent-activity-log";
import { RealtimeBanner } from "../../components/realtime-banner";
import { getAgentLogs } from "../../lib/api";

export default async function AtividadesPage() {
  const logs = await getAgentLogs();

  return (
    <main className="container">
      <header className="header">
        <h1>Log de Atividades dos Agentes</h1>
        <RealtimeBanner />
      </header>
      <article className="card">
        <AgentActivityLog initialLogs={logs} />
      </article>
    </main>
  );
}
