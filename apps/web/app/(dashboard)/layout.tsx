import type { ReactNode } from "react";
import Link from "next/link";

import { DashboardBillingGate } from "../../components/dashboard-billing-gate";
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
          <Link href="/pricing">Pricing</Link>
          <Link href="/workflows/onboarding/edit">Workflow Builder</Link>
          <Link href="/workflows/onboarding/runs">Workflow Runs</Link>
          <Link href="/settings/billing">Billing Settings</Link>
          <Link href="/settings/members">Membros</Link>
          <Link href="/settings/audit">Audit Trail</Link>
          <Link href="/admin/analytics">Exec Analytics</Link>
        </nav>
      </header>
      <main className="dashboard-content">
        <DashboardBillingGate>{children}</DashboardBillingGate>
      </main>
    </div>
  );
}
