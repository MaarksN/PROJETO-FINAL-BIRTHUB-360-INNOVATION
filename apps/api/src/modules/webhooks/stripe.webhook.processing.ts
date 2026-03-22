import type { ApiConfig } from "@birthub/config";
import { BillingEventStatus, Prisma, prisma } from "@birthub/database";
import { createLogger } from "@birthub/logger";
import type { Request } from "express";
import Redlock from "redlock";
import Stripe from "stripe";

import {
  deleteCacheKeys,
  readCacheValue,
  writeCacheValue
} from "../../common/cache/cache-store.js";
import { ProblemDetailsError } from "../../lib/problem-details.js";
import { toPrismaJsonValue } from "../../lib/prisma-json.js";
import { getSharedRedis } from "../../lib/redis.js";
import { captureWebhookException } from "../../observability/sentry.js";
import {
  invalidateBillingSnapshotCache,
  type StripeBillingEventContext
} from "../billing/service.js";
import { enqueueCrmSync } from "../engagement/queues.js";

const logger = createLogger("stripe-webhook");
const BILLING_WEBHOOK_IDEMPOTENCY_TTL_SECONDS = 86_400;

let stripeRedlock: Redlock | null = null;

type StripeWebhookEventProcessor = (input: {
  config: ApiConfig;
  db?: typeof prisma | Prisma.TransactionClient;
  event: Stripe.Event;
}) => Promise<StripeBillingEventContext>;

function billingStatusCacheKey(tenantId: string): string {
  return `billing-status:${tenantId}`;
}

function stripeWebhookIdempotencyKey(eventId: string): string {
  return `idempotency:stripe_webhook:${eventId}`;
}

function getStripeRedlock(config: ApiConfig): Redlock {
  if (stripeRedlock) {
    return stripeRedlock;
  }

  stripeRedlock = new Redlock([getSharedRedis(config)], {
    retryCount: 3,
    retryDelay: 200,
    retryJitter: 100
  });

  return stripeRedlock;
}

function resolveLockResource(event: Stripe.Event): string {
  const object = event.data.object;
  const candidate =
    ("customer" in object && typeof object.customer === "string" ? object.customer : null) ??
    ("subscription" in object && typeof object.subscription === "string"
      ? object.subscription
      : null) ??
    ("metadata" in object && typeof object.metadata?.organizationId === "string"
      ? object.metadata.organizationId
      : null) ??
    event.id;

  return `locks:stripe:${candidate}`;
}

async function withStripeEventLock<T>(
  config: ApiConfig,
  event: Stripe.Event,
  callback: () => Promise<T>
): Promise<T> {
  if (config.NODE_ENV === "test") {
    return callback();
  }

  const lock = await getStripeRedlock(config).acquire([resolveLockResource(event)], 10_000);

  try {
    return await callback();
  } finally {
    await lock.release().catch((error) => {
      logger.warn(
        {
          err: error,
          stripeEventId: event.id,
          stripeEventType: event.type
        },
        "Failed to release Stripe event lock"
      );
    });
  }
}

function ensureSignature(request: Request): string {
  const signature = request.header("stripe-signature");

  if (signature) {
    return signature;
  }

  logger.warn(
    {
      event: "billing.webhook.signature.missing"
    },
    "Stripe webhook rejected because the signature header is missing"
  );

  throw new ProblemDetailsError({
    detail: "Missing Stripe signature header.",
    status: 400,
    title: "Bad Request"
  });
}

function ensureRawBody(request: Request): Buffer {
  if (Buffer.isBuffer(request.body)) {
    return request.body;
  }

  throw new ProblemDetailsError({
    detail: "Stripe webhook payload must be read as raw body.",
    status: 400,
    title: "Bad Request"
  });
}

