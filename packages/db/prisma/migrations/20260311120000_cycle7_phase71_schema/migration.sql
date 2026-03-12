-- Cycle 7 • Fase 7.1.C1
-- Billing foundation: Plan, PlanFeature, Entitlement, Subscription, SubscriptionItem

-- 1) Rename enum Plan -> PlanCode and keep Organization.plan compatible
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Plan')
     AND NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PlanCode') THEN
    ALTER TYPE "Plan" RENAME TO "PlanCode";
  END IF;
END $$;

-- 2) Create Plan table
CREATE TABLE IF NOT EXISTS "Plan" (
  "id" TEXT PRIMARY KEY,
  "code" "PlanCode" NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "priceMonthly" INTEGER NOT NULL DEFAULT 0,
  "priceYearly" INTEGER,
  "trialDays" INTEGER NOT NULL DEFAULT 14,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3) Rebuild PlanFeature to reference Plan.id
DROP TABLE IF EXISTS "PlanFeature";
CREATE TABLE "PlanFeature" (
  "id" TEXT PRIMARY KEY,
  "planId" TEXT NOT NULL,
  "feature" TEXT NOT NULL,
  "limit" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PlanFeature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "PlanFeature_planId_feature_key" ON "PlanFeature"("planId", "feature");
CREATE INDEX IF NOT EXISTS "PlanFeature_feature_idx" ON "PlanFeature"("feature");

-- 4) Rebuild Subscription with plan relation and billing fields
DROP TABLE IF EXISTS "Subscription" CASCADE;
CREATE TABLE "Subscription" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "planId" TEXT NOT NULL,
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
  "stripeCustomerId" TEXT,
  "stripeSubscriptionId" TEXT UNIQUE,
  "currentPeriodStart" TIMESTAMP(3) NOT NULL,
  "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
  "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
  "cancelledAt" TIMESTAMP(3),
  "trialEndsAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Subscription_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Subscription_organizationId_status_idx" ON "Subscription"("organizationId", "status");
CREATE INDEX IF NOT EXISTS "Subscription_planId_idx" ON "Subscription"("planId");

-- 5) Create SubscriptionItem
CREATE TABLE IF NOT EXISTS "SubscriptionItem" (
  "id" TEXT PRIMARY KEY,
  "subscriptionId" TEXT NOT NULL,
  "stripeItemId" TEXT UNIQUE,
  "feature" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "unitPriceCents" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SubscriptionItem_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "SubscriptionItem_subscriptionId_feature_key" ON "SubscriptionItem"("subscriptionId", "feature");

-- 6) Create Entitlement
CREATE TABLE IF NOT EXISTS "Entitlement" (
  "id" TEXT PRIMARY KEY,
  "organizationId" TEXT NOT NULL,
  "subscriptionId" TEXT,
  "feature" TEXT NOT NULL,
  "limit" INTEGER,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "source" TEXT NOT NULL DEFAULT 'plan',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Entitlement_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Entitlement_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Entitlement_organizationId_feature_key" ON "Entitlement"("organizationId", "feature");
CREATE INDEX IF NOT EXISTS "Entitlement_subscriptionId_idx" ON "Entitlement"("subscriptionId");
