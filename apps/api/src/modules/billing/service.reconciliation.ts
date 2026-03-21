import type { ApiConfig } from "@birthub/config";
import { createLogger } from "@birthub/logger";
import {
  BillingCreditReason,
  Prisma,
  SubscriptionStatus,
  type InvoiceStatus,
  prisma
} from "@birthub/database";
import Stripe from "stripe";

import { ProblemDetailsError } from "../../lib/problem-details.js";
import {
  ensurePlanByCode,
  type DatabaseClient,
  type StripeBillingEventContext
} from "./service.shared.js";

const logger = createLogger("billing-service");

function unixToDate(value: number | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  return new Date(value * 1000);
}

function mapStripeSubscriptionStatus(
  status: Stripe.Subscription.Status
): SubscriptionStatus {
  switch (status) {
    case "active":
      return SubscriptionStatus.active;
    case "canceled":
      return SubscriptionStatus.canceled;
    case "past_due":
    case "incomplete":
    case "incomplete_expired":
    case "unpaid":
      return SubscriptionStatus.past_due;
    case "paused":
      return SubscriptionStatus.paused;
    case "trialing":
      return SubscriptionStatus.trial;
    default:
      return SubscriptionStatus.trial;
  }
}

async function resolveOrganizationByStripeCustomer(
  customerId: string,
  db: DatabaseClient = prisma
) {
  return db.organization.findFirst({
    where: {
      stripeCustomerId: customerId
    }
  });
}

function resolveInvoiceStatus(
  candidate: Stripe.Invoice.Status | null | undefined,
  fallback: InvoiceStatus
): InvoiceStatus {
  switch (candidate) {
    case "draft":
      return "draft";
    case "open":
      return "open";
    case "paid":
      return "paid";
    case "void":
      return "void";
    case "uncollectible":
      return "uncollectible";
    default:
      return fallback;
  }
}

function resolveInvoicePeriods(invoice: Stripe.Invoice): {
  periodEnd: Date | null;
  periodStart: Date | null;
} {
  const line = invoice.lines.data[0];
  return {
    periodEnd: unixToDate(line?.period?.end),
    periodStart: unixToDate(line?.period?.start)
  };
}

function resolveInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const subscription = invoice.parent?.subscription_details?.subscription ?? null;

  if (typeof subscription === "string") {
    return subscription;
  }

  return subscription?.id ?? null;
}

function resolveSubscriptionPeriodEnd(subscription: Stripe.Subscription): Date | null {
  const periodEnds = subscription.items.data
    .map((item) => item.current_period_end)
    .filter((value): value is number => typeof value === "number");

  if (periodEnds.length === 0) {
    return unixToDate(
      subscription.trial_end ?? subscription.cancel_at ?? subscription.billing_cycle_anchor
    );
  }

  return unixToDate(Math.max(...periodEnds));
}

function resolveSubscriptionItemUnitAmount(
  item:
    | {
        plan?: {
          amount?: number | null;
        } | null;
        price?: {
          unit_amount?: number | null;
        } | null;
      }
    | null
    | undefined
): number | null {
  if (!item) {
    return null;
  }

  const fromPrice = item.price?.unit_amount;
  if (typeof fromPrice === "number") {
    return fromPrice;
  }

  const fromPlan = item.plan?.amount;
  return typeof fromPlan === "number" ? fromPlan : null;
}

function resolveProrationCreditCents(
  event: Stripe.Event,
  subscription: Stripe.Subscription
): number {
  const metadataCredit = Number(subscription.metadata?.proration_credit_cents ?? "");

  if (Number.isFinite(metadataCredit) && metadataCredit > 0) {
    return metadataCredit;
  }

  const dataObj = event.data as unknown;
  const isDataWithPreviousAttributes = (
    obj: unknown
  ): obj is {
    previous_attributes?: {
      items?: {
        data?: Array<{
          plan?: { amount?: number | null } | null;
          price?: { unit_amount?: number | null } | null;
        }>;
      };
    };
  } => {
    return typeof obj === "object" && obj !== null && "previous_attributes" in obj;
  };

  const previousAttributes = isDataWithPreviousAttributes(dataObj)
    ? dataObj.previous_attributes
    : undefined;
  const previousAmount = resolveSubscriptionItemUnitAmount(
    previousAttributes?.items?.data?.[0]
  );
  const currentAmount = resolveSubscriptionItemUnitAmount(subscription.items.data[0]);

  if (
    typeof previousAmount === "number" &&
    typeof currentAmount === "number" &&
    previousAmount > currentAmount
  ) {
    return previousAmount - currentAmount;
  }

  return 0;
}

