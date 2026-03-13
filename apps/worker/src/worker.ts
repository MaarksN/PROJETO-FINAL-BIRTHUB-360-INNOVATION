import { getWorkerConfig, taskJobSchema } from "@birthub/config";
import { prisma } from "@birthub/database";
import { createLogger } from "@birthub/logger";
import { Queue, Worker } from "bullmq";
import { createHash, createHmac } from "node:crypto";
import { z } from "zod";
import { Redis } from "ioredis";

import {
  WorkflowRunner,
  type WorkflowExecutionJobPayload,
  type WorkflowTriggerJobPayload,
  workflowQueueNames
} from "./engine/runner.js";
import { PlanExecutor } from "./executors/planExecutor.js";
import { getQueueNameForPriority } from "./queues/agentQueue.js";
import { executeTenantJob } from "./tenant-execution.js";

const logger = createLogger("worker");

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function hashPayload(payload: string): string {
  return createHash("sha256").update(payload, "utf8").digest("hex");
}

export function validateLegacyTaskJob(input: {
  fallbackSecret: string;
  jobId: string;
  payload: z.infer<typeof taskJobSchema>;
  tenantSecret?: string;
}): string {
  const context = input.payload.context ?? {
    actorId: input.payload.userId ?? "system",
    jobId: input.jobId,
    scopedAt: new Date().toISOString(),
    tenantId: input.payload.tenantId ?? "default-tenant"
  };

  if (!input.payload.tenantId || input.payload.tenantId !== context.tenantId) {
    throw new Error("JOB_CONTEXT_TENANT_MISMATCH");
  }

  if (!input.payload.userId || input.payload.userId !== context.actorId) {
    throw new Error("JOB_CONTEXT_ACTOR_MISMATCH");
  }

  if (context.jobId !== input.jobId) {
    throw new Error("JOB_CONTEXT_ID_MISMATCH");
  }

  const signedPayload = JSON.stringify({
    context,
    payload: input.payload.payload,
    requestId: input.payload.requestId,
    tenantId: input.payload.tenantId,
    type: input.payload.type,
    userId: input.payload.userId,
    version: input.payload.version
  });
  const expectedSignature = signPayload(
    signedPayload,
    input.tenantSecret ?? input.fallbackSecret
  );

  if (input.payload.signature !== "unsigned" && expectedSignature !== input.payload.signature) {
    throw new Error("JOB_SIGNATURE_INVALID");
  }

  return input.payload.tenantId;
}

export interface WorkerRuntime {
  close: () => Promise<void>;
  connection: Redis;
  workers: Worker[];
}

const agentExecutionJobSchema = z
  .object({
    agentId: z.string().min(1),
    executionId: z.string().min(1),
    input: z.record(z.string(), z.unknown()),
    tenantId: z.string().min(1),
    toolCalls: z
      .array(
        z.object({
          input: z.unknown(),
          tool: z.string().min(1)
        })
      )
      .optional()
  })
  .strict();

function billingCacheKey(tenantReference: string): string {
  return `billing-status:${tenantReference}`;
}

function calculateGraceBoundary(updatedAt: Date, gracePeriodDays: number): Date {
  return new Date(updatedAt.getTime() + gracePeriodDays * 24 * 60 * 60 * 1000);
}

