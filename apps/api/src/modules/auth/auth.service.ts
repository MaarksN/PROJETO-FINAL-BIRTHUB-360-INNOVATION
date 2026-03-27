import {
  UserStatus,
  prisma
} from "@birthub/database";
import type { ApiConfig } from "@birthub/config";

import {
  sha256
} from "./crypto.js";
import {
  enableMfaForUser,
  loginWithPassword,
  setupMfaForUser,
  verifyMfaChallenge
} from "./auth.service.credentials.js";
import {
  createSession,
  listActiveSessions,
  refreshSession,
  revokeAllSessions,
  revokeCurrentSession,
  revokeSessionById
} from "./auth.service.sessions.js";
import {
  getRoleForUser,
  assertRole,
  suspendUser,
  updateUserRoleWithAudit
} from "./auth.service.policies.js";
import {
  createTenantApiKey,
  listTenantApiKeys,
  rotateTenantApiKey,
  revokeTenantApiKey,
  introspectApiKey,
  verifyApiKeyScope
} from "./auth.service.keys.js";
import {
  ApiKeyScope,
  AuthenticatedContext,
  SessionTokens,
  canManageRole,
  resolveOrganizationId,
  resolveAuthorizedTenantContext
} from "./auth.service.shared.js";

export {
  createSession,
  enableMfaForUser,
  listActiveSessions,
  loginWithPassword,
  refreshSession,
  revokeAllSessions,
  revokeCurrentSession,
  revokeSessionById,
  setupMfaForUser,
  verifyMfaChallenge,
  getRoleForUser,
  assertRole,
  suspendUser,
  updateUserRoleWithAudit,
  createTenantApiKey,
  listTenantApiKeys,
  rotateTenantApiKey,
  revokeTenantApiKey,
  introspectApiKey,
  verifyApiKeyScope,
  resolveOrganizationId,
  resolveAuthorizedTenantContext,
  canManageRole
};

export type { ApiKeyScope, AuthenticatedContext, SessionTokens };

export async function authenticateRequest(input: {
  apiKeyToken?: string | null;
  config?: Pick<ApiConfig, "API_AUTH_IDLE_TIMEOUT_MINUTES">;
  sessionToken?: string | null;
}): Promise<AuthenticatedContext | null> {
  if (input.apiKeyToken) {
    const apiKey = await introspectApiKey(input.apiKeyToken);

    if (!apiKey.active || !apiKey.userId || !apiKey.tenantId) {
      return null;
    }

    const organizationId = await resolveOrganizationId(apiKey.tenantId);

    if (!organizationId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: apiKey.userId
      }
    });

    if (!user || user.status === UserStatus.SUSPENDED) {
      return null;
    }

    let encodedRole: Role | null = null;
    const parts = input.apiKeyToken.split("_");
    if (parts.length >= 3 && parts[0] === "bh360") {
      const rawRole = parts[2]?.toUpperCase();
      if (Object.values(Role).includes(rawRole as Role)) {
        encodedRole = rawRole as Role;
      }
    }

    const role = encodedRole || await getRoleForUser({
      organizationId,
      userId: apiKey.userId
    });

    return {
      apiKeyId: apiKey.apiKeyId,
      authType: "api-key",
      organizationId,
      role,
      sessionId: null,
      tenantId: apiKey.tenantId,
      userId: apiKey.userId
    };
  }

  if (!input.sessionToken) {
    return null;
  }

  const parts = input.sessionToken.split("_");
  let encodedRole: Role | null = null;

  if (parts.length >= 3 && parts[0] === "atk") {
    const rawRole = parts[1]?.toUpperCase();
    if (Object.values(Role).includes(rawRole as Role)) {
      encodedRole = rawRole as Role;
    }
  }

  const hashedToken = sha256(input.sessionToken);
  const session = await prisma.session.findUnique({
    where: {
      token: hashedToken
    }
  });

  if (!session) {
    return null;
  }

  if (session.revokedAt || session.expiresAt.getTime() < Date.now()) {
    return null;
  }

  const idleTimeoutMinutes = input.config?.API_AUTH_IDLE_TIMEOUT_MINUTES ?? 30;
  const lastActivityAtTime =
    session.lastActivityAt instanceof Date
      ? session.lastActivityAt.getTime()
      : Date.now();
  const idleExpiryTime = lastActivityAtTime + 60_000 * idleTimeoutMinutes;
  if (idleExpiryTime < Date.now()) {
    return null;
  }

  if (session.refreshExpiresAt && session.refreshExpiresAt.getTime() < Date.now()) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId
    }
  });

  if (!user || user.status === UserStatus.SUSPENDED) {
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

  const role = encodedRole || await getRoleForUser({
    organizationId: session.organizationId,
    userId: session.userId
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
}


