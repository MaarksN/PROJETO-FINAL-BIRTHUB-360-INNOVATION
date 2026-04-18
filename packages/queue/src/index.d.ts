import { QueueName } from "@birthub/shared-types";
import { QueueRuntime } from "./runtime";
import type { JobsOptions } from "bullmq";
export { AGENT_QUEUE_NAMES, DEFAULT_REMOVE_ON_COMPLETE, DEFAULT_REMOVE_ON_FAIL, ENGAGEMENT_QUEUE_NAMES, getAgentQueueName, QUEUE_CONFIG, SYSTEM_QUEUE_NAMES, WORKFLOW_QUEUE_NAMES } from "./definitions";
export { QueueDlqClient } from "./dlq";
export { QueueBackpressureError, QueueClient, QueueRuntime, TenantQueueRateLimitError, queueClient } from "./runtime";
export { buildDlqPayload, createRuntimeWorkerProcessor, extractJobContext, forwardToDlq, isFinalAttempt, mergeQueueJobOptions, registerRuntimeWorker, resolveConfiguredAttempts, toSerializedJobOptions } from "./worker";
export * from "./workers/index";
export * from "./job-context";
export * from "./types";
export declare const QUEUES: {
    readonly BANK_RECONCILIATION: QueueName.BANK_RECONCILIATION;
    readonly BOARD_REPORT: QueueName.BOARD_REPORT;
    readonly CHURN_RISK_HIGH: QueueName.CHURN_RISK_HIGH;
    readonly COMMISSION_CALC: QueueName.COMMISSION_CALC;
    readonly CONTRACT_ANALYSIS: QueueName.CONTRACT_ANALYSIS;
    readonly CONTRACT_DEADLINES: QueueName.CONTRACT_DEADLINES;
    readonly DEAL_CLOSED_WON: QueueName.DEAL_CLOSED_WON;
    readonly DOMAIN_WARMUP: QueueName.DOMAIN_WARMUP;
    readonly EMAIL_CADENCE_SEND: QueueName.EMAIL_CADENCE_SEND;
    readonly HEALTH_ALERT: QueueName.HEALTH_ALERT;
    readonly HEALTH_SCORE_UPDATE: QueueName.HEALTH_SCORE_UPDATE;
    readonly INVOICE_GENERATE: QueueName.INVOICE_GENERATE;
    readonly LEAD_ENRICHMENT: QueueName.LEAD_ENRICHMENT;
    readonly NPS_ANALYSIS: QueueName.NPS_ANALYSIS;
};
export declare class QueueManager extends QueueRuntime {
    addJob(queueName: QueueName | string, jobName: string, data: unknown, options?: JobsOptions): Promise<any>;
    scheduleRecurringJobs(): Promise<void>;
}
export declare function scopedQueueName(baseQueue: QueueName | string, tenantId?: string, plan?: string): string;
export declare const createQueue: <DataType = unknown, ResultType = unknown>(config: string | import("./types").QueueConfig) => any;
export declare const createWorker: <DataType = unknown, ResultType = unknown>(config: string | import("./types").QueueConfig, processor: import("./types").QueueProcessor<DataType, ResultType>) => any;
export declare const createQueueEvents: (config: string | import("./types").QueueConfig) => any;
export declare const closeRedis: () => Promise<void>;
