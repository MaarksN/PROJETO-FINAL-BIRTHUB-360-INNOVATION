import type { ApiConfig } from "@birthub/config";
import { taskJobSchema } from "@birthub/config";
import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { z } from "zod";

type TaskJob = z.infer<typeof taskJobSchema>;

let redisConnection: Redis | undefined;
const queueCache = new Map<string, Queue<TaskJob>>();

function getRedisConnection(config: ApiConfig): Redis {
  if (!redisConnection) {
    redisConnection = new Redis(config.REDIS_URL, {
      maxRetriesPerRequest: null
    });
  }

  return redisConnection;
}

export function getTaskQueue(config: ApiConfig): Queue<TaskJob> {
  const existingQueue = queueCache.get(config.QUEUE_NAME);

  if (existingQueue) {
    return existingQueue;
  }

  const queue = new Queue<TaskJob>(config.QUEUE_NAME, {
    connection: getRedisConnection(config)
  });

  queueCache.set(config.QUEUE_NAME, queue);
  return queue;
}

export async function enqueueTask(config: ApiConfig, payload: TaskJob): Promise<{ jobId: string }> {
  const validated = taskJobSchema.parse(payload);
  const job = await getTaskQueue(config).add(validated.type, validated, {
    removeOnComplete: 100,
    removeOnFail: 500
  });

  return {
    jobId: String(job.id)
  };
}

export async function pingRedis(config: ApiConfig): Promise<{ status: "up" | "down"; message?: string }> {
  try {
    const pong = await getRedisConnection(config).ping();
    return {
      status: pong === "PONG" ? "up" : "down"
    };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "Unknown Redis error",
      status: "down"
    };
  }
}
