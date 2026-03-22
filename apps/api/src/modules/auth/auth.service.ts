import {
  ApiKeyStatus,
  MembershipStatus,
  Role,
  UserStatus,
  prisma
} from "@birthub/database";
import type { ApiConfig } from "@birthub/config";
import { setActiveSpanAttributes, withActiveSpan } from "@birthub/logger";

import {
  createApiKey,
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
  verifyMfaChallenge
};

type ApiKeyScope = "agents:read" | "agents:write" | "workflows:trigger" | "webhooks:receive";

export interface AuthenticatedContext {
  apiKeyId: string | null;
  authType: "api-key" | "session";
  organizationId: string;
  sessionId: string | null;
  tenantId: string;
  userId: string;
}

export interface SessionTokens {
  csrfToken: string;
  expiresAt: Date;
  refreshToken: string;
  token: string;
}

function rolePriority(role: Role): number {
  switch (role) {
    case Role.SUPER_ADMIN:
      return 5;
    case Role.OWNER:
      return 4;
    case Role.ADMIN:
      return 3;
    case Role.MEMBER:
      return 2;
    case Role.READONLY:
      return 1;
    default:
      return 0;
  }
}

export function canManageRole(currentRole: Role, targetRole: Role): boolean {
  if (currentRole === Role.SUPER_ADMIN) {
    return true;
  }

  if (currentRole === Role.OWNER) {
    return true;
  }

  if (currentRole === Role.ADMIN) {
    return targetRole === Role.MEMBER || targetRole === Role.READONLY;
  }

  return false;
}

export async function resolveOrganizationId(tenantId: string): Promise<string | null> {
  const organization = await findOrganizationByReference(tenantId);
  return organization?.id ?? null;
}

async function resolveTenantIdForOrganization(organizationId: string): Promise<string | null> {
  const organization = await prisma.organization.findFirst({
    where: {
      OR: [{ id: organizationId }, { tenantId: organizationId }]
    }
  });

  return organization?.tenantId ?? null;
}

async function findOrganizationByReference(reference: string) {
  return prisma.organization.findFirst({
    where: {
      OR: [{ id: reference }, { slug: reference }, { tenantId: reference }]
    }
  });
}

export async function resolveAuthorizedTenantContext(input: {
  tenantReference: string;
  userId: string;
}): Promise<
  | { status: "forbidden" }
  | { status: "not-found" }
  | {
      status: "ok";
      organizationId: string;
      role: Role;
      tenantId: string;
      tenantSlug: string | null;
    }
> {
  const organization = await findOrganizationByReference(input.tenantReference);

  if (!organization) {
    return { status: "not-found" };
  }

  const membership = await prisma.membership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: input.userId
      }
    }
  });

  if (!membership || membership.status !== MembershipStatus.ACTIVE) {
    return { status: "forbidden" };
  }

  return {
    organizationId: organization.id,
    role: membership.role,
    status: "ok",
    tenantId: organization.tenantId,
    tenantSlug: organization.slug ?? null
  };
}


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

    return {
      apiKeyId: apiKey.apiKeyId,
      authType: "api-key",
      organizationId,
      sessionId: null,
      tenantId: apiKey.tenantId,
      userId: apiKey.userId
    };
  }

  if (!input.sessionToken) {
    return null;
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

  return {
    apiKeyId: null,
    authType: "session",
    organizationId: session.organizationId,
    sessionId: session.id,
    tenantId: session.tenantId,
    userId: session.userId
  };
}


export async function getRoleForUser(input: {
  organizationId: string;
  userId: string;
}): Promise<Role | null> {
  const membership = await prisma.membership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: input.organizationId,
        userId: input.userId
      }
    },
    select: {
      role: true,
      status: true
    }
  });

  if (!membership || membership.status !== MembershipStatus.ACTIVE) {
    return null;
  }

  return membership.role;
}

export async function assertRole(input: {
  minimumRole: Role;
  organizationId: string;
  userId: string;
}): Promise<boolean> {
  const role = await getRoleForUser({
    organizationId: input.organizationId,
    userId: input.userId
  });

  if (!role) {
    return false;
  }

  return rolePriority(role) >= rolePriority(input.minimumRole);
}

export async function createTenantApiKey(input: {
  config: ApiConfig;
  label: string;
  organizationId: string;
  scopes: ApiKeyScope[];
  userId: string;
}) {
  const tenantId = await resolveTenantIdForOrganization(input.organizationId);

  if (!tenantId) {
    throw new Error("TENANT_NOT_FOUND");
  }

  const generated = createApiKey(input.config.API_KEY_PREFIX);
  const record = await prisma.apiKey.create({
    data: {
      keyHash: generated.hash,
      label: input.label,
      last4: generated.last4,
      organizationId: input.organizationId,
      prefix: generated.prefix,
      scopes: input.scopes,
      tenantId,
      userId: input.userId
    }
  });

  return {
    id: record.id,
    key: generated.key
  };
}

export async function listTenantApiKeys(input: {
  organizationId: string;
  userId: string;
}) {
  return prisma.apiKey.findMany({
    orderBy: {
      createdAt: "desc"
    },
    select: {
      createdAt: true,
      id: true,
      label: true,
      last4: true,
      scopes: true,
      status: true
    },
    where: {
      organizationId: input.organizationId,
      userId: input.userId
    }
  });
}

