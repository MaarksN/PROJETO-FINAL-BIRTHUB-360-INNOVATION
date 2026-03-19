export const QuotaResourceType = {
  AI_PROMPTS: "AI_PROMPTS",
  API_REQUESTS: "API_REQUESTS",
  EMAILS_SENT: "EMAILS_SENT",
  STORAGE_GB: "STORAGE_GB",
  WORKFLOW_RUNS: "WORKFLOW_RUNS"
};

export const prisma = {
  organization: {
    findMany: async () => [{ tenantId: "tenant-1" }, { tenantId: "tenant-2" }],
  },
  quotaUsage: {
    upsert: async () => {},
  }
};
