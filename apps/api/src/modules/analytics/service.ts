// @ts-nocheck
// 
export * from "./dashboard.service.js";
export * from "./reporting.service.js";
export * from "./usage.service.js";

import {
  getMasterAdminDashboard,
  getOperationsDashboard
} from "./dashboard.service.js";
import {
  exportBillingCsv,
  getCsRiskAccounts,
  getExecutiveMetrics,
  getGlobalAgentPerformance,
  getQualityReport,
  getCohortMetrics
} from "./reporting.service.js";
import {
  getActiveTenantsMetrics,
  getUsageMetrics
} from "./usage.service.js";

export const analyticsRouterService = {
  exportBillingCsv,
  getActiveTenantsMetrics,
  getCohortMetrics,
  getCsRiskAccounts,
  getExecutiveMetrics,
  getGlobalAgentPerformance,
  getMasterAdminDashboard,
  getOperationsDashboard,
  getQualityReport,
  getUsageMetrics
} as const;
