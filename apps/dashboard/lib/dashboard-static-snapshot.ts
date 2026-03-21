import type { DashboardSnapshot } from "./dashboard-types";

export const DASHBOARD_STATIC_SNAPSHOT: DashboardSnapshot = {
  attribution: [],
  contracts: [],
  finance: [
      { label: "MRR", value: "$10K", trend: "up" },
      { label: "Cash In", value: "$10K", trend: "up" }
  ],
  healthScore: [
      { accountId: "acc-1", name: "Atlas Log", client: "Atlas Log", score: 85, risk: "High", trend: "up", nps: 10 } as any
  ],
  pipeline: [
      { stage: "Prospecção", count: 10, value: 50000, trend: "up" }
  ]
};
