// [SOURCE] BirthHub360 — Remediação Forense.html — GAP-DASH-003
import Link from "next/link";

const QUICK_LINKS = [
  { href: "/ldr", label: "LDR" },
  { href: "/pipeline", label: "SDR" },
  { href: "/ae", label: "AE" },
  { href: "/health-score", label: "CS" },
  { href: "/financeiro", label: "Finance" }
];

export function SidebarOps() {
  return (
    <aside className="sidebar-ops card">
      <h2>Ops Navigator</h2>
      <p className="muted">Atalhos de execução para módulos comerciais.</p>
      <ul className="list">
        {QUICK_LINKS.map((item) => (
          <li key={item.href}>
            <span>{item.label}</span>
            <Link href={item.href}>Abrir</Link>
            <small>{item.href}</small>
          </li>
        ))}
      </ul>
    </aside>
  );
}
