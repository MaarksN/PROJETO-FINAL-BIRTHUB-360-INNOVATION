import type { ReactNode } from "react";
import Link from "next/link";

import "./dashboard.css";

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="dashboard-shell">
      <header className="dashboard-topbar">
        <div className="dashboard-title">
          <span>BirthHub360</span>
          <strong>Tenant Command Center</strong>
        </div>
        <nav className="dashboard-nav">
          <Link href="/billing">Billing</Link>
          <Link href="/settings/members">Membros</Link>
          <Link href="/settings/audit">Audit Trail</Link>
        </nav>
      </header>
      <main className="dashboard-content">{children}</main>
    </div>
  );
}