async function createDowngradeProrationCredit(
  input: {
    amountCents: number;
    currency: string;
    organizationId: string;
    stripeEventId: string;
    stripeInvoiceId?: string | null;
    subscriptionId?: string | null;
    tenantId: string;
  },
  db: DatabaseClient = prisma
): Promise<void> {
  if (input.amountCents <= 0) {
    return;
  }

  try {
    const data: Prisma.BillingCreditUncheckedCreateInput = {
      amountCents: input.amountCents,
      currency: input.currency,
      metadata: {
        source: "customer.subscription.updated"
      },
      organizationId: input.organizationId,
      reason: BillingCreditReason.DOWNGRADE_PRORATION,
      stripeEventId: input.stripeEventId,
      tenantId: input.tenantId,
      ...(input.stripeInvoiceId ? { stripeInvoiceId: input.stripeInvoiceId } : {}),
      ...(input.subscriptionId ? { subscriptionId: input.subscriptionId } : {})
    };

    await db.billingCredit.create({
      data
    });

    logger.info(
      {
        amountCents: input.amountCents,
        event: "billing.credit.proration.created",
        organizationId: input.organizationId,
        stripeEventId: input.stripeEventId,
        subscriptionId: input.subscriptionId ?? null,
        tenantId: input.tenantId
      },
      "Created downgrade proration credit"
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      logger.warn(
        {
          event: "billing.credit.proration.duplicate",
          stripeEventId: input.stripeEventId
        },
        "Duplicate billing credit ignored"
      );
      return;
    }

    throw error;
  }
}

function buildInvoiceCreateData(input: {
  fallbackStatus: InvoiceStatus;
  invoice: Stripe.Invoice;
  organizationId: string;
  subscriptionId: string;
  tenantId: string;
}): Prisma.InvoiceUncheckedCreateInput {
  const periods = resolveInvoicePeriods(input.invoice);

  return {
    amountDueCents: input.invoice.amount_due,
    amountPaidCents: input.invoice.amount_paid,
    currency: input.invoice.currency,
    dueDate: unixToDate(input.invoice.due_date),
    hostedInvoiceUrl: input.invoice.hosted_invoice_url ?? null,
    invoicePdfUrl: input.invoice.invoice_pdf ?? null,
    organizationId: input.organizationId,
    periodEnd: periods.periodEnd,
    periodStart: periods.periodStart,
    status: resolveInvoiceStatus(input.invoice.status, input.fallbackStatus),
    stripeInvoiceId: input.invoice.id,
    subscriptionId: input.subscriptionId,
    tenantId: input.tenantId
  };
}

function buildInvoiceUpdateData(
  invoice: Stripe.Invoice,
  fallbackStatus: InvoiceStatus
): Prisma.InvoiceUncheckedUpdateInput {
  const periods = resolveInvoicePeriods(invoice);

  return {
    amountDueCents: invoice.amount_due,
    amountPaidCents: invoice.amount_paid,
    dueDate: unixToDate(invoice.due_date),
    hostedInvoiceUrl: invoice.hosted_invoice_url ?? null,
    invoicePdfUrl: invoice.invoice_pdf ?? null,
    periodEnd: periods.periodEnd,
    periodStart: periods.periodStart,
    status: resolveInvoiceStatus(invoice.status, fallbackStatus)
  };
}

