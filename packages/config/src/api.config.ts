// @ts-nocheck
import { z } from "zod";

import {
  commaSeparatedList,
  envBoolean,
  EnvValidationError,
  hasPlaceholderMarker,
  hasRequiredPostgresSsl,
  hasRequiredRedisTls,
  isLocalUrl,
  isStripeTestSecretKey,
  isSecureHttpUrl,
  nodeEnvSchema,
  nonEmptyString,
  optionalNonEmptyString,
  optionalUrlString,
  parseEnv,
  urlString
} from "./shared.js";

export const apiEnvSchema = z.object({
  API_AUTH_COOKIE_NAME: nonEmptyString.default("bh360_session"),
  API_AUTH_COOKIE_DOMAIN: optionalNonEmptyString,
  API_AUTH_IDLE_TIMEOUT_MINUTES: z.coerce.number().int().positive().default(30),
  API_AUTH_REFRESH_COOKIE_NAME: nonEmptyString.default("bh360_refresh"),
  API_AUTH_ROTATION_GRACE_HOURS: z.coerce.number().int().positive().default(24),
  API_AUTH_SESSION_TTL_HOURS: z.coerce.number().int().positive().default(24),
  API_AUTH_TOKEN_TTL_MINUTES: z.coerce.number().int().positive().default(15),
  AUTH_ARGON2_MEMORY_KIB: z.coerce.number().int().positive().default(65_536),
  AUTH_ARGON2_PARALLELISM: z.coerce.number().int().min(2).default(4),
  AUTH_ARGON2_PASSES: z.coerce.number().int().min(2).default(3),
  AUTH_BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(12),
  API_CORS_ORIGINS: z.string().default("http://localhost:3001"),
  API_CSRF_COOKIE_NAME: nonEmptyString.default("bh360_csrf"),
  API_CSRF_HEADER_NAME: nonEmptyString.default("x-csrf-token"),
  API_HANDLER_TIMEOUT_MS: z.coerce.number().int().positive().default(10_000),
  API_JSON_BODY_LIMIT: nonEmptyString.default("5mb"),
  API_KEY_PREFIX: nonEmptyString.default("bh360_live"),
  API_KEY_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(600),
  API_LOGIN_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  API_LOGIN_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  API_PORT: z.coerce.number().int().positive().default(3000),
  API_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  API_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  API_WEBHOOK_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
  API_WEBHOOK_RATE_LIMIT_TENANT_MULTIPLIER: z.coerce.number().int().positive().default(2),
  API_WEBHOOK_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  AUTH_MFA_CHALLENGE_TTL_SECONDS: z.coerce.number().int().positive().default(300),
  AUTH_MFA_CLOCK_SKEW_WINDOWS: z.coerce.number().int().positive().default(1),
  AUTH_MFA_ENCRYPTION_KEY: nonEmptyString.default("dev-mfa-encryption-key"),
  AUTH_MFA_ISSUER: nonEmptyString.default("BirthHub360"),
  AUTH_MFA_LOCKOUT_MINUTES: z.coerce.number().int().positive().default(15),
  AUTH_MFA_MAX_FAILURES: z.coerce.number().int().positive().default(5),
  BILLING_GRACE_PERIOD_DAYS: z.coerce.number().int().min(0).default(3),
  BREAK_GLASS_SESSION_TTL_MINUTES: z.coerce.number().int().positive().default(30),
  DATABASE_URL: urlString,
  EXTERNAL_HEALTHCHECK_URLS: z.string().default(""),
  GOOGLE_CLIENT_ID: optionalNonEmptyString,
  GOOGLE_CLIENT_SECRET: optionalNonEmptyString,
  GOOGLE_REDIRECT_URI: optionalUrlString,
  HUBSPOT_CLIENT_ID: optionalNonEmptyString,
  HUBSPOT_CLIENT_SECRET: optionalNonEmptyString,
  HUBSPOT_REDIRECT_URI: optionalUrlString,
  JOB_HMAC_GLOBAL_SECRET: nonEmptyString.default("dev-job-hmac-secret"),
  JOB_HMAC_GLOBAL_SECRET_FALLBACKS: z.string().default(""),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  MICROSOFT_CLIENT_ID: optionalNonEmptyString,
  MICROSOFT_CLIENT_SECRET: optionalNonEmptyString,
  MICROSOFT_REDIRECT_URI: optionalUrlString,
  NODE_ENV: nodeEnvSchema,
  REQUIRE_SECURE_COOKIES: envBoolean.default(false),
  OTEL_EXPORTER_OTLP_ENDPOINT: optionalUrlString,
  OTEL_SERVICE_NAME: nonEmptyString.default("birthub-api"),
  QUEUE_BACKPRESSURE_THRESHOLD: z.coerce.number().int().positive().default(10_000),
  QUEUE_NAME: nonEmptyString.default("birthub-cycle1"),
  REDIS_URL: urlString,
  SESSION_IP_HASH_SALT: nonEmptyString.default("dev-session-ip-hash-salt"),
  TENANT_QUEUE_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  TENANT_QUEUE_RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().default(60),
  SENTRY_DSN: optionalUrlString,
  SENTRY_ENVIRONMENT: optionalNonEmptyString,
  SESSION_SECRET: nonEmptyString.default("dev-session-secret"),
  SESSION_SECRET_FALLBACKS: z.string().default(""),
  STRIPE_CANCEL_URL: urlString.default("http://localhost:3001/billing/cancel"),
  STRIPE_DECLINE_BAN_THRESHOLD: z.coerce.number().int().positive().default(5),
  STRIPE_PORTAL_RETURN_URL: urlString.default("http://localhost:3001/settings/billing"),
  STRIPE_SECRET_KEY: nonEmptyString.default("sk_test_birthub360_mock"),
  STRIPE_SUCCESS_URL: urlString.default("http://localhost:3001/billing/success"),
  STRIPE_TEMP_BAN_SECONDS: z.coerce.number().int().positive().default(15 * 60),
  STRIPE_WEBHOOK_TOLERANCE_SECONDS: z.coerce.number().int().positive().default(300),
  STRIPE_WEBHOOK_SECRET: nonEmptyString.default("whsec_birthub360"),
  STRIPE_WEBHOOK_SECRET_FALLBACKS: z.string().default(""),
  UPTIMEROBOT_API_TOKEN: optionalNonEmptyString,
  WEB_BASE_URL: urlString.default("http://localhost:3001")
});

