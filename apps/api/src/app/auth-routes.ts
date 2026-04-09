// @ts-nocheck
// 
import type { ApiConfig } from "@birthub/config";
import type { z } from "zod";
import {
  loginRequestSchema,
  loginResponseSchema,
  logoutResponseSchema,
  mfaVerifyRequestSchema,
  refreshRequestSchema,
  refreshResponseSchema,
  sessionListResponseSchema
} from "@birthub/config";
import type { Express } from "express";

import { requireAuthenticatedSession } from "../common/guards/index.js";
import { asyncHandler, ProblemDetailsError } from "../lib/problem-details.js";
import type { RequestContext } from "../middleware/request-context.js";
import { createLoginRateLimitMiddleware } from "../middleware/rate-limit.js";
import { validateBody } from "../middleware/validate-body.js";
import {
  listActiveSessions,
  loginWithPassword,
  refreshSession,
  resolveOrganizationId,
  revokeCurrentSession,
  verifyMfaChallenge
} from "../modules/auth/auth.service.js";
import { clearAuthCookies, setAuthCookies } from "../modules/auth/cookies.js";

type MfaChallengeEnvelope = {
  challengeExpiresAt: Date;
  challengeToken: string;
};

type SessionEnvelope = {
  organizationId: string;
  sessionId: string;
  tenantId: string;
  tokens: {
    csrfToken: string;
    expiresAt: Date;
    refreshToken: string;
    token: string;
  };
  userId: string;
};

function createUnauthorizedError(detail = "A valid authenticated session is required."): ProblemDetailsError {
  return new ProblemDetailsError({
    detail,
    status: 401,
    title: "Unauthorized"
  });
}

function readUserAgent(request: {
  header(name: string): string | undefined;
}): string | null {
  return request.header("user-agent") ?? null;
}

function applySessionContext(
  request: {
    context: Pick<RequestContext, "authType" | "organizationId" | "sessionId" | "tenantId" | "userId">;
  },
  session: SessionEnvelope
): void {
  request.context.organizationId = session.organizationId;
  request.context.tenantId = session.tenantId;
  request.context.userId = session.userId;
  request.context.sessionId = session.sessionId;
  request.context.authType = "session";
}

function buildSessionResponse(
  requestId: string,
  session: Pick<SessionEnvelope, "sessionId" | "tenantId" | "tokens" | "userId">
) {
  return loginResponseSchema.parse({
    mfaRequired: false,
    requestId,
    session: {
      csrfToken: session.tokens.csrfToken,
      expiresAt: session.tokens.expiresAt.toISOString(),
      id: session.sessionId,
      refreshToken: session.tokens.refreshToken,
      tenantId: session.tenantId,
      token: session.tokens.token,
      userId: session.userId
    }
  });
}

function buildMfaChallengeResponse(requestId: string, challenge: MfaChallengeEnvelope) {
  return loginResponseSchema.parse({
    challengeExpiresAt: challenge.challengeExpiresAt.toISOString(),
    challengeToken: challenge.challengeToken,
    mfaRequired: true,
    requestId
  });
}

function registerLoginRoute(app: Express, config: ApiConfig): void {
  app.post(
    "/api/v1/auth/login",
    createLoginRateLimitMiddleware(config),
    validateBody(loginRequestSchema),
    asyncHandler(async (request, response) => {
      const loginInput = loginRequestSchema.parse(request.body);
      const organizationId = await resolveOrganizationId(loginInput.tenantId);

      if (!organizationId) {
        throw createUnauthorizedError("Invalid organization reference for login.");
      }

      const login = await loginWithPassword({
        config,
        email: loginInput.email,
        ipAddress: request.ip ?? null,
        organizationId,
        password: loginInput.password,
        userAgent: readUserAgent(request)
      });

      if (login.mfaRequired) {
        response
          .status(200)
          .json(buildMfaChallengeResponse(request.context.requestId, login));
        return;
      }

      applySessionContext(request, login);
      setAuthCookies(response, config, login.tokens);
      response
        .status(200)
        .json(buildSessionResponse(request.context.requestId, login));
    })
  );
}

