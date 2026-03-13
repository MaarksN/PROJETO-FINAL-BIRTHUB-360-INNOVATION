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
import { Role, prisma } from "@birthub/database";
import { createLogger } from "@birthub/logger";
import cors from "cors";
import express from "express";
import type { Express } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import { openApiDocument } from "./docs/openapi.js";
import { createHealthService } from "./lib/health.js";
import { asyncHandler, ProblemDetailsError } from "./lib/problem-details.js";
import { enqueueTask } from "./lib/queue.js";
import { contentTypeMiddleware } from "./middleware/content-type.js";
import { errorHandler, notFoundMiddleware } from "./middleware/error-handler.js";
import { createRateLimitMiddleware } from "./middleware/rate-limit.js";
import { requestContextMiddleware } from "./middleware/request-context.js";
import { sanitizeMutationInput } from "./middleware/sanitize-input.js";
import { validateBody } from "./middleware/validate-body.js";

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

  app.disable("x-powered-by");
  app.use(requestContextMiddleware);
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
  app.use(contentTypeMiddleware);
  app.use(express.json({ limit: "256kb" }));
  app.use(sanitizeMutationInput);
  app.use(createRateLimitMiddleware(config));

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
      const organization = await prisma.organization.create({
        data: {
          name: request.body.name,
          slug: request.body.slug
        }
      });

      const owner = await prisma.user.create({
        data: {
          email: request.body.adminEmail,
          name: request.body.adminName
        }
      });

      await prisma.membership.create({
        data: {
          organizationId: organization.id,
          role: Role.OWNER,
          tenantId: organization.tenantId,
          userId: owner.id
        }
      });

      request.context.tenantId = organization.tenantId;
      request.context.userId = owner.id;

      logger.info(
        {
          organizationId: organization.id,
          requestId: request.context.requestId,
          tenantId: organization.tenantId,
          userId: owner.id
        },
        "Provisioned organization"
      );

      response.status(201).json(
        createOrganizationResponseSchema.parse({
          organizationId: organization.id,
          ownerUserId: owner.id,
          requestId: request.context.requestId,
          role: "OWNER",
          slug: organization.slug,
          tenantId: organization.tenantId
        })
      );
    })
  );

  app.post(
    "/api/v1/tasks",
    validateBody(taskRequestSchema),
    asyncHandler(async (request, response) => {
      const job = await enqueueTaskDependency(config, {
        agentId: request.body.agentId,
        approvalRequired: request.body.approvalRequired,
        context: request.context.tenantId
          ? {
              actorId: request.context.userId ?? "system",
              jobId: request.context.requestId,
              scopedAt: new Date().toISOString(),
              tenantId: request.context.tenantId
            }
          : undefined,
        estimatedCostBRL: request.body.estimatedCostBRL,
        executionMode: request.body.executionMode,
        payload: request.body.payload,
        requestId: request.context.requestId,
        signature: "unsigned",
        tenantId: request.context.tenantId,
        type: request.body.type,
        userId: request.context.userId,
        version: "1"
      });

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

  app.use(notFoundMiddleware);
  app.use(errorHandler);

  return app;
}
