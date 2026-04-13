import { performance } from "node:perf_hooks";

import type { Job, JobsOptions, Queue, Worker } from "bullmq";

import { createLogger, incrementCounter, observeHistogram } from "@birthub/logger";

import {
  DEFAULT_REMOVE_ON_COMPLETE,
  DEFAULT_REMOVE_ON_FAIL
} from "./definitions.js";
import type {
  DlqJobPayload,
  JobContext,
  QueueConfig,
  QueueProcessor,
  RuntimeTelemetry,
  RuntimeWorkerHandler,
  SerializedJobOptions
} from "./types.js";

const logger = createLogger("queue-runtime-worker");

type JobRecord = Record<string, unknown>;

function asRecord(value: unknown): JobRecord | null {
  return typeof value === "object" && value !== null ? (value as JobRecord) : null;
}

function readString(source: JobRecord | null, key: string): string | undefined {
  const value = source?.[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function extractJobContext<DataType, ResultType>(
  queueName: string,
  job: Job<DataType, ResultType, string>
): JobContext {
  const payload = asRecord(job.data);
  const nestedContext = asRecord(payload?.context);
  const jobId = String(job.id ?? "unknown");

  return {
    actorId: readString(nestedContext, "actorId") ?? readString(payload, "userId"),
    attemptsMade: job.attemptsMade,
    jobId,
    organizationId:
      readString(nestedContext, "organizationId") ?? readString(payload, "organizationId"),
    queue: queueName,
    requestId: readString(payload, "requestId"),
    tenantId: readString(payload, "tenantId") ?? readString(nestedContext, "tenantId"),
    traceId:
      readString(payload, "traceId") ??
      readString(payload, "requestId") ??
      readString(nestedContext, "jobId") ??
      jobId,
    userId: readString(payload, "userId")
  };
}

function emitTelemetry(input: RuntimeTelemetry): void {
  incrementCounter(
    "birthub_queue_jobs_total",
    {
      queue: input.queue,
      status: input.status
    },
    1,
    "Total queue jobs processed grouped by queue and status."
  );
  observeHistogram(
    "birthub_queue_job_duration_ms",
    input.duration,
    {
      queue: input.queue,
      status: input.status
    },
    {
      help: "Queue job duration in milliseconds grouped by queue and status."
    }
  );
}

export function createRuntimeWorkerProcessor<DataType = unknown, ResultType = unknown>(
  queueName: string,
  processor: QueueProcessor<DataType, ResultType>
): RuntimeWorkerHandler<DataType, ResultType> {
  return async (job) => {
    const startedAt = performance.now();
    const context = extractJobContext(queueName, job);

    try {
      const result = await processor(job.data, context, job);
      const duration = performance.now() - startedAt;
      emitTelemetry({
        duration,
        jobId: context.jobId,
        queue: queueName,
        status: "success",
        ...(context.tenantId ? { tenantId: context.tenantId } : {}),
        ...(context.traceId ? { traceId: context.traceId } : {})
      });
      logger.info(
        {
          duration,
          jobId: context.jobId,
          queue: queueName,
          status: "success",
          tenantId: context.tenantId,
          traceId: context.traceId
        },
        "Queue job processed"
      );
      return result;
    } catch (error) {
      const duration = performance.now() - startedAt;
      emitTelemetry({
        duration,
        jobId: context.jobId,
        queue: queueName,
        status: "failed",
        ...(context.tenantId ? { tenantId: context.tenantId } : {}),
        ...(context.traceId ? { traceId: context.traceId } : {})
      });
      logger.error(
        {
          duration,
          err: error,
          jobId: context.jobId,
          queue: queueName,
          status: "failed",
          tenantId: context.tenantId,
          traceId: context.traceId
        },
        "Queue job failed"
      );
      throw error;
    }
  };
}

export function resolveConfiguredAttempts(job: Job<unknown, unknown, string>): number {
  return typeof job.opts.attempts === "number" && job.opts.attempts > 0 ? job.opts.attempts : 1;
}

export function isFinalAttempt(job: Job<unknown, unknown, string>): boolean {
  return job.attemptsMade >= resolveConfiguredAttempts(job);
}

export function toSerializedJobOptions(job: Job<unknown, unknown, string>): SerializedJobOptions {
  return {
    attempts: typeof job.opts.attempts === "number" ? job.opts.attempts : undefined,
    backoff: job.opts.backoff,
    delay: typeof job.opts.delay === "number" ? job.opts.delay : undefined,
    priority: typeof job.opts.priority === "number" ? job.opts.priority : undefined,
    removeOnComplete: job.opts.removeOnComplete ?? DEFAULT_REMOVE_ON_COMPLETE,
    removeOnFail: job.opts.removeOnFail ?? DEFAULT_REMOVE_ON_FAIL
  };
}

export function buildDlqPayload<DataType>(
  queueName: string,
  job: Job<DataType, unknown, string>,
  error: Error,
  context: JobContext
): DlqJobPayload<DataType> {
  return {
    configuredAttempts: resolveConfiguredAttempts(job),
    context,
    errorMessage: error.message,
    failedAt: new Date().toISOString(),
    originalJobId: job.id !== undefined ? String(job.id) : null,
    originalJobName: job.name,
    originalOptions: toSerializedJobOptions(job as Job<unknown, unknown, string>),
    originalQueue: queueName,
    payload: job.data
  };
}

export async function forwardToDlq<DataType>(
  queueName: string,
  dlqQueue: Queue<DlqJobPayload<DataType>, void, string>,
  job: Job<DataType, unknown, string>,
  error: Error
): Promise<void> {
  const context = extractJobContext(queueName, job);
  const payload = buildDlqPayload(queueName, job, error, context);
  await dlqQueue.add("dead-letter", payload, {
    jobId: `${queueName}:${String(job.id ?? "unknown")}:${job.attemptsMade}`,
    removeOnComplete: DEFAULT_REMOVE_ON_COMPLETE,
    removeOnFail: DEFAULT_REMOVE_ON_FAIL
  });

  logger.error(
    {
      dlqQueue: dlqQueue.name,
      jobId: context.jobId,
      queue: queueName,
      tenantId: context.tenantId,
      traceId: context.traceId
    },
    "Queue job moved to DLQ"
  );
}

export function registerRuntimeWorker<DataType = unknown>(
  worker: Worker<DataType, unknown, string>,
  queueConfig: QueueConfig,
  dlqQueue: Queue<DlqJobPayload<DataType>, void, string>
): void {
  worker.on("failed", (job, error) => {
    if (!job || !isFinalAttempt(job)) {
      return;
    }

    const workerError =
      error instanceof Error ? error : new Error("Unknown queue worker failure");

    void forwardToDlq(queueConfig.name, dlqQueue, job, workerError).catch((dlqError) => {
      logger.error(
        {
          dlqQueue: dlqQueue.name,
          err: dlqError,
          jobId: job.id,
          queue: queueConfig.name
        },
        "Failed to forward job to DLQ"
      );
    });
  });

  worker.on("error", (error) => {
    logger.error(
      {
        err: error,
        queue: queueConfig.name
      },
      "Queue worker emitted an error"
    );
  });
}

export function mergeQueueJobOptions(
  queueConfig: QueueConfig,
  input?: JobsOptions
): JobsOptions {
  const baseBackoff =
    typeof queueConfig.backoff === "number"
      ? {
          delay: queueConfig.backoff,
          type: "exponential" as const
        }
      : queueConfig.backoff;

  return {
    attempts: queueConfig.attempts ?? 1,
    ...(baseBackoff ? { backoff: baseBackoff } : {}),
    ...(queueConfig.priority !== undefined ? { priority: queueConfig.priority } : {}),
    removeOnComplete: queueConfig.removeOnComplete ?? DEFAULT_REMOVE_ON_COMPLETE,
    removeOnFail: queueConfig.removeOnFail ?? DEFAULT_REMOVE_ON_FAIL,
    ...input
  };
}
