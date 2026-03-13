import { z } from "zod";

import {
  commaSeparatedList,
  nodeEnvSchema,
  nonEmptyString,
  optionalNonEmptyString,
  optionalUrlString,
  parseEnv,
  urlString
} from "./shared.js";

export const apiEnvSchema = z.object({
  API_AUTH_COOKIE_NAME: nonEmptyString.default("bh360_session"),
  API_AUTH_REFRESH_COOKIE_NAME: nonEmptyString.default("bh360_refresh"),
  API_AUTH_ROTATION_GRACE_HOURS: z.coerce.number().int().positive().default(24),
  API_AUTH_SESSION_TTL_HOURS: z.coerce.number().int().positive().default(24),
  API_AUTH_TOKEN_TTL_MINUTES: z.coerce.number().int().positive().default(15),
  API_CORS_ORIGINS: z.string().default("http://localhost:3001"),
  API_CSRF_COOKIE_NAME: nonEmptyString.default("bh360_csrf"),
  API_CSRF_HEADER_NAME: nonEmptyString.default("x-csrf-token"),
  API_KEY_PREFIX: nonEmptyString.default("bh360_live"),
  API_KEY_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(600),
  API_PORT: z.coerce.number().int().positive().default(3000),
  API_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  API_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  AUTH_MFA_CHALLENGE_TTL_SECONDS: z.coerce.number().int().positive().default(300),
  AUTH_MFA_CLOCK_SKEW_WINDOWS: z.coerce.number().int().positive().default(1),
  AUTH_MFA_ENCRYPTION_KEY: nonEmptyString.default("dev-mfa-encryption-key"),
  AUTH_MFA_ISSUER: nonEmptyString.default("BirthHub360"),
  BILLING_GRACE_PERIOD_DAYS: z.coerce.number().int().min(0).default(3),
  DATABASE_URL: urlString,
  EXTERNAL_HEALTHCHECK_URLS: z.string().default(""),
  JOB_HMAC_GLOBAL_SECRET: nonEmptyString.default("dev-job-hmac-secret"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  NODE_ENV: nodeEnvSchema,
  REQUIRE_SECURE_COOKIES: z.coerce.boolean().default(false),
  OTEL_EXPORTER_OTLP_ENDPOINT: optionalUrlString,
  OTEL_SERVICE_NAME: nonEmptyString.default("birthub-api"),
  QUEUE_NAME: nonEmptyString.default("birthub-cycle1"),
  REDIS_URL: urlString,
  SENTRY_DSN: optionalUrlString,
  SENTRY_ENVIRONMENT: optionalNonEmptyString,
  SESSION_SECRET: nonEmptyString.default("dev-session-secret"),
  STRIPE_CANCEL_URL: urlString.default("http://localhost:3001/billing/cancel"),
  STRIPE_PORTAL_RETURN_URL: urlString.default("http://localhost:3001/settings/billing"),
  STRIPE_SECRET_KEY: nonEmptyString.default("sk_test_birthub360"),
  STRIPE_SUCCESS_URL: urlString.default("http://localhost:3001/billing/success"),
  STRIPE_WEBHOOK_SECRET: nonEmptyString.default("whsec_birthub360"),
  WEB_BASE_URL: urlString.default("http://localhost:3001")
});

export type ApiConfig = z.infer<typeof apiEnvSchema> & {
  corsOrigins: string[];
  externalHealthcheckUrls: string[];
};

export function getApiConfig(env: NodeJS.ProcessEnv = process.env): ApiConfig {
  const parsed = parseEnv("api", apiEnvSchema, env);

  return {
    ...parsed,
    corsOrigins: commaSeparatedList.parse(parsed.API_CORS_ORIGINS),
    externalHealthcheckUrls: commaSeparatedList.parse(parsed.EXTERNAL_HEALTHCHECK_URLS),
    SENTRY_ENVIRONMENT: parsed.SENTRY_ENVIRONMENT ?? parsed.NODE_ENV
  };
}
