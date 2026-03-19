import { performance } from "perf_hooks";

const QuotaResourceType = {
  AI_PROMPTS: "AI_PROMPTS",
  API_REQUESTS: "API_REQUESTS",
  EMAILS_SENT: "EMAILS_SENT",
  STORAGE_GB: "STORAGE_GB",
  WORKFLOW_RUNS: "WORKFLOW_RUNS"
} as const;

type QuotaResourceTypeT = typeof QuotaResourceType[keyof typeof QuotaResourceType];

const defaultLimits: Record<QuotaResourceTypeT, number> = {
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

let mockUpsertCount = 0;
let mockUpdateManyCount = 0;

const prisma = {
  organization: {
    findMany: async () => {
      const orgs = [];
      for(let i=0; i<5000; i++) orgs.push({ tenantId: `t-${i}` });
      return orgs;
    }
  },
  quotaUsage: {
    upsert: async () => {
      mockUpsertCount++;
      // simulate db delay
      await new Promise(r => setTimeout(r, 0.5));
    },
    updateMany: async () => {
      mockUpdateManyCount++;
      await new Promise(r => setTimeout(r, 20)); // simulated slower bulk op
    }
  }
};

async function quotaResetJob(reference = new Date()) {
  const organizations = await prisma.organization.findMany();
  const period = currentMonthlyPeriod(reference);
  let upserts = 0;

  for (const organization of organizations) {
    for (const resourceType of Object.values(QuotaResourceType)) {
      await prisma.quotaUsage.upsert();
      upserts += 1;
    }
  }

  return { period, upserts };
}

async function quotaResetJobOptimized(reference = new Date()) {
  const organizations = await prisma.organization.findMany();
  const period = currentMonthlyPeriod(reference);
  const resetAt = nextMonthlyReset(reference);
  let processed = 0;

  // Optimised logic idea:
  // Usually this job is a monthly reset.
  // We can just update all current ones?
  // Wait, upsert creates if missing, updates if exists.
  // Update is {}. It effectively sets count=0 if missing, but doesn't change it if it exists?
  // Let's check original code:
  // create: { count: 0, limit: limit, period, resetAt, resourceType, tenantId }
  // update: {}
  // This means it ONLY CREATES the missing records for the new month, count=0.
  // It doesn't reset existing ones. Wait, the month changed, so the `period` is different!
  // E.g., MONTHLY-2023-11.
  // These records will not exist for the new month. So it's basically an insert.

  // Actually Prisma doesn't support createMany in upsert.
  // But wait, the original code is upsert just to be idempotent (if the job runs twice).
  // We could use createMany with skipDuplicates: true.

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
      processed++;
    }
  }

  // mock createMany
  await new Promise(r => setTimeout(r, 50));

  return { period, upserts: processed };
}


async function runBenchmark() {
  console.log("Running baseline...");
  mockUpsertCount = 0;
  const start1 = performance.now();
  await quotaResetJob();
  const end1 = performance.now();
  console.log(`Baseline: ${end1 - start1} ms for ${mockUpsertCount} mock queries`);

  console.log("Running optimized...");
  const start2 = performance.now();
  await quotaResetJobOptimized();
  const end2 = performance.now();
  console.log(`Optimized: ${end2 - start2} ms`);
}

runBenchmark().catch(console.error);
