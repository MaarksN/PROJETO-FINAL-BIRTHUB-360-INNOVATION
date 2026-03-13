import type { ApiConfig } from "@birthub/config";
import {
  createOrganizationRequestSchema,
  createOrganizationResponseSchema,
  getApiConfig,
  loginRequestSchema,
  loginResponseSchema,
  taskEnqueuedResponseSchema,
  taskRequestSchema
} from "@birthub/config";
import { createLogger } from "@birthub/logger";
import cors from "cors";
import express from "express";
import type { Express } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import {
  configureCacheStore,
  registerTenantCacheInvalidationMiddleware
} from "./common/cache/index.js";
import { openApiDocument } from "./docs/openapi.js";
import { createHealthService } from "./lib/health.js";
import { asyncHandler, ProblemDetailsError } from "./lib/problem-details.js";
import { enqueueTask, QueueBackpressureError } from "./lib/queue.js";
import { contentTypeMiddleware } from "./middleware/content-type.js";
import { errorHandler, notFoundMiddleware } from "./middleware/error-handler.js";
import { createRateLimitMiddleware } from "./middleware/rate-limit.js";
import { requestContextMiddleware } from "./middleware/request-context.js";
import { sanitizeMutationInput } from "./middleware/sanitize-input.js";
import { tenantContextMiddleware } from "./middleware/tenant-context.js";
import { validateBody } from "./middleware/validate-body.js";
import { createBudgetRouter } from "./modules/budget/budget-routes.js";
import { budgetService } from "./modules/budget/budget.service.js";
import { BudgetExceededError } from "./modules/budget/budget.types.js";
import { createMarketplaceRouter } from "./modules/marketplace/marketplace-routes.js";
import { createBillingRouter, getBillingSnapshot } from "./modules/billing/index.js";
import { createOrganizationsRouter } from "./modules/organizations/router.js";
import { createOrganization } from "./modules/organizations/service.js";
import { startOutputRetentionScheduler } from "./modules/outputs/output-retention.js";
import { createOutputRouter } from "./modules/outputs/output-routes.js";
import { createPackInstallerRouter } from "./modules/packs/pack-installer-routes.js";
import { createWebhooksRouter, initializeWorkflowInternalEventBridge } from "./modules/webhooks/index.js";
import { createStripeWebhookRouter } from "./modules/webhooks/stripe.router.js";
import { createWorkflowsRouter } from "./modules/workflows/index.js";

const logger = createLogger("api");

export interface AppDependencies {
  config?: ApiConfig;
  enqueueTask?: typeof enqueueTask;
  healthService?: ReturnType<typeof createHealthService>;
  shouldExposeDocs?: boolean;
}

