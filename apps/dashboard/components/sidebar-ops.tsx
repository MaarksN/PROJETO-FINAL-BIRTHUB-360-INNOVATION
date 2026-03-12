import Link from "next/link";

export function SidebarOps() {
  return (
    <aside className="card sidebar-ops" aria-label="Atalhos operacionais">
      <h2>Atalhos</h2>
      <ul className="list">
        <li><span>Onboarding</span><Link href="/onboarding">Abrir wizard</Link></li>
        <li><span>Pipeline</span><Link href="/pipeline">Ver funil</Link></li>
        <li><span>Atividades</span><Link href="/atividades">Logs dos agentes</Link></li>
      </ul>
    </aside>
  );
}
