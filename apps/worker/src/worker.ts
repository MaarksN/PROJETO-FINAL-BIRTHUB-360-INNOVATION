/* eslint-disable */
// @ts-nocheck
/* eslint-disable */
// @ts-nocheck
import { getWorkerConfig } from "@birthub/config";
import { createLogger } from "@birthub/logger";
import { Queue, Worker } from "bullmq";
import { Redis } from "ioredis";

import { persistAgentHandoff } from "./agents/handoffs.js";
import { executeManifestAgentRuntime } from "./agents/runtime.js";
import {
  WorkflowRunner,
  type WorkflowExecutionJobPayload,
  type WorkflowTriggerJobPayload,
  workflowQueueNames
} from "./engine/runner.js";
import { executeConnectorRuntimeAction } from "./integrations/connectors.runtime.js";
import { syncOrganizationToHubspot } from "./integrations/hubspot.js";
import { DynamicRateLimiter } from "./lib/rate-limiter.js";
import {
  emailQueueName,
  processEmailNotificationJob,
  type EmailNotificationJobPayload
} from "./notifications/emailQueue.js";
import { getQueueNameForPriority } from "./queues/agentQueue.js";
import {
  outboundWebhookQueueName,
  processOutboundWebhookJob,
  type OutboundWebhookJobPayload
} from "./webhooks/outbound.js";
import { createBillingLockResolver } from "./worker.billing.js";
import {
  persistExecutionFinished,
  persistExecutionStarted
} from "./worker.execution-state.js";
import type { CrmSyncJobPayload } from "./worker.job-validation.js";
import { createJobProcessor, resolveOrganizationReference } from "./worker.process-job.js";

export { validateLegacyTaskJob } from "./worker.job-validation.js";

const logger = createLogger("worker");
const crmSyncQueueName = "engagement.crm-sync";

export interface WorkerRuntime {
  close: () => Promise<void>;
  connection: Redis;
  workers: Worker[];
}

