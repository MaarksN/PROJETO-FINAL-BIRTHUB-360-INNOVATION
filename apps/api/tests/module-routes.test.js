import assert from "node:assert/strict";
import test from "node:test";
import { mountModuleRouters } from "../src/app/module-routes.js";
import { createTestApiConfig } from "./test-config.js";
void test("mountModuleRouters wires module routers in the expected order and reuses shared router instances", () => {
    const config = createTestApiConfig();
    const calls = [];
    const app = {
        use: (...args) => {
            calls.push(args);
        }
    };
    const adminRouter = { id: "admin" };
    const authRouter = { id: "auth" };
    const sessionsRouter = { id: "sessions" };
    const profileRouter = { id: "profile" };
    const tasksRouter = { id: "tasks" };
    const apiKeysRouter = { id: "apikeys" };
    const breakGlassRouter = { id: "break-glass" };
    const installedAgentsRouter = { id: "installed-agents" };
    const marketplaceRouter = { id: "marketplace" };
    const analyticsRouter = { id: "analytics" };
    const dashboardRouter = { id: "dashboard" };
    const connectorsRouter = { id: "connectors" };
    const conversationsRouter = { id: "conversations" };
    const billingRouter = { id: "billing" };
    const budgetRouter = { id: "budget" };
    const feedbackRouter = { id: "feedback" };
    const invitesRouter = { id: "invites" };
    const notificationsRouter = { id: "notifications" };
    const organizationsRouter = { id: "organizations" };
    const packInstallerRouter = { id: "packs" };
    const outputsRouter = { id: "outputs" };
    const privacyRouter = { id: "privacy" };
    const searchRouter = { id: "search" };
    const usersRouter = { id: "users" };
    const workflowsRouter = { id: "workflows" };
    const webhooksRouter = { id: "webhooks" };
    mountModuleRouters(app, config, {
        createAdminRouter: (receivedConfig) => {
            assert.equal(receivedConfig, config);
            return adminRouter;
        },
        createAnalyticsRouter: () => analyticsRouter,
        createApiKeysRouter: (receivedConfig) => {
            assert.equal(receivedConfig, config);
            return apiKeysRouter;
        },
        createAuthRouter: (receivedConfig) => {
            assert.equal(receivedConfig, config);
            return authRouter;
        },
        createBillingRouter: (receivedConfig) => {
            assert.equal(receivedConfig, config);
            return billingRouter;
        },
        createBreakGlassRouter: (receivedConfig) => {
            assert.equal(receivedConfig, config);
            return breakGlassRouter;
        },
        createBudgetRouter: () => budgetRouter,
        createConnectorsRouter: (receivedConfig) => {
            assert.equal(receivedConfig, config);
            return connectorsRouter;
        },
        createConversationsRouter: () => conversationsRouter,
        createDashboardRouter: (receivedConfig) => {
            assert.equal(receivedConfig, config);
            return dashboardRouter;
        },
        createFeedbackRouter: () => feedbackRouter,
        createInstalledAgentsRouter: () => installedAgentsRouter,
        createInvitesRouter: () => invitesRouter,
        createMarketplaceRouter: () => marketplaceRouter,
        createNotificationsRouter: () => notificationsRouter,
        createOrganizationsRouter: () => organizationsRouter,
        createOutputRouter: () => outputsRouter,
        createPackInstallerRouter: () => packInstallerRouter,
        createPrivacyRouter: (receivedConfig) => {
            assert.equal(receivedConfig, config);
            return privacyRouter;
        },
        createProfileRouter: (receivedConfig) => {
            assert.equal(receivedConfig, config);
            return profileRouter;
        },
        createSessionsRouter: (receivedConfig) => {
            assert.equal(receivedConfig, config);
            return sessionsRouter;
        },
        createTasksRouter: (receivedConfig) => {
            assert.equal(receivedConfig, config);
            return tasksRouter;
        },
        createSearchRouter: () => searchRouter,
        createUsersRouter: () => usersRouter,
        createWebhooksRouter: (receivedConfig) => {
            assert.equal(receivedConfig, config);
            return webhooksRouter;
        },
        createWorkflowsRouter: (receivedConfig) => {
            assert.equal(receivedConfig, config);
            return workflowsRouter;
        }
    });
    assert.deepEqual(calls, [
        [adminRouter],
        ["/api/v1/auth", authRouter],
        ["/api/v1", sessionsRouter],
        ["/api/v1", profileRouter],
        ["/api/v1", tasksRouter],
        ["/api/v1/apikeys", apiKeysRouter],
        ["/api/v1", breakGlassRouter],
        ["/api/v1/agents", installedAgentsRouter],
        ["/api/v1/agents", marketplaceRouter],
        ["/api/v1/analytics", analyticsRouter],
        [dashboardRouter],
        ["/api/v1/connectors", connectorsRouter],
        ["/api/v1", conversationsRouter],
        ["/api/v1/marketplace", marketplaceRouter],
        ["/api/v1/billing", billingRouter],
        ["/api/v1/budgets", budgetRouter],
        ["/api/v1", feedbackRouter],
        ["/api/v1", invitesRouter],
        ["/api/v1", notificationsRouter],
        ["/api/v1", organizationsRouter],
        ["/api/v1/packs", packInstallerRouter],
        ["/api/v1/outputs", outputsRouter],
        ["/api/v1/privacy", privacyRouter],
        ["/api/v1", searchRouter],
        ["/api/v1", usersRouter],
        [workflowsRouter],
        [webhooksRouter]
    ]);
});
