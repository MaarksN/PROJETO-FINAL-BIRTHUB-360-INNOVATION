export type AgentStatus = "DEPRECATED" | "DRAFT" | "PUBLISHED";
export type ExecutionStatus = "FAILED" | "RUNNING" | "SUCCESS";

export interface AgentExecutionRow {
  id: string;
  status: ExecutionStatus;
  startedAt: string;
  durationMs: number;
}

export interface AgentSnapshot {
  id: string;
  name: string;
  version: string;
  status: AgentStatus;
  lastRun: string;
  failRate: number;
  tags: string[];
  promptVersions: string[];
  manifest: Record<string, unknown>;
  logs: string[];
  executions: AgentExecutionRow[];
}

const AGENT_SNAPSHOTS: AgentSnapshot[] = [
  {
    id: "agent-onboarding",
    name: "Onboarding Concierge",
    version: "1.3.2",
    status: "PUBLISHED",
    lastRun: "2026-03-13T13:20:00.000Z",
    failRate: 0.08,
    tags: ["onboarding", "email"],
    promptVersions: [
      "You are an onboarding specialist. Collect intent and route to SDR.",
      "You are an onboarding specialist. Collect intent, classify urgency and route to SDR."
    ],
    manifest: {
      apiVersion: "1.0.0",
      name: "Onboarding Concierge",
      skills: [{ id: "intent-classifier", version: "1.0.0" }],
      tools: [{ id: "http", maxCalls: 5 }]
    },
    logs: ["Plan built with 2 tool calls", "HTTP call finished in 145ms", "Email sent to lead"],
    executions: [
      { id: "exec-101", status: "SUCCESS", startedAt: "2026-03-13T13:20:00.000Z", durationMs: 682 },
      { id: "exec-100", status: "FAILED", startedAt: "2026-03-13T13:14:00.000Z", durationMs: 931 },
      { id: "exec-099", status: "SUCCESS", startedAt: "2026-03-13T13:09:00.000Z", durationMs: 741 }
    ]
  },
  {
    id: "agent-finance-watch",
    name: "Finance Watchdog",
    version: "2.0.0",
    status: "DRAFT",
    lastRun: "2026-03-13T12:45:00.000Z",
    failRate: 0.2,
    tags: ["finance", "alerts"],
    promptVersions: [
      "Inspect invoices and report anomalies.",
      "Inspect invoices, classify severity and emit anomaly alerts."
    ],
    manifest: {
      apiVersion: "1.0.0",
      name: "Finance Watchdog",
      skills: [{ id: "anomaly-detector", version: "1.2.0" }],
      tools: [{ id: "db-read", maxCalls: 8 }]
    },
    logs: ["Plan built with 1 tool call", "db-read returned 210 rows", "2 anomalies found"],
    executions: [
      { id: "exec-301", status: "SUCCESS", startedAt: "2026-03-13T12:45:00.000Z", durationMs: 1102 },
      { id: "exec-300", status: "RUNNING", startedAt: "2026-03-13T12:42:00.000Z", durationMs: 0 },
      { id: "exec-299", status: "FAILED", startedAt: "2026-03-13T12:30:00.000Z", durationMs: 1420 }
    ]
  }
];

export function listAgentSnapshots(): AgentSnapshot[] {
  return AGENT_SNAPSHOTS.slice();
}

export function getAgentSnapshotById(id: string): AgentSnapshot | null {
  return AGENT_SNAPSHOTS.find((agent) => agent.id === id) ?? null;
}
