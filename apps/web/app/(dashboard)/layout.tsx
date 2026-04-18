import type { ReactNode } from "react";

import { DashboardBillingGate } from "../../components/dashboard-billing-gate.js";
import { Navbar } from "../../components/layout/Navbar.js";
import { requireAuthenticatedWebSession } from "../../lib/web-session.js";
import "./dashboard.css";

export default async function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
  await requireAuthenticatedWebSession();

  return (
    <div className="dashboard-shell">
      <header className="dashboard-topbar">
        <Navbar />
      </header>
      <main className="dashboard-content">
        <DashboardBillingGate>{children}</DashboardBillingGate>
      </main>
    </div>
  );
}
