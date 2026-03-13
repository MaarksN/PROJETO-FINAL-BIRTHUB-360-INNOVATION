import type { ApiConfig } from "@birthub/config";
import { Prisma, Role, SubscriptionStatus, prisma } from "@birthub/database";

import { ProblemDetailsError } from "../../lib/problem-details.js";
import {
  isPlanFeatureEnabled,
  readNumericPlanLimit,
  type PlanFeature
} from "./plan.utils.js";
import { createStripeClient } from "./stripe.client.js";

type DatabaseClient = Prisma.TransactionClient | typeof prisma;

const DEFAULT_PLANS: Record<
  string,
  {
    description: string;
    limits: Record<string, unknown>;
    monthlyPriceCents: number;
    name: string;
    stripePriceId: string;
    stripeProductId: string;
    yearlyPriceCents: number;
  }
> = {
  enterprise: {
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
  },
  professional: {
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
  starter: {
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
  }
};

function resolveGracePeriodEndsAt(
  subscription:
    | {
        gracePeriodEndsAt: Date | null;
        updatedAt: Date;
      }
    | null
    | undefined,
  gracePeriodDays: number
): Date | null {
  if (!subscription) {
    return null;
  }

  if (subscription.gracePeriodEndsAt) {
    return subscription.gracePeriodEndsAt;
  }

  return new Date(subscription.updatedAt.getTime() + gracePeriodDays * 24 * 60 * 60 * 1000);
}

async function findOrganizationByReference(
  organizationReference: string,
  client: DatabaseClient = prisma
) {
  return client.organization.findFirst({
    where: {
      OR: [{ id: organizationReference }, { tenantId: organizationReference }]
    }
  });
}

export async function ensurePlanByCode(code: string, client: DatabaseClient = prisma) {
  const normalized = code.trim().toLowerCase();
  const plan = await client.plan.findUnique({
    where: {
      code: normalized
    }
  });

  if (plan) {
    return plan;
  }

  const defaults = DEFAULT_PLANS[normalized] ?? DEFAULT_PLANS.starter;

  return client.plan.create({
    data: {
      code: normalized,
      description: defaults.description,
      limits: defaults.limits as Prisma.InputJsonValue,
      monthlyPriceCents: defaults.monthlyPriceCents,
      name: defaults.name,
      stripePriceId: defaults.stripePriceId,
      stripeProductId: defaults.stripeProductId,
      yearlyPriceCents: defaults.yearlyPriceCents
    }
  });
}

export interface BillingSnapshot {
  currentPeriodEnd: Date | null;
  gracePeriodEndsAt: Date | null;
  hardLocked: boolean;
  isPaid: boolean;
  isWithinGracePeriod: boolean;
  organizationId: string;
  plan: {
    code: string;
    id: string;
    limits: Prisma.JsonValue;
    name: string;
  };
  secondsUntilHardLock: number | null;
  status: SubscriptionStatus | null;
  stripeCustomerId: string | null;
  subscriptionId: string | null;
  tenantId: string;
}

export async function getBillingSnapshot(
  organizationReference: string,
  gracePeriodDays: number
): Promise<BillingSnapshot> {
  const organization = await prisma.organization.findFirst({
    include: {
      plan: true,
      subscriptions: {
        include: {
          plan: true
        },
        orderBy: {
          updatedAt: "desc"
        },
        take: 1
      }
    },
    where: {
      OR: [{ id: organizationReference }, { tenantId: organizationReference }]
    }
  });

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found for billing context.",
      status: 404,
      title: "Not Found"
    });
  }

  const subscription = organization.subscriptions[0] ?? null;
  const plan = subscription?.plan ?? organization.plan ?? (await ensurePlanByCode("starter"));
  const gracePeriodEndsAt = resolveGracePeriodEndsAt(subscription, gracePeriodDays);
  const isPastDue = subscription?.status === SubscriptionStatus.past_due;
  const hardLocked = Boolean(
    isPastDue && gracePeriodEndsAt && gracePeriodEndsAt.getTime() <= Date.now()
  );
  const secondsUntilHardLock =
    isPastDue && gracePeriodEndsAt
      ? Math.max(0, Math.floor((gracePeriodEndsAt.getTime() - Date.now()) / 1000))
      : null;

  return {
    currentPeriodEnd: subscription?.currentPeriodEnd ?? null,
    gracePeriodEndsAt,
    hardLocked,
    isPaid:
      subscription?.status === SubscriptionStatus.active ||
      subscription?.status === SubscriptionStatus.past_due ||
      subscription?.status === SubscriptionStatus.paused,
    isWithinGracePeriod: Boolean(isPastDue && gracePeriodEndsAt && !hardLocked),
    organizationId: organization.id,
    plan: {
      code: plan.code,
      id: plan.id,
      limits: plan.limits,
      name: plan.name
    },
    secondsUntilHardLock,
    status: subscription?.status ?? null,
    stripeCustomerId: organization.stripeCustomerId,
    subscriptionId: subscription?.id ?? null,
    tenantId: organization.tenantId
  };
}

export async function canUseFeature(
  organizationReference: string,
  feature: PlanFeature,
  gracePeriodDays: number
): Promise<{ allowed: boolean; snapshot: BillingSnapshot }> {
  const snapshot = await getBillingSnapshot(organizationReference, gracePeriodDays);
  const featureEnabled = isPlanFeatureEnabled(snapshot.plan.limits, feature);

  return {
    allowed: featureEnabled && !snapshot.hardLocked,
    snapshot
  };
}

export async function getAgentLimitForOrganization(
  organizationReference: string
): Promise<number> {
  const snapshot = await getBillingSnapshot(organizationReference, 3);
  return readNumericPlanLimit(snapshot.plan.limits, "agents", 5);
}