async function ensureSubscriptionForOrganization(
  input: {
    currentPeriodEnd?: Date | null;
    organizationId: string;
    planId: string;
    stripeCustomerId: string;
    stripeSubscriptionId?: string | null;
  },
  db: DatabaseClient = prisma
): Promise<{
  id: string;
  status: SubscriptionStatus;
  tenantId: string;
}> {
  const organization = await db.organization.findUnique({
    where: {
      id: input.organizationId
    }
  });

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found while syncing subscription.",
      status: 404,
      title: "Not Found"
    });
  }

  const createData: Prisma.SubscriptionUncheckedCreateInput = {
    currentPeriodEnd: input.currentPeriodEnd ?? null,
    organizationId: organization.id,
    planId: input.planId,
    status: SubscriptionStatus.active,
    stripeCustomerId: input.stripeCustomerId,
    stripeSubscriptionId: input.stripeSubscriptionId ?? null,
    tenantId: organization.tenantId
  };
  const updateData: Prisma.SubscriptionUncheckedUpdateInput = {
    planId: input.planId,
    status: SubscriptionStatus.active,
    stripeCustomerId: input.stripeCustomerId,
    ...(input.currentPeriodEnd !== undefined
      ? { currentPeriodEnd: input.currentPeriodEnd }
      : {}),
    ...(input.stripeSubscriptionId !== undefined
      ? { stripeSubscriptionId: input.stripeSubscriptionId }
      : {})
  };

  return db.subscription.upsert({
    create: createData,
    update: updateData,
    where: {
      organizationId: organization.id
    }
  });
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  db: DatabaseClient
): Promise<Required<StripeBillingEventContext>> {
  const customerId = typeof session.customer === "string" ? session.customer : null;
  const metadataOrganizationId = session.metadata?.organizationId;
  let organization = metadataOrganizationId
    ? await db.organization.findUnique({
        where: {
          id: metadataOrganizationId
        }
      })
    : null;

  if (!organization && customerId) {
    organization = await resolveOrganizationByStripeCustomer(customerId, db);
  }

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found for checkout.session.completed event.",
      status: 404,
      title: "Not Found"
    });
  }

  const requestedPlanId = session.metadata?.planId;
  const fallbackPlan = await ensurePlanByCode("starter", db);
  const plan = requestedPlanId
    ? await db.plan.findUnique({
        where: {
          id: requestedPlanId
        }
      })
    : null;
  const planId = plan?.id ?? organization.planId ?? fallbackPlan.id;
  const stripeSubscriptionId =
    typeof session.subscription === "string" ? session.subscription : null;

  await db.organization.update({
    data: {
      planId,
      stripeCustomerId: customerId ?? organization.stripeCustomerId
    },
    where: {
      id: organization.id
    }
  });

  const localSubscription = await ensureSubscriptionForOrganization(
    {
      currentPeriodEnd: unixToDate(session.expires_at),
      organizationId: organization.id,
      planId,
      stripeCustomerId: customerId ?? organization.stripeCustomerId ?? "",
      stripeSubscriptionId
    },
    db
  );

  logger.info(
    {
      checkoutSessionId: session.id,
      event: "billing.webhook.checkout.completed",
      organizationId: organization.id,
      planId,
      stripeCustomerId: customerId ?? organization.stripeCustomerId ?? null,
      stripeSubscriptionId,
      subscriptionId: localSubscription.id,
      tenantId: organization.tenantId
    },
    "Processed checkout.session.completed event"
  );

  return {
    organizationId: organization.id,
    tenantId: organization.tenantId
  };
}

