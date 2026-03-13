import {
  AgentStatus,
  InvoiceStatus,
  InviteStatus,
  MembershipStatus,
  Prisma,
  PrismaClient,
  QuotaResourceType,
  Role,
  SessionStatus,
  SubscriptionStatus,
  WorkflowStatus
} from "@prisma/client";
import { createHash } from "node:crypto";

const prisma = new PrismaClient();

type PlanSeed = {
  code: string;
  currency: string;
  description: string;
  limits: Record<string, unknown>;
  monthlyPriceCents: number;
  name: string;
  stripePriceId: string;
  stripeProductId: string;
  yearlyPriceCents: number;
};

type TenantSeed = {
  agents: string[];
  members: Array<{ email: string; name: string; role: Role }>;
  name: string;
  planCode: string;
  slug: string;
  workflowNames: string[];
};

const plans: PlanSeed[] = [
  {
    code: "starter",
    currency: "usd",
    description: "Plano de entrada para times pequenos.",
    limits: {
      agents: 5,
      features: {
        advancedAnalytics: false,
        agents: true,
        customerPortal: true,
        workflows: true
      },
      monthlyTokens: 250_000,
      workflows: 30
    },
    monthlyPriceCents: 4900,
    name: "Starter",
    stripePriceId: "price_starter_monthly",
    stripeProductId: "prod_starter",
    yearlyPriceCents: 47040
  },
  {
    code: "professional",
    currency: "usd",
    description: "Plano para operação em escala com automações avançadas.",
    limits: {
      agents: 25,
      features: {
        advancedAnalytics: true,
        agents: true,
        customerPortal: true,
        workflows: true
      },
      monthlyTokens: 2_500_000,
      workflows: 250
    },
    monthlyPriceCents: 14900,
    name: "Professional",
    stripePriceId: "price_professional_monthly",
    stripeProductId: "prod_professional",
    yearlyPriceCents: 143040
  },
  {
    code: "enterprise",
    currency: "usd",
    description: "Plano enterprise com limites ilimitados e suporte prioritário.",
    limits: {
      agents: -1,
      features: {
        advancedAnalytics: true,
        agents: true,
        customerPortal: true,
        prioritySupport: true,
        workflows: true
      },
      monthlyTokens: -1,
      workflows: -1
    },
    monthlyPriceCents: 49900,
    name: "Enterprise",
    stripePriceId: "price_enterprise_monthly",
    stripeProductId: "prod_enterprise",
    yearlyPriceCents: 479040
  }
];

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
    planCode: "professional",
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
    planCode: "starter",
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
  await prisma.billingEvent.deleteMany();
  await prisma.usageRecord.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.paymentMethod.deleteMany();
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
  await prisma.plan.deleteMany();
}

async function seedPlans(): Promise<Map<string, { id: string; limits: Record<string, unknown> }>> {
  const seeded = new Map<string, { id: string; limits: Record<string, unknown> }>();

  for (const plan of plans) {
    const record = await prisma.plan.upsert({
      create: {
        code: plan.code,
        currency: plan.currency,
        description: plan.description,
        limits: plan.limits as Prisma.InputJsonValue,
        monthlyPriceCents: plan.monthlyPriceCents,
        name: plan.name,
        stripePriceId: plan.stripePriceId,
        stripeProductId: plan.stripeProductId,
        yearlyPriceCents: plan.yearlyPriceCents
      },
      update: {
        active: true,
        currency: plan.currency,
        description: plan.description,
        limits: plan.limits as Prisma.InputJsonValue,
        monthlyPriceCents: plan.monthlyPriceCents,
        name: plan.name,
        stripePriceId: plan.stripePriceId,
        stripeProductId: plan.stripeProductId,
        yearlyPriceCents: plan.yearlyPriceCents
      },
      where: {
        code: plan.code
      }
    });

    seeded.set(plan.code, { id: record.id, limits: plan.limits });
  }

  return seeded;
}

function unlimitedToLargeNumber(value: unknown): number {
  if (typeof value !== "number") {
    return 0;
  }

  if (value < 0) {
    return 1_000_000;
  }

  return value;
}

