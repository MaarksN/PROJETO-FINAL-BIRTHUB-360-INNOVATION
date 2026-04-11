// @ts-nocheck
import { createHash } from "node:crypto";

import type { ApiConfig } from "@birthub/config";
import { prisma } from "@birthub/database";

import { ProblemDetailsError } from "../../lib/problem-details.js";
import { hashPassword, randomToken } from "../auth/crypto.js";
import { findOrganizationByReference } from "./service.js";

const LAWFUL_BASIS = {
  LEGAL_OBLIGATION: "LEGAL_OBLIGATION",
  LEGITIMATE_INTEREST: "LEGITIMATE_INTEREST"
} as const;

const RETENTION_ACTION = {
  ANONYMIZE: "ANONYMIZE",
  DELETE: "DELETE"
} as const;

const RETENTION_DATA_CATEGORY = {
  LOGIN_ALERTS: "LOGIN_ALERTS",
  MFA_CHALLENGES: "MFA_CHALLENGES",
  MFA_RECOVERY_CODES: "MFA_RECOVERY_CODES",
  OUTPUT_ARTIFACTS: "OUTPUT_ARTIFACTS",
  SUSPENDED_USERS: "SUSPENDED_USERS"
} as const;

const RETENTION_EXECUTION_MODE = {
  DRY_RUN: "DRY_RUN"
} as const;

const USER_STATUS = {
  SUSPENDED: "SUSPENDED"
} as const;

type LawfulBasis = (typeof LAWFUL_BASIS)[keyof typeof LAWFUL_BASIS];
type RetentionAction = (typeof RETENTION_ACTION)[keyof typeof RETENTION_ACTION];
type RetentionDataCategory = (typeof RETENTION_DATA_CATEGORY)[keyof typeof RETENTION_DATA_CATEGORY];
type RetentionExecutionMode = "DRY_RUN" | "EXECUTE";
type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

function readRetentionModel(name: "dataRetentionExecution" | "dataRetentionPolicy") {
  const model = Reflect.get(prisma, name);

  if (!model) {
    throw new ProblemDetailsError({
      detail: `Privacy retention storage '${name}' is unavailable in the current Prisma client.`,
      status: 503,
      title: "Service Unavailable"
    });
  }

  return model;
}

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
    action: RETENTION_ACTION.ANONYMIZE,
    dataCategory: RETENTION_DATA_CATEGORY.OUTPUT_ARTIFACTS,
    legalBasis: LAWFUL_BASIS.LEGITIMATE_INTEREST,
    retentionDays: 30
  },
  {
    action: RETENTION_ACTION.DELETE,
    dataCategory: RETENTION_DATA_CATEGORY.LOGIN_ALERTS,
    legalBasis: LAWFUL_BASIS.LEGITIMATE_INTEREST,
    retentionDays: 90
  },
  {
    action: RETENTION_ACTION.DELETE,
    dataCategory: RETENTION_DATA_CATEGORY.MFA_CHALLENGES,
    legalBasis: LAWFUL_BASIS.LEGITIMATE_INTEREST,
    retentionDays: 7
  },
  {
    action: RETENTION_ACTION.DELETE,
    dataCategory: RETENTION_DATA_CATEGORY.MFA_RECOVERY_CODES,
    legalBasis: LAWFUL_BASIS.LEGAL_OBLIGATION,
    retentionDays: 180
  },
  {
    action: RETENTION_ACTION.ANONYMIZE,
    dataCategory: RETENTION_DATA_CATEGORY.SUSPENDED_USERS,
    legalBasis: LAWFUL_BASIS.LEGAL_OBLIGATION,
    retentionDays: 90
  }
];

function anonymizedEmail(userId: string): string {
  return `deleted+${userId}@privacy.birthhub360.invalid`;
}

function redactedContentHash() {
  return createHash("sha256").update(REDACTED_OUTPUT_CONTENT, "utf8").digest("hex");
}

function sortPolicies<T extends { dataCategory: string; id: string }>(policies: T[]) {
  return policies.sort(
    (left, right) =>
      left.dataCategory.localeCompare(right.dataCategory) || left.id.localeCompare(right.id)
  );
}

async function listRetentionPoliciesPage(input: {
  enabled?: boolean | undefined;
  organizationId: string;
  cursorId?: string | undefined;
}) {
  const retentionPolicyModel = readRetentionModel("dataRetentionPolicy");
  const where = {
    organizationId: input.organizationId,
    ...(input.enabled !== undefined ? { enabled: input.enabled } : {})
  };

  if (input.cursorId) {
    return retentionPolicyModel.findMany({
      cursor: {
        id: input.cursorId
      },
      orderBy: {
        id: "asc"
      },
      skip: 1,
      take: RETENTION_POLICY_PAGE_SIZE,
      where
    });
  }

  return retentionPolicyModel.findMany({
    orderBy: {
      id: "asc"
    },
    take: RETENTION_POLICY_PAGE_SIZE,
    where
  });
}

async function listRetentionPoliciesForOrganization(input: {
  enabled?: boolean | undefined;
  organizationId: string;
  cursorId?: string | undefined;
}) {
  const page = await listRetentionPoliciesPage(input);
  const lastPolicy = page.at(-1);

  if (!lastPolicy || page.length < RETENTION_POLICY_PAGE_SIZE) {
    return input.cursorId ? page : sortPolicies(page);
  }

  const nextPage = await listRetentionPoliciesForOrganization({
    ...input,
    cursorId: lastPolicy.id
  });

  return input.cursorId ? page.concat(nextPage) : sortPolicies(page.concat(nextPage));
}