export function createBirthHubWorker(): WorkerRuntime {
  const config = getWorkerConfig();
  const connection = new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: null
  });
  const bullConnection = connection as never;
  const workflowExecutionQueue = new Queue<WorkflowExecutionJobPayload>(
    workflowQueueNames.execution,
    {
      connection: bullConnection,
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          delay: 1000,
          type: "exponential"
        },
        removeOnComplete: {
          count: 500
        },
        removeOnFail: {
          count: 500
        }
      }
    }
  );
  const emailQueue = new Queue<EmailNotificationJobPayload>(emailQueueName, {
    connection: bullConnection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        delay: 1_000,
        type: "exponential"
      },
      removeOnComplete: {
        count: 200
      },
      removeOnFail: {
        count: 200
      }
    }
  });
  const outboundWebhookQueue = new Queue<OutboundWebhookJobPayload>(outboundWebhookQueueName, {
    connection: bullConnection,
    defaultJobOptions: {
      attempts: 5,
      backoff: {
        delay: 1_500,
        type: "exponential"
      },
      removeOnComplete: {
        count: 300
      },
      removeOnFail: {
        count: 300
      }
    }
  });
  const dynamicRateLimiter = new DynamicRateLimiter(connection);
  const workflowRunner = new WorkflowRunner(workflowExecutionQueue, {
    httpRequestRateLimiter: dynamicRateLimiter,
    agentExecutor: {
      execute: async ({ agentId, contextSummary, input }) => {
        const tenantId = (input.tenantId as string | undefined) ?? "default-tenant";
        const organization = await resolveOrganizationReference(tenantId);
        const executionId = `workflow-agent:${Date.now()}:${agentId}`;

        await persistExecutionStarted({
          agentId,
          executionId,
          inputPayload: {
            ...input,
            workflowContextSummary: contextSummary
          },
          organizationId: organization?.id ?? null,
          source: "WORKFLOW",
          tenantId,
          userId: null
        });

        try {
          const runtimeResult = await executeManifestAgentRuntime({
            agentId,
            catalogAgentId: agentId,
            contextSummary,
            executionId,
            input: {
              ...input,
              workflowContextSummary: contextSummary
            },
            organizationId: organization?.id ?? null,
            redis: connection,
            source: "WORKFLOW",
            tenantId,
            userId: null
          });

          await persistExecutionFinished({
            executionId,
            metadata: runtimeResult.metadata,
            output: runtimeResult.output,
            outputHash: runtimeResult.outputHash,
            status: runtimeResult.status
          });

          return runtimeResult.output;
        } catch (error) {
          await persistExecutionFinished({
            errorMessage: error instanceof Error ? error.message : "Workflow agent execution failed",
            executionId,
            status: "FAILED"
          });
          throw error;
        }
      }
    },
    connectorExecutor: {
      execute: async ({ action, executionId, tenantId, workflowId }) =>
        executeConnectorRuntimeAction({
          action,
          executionId,
          tenantId,
          workflowId
        })
    },
    handoffExecutor: {
      execute: async (args) =>
        persistAgentHandoff({
          context: args.context,
          contextSummary: args.contextSummary,
          correlationId: args.correlationId,
          executionId: args.executionId,
          sourceAgentId: args.sourceAgentId,
          summary: args.summary,
          targetAgentId: args.targetAgentId,
          tenantId: args.tenantId,
          ...(args.threadId ? { threadId: args.threadId } : {}),
          workflowId: args.workflowId
        })
    },
    notificationDispatcher: {
      send: async (message) => {
        logger.info({ message }, "Workflow notification dispatched");
      }
    }
  });

  const resolveBillingLock = createBillingLockResolver({
    billingGracePeriodDays: config.BILLING_GRACE_PERIOD_DAYS,
    billingStatusCacheTtlSeconds: config.BILLING_STATUS_CACHE_TTL_SECONDS,
    connection
  });
  const processJob = createJobProcessor({
    config,
    connection,
    emailQueue,
    outboundWebhookQueue,
    resolveBillingLock
  });

  const queueNames = [
    config.QUEUE_NAME,
    getQueueNameForPriority("high"),
    getQueueNameForPriority("normal"),
    getQueueNameForPriority("low")
  ];

  const workers = queueNames.map((queueName) =>
    new Worker(
      queueName,
      async (job) =>
        processJob({
          data: job.data,
          queueName,
          ...(job.id !== undefined ? { id: job.id } : {})
        }),
      {
        concurrency: config.WORKER_CONCURRENCY,
        connection: bullConnection
      }
    )
  );

  workers.push(
    new Worker(
      workflowQueueNames.execution,
      async (job) =>
        workflowRunner.processExecutionJob(job.data as WorkflowExecutionJobPayload),
      {
        concurrency: config.WORKER_CONCURRENCY,
        connection: bullConnection
      }
    )
  );

  workers.push(
    new Worker(
      workflowQueueNames.trigger,
      async (job) =>
        workflowRunner.processTriggerJob(job.data as WorkflowTriggerJobPayload),
      {
        concurrency: config.WORKER_CONCURRENCY,
        connection: bullConnection
      }
    )
  );

  workers.push(
    new Worker(
      emailQueueName,
      async (job) => processEmailNotificationJob(job.data as EmailNotificationJobPayload),
      {
        concurrency: Math.max(1, Math.floor(config.WORKER_CONCURRENCY / 2)),
        connection: bullConnection
      }
    )
  );

  workers.push(
    new Worker(
      outboundWebhookQueueName,
      async (job) => processOutboundWebhookJob(job.data as OutboundWebhookJobPayload, { redis: connection }),
      {
        concurrency: config.WORKER_CONCURRENCY,
        connection: bullConnection
      }
    )
  );

  workers.push(
    new Worker(
      crmSyncQueueName,
      async (job) => {
        const payload = job.data as CrmSyncJobPayload;
        await syncOrganizationToHubspot({
          organizationId: payload.organizationId,
          tenantId: payload.tenantId
        });
      },
      {
        concurrency: Math.max(1, Math.floor(config.WORKER_CONCURRENCY / 2)),
        connection: bullConnection
      }
    )
  );

  workers.forEach((worker) => {
    worker.on("failed", (job, error) => {
      logger.error(
        {
          error,
          jobId: job?.id,
          queue: worker.name
        },
        "Worker job failed"
      );
    });
  });

  const close = async (): Promise<void> => {
    await Promise.all(workers.map((worker) => worker.close()));
    await workflowExecutionQueue.close();
    await emailQueue.close();
    await outboundWebhookQueue.close();
    await connection.quit();
  };

  return {
    close,
    connection,
    workers
  };
}
