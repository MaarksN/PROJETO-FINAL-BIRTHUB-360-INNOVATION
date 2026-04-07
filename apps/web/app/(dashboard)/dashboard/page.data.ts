import { fetchProductJson } from "../../../lib/product-api.server";

export type DashboardMetricsPayload = {
  finance: Array<{
    delta: string;
    label: string;
    value: string;
  }>;
  pipeline: Array<{
    stage: string;
    trend: string;
    value: number;
  }>;
};

export type DashboardHealthPayload = {
  healthScore: Array<{
    client: string;
    nps: number;
    risk: string;
    score: number;
  }>;
};

export type DashboardRecentPayload = {
  attribution: Array<{
    cac: string;
    conversion: string;
    leads: number;
    source: string;
  }>;
  contracts: Array<{
    customer: string;
    mrr: string;
    owner: string;
    status: string;
  }>;
};

export type BillingUsagePayload = {
  plan: {
    code: string;
    name: string;
  };
  status: string;
  usage: Record<string, number>;
};

export type WorkflowListPayload = {
  items: Array<{
    _count: {
      executions: number;
      steps: number;
    };
    createdAt: string;
    id: string;
    name: string;
    status: "ARCHIVED" | "DRAFT" | "PUBLISHED";
    triggerType: string;
    updatedAt: string;
  }>;
};

export type OnboardingPayload = {
  enabled: boolean;
  items: Array<{
    complete: boolean;
    ctaHref: string;
    ctaLabel: string;
    description: string;
    id: string;
    title: string;
  }>;
  nextHref: string;
  progress: number;
};

export function formatRiskTone(risk: string): "status-green" | "status-red" | "status-yellow" {
  if (risk === "baixo") {
    return "status-green";
  }

  if (risk === "alto") {
    return "status-red";
  }

  return "status-yellow";
}

export async function loadDashboardHomePage() {
  const [metrics, health, recent, billing, workflows, onboarding] = await Promise.all([
    fetchProductJson<DashboardMetricsPayload>("/api/v1/dashboard/metrics"),
    fetchProductJson<DashboardHealthPayload>("/api/v1/dashboard/agent-statuses"),
    fetchProductJson<DashboardRecentPayload>("/api/v1/dashboard/recent-tasks"),
    fetchProductJson<BillingUsagePayload>("/api/v1/billing/usage"),
    fetchProductJson<WorkflowListPayload>("/api/v1/workflows"),
    fetchProductJson<OnboardingPayload>("/api/v1/dashboard/onboarding")
  ]);

  return {
    billing,
    health,
    metrics,
    onboarding,
    recent,
    workflows
  };
}
