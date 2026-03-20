// [SOURCE] CI-TS-001
import { Queue, Worker, QueueOptions, WorkerOptions, ConnectionOptions } from 'bullmq';
import { QueueName } from '@birthub/shared-types';
import { QUEUE_CONFIG } from './src/definitions';

export * from './src/definitions';
export * from './src/job-context';

const connection: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const createQueue = (name: QueueName, options?: QueueOptions) => {
  const queueConfig = QUEUE_CONFIG[name];
  const defaultJobOptions = {
    attempts: queueConfig?.attempts || 3,
    ...(queueConfig?.backoff !== undefined ? { backoff: queueConfig.backoff } : {}),
    ...(queueConfig?.priority !== undefined ? { priority: queueConfig.priority } : {}),
  };

  return new Queue(name, {
    connection,
    defaultJobOptions,
    ...options,
  });
};

export const createWorker = (name: QueueName, processor: any, options?: WorkerOptions) => {
  return new Worker(name, processor, {
    connection,
    concurrency: 5,
    ...options,
  });
};
