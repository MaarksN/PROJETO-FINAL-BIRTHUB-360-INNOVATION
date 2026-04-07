import { createHash } from "node:crypto";

import type { ApiConfig } from "@birthub/config";
import {
  LawfulBasis,
  RetentionAction,
  RetentionDataCategory,
  RetentionExecutionMode,
  UserStatus,
  prisma
} from "@birthub/database";

import { ProblemDetailsError } from "../../lib/problem-details.js";
import { hashPassword, randomToken } from "../auth/crypto.js";
import { findOrganizationByReference } from "./service.js";

const REDACTED_OUTPUT_CONTENT = "[REDACTED BY RETENTION POLICY]";
const RETENTION_POLICY_PAGE_SIZE = 25;
const RETENTION_SWEEP_ORGANIZATION_PAGE_SIZE = 100;
const RETENTION_SUSPENDED_USER_PAGE_SIZE = 100;

const DEFAULT_RETENTION_POLICIES: Array<{
  action: RetentionAction;
  dataCategory: RetentionDataCategory;
  legalBasis: LawfulBasis;
  retentionDays: number;
}> = [
  {
    action: RetentionAction.ANONYMIZE,
    dataCategory: RetentionDataCategory.OUTPUT_ARTIFACTS,
    legalBasis: LawfulBasis.LEGITIMATE_INTEREST,
    retentionDays: 30
  },
  {
    action: RetentionAction.DELETE,
    dataCategory: RetentionDataCategory.LOGIN_ALERTS,
    legalBasis: LawfulBasis.LEGITIMATE_INTEREST,
    retentionDays: 90
  },
  {
    action: RetentionAction.DELETE,
    dataCategory: RetentionDataCategory.MFA_CHALLENGES,
    legalBasis: LawfulBasis.LEGITIMATE_INTEREST,
    retentionDays: 7
  },
  {
    action: RetentionAction.DELETE,
    dataCategory: RetentionDataCategory.MFA_RECOVERY_CODES,
    legalBasis: LawfulBasis.LEGAL_OBLIGATION,
    retentionDays: 180
  },
  {
    action: RetentionAction.ANONYMIZE,
    dataCategory: RetentionDataCategory.SUSPENDED_USERS,
    legalBasis: LawfulBasis.LEGAL_OBLIGATION,
    retentionDays: 90
  }
];

function anonymizedEmail(userId: string): string {
  return `deleted+${userId}@privacy.birthhub360.invalid`;
}

function redactedContentHash() {
  return createHash("sha256").update(REDACTED_OUTPUT_CONTENT, "utf8").digest("hex");
}

function buildIdCursor(cursorId?: string) {
  return cursorId
    ? {
        cursor: {
          id: cursorId
        },
        skip: 1
      }
    : {};
}

function sortPolicies<T extends { dataCategory: string; id: string }>(policies: T[]) {
  return policies.sort(
    (left, right) =>
      left.dataCategory.localeCompare(right.dataCategory) || left.id.localeCompare(right.id)
  );
}

async function listRetentionPoliciesPage(input: {
  enabled?: boolean;
  organizationId: string;
  cursorId?: string;
}) {
  return prisma.dataRetentionPolicy.findMany({
    ...buildIdCursor(input.cursorId),
    orderBy: {
      id: "asc"
    },
    take: RETENTION_POLICY_PAGE_SIZE,
    where: {
      organizationId: input.organizationId,
      ...(input.enabled !== undefined ? { enabled: input.enabled } : {})
    }
  });
}

async function listRetentionPoliciesForOrganization(input: {
  enabled?: boolean;
  organizationId: string;
}) {
  const items: Awaited<ReturnType<typeof listRetentionPoliciesPage>> = [];
  let cursorId: string | undefined;

  while (true) {
    const page = await listRetentionPoliciesPage({
      enabled: input.enabled,
      organizationId: input.organizationId,
      cursorId
    });
    items.push(...page);

    if (page.length < RETENTION_POLICY_PAGE_SIZE) {
      return sortPolicies(items);
    }

    cursorId = page.at(-1)?.id;
  }
}

async function listOrganizationsPage(cursorId?: string) {
  return prisma.organization.findMany({
    ...buildIdCursor(cursorId),
    orderBy: {
      id: "asc"
    },
    select: {
      id: true,
      tenantId: true
    },
    take: RETENTION_SWEEP_ORGANIZATION_PAGE_SIZE
  });
}

