import { cookies } from "next/headers";

import { fetchWithTimeout } from "../../../packages/utils/src/fetch";

import type { DashboardSnapshot } from "./dashboard-types";

const DASHBOARD_SECTION_TIMEOUT_MS = 5_000;

function resolveApiBaseUrl(): string {
  return process.env.API_URL?.trim() || "http://localhost:3000";
}

async function fetchDashboardSection<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const response = await fetchWithTimeout(`${resolveApiBaseUrl()}${path}`, {
    cache: "no-store",
    headers: {
      cookie: cookieStore.toString()
    },
    timeoutMessage: `Dashboard data exceeded the ${DASHBOARD_SECTION_TIMEOUT_MS}ms timeout budget.`,
    timeoutMs: DASHBOARD_SECTION_TIMEOUT_MS
  });

  if (!response.ok) {
    throw new Error(`dashboard_fetch_failed:${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const [metrics, statuses, recentTasks, billingSummary] = await Promise.all([
    fetchDashboardSection<{ finance: DashboardSnapshot["finance"]; pipeline: DashboardSnapshot["pipeline"] }>(
      "/api/v1/dashboard/metrics"
    ),
    fetchDashboardSection<{ healthScore: DashboardSnapshot["healthScore"] }>(
      "/api/v1/dashboard/agent-statuses"
    ),
    fetchDashboardSection<{ attribution: DashboardSnapshot["attribution"]; contracts: DashboardSnapshot["contracts"] }>(
      "/api/v1/dashboard/recent-tasks"
    ),
    fetchDashboardSection<{ finance: DashboardSnapshot["finance"] }>(
      "/api/v1/dashboard/billing-summary"
    )
  ]);

  return {
    attribution: recentTasks.attribution,
    contracts: recentTasks.contracts,
    finance: billingSummary.finance,
    healthScore: statuses.healthScore,
    pipeline: metrics.pipeline
  };
}