export async function provisionStripeCustomerForOrganization(input: {
  client?: DatabaseClient;
  config: ApiConfig;
  email: string;
  name: string;
  organizationReference: string;
}): Promise<string> {
  const client = input.client ?? prisma;
  const organization = await findOrganizationByReference(input.organizationReference, client);

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found when provisioning Stripe customer.",
      status: 404,
      title: "Not Found"
    });
  }

  if (organization.stripeCustomerId) {
    return organization.stripeCustomerId;
  }

  const stripe = createStripeClient(input.config);
  const customer = await stripe.customers.create({
    email: input.email,
    metadata: {
      organizationId: organization.id,
      tenantId: organization.tenantId
    },
    name: input.name
  });

  await client.organization.update({
    data: {
      stripeCustomerId: customer.id
    },
    where: {
      id: organization.id
    }
  });

  await client.subscription.updateMany({
    data: {
      stripeCustomerId: customer.id
    },
    where: {
      organizationId: organization.id
    }
  });

  return customer.id;
}

async function resolveCustomerForCheckout(input: {
  config: ApiConfig;
  organizationId: string;
}): Promise<string> {
  const organization = await prisma.organization.findUnique({
    include: {
      memberships: {
        include: {
          user: true
        },
        orderBy: {
          createdAt: "asc"
        },
        take: 1,
        where: {
          role: Role.OWNER
        }
      }
    },
    where: {
      id: input.organizationId
    }
  });

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found for checkout.",
      status: 404,
      title: "Not Found"
    });
  }

  if (organization.stripeCustomerId) {
    return organization.stripeCustomerId;
  }

  const owner = organization.memberships[0]?.user;
  const email = owner?.email ?? `billing+${organization.tenantId}@birthub.local`;
  const name = owner?.name ?? organization.name;

  return provisionStripeCustomerForOrganization({
    config: input.config,
    email,
    name,
    organizationId: organization.id
  });
}

export async function createCheckoutSessionForOrganization(input: {
  config: ApiConfig;
  organizationReference: string;
  planId: string;
}) {
  const plan = await prisma.plan.findUnique({
    where: {
      id: input.planId
    }
  });

  if (!plan || !plan.active) {
    throw new ProblemDetailsError({
      detail: "Requested plan is not available.",
      status: 404,
      title: "Not Found"
    });
  }

  if (!plan.stripePriceId) {
    throw new ProblemDetailsError({
      detail: "Requested plan is missing Stripe price mapping.",
      status: 409,
      title: "Conflict"
    });
  }

  const stripe = createStripeClient(input.config);
  const customerId = await resolveCustomerForCheckout({
    config: input.config,
    organizationReference: input.organizationReference
  });
  const session = await stripe.checkout.sessions.create({
    cancel_url: input.config.STRIPE_CANCEL_URL,
    customer: customerId,
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1
      }
    ],
    metadata: {
      organizationId: input.organizationReference,
      planId: plan.id
    },
    mode: "subscription",
    success_url: `${input.config.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`
  });

  if (!session.url) {
    throw new ProblemDetailsError({
      detail: "Stripe did not return a checkout URL.",
      status: 502,
      title: "Bad Gateway"
    });
  }

  return {
    id: session.id,
    url: session.url
  };
}

export async function createCustomerPortalSessionForOrganization(input: {
  config: ApiConfig;
  organizationReference: string;
}): Promise<{ url: string }> {
  const organization = await findOrganizationByReference(input.organizationReference);

  if (!organization?.stripeCustomerId) {
    throw new ProblemDetailsError({
      detail: "Stripe customer is not configured for this organization.",
      status: 409,
      title: "Conflict"
    });
  }

  const stripe = createStripeClient(input.config);
  const portal = await stripe.billingPortal.sessions.create({
    customer: organization.stripeCustomerId,
    return_url: input.config.STRIPE_PORTAL_RETURN_URL
  });

  return {
    url: portal.url
  };
}

export async function listActivePlans() {
  return prisma.plan.findMany({
    orderBy: {
      monthlyPriceCents: "asc"
    },
    where: {
      active: true
    }
  });
}

export async function listInvoicesForOrganization(input: {
  cursor?: string;
  organizationReference: string;
  take: number;
}) {
  const organization = await findOrganizationByReference(input.organizationReference);

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found while listing invoices.",
      status: 404,
      title: "Not Found"
    });
  }

  const rows = await prisma.invoice.findMany({
    cursor: input.cursor
      ? {
          id: input.cursor
        }
      : undefined,
    orderBy: {
      createdAt: "desc"
    },
    skip: input.cursor ? 1 : 0,
    take: input.take + 1,
    where: {
      organizationId: organization.id
    }
  });

  return {
    items: rows.slice(0, input.take),
    nextCursor: rows.length > input.take ? rows[input.take - 1]?.id ?? null : null
  };
}

export async function listUsageForOrganization(organizationReference: string) {
  const organization = await findOrganizationByReference(organizationReference);

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found while listing usage.",
      status: 404,
      title: "Not Found"
    });
  }

  const usageRows = await prisma.usageRecord.findMany({
    orderBy: {
      occurredAt: "desc"
    },
    take: 300,
    where: {
      organizationId: organization.id
    }
  });
  const byMetric = new Map<string, number>();

  for (const row of usageRows) {
    byMetric.set(row.metric, (byMetric.get(row.metric) ?? 0) + row.quantity);
  }

  return {
    byMetric: Array.from(byMetric.entries()).map(([metric, quantity]) => ({
      metric,
      quantity
    })),
    items: usageRows
  };
}
