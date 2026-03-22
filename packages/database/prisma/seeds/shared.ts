import { createHash } from "node:crypto";

import {
  AgentStatus,
  InvoiceStatus,
  InviteStatus,
  MembershipStatus,
  NotificationType,
  Prisma,
  PrismaClient,
  QuotaResourceType,
  Role,
  SessionStatus,
  SubscriptionStatus,
  WorkflowStatus,
  WorkflowStepType,
  WorkflowTransitionRoute,
  WorkflowTriggerType
} from "@prisma/client";

export type SeedPlan = {
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

export type TenantSeed = {
  agents: string[];
  members: Array<{ email: string; name: string; role: Role }>;
  name: string;
  planCode: string;
  slug: string;
};

type PlanMap = Map<string, { id: string; limits: Record<string, unknown> }>;

type WorkflowSeed = {
  description: string;
  name: string;
  steps: Array<{
    config: Record<string, unknown>;
    isTrigger?: boolean;
    key: string;
    name: string;
    type: WorkflowStepType;
  }>;
  transitions: Array<{
    route: WorkflowTransitionRoute;
    sourceKey: string;
    targetKey: string;
  }>;
  triggerConfig: Record<string, unknown>;
  triggerType: WorkflowTriggerType;
};

export const plans: SeedPlan[] = [
  {
    code: "starter",
    currency: "usd",
    description: "Plano de entrada para times pequenos.",
    limits: {
      agents: 5,
      aiPrompts: 5_000,
      apiRequests: 5_000,
      emails: 2_500,
      features: {
        agents: true,
        customerPortal: true,
        workflows: true
      },
      monthlyTokens: 250_000,
      storageGb: 100,
      workflows: 30
    },
    monthlyPriceCents: 4900,
    name: "Starter",
    stripePriceId: "price_starter_monthly",
    stripeProductId: "prod_starter",
    yearlyPriceCents: 47040
  },
  {
    code: "pro",
    currency: "usd",
    description: "Plano para operacoes com automacoes avancadas.",
    limits: {
      agents: 25,
      aiPrompts: 25_000,
      apiRequests: 25_000,
      emails: 10_000,
      features: {
        advancedAnalytics: true,
        agents: true,
        customerPortal: true,
        workflows: true
      },
      monthlyTokens: 2_500_000,
      storageGb: 500,
      workflows: 250
    },
    monthlyPriceCents: 14900,
    name: "Pro",
    stripePriceId: "price_pro_monthly",
    stripeProductId: "prod_pro",
    yearlyPriceCents: 143040
  },
  {
    code: "enterprise",
    currency: "usd",
    description: "Plano enterprise com limites expandidos.",
    limits: {
      agents: -1,
      aiPrompts: -1,
      apiRequests: -1,
      emails: -1,
      features: {
        advancedAnalytics: true,
        agents: true,
        customerPortal: true,
        prioritySupport: true,
        workflows: true
      },
      monthlyTokens: -1,
      storageGb: -1,
      workflows: -1
    },
    monthlyPriceCents: 49900,
    name: "Enterprise",
    stripePriceId: "price_enterprise_monthly",
    stripeProductId: "prod_enterprise",
    yearlyPriceCents: 479040
  }
];

export const developmentTenants: TenantSeed[] = [
  {
    agents: ["Alpha Concierge", "Alpha Revenue Scout", "Alpha Retention Radar"],
    members: [
      { email: "owner.alpha@birthub.local", name: "Alpha Owner", role: Role.OWNER },
      { email: "admin.alpha@birthub.local", name: "Alpha Admin", role: Role.ADMIN },
      { email: "member.alpha@birthub.local", name: "Alpha Member", role: Role.MEMBER }
    ],
    name: "BirthHub Alpha",
    planCode: "pro",
    slug: "birthhub-alpha"
  },
  {
    agents: ["Beta Concierge", "Beta Revenue Scout", "Beta Retention Radar"],
    members: [
      { email: "owner.beta@birthub.local", name: "Beta Owner", role: Role.OWNER },
      { email: "admin.beta@birthub.local", name: "Beta Admin", role: Role.ADMIN },
      { email: "member.beta@birthub.local", name: "Beta Member", role: Role.MEMBER }
    ],
    name: "BirthHub Beta",
    planCode: "starter",
    slug: "birthhub-beta"
  }
];

export const smokeTenants: TenantSeed[] = [
  {
    agents: ["Smoke Concierge"],
    members: [
      { email: "owner.smoke@birthub.local", name: "Smoke Owner", role: Role.OWNER },
      { email: "member.smoke@birthub.local", name: "Smoke Member", role: Role.MEMBER }
    ],
    name: "BirthHub Smoke",
    planCode: "starter",
    slug: "birthhub-smoke"
  }
];

function asJson(value: Record<string, unknown>): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function passwordHash(seed: string): string {
  return createHash("sha256").update(seed).digest("hex");
}

function anonymizeLabel(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 8).toUpperCase();
}

