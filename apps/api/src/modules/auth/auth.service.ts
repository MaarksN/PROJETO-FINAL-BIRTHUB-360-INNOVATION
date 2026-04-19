import {
  UserStatus,
  prisma
} from "@birthub/database";

import {
  hasExplicitDatabaseUrl,
  isDatabaseUnavailableError
} from "../../lib/database-availability.js";
import { sha256 } from "./crypto.js";
import { getRoleForUser } from "./auth.service.policies.js";
import type { AuthIdleConfig, AuthenticatedContext } from "./auth.service.shared.js";

export {
  canManageRole,
  resolveAuthorizedTenantContext,
  resolveOrganizationId,
  resolveTenantIdForOrganization,
  rolePriority
} from "./auth.service.shared.js";
export { getRoleForUser, assertRole, suspendUser, updateUserRoleWithAudit } from "./auth.service.policies.js";
export {
  createSession,
  createNewDeviceAlert,
  listActiveSessions,
  refreshSession,
  revokeAllSessions,
  revokeCurrentSession,
  revokeSessionById
} from "./auth.service.sessions.js";
export {
  enableMfaForUser,
  loginWithPassword,
  setupMfaForUser,
  verifyMfaChallenge
} from "./auth.service.credentials.js";
export {
  createTenantApiKey,
  introspectApiKey,
  listTenantApiKeys,
  revokeTenantApiKey,
  rotateTenantApiKey
} from "./auth.service.keys.js";
export type { ApiKeyScope, AuthenticatedContext, SessionTokens } from "./auth.service.shared.js";

function shouldSwallowDatabaseError(error: unknown): boolean {
  return isDatabaseUnavailableError(error) && !hasExplicitDatabaseUrl();
}

function isSessionIdleExpired(lastActivityAt: Date | null, config?: AuthIdleConfig): boolean {
  if (!config || config.API_AUTH_IDLE_TIMEOUT_MINUTES <= 0 || !lastActivityAt) {
    return false;
  }

  const idleTimeoutMs = config.API_AUTH_IDLE_TIMEOUT_MINUTES * 60_000;
  return Date.now() - lastActivityAt.getTime() > idleTimeoutMs;
}

export async function authenticateSession(
  token: string,
  config?: AuthIdleConfig
): Promise<AuthenticatedContext | null> {
  try {
    const session = await prisma.session.findUnique({
      where: {
        token: sha256(token)
      }
    });

    if (
      !session ||
      session.revokedAt ||
      session.expiresAt.getTime() <= Date.now() ||
      isSessionIdleExpired(session.lastActivityAt, config)
    ) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId
      },
      select: {
        status: true
      }
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      return null;
    }

    const role = await getRoleForUser({
      organizationId: session.organizationId,
      userId: session.userId
    });

    if (!role) {
      return null;
    }

    await prisma.session.update({
      data: {
        lastActivityAt: new Date()
      },
      where: {
        id: session.id
      }
    });

    return {
      apiKeyId: null,
      authType: "session",
      organizationId: session.organizationId,
      role,
      sessionId: session.id,
      tenantId: session.tenantId,
      userId: session.userId
    };
  } catch (error) {
    if (shouldSwallowDatabaseError(error)) {
      return null;
    }

    throw error;
  }
}

export async function authenticateRequest(input: {
  apiKeyToken?: string | null;
  config: AuthIdleConfig;
  sessionToken?: string | null;
}): Promise<AuthenticatedContext | null> {
  try {
    if (!input.sessionToken) {
      return null;
    }

    return authenticateSession(input.sessionToken, input.config);
  } catch (error) {
    if (shouldSwallowDatabaseError(error)) {
      return null;
    }

    throw error;
  }
}