export type ApiConfig = z.infer<typeof apiEnvSchema> & {
  corsOrigins: string[];
  externalHealthcheckUrls: string[];
  jobHmacGlobalSecretFallbacks: string[];
  sessionSecretFallbacks: string[];
  stripeWebhookSecretFallbacks: string[];
};

function collectProductionSecretIssues(parsed: z.infer<typeof apiEnvSchema>) {
  const issues: string[] = [];

  if (
    parsed.SESSION_SECRET === "dev-session-secret" ||
    parsed.JOB_HMAC_GLOBAL_SECRET === "dev-job-hmac-secret" ||
    parsed.AUTH_MFA_ENCRYPTION_KEY === "dev-mfa-encryption-key" ||
    parsed.SESSION_IP_HASH_SALT === "dev-session-ip-hash-salt" ||
    hasPlaceholderMarker(parsed.SESSION_SECRET) ||
    hasPlaceholderMarker(parsed.JOB_HMAC_GLOBAL_SECRET) ||
    hasPlaceholderMarker(parsed.AUTH_MFA_ENCRYPTION_KEY) ||
    hasPlaceholderMarker(parsed.SESSION_IP_HASH_SALT)
  ) {
    issues.push("Production secrets cannot use development defaults.");
  }

  if (hasPlaceholderMarker(parsed.STRIPE_SECRET_KEY)) {
    issues.push("STRIPE_SECRET_KEY cannot use placeholder values in production.");
  }

  if (hasPlaceholderMarker(parsed.STRIPE_WEBHOOK_SECRET)) {
    issues.push("STRIPE_WEBHOOK_SECRET cannot use placeholder values in production.");
  }

  if (
    commaSeparatedList
      .parse(parsed.SESSION_SECRET_FALLBACKS)
      .some((value) => hasPlaceholderMarker(value)) ||
    commaSeparatedList
      .parse(parsed.JOB_HMAC_GLOBAL_SECRET_FALLBACKS)
      .some((value) => hasPlaceholderMarker(value)) ||
    commaSeparatedList
      .parse(parsed.STRIPE_WEBHOOK_SECRET_FALLBACKS)
      .some((value) => hasPlaceholderMarker(value))
  ) {
    issues.push("Secret fallback lists cannot contain placeholder values in production.");
  }

  return issues;
}