export function buildStagingTenants(): TenantSeed[] {
  return developmentTenants.map((tenant) => ({
    ...tenant,
    members: tenant.members.map((member, index) => ({
      ...member,
      email: `anon.${anonymizeLabel(member.email).toLowerCase()}@staging.birthub.local`,
      name: `Anon User ${index + 1}`
    })),
    name: `Tenant ${anonymizeLabel(tenant.name)}`,
    slug: `staging-${anonymizeLabel(tenant.slug).toLowerCase()}`
  }));
}

export async function seedPlanCatalog(prisma: PrismaClient): Promise<PlanMap> {
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

export async function ensureOrganization(
  prisma: PrismaClient,
  tenant: TenantSeed,
  planMap: PlanMap
) {
  const selectedPlan = planMap.get(tenant.planCode);

  if (!selectedPlan) {
    throw new Error(`Plan '${tenant.planCode}' was not seeded.`);
  }

  return prisma.organization.upsert({
    create: {
      name: tenant.name,
      planId: selectedPlan.id,
      settings: {
        locale: "pt-BR",
        timezone: "America/Sao_Paulo"
      },
      slug: tenant.slug,
      stripeCustomerId: `cus_${tenant.slug.replace(/-/g, "_")}`
    },
    update: {
      name: tenant.name,
      planId: selectedPlan.id,
      settings: {
        locale: "pt-BR",
        timezone: "America/Sao_Paulo"
      }
    },
    where: {
      slug: tenant.slug
    }
  });
}

export async function ensureUsers(prisma: PrismaClient, tenant: TenantSeed, organizationId: string, tenantId: string) {
  const users = [] as Array<{ id: string; email: string }>;

  for (const [index, member] of tenant.members.entries()) {
    const user = await prisma.user.upsert({
      create: {
        email: member.email,
        name: member.name,
        passwordHash: passwordHash(member.email)
      },
      update: {
        name: member.name,
        passwordHash: passwordHash(member.email)
      },
      where: {
        email: member.email
      }
    });

    await prisma.membership.upsert({
      create: {
        organizationId,
        role: member.role,
        status: MembershipStatus.ACTIVE,
        tenantId,
        userId: user.id
      },
      update: {
        role: member.role,
        status: MembershipStatus.ACTIVE,
        tenantId
      },
      where: {
        organizationId_userId: {
          organizationId,
          userId: user.id
        }
      }
    });

    await prisma.session.upsert({
      create: {
        csrfToken: `${tenant.slug}-${index + 1}-csrf`,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        organizationId,
        refreshExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        refreshTokenHash: passwordHash(`${tenant.slug}-${index + 1}-refresh`),
        status: SessionStatus.ACTIVE,
        tenantId,
        token: `${tenant.slug}-${index + 1}-session`,
        userId: user.id
      },
      update: {
        csrfToken: `${tenant.slug}-${index + 1}-csrf`,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        organizationId,
        refreshExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
        refreshTokenHash: passwordHash(`${tenant.slug}-${index + 1}-refresh`),
        status: SessionStatus.ACTIVE,
        tenantId,
        userId: user.id
      },
      where: {
        token: `${tenant.slug}-${index + 1}-session`
      }
    });

    await prisma.userPreference.upsert({
      create: {
        organizationId,
        tenantId,
        userId: user.id
      },
      update: {
        tenantId,
        updatedAt: new Date()
      },
      where: {
        organizationId_userId: {
          organizationId,
          userId: user.id
        }
      }
    });

    users.push({ id: user.id, email: user.email });
  }

  await prisma.invite.upsert({
    create: {
      email: `invite.${tenant.slug}@birthub.local`,
      expiresAt: new Date("2026-12-31T00:00:00.000Z"),
      invitedByUserId: users[0]?.id ?? null,
      organizationId,
      role: Role.MEMBER,
      status: InviteStatus.PENDING,
      tenantId,
      token: `${tenant.slug}-invite-token`
    },
    update: {
      invitedByUserId: users[0]?.id ?? null,
      organizationId,
      status: InviteStatus.PENDING,
      tenantId
    },
    where: {
      token: `${tenant.slug}-invite-token`
    }
  });

  return users;
}

export async function ensureAgents(prisma: PrismaClient, tenant: TenantSeed, organizationId: string, tenantId: string) {
  for (const [index, agentName] of tenant.agents.entries()) {
    await prisma.agent.upsert({
      create: {
        config: {
          channel: index === 0 ? "concierge" : index === 1 ? "growth" : "retention"
        },
        name: agentName,
        organizationId,
        status: AgentStatus.ACTIVE,
        tenantId
      },
      update: {
        config: {
          channel: index === 0 ? "concierge" : index === 1 ? "growth" : "retention"
        },
        organizationId,
        status: AgentStatus.ACTIVE
      },
      where: {
        tenantId_name: {
          name: agentName,
          tenantId
        }
      }
    });
  }
}

function buildWorkflowSeeds(tenantId: string): WorkflowSeed[] {
  return [
    {
      description: "Fluxo de onboarding com webhook e follow-up.",
      name: "Onboarding Workflow",
      steps: [
        {
          config: {
            expects: "user_created"
          },
          isTrigger: true,
          key: "trigger_webhook",
          name: "Webhook Trigger",
          type: WorkflowStepType.TRIGGER_WEBHOOK
        },
        {
          config: {
            channel: "email",
            message: "Bem-vindo(a) ao BirthHub 360!",
            to: "{{ trigger.output.email }}"
          },
          key: "send_welcome_email",
          name: "Send Welcome Email",
          type: WorkflowStepType.SEND_NOTIFICATION
        },
        {
          config: {
            duration_ms: 86_400_000
          },
          key: "wait_24h",
          name: "Wait 24h",
          type: WorkflowStepType.DELAY
        }
      ],
      transitions: [
        {
          route: WorkflowTransitionRoute.ALWAYS,
          sourceKey: "trigger_webhook",
          targetKey: "send_welcome_email"
        },
        {
          route: WorkflowTransitionRoute.ALWAYS,
          sourceKey: "send_welcome_email",
          targetKey: "wait_24h"
        }
      ],
      triggerConfig: {
        method: "POST",
        path: `/webhooks/trigger/${tenantId}/onboarding`
      },
      triggerType: WorkflowTriggerType.WEBHOOK
    },
    {
      description: "Fluxo diario de alerta operacional.",
      name: "Alert Workflow",
      steps: [
        {
          config: {
            cron: "0 8 * * *"
          },
          isTrigger: true,
          key: "trigger_cron",
          name: "Daily Trigger",
          type: WorkflowStepType.TRIGGER_CRON
        },
        {
          config: {
            method: "GET",
            timeout_ms: 2_500,
            url: "https://example.local/internal/health-summary"
          },
          key: "fetch_health",
          name: "Fetch Health Summary",
          type: WorkflowStepType.HTTP_REQUEST
        }
      ],
      transitions: [
        {
          route: WorkflowTransitionRoute.ALWAYS,
          sourceKey: "trigger_cron",
          targetKey: "fetch_health"
        }
      ],
      triggerConfig: {
        cron: "0 8 * * *",
        timezone: "America/Sao_Paulo"
      },
      triggerType: WorkflowTriggerType.CRON
    }
  ];
}

export async function ensureWorkflows(prisma: PrismaClient, organizationId: string, tenantId: string) {
  for (const workflowSeed of buildWorkflowSeeds(tenantId)) {
    const workflow = await prisma.workflow.upsert({
      create: {
        definition: {
          nodes: workflowSeed.steps,
          transitions: workflowSeed.transitions
        } as Prisma.InputJsonValue,
        description: workflowSeed.description,
        name: workflowSeed.name,
        organizationId,
        publishedAt: new Date(),
        status: WorkflowStatus.PUBLISHED,
        tenantId,
        triggerConfig: asJson(workflowSeed.triggerConfig),
        triggerType: workflowSeed.triggerType
      },
      update: {
        definition: {
          nodes: workflowSeed.steps,
          transitions: workflowSeed.transitions
        } as Prisma.InputJsonValue,
        description: workflowSeed.description,
        organizationId,
        publishedAt: new Date(),
        status: WorkflowStatus.PUBLISHED,
        triggerConfig: asJson(workflowSeed.triggerConfig),
        triggerType: workflowSeed.triggerType
      },
      where: {
        tenantId_name: {
          name: workflowSeed.name,
          tenantId
        }
      }
    });

    await prisma.stepResult.deleteMany({ where: { workflowId: workflow.id } });
    await prisma.workflowTransition.deleteMany({ where: { workflowId: workflow.id } });
    await prisma.workflowStep.deleteMany({ where: { workflowId: workflow.id } });

    const stepIds = new Map<string, string>();

    for (const step of workflowSeed.steps) {
      const createdStep = await prisma.workflowStep.create({
        data: {
          config: asJson(step.config),
          isTrigger: step.isTrigger ?? false,
          key: step.key,
          name: step.name,
          organizationId,
          tenantId,
          type: step.type,
          workflowId: workflow.id
        }
      });
      stepIds.set(step.key, createdStep.id);
    }

    for (const transition of workflowSeed.transitions) {
      await prisma.workflowTransition.create({
        data: {
          organizationId,
          route: transition.route,
          sourceStepId: stepIds.get(transition.sourceKey)!,
          targetStepId: stepIds.get(transition.targetKey)!,
          tenantId,
          workflowId: workflow.id
        }
      });
    }
  }
}

export async function ensureBilling(
  prisma: PrismaClient,
  tenant: TenantSeed,
  organizationId: string,
  tenantId: string,
  planMap: PlanMap
) {
  const selectedPlan = planMap.get(tenant.planCode);

  if (!selectedPlan) {
    throw new Error(`Plan '${tenant.planCode}' was not seeded.`);
  }

  for (const [index, status] of ["active", "active", "at-risk"].entries()) {
    await prisma.customer.upsert({
      create: {
        email: `customer.${index + 1}.${tenant.slug}@birthub.local`,
        metadata: {
          source: "seed",
          tier: index === 0 ? "new" : index === 1 ? "growth" : "renewal"
        },
        name: `${tenant.name} Customer ${index + 1}`,
        organizationId,
        status,
        tenantId
      },
      update: {
        metadata: {
          source: "seed",
          tier: index === 0 ? "new" : index === 1 ? "growth" : "renewal"
        },
        name: `${tenant.name} Customer ${index + 1}`,
        organizationId,
        status
      },
      where: {
        tenantId_email: {
          email: `customer.${index + 1}.${tenant.slug}@birthub.local`,
          tenantId
        }
      }
    });
  }

  const subscription = await prisma.subscription.upsert({
    create: {
      currentPeriodEnd: new Date("2026-12-31T00:00:00.000Z"),
      organizationId,
      planId: selectedPlan.id,
      status: SubscriptionStatus.active,
      stripeCustomerId: `cus_${tenant.slug.replace(/-/g, "_")}`,
      stripeSubscriptionId: `sub_${tenant.slug.replace(/-/g, "_")}`,
      tenantId
    },
    update: {
      currentPeriodEnd: new Date("2026-12-31T00:00:00.000Z"),
      planId: selectedPlan.id,
      status: SubscriptionStatus.active,
      stripeCustomerId: `cus_${tenant.slug.replace(/-/g, "_")}`,
      tenantId
    },
    where: {
      organizationId
    }
  });

  await prisma.paymentMethod.upsert({
    create: {
      brand: "visa",
      expMonth: 12,
      expYear: 2030,
      isDefault: true,
      last4: "4242",
      organizationId,
      stripePaymentMethodId: `pm_${tenant.slug.replace(/-/g, "_")}`,
      tenantId
    },
    update: {
      brand: "visa",
      expMonth: 12,
      expYear: 2030,
      isDefault: true,
      last4: "4242",
      organizationId,
      tenantId
    },
    where: {
      stripePaymentMethodId: `pm_${tenant.slug.replace(/-/g, "_")}`
    }
  });

  await prisma.invoice.upsert({
    create: {
      amountDueCents: tenant.planCode === "enterprise" ? 0 : 14900,
      amountPaidCents: tenant.planCode === "enterprise" ? 0 : 14900,
      currency: "usd",
      hostedInvoiceUrl: `https://billing.stripe.com/invoice/${tenant.slug}/latest`,
      invoicePdfUrl: `https://pay.stripe.com/invoice/${tenant.slug}/latest.pdf`,
      organizationId,
      periodEnd: new Date("2026-12-31T23:59:59.000Z"),
      periodStart: new Date("2026-12-01T00:00:00.000Z"),
      status: InvoiceStatus.paid,
      stripeInvoiceId: `in_${tenant.slug.replace(/-/g, "_")}_001`,
      subscriptionId: subscription.id,
      tenantId
    },
    update: {
      amountDueCents: tenant.planCode === "enterprise" ? 0 : 14900,
      amountPaidCents: tenant.planCode === "enterprise" ? 0 : 14900,
      organizationId,
      status: InvoiceStatus.paid,
      subscriptionId: subscription.id,
      tenantId
    },
    where: {
      stripeInvoiceId: `in_${tenant.slug.replace(/-/g, "_")}_001`
    }
  });

  for (const [index, usage] of [
    { metric: "tokens.input", quantity: 122_000 },
    { metric: "tokens.output", quantity: 88_400 },
    { metric: "workflow.runs", quantity: 46 }
  ].entries()) {
    await prisma.usageRecord.upsert({
      create: {
        eventId: `${tenant.slug}-usage-${index + 1}`,
        metric: usage.metric,
        metadata: {
          source: "seed"
        },
        organizationId,
        quantity: usage.quantity,
        subscriptionId: subscription.id,
        tenantId
      },
      update: {
        metric: usage.metric,
        metadata: {
          source: "seed"
        },
        organizationId,
        quantity: usage.quantity,
        subscriptionId: subscription.id,
        tenantId
      },
      where: {
        eventId: `${tenant.slug}-usage-${index + 1}`
      }
    });
  }

  await prisma.billingEvent.upsert({
    create: {
      organizationId,
      payload: {
        seeded: true,
        tenant: tenant.slug
      },
      stripeEventId: `evt_${tenant.slug.replace(/-/g, "_")}_bootstrap`,
      tenantId,
      type: "seed.subscription.created"
    },
    update: {
      organizationId,
      payload: {
        seeded: true,
        tenant: tenant.slug
      },
      tenantId,
      type: "seed.subscription.created"
    },
    where: {
      stripeEventId: `evt_${tenant.slug.replace(/-/g, "_")}_bootstrap`
    }
  });

  for (const [index, quota] of [
    { count: 120, limit: 5_000, resourceType: QuotaResourceType.API_REQUESTS },
    { count: 60, limit: 2_500, resourceType: QuotaResourceType.AI_PROMPTS },
    { count: 80, limit: 4_000, resourceType: QuotaResourceType.EMAILS_SENT },
    { count: 12, limit: 100, resourceType: QuotaResourceType.STORAGE_GB },
    { count: 40, limit: 500, resourceType: QuotaResourceType.WORKFLOW_RUNS }
  ].entries()) {
    await prisma.quotaUsage.upsert({
      create: {
        count: quota.count,
        limit: quota.limit,
        period: "MONTHLY-2026-12",
        resetAt: new Date("2027-01-01T00:00:00.000Z"),
        resourceType: quota.resourceType,
        tenantId
      },
      update: {
        count: quota.count + index,
        limit: quota.limit,
        resetAt: new Date("2027-01-01T00:00:00.000Z")
      },
      where: {
        tenantId_resourceType_period: {
          period: "MONTHLY-2026-12",
          resourceType: quota.resourceType,
          tenantId
        }
      }
    });
  }
}

export async function ensureSupportArtifacts(
  prisma: PrismaClient,
  tenant: TenantSeed,
  organizationId: string,
  tenantId: string,
  ownerUserId?: string
) {
  await prisma.jobSigningSecret.upsert({
    create: {
      organizationId,
      secret: passwordHash(`${tenantId}-job-secret`),
      tenantId
    },
    update: {
      organizationId,
      secret: passwordHash(`${tenantId}-job-secret`)
    },
    where: {
      tenantId
    }
  });

  if (ownerUserId) {
    const existingAudit = await prisma.auditLog.findFirst({
      where: {
        action: "seed.bootstrap",
        entityId: organizationId,
        tenantId
      }
    });

    if (!existingAudit) {
      await prisma.auditLog.create({
        data: {
          action: "seed.bootstrap",
          actorId: ownerUserId,
          diff: {
            seeded: true
          },
          entityId: organizationId,
          entityType: "organization",
          tenantId,
          userAgent: "seed-script/2.0"
        }
      });
    }

    const existingNotification = await prisma.notification.findFirst({
      where: {
        content: `Seed bootstrap completed for ${tenant.slug}`,
        tenantId,
        userId: ownerUserId
      }
    });

    if (!existingNotification) {
      await prisma.notification.create({
        data: {
          content: `Seed bootstrap completed for ${tenant.slug}`,
          organizationId,
          tenantId,
          type: NotificationType.SUCCESS,
          userId: ownerUserId
        }
      });
    }
  }
}