function registerMfaChallengeRoute(app: Express, config: ApiConfig): void {
  app.post(
    "/api/v1/auth/mfa/challenge",
    validateBody(mfaVerifyRequestSchema),
    asyncHandler(async (request, response) => {
      const body = request.body as z.infer<typeof mfaVerifyRequestSchema>;
      const session = await verifyMfaChallenge({
        challengeToken: body.challengeToken,
        config,
        ipAddress: request.ip ?? null,
        ...(body.recoveryCode ? { recoveryCode: body.recoveryCode } : {}),
        ...(body.totpCode ? { totpCode: body.totpCode } : {}),
        userAgent: readUserAgent(request)
      });

      applySessionContext(request, session);
      setAuthCookies(response, config, session.tokens);
      response
        .status(200)
        .json(buildSessionResponse(request.context.requestId, session));
    })
  );
}

function registerRefreshRoute(app: Express, config: ApiConfig): void {
  app.post(
    "/api/v1/auth/refresh",
    validateBody(refreshRequestSchema),
    asyncHandler(async (request, response) => {
      const body = request.body as { refreshToken: string };
      const result = await refreshSession({
        config,
        ipAddress: request.ip ?? null,
        refreshToken: body.refreshToken,
        userAgent: readUserAgent(request)
      });

      if (
        !result.tokens ||
        !result.sessionId ||
        !result.organizationId ||
        !result.tenantId ||
        !result.userId
      ) {
        throw new ProblemDetailsError({
          detail: result.breached
            ? "Refresh token reuse detected."
            : "Refresh token is invalid or expired.",
          status: result.breached ? 409 : 401,
          title: result.breached ? "Conflict" : "Unauthorized"
        });
      }

      setAuthCookies(response, config, result.tokens);
      response.status(200).json(
        refreshResponseSchema.parse({
          requestId: request.context.requestId,
          session: {
            csrfToken: result.tokens.csrfToken,
            expiresAt: result.tokens.expiresAt.toISOString(),
            id: result.sessionId,
            refreshToken: result.tokens.refreshToken,
            tenantId: result.tenantId,
            token: result.tokens.token,
            userId: result.userId
          }
        })
      );
    })
  );
}

function registerLogoutRoute(app: Express, config: ApiConfig): void {
  app.post(
    "/api/v1/auth/logout",
    requireAuthenticatedSession,
    asyncHandler(async (request, response) => {
      if (!request.context.sessionId) {
        throw createUnauthorizedError();
      }

      await revokeCurrentSession(request.context.sessionId);
      clearAuthCookies(response, config);
      response.status(200).json(
        logoutResponseSchema.parse({
          requestId: request.context.requestId,
          revokedSessions: 1
        })
      );
    })
  );
}

function registerSessionListRoute(app: Express): void {
  app.get(
    "/api/v1/sessions",
    requireAuthenticatedSession,
    asyncHandler(async (request, response) => {
      if (!request.context.organizationId || !request.context.userId) {
        throw createUnauthorizedError();
      }

      const sessions = await listActiveSessions({
        organizationId: request.context.organizationId,
        userId: request.context.userId
      });

      response.status(200).json(
        sessionListResponseSchema.parse({
          items: sessions.map((session) => ({
            id: session.id,
            ipAddress: session.ipAddress,
            lastActivityAt: session.lastActivityAt.toISOString(),
            userAgent: session.userAgent
          })),
          requestId: request.context.requestId
        })
      );
    })
  );
}

export function registerAuthRoutes(app: Express, config: ApiConfig): void {
  registerLoginRoute(app, config);
  registerMfaChallengeRoute(app, config);
  registerRefreshRoute(app, config);
  registerLogoutRoute(app, config);
  registerSessionListRoute(app);
}
