// @ts-nocheck
// 
import { getApiConfig } from "@birthub/config";
import { prisma, Prisma } from "@birthub/database";
import { createLogger } from "@birthub/logger";

import { createStripeClient } from "./stripe.client.js";

const logger = createLogger("billing-sync-plans");

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function parseLimitsMetadata(raw: string | undefined): Prisma.InputJsonValue {
  if (!raw) {
    return {
      agents: 5,
      features: {
        agents: true,
        workflows: true
      },
      workflows: 30
    };
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "object" && parsed && !Array.isArray(parsed)) {
      return parsed as Prisma.InputJsonValue;
    }
  } catch {
    // Ignore malformed metadata and fallback to defaults.
  }

  return {
    agents: 5,
    features: {
      agents: true,
      workflows: true
    },
    workflows: 30
  };
}

function buildRecurringPriceByProduct(prices: Array<Record<string, unknown>>) {
  const recurringPriceByProduct = new Map<string, Record<string, unknown>>();

  for (const price of prices) {
    const productId = typeof price.product === "string" ? price.product : null;

    if (!productId || recurringPriceByProduct.has(productId)) {
      continue;
    }

    recurringPriceByProduct.set(productId, price);
  }

  return recurringPriceByProduct;
}

function buildPlanRecord(product: Record<string, unknown>, recurringPrice: Record<string, unknown>) {
  const code =
    typeof product.metadata?.code === "string" && product.metadata.code.trim().length > 0
      ? product.metadata.code.trim().toLowerCase()
      : slugify(String(product.name ?? ""));

  return {
    code,
    planData: {
      active: true,
      currency: recurringPrice.currency,
      description: product.description ?? null,
      limits: parseLimitsMetadata(product.metadata?.limits_json),
      monthlyPriceCents: recurringPrice.unit_amount ?? 0,
      name: product.name,
      stripePriceId: recurringPrice.id,
      stripeProductId: product.id,
      yearlyPriceCents:
        recurringPrice.recurring?.interval === "year" ? recurringPrice.unit_amount ?? 0 : null
    }
  };
}

async function main(): Promise<void> {
  const config = getApiConfig();
  const stripe = createStripeClient(config);
  const products = await stripe.products.list({
    active: true,
    limit: 100
  });
  const prices = await stripe.prices.list({
    active: true,
    limit: 100,
    type: "recurring"
  });
  const recurringPriceByProduct = buildRecurringPriceByProduct(prices.data);
  const planRecords = products.data.flatMap((product) => {
    const recurringPrice = recurringPriceByProduct.get(product.id);

    if (!recurringPrice) {
      return [];
    }

    return [buildPlanRecord(product, recurringPrice)];
  });

  await Promise.all(
    planRecords.map(({ code, planData }) =>
      prisma.plan.upsert({
        create: {
          code,
          ...planData
        },
        update: planData,
        where: {
          code
        }
      })
    )
  );

  const synchronized = planRecords.length;

  logger.info({ synchronized }, "Stripe products/prices synced into local plans table");
}

void main()
  .catch((error) => {
    logger.error({ error }, "Failed to sync Stripe plans");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
