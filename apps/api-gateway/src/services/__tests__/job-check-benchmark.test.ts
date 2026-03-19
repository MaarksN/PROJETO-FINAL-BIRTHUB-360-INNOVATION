import assert from "node:assert/strict";
import test from "node:test";
import { JobCheckService } from "../job-check-service.js";

type FakeJob = {
  getState: () => Promise<string>;
  remove: () => Promise<void>;
  retry?: () => Promise<unknown>;
};

test("JobCheckService.retryFailedJobs benchmark", async () => {
  const jobCount = 1000;
  let activeRetries = 0;

  const failedJobs: FakeJob[] = Array.from({ length: jobCount }).map((_, i) => ({
    retry: async () => {
      activeRetries += 1;
      // Simulate I/O delay
      await new Promise(resolve => setTimeout(resolve, 1));
      activeRetries -= 1;
    },
    remove: async () => undefined,
    getState: async () => "failed"
  }));

  const queue: any = {
    getJobCountByTypes: async () => 0,
    getFailed: async () => failedJobs,
    getJob: async () => null,
    close: async () => undefined,
  };

  const queueFactory = () => queue;
  const alertService: any = { sendAlert: async () => {} };
  const service = new JobCheckService(alertService, queueFactory);

  const start = performance.now();
  const result = await service.retryFailedJobs("LEAD_ENRICHMENT");
  const end = performance.now();

  console.log(`Time taken for ${jobCount} jobs: ${end - start}ms`);
  assert.equal(result.retried, jobCount);
});
