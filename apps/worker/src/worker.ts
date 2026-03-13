import { getWorkerConfig, taskJobSchema } from "@birthub/config";
import { prisma, runWithTenantContext } from "@birthub/database";
import { createLogger, runWithLogContext } from "@birthub/logger";
import { Worker } from "bullmq";
import { createHmac } from "node:crypto";
import { z } from "zod";
import { Redis } from "ioredis";

import { PlanExecutor } from "./executors/planExecutor.js";
import { getQueueNameForPriority } from "./queues/agentQueue.js";

const logger = createLogger("worker");

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function validateLegacyTaskJob(input: {
  fallbackSecret: string;
  jobId: string;
  payload: z.infer<typeof taskJobSchema>;
  tenantSecret?: string;
}): string {
  if (!input.payload.tenantId || input.payload.tenantId !== input.payload.context.tenantId) {
    throw new Error("JOB_CONTEXT_TENANT_MISMATCH");
  }

  if (!input.payload.userId || input.payload.userId !== input.payload.context.actorId) {
    throw new Error("JOB_CONTEXT_ACTOR_MISMATCH");
  }

  if (input.payload.context.jobId !== input.jobId) {
    throw new Error("JOB_CONTEXT_ID_MISMATCH");
  }

  const signedPayload = JSON.stringify({
    context: input.payload.context,
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

  if (expectedSignature !== input.payload.signature) {
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

export async function executeTenantJob<T>(input: {
  requestId: string;
  tenantId: string;
  userId: string | null;
}, handler: () => Promise<T>): Promise<T> {
  return runWithLogContext(
    {
      requestId: input.requestId,
      tenantId: input.tenantId,
      userId: input.userId
    },
    () =>
      runWithTenantContext(
        {
          source: "system",
          tenantId: input.tenantId,
          userId: input.userId
        },
        handler
      )
  );
}

export function createBirthHubWorker(): WorkerRuntime {
  const config = getWorkerConfig();
  const connection = new Redis(config.REDIS_URL, {
    maxRetriesPerRequest: null
  });
  const executor = new PlanExecutor({ redis: connection });

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
              organizationId: payload.context.tenantId
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
            requestId: payload.requestId,
            tenantId,
            toolCalls: undefined
          };
        })()
      : (() => {
          const payload = agentExecutionJobSchema.parse(job.data);
          return {
            ...payload,
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
        logger.info(
          {
            executionId: executionPayload.executionId,
            jobId: job.id,
            queue: job.queueName
          },
          "Worker started job"
        );

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
