import {
  AgentStatus,
  InviteStatus,
  MembershipStatus,
  PrismaClient,
  QuotaResourceType,
  Role,
  SessionStatus,
  SubscriptionPlan,
  SubscriptionStatus,
  WorkflowStatus
} from "@prisma/client";
import { createHash } from "node:crypto";

const prisma = new PrismaClient();

type TenantSeed = {
  agents: string[];
  members: Array<{ email: string; name: string; role: Role }>;
  name: string;
  slug: string;
  workflowNames: string[];
};

const tenants: TenantSeed[] = [
  {
    agents: ["Alpha Concierge", "Alpha Revenue Scout", "Alpha Retention Radar"],
    members: [
      { email: "owner.alpha@birthub.local", name: "Alpha Owner", role: Role.OWNER },
      { email: "admin.alpha@birthub.local", name: "Alpha Admin", role: Role.ADMIN },
      { email: "ops.alpha@birthub.local", name: "Alpha Ops", role: Role.ADMIN },
      { email: "member.alpha@birthub.local", name: "Alpha Member", role: Role.MEMBER },
      { email: "success.alpha@birthub.local", name: "Alpha Success", role: Role.MEMBER },
      { email: "readonly.alpha@birthub.local", name: "Alpha Readonly", role: Role.READONLY }
    ],
    name: "BirthHub Alpha",
    slug: "birthhub-alpha",
    workflowNames: ["Alpha onboarding", "Alpha renewal watch"]
  },
  {
    agents: ["Beta Concierge", "Beta Revenue Scout", "Beta Retention Radar"],
    members: [
      { email: "owner.beta@birthub.local", name: "Beta Owner", role: Role.OWNER },
      { email: "admin.beta@birthub.local", name: "Beta Admin", role: Role.ADMIN },
      { email: "ops.beta@birthub.local", name: "Beta Ops", role: Role.ADMIN },
      { email: "member.beta@birthub.local", name: "Beta Member", role: Role.MEMBER },
      { email: "success.beta@birthub.local", name: "Beta Success", role: Role.MEMBER },
      { email: "readonly.beta@birthub.local", name: "Beta Readonly", role: Role.READONLY }
    ],
    name: "BirthHub Beta",
    slug: "birthhub-beta",
    workflowNames: ["Beta onboarding", "Beta churn shield"]
  }
];

async function wipeDatabase(): Promise<void> {
  await prisma.jobSigningSecret.deleteMany();
  await prisma.loginAlert.deleteMany();
  await prisma.mfaChallenge.deleteMany();
  await prisma.mfaRecoveryCode.deleteMany();
  await prisma.apiKey.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.quotaUsage.deleteMany();
  await prisma.invite.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.session.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();
}

async function createTenant(seed: TenantSeed): Promise<void> {
  const passwordHash = createHash("sha256").update("password123").digest("hex");
  const organization = await prisma.organization.create({
    data: {
      name: seed.name,
      settings: {
        locale: "pt-BR",
        timezone: "America/Sao_Paulo"
      },
      slug: seed.slug
    }
  });

  const users = await Promise.all(
    seed.members.map((member) =>
      prisma.user.create({
        data: {
          email: member.email,
          name: member.name,
          passwordHash
        }
      })
    )
  );

  await Promise.all(
    users.map((user, index) =>
      prisma.membership.create({
        data: {
          organizationId: organization.id,
          role: seed.members[index]?.role ?? Role.MEMBER,
          status: MembershipStatus.ACTIVE,
          tenantId: organization.tenantId,
          userId: user.id
        }
      })
    )
  );

  await Promise.all(
    users.map((user, index) =>
      prisma.session.create({
        data: {
          csrfToken: `${seed.slug}-${index + 1}-csrf`,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          organizationId: organization.id,
          refreshExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
          refreshTokenHash: createHash("sha256")
            .update(`${seed.slug}-${index + 1}-refresh`)
            .digest("hex"),
          status: SessionStatus.ACTIVE,
          tenantId: organization.tenantId,
          token: `${seed.slug}-${index + 1}-session`,
          userId: user.id
        }
      })
    )
  );

  await Promise.all(
    seed.agents.map((agentName, index) =>
      prisma.agent.create({
        data: {
          config: {
            channel: index === 0 ? "concierge" : index === 1 ? "growth" : "retention"
          },
          name: agentName,
          organizationId: organization.id,
          status: AgentStatus.ACTIVE,
          tenantId: organization.tenantId
        }
      })
    )
  );

  const workflows = await Promise.all(
    seed.workflowNames.map((workflowName, index) =>
      prisma.workflow.create({
        data: {
          definition: {
            steps: ["capture", "qualify", "handoff"],
            version: 1
          },
          name: workflowName,
          organizationId: organization.id,
          status: index === 0 ? WorkflowStatus.ACTIVE : WorkflowStatus.PAUSED,
          tenantId: organization.tenantId
        }
      })
    )
  );

  await Promise.all(
    Array.from({ length: 3 }, (_, index) =>
      prisma.customer.create({
        data: {
          email: `customer.${index + 1}.${seed.slug}@birthub.local`,
          metadata: {
            lifecycle: index === 0 ? "new" : index === 1 ? "active" : "renewal"
          },
          name: `${seed.name} Customer ${index + 1}`,
          organizationId: organization.id,
          status: index === 2 ? "at-risk" : "active",
          tenantId: organization.tenantId
        }
      })
    )
  );

  await prisma.subscription.create({
    data: {
      organizationId: organization.id,
      plan: SubscriptionPlan.PRO,
      renewsAt: new Date("2026-04-01T00:00:00.000Z"),
      status: SubscriptionStatus.ACTIVE,
      tenantId: organization.tenantId
    }
  });

  await Promise.all(
    [
      { limit: 5_000, resourceType: QuotaResourceType.API_REQUESTS },
      { limit: 1_000, resourceType: QuotaResourceType.AI_PROMPTS },
      { limit: 2_500, resourceType: QuotaResourceType.EMAILS_SENT }
    ].map((quota, index) =>
      prisma.quotaUsage.create({
        data: {
          count: index * 10,
          limit: quota.limit,
          period: "MONTHLY-2026-03",
          resetAt: new Date("2026-04-01T00:00:00.000Z"),
          resourceType: quota.resourceType,
          tenantId: organization.tenantId
        }
      })
    )
  );

  await prisma.invite.create({
    data: {
      email: `invite.${seed.slug}@birthub.local`,
      expiresAt: new Date("2026-03-20T00:00:00.000Z"),
      invitedByUserId: users[0]?.id ?? null,
      organizationId: organization.id,
      role: Role.MEMBER,
      status: InviteStatus.PENDING,
      tenantId: organization.tenantId,
      token: `${seed.slug}-invite-token`
    }
  });

  await Promise.all(
    workflows.map((workflow) =>
      prisma.auditLog.create({
        data: {
          action: "workflow.seeded",
          actorId: users[0]?.id ?? null,
          diff: {
            status: workflow.status
          },
          entityId: workflow.id,
          entityType: "workflow",
          ip: "127.0.0.1",
          tenantId: organization.tenantId,
          userAgent: "seed-script/1.0"
        }
      })
    )
  );

  await prisma.jobSigningSecret.create({
    data: {
      organizationId: organization.id,
      secret: createHash("sha256").update(`${organization.tenantId}-job-secret`).digest("hex"),
      tenantId: organization.tenantId
    }
  });
}

async function main(): Promise<void> {
  await wipeDatabase();

  for (const tenant of tenants) {
    await createTenant(tenant);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
