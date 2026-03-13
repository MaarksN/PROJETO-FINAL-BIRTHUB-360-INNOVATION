import type { ApiConfig } from "@birthub/config";
import {
  Prisma,
  SubscriptionStatus,
  type InvoiceStatus,
  prisma
} from "@birthub/database";
import { createLogger } from "@birthub/logger";
import express, { Router } from "express";
import Stripe from "stripe";

import { ProblemDetailsError, asyncHandler } from "../../lib/problem-details.js";
import { publishBillingEvent } from "../billing/event-bus.js";
import { ensurePlanByCode } from "../billing/service.js";
import { createStripeClient } from "../billing/stripe.client.js";

const logger = createLogger("stripe-webhook");

function unixToDate(value: number | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  return new Date(value * 1000);
}

function mapStripeSubscriptionStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
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

async function resolveOrganizationByStripeCustomer(customerId: string) {
  return prisma.organization.findFirst({
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

async function ensureSubscriptionForOrganization(input: {
  currentPeriodEnd?: Date | null;
  organizationId: string;
  planId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string | null;
}): Promise<{
  id: string;
  status: SubscriptionStatus;
  tenantId: string;
}> {
  const organization = await prisma.organization.findUnique({
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

  return prisma.subscription.upsert({
    create: {
      currentPeriodEnd: input.currentPeriodEnd ?? null,
      organizationId: organization.id,
      planId: input.planId,
      status: SubscriptionStatus.active,
      stripeCustomerId: input.stripeCustomerId,
      stripeSubscriptionId: input.stripeSubscriptionId ?? null,
      tenantId: organization.tenantId
    },
    update: {
      currentPeriodEnd: input.currentPeriodEnd ?? undefined,
      planId: input.planId,
      status: SubscriptionStatus.active,
      stripeCustomerId: input.stripeCustomerId,
      stripeSubscriptionId: input.stripeSubscriptionId ?? undefined
    },
    where: {
      organizationId: organization.id
    }
  });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<{
  organizationId: string;
  tenantId: string;
}> {
  const customerId = typeof session.customer === "string" ? session.customer : null;
  const metadataOrganizationId = session.metadata?.organizationId;
  let organization = metadataOrganizationId
    ? await prisma.organization.findUnique({
        where: {
          id: metadataOrganizationId
        }
      })
    : null;

  if (!organization && customerId) {
    organization = await resolveOrganizationByStripeCustomer(customerId);
  }

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found for checkout.session.completed event.",
      status: 404,
      title: "Not Found"
    });
  }

  const requestedPlanId = session.metadata?.planId;
  const fallbackPlan = await ensurePlanByCode("starter");
  const plan = requestedPlanId
    ? await prisma.plan.findUnique({
        where: {
          id: requestedPlanId
        }
      })
    : null;
  const planId = plan?.id ?? organization.planId ?? fallbackPlan.id;
  const stripeSubscriptionId =
    typeof session.subscription === "string" ? session.subscription : null;

  await prisma.organization.update({
    data: {
      planId,
      stripeCustomerId: customerId ?? organization.stripeCustomerId
    },
    where: {
      id: organization.id
    }
  });

  await ensureSubscriptionForOrganization({
    currentPeriodEnd: unixToDate(session.expires_at),
    organizationId: organization.id,
    planId,
    stripeCustomerId: customerId ?? organization.stripeCustomerId ?? "",
    stripeSubscriptionId
  });

  return {
    organizationId: organization.id,
    tenantId: organization.tenantId
  };
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<{
  organizationId: string;
  tenantId: string;
}> {
  const customerId = typeof invoice.customer === "string" ? invoice.customer : null;

  if (!customerId) {
    throw new ProblemDetailsError({
      detail: "Stripe invoice is missing customer id.",
      status: 400,
      title: "Bad Request"
    });
  }

  const organization = await resolveOrganizationByStripeCustomer(customerId);

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found for invoice.payment_succeeded event.",
      status: 404,
      title: "Not Found"
    });
  }

  const planId = organization.planId ?? (await ensurePlanByCode("starter")).id;
  const stripeSubscriptionId =
    typeof invoice.subscription === "string" ? invoice.subscription : null;
  const periods = resolveInvoicePeriods(invoice);
  const existingSubscription = await ensureSubscriptionForOrganization({
    currentPeriodEnd: periods.periodEnd,
    organizationId: organization.id,
    planId,
    stripeCustomerId: customerId,
    stripeSubscriptionId
  });

  await prisma.subscription.update({
    data: {
      currentPeriodEnd: periods.periodEnd ?? undefined,
      gracePeriodEndsAt: null,
      status: SubscriptionStatus.active
    },
    where: {
      id: existingSubscription.id
    }
  });

  await prisma.invoice.upsert({
    create: {
      amountDueCents: invoice.amount_due,
      amountPaidCents: invoice.amount_paid,
      currency: invoice.currency,
      dueDate: unixToDate(invoice.due_date),
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdfUrl: invoice.invoice_pdf,
      organizationId: organization.id,
      periodEnd: periods.periodEnd,
      periodStart: periods.periodStart,
      status: resolveInvoiceStatus(invoice.status, "paid"),
      stripeInvoiceId: invoice.id,
      subscriptionId: existingSubscription.id,
      tenantId: organization.tenantId
    },
    update: {
      amountDueCents: invoice.amount_due,
      amountPaidCents: invoice.amount_paid,
      dueDate: unixToDate(invoice.due_date),
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdfUrl: invoice.invoice_pdf,
      periodEnd: periods.periodEnd,
      periodStart: periods.periodStart,
      status: resolveInvoiceStatus(invoice.status, "paid")
    },
    where: {
      stripeInvoiceId: invoice.id
    }
  });

  await publishBillingEvent({
    kind: "billing.subscription.reactivated",
    organizationId: organization.id,
    tenantId: organization.tenantId
  });

  return {
    organizationId: organization.id,
    tenantId: organization.tenantId
  };
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  config: ApiConfig
): Promise<{
  organizationId: string;
  tenantId: string;
}> {
  const customerId = typeof invoice.customer === "string" ? invoice.customer : null;

  if (!customerId) {
    throw new ProblemDetailsError({
      detail: "Stripe invoice is missing customer id.",
      status: 400,
      title: "Bad Request"
    });
  }

  const organization = await resolveOrganizationByStripeCustomer(customerId);

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found for invoice.payment_failed event.",
      status: 404,
      title: "Not Found"
    });
  }

  const planId = organization.planId ?? (await ensurePlanByCode("starter")).id;
  const stripeSubscriptionId =
    typeof invoice.subscription === "string" ? invoice.subscription : null;
  const periods = resolveInvoicePeriods(invoice);
  const gracePeriodEndsAt = new Date(
    Date.now() + config.BILLING_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000
  );
  const subscription = await ensureSubscriptionForOrganization({
    currentPeriodEnd: periods.periodEnd,
    organizationId: organization.id,
    planId,
    stripeCustomerId: customerId,
    stripeSubscriptionId
  });

  await prisma.subscription.update({
    data: {
      gracePeriodEndsAt,
      status: SubscriptionStatus.past_due
    },
    where: {
      id: subscription.id
    }
  });

  await prisma.invoice.upsert({
    create: {
      amountDueCents: invoice.amount_due,
      amountPaidCents: invoice.amount_paid,
      currency: invoice.currency,
      dueDate: unixToDate(invoice.due_date),
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdfUrl: invoice.invoice_pdf,
      organizationId: organization.id,
      periodEnd: periods.periodEnd,
      periodStart: periods.periodStart,
      status: "past_due",
      stripeInvoiceId: invoice.id,
      subscriptionId: subscription.id,
      tenantId: organization.tenantId
    },
    update: {
      amountDueCents: invoice.amount_due,
      amountPaidCents: invoice.amount_paid,
      dueDate: unixToDate(invoice.due_date),
      hostedInvoiceUrl: invoice.hosted_invoice_url,
      invoicePdfUrl: invoice.invoice_pdf,
      periodEnd: periods.periodEnd,
      periodStart: periods.periodStart,
      status: "past_due"
    },
    where: {
      stripeInvoiceId: invoice.id
    }
  });

  await publishBillingEvent({
    kind: "billing.dunning.triggered",
    organizationId: organization.id,
    stripeInvoiceId: invoice.id,
    tenantId: organization.tenantId
  });

  return {
    organizationId: organization.id,
    tenantId: organization.tenantId
  };
}

