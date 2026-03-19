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

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export async function quotaResetJob(reference = new Date()) {
  const organizations = await prisma.organization.findMany({
    select: {
      tenantId: true
    }
  });

  const period = currentMonthlyPeriod(reference);
  const resetAt = nextMonthlyReset(reference);
  let upserts = 0;

  const dataToInsert = [];

  for (const organization of organizations) {
    for (const resourceType of Object.values(QuotaResourceType)) {
      dataToInsert.push({
        count: 0,
        limit: defaultLimits[resourceType],
        period,
        resetAt,
        resourceType,
        tenantId: organization.tenantId
      });
      upserts += 1;
    }
  }

  // Chunking to avoid "statement too complex" or memory issues with massive datasets
  // 5 resources * 2000 orgs = 10,000 records per chunk
  const chunks = chunkArray(dataToInsert, 10000);

  for (const chunk of chunks) {
    await prisma.quotaUsage.createMany({
      data: chunk,
      skipDuplicates: true
    });
  }

  return {
    period,
    upserts
  };
}