async function listOrganizationsForRetentionSweep() {
  const organizations: Awaited<ReturnType<typeof listOrganizationsPage>> = [];
  let cursorId: string | undefined;

  while (true) {
    const page = await listOrganizationsPage(cursorId);
    organizations.push(...page);

    if (page.length < RETENTION_SWEEP_ORGANIZATION_PAGE_SIZE) {
      return organizations;
    }

    cursorId = page.at(-1)?.id;
  }
}

async function listSuspendedUsersPage(input: {
  organizationId: string;
  cutoff: Date;
  cursorId?: string;
}) {
  return prisma.user.findMany({
    ...buildIdCursor(input.cursorId),
    orderBy: {
      id: "asc"
    },
    select: {
      id: true
    },
    take: RETENTION_SUSPENDED_USER_PAGE_SIZE,
    where: {
      memberships: {
        some: {
          organizationId: input.organizationId
        }
      },
      status: UserStatus.SUSPENDED,
      suspendedAt: {
        lte: input.cutoff
      }
    }
  });
}

async function listSuspendedUsersForRetention(input: {
  organizationId: string;
  cutoff: Date;
}) {
  const users: Awaited<ReturnType<typeof listSuspendedUsersPage>> = [];
  let cursorId: string | undefined;

  while (true) {
    const page = await listSuspendedUsersPage({
      organizationId: input.organizationId,
      cutoff: input.cutoff,
      cursorId
    });
    users.push(...page);

    if (page.length < RETENTION_SUSPENDED_USER_PAGE_SIZE) {
      return users;
    }

    cursorId = page.at(-1)?.id;
  }
}

async function ensureDefaultPolicies(input: {
  organizationId: string;
  tenantId: string;
}) {
  await prisma.$transaction(
    DEFAULT_RETENTION_POLICIES.map((policy) =>
      prisma.dataRetentionPolicy.upsert({
        create: {
          action: policy.action,
          dataCategory: policy.dataCategory,
          legalBasis: policy.legalBasis,
          organizationId: input.organizationId,
          retentionDays: policy.retentionDays,
          tenantId: input.tenantId
        },
        update: {},
        where: {
          organizationId_dataCategory: {
            dataCategory: policy.dataCategory,
            organizationId: input.organizationId
          }
        }
      })
    )
  );
}

async function resolveOrganization(input: { organizationReference: string }) {
  const organization = await findOrganizationByReference(input.organizationReference);

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found for retention policy.",
      status: 404,
      title: "Not Found"
    });
  }

  await ensureDefaultPolicies({
    organizationId: organization.id,
    tenantId: organization.tenantId
  });

  return organization;
}

