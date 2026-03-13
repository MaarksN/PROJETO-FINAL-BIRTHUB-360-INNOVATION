import type { ApiConfig } from "@birthub/config";
import { logoutResponseSchema } from "@birthub/config";
import { Router } from "express";

import { requireAuthenticated } from "../../common/guards/index.js";
import { asyncHandler, ProblemDetailsError } from "../../lib/problem-details.js";
import {
  revokeAllSessions,
  revokeSessionById
} from "../auth/auth.service.js";
import { clearAuthCookies } from "../auth/cookies.js";

export function createSessionsRouter(config: ApiConfig): Router {
  const router = Router();

  router.delete(
    "/sessions/:sessionId",
    requireAuthenticated,
    asyncHandler(async (request, response) => {
      const organizationId = request.context.tenantId;
      const userId = request.context.userId;

      if (!organizationId || !userId) {
        throw new ProblemDetailsError({
          detail: "A valid authenticated session is required.",
          status: 401,
          title: "Unauthorized"
        });
      }

      const revokedSessions = await revokeSessionById({
        organizationId,
        sessionId: request.params.sessionId,
        userId
      });

      if (request.context.sessionId === request.params.sessionId && revokedSessions > 0) {
        clearAuthCookies(response, config);
      }

      response.status(200).json(
        logoutResponseSchema.parse({
          requestId: request.context.requestId,
          revokedSessions
        })
      );
    })
  );

  const logoutAllHandler = asyncHandler(async (request, response) => {
    const organizationId = request.context.tenantId;
    const userId = request.context.userId;

    if (!organizationId || !userId) {
      throw new ProblemDetailsError({
        detail: "A valid authenticated session is required.",
        status: 401,
        title: "Unauthorized"
      });
    }

    const revokedSessions = await revokeAllSessions({
      organizationId,
      userId
    });

    clearAuthCookies(response, config);
    response.status(200).json(
      logoutResponseSchema.parse({
        requestId: request.context.requestId,
        revokedSessions
      })
    );
  });

  router.post("/sessions/logout-all", requireAuthenticated, logoutAllHandler);
  router.post("/auth/logout-all", requireAuthenticated, logoutAllHandler);

  return router;
}