async function createTenant(
  seed: TenantSeed,
  planMap: Map<string, { id: string; limits: Record<string, unknown> }>
): Promise<void> {
  const selectedPlan = planMap.get(seed.planCode);

  if (!selectedPlan) {
    throw new Error(`Plan '${seed.planCode}' was not seeded.`);
  }

  const passwordHash = createHash("sha256").update("password123").digest("hex");
  const organization = await prisma.organization.create({
    data: {
      name: seed.name,
      planId: selectedPlan.id,
      settings: {
        locale: "pt-BR",
        timezone: "America/Sao_Paulo"
      },
      slug: seed.slug,
      stripeCustomerId: `cus_${seed.slug.replace(/-/g, "_")}`
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

  const subscription = await prisma.subscription.create({
    data: {
      currentPeriodEnd: new Date("2026-04-01T00:00:00.000Z"),
      organizationId: organization.id,
      planId: selectedPlan.id,
      status: SubscriptionStatus.active,
      stripeCustomerId: organization.stripeCustomerId,
      stripeSubscriptionId: `sub_${seed.slug.replace(/-/g, "_")}`,
      tenantId: organization.tenantId
    }
  });

  await Promise.all([
    prisma.paymentMethod.create({
      data: {
        brand: "visa",
        expMonth: 12,
        expYear: 2030,
        isDefault: true,
        last4: "4242",
        organizationId: organization.id,
        stripePaymentMethodId: `pm_${seed.slug.replace(/-/g, "_")}`,
        tenantId: organization.tenantId
      }
    }),
    prisma.invoice.create({
      data: {
        amountDueCents: seed.planCode === "enterprise" ? 0 : 14900,
        amountPaidCents: seed.planCode === "enterprise" ? 0 : 14900,
        currency: "usd",
        hostedInvoiceUrl: `https://billing.stripe.com/invoice/${seed.slug}/latest`,
        invoicePdfUrl: `https://pay.stripe.com/invoice/${seed.slug}/latest.pdf`,
        organizationId: organization.id,
        periodEnd: new Date("2026-03-31T23:59:59.000Z"),
        periodStart: new Date("2026-03-01T00:00:00.000Z"),
        status: InvoiceStatus.paid,
        stripeInvoiceId: `in_${seed.slug.replace(/-/g, "_")}_001`,
        subscriptionId: subscription.id,
        tenantId: organization.tenantId
      }
    })
  ]);

  await Promise.all(
    [
      { metric: "tokens.input", quantity: 122_000 },
      { metric: "tokens.output", quantity: 88_400 },
      { metric: "workflow.runs", quantity: 46 }
    ].map((usage, index) =>
      prisma.usageRecord.create({
        data: {
          eventId: `${seed.slug}-usage-${index + 1}`,
          metadata: {
            source: "seed-script"
          },
          metric: usage.metric,
          organizationId: organization.id,
          quantity: usage.quantity,
          subscriptionId: subscription.id,
          tenantId: organization.tenantId
        }
      })
    )
  );

  await prisma.billingEvent.create({
    data: {
      organizationId: organization.id,
      payload: {
        note: "Seeded baseline billing event",
        status: "processed"
      },
      stripeEventId: `evt_${seed.slug.replace(/-/g, "_")}_bootstrap`,
      tenantId: organization.tenantId,
      type: "seed.subscription.created"
    }
  });

  const agentsLimit = unlimitedToLargeNumber((selectedPlan.limits as Record<string, unknown>).agents);
  const workflowsLimit = unlimitedToLargeNumber(
    (selectedPlan.limits as Record<string, unknown>).workflows
  );
  const tokensLimit = unlimitedToLargeNumber(
    (selectedPlan.limits as Record<string, unknown>).monthlyTokens
  );

  await Promise.all(
    [
      { limit: Math.max(5_000, tokensLimit), resourceType: QuotaResourceType.API_REQUESTS },
      { limit: Math.max(1_000, Math.floor(tokensLimit / 4)), resourceType: QuotaResourceType.AI_PROMPTS },
      { limit: Math.max(2_500, workflowsLimit * 15), resourceType: QuotaResourceType.EMAILS_SENT },
      { limit: Math.max(100, agentsLimit), resourceType: QuotaResourceType.STORAGE_GB },
      { limit: Math.max(10_000, workflowsLimit * 40), resourceType: QuotaResourceType.WORKFLOW_RUNS }
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
  const seededPlans = await seedPlans();

  for (const tenant of tenants) {
    await createTenant(tenant, seededPlans);
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
