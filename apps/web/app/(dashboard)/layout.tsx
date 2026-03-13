import Link from "next/link";
import React from "react";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main
      style={{
        display: "grid",
        gap: "1.5rem",
        margin: "0 auto",
        maxWidth: 1180,
        padding: "2rem 1.25rem 3rem"
      }}
    >
      <header
        style={{
          alignItems: "center",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "1rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          justifyContent: "space-between",
          padding: "0.9rem 1rem"
        }}
      >
        <strong>BirthHub360 Security Center</strong>
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <Link href="/settings/security">Sessoes</Link>
          <Link href="/settings/team">Roles</Link>
          <Link href="/settings/users">Usuarios</Link>
          <Link href="/profile/security">MFA</Link>
          <Link href="/developers/apikeys">API Keys</Link>
        </nav>
      </header>
      {children}
    </main>
  );
}