function parseStripeSignatureTimestamp(signature: string): Date {
  const timestampFragment = signature
    .split(",")
    .map((fragment) => fragment.trim())
    .find((fragment) => fragment.startsWith("t="));

  if (!timestampFragment) {
    throw new ProblemDetailsError({
      detail: "Stripe webhook signature is missing the timestamp component.",
      status: 400,
      title: "Bad Request"
    });
  }

  const timestampSeconds = Number(timestampFragment.slice(2));

  if (!Number.isInteger(timestampSeconds) || timestampSeconds <= 0) {
    throw new ProblemDetailsError({
      detail: "Stripe webhook signature contains an invalid timestamp.",
      status: 400,
      title: "Bad Request"
    });
  }

  return new Date(timestampSeconds * 1000);
}

function ensureWebhookWithinReplayWindow(
  signatureTimestamp: Date,
  toleranceSeconds: number
): void {
  const driftMs = Math.abs(Date.now() - signatureTimestamp.getTime());

  if (driftMs <= toleranceSeconds * 1000) {
    return;
  }

  throw new ProblemDetailsError({
    detail: "Stripe webhook timestamp is outside the replay protection window.",
    status: 400,
    title: "Bad Request"
  });
}

function resolveStripeEventCreatedAt(event: Stripe.Event): Date | null {
  return typeof event.created === "number" ? new Date(event.created * 1000) : null;
}

function toWebhookErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  return raw.slice(0, 1_000);
}

function constructStripeEvent(input: {
  body: Buffer;
  config: ApiConfig;
  signature: string;
  stripe: Stripe;
}): {
  event: Stripe.Event;
  signatureTimestamp: Date;
} {
  const signatureTimestamp = parseStripeSignatureTimestamp(input.signature);
  let event: Stripe.Event;

  try {
    event = input.stripe.webhooks.constructEvent(
      input.body,
      input.signature,
      input.config.STRIPE_WEBHOOK_SECRET,
      Number.MAX_SAFE_INTEGER
    );
  } catch (error) {
    logger.warn(
      {
        err: error,
        event: "billing.webhook.signature.invalid"
      },
      "Stripe webhook rejected because the signature is invalid"
    );

    throw new ProblemDetailsError({
      detail: "Invalid Stripe webhook signature.",
      errors: error instanceof Error ? error.message : "unknown_signature_error",
      status: 400,
      title: "Bad Request"
    });
  }

  try {
    ensureWebhookWithinReplayWindow(
      signatureTimestamp,
      input.config.STRIPE_WEBHOOK_TOLERANCE_SECONDS
    );
  } catch (error) {
    logger.warn(
      {
        event: "billing.webhook.replay_rejected",
        signatureTimestamp: signatureTimestamp.toISOString(),
        stripeEventId: event.id,
        stripeEventType: event.type,
        toleranceSeconds: input.config.STRIPE_WEBHOOK_TOLERANCE_SECONDS
      },
      "Stripe webhook rejected because it is outside the replay window"
    );
    throw error;
  }

  return { event, signatureTimestamp };
}

