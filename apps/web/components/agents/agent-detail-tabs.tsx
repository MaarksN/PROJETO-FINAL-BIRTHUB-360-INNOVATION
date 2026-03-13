"use client";

import { useMemo, useState } from "react";

import type { AgentSnapshot, ExecutionStatus } from "../../lib/agents.js";

type TabKey = "executions" | "logs" | "manifest" | "metrics" | "overview";

interface AgentDetailTabsProps {
  agent: AgentSnapshot;
}

const TABS: TabKey[] = ["overview", "executions", "logs", "metrics", "manifest"];

function diffLines(previousText: string, nextText: string): Array<{ text: string; type: "added" | "removed" | "same" }> {
  const previous = previousText.split("\n");
  const next = nextText.split("\n");
  const removed = previous.filter((line) => !next.includes(line));
  const added = next.filter((line) => !previous.includes(line));

  return [
    ...removed.map((text) => ({ text, type: "removed" as const })),
    ...added.map((text) => ({ text, type: "added" as const })),
    ...next.filter((line) => previous.includes(line)).map((text) => ({ text, type: "same" as const }))
  ];
}

function tokenColor(token: string): string {
  if (token.startsWith("{") || token.startsWith("}")) {
    return "#7f4f24";
  }

  if (token.startsWith("\"")) {
    return "#2c6e49";
  }

  if (token === "true" || token === "false" || token === "null") {
    return "#8d3b72";
  }

  return "#1f1d17";
}

