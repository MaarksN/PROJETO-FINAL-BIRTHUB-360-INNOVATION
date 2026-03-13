import type { ApiConfig } from "@birthub/config";
import { Queue } from "bullmq";
import { Redis } from "ioredis";

export const engagementQueueNames = {
  crmSync: "engagement.crm-sync",
  outboundWebhook: "engagement.outbound-webhook"
} as const;

export interface CrmSyncJobPayload {
  kind: "company-upsert" | "health-score-sync";
  organizationId: string;
  tenantId: string;
}

export interface OutboundWebhookJobPayload {
  attempt?: number;
  endpointId: string;
  organizationId: string;
  payload: Record<string, unknown>;
  tenantId: string;
  topic: string;
}

let redisConnection: Redis | undefined;
const queues = new Map<string, Queue<unknown>>();

function getRedisConnection(config: ApiConfig): Redis {
  if (!redisConnection) {
    redisConnection = new Redis(config.REDIS_URL, {
      maxRetriesPerRequest: null
    });
  }

  return redisConnection;
}

function getQueue<TPayload>(config: ApiConfig, queueName: string): Queue<TPayload> {
  const existing = queues.get(queueName);

  if (existing) {
    return existing as Queue<TPayload>;
  }

  const queue = new Queue<TPayload>(queueName, {
    connection: getRedisConnection(config)
  });
  queues.set(queueName, queue as Queue<unknown>);
  return queue;
}

export async function enqueueCrmSync(
  config: ApiConfig,
  payload: CrmSyncJobPayload
): Promise<void> {
  await getQueue<CrmSyncJobPayload>(config, engagementQueueNames.crmSync).add(
    payload.kind,
    payload,
    {
      removeOnComplete: {
        count: 100
      },
      removeOnFail: {
        count: 250
      }
    }
  );
}

export async function enqueueOutboundWebhook(
  config: ApiConfig,
  payload: OutboundWebhookJobPayload
): Promise<void> {
  await getQueue<OutboundWebhookJobPayload>(
    config,
    engagementQueueNames.outboundWebhook
  ).add(payload.topic, payload, {
    attempts: 5,
    backoff: {
      delay: 1_500,
      type: "exponential"
    },
    removeOnComplete: {
      count: 200
    },
    removeOnFail: {
      count: 300
    }
  });
}