async function handleCustomerSubscriptionDeleted(subscription: Stripe.Subscription): Promise<{
  organizationId: string;
  tenantId: string;
}> {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : null;

  if (!customerId) {
    throw new ProblemDetailsError({
      detail: "Stripe subscription is missing customer id.",
      status: 400,
      title: "Bad Request"
    });
  }

  const organization = await resolveOrganizationByStripeCustomer(customerId);

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found for customer.subscription.deleted event.",
      status: 404,
      title: "Not Found"
    });
  }

  const starter = await ensurePlanByCode("starter");

  await prisma.organization.update({
    data: {
      planId: starter.id
    },
    where: {
      id: organization.id
    }
  });

  await prisma.subscription.updateMany({
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

  return {
    organizationId: organization.id,
    tenantId: organization.tenantId
  };
}

async function handleCustomerSubscriptionUpdated(subscription: Stripe.Subscription): Promise<{
  organizationId: string;
  tenantId: string;
}> {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : null;

  if (!customerId) {
    throw new ProblemDetailsError({
      detail: "Stripe subscription is missing customer id.",
      status: 400,
      title: "Bad Request"
    });
  }

  const organization = await resolveOrganizationByStripeCustomer(customerId);

  if (!organization) {
    throw new ProblemDetailsError({
      detail: "Organization not found for customer.subscription.updated event.",
      status: 404,
      title: "Not Found"
    });
  }

  const stripePriceId = subscription.items.data[0]?.price?.id;
  const mappedPlan = stripePriceId
    ? await prisma.plan.findFirst({
        where: {
          stripePriceId
        }
      })
    : null;
  const planId = mappedPlan?.id ?? organization.planId ?? (await ensurePlanByCode("starter")).id;

  await prisma.organization.update({
    data: {
      planId
    },
    where: {
      id: organization.id
    }
  });

  await ensureSubscriptionForOrganization({
    currentPeriodEnd: unixToDate(subscription.current_period_end),
    organizationId: organization.id,
    planId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id
  });

  await prisma.subscription.updateMany({
    data: {
      canceledAt: unixToDate(subscription.canceled_at),
      currentPeriodEnd: unixToDate(subscription.current_period_end),
      status: mapStripeSubscriptionStatus(subscription.status)
    },
    where: {
      organizationId: organization.id
    }
  });

  return {
    organizationId: organization.id,
    tenantId: organization.tenantId
  };
}

async function processStripeEvent(
  event: Stripe.Event,
  config: ApiConfig
): Promise<{ organizationId?: string; tenantId?: string }> {
  switch (event.type) {
    case "checkout.session.completed":
      return handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
    case "invoice.payment_succeeded":
      return handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
    case "invoice.payment_failed":
      return handleInvoicePaymentFailed(event.data.object as Stripe.Invoice, config);
    case "customer.subscription.deleted":
      return handleCustomerSubscriptionDeleted(event.data.object as Stripe.Subscription);
    case "customer.subscription.updated":
      return handleCustomerSubscriptionUpdated(event.data.object as Stripe.Subscription);
    default:
      return {};
  }
}

export function createStripeWebhookRouter(config: ApiConfig): Router {
  const router = Router();
  const stripe = createStripeClient(config);

  router.post(
    "/stripe",
    express.raw({ type: "application/json" }),
    asyncHandler(async (request, response) => {
      const signature = request.header("stripe-signature");

      if (!signature) {
        throw new ProblemDetailsError({
          detail: "Missing Stripe signature header.",
          status: 400,
          title: "Bad Request"
        });
      }

      if (!Buffer.isBuffer(request.body)) {
        throw new ProblemDetailsError({
          detail: "Stripe webhook payload must be read as raw body.",
          status: 400,
          title: "Bad Request"
        });
      }

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          config.STRIPE_WEBHOOK_SECRET
        );
      } catch (error) {
        throw new ProblemDetailsError({
          detail: "Invalid Stripe webhook signature.",
          errors: error instanceof Error ? error.message : "unknown_signature_error",
          status: 400,
          title: "Bad Request"
        });
      }

      const existing = await prisma.billingEvent.findUnique({
        where: {
          stripeEventId: event.id
        }
      });

      if (existing) {
        response.status(200).json({
          idempotent: true,
          received: true
        });
        return;
      }

      const context = await processStripeEvent(event, config);

      try {
        await prisma.billingEvent.create({
          data: {
            organizationId: context.organizationId,
            payload: event as unknown as Prisma.InputJsonValue,
            stripeEventId: event.id,
            tenantId: context.tenantId,
            type: event.type
          }
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          logger.warn(
            {
              eventId: event.id,
              eventType: event.type
            },
            "Duplicate Stripe event ignored"
          );
        } else {
          throw error;
        }
      }

      response.status(200).json({
        idempotent: false,
        received: true
      });
    })
  );

  return router;
}