async function listOrganizationsPage(cursorId?: string) {
  const select = {
    id: true,
    tenantId: true
  };

  if (cursorId) {
    return prisma.organization.findMany({
      cursor: {
        id: cursorId
      },
      orderBy: {
        id: "asc"
      },
      select,
      skip: 1,
      take: RETENTION_SWEEP_ORGANIZATION_PAGE_SIZE
    });
  }

  return prisma.organization.findMany({
    orderBy: {
      id: "asc"
    },
    select,
    take: RETENTION_SWEEP_ORGANIZATION_PAGE_SIZE
  });
}

async function listOrganizationsForRetentionSweep(cursorId?: string) {
  const page = await listOrganizationsPage(cursorId);
  const lastOrganization = page.at(-1);

  if (!lastOrganization || page.length < RETENTION_SWEEP_ORGANIZATION_PAGE_SIZE) {
    return page;
  }

  return page.concat(await listOrganizationsForRetentionSweep(lastOrganization.id));
}

async function listSuspendedUsersPage(input: {
  organizationId: string;
  cutoff: Date;
  cursorId?: string | undefined;
}) {
  const where = {
    memberships: {
      some: {
        organizationId: input.organizationId
      }
    },
    status: USER_STATUS.SUSPENDED,
    suspendedAt: {
      lte: input.cutoff
    }
  };

  if (input.cursorId) {
    return prisma.user.findMany({
      cursor: {
        id: input.cursorId
      },
      orderBy: {
        id: "asc"
      },
      select: {
        id: true
      },
      skip: 1,
      take: RETENTION_SUSPENDED_USER_PAGE_SIZE,
      where
    });
  }

  return prisma.user.findMany({
    orderBy: {
      id: "asc"
    },
    select: {
      id: true
    },
    take: RETENTION_SUSPENDED_USER_PAGE_SIZE,
    where
  });
}

async function listSuspendedUsersForRetention(input: {
  organizationId: string;
  cutoff: Date;
  cursorId?: string | undefined;
}) {
  const page = await listSuspendedUsersPage(input);
  const lastUser = page.at(-1);

  if (!lastUser || page.length < RETENTION_SUSPENDED_USER_PAGE_SIZE) {
    return page;
  }

  return page.concat(
    await listSuspendedUsersForRetention({
      ...input,
      cursorId: lastUser.id
    })
  );
}

async function ensureDefaultPolicies(input: {
  organizationId: string;
  tenantId: string;
}) {
  const retentionPolicyModel = readRetentionModel("dataRetentionPolicy");
  await prisma.$transaction(
    DEFAULT_RETENTION_POLICIES.map((policy) =>
      retentionPolicyModel.upsert({
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
  policy: {
    action: RetentionAction;
    dataCategory: RetentionDataCategory;
    id: string;
    retentionDays: number;
  };
  tenantId: string;
}) {
  const retentionExecutionModel = readRetentionModel("dataRetentionExecution");
  const cutoff = new Date(Date.now() - input.policy.retentionDays * 24 * 60 * 60 * 1000);
  let affectedCount = 0;
  let scannedCount = 0;

  switch (input.policy.dataCategory) {
    case RETENTION_DATA_CATEGORY.OUTPUT_ARTIFACTS: {
      const where = {
        createdAt: {
          lt: cutoff
        },
        organizationId: input.organizationId
      };
      scannedCount = await prisma.outputArtifact.count({ where });

      if (input.mode !== RETENTION_EXECUTION_MODE.DRY_RUN && scannedCount > 0) {
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
    case RETENTION_DATA_CATEGORY.LOGIN_ALERTS: {
      const where = {
        createdAt: {
          lt: cutoff
        },
        organizationId: input.organizationId
      };
      scannedCount = await prisma.loginAlert.count({ where });

      if (input.mode !== RETENTION_EXECUTION_MODE.DRY_RUN && scannedCount > 0) {
        const result = await prisma.loginAlert.deleteMany({ where });
        affectedCount = result.count;
      }
      break;
    }
    case RETENTION_DATA_CATEGORY.MFA_CHALLENGES: {
      const where = {
        createdAt: {
          lt: cutoff
        },
        organizationId: input.organizationId
      };
      scannedCount = await prisma.mfaChallenge.count({ where });

      if (input.mode !== RETENTION_EXECUTION_MODE.DRY_RUN && scannedCount > 0) {
        const result = await prisma.mfaChallenge.deleteMany({ where });
        affectedCount = result.count;
      }
      break;
    }
    case RETENTION_DATA_CATEGORY.MFA_RECOVERY_CODES: {
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

      if (input.mode !== RETENTION_EXECUTION_MODE.DRY_RUN && scannedCount > 0) {
        const result = await prisma.mfaRecoveryCode.deleteMany({ where });
        affectedCount = result.count;
      }
      break;
    }
    case RETENTION_DATA_CATEGORY.SUSPENDED_USERS: {
      const users = await listSuspendedUsersForRetention({
        organizationId: input.organizationId,
        cutoff
      });
      scannedCount = users.length;

      if (input.mode !== RETENTION_EXECUTION_MODE.DRY_RUN && users.length > 0) {
        await Promise.all(
          users.map(async (user) => {
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
          })
        );
        affectedCount = users.length;
      }
      break;
    }
    default:
      break;
  }

  const execution = await retentionExecutionModel.create({
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
  const retentionExecutionModel = readRetentionModel("dataRetentionExecution");
  const organization = await resolveOrganization({
    organizationReference: input.organizationReference
  });

  const [items, executions] = await Promise.all([
    listRetentionPoliciesForOrganization({
      organizationId: organization.id
    }),
    retentionExecutionModel.findMany({
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
      readRetentionModel("dataRetentionPolicy").update({
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