async function createReceivedBillingEvent(input: {
  event: Stripe.Event;
  signatureTimestamp: Date;
}) {
  try {
    return await prisma.billingEvent.create({
      data: {
        attemptCount: 0,
        eventCreatedAt: resolveStripeEventCreatedAt(input.event),
        payload: toPrismaJsonValue(input.event),
        signatureTimestamp: input.signatureTimestamp,
        status: BillingEventStatus.received,
        stripeEventId: input.event.id,
        type: input.event.type
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const existing = await prisma.billingEvent.findUnique({
        where: {
          stripeEventId: input.event.id
        }
      });

      if (existing) {
        return existing;
      }
    }

    throw error;
  }
}

async function markBillingEventProcessing(input: {
  event: Stripe.Event;
  signatureTimestamp: Date;
}) {
  return prisma.billingEvent.update({
    data: {
      attemptCount: {
        increment: 1
      },
      eventCreatedAt: resolveStripeEventCreatedAt(input.event),
      failedAt: null,
      lastError: null,
      payload: toPrismaJsonValue(input.event),
      processedAt: null,
      signatureTimestamp: input.signatureTimestamp,
      status: BillingEventStatus.processing,
      type: input.event.type
    },
    where: {
      stripeEventId: input.event.id
    }
  });
}

async function readDuplicateResult(event: Stripe.Event, idempotencyKey: string) {
  const cachedIdempotency = await readCacheValue(idempotencyKey);

  if (!cachedIdempotency) {
    return null;
  }

  const processedRecord = await prisma.billingEvent.findUnique({
    where: {
      stripeEventId: event.id
    }
  });

  if (processedRecord?.status === BillingEventStatus.processed) {
    logger.info(
      {
        event: "billing.webhook.duplicate.cache_hit",
        stripeEventId: event.id,
        stripeEventType: event.type
      },
      "Ignoring duplicate Stripe billing event via cache idempotency"
    );

    return {
      idempotent: true,
      received: true
    };
  }

  await deleteCacheKeys([idempotencyKey]);
  return null;
}

async function ensurePendingBillingEvent(event: Stripe.Event, signatureTimestamp: Date) {
  const existing = await prisma.billingEvent.findUnique({
    where: {
      stripeEventId: event.id
    }
  });

  if (!existing) {
    return createReceivedBillingEvent({ event, signatureTimestamp });
  }

  return existing;
}

async function persistProcessedCache(
  context: StripeBillingEventContext,
  event: Stripe.Event,
  idempotencyKey: string,
  request: Request
): Promise<void> {
  try {
    await writeCacheValue(
      idempotencyKey,
      "processed",
      BILLING_WEBHOOK_IDEMPOTENCY_TTL_SECONDS
    );
  } catch (error) {
    logger.error(
      {
        err: error,
        event: "billing.webhook.idempotency.write_failed",
        organizationId: context.organizationId ?? null,
        stripeEventId: event.id,
        tenantId: context.tenantId ?? null
      },
      "Failed to write Stripe webhook idempotency cache"
    );

    captureWebhookException(error, {
      organizationId: context.organizationId,
      requestId: request.context?.requestId,
      stripeEventId: event.id,
      stripeEventType: event.type,
      tenantId: context.tenantId,
      traceId: request.context?.traceId
    });
  }
}

async function runPostCommitSideEffects(
  config: ApiConfig,
  context: StripeBillingEventContext,
  event: Stripe.Event,
  request: Request
): Promise<void> {
  try {
    if (context.tenantId || context.organizationId) {
      await Promise.all([
        invalidateBillingSnapshotCache([context.organizationId, context.tenantId]),
        ...(context.tenantId
          ? [deleteCacheKeys([billingStatusCacheKey(context.tenantId)])]
          : [])
      ]);
    }

    if (
      config.NODE_ENV !== "test" &&
      context.organizationId &&
      context.tenantId &&
      (event.type === "checkout.session.completed" ||
        event.type === "customer.subscription.updated")
    ) {
      await enqueueCrmSync(config, {
        kind: "company-upsert",
        organizationId: context.organizationId,
        tenantId: context.tenantId
      });
    }
  } catch (error) {
    logger.error(
      {
        err: error,
        event: "billing.webhook.post_commit_failed",
        organizationId: context.organizationId ?? null,
        stripeEventId: event.id,
        stripeEventType: event.type,
        tenantId: context.tenantId ?? null
      },
      "Post-commit Stripe webhook side effect failed"
    );

    captureWebhookException(error, {
      organizationId: context.organizationId,
      requestId: request.context?.requestId,
      stripeEventId: event.id,
      stripeEventType: event.type,
      tenantId: context.tenantId,
      traceId: request.context?.traceId
    });
  }
}

async function processStripeDomainEvent(input: {
  config: ApiConfig;
  event: Stripe.Event;
  processStripeBillingEvent: StripeWebhookEventProcessor;
}) {
  return prisma.$transaction(async (tx) => {
    const context = await input.processStripeBillingEvent({
      config: input.config,
      db: tx,
      event: input.event
    });

    await tx.billingEvent.update({
      data: {
        failedAt: null,
        lastError: null,
        organizationId: context.organizationId ?? null,
        processedAt: new Date(),
        status: BillingEventStatus.processed,
        tenantId: context.tenantId ?? null
      },
      where: {
        stripeEventId: input.event.id
      }
    });

    return context;
  });
}

async function processLockedStripeEvent(input: {
  config: ApiConfig;
  event: Stripe.Event;
  processStripeBillingEvent: StripeWebhookEventProcessor;
  request: Request;
  signatureTimestamp: Date;
}): Promise<{ idempotent: boolean; received: boolean }> {
  const idempotencyKey = stripeWebhookIdempotencyKey(input.event.id);
  const duplicateResult = await readDuplicateResult(input.event, idempotencyKey);

  if (duplicateResult) {
    return duplicateResult;
  }

  const billingEvent = await ensurePendingBillingEvent(input.event, input.signatureTimestamp);

  if (billingEvent.status === BillingEventStatus.processed) {
    await writeCacheValue(
      idempotencyKey,
      "processed",
      BILLING_WEBHOOK_IDEMPOTENCY_TTL_SECONDS
    ).catch(() => undefined);

    logger.info(
      {
        event: "billing.webhook.duplicate",
        stripeEventId: input.event.id,
        stripeEventType: input.event.type
      },
      "Ignoring duplicate Stripe billing event"
    );

    return {
      idempotent: true,
      received: true
    };
  }

  await markBillingEventProcessing({
    event: input.event,
    signatureTimestamp: input.signatureTimestamp
  });

  let context: StripeBillingEventContext;

  try {
    context = await processStripeDomainEvent({
      config: input.config,
      event: input.event,
      processStripeBillingEvent: input.processStripeBillingEvent
    });
  } catch (error) {
    await prisma.billingEvent.update({
      data: {
        failedAt: new Date(),
        lastError: toWebhookErrorMessage(error),
        status: BillingEventStatus.failed
      },
      where: {
        stripeEventId: input.event.id
      }
    });

    logger.error(
      {
        err: error,
        event: "billing.webhook.processing_failed",
        stripeEventId: input.event.id,
        stripeEventType: input.event.type
      },
      "Failed to process Stripe billing event"
    );

    captureWebhookException(error, {
      requestId: input.request.context?.requestId,
      stripeEventId: input.event.id,
      stripeEventType: input.event.type,
      traceId: input.request.context?.traceId
    });

    throw error;
  }

  await persistProcessedCache(context, input.event, idempotencyKey, input.request);
  await runPostCommitSideEffects(input.config, context, input.event, input.request);

  logger.info(
    {
      event: "billing.webhook.processed",
      organizationId: context.organizationId ?? null,
      stripeEventId: input.event.id,
      stripeEventType: input.event.type,
      tenantId: context.tenantId ?? null
    },
    "Processed Stripe billing event"
  );

  return {
    idempotent: false,
    received: true
  };
}

export async function processStripeWebhookRequest(input: {
  config: ApiConfig;
  processStripeBillingEvent: StripeWebhookEventProcessor;
  request: Request;
  stripe: Stripe;
}): Promise<{ idempotent: boolean; received: boolean }> {
  const signature = ensureSignature(input.request);
  const body = ensureRawBody(input.request);
  const { event, signatureTimestamp } = constructStripeEvent({
    body,
    config: input.config,
    signature,
    stripe: input.stripe
  });

  return withStripeEventLock(input.config, event, () =>
    processLockedStripeEvent({
      config: input.config,
      event,
      processStripeBillingEvent: input.processStripeBillingEvent,
      request: input.request,
      signatureTimestamp
    })
  );
}
