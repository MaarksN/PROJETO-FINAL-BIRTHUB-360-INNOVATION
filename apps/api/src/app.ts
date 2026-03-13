import { randomUUID } from "node:crypto";

import cors from "cors";
import express from "express";
import type { Express } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import {
  apiKeyCreateRequestSchema,
  createOrganizationRequestSchema,
  createOrganizationResponseSchema,
  getApiConfig,
  loginRequestSchema,
  mfaVerifyRequestSchema,
  refreshRequestSchema,
  roleUpdateRequestSchema,
  taskEnqueuedResponseSchema,
  taskRequestSchema,
  userListQuerySchema
} from "@birthub/config";
import type { ApiConfig } from "@birthub/config";
import { Role, UserStatus, listUsersByTenant, prisma } from "@birthub/database";
import { createLogger } from "@birthub/logger";
import { z } from "zod";

import { RequireRole, requireAuthenticated } from "./common/guards/index.js";
import { openApiDocument } from "./docs/openapi.js";
import { createHealthService } from "./lib/health.js";
import { enqueueTask } from "./lib/queue.js";
import { asyncHandler, ProblemDetailsError } from "./lib/problem-details.js";
import {
  canManageRole,
  createTenantApiKey,
  enableMfaForUser,
  introspectApiKey,
  listActiveSessions,
  listTenantApiKeys,
  loginWithPassword,
  refreshSession,
  resolveOrganizationId,
  revokeAllSessions,
  revokeCurrentSession,
  revokeSessionById,
  revokeTenantApiKey,
  rotateTenantApiKey,
  setupMfaForUser,
  suspendUser,
  updateUserRoleWithAudit,
  verifyMfaChallenge
} from "./modules/auth/index.js";
import { clearAuthCookies, setAuthCookies } from "./modules/auth/cookies.js";
import { sha256, signPayload } from "./modules/auth/crypto.js";
import { authenticationMiddleware } from "./middleware/authentication.js";
import { contentTypeMiddleware } from "./middleware/content-type.js";
import { csrfProtection } from "./middleware/csrf.js";
import { errorHandler, notFoundMiddleware } from "./middleware/error-handler.js";
import { originValidationMiddleware } from "./middleware/origin-check.js";
import { createRateLimitMiddleware } from "./middleware/rate-limit.js";
import { requestContextMiddleware } from "./middleware/request-context.js";
import { sanitizeMutationInput } from "./middleware/sanitize-input.js";
import { validateBody } from "./middleware/validate-body.js";

const logger = createLogger("api");

const mfaEnableRequestSchema = z.object({
  totpCode: z.string().regex(/^\d{6}$/)
});

function normalizeClientIp(headerValue: string | undefined, fallbackIp: string | undefined): string | null {
  if (headerValue) {
    return headerValue.split(",")[0]?.trim() ?? null;
  }

  return fallbackIp ?? null;
}

function readApiToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, credential] = authorizationHeader.split(" ");

  if (!credential) {
    return null;
  }

  if (scheme.toLowerCase() === "apikey") {
    return credential;
  }

  if (scheme.toLowerCase() === "bearer") {
    return credential;
  }

  return null;
}

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
  app.use(authenticationMiddleware(config.API_AUTH_COOKIE_NAME));
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
  app.use(originValidationMiddleware([...config.corsOrigins, config.WEB_BASE_URL]));
  app.use(
    csrfProtection({
      cookieName: config.API_CSRF_COOKIE_NAME,
      headerName: config.API_CSRF_HEADER_NAME,
      ignoredPaths: ["/api/v1/auth/login", "/api/v1/auth/mfa/challenge", "/api/v1/auth/refresh"]
    })
  );
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
      const organizationId = await resolveOrganizationId(request.body.tenantId);

      if (!organizationId) {
        throw new ProblemDetailsError({
          detail: "Unknown tenant.",
          status: 401,
          title: "Unauthorized"
        });
      }

      const loginResult = await loginWithPassword({
        config,
        email: request.body.email,
        ipAddress: normalizeClientIp(request.header("x-forwarded-for"), request.ip),
        organizationId,
        password: request.body.password,
        userAgent: request.header("user-agent") ?? null
      });

      if (loginResult.mfaRequired) {
        response.status(200).json({
          challengeExpiresAt: loginResult.challengeExpiresAt.toISOString(),
          challengeToken: loginResult.challengeToken,
          mfaRequired: true,
          requestId: request.context.requestId
        });
        return;
      }

      request.context.tenantId = organizationId;
      request.context.userId = loginResult.userId;
      request.context.sessionId = loginResult.sessionId;
      request.context.authType = "session";

      setAuthCookies(response, config, loginResult.tokens);

      response.status(200).json({
        mfaRequired: false,
        requestId: request.context.requestId,
        session: {
          csrfToken: loginResult.tokens.csrfToken,
          expiresAt: loginResult.tokens.expiresAt.toISOString(),
          id: loginResult.sessionId,
          refreshToken: loginResult.tokens.refreshToken,
          tenantId: organizationId,
          token: loginResult.tokens.token,
          userId: loginResult.userId
        }
      });
    })
  );

  app.post(
    "/api/v1/auth/mfa/challenge",
    validateBody(mfaVerifyRequestSchema),
    asyncHandler(async (request, response) => {
      const tenantId = request.header("x-tenant-id");
      const organizationId = tenantId ? await resolveOrganizationId(tenantId) : null;

      if (!organizationId) {
        throw new ProblemDetailsError({
          detail: "Tenant header is required for MFA challenge verification.",
          status: 400,
          title: "Bad Request"
        });
      }

      const challengeResult = await verifyMfaChallenge({
        challengeToken: request.body.challengeToken,
        config,
        ipAddress: normalizeClientIp(request.header("x-forwarded-for"), request.ip),
        organizationId,
        recoveryCode: request.body.recoveryCode,
        totpCode: request.body.totpCode,
        userAgent: request.header("user-agent") ?? null
      });

      request.context.tenantId = organizationId;
      request.context.userId = challengeResult.userId;
      request.context.sessionId = challengeResult.sessionId;
      request.context.authType = "session";

      setAuthCookies(response, config, challengeResult.tokens);

      response.status(200).json({
        mfaRequired: false,
        requestId: request.context.requestId,
        session: {
          csrfToken: challengeResult.tokens.csrfToken,
          expiresAt: challengeResult.tokens.expiresAt.toISOString(),
          id: challengeResult.sessionId,
          refreshToken: challengeResult.tokens.refreshToken,
          tenantId: organizationId,
          token: challengeResult.tokens.token,
          userId: challengeResult.userId
        }
      });
    })
  );

  app.post(
    "/api/v1/auth/refresh",
    validateBody(refreshRequestSchema),
    asyncHandler(async (request, response) => {
      const refreshResult = await refreshSession({
        config,
        ipAddress: normalizeClientIp(request.header("x-forwarded-for"), request.ip),
        refreshToken: request.body.refreshToken,
        userAgent: request.header("user-agent") ?? null
      });

      if (refreshResult.breached) {
        clearAuthCookies(response, config);
        throw new ProblemDetailsError({
          detail: "Refresh token reuse detected. All sessions were revoked for this account.",
          status: 401,
          title: "Unauthorized"
        });
      }

      if (!refreshResult.tokens || !refreshResult.organizationId || !refreshResult.userId) {
        throw new ProblemDetailsError({
          detail: "Refresh token is invalid or expired.",
          status: 401,
          title: "Unauthorized"
        });
      }

      setAuthCookies(response, config, refreshResult.tokens);

      response.status(200).json({
        requestId: request.context.requestId,
        session: {
          csrfToken: refreshResult.tokens.csrfToken,
          expiresAt: refreshResult.tokens.expiresAt.toISOString(),
          id: refreshResult.sessionId,
          refreshToken: refreshResult.tokens.refreshToken,
          tenantId: refreshResult.organizationId,
          token: refreshResult.tokens.token,
          userId: refreshResult.userId
        }
      });
    })
  );

  app.post(
    "/api/v1/auth/logout",
    requireAuthenticated,
    asyncHandler(async (request, response) => {
      if (request.context.sessionId) {
        await revokeCurrentSession(request.context.sessionId);
      }

      clearAuthCookies(response, config);
      response.status(200).json({
        requestId: request.context.requestId,
        revokedSessions: request.context.sessionId ? 1 : 0
      });
    })
  );

  app.post(
    "/api/v1/auth/logout-all",
    requireAuthenticated,
    asyncHandler(async (request, response) => {
      const revokedSessions = await revokeAllSessions({
        organizationId: request.context.tenantId!,
        userId: request.context.userId!
      });

      clearAuthCookies(response, config);
      response.status(200).json({
        requestId: request.context.requestId,
        revokedSessions
      });
    })
  );

  app.get(
    "/api/auth/introspect",
    asyncHandler(async (request, response) => {
      const token = readApiToken(request.header("authorization"));

      if (!token) {
        throw new ProblemDetailsError({
          detail: "Authorization header is required for introspection.",
          status: 401,
          title: "Unauthorized"
        });
      }

      const introspection = await introspectApiKey(token);
      response.status(200).json({
        active: introspection.active,
        requestId: request.context.requestId,
        scopes: introspection.scopes,
        tenantId: introspection.tenantId,
        userId: introspection.userId
      });
    })
  );

  app.get(
    "/api/v1/sessions",
    requireAuthenticated,
    asyncHandler(async (request, response) => {
      const sessions = await listActiveSessions({
        organizationId: request.context.tenantId!,
        userId: request.context.userId!
      });

      response.status(200).json({
        items: sessions.map((session) => ({
          id: session.id,
          ipAddress: session.ipAddress,
          lastActivityAt: session.lastActivityAt.toISOString(),
          userAgent: session.userAgent
        })),
        requestId: request.context.requestId
      });
    })
  );

  app.delete(
    "/api/v1/sessions/:id",
    requireAuthenticated,
    asyncHandler(async (request, response) => {
      await revokeSessionById({
        organizationId: request.context.tenantId!,
        sessionId: request.params.id,
        userId: request.context.userId!
      });
      response.status(204).send();
    })
  );

  app.post(
    "/api/v1/sessions/logout-all",
    requireAuthenticated,
    asyncHandler(async (request, response) => {
      const revokedSessions = await revokeAllSessions({
        organizationId: request.context.tenantId!,
        userId: request.context.userId!
      });

      clearAuthCookies(response, config);
      response.status(200).json({
        requestId: request.context.requestId,
        revokedSessions
      });
    })
  );

  app.post(
    "/api/v1/auth/mfa/setup",
    requireAuthenticated,
    asyncHandler(async (request, response) => {
      const user = await prisma.user.findUnique({
        where: {
          id: request.context.userId!
        }
      });

      if (!user) {
        throw new ProblemDetailsError({
          detail: "User not found.",
          status: 404,
          title: "Not Found"
        });
      }

      const setup = await setupMfaForUser({
        config,
        email: user.email,
        tenantId: request.context.tenantId ?? undefined,
        userId: user.id
      });

      response.status(200).json({
        requestId: request.context.requestId,
        ...setup
      });
    })
  );

  app.post(
    "/api/v1/auth/mfa/enable",
    requireAuthenticated,
    validateBody(mfaEnableRequestSchema),
    asyncHandler(async (request, response) => {
      const enabled = await enableMfaForUser({
        config,
        totpCode: request.body.totpCode,
        userId: request.context.userId!
      });

      if (!enabled) {
        throw new ProblemDetailsError({
          detail: "Invalid TOTP code.",
          status: 401,
          title: "Unauthorized"
        });
      }

      response.status(200).json({
        enabled: true,
        requestId: request.context.requestId
      });
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
          name: request.body.adminName,
          passwordHash: sha256("password123")
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

      await prisma.jobSigningSecret.create({
        data: {
          organizationId: organization.id,
          secret: sha256(`${organization.id}:${config.JOB_HMAC_GLOBAL_SECRET}`),
          tenantId: organization.tenantId
        }
      });

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
    requireAuthenticated,
    validateBody(taskRequestSchema),
    asyncHandler(async (request, response) => {
      const organizationId = request.context.tenantId;
      const userId = request.context.userId;

      if (!organizationId || !userId) {
        throw new ProblemDetailsError({
          detail: "Authenticated tenant and user are required to enqueue tasks.",
          status: 401,
          title: "Unauthorized"
        });
      }

      const jobId = randomUUID();
      const jobContext = {
        actorId: userId,
        jobId,
        scopedAt: new Date().toISOString(),
        tenantId: organizationId
      } as const;
      const jobSigningSecret = await prisma.jobSigningSecret.findUnique({
        where: {
          organizationId
        }
      });
      const signature = signPayload(
        JSON.stringify({
          context: jobContext,
          payload: request.body.payload,
          requestId: request.context.requestId,
          tenantId: organizationId,
          type: request.body.type,
          userId,
          version: "1"
        }),
        jobSigningSecret?.secret ?? config.JOB_HMAC_GLOBAL_SECRET
      );

      const job = await enqueueTaskDependency(config, {
        context: jobContext,
        payload: request.body.payload,
        requestId: request.context.requestId,
        signature,
        tenantId: organizationId,
        type: request.body.type,
        userId,
        version: "1"
      });

      logger.info(
        {
          jobId: job.jobId,
          requestId: request.context.requestId,
          tenantId: organizationId,
          userId
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

  app.get(
    "/api/v1/team/members",
    requireAuthenticated,
    asyncHandler(async (request, response) => {
      const memberships = await prisma.membership.findMany({
        include: {
          user: true
        },
        orderBy: {
          createdAt: "asc"
        },
        where: {
          organizationId: request.context.tenantId!
        }
      });

      response.status(200).json({
        items: memberships.map((membership) => ({
          email: membership.user.email,
          id: membership.user.id,
          name: membership.user.name,
          role: membership.role,
          status: membership.user.status
        })),
        requestId: request.context.requestId
      });
    })
  );

  app.patch(
    "/api/v1/team/members/:userId/role",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    validateBody(roleUpdateRequestSchema),
    asyncHandler(async (request, response) => {
      const actorRoleMembership = await prisma.membership.findUnique({
        where: {
          organizationId_userId: {
            organizationId: request.context.tenantId!,
            userId: request.context.userId!
          }
        }
      });

      if (!actorRoleMembership) {
        throw new ProblemDetailsError({
          detail: "Actor membership not found.",
          status: 403,
          title: "Forbidden"
        });
      }

      if (!canManageRole(actorRoleMembership.role, request.body.role)) {
        throw new ProblemDetailsError({
          detail: "Role hierarchy prevents this promotion/demotion.",
          status: 403,
          title: "Forbidden"
        });
      }

      const membership = await updateUserRoleWithAudit({
        actorUserId: request.context.userId!,
        organizationId: request.context.tenantId!,
        role: request.body.role,
        targetUserId: request.params.userId
      });

      response.status(200).json({
        membership,
        requestId: request.context.requestId
      });
    })
  );

  app.get(
    "/api/v1/users",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      const parsedFilters = userListQuerySchema.safeParse({
        role: request.query.role,
        search: request.query.search,
        status: request.query.status
      });

      if (!parsedFilters.success) {
        throw new ProblemDetailsError({
          detail: "Invalid user list filters.",
          errors: parsedFilters.error.flatten(),
          status: 400,
          title: "Bad Request"
        });
      }

      const users = await listUsersByTenant(request.context.tenantId!, parsedFilters.data);

      response.status(200).json({
        items: users.map((user) => ({
          email: user.email,
          id: user.id,
          name: user.name,
          role: user.memberships[0]?.role ?? Role.READONLY,
          status: user.status
        })),
        requestId: request.context.requestId
      });
    })
  );

  app.patch(
    "/api/v1/users/:userId/suspend",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      await suspendUser({
        actorUserId: request.context.userId!,
        organizationId: request.context.tenantId!,
        targetUserId: request.params.userId
      });

      response.status(200).json({
        requestId: request.context.requestId,
        status: UserStatus.SUSPENDED
      });
    })
  );

  app.delete(
    "/api/v1/users/:userId",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      await suspendUser({
        actorUserId: request.context.userId!,
        organizationId: request.context.tenantId!,
        targetUserId: request.params.userId
      });

      response.status(200).json({
        requestId: request.context.requestId,
        status: UserStatus.SUSPENDED
      });
    })
  );

  app.post(
    "/api/v1/apikeys",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    validateBody(apiKeyCreateRequestSchema),
    asyncHandler(async (request, response) => {
      const created = await createTenantApiKey({
        config,
        label: request.body.label,
        organizationId: request.context.tenantId!,
        scopes: request.body.scopes,
        userId: request.context.userId!
      });

      response.status(201).json({
        apiKey: created.key,
        id: created.id,
        requestId: request.context.requestId
      });
    })
  );

  app.get(
    "/api/v1/apikeys",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      const items = await listTenantApiKeys({
        organizationId: request.context.tenantId!,
        userId: request.context.userId!
      });

      response.status(200).json({
        items: items.map((item) => ({
          createdAt: item.createdAt.toISOString(),
          id: item.id,
          label: item.label,
          last4: item.last4,
          scopes: item.scopes,
          status: item.status
        })),
        requestId: request.context.requestId
      });
    })
  );

  app.post(
    "/api/v1/apikeys/:id/rotate",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      const rotated = await rotateTenantApiKey({
        config,
        id: request.params.id,
        organizationId: request.context.tenantId!,
        userId: request.context.userId!
      });

      response.status(200).json({
        apiKey: rotated.key,
        id: rotated.id,
        requestId: request.context.requestId
      });
    })
  );

  app.delete(
    "/api/v1/apikeys/:id",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      await revokeTenantApiKey({
        id: request.params.id,
        organizationId: request.context.tenantId!,
        userId: request.context.userId!
      });

      response.status(204).send();
    })
  );

  app.post(
    "/api/v1/billing",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      response.status(200).json({
        message: "Billing mutation accepted for privileged role.",
        requestId: request.context.requestId
      });
    })
  );

  app.use(notFoundMiddleware);
  app.use(errorHandler);

  return app;
}