function collectProductionUrlIssues(parsed: z.infer<typeof apiEnvSchema>, corsOrigins: string[]) {
  const issues: string[] = [];

  if (!isSecureHttpUrl(parsed.WEB_BASE_URL) || isLocalUrl(parsed.WEB_BASE_URL)) {
    issues.push("WEB_BASE_URL must use the public HTTPS domain in production.");
  }

  if (!isSecureHttpUrl(parsed.STRIPE_SUCCESS_URL) || !isSecureHttpUrl(parsed.STRIPE_CANCEL_URL)) {
    issues.push("Stripe return URLs must use HTTPS in production.");
  }

  if (
    corsOrigins.length === 0 ||
    corsOrigins.some(
      (origin) =>
        origin === "*" || origin.includes("localhost") || origin.includes("127.0.0.1")
    )
  ) {
    issues.push("API_CORS_ORIGINS must only contain approved production origins.");
  }

  return issues;
}

function collectProductionInfrastructureIssues(
  parsed: z.infer<typeof apiEnvSchema>,
  deploymentEnvironment: string
) {
  const issues: string[] = [];

  if (parsed.AUTH_BCRYPT_SALT_ROUNDS < 12) {
    issues.push("AUTH_BCRYPT_SALT_ROUNDS must be >= 12 in production.");
  }

  if (parsed.AUTH_ARGON2_MEMORY_KIB < 32_768) {
    issues.push("AUTH_ARGON2_MEMORY_KIB must be >= 32768 in production.");
  }

  if (parsed.AUTH_ARGON2_PASSES < 3) {
    issues.push("AUTH_ARGON2_PASSES must be >= 3 in production.");
  }

  if (!hasRequiredPostgresSsl(parsed.DATABASE_URL)) {
    issues.push("DATABASE_URL must include sslmode=require (or stronger) in production.");
  }

  if (!hasRequiredRedisTls(parsed.REDIS_URL)) {
    issues.push("REDIS_URL must use TLS in production (rediss:// or tls=true).");
  }

  if (!parsed.REQUIRE_SECURE_COOKIES) {
    issues.push("REQUIRE_SECURE_COOKIES must be true in production.");
  }

  if (deploymentEnvironment === "production" && isStripeTestSecretKey(parsed.STRIPE_SECRET_KEY)) {
    issues.push("STRIPE_SECRET_KEY must be a live production key in production.");
  }

  if (!parsed.SENTRY_DSN) {
    issues.push("SENTRY_DSN must be configured in production.");
  }

  return issues;
}

function validateProductionApiConfig(
  parsed: z.infer<typeof apiEnvSchema>,
  corsOrigins: string[],
  deploymentEnvironment: string
) {
  const issues = [
    ...collectProductionInfrastructureIssues(parsed, deploymentEnvironment),
    ...collectProductionSecretIssues(parsed),
    ...collectProductionUrlIssues(parsed, corsOrigins)
  ];

  if (issues.length > 0) {
    throw new EnvValidationError("api", issues);
  }
}

export function getApiConfig(env: NodeJS.ProcessEnv = process.env): ApiConfig {
  const parsed = parseEnv("api", apiEnvSchema, env);
  const corsOrigins = commaSeparatedList.parse(parsed.API_CORS_ORIGINS);
  const externalHealthcheckUrls = commaSeparatedList.parse(parsed.EXTERNAL_HEALTHCHECK_URLS);
  const sessionSecretFallbacks = commaSeparatedList.parse(parsed.SESSION_SECRET_FALLBACKS);
  const jobHmacGlobalSecretFallbacks = commaSeparatedList.parse(
    parsed.JOB_HMAC_GLOBAL_SECRET_FALLBACKS
  );
  const stripeWebhookSecretFallbacks = commaSeparatedList.parse(
    parsed.STRIPE_WEBHOOK_SECRET_FALLBACKS
  );
  const deploymentEnvironment =
    env.DEPLOYMENT_ENVIRONMENT === "staging"
      ? "staging"
      : env.DEPLOYMENT_ENVIRONMENT === "production" || parsed.NODE_ENV === "production"
        ? "production"
        : parsed.NODE_ENV;

  if (parsed.NODE_ENV === "production") {
    validateProductionApiConfig(parsed, corsOrigins, deploymentEnvironment);
  }

  return {
    ...parsed,
    corsOrigins,
    externalHealthcheckUrls,
    jobHmacGlobalSecretFallbacks,
    sessionSecretFallbacks,
    SENTRY_ENVIRONMENT: parsed.SENTRY_ENVIRONMENT ?? parsed.NODE_ENV,
    stripeWebhookSecretFallbacks
  };
}
