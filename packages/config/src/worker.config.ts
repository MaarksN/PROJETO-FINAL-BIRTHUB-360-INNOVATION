import { z } from "zod";

import {
  nodeEnvSchema,
  nonEmptyString,
  optionalUrlString,
  parseEnv,
  urlString
} from "./shared.js";

export const workerEnvSchema = z.object({
  BILLING_GRACE_PERIOD_DAYS: z.coerce.number().int().min(0).default(3),
  BILLING_STATUS_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(60),
  DATABASE_URL: urlString,
  JOB_HMAC_GLOBAL_SECRET: nonEmptyString.default("dev-job-hmac-secret"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  NODE_ENV: nodeEnvSchema,
  QUEUE_NAME: nonEmptyString.default("birthub-cycle1"),
  REDIS_URL: urlString,
  SENTRY_DSN: optionalUrlString,
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(5)
});

export type WorkerConfig = z.infer<typeof workerEnvSchema>;

export function getWorkerConfig(env: NodeJS.ProcessEnv = process.env): WorkerConfig {
  return parseEnv("worker", workerEnvSchema, env);
}
