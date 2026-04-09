// @ts-nocheck
// 
import type { ApiConfig } from "@birthub/config";
import type { Express } from "express";

import { createAdminRouter } from "../modules/admin/router.js";
import { createInstalledAgentsRouter } from "../modules/agents/router.js";
import { createAnalyticsRouter } from "../modules/analytics/router.js";
import { createApiKeysRouter } from "../modules/apikeys/router.js";
import { createAuthRouter } from "../modules/auth/router.js";
import { createBillingRouter } from "../modules/billing/index.js";
import { createBreakGlassRouter } from "../modules/break-glass/router.js";
import { createBudgetRouter } from "../modules/budget/budget-routes.js";
import { createClinicalRouter } from "../modules/clinical/router.js";
import { createConnectorsRouter } from "../modules/connectors/index.js";
import { createConversationsRouter } from "../modules/conversations/index.js";
import { createDashboardRouter } from "../modules/dashboard/router.js";
import { createFeedbackRouter } from "../modules/feedback/index.js";
import { createFhirRouter } from "../modules/fhir/router.js";
import { createInvitesRouter } from "../modules/invites/router.js";
import { createMarketplaceRouter } from "../modules/marketplace/marketplace-routes.js";
import { createNotificationsRouter } from "../modules/notifications/index.js";
import { createOrganizationsRouter } from "../modules/organizations/router.js";
import { createOutputRouter } from "../modules/outputs/output-routes.js";
import { createPackInstallerRouter } from "../modules/packs/pack-installer-routes.js";
import { createPrivacyRouter } from "../modules/privacy/router.js";
import { createSearchRouter } from "../modules/search/index.js";
import { createSessionsRouter } from "../modules/sessions/router.js";
import { createUsersRouter } from "../modules/users/router.js";
import { createWebhooksRouter } from "../modules/webhooks/index.js";
import { createWorkflowsRouter } from "../modules/workflows/index.js";

type ModuleRouterDependencies = {
  createAdminRouter: typeof createAdminRouter;
  createAnalyticsRouter: typeof createAnalyticsRouter;
  createApiKeysRouter: typeof createApiKeysRouter;
  createAuthRouter: typeof createAuthRouter;
  createBillingRouter: typeof createBillingRouter;
  createBreakGlassRouter: typeof createBreakGlassRouter;
  createBudgetRouter: typeof createBudgetRouter;
  createClinicalRouter: typeof createClinicalRouter;
  createConnectorsRouter: typeof createConnectorsRouter;
  createConversationsRouter: typeof createConversationsRouter;
  createDashboardRouter: typeof createDashboardRouter;
  createFeedbackRouter: typeof createFeedbackRouter;
  createFhirRouter: typeof createFhirRouter;
  createInstalledAgentsRouter: typeof createInstalledAgentsRouter;
  createInvitesRouter: typeof createInvitesRouter;
  createMarketplaceRouter: typeof createMarketplaceRouter;
  createNotificationsRouter: typeof createNotificationsRouter;
  createOrganizationsRouter: typeof createOrganizationsRouter;
  createOutputRouter: typeof createOutputRouter;
  createPackInstallerRouter: typeof createPackInstallerRouter;
  createPrivacyRouter: typeof createPrivacyRouter;
  createSearchRouter: typeof createSearchRouter;
  createSessionsRouter: typeof createSessionsRouter;
  createUsersRouter: typeof createUsersRouter;
  createWebhooksRouter: typeof createWebhooksRouter;
  createWorkflowsRouter: typeof createWorkflowsRouter;
};

const defaultDependencies: ModuleRouterDependencies = {
  createAdminRouter,
  createAnalyticsRouter,
  createApiKeysRouter,
  createAuthRouter,
  createBillingRouter,
  createBreakGlassRouter,
  createBudgetRouter,
  createClinicalRouter,
  createConnectorsRouter,
  createConversationsRouter,
  createDashboardRouter,
  createFeedbackRouter,
  createFhirRouter,
  createInstalledAgentsRouter,
  createInvitesRouter,
  createMarketplaceRouter,
  createNotificationsRouter,
  createOrganizationsRouter,
  createOutputRouter,
  createPackInstallerRouter,
  createPrivacyRouter,
  createSearchRouter,
  createSessionsRouter,
  createUsersRouter,
  createWebhooksRouter,
  createWorkflowsRouter
};

export function mountModuleRouters(
  app: Express,
  config: ApiConfig,
  dependencies: ModuleRouterDependencies = defaultDependencies
): void {
  const marketplaceRouter = dependencies.createMarketplaceRouter();
  const installedAgentsRouter = dependencies.createInstalledAgentsRouter();

  app.use(dependencies.createAdminRouter(config));
  app.use("/api/v1/auth", dependencies.createAuthRouter(config));
  app.use("/api/v1", dependencies.createSessionsRouter(config));
  app.use("/api/v1/apikeys", dependencies.createApiKeysRouter(config));
  app.use("/api/v1/agents", installedAgentsRouter);
  app.use("/api/v1/agents", marketplaceRouter);
  app.use("/api/v1/analytics", dependencies.createAnalyticsRouter());
  app.use(dependencies.createDashboardRouter());
  app.use("/api/v1/connectors", dependencies.createConnectorsRouter(config));
  app.use("/api/v1", dependencies.createConversationsRouter());
  app.use("/api/v1/marketplace", marketplaceRouter);
  app.use("/api/v1/billing", dependencies.createBillingRouter(config));
  app.use("/api/v1", dependencies.createBreakGlassRouter(config));
  app.use("/api/v1/budgets", dependencies.createBudgetRouter());
  app.use("/api/v1", dependencies.createClinicalRouter());
  app.use("/api/v1", dependencies.createFeedbackRouter());
  app.use(dependencies.createFhirRouter());
  app.use("/api/v1", dependencies.createInvitesRouter());
  app.use("/api/v1", dependencies.createNotificationsRouter());
  app.use("/api/v1", dependencies.createOrganizationsRouter());
  app.use("/api/v1/packs", dependencies.createPackInstallerRouter());
  app.use("/api/v1/outputs", dependencies.createOutputRouter());
  app.use("/api/v1/privacy", dependencies.createPrivacyRouter(config));
  app.use("/api/v1", dependencies.createSearchRouter());
  app.use("/api/v1", dependencies.createUsersRouter());
  app.use(dependencies.createWorkflowsRouter(config));
  app.use(dependencies.createWebhooksRouter(config));
}