export async function rotateTenantApiKey(input: {
  config: ApiConfig;
  id: string;
  organizationId: string;
  userId: string;
}) {
  const current = await prisma.apiKey.findFirst({
    where: {
      id: input.id,
      organizationId: input.organizationId,
      userId: input.userId
    }
  });

  if (!current) {
    throw new Error("API_KEY_NOT_FOUND");
  }

  const generated = createApiKey(input.config.API_KEY_PREFIX);
  const graceExpiresAt = new Date(
    Date.now() + input.config.API_AUTH_ROTATION_GRACE_HOURS * 60 * 60 * 1000
  );

  const next = await prisma.$transaction(async (tx) => {
    await tx.apiKey.update({
      data: {
        graceExpiresAt,
        revokedAt: null,
        status: ApiKeyStatus.ACTIVE
      },
      where: {
        id: current.id
      }
    });

    return tx.apiKey.create({
      data: {
        keyHash: generated.hash,
        label: current.label,
        last4: generated.last4,
        organizationId: current.organizationId,
        prefix: current.prefix,
        rotatedFromId: current.id,
        scopes: current.scopes,
        tenantId: current.tenantId,
        userId: current.userId
      }
    });
  });

  return {
    id: next.id,
    key: generated.key
  };
}

export async function revokeTenantApiKey(input: {
  id: string;
  organizationId: string;
  userId: string;
}) {
  await prisma.apiKey.updateMany({
    data: {
      revokedAt: new Date(),
      status: ApiKeyStatus.REVOKED
    },
    where: {
      id: input.id,
      organizationId: input.organizationId,
      userId: input.userId
    }
  });
}

export async function introspectApiKey(rawToken: string): Promise<{
  active: boolean;
  apiKeyId: string | null;
  scopes: ApiKeyScope[];
  tenantId: string | null;
  userId: string | null;
}> {
  const hashed = sha256(rawToken);
  const apiKey = await prisma.apiKey.findUnique({
    where: {
      keyHash: hashed
    }
  });

  if (!apiKey) {
    return {
      active: false,
      apiKeyId: null,
      scopes: [],
      tenantId: null,
      userId: null
    };
  }

  const now = Date.now();
  const expired =
    (apiKey.expiresAt && apiKey.expiresAt.getTime() < now) ||
    (apiKey.graceExpiresAt && apiKey.graceExpiresAt.getTime() < now);
  const revoked = apiKey.status === ApiKeyStatus.REVOKED || Boolean(apiKey.revokedAt);

  if (expired || revoked) {
    return {
      active: false,
      apiKeyId: apiKey.id,
      scopes: [],
      tenantId: null,
      userId: null
    };
  }

  await prisma.apiKey.update({
    data: {
      lastUsedAt: new Date()
    },
    where: {
      id: apiKey.id
    }
  });

  const validScopes: ApiKeyScope[] = ["agents:read", "agents:write", "workflows:trigger", "webhooks:receive"];

  const parsedScopes: ApiKeyScope[] = Array.isArray(apiKey.scopes)
    ? apiKey.scopes.filter((s): s is ApiKeyScope =>
        typeof s === "string" && (validScopes as string[]).includes(s)
      )
    : [];

  return {
    active: true,
    apiKeyId: apiKey.id,
    scopes: parsedScopes,
    tenantId: apiKey.tenantId,
    userId: apiKey.userId
  };
}

export async function verifyApiKeyScope(input: {
  requiredScope: ApiKeyScope;
  token: string;
}): Promise<boolean> {
  const introspection = await introspectApiKey(input.token);

  return introspection.active && introspection.scopes.includes(input.requiredScope);
}

export async function suspendUser(input: {
  actorUserId: string;
  organizationId: string;
  targetUserId: string;
}) {
  const before = await prisma.user.findUnique({
    where: {
      id: input.targetUserId
    }
  });

  if (!before) {
    throw new Error("USER_NOT_FOUND");
  }

  const updated = await prisma.user.update({
    data: {
      status: UserStatus.SUSPENDED,
      suspendedAt: new Date()
    },
    where: {
      id: input.targetUserId
    }
  });
  const tenantId =
    (await resolveTenantIdForOrganization(input.organizationId)) ?? input.organizationId;

  await prisma.auditLog.create({
    data: {
      action: "user.suspended",
      actorId: input.actorUserId,
      diff: {
        after: {
          status: updated.status
        },
        before: {
          status: before.status
        }
      },
      entityId: input.targetUserId,
      entityType: "user",
      tenantId
    }
  });
}

export async function updateUserRoleWithAudit(input: {
  actorUserId: string;
  organizationId: string;
  role: Role;
  targetUserId: string;
}) {
  const before = await prisma.membership.findUnique({
    where: {
      organizationId_userId: {
        organizationId: input.organizationId,
        userId: input.targetUserId
      }
    }
  });

  if (!before) {
    throw new Error("MEMBERSHIP_NOT_FOUND");
  }

  const updated = await prisma.membership.update({
    data: {
      role: input.role
    },
    where: {
      organizationId_userId: {
        organizationId: input.organizationId,
        userId: input.targetUserId
      }
    }
  });
  const tenantId =
    (await resolveTenantIdForOrganization(input.organizationId)) ?? input.organizationId;

  await prisma.auditLog.create({
    data: {
      action: "membership.role.updated",
      actorId: input.actorUserId,
      diff: {
        after: {
          role: updated.role
        },
        before: {
          role: before.role
        }
      },
      entityId: input.targetUserId,
      entityType: "membership",
      tenantId
    }
  });

  return updated;
}


