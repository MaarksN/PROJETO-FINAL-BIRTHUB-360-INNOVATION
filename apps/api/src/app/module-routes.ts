import type { ApiConfig } from "@birthub/config";
import type { Express } from "express";

import { createAdminRouter } from "../modules/admin/router";
import { createInstalledAgentsRouter } from "../modules/agents/router";
import { createAnalyticsRouter } from "../modules/analytics/router";
import { createApiKeysRouter } from "../modules/apikeys/router";
import { createAuthRouter, mountAuthRoutes } from "../modules/auth/router";
import { createBillingRouter } from "../modules/billing/index";
import { createBreakGlassRouter } from "../modules/break-glass/router";
import { createBudgetRouter } from "../modules/budget/budget-routes";
import { createConnectorsRouter } from "../modules/connectors/index";
import { createConversationsRouter } from "../modules/conversations/index";
import { createDashboardRouter } from "../modules/dashboard/router";
import { createFeedbackRouter } from "../modules/feedback/index";
import { createInvitesRouter } from "../modules/invites/router";
import { createMarketplaceRouter } from "../modules/marketplace/marketplace-routes";
import { createNotificationsRouter } from "../modules/notifications/index";
import { createOrganizationsRouter } from "../modules/organizations/router";
import { createOutputRouter } from "../modules/outputs/output-routes";
import { createPackInstallerRouter } from "../modules/packs/pack-installer-routes";
import { createPrivacyRouter } from "../modules/privacy/router";
import { createProfileRouter, mountProfileRoutes } from "../modules/profile/router";
import { createSearchRouter } from "../modules/search/index";
import { createSessionsRouter } from "../modules/sessions/router";
import { createTasksRouter, mountTasksRoutes } from "../modules/tasks/router";
import { createUsersRouter } from "../modules/users/router";
import { createWebhooksRouter } from "../modules/webhooks/index";
import { createWorkflowsRouter } from "../modules/workflows/index";

type ModuleRouterDependencies = {
  createAdminRouter: typeof createAdminRouter;
  createAnalyticsRouter: typeof createAnalyticsRouter;
  createApiKeysRouter: typeof createApiKeysRouter;
  createAuthRouter: typeof createAuthRouter;
  createBillingRouter: typeof createBillingRouter;
  createBreakGlassRouter: typeof createBreakGlassRouter;
  createBudgetRouter: typeof createBudgetRouter;
  createConnectorsRouter: typeof createConnectorsRouter;
  createConversationsRouter: typeof createConversationsRouter;
  createDashboardRouter: typeof createDashboardRouter;
  createFeedbackRouter: typeof createFeedbackRouter;
  createInstalledAgentsRouter: typeof createInstalledAgentsRouter;
  createInvitesRouter: typeof createInvitesRouter;
  createMarketplaceRouter: typeof createMarketplaceRouter;
  createNotificationsRouter: typeof createNotificationsRouter;
  createOrganizationsRouter: typeof createOrganizationsRouter;
  createOutputRouter: typeof createOutputRouter;
  createPackInstallerRouter: typeof createPackInstallerRouter;
  createPrivacyRouter: typeof createPrivacyRouter;
  createProfileRouter: typeof createProfileRouter;
  createSearchRouter: typeof createSearchRouter;
  createSessionsRouter: typeof createSessionsRouter;
  createTasksRouter: typeof createTasksRouter;
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
  createConnectorsRouter,
  createConversationsRouter,
  createDashboardRouter,
  createFeedbackRouter,
  createInstalledAgentsRouter,
  createInvitesRouter,
  createMarketplaceRouter,
  createNotificationsRouter,
  createOrganizationsRouter,
  createOutputRouter,
  createPackInstallerRouter,
  createPrivacyRouter,
  createProfileRouter,
  createSearchRouter,
  createSessionsRouter,
  createTasksRouter,
  createUsersRouter,
  createWebhooksRouter,
  createWorkflowsRouter
};

export function mountModuleRouters(
  app: Express,
  config: ApiConfig,
  dependencies: Partial<ModuleRouterDependencies> = {}
): void {
  const resolvedDependencies: ModuleRouterDependencies = {
    ...defaultDependencies,
    ...dependencies
  };
  const marketplaceRouter = resolvedDependencies.createMarketplaceRouter();
  const installedAgentsRouter = resolvedDependencies.createInstalledAgentsRouter();

  app.use(resolvedDependencies.createAdminRouter(config));
  mountAuthRoutes(app, config, {
    createAuthRouter: resolvedDependencies.createAuthRouter
  });
  app.use("/api/v1", resolvedDependencies.createSessionsRouter(config));
  mountProfileRoutes(app, config, {
    createProfileRouter: resolvedDependencies.createProfileRouter
  });
  mountTasksRoutes(app, config, {
    createTasksRouter: resolvedDependencies.createTasksRouter
  });
  app.use("/api/v1/apikeys", resolvedDependencies.createApiKeysRouter(config));
  app.use("/api/v1", resolvedDependencies.createBreakGlassRouter(config));
  app.use("/api/v1/agents", installedAgentsRouter);
  app.use("/api/v1/agents", marketplaceRouter);
  app.use("/api/v1/analytics", resolvedDependencies.createAnalyticsRouter());
  app.use(resolvedDependencies.createDashboardRouter(config));
  app.use("/api/v1/connectors", resolvedDependencies.createConnectorsRouter(config));
  app.use("/api/v1", resolvedDependencies.createConversationsRouter());
  app.use("/api/v1/marketplace", marketplaceRouter);
  app.use("/api/v1/billing", resolvedDependencies.createBillingRouter(config));
  app.use("/api/v1/budgets", resolvedDependencies.createBudgetRouter());
  app.use("/api/v1", resolvedDependencies.createFeedbackRouter());
  app.use("/api/v1", resolvedDependencies.createInvitesRouter());
  app.use("/api/v1", resolvedDependencies.createNotificationsRouter());
  app.use("/api/v1", resolvedDependencies.createOrganizationsRouter());
  app.use("/api/v1/packs", resolvedDependencies.createPackInstallerRouter());
  app.use("/api/v1/outputs", resolvedDependencies.createOutputRouter());
  app.use("/api/v1/privacy", resolvedDependencies.createPrivacyRouter(config));
  app.use("/api/v1", resolvedDependencies.createSearchRouter());
  app.use("/api/v1", resolvedDependencies.createUsersRouter());
  app.use(resolvedDependencies.createWorkflowsRouter(config));
  app.use(resolvedDependencies.createWebhooksRouter(config));
}
