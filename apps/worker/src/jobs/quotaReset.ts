import { QuotaResourceType, prisma } from "@birthub/database";

const defaultLimits: Record<QuotaResourceType, number> = {
  AI_PROMPTS: 1_000,
  API_REQUESTS: 5_000,
  EMAILS_SENT: 2_500,
  STORAGE_GB: 100,
  WORKFLOW_RUNS: 10_000
};

function currentMonthlyPeriod(reference = new Date()): string {
  const year = reference.getUTCFullYear();
  const month = String(reference.getUTCMonth() + 1).padStart(2, "0");
  return `MONTHLY-${year}-${month}`;
}

function nextMonthlyReset(reference = new Date()): Date {
  return new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() + 1, 1, 0, 0, 0));
}

export async function quotaResetJob(reference = new Date()) {
  const organizations = await prisma.organization.findMany({
    select: {
      tenantId: true
    }
  });

  const period = currentMonthlyPeriod(reference);
  const resetAt = nextMonthlyReset(reference);

  const resourceTypes = Object.values(QuotaResourceType);

  const payload = organizations.flatMap((organization) =>
    resourceTypes.map((resourceType) => ({
      count: 0,
      limit: defaultLimits[resourceType],
      period,
      resetAt,
      resourceType,
      tenantId: organization.tenantId
    }))
  );

  if (payload.length > 0) {
    await prisma.quotaUsage.createMany({
      data: payload,
      skipDuplicates: true
    });
  }

  return {
    period,
    upserts: payload.length
  };
}
