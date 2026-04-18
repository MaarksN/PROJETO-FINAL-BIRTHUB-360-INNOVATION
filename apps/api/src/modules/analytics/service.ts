// @ts-expect-error TODO: remover suppressão ampla
// 
export * from "./reporting.service";
export * from "./usage.service";

import { analyticsDashboardService } from "./dashboard.service";
import {
  exportBillingCsv,
  getCsRiskAccounts,
  getExecutiveMetrics,
  getGlobalAgentPerformance,
  getQualityReport,
  getCohortMetrics
} from "./reporting.service";
import {
  getActiveTenantsMetrics,
  getUsageMetrics
} from "./usage.service";

export const analyticsRouterService = {
  ...analyticsDashboardService,
  exportBillingCsv,
  getActiveTenantsMetrics,
  getCohortMetrics,
  getCsRiskAccounts,
  getExecutiveMetrics,
  getGlobalAgentPerformance,
  getQualityReport,
  getUsageMetrics
} as const;

