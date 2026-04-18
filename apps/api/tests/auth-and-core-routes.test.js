import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { registerAuthAndCoreRoutes } from "../src/app/auth-and-core-routes.js";
import { mountModuleRouters } from "../src/app/module-routes.js";
import { mountProfileRoutes } from "../src/modules/profile/router.js";
import { mountTasksRoutes } from "../src/modules/tasks/router.js";
import { createTestApiConfig } from "./test-config.js";
void test("registerAuthAndCoreRoutes delegates auth and core route registration with shared dependencies", () => {
    const app = express();
    const config = createTestApiConfig();
    const calls = [];
    const dependency = async () => Promise.resolve({ jobId: "job_1" });
    registerAuthAndCoreRoutes(app, config, {
        enqueueTask: dependency,
        registerAuthRoutes: (receivedApp, receivedConfig) => {
            assert.equal(receivedApp, app);
            assert.equal(receivedConfig, config);
            calls.push("auth");
        },
        registerCoreBusinessRoutes: (receivedApp, receivedConfig, receivedDependencies) => {
            assert.equal(receivedApp, app);
            assert.equal(receivedConfig, config);
            assert.ok(receivedDependencies);
            assert.equal(receivedDependencies.enqueueTask, dependency);
            calls.push("core");
        }
    });
    assert.deepEqual(calls, ["auth", "core"]);
});
void test("registerAuthAndCoreRoutes stays compatible without double-mounting auth endpoints", () => {
    const config = createTestApiConfig();
    const calls = [];
    const app = {
        use: (...args) => {
            calls.push(args);
        }
    };
    registerAuthAndCoreRoutes(app, config, {
        registerCoreBusinessRoutes: () => { }
    });
    mountModuleRouters(app, config, {
        createAdminRouter: () => ({ id: "admin" }),
        createAnalyticsRouter: () => ({ id: "analytics" }),
        createApiKeysRouter: () => ({ id: "apikeys" }),
        createAuthRouter: () => ({ id: "auth" }),
        createBillingRouter: () => ({ id: "billing" }),
        createBreakGlassRouter: () => ({ id: "break-glass" }),
        createBudgetRouter: () => ({ id: "budget" }),
        createConnectorsRouter: () => ({ id: "connectors" }),
        createConversationsRouter: () => ({ id: "conversations" }),
        createDashboardRouter: () => ({ id: "dashboard" }),
        createFeedbackRouter: () => ({ id: "feedback" }),
        createInstalledAgentsRouter: () => ({ id: "installed-agents" }),
        createInvitesRouter: () => ({ id: "invites" }),
        createMarketplaceRouter: () => ({ id: "marketplace" }),
        createNotificationsRouter: () => ({ id: "notifications" }),
        createOrganizationsRouter: () => ({ id: "organizations" }),
        createOutputRouter: () => ({ id: "outputs" }),
        createPackInstallerRouter: () => ({ id: "packs" }),
        createPrivacyRouter: () => ({ id: "privacy" }),
        createProfileRouter: () => ({ id: "profile" }),
        createSearchRouter: () => ({ id: "search" }),
        createSessionsRouter: () => ({ id: "sessions" }),
        createTasksRouter: () => ({ id: "tasks" }),
        createUsersRouter: () => ({ id: "users" }),
        createWebhooksRouter: () => ({ id: "webhooks" }),
        createWorkflowsRouter: () => ({ id: "workflows" })
    });
    const authMounts = calls.filter((entry) => entry[0] === "/api/v1/auth");
    assert.equal(authMounts.length, 1);
});
void test("registerAuthAndCoreRoutes stays compatible without double-mounting profile endpoints", () => {
    const config = createTestApiConfig();
    const calls = [];
    const app = {
        use: (...args) => {
            calls.push(args);
        }
    };
    const profileRouter = { id: "profile" };
    registerAuthAndCoreRoutes(app, config, {
        registerCoreBusinessRoutes: (receivedApp, receivedConfig) => {
            assert.equal(receivedApp, app);
            assert.equal(receivedConfig, config);
            mountProfileRoutes(app, config, {
                createProfileRouter: () => profileRouter
            });
        }
    });
    mountModuleRouters(app, config, {
        createAdminRouter: () => ({ id: "admin" }),
        createAnalyticsRouter: () => ({ id: "analytics" }),
        createApiKeysRouter: () => ({ id: "apikeys" }),
        createAuthRouter: () => ({ id: "auth" }),
        createBillingRouter: () => ({ id: "billing" }),
        createBreakGlassRouter: () => ({ id: "break-glass" }),
        createBudgetRouter: () => ({ id: "budget" }),
        createConnectorsRouter: () => ({ id: "connectors" }),
        createConversationsRouter: () => ({ id: "conversations" }),
        createDashboardRouter: () => ({ id: "dashboard" }),
        createFeedbackRouter: () => ({ id: "feedback" }),
        createInstalledAgentsRouter: () => ({ id: "installed-agents" }),
        createInvitesRouter: () => ({ id: "invites" }),
        createMarketplaceRouter: () => ({ id: "marketplace" }),
        createNotificationsRouter: () => ({ id: "notifications" }),
        createOrganizationsRouter: () => ({ id: "organizations" }),
        createOutputRouter: () => ({ id: "outputs" }),
        createPackInstallerRouter: () => ({ id: "packs" }),
        createPrivacyRouter: () => ({ id: "privacy" }),
        createProfileRouter: () => profileRouter,
        createSearchRouter: () => ({ id: "search" }),
        createSessionsRouter: () => ({ id: "sessions" }),
        createTasksRouter: () => ({ id: "tasks" }),
        createUsersRouter: () => ({ id: "users" }),
        createWebhooksRouter: () => ({ id: "webhooks" }),
        createWorkflowsRouter: () => ({ id: "workflows" })
    });
    const profileMounts = calls.filter((entry) => entry[0] === "/api/v1" && entry[1] === profileRouter);
    assert.equal(profileMounts.length, 1);
});
void test("registerAuthAndCoreRoutes stays compatible without double-mounting task endpoints", () => {
    const config = createTestApiConfig();
    const calls = [];
    const app = {
        use: (...args) => {
            calls.push(args);
        }
    };
    const tasksRouter = { id: "tasks" };
    registerAuthAndCoreRoutes(app, config, {
        registerCoreBusinessRoutes: (receivedApp, receivedConfig, receivedDependencies) => {
            assert.equal(receivedApp, app);
            assert.equal(receivedConfig, config);
            mountTasksRoutes(app, config, {
                createTasksRouter: () => tasksRouter,
                ...(receivedDependencies?.enqueueTask === undefined
                    ? {}
                    : { enqueueTask: receivedDependencies.enqueueTask })
            });
        }
    });
    mountModuleRouters(app, config, {
        createAdminRouter: () => ({ id: "admin" }),
        createAnalyticsRouter: () => ({ id: "analytics" }),
        createApiKeysRouter: () => ({ id: "apikeys" }),
        createAuthRouter: () => ({ id: "auth" }),
        createBillingRouter: () => ({ id: "billing" }),
        createBreakGlassRouter: () => ({ id: "break-glass" }),
        createBudgetRouter: () => ({ id: "budget" }),
        createConnectorsRouter: () => ({ id: "connectors" }),
        createConversationsRouter: () => ({ id: "conversations" }),
        createDashboardRouter: () => ({ id: "dashboard" }),
        createFeedbackRouter: () => ({ id: "feedback" }),
        createInstalledAgentsRouter: () => ({ id: "installed-agents" }),
        createInvitesRouter: () => ({ id: "invites" }),
        createMarketplaceRouter: () => ({ id: "marketplace" }),
        createNotificationsRouter: () => ({ id: "notifications" }),
        createOrganizationsRouter: () => ({ id: "organizations" }),
        createOutputRouter: () => ({ id: "outputs" }),
        createPackInstallerRouter: () => ({ id: "packs" }),
        createPrivacyRouter: () => ({ id: "privacy" }),
        createProfileRouter: () => ({ id: "profile" }),
        createSearchRouter: () => ({ id: "search" }),
        createSessionsRouter: () => ({ id: "sessions" }),
        createTasksRouter: () => tasksRouter,
        createUsersRouter: () => ({ id: "users" }),
        createWebhooksRouter: () => ({ id: "webhooks" }),
        createWorkflowsRouter: () => ({ id: "workflows" })
    });
    const tasksMounts = calls.filter((entry) => entry[0] === "/api/v1" && entry[1] === tasksRouter);
    assert.equal(tasksMounts.length, 1);
});