export function createBirthHubWorker(): WorkerRuntime {
  const config = getWorkerConfig();
  const connection = new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: null
  });
  const executor = new PlanExecutor({ redis: connection });
  const workflowExecutionQueue = new Queue<WorkflowExecutionJobPayload>(
    workflowQueueNames.execution,
    {
      connection,
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
  const workflowRunner = new WorkflowRunner(workflowExecutionQueue);

  const resolveBillingLock = async (
    tenantReference: string
  ): Promise<{ locked: boolean; status: string | null }> => {
    const cached = await connection.get(billingCacheKey(tenantReference));

    if (cached) {
      return JSON.parse(cached) as { locked: boolean; status: string | null };
    }

    const organization = await prisma.organization.findFirst({
      include: {
        subscriptions: {
          orderBy: {
            updatedAt: "desc"
          },
          take: 1
        }
      },
      where: {
        OR: [{ id: tenantReference }, { tenantId: tenantReference }]
      }
    });
    const subscription = organization?.subscriptions[0] ?? null;
    const status = subscription?.status ?? null;
    const graceBoundary =
      subscription && status === "past_due"
        ? subscription.gracePeriodEndsAt ?? calculateGraceBoundary(subscription.updatedAt, config.BILLING_GRACE_PERIOD_DAYS)
        : null;
    const locked = Boolean(status === "past_due" && graceBoundary && graceBoundary.getTime() <= Date.now());
    const payload = {
      locked,
      status
    };

    await connection.set(
      billingCacheKey(tenantReference),
      JSON.stringify(payload),
      "EX",
      config.BILLING_STATUS_CACHE_TTL_SECONDS
    );

    return payload;
  };

  const processJob = async (job: {
    id?: string | number;
    data: unknown;
    queueName: string;
  }) => {
    const jobId = String(job.id ?? "unknown");
    const isLegacyJob = job.queueName === config.QUEUE_NAME;
    const executionPayload = isLegacyJob
      ? await (async () => {
          const payload = taskJobSchema.parse(job.data);
          const tenantSecret = await prisma.jobSigningSecret.findUnique({
            where: {
              organizationId: payload.tenantId ?? "default-tenant"
            }
          });
          const tenantId = validateLegacyTaskJob({
            fallbackSecret: config.JOB_HMAC_GLOBAL_SECRET,
            jobId,
            payload,
            tenantSecret: tenantSecret?.secret
          });

          return {
            agentId: payload.type,
            executionId: `${payload.requestId}:${jobId}`,
            input: payload.payload,
            approvalRequired: payload.approvalRequired,
            executionMode: payload.executionMode,
            requestId: payload.requestId,
            tenantId,
            toolCalls: undefined
          };
        })()
      : (() => {
          const payload = agentExecutionJobSchema.parse(job.data);
          return {
            ...payload,
            approvalRequired: false,
            executionMode: "LIVE" as const,
            requestId: payload.executionId
          };
        })();

    return executeTenantJob(
      {
        requestId: executionPayload.requestId,
        tenantId: executionPayload.tenantId,
        userId: executionPayload.agentId
      },
      async () => {
        const billing = await resolveBillingLock(executionPayload.tenantId);
        if (billing.locked) {
          logger.warn(
            {
              executionId: executionPayload.executionId,
              status: billing.status,
              tenantId: executionPayload.tenantId
            },
            "Worker aborted execution due to billing lock"
          );

          return {
            blocked: true,
            blockedAt: new Date().toISOString(),
            reason: "billing_past_due"
          };
        }

        logger.info(
          {
            executionId: executionPayload.executionId,
            jobId: job.id,
            queue: job.queueName
          },
          "Worker started job"
        );

        if (executionPayload.executionMode === "DRY_RUN") {
          const output = JSON.stringify(
            {
              logs: ["Simulating LLM call...", "Returning MOCK_DATA"],
              mode: executionPayload.executionMode
            },
            null,
            2
          );

          return {
            completedAt: new Date().toISOString(),
            executionId: executionPayload.executionId,
            outputHash: hashPayload(output),
            requestId: executionPayload.requestId,
            status: "COMPLETED"
          };
        }

        if (executionPayload.approvalRequired) {
          const output = JSON.stringify(
            {
              message: "Awaiting human approval before final output."
            },
            null,
            2
          );

          return {
            completedAt: new Date().toISOString(),
            executionId: executionPayload.executionId,
            outputHash: hashPayload(output),
            requestId: executionPayload.requestId,
            status: "WAITING_APPROVAL"
          };
        }

        const executionResult = await executor.execute({
          agentId: executionPayload.agentId,
          executionId: executionPayload.executionId,
          input: executionPayload.input,
          tenantId: executionPayload.tenantId,
          toolCalls: executionPayload.toolCalls
        });

        logger.info(
          {
            executionId: executionPayload.executionId,
            jobId: job.id,
            steps: executionResult.steps.length
          },
          "Worker finished job"
        );

        return {
          completedAt: new Date().toISOString(),
          executionId: executionResult.executionId,
          outputHash: hashPayload(JSON.stringify(executionResult)),
          requestId: executionPayload.requestId
        };
      }
    );
  };

  const queueNames = [
    config.QUEUE_NAME,
    getQueueNameForPriority("high"),
    getQueueNameForPriority("normal"),
    getQueueNameForPriority("low")
  ];

  const workers = queueNames.map((queueName) =>
    new Worker(
      queueName,
      async (job) => processJob({ data: job.data, id: job.id, queueName }),
      {
        concurrency: config.WORKER_CONCURRENCY,
        connection
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
    await connection.quit();
  };

  return {
    close,
    connection,
    workers
  };
}
