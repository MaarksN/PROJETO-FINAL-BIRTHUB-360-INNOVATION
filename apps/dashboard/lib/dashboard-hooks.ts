"use client";

import useSWR from "swr";

import { DASHBOARD_STATIC_SNAPSHOT } from "./dashboard-static-snapshot";
import type {
  AttributionItem,
  ContractItem,
  FinanceItem,
  HealthScoreItem,
  PipelineItem
} from "./dashboard-types";

// [SOURCE] BirthHub360 — Remediação Forense.html — GAP-DASH-003
const useStaticSnapshot = process.env.NEXT_PUBLIC_DASHBOARD_USE_STATIC_SNAPSHOT === "true";

const SWR_OPTIONS = {
  dedupingInterval: 30_000,
  keepPreviousData: true,
  revalidateIfStale: true,
  revalidateOnFocus: true
} as const;

async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    credentials: "same-origin"
  });

  if (!response.ok) {
    throw new Error(`dashboard_fetch_failed:${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function useMetrics() {
  if (useStaticSnapshot) {
    return {
      data: {
        pipeline: DASHBOARD_STATIC_SNAPSHOT.pipeline,
        finance: DASHBOARD_STATIC_SNAPSHOT.finance
      },
      empty: DASHBOARD_STATIC_SNAPSHOT.pipeline.length === 0,
      error: undefined,
      loading: false
    };
  }

  const swr = useSWR<{ pipeline: PipelineItem[]; finance: FinanceItem[] }>(
    "/api/dashboard/metrics",
    fetcher,
    SWR_OPTIONS
  );

  return {
    data: swr.data,
    empty: !swr.isLoading && !swr.error && (!swr.data || swr.data.pipeline.length === 0),
    error: swr.error,
    loading: swr.isLoading
  };
}

export function useAgentStatuses() {
  if (useStaticSnapshot) {
    return {
      data: {
        healthScore: DASHBOARD_STATIC_SNAPSHOT.healthScore
      },
      empty: DASHBOARD_STATIC_SNAPSHOT.healthScore.length === 0,
      error: undefined,
      loading: false
    };
  }

  const swr = useSWR<{ healthScore: HealthScoreItem[] }>(
    "/api/dashboard/agent-statuses",
    fetcher,
    SWR_OPTIONS
  );

  return {
    data: swr.data,
    empty: !swr.isLoading && !swr.error && (!swr.data || swr.data.healthScore.length === 0),
    error: swr.error,
    loading: swr.isLoading
  };
}

export function useRecentTasks() {
  if (useStaticSnapshot) {
    return {
      data: {
        contracts: DASHBOARD_STATIC_SNAPSHOT.contracts,
        attribution: DASHBOARD_STATIC_SNAPSHOT.attribution
      },
      empty: DASHBOARD_STATIC_SNAPSHOT.contracts.length === 0,
      error: undefined,
      loading: false
    };
  }

  const swr = useSWR<{ contracts: ContractItem[]; attribution: AttributionItem[] }>(
    "/api/dashboard/recent-tasks",
    fetcher,
    SWR_OPTIONS
  );

  return {
    data: swr.data,
    empty: !swr.isLoading && !swr.error && (!swr.data || swr.data.contracts.length === 0),
    error: swr.error,
    loading: swr.isLoading
  };
}

export function useBillingSummary() {
  if (useStaticSnapshot) {
    return {
      data: {
        finance: DASHBOARD_STATIC_SNAPSHOT.finance
      },
      empty: DASHBOARD_STATIC_SNAPSHOT.finance.length === 0,
      error: undefined,
      loading: false
    };
  }

  const swr = useSWR<{ finance: FinanceItem[] }>(
    "/api/dashboard/billing-summary",
    fetcher,
    SWR_OPTIONS
  );

  return {
    data: swr.data,
    empty: !swr.isLoading && !swr.error && (!swr.data || swr.data.finance.length === 0),
    error: swr.error,
    loading: swr.isLoading
  };
}