export function AgentDetailTabs({ agent }: Readonly<AgentDetailTabsProps>) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [statusFilter, setStatusFilter] = useState<ExecutionStatus | "ALL">("ALL");
  const [durationFilter, setDurationFilter] = useState<"ALL" | "FAST" | "SLOW">("ALL");
  const [periodFilter, setPeriodFilter] = useState<"24H" | "7D">("24H");
  const [page, setPage] = useState(1);
  const [promptVersionIndex, setPromptVersionIndex] = useState(agent.promptVersions.length - 1);
  const pageSize = 2;

  const filteredExecutions = useMemo(() => {
    return agent.executions
      .filter((execution) => (statusFilter === "ALL" ? true : execution.status === statusFilter))
      .filter((execution) =>
        durationFilter === "ALL"
          ? true
          : durationFilter === "FAST"
            ? execution.durationMs > 0 && execution.durationMs < 800
            : execution.durationMs >= 800
      )
      .filter((execution) => {
        if (periodFilter === "7D") {
          return true;
        }

        const now = Date.now();
        return now - new Date(execution.startedAt).getTime() <= 24 * 60 * 60 * 1000;
      });
  }, [agent.executions, durationFilter, periodFilter, statusFilter]);

  const paginatedExecutions = filteredExecutions.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filteredExecutions.length / pageSize));

  const promptDiff = diffLines(agent.promptVersions[0] ?? "", agent.promptVersions[promptVersionIndex] ?? "");
  const manifestTokens = JSON.stringify(agent.manifest, null, 2).split(/\s+/);

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      <nav style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? "var(--accent)" : "rgba(255,255,255,0.75)",
              border: "1px solid var(--border)",
              borderRadius: "999px",
              color: activeTab === tab ? "white" : "var(--text)",
              cursor: "pointer",
              padding: "0.45rem 0.95rem",
              textTransform: "capitalize"
            }}
            type="button"
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === "overview" ? (
        <article style={{ display: "grid", gap: "1rem" }}>
          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "1rem",
              padding: "1rem"
            }}
          >
            <h3 style={{ marginTop: 0 }}>Overview</h3>
            <p style={{ color: "var(--muted)", marginTop: 0 }}>
              Status atual: <strong>{agent.status}</strong>. Versão ativa: <strong>{agent.version}</strong>.
            </p>
            <p style={{ marginBottom: 0 }}>Tags: {agent.tags.join(", ")}</p>
          </div>

          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "1rem",
              padding: "1rem"
            }}
          >
            <h3 style={{ marginTop: 0 }}>Prompt Editor</h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <label>
                Versão do prompt:
                <select
                  onChange={(event) => setPromptVersionIndex(Number.parseInt(event.target.value, 10))}
                  style={{ marginLeft: "0.5rem" }}
                  value={String(promptVersionIndex)}
                >
                  {agent.promptVersions.map((_, index) => (
                    <option key={`prompt-${index}`} value={String(index)}>
                      V{index + 1}
                    </option>
                  ))}
                </select>
              </label>
              <textarea
                readOnly
                rows={4}
                style={{ borderRadius: "0.75rem", border: "1px solid var(--border)", fontFamily: "monospace", padding: "0.75rem" }}
                value={agent.promptVersions[promptVersionIndex]}
              />
              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: "0.75rem",
                  fontFamily: "monospace",
                  padding: "0.75rem"
                }}
              >
                {promptDiff.map((line, index) => (
                  <div
                    key={`diff-${index}`}
                    style={{
                      color: line.type === "added" ? "#1d6f42" : line.type === "removed" ? "#a11d2d" : "#555",
                      whiteSpace: "pre-wrap"
                    }}
                  >
                    {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "} {line.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      ) : null}

      {activeTab === "executions" ? (
        <article
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "1rem",
            display: "grid",
            gap: "0.75rem",
            padding: "1rem"
          }}
        >
          <h3 style={{ margin: 0 }}>Executions</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <select
              onChange={(event) => setStatusFilter(event.target.value as ExecutionStatus | "ALL")}
              value={statusFilter}
            >
              <option value="ALL">Status: todos</option>
              <option value="SUCCESS">Status: sucesso</option>
              <option value="FAILED">Status: falha</option>
              <option value="RUNNING">Status: em execução</option>
            </select>
            <select onChange={(event) => setPeriodFilter(event.target.value as "24H" | "7D")} value={periodFilter}>
              <option value="24H">Período: 24h</option>
              <option value="7D">Período: 7 dias</option>
            </select>
            <select
              onChange={(event) => setDurationFilter(event.target.value as "ALL" | "FAST" | "SLOW")}
              value={durationFilter}
            >
              <option value="ALL">Duração: todas</option>
              <option value="FAST">Duração: &lt; 800ms</option>
              <option value="SLOW">Duração: &gt;= 800ms</option>
            </select>
          </div>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>ID</th>
                <th style={{ textAlign: "left" }}>Status</th>
                <th style={{ textAlign: "left" }}>Início</th>
                <th style={{ textAlign: "left" }}>Duração</th>
              </tr>
            </thead>
            <tbody>
              {paginatedExecutions.map((execution) => (
                <tr key={execution.id}>
                  <td style={{ borderTop: "1px solid var(--border)", padding: "0.45rem 0" }}>{execution.id}</td>
                  <td style={{ borderTop: "1px solid var(--border)", padding: "0.45rem 0" }}>{execution.status}</td>
                  <td style={{ borderTop: "1px solid var(--border)", padding: "0.45rem 0" }}>
                    {new Date(execution.startedAt).toLocaleString("pt-BR")}
                  </td>
                  <td style={{ borderTop: "1px solid var(--border)", padding: "0.45rem 0" }}>
                    {execution.durationMs}ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ alignItems: "center", display: "flex", gap: "0.5rem", justifyContent: "space-between" }}>
            <small style={{ color: "var(--muted)" }}>
              Página {page} de {totalPages}
            </small>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} type="button">
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                type="button"
              >
                Próxima
              </button>
            </div>
          </div>
        </article>
      ) : null}

      {activeTab === "logs" ? (
        <article
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "1rem",
            padding: "1rem"
          }}
        >
          <h3 style={{ marginTop: 0 }}>Logs</h3>
          <ul style={{ marginBottom: 0, marginTop: 0, paddingLeft: "1rem" }}>
            {agent.logs.map((logLine) => (
              <li key={logLine}>{logLine}</li>
            ))}
          </ul>
        </article>
      ) : null}

      {activeTab === "metrics" ? (
        <article
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "1rem",
            display: "grid",
            gap: "0.5rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            padding: "1rem"
          }}
        >
          <div>
            <small style={{ color: "var(--muted)" }}>execution_count</small>
            <p style={{ fontSize: "1.4rem", margin: 0 }}>{agent.executions.length}</p>
          </div>
          <div>
            <small style={{ color: "var(--muted)" }}>fail_rate</small>
            <p style={{ fontSize: "1.4rem", margin: 0 }}>{Math.round(agent.failRate * 100)}%</p>
          </div>
          <div>
            <small style={{ color: "var(--muted)" }}>p95 latency</small>
            <p style={{ fontSize: "1.4rem", margin: 0 }}>
              {Math.max(...agent.executions.map((row) => row.durationMs || 0))}ms
            </p>
          </div>
          <div>
            <small style={{ color: "var(--muted)" }}>tool_cost</small>
            <p style={{ fontSize: "1.4rem", margin: 0 }}>$0.012</p>
          </div>
        </article>
      ) : null}

      {activeTab === "manifest" ? (
        <article
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "1rem",
            padding: "1rem"
          }}
        >
          <h3 style={{ marginTop: 0 }}>Manifest</h3>
          <pre
            style={{
              background: "#fff",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              overflowX: "auto",
              padding: "0.75rem",
              whiteSpace: "pre-wrap"
            }}
          >
            {manifestTokens.map((token, index) => (
              <span key={`token-${index}`} style={{ color: tokenColor(token) }}>
                {token}{" "}
              </span>
            ))}
          </pre>
        </article>
      ) : null}
    </section>
  );
}