async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice,
  db: DatabaseClient
): Promise<Required<StripeBillingEventContext>> {
  const customerId = typeof invoice.customer === "string" ? invoice.customer : null;

  if (!customerId) {
    throw new ProblemDetailsError({
      detail: "Stripe invoice is missing customer id.",
      status: 400,
      title: "Bad Request"
    });
  }

  const organization = await resolveOrganizationByStripeCustomer(customerId, db);

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found for invoice.payment_succeeded event.",
      status: 404,
      title: "Not Found"
    });
  }

  const planId = organization.planId ?? (await ensurePlanByCode("starter", db)).id;
  const stripeSubscriptionId = resolveInvoiceSubscriptionId(invoice);
  const periods = resolveInvoicePeriods(invoice);
  const existingSubscription = await ensureSubscriptionForOrganization(
    {
      currentPeriodEnd: periods.periodEnd,
      organizationId: organization.id,
      planId,
      stripeCustomerId: customerId,
      stripeSubscriptionId
    },
    db
  );

  await db.subscription.update({
    data: {
      currentPeriodEnd: periods.periodEnd,
      gracePeriodEndsAt: null,
      status: SubscriptionStatus.active
    },
    where: {
      id: existingSubscription.id
    }
  });

  await db.invoice.upsert({
    create: buildInvoiceCreateData({
      fallbackStatus: "paid",
      invoice,
      organizationId: organization.id,
      subscriptionId: existingSubscription.id,
      tenantId: organization.tenantId
    }),
    update: buildInvoiceUpdateData(invoice, "paid"),
    where: {
      stripeInvoiceId: invoice.id
    }
  });

  logger.info(
    {
      event: "billing.webhook.invoice.payment_succeeded",
      invoiceId: invoice.id,
      organizationId: organization.id,
      stripeCustomerId: customerId,
      stripeSubscriptionId,
      subscriptionId: existingSubscription.id,
      tenantId: organization.tenantId
    },
    "Processed invoice.payment_succeeded event"
  );

  logger.info(
    {
      event: "billing.subscription.reactivated",
      invoiceId: invoice.id,
      organizationId: organization.id,
      tenantId: organization.tenantId
    },
    "Subscription reactivated after successful invoice payment"
  );

  return {
    organizationId: organization.id,
    tenantId: organization.tenantId
  };
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  config: ApiConfig,
  db: DatabaseClient
): Promise<Required<StripeBillingEventContext>> {
  const customerId = typeof invoice.customer === "string" ? invoice.customer : null;

  if (!customerId) {
    throw new ProblemDetailsError({
      detail: "Stripe invoice is missing customer id.",
      status: 400,
      title: "Bad Request"
    });
  }

  const organization = await resolveOrganizationByStripeCustomer(customerId, db);

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found for invoice.payment_failed event.",
      status: 404,
      title: "Not Found"
    });
  }

  const planId = organization.planId ?? (await ensurePlanByCode("starter", db)).id;
  const stripeSubscriptionId = resolveInvoiceSubscriptionId(invoice);
  const periods = resolveInvoicePeriods(invoice);
  const gracePeriodEndsAt = new Date(
    Date.now() + config.BILLING_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000
  );
  const subscription = await ensureSubscriptionForOrganization(
    {
      currentPeriodEnd: periods.periodEnd,
      organizationId: organization.id,
      planId,
      stripeCustomerId: customerId,
      stripeSubscriptionId
    },
    db
  );

  await db.subscription.update({
    data: {
      gracePeriodEndsAt,
      status: SubscriptionStatus.past_due
    },
    where: {
      id: subscription.id
    }
  });

  await db.invoice.upsert({
    create: buildInvoiceCreateData({
      fallbackStatus: "past_due",
      invoice,
      organizationId: organization.id,
      subscriptionId: subscription.id,
      tenantId: organization.tenantId
    }),
    update: buildInvoiceUpdateData(invoice, "past_due"),
    where: {
      stripeInvoiceId: invoice.id
    }
  });

  logger.info(
    {
      event: "billing.webhook.invoice.payment_failed",
      gracePeriodEndsAt: gracePeriodEndsAt.toISOString(),
      invoiceId: invoice.id,
      organizationId: organization.id,
      stripeCustomerId: customerId,
      stripeSubscriptionId,
      subscriptionId: subscription.id,
      tenantId: organization.tenantId
    },
    "Processed invoice.payment_failed event"
  );

  logger.info(
    {
      event: "billing.dunning.triggered",
      invoiceId: invoice.id,
      organizationId: organization.id,
      tenantId: organization.tenantId
    },
    "Dunning flow triggered after failed invoice payment"
  );

  return {
    organizationId: organization.id,
    tenantId: organization.tenantId
  };
}

async function handleCustomerSubscriptionDeleted(
  subscription: Stripe.Subscription,
  db: DatabaseClient
): Promise<Required<StripeBillingEventContext>> {
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : null;

  if (!customerId) {
    throw new ProblemDetailsError({
      detail: "Stripe subscription is missing customer id.",
      status: 400,
      title: "Bad Request"
    });
  }

  const organization = await resolveOrganizationByStripeCustomer(customerId, db);

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found for customer.subscription.deleted event.",
      status: 404,
      title: "Not Found"
    });
  }

  const starter = await ensurePlanByCode("starter", db);

  await db.organization.update({
    data: {
      planId: starter.id
    },
    where: {
      id: organization.id
    }
  });

  await db.subscription.updateMany({
    data: {
      canceledAt: new Date(),
      planId: starter.id,
      status: SubscriptionStatus.canceled,
      stripeSubscriptionId: subscription.id
    },
    where: {
      organizationId: organization.id
    }
  });

  logger.info(
    {
      event: "billing.webhook.subscription.deleted",
      organizationId: organization.id,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      tenantId: organization.tenantId
    },
    "Processed customer.subscription.deleted event"
  );

  return {
    organizationId: organization.id,
    tenantId: organization.tenantId
  };
}