export function createApp(dependencies: AppDependencies = {}): Express {
  const config = dependencies.config ?? getApiConfig();
  const app = express();
  const healthService = dependencies.healthService ?? createHealthService(config);
  const enqueueTaskDependency = dependencies.enqueueTask ?? enqueueTask;
  const shouldExposeDocs = dependencies.shouldExposeDocs ?? config.NODE_ENV !== "production";

  configureCacheStore(config.REDIS_URL);
  registerTenantCacheInvalidationMiddleware();
  initializeWorkflowInternalEventBridge(config);

  app.disable("x-powered-by");
  app.use(requestContextMiddleware);
  app.use(tenantContextMiddleware);
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );
  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => {
        if (!origin || config.corsOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(
          new ProblemDetailsError({
            detail: `Origin '${origin}' is not present in the API allowlist.`,
            status: 403,
            title: "Forbidden"
          })
        );
      }
    })
  );
  app.use("/api/webhooks", createStripeWebhookRouter(config));
  app.use(contentTypeMiddleware);
  app.use(express.json({ limit: "256kb" }));
  app.use(sanitizeMutationInput);
  app.use(createRateLimitMiddleware(config));

  if (config.NODE_ENV !== "test") {
    startOutputRetentionScheduler();
  }

  if (shouldExposeDocs) {
    app.get("/api/openapi.json", (_request, response) => {
      response.json(openApiDocument);
    });

    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
  }

  app.get(
    "/api/v1/health",
    asyncHandler(async (_request, response) => {
      response.status(200).json(await healthService());
    })
  );

  app.post(
    "/api/v1/auth/login",
    validateBody(loginRequestSchema),
    asyncHandler(async (request, response) => {
      const userId = Buffer.from(request.body.email.toLowerCase()).toString("base64url");
      request.context.tenantId = request.body.tenantId;
      request.context.userId = userId;

      logger.info(
        {
          requestId: request.context.requestId,
          tenantId: request.context.tenantId,
          userId
        },
        "Issued development session payload"
      );

      response.status(200).json(
        loginResponseSchema.parse({
          mfaRequired: false,
          requestId: request.context.requestId,
          session: {
            csrfToken: Buffer.from(`csrf:${request.context.requestId}`).toString("base64url"),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
            id: Buffer.from(`session:${request.context.requestId}`).toString("base64url"),
            refreshToken: Buffer.from(`refresh:${request.context.requestId}`).toString("base64url"),
            tenantId: request.body.tenantId,
            token: Buffer.from(`${request.body.email}:${request.context.requestId}`).toString("base64url"),
            userId
          }
        })
      );
    })
  );

  app.post(
    "/api/v1/organizations",
    validateBody(createOrganizationRequestSchema),
    asyncHandler(async (request, response) => {
      const organization = await createOrganization({
        adminEmail: request.body.adminEmail,
        adminName: request.body.adminName,
        name: request.body.name,
        requestId: request.context.requestId,
        slug: request.body.slug
      });

      request.context.tenantId = organization.tenantId ?? null;
      request.context.userId = organization.ownerUserId;

      logger.info(
        {
          organizationId: organization.organizationId,
          requestId: request.context.requestId,
          tenantId: organization.tenantId,
          userId: organization.ownerUserId
        },
        "Provisioned organization"
      );

      response.status(201).json(createOrganizationResponseSchema.parse(organization));
    })
  );

  app.get(
    "/api/v1/me",
    asyncHandler(async (request, response) => {
      if (!request.context.tenantId) {
        throw new ProblemDetailsError({
          detail: "Tenant context is required to resolve profile.",
          status: 401,
          title: "Unauthorized"
        });
      }

      const billing = await getBillingSnapshot(
        request.context.tenantId,
        config.BILLING_GRACE_PERIOD_DAYS
      );

      response.status(200).json({
        plan: {
          code: billing.plan.code,
          currentPeriodEnd: billing.currentPeriodEnd,
          hardLocked: billing.hardLocked,
          isPaid: billing.isPaid,
          isWithinGracePeriod: billing.isWithinGracePeriod,
          name: billing.plan.name,
          secondsUntilHardLock: billing.secondsUntilHardLock,
          status: billing.status
        },
        requestId: request.context.requestId,
        user: {
          id: request.context.userId,
          tenantId: request.context.tenantId
        }
      });
    })
  );

  app.post(
    "/api/v1/tasks",
    validateBody(taskRequestSchema),
    asyncHandler(async (request, response) => {
      const tenantId = request.context.tenantId ?? "default-tenant";
      const userId = request.context.userId ?? "system";

      try {
        budgetService.consumeBudget({
          agentId: request.body.agentId,
          costBRL: request.body.estimatedCostBRL,
          executionMode: request.body.executionMode,
          tenantId
        });
      } catch (error) {
        if (error instanceof BudgetExceededError) {
          throw new ProblemDetailsError({
            detail: `Agent ${error.agentId} reached 100% budget usage and is blocked.`,
            status: 402,
            title: "Budget Exceeded"
          });
        }

        throw error;
      }

      let job: { jobId: string };

      try {
        job = await enqueueTaskDependency(config, {
          agentId: request.body.agentId,
          approvalRequired: request.body.approvalRequired,
          context: request.context.tenantId
            ? {
                actorId: userId,
                jobId: request.context.requestId,
                scopedAt: new Date().toISOString(),
                tenantId
              }
            : undefined,
          estimatedCostBRL: request.body.estimatedCostBRL,
          executionMode: request.body.executionMode,
          payload: request.body.payload,
          requestId: request.context.requestId,
          signature: Buffer.from(`${tenantId}:${request.context.requestId}`).toString("base64url"),
          tenantId,
          type: request.body.type,
          userId,
          version: "1"
        });
      } catch (error) {
        if (error instanceof QueueBackpressureError) {
          throw new ProblemDetailsError({
            detail: `Queue backlog reached ${error.pendingJobs} pending jobs. Retry later.`,
            status: 503,
            title: "Service Unavailable"
          });
        }

        throw error;
      }

      logger.info(
        {
          jobId: job.jobId,
          requestId: request.context.requestId,
          tenantId: request.context.tenantId,
          userId: request.context.userId
        },
        "Queued task for worker processing"
      );

      response.status(202).json(
        taskEnqueuedResponseSchema.parse({
          jobId: job.jobId,
          requestId: request.context.requestId
        })
      );
    })
  );

  const marketplaceRouter = createMarketplaceRouter();
  app.use("/api/v1/agents", marketplaceRouter);
  app.use("/api/v1/marketplace", marketplaceRouter);
  app.use("/api/v1/billing", createBillingRouter(config));
  app.use("/api/v1/budgets", createBudgetRouter());
  app.use("/api/v1", createOrganizationsRouter());
  app.use("/api/v1/packs", createPackInstallerRouter());
  app.use("/api/v1/outputs", createOutputRouter());
  app.use(createWorkflowsRouter(config));
  app.use(createWebhooksRouter(config));

  app.use(notFoundMiddleware);
  app.use(errorHandler);

  return app;
}
