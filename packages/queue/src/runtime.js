import { Queue, QueueEvents, Worker } from "bullmq";
import { Redis } from "ioredis";
import { createLogger } from "@birthub/logger";
import { QueueDlqClient } from "./dlq.js";
import { DEFAULT_REMOVE_ON_COMPLETE, DEFAULT_REMOVE_ON_FAIL, QUEUE_CONFIG } from "./definitions.js";
import { createRuntimeWorkerProcessor, mergeQueueJobOptions, registerRuntimeWorker } from "./worker.js";
const logger = createLogger("queue-runtime");
const DEFAULT_REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";
function createRedisConnection(redisUrl) {
    const connection = new Redis(redisUrl, {
        enableReadyCheck: true,
        lazyConnect: false,
        maxRetriesPerRequest: null
    });
    connection.on("error", (error) => {
        logger.error({
            err: error,
            redisUrl
        }, "Queue runtime Redis connection error");
    });
    return connection;
}
function resolveQueueName(config) {
    return typeof config === "string" ? config : config.name;
}
function resolveQueueConfig(config) {
    if (typeof config !== "string") {
        const defaults = QUEUE_CONFIG[config.name];
        return {
            ...defaults,
            attempts: defaults?.attempts ?? 1,
            ...(defaults?.backoff ? { backoff: defaults.backoff } : {}),
            ...(defaults?.removeOnComplete ? { removeOnComplete: defaults.removeOnComplete } : {}),
            ...(defaults?.removeOnFail ? { removeOnFail: defaults.removeOnFail } : {}),
            ...config
        };
    }
    const defaults = QUEUE_CONFIG[config];
    return {
        attempts: defaults?.attempts ?? 1,
        ...(defaults?.backoff ? { backoff: defaults.backoff } : {}),
        name: config,
        ...(defaults?.priority !== undefined ? { priority: defaults.priority } : {}),
        ...(defaults?.removeOnComplete ? { removeOnComplete: defaults.removeOnComplete } : {}),
        ...(defaults?.removeOnFail ? { removeOnFail: defaults.removeOnFail } : {})
    };
}
export class QueueBackpressureError extends Error {
    pendingJobs;
    threshold;
    constructor(pendingJobs, threshold) {
        super(`Queue backlog is ${pendingJobs} jobs (threshold ${threshold}).`);
        this.name = "QueueBackpressureError";
        this.pendingJobs = pendingJobs;
        this.threshold = threshold;
    }
}
export class TenantQueueRateLimitError extends Error {
    tenantId;
    threshold;
    constructor(tenantId, threshold) {
        super(`Tenant ${tenantId} exceeded the queue rate limit (${threshold}).`);
        this.name = "TenantQueueRateLimitError";
        this.tenantId = tenantId;
        this.threshold = threshold;
    }
}
export class QueueRuntime {
    connection;
    dlqClient;
    queueEvents = new Map();
    queues = new Map();
    workers = new Map();
    constructor(options = {}) {
        const redisUrl = typeof options === "string" ? options : (options.redisUrl ?? DEFAULT_REDIS_URL);
        this.connection = createRedisConnection(redisUrl);
        this.dlqClient = new QueueDlqClient(this);
    }
    get redis() {
        return this.connection;
    }
    get dlq() {
        return this.dlqClient;
    }
    createQueue(config) {
        const resolved = resolveQueueConfig(config);
        const existing = this.queues.get(resolved.name);
        if (existing) {
            return existing;
        }
        const queue = new Queue(resolved.name, {
            connection: this.connection,
            defaultJobOptions: mergeQueueJobOptions(resolved)
        });
        this.queues.set(resolved.name, queue);
        logger.info({ queue: resolved.name }, "Queue created");
        return queue;
    }
    createQueueEvents(config) {
        const queueName = resolveQueueName(config);
        const existing = this.queueEvents.get(queueName);
        if (existing) {
            return existing;
        }
        const queueEvents = new QueueEvents(queueName, {
            connection: this.connection
        });
        this.queueEvents.set(queueName, queueEvents);
        return queueEvents;
    }
    getDlqQueue(config) {
        const resolved = resolveQueueConfig(config);
        const dlqName = resolved.dlqName ?? `${resolved.name}.dlq`;
        const existing = this.queues.get(dlqName);
        if (existing) {
            return existing;
        }
        const queue = new Queue(dlqName, {
            connection: this.connection,
            defaultJobOptions: {
                attempts: 1,
                removeOnComplete: DEFAULT_REMOVE_ON_COMPLETE,
                removeOnFail: DEFAULT_REMOVE_ON_FAIL
            }
        });
        this.queues.set(dlqName, queue);
        return queue;
    }
    createWorker(config, processor) {
        const resolved = resolveQueueConfig(config);
        const existing = this.workers.get(resolved.name);
        if (existing) {
            return existing;
        }
        void this.createQueue(resolved);
        const dlqQueue = this.getDlqQueue(resolved);
        const worker = new Worker(resolved.name, createRuntimeWorkerProcessor(resolved.name, processor), {
            concurrency: resolved.concurrency ?? 1,
            connection: this.connection
        });
        registerRuntimeWorker(worker, resolved, dlqQueue);
        this.workers.set(resolved.name, worker);
        logger.info({
            concurrency: resolved.concurrency ?? 1,
            queue: resolved.name
        }, "Worker created");
        return worker;
    }
    async getQueueStats(config) {
        const queueName = resolveQueueName(config);
        const queue = this.createQueue(queueName);
        const counts = await queue.getJobCounts("active", "completed", "delayed", "failed", "paused", "prioritized", "waiting");
        return {
            active: counts.active ?? 0,
            completed: counts.completed ?? 0,
            delayed: counts.delayed ?? 0,
            failed: counts.failed ?? 0,
            paused: counts.paused ?? 0,
            pending: (counts.active ?? 0) +
                (counts.delayed ?? 0) +
                (counts.prioritized ?? 0) +
                (counts.waiting ?? 0),
            prioritized: counts.prioritized ?? 0,
            queueName,
            waiting: counts.waiting ?? 0
        };
    }
    async enqueue(request) {
        const queueConfig = resolveQueueConfig(request.queue);
        const queue = this.createQueue(queueConfig);
        if (request.tenantRateLimit && request.tenantId) {
            const keyPrefix = request.tenantRateLimit.keyPrefix ?? "tenant-queue-rate";
            const key = `${keyPrefix}:${request.tenantId}`;
            const current = await this.connection.incr(key);
            if (current === 1) {
                await this.connection.expire(key, request.tenantRateLimit.windowSeconds);
            }
            if (current > request.tenantRateLimit.max) {
                throw new TenantQueueRateLimitError(request.tenantId, request.tenantRateLimit.max);
            }
        }
        const stats = await this.getQueueStats(queueConfig.name);
        if (typeof request.backpressureThreshold === "number" &&
            stats.pending >= request.backpressureThreshold) {
            throw new QueueBackpressureError(stats.pending, request.backpressureThreshold);
        }
        const job = await queue.add(request.jobName, request.data, mergeQueueJobOptions(queueConfig, request.options));
        logger.info({
            jobId: String(job.id),
            jobName: request.jobName,
            queue: queueConfig.name
        }, "Queue job enqueued");
        return {
            jobId: String(job.id),
            pendingJobs: stats.pending + 1,
            queue: queueConfig.name
        };
    }
    async upsertRepeatableJob(request) {
        const queueConfig = resolveQueueConfig(request.queue);
        const queue = this.createQueue(queueConfig);
        await queue.add(request.jobName, request.data, {
            ...mergeQueueJobOptions(queueConfig, request.options),
            ...(request.jobId ? { jobId: request.jobId } : {}),
            repeat: request.repeat
        });
        logger.info({
            jobId: request.jobId,
            jobName: request.jobName,
            pattern: request.repeat.pattern,
            queue: queueConfig.name
        }, "Repeatable queue job upserted");
    }
    async ping() {
        return this.connection.ping();
    }
    async claimDeduplicationKey(key, ttlSeconds) {
        const result = await this.connection.set(key, "1", "EX", ttlSeconds, "NX");
        return result === "OK";
    }
    listQueues() {
        return Array.from(this.queues.values()).filter((queue) => !queue.name.endsWith(".dlq"));
    }
    listDlqQueues() {
        return Array.from(this.queues.values()).filter((queue) => queue.name.endsWith(".dlq"));
    }
    listWorkers() {
        return Array.from(this.workers.values());
    }
    async close() {
        await Promise.all(Array.from(this.workers.values()).map((worker) => worker.close()));
        this.workers.clear();
        await Promise.all(Array.from(this.queueEvents.values()).map((queueEvents) => queueEvents.close()));
        this.queueEvents.clear();
        await Promise.all(Array.from(this.queues.values()).map((queue) => queue.close()));
        this.queues.clear();
        if (this.connection.status !== "end") {
            await this.connection.quit();
        }
    }
}
export class QueueClient {
    runtimes = new Map();
    getRuntime(redisUrl) {
        const key = redisUrl ?? DEFAULT_REDIS_URL;
        const existing = this.runtimes.get(key);
        if (existing) {
            return existing;
        }
        const runtime = new QueueRuntime({ redisUrl: key });
        this.runtimes.set(key, runtime);
        return runtime;
    }
    createQueue(config, options) {
        return this.getRuntime(options?.redisUrl).createQueue(config);
    }
    createWorker(config, processor, options) {
        return this.getRuntime(options?.redisUrl).createWorker(config, processor);
    }
    createQueueEvents(config, options) {
        return this.getRuntime(options?.redisUrl).createQueueEvents(config);
    }
    async enqueue(request) {
        return this.getRuntime(request.redisUrl).enqueue(request);
    }
    async getQueueStats(config, options) {
        return this.getRuntime(options?.redisUrl).getQueueStats(config);
    }
    getDlq(config, options) {
        return this.getRuntime(options?.redisUrl).getDlqQueue(config);
    }
    async listFailedJobs(config, options) {
        return this.getRuntime(options?.redisUrl).dlq.listFailedJobs(config, options?.start, options?.end);
    }
    async retryDlqJob(config, dlqJobId, options) {
        return this.getRuntime(options?.redisUrl).dlq.retryJob(config, dlqJobId);
    }
    async getDlqMetrics(config, options) {
        return this.getRuntime(options?.redisUrl).dlq.getMetrics(config);
    }
    async upsertRepeatableJob(request) {
        return this.getRuntime(request.redisUrl).upsertRepeatableJob(request);
    }
    async ping(options) {
        return this.getRuntime(options?.redisUrl).ping();
    }
    async claimDeduplicationKey(key, ttlSeconds, options) {
        return this.getRuntime(options?.redisUrl).claimDeduplicationKey(key, ttlSeconds);
    }
    async close(redisUrl) {
        if (redisUrl) {
            const runtime = this.runtimes.get(redisUrl);
            if (!runtime) {
                return;
            }
            await runtime.close();
            this.runtimes.delete(redisUrl);
            return;
        }
        await Promise.all(Array.from(this.runtimes.values()).map((runtime) => runtime.close()));
        this.runtimes.clear();
    }
}
export const queueClient = new QueueClient();