async function handleCustomerSubscriptionUpdated(
  event: Stripe.Event,
  db: DatabaseClient
): Promise<Required<StripeBillingEventContext>> {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId =
    typeof subscription.customer === "string" ? subscription.customer : null;

  if (!customerId) {
    throw new ProblemDetailsError({
      detail: "Stripe subscription is missing customer id.",
      status: 400,
      title: "Bad Request"
    });
  }

  const organization = await resolveOrganizationByStripeCustomer(customerId, db);

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found for customer.subscription.updated event.",
      status: 404,
      title: "Not Found"
    });
  }

  const stripePriceId = subscription.items.data[0]?.price?.id;
  const mappedPlan = stripePriceId
    ? await db.plan.findFirst({
        where: {
          stripePriceId
        }
      })
    : null;
  const planId =
    mappedPlan?.id ?? organization.planId ?? (await ensurePlanByCode("starter", db)).id;

  await db.organization.update({
    data: {
      planId
    },
    where: {
      id: organization.id
    }
  });

  const localSubscription = await ensureSubscriptionForOrganization(
    {
      currentPeriodEnd: resolveSubscriptionPeriodEnd(subscription),
      organizationId: organization.id,
      planId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id
    },
    db
  );

  await db.subscription.updateMany({
    data: {
      canceledAt: unixToDate(subscription.canceled_at),
      currentPeriodEnd: resolveSubscriptionPeriodEnd(subscription),
      status: mapStripeSubscriptionStatus(subscription.status)
    },
    where: {
      organizationId: organization.id
    }
  });

  await createDowngradeProrationCredit(
    {
      amountCents: resolveProrationCreditCents(event, subscription),
      currency:
        subscription.items.data[0]?.price?.currency ?? mappedPlan?.currency ?? "usd",
      organizationId: organization.id,
      stripeEventId: event.id,
      stripeInvoiceId:
        typeof subscription.latest_invoice === "string"
          ? subscription.latest_invoice
          : subscription.latest_invoice?.id ?? null,
      subscriptionId: localSubscription.id,
      tenantId: organization.tenantId
    },
    db
  );

  logger.info(
    {
      event: "billing.webhook.subscription.updated",
      organizationId: organization.id,
      planId,
      status: subscription.status,
      stripeCustomerId: customerId,
      stripeEventId: event.id,
      stripeSubscriptionId: subscription.id,
      subscriptionId: localSubscription.id,
      tenantId: organization.tenantId
    },
    "Processed customer.subscription.updated event"
  );

  return {
    organizationId: organization.id,
    tenantId: organization.tenantId
  };
}

export async function processStripeBillingEvent(input: {
  config: ApiConfig;
  db?: DatabaseClient;
  event: Stripe.Event;
}): Promise<StripeBillingEventContext> {
  const db = input.db ?? prisma;

  try {
    switch (input.event.type) {
      case "checkout.session.completed":
        return handleCheckoutSessionCompleted(input.event.data.object, db);
      case "invoice.payment_succeeded":
        return handleInvoicePaymentSucceeded(input.event.data.object, db);
      case "invoice.payment_failed":
        return handleInvoicePaymentFailed(input.event.data.object, input.config, db);
      case "customer.subscription.deleted":
        return handleCustomerSubscriptionDeleted(input.event.data.object, db);
      case "customer.subscription.updated":
        return handleCustomerSubscriptionUpdated(input.event, db);
      default:
        logger.info(
          {
            event: "billing.webhook.ignored",
            stripeEventId: input.event.id,
            stripeEventType: input.event.type
          },
          "Ignoring unsupported Stripe billing event"
        );
        return {};
    }
  } catch (error) {
    logger.error(
      {
        err: error,
        event: "billing.webhook.processing_failed",
        stripeEventId: input.event.id,
        stripeEventType: input.event.type
      },
      "Failed to process Stripe billing event"
    );
    throw error;
  }
}
