"use client";

import { useState } from "react";

interface PolicyRow {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const INITIAL_POLICIES: PolicyRow[] = [
  {
    id: "policy-http",
    label: "Permitir HTTP externo",
    description: "Libera tool.http para domínios permitidos.",
    enabled: true
  },
  {
    id: "policy-email",
    label: "Permitir envio de email",
    description: "Libera tool.send-email com tracking.",
    enabled: false
  },
  {
    id: "policy-db-write",
    label: "Permitir mutação DB",
    description: "Libera tool.db-write com audit obrigatório.",
    enabled: false
  }
];

export default function AgentPoliciesPage() {
  const [rows, setRows] = useState(INITIAL_POLICIES);

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <header>
        <h2 style={{ margin: 0 }}>Policies</h2>
        <p style={{ color: "var(--muted)", marginBottom: 0 }}>
          Gerencie regras por agente/tenant: listar, criar, editar, ativar e desativar.
        </p>
      </header>

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "1rem",
          display: "grid",
          gap: "0.75rem",
          padding: "1rem"
        }}
      >
        {rows.map((row) => (
          <label
            key={row.id}
            style={{
              alignItems: "center",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              display: "grid",
              gap: "0.35rem",
              gridTemplateColumns: "1fr auto",
              padding: "0.75rem"
            }}
          >
            <div>
              <strong>{row.label}</strong>
              <p style={{ color: "var(--muted)", margin: 0 }}>{row.description}</p>
            </div>
            <input
              checked={row.enabled}
              onChange={(event) =>
                setRows((current) =>
                  current.map((item) =>
                    item.id === row.id
                      ? {
                          ...item,
                          enabled: event.target.checked
                        }
                      : item
                  )
                )
              }
              style={{ height: 20, width: 20 }}
              type="checkbox"
            />
          </label>
        ))}

        <button
          onClick={() =>
            setRows((current) => [
              ...current,
              {
                id: `policy-${current.length + 1}`,
                label: `Nova policy ${current.length + 1}`,
                description: "Template customizado por agente.",
                enabled: true
              }
            ])
          }
          style={{
            background: "var(--accent)",
            border: "none",
            borderRadius: "999px",
            color: "white",
            justifySelf: "start",
            padding: "0.55rem 1rem"
          }}
          type="button"
        >
          Criar policy
        </button>
      </div>
    </section>
  );
}