async function executePolicy(input: {
  config: ApiConfig;
  mode: RetentionExecutionMode;
  organizationId: string;
  policy: Awaited<ReturnType<typeof prisma.dataRetentionPolicy.findFirstOrThrow>>;
  tenantId: string;
}) {
  const cutoff = new Date(Date.now() - input.policy.retentionDays * 24 * 60 * 60 * 1000);
  let affectedCount = 0;
  let scannedCount = 0;

  switch (input.policy.dataCategory) {
    case RetentionDataCategory.OUTPUT_ARTIFACTS: {
      const where = {
        createdAt: {
          lt: cutoff
        },
        organizationId: input.organizationId
      };
      scannedCount = await prisma.outputArtifact.count({ where });

      if (input.mode !== RetentionExecutionMode.DRY_RUN && scannedCount > 0) {
        const result = await prisma.outputArtifact.updateMany({
          data: {
            content: REDACTED_OUTPUT_CONTENT,
            contentHash: redactedContentHash()
          },
          where
        });
        affectedCount = result.count;
      }
      break;
    }
    case RetentionDataCategory.LOGIN_ALERTS: {
      const where = {
        createdAt: {
          lt: cutoff
        },
        organizationId: input.organizationId
      };
      scannedCount = await prisma.loginAlert.count({ where });

      if (input.mode !== RetentionExecutionMode.DRY_RUN && scannedCount > 0) {
        const result = await prisma.loginAlert.deleteMany({ where });
        affectedCount = result.count;
      }
      break;
    }
    case RetentionDataCategory.MFA_CHALLENGES: {
      const where = {
        createdAt: {
          lt: cutoff
        },
        organizationId: input.organizationId
      };
      scannedCount = await prisma.mfaChallenge.count({ where });

      if (input.mode !== RetentionExecutionMode.DRY_RUN && scannedCount > 0) {
        const result = await prisma.mfaChallenge.deleteMany({ where });
        affectedCount = result.count;
      }
      break;
    }
    case RetentionDataCategory.MFA_RECOVERY_CODES: {
      const where = {
        OR: [
          {
            createdAt: {
              lt: cutoff
            }
          },
          {
            usedAt: {
              lt: cutoff
            }
          }
        ],
        tenantId: input.tenantId
      };
      scannedCount = await prisma.mfaRecoveryCode.count({ where });

      if (input.mode !== RetentionExecutionMode.DRY_RUN && scannedCount > 0) {
        const result = await prisma.mfaRecoveryCode.deleteMany({ where });
        affectedCount = result.count;
      }
      break;
    }
    case RetentionDataCategory.SUSPENDED_USERS: {
      const users = await listSuspendedUsersForRetention({
        organizationId: input.organizationId,
        cutoff
      });
      scannedCount = users.length;

      if (input.mode !== RetentionExecutionMode.DRY_RUN && users.length > 0) {
        for (const user of users) {
          await prisma.user.update({
            data: {
              email: anonymizedEmail(user.id),
              mfaEnabled: false,
              mfaFailedAttempts: 0,
              mfaLockedUntil: null,
              mfaSecret: null,
              name: "Deleted User",
              passwordHash: await hashPassword(randomToken(18), {
                memoryKiB: input.config.AUTH_ARGON2_MEMORY_KIB,
                parallelism: input.config.AUTH_ARGON2_PARALLELISM,
                passes: input.config.AUTH_ARGON2_PASSES
              })
            },
            where: {
              id: user.id
            }
          });
        }
        affectedCount = users.length;
      }
      break;
    }
    default:
      break;
  }

  const execution = await prisma.dataRetentionExecution.create({
    data: {
      action: input.policy.action,
      dataCategory: input.policy.dataCategory,
      mode: input.mode,
      organizationId: input.organizationId,
      policyId: input.policy.id,
      scannedCount,
      affectedCount,
      tenantId: input.tenantId
    }
  });

  await prisma.auditLog.create({
    data: {
      action: "privacy.retention.executed",
      diff: {
        after: {
          action: input.policy.action,
          affectedCount,
          dataCategory: input.policy.dataCategory,
          mode: input.mode,
          scannedCount
        },
        before: {}
      },
      entityId: execution.id,
      entityType: "data_retention_execution",
      tenantId: input.tenantId
    }
  });

  return {
    affectedCount,
    dataCategory: input.policy.dataCategory,
    executionId: execution.id,
    scannedCount
  };
}

export async function listRetentionPolicies(input: {
  organizationReference: string;
}) {
  const organization = await resolveOrganization({
    organizationReference: input.organizationReference
  });

  const [items, executions] = await Promise.all([
    listRetentionPoliciesForOrganization({
      organizationId: organization.id
    }),
    prisma.dataRetentionExecution.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 20,
      where: {
        organizationId: organization.id
      }
    })
  ]);

  return {
    executions,
    items
  };
}

export async function updateRetentionPolicies(input: {
  organizationReference: string;
  policies: Array<{
    action?: RetentionAction;
    dataCategory: RetentionDataCategory;
    enabled?: boolean;
    retentionDays?: number;
  }>;
}) {
  const organization = await resolveOrganization({
    organizationReference: input.organizationReference
  });

  await prisma.$transaction(
    input.policies.map((policy) =>
      prisma.dataRetentionPolicy.update({
        data: {
          ...(policy.action !== undefined ? { action: policy.action } : {}),
          ...(policy.enabled !== undefined ? { enabled: policy.enabled } : {}),
          ...(policy.retentionDays !== undefined
            ? { retentionDays: policy.retentionDays }
            : {})
        },
        where: {
          organizationId_dataCategory: {
            dataCategory: policy.dataCategory,
            organizationId: organization.id
          }
        }
      })
    )
  );

  return listRetentionPolicies({
    organizationReference: organization.id
  });
}

export async function runRetentionSweep(input: {
  config: ApiConfig;
  mode: RetentionExecutionMode;
  organizationReference?: string;
}) {
  const organizations = input.organizationReference
    ? [await resolveOrganization({ organizationReference: input.organizationReference })]
    : await listOrganizationsForRetentionSweep();

  const results = [];

  for (const organization of organizations) {
    await ensureDefaultPolicies({
      organizationId: organization.id,
      tenantId: organization.tenantId
    });

    const policies = await listRetentionPoliciesForOrganization({
      enabled: true,
      organizationId: organization.id
    });

    for (const policy of policies) {
      results.push(
        await executePolicy({
          config: input.config,
          mode: input.mode,
          organizationId: organization.id,
          policy,
          tenantId: organization.tenantId
        })
      );
    }
  }

  return results;
}
