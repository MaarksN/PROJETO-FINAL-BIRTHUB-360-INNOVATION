import { createLogger } from "@birthub/logger";
const logger = createLogger("queue-dlq");
function resolveQueueName(config) {
    return typeof config === "string" ? config : config.name;
}
export class QueueDlqClient {
    runtime;
    constructor(runtime) {
        this.runtime = runtime;
    }
    async getMetrics(config) {
        const queue = this.runtime.getDlqQueue(resolveQueueName(config));
        const counts = await queue.getJobCounts("active", "delayed", "failed", "waiting");
        return {
            active: counts.active ?? 0,
            delayed: counts.delayed ?? 0,
            failed: counts.failed ?? 0,
            pending: (counts.active ?? 0) + (counts.delayed ?? 0) + (counts.waiting ?? 0),
            queueName: queue.name,
            waiting: counts.waiting ?? 0
        };
    }
    async listFailedJobs(config, start = 0, end = 50) {
        const queue = this.runtime.getDlqQueue(resolveQueueName(config));
        return queue.getJobs(["waiting", "delayed", "active"], start, end, true);
    }
    async retryJob(config, dlqJobId) {
        const queueName = resolveQueueName(config);
        const dlqQueue = this.runtime.getDlqQueue(queueName);
        const dlqJob = await dlqQueue.getJob(dlqJobId);
        if (!dlqJob) {
            throw new Error(`DLQ job ${dlqJobId} was not found for queue ${queueName}.`);
        }
        const payload = dlqJob.data;
        const enqueued = await this.runtime.enqueue({
            data: payload.payload,
            jobName: payload.originalJobName,
            options: payload.originalOptions,
            queue: queueName
        });
        await dlqJob.remove();
        logger.info({
            dlqJobId,
            jobId: enqueued.jobId,
            queue: queueName
        }, "Replayed DLQ job back into the primary queue");
        return {
            jobId: enqueued.jobId,
            queue: enqueued.queue
        };
    }
}
