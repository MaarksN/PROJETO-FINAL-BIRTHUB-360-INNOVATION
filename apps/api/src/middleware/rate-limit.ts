import type { ApiConfig } from "@birthub/config";
import { MembershipStatus, prisma } from "@birthub/database";
import { createLogger } from "@birthub/logger";
import type { Request, RequestHandler, Response } from "express";
import rateLimit, { ipKeyGenerator, type Options } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { getSharedRedis } from "../lib/queue.js";

import { ProblemDetailsError, toProblemDetails } from "../lib/problem-details.js";

const logger = createLogger("api-rate-limit");

function resolveEndpointKey(request: Request): string {
  const normalizedPath = (request.path || "/").replace(/\/+/g, "/").replace(/\/$/, "") || "/";
  return `${request.method.toUpperCase()}:${normalizedPath}`;
}

function readTrimmedBodyField(request: Request, field: "email" | "tenantId"): string | null {
  if (!request.body || typeof request.body !== "object") {
    return null;
  }

  const value = (request.body as Record<string, unknown>)[field];
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function logRateLimitExceeded(request: Request, scope: "api" | "login" | "webhook"): void {
  logger.warn(
    {
      endpoint: resolveEndpointKey(request),
      ipAddress: request.ip ?? request.header("x-forwarded-for") ?? null,
      organizationId: request.context.organizationId,
      requestId: request.context.requestId,
      scope,
      sessionId: request.context.sessionId,
      tenantId: request.context.tenantId,
      userId: request.context.userId
    },
    "Rate limit exceeded"
  );
}

async function recordBruteForceAlert(request: Request): Promise<void> {
  const tenantReference = readTrimmedBodyField(request, "tenantId");
  const email = readTrimmedBodyField(request, "email");

  if (!tenantReference || !email) {
    return;
  }

  const membership = await prisma.membership.findFirst({
    select: {
      organizationId: true,
      tenantId: true,
      userId: true
    },
    where: {
      organization: {
        OR: [{ id: tenantReference }, { slug: tenantReference }, { tenantId: tenantReference }]
      },
      status: MembershipStatus.ACTIVE,
      user: {
        email: {
          equals: email,
          mode: "insensitive"
        }
      }
    }
  });

  if (!membership) {
    return;
  }

  await prisma.loginAlert.create({
    data: {
      ipAddress: request.ip ?? request.header("x-forwarded-for") ?? null,
      organizationId: membership.organizationId,
      tenantId: membership.tenantId,
      userAgent: request.header("user-agent") ?? null,
      userId: membership.userId
    }
  });
}

function buildHandler(input: {
  detail: string;
  scope: "api" | "login" | "webhook";
  windowMs: number;
}): NonNullable<Options["handler"]> {
  return (request: Request, response: Response, _next, _options) => {
    const retryAfterSeconds = Math.ceil(input.windowMs / 1000);

    logRateLimitExceeded(request, input.scope);
    if (input.scope === "login") {
      void recordBruteForceAlert(request);
    }

    response.setHeader("Retry-After", String(retryAfterSeconds));
    response.status(429).json(
      toProblemDetails(
        request,
        new ProblemDetailsError({
          detail: input.detail,
          status: 429,
          title: "Too Many Requests"
        })
      )
    );
  };
}

function resolveIpKey(request: Request): string {
  return ipKeyGenerator(request.ip ?? request.header("x-forwarded-for") ?? "anonymous");
}

function resolveAuthenticatedKey(request: Request): string {
  const endpoint = resolveEndpointKey(request);

  if (request.context.apiKeyId) {
    return `api-key:${request.context.apiKeyId}:endpoint:${endpoint}`;
  }

  if (request.context.tenantId && request.context.userId) {
    return `tenant:${request.context.tenantId}:user:${request.context.userId}:endpoint:${endpoint}`;
  }

  if (request.context.tenantId) {
    return `tenant:${request.context.tenantId}:ip:${resolveIpKey(request)}:endpoint:${endpoint}`;
  }

  return `ip:${resolveIpKey(request)}:endpoint:${endpoint}`;
}

export function createRateLimitMiddleware(config: ApiConfig): RequestHandler {
  return rateLimit({
    store: new RedisStore({ sendCommand: (...args: string[]) => getSharedRedis(config).call(...args) }),
    handler: (request, response, next, options) =>
      buildHandler({
        detail: request.context.apiKeyId
          ? "Too many requests for this API key. Please retry later."
          : "Too many requests from this IP address. Please retry later.",
        scope: "api",
        windowMs: config.API_RATE_LIMIT_WINDOW_MS
      })(request, response, next, options),
    keyGenerator: resolveAuthenticatedKey,
    legacyHeaders: false,
    limit: (request) =>
      request.context.apiKeyId ? config.API_KEY_RATE_LIMIT_MAX : config.API_RATE_LIMIT_MAX,
    standardHeaders: true,
    windowMs: config.API_RATE_LIMIT_WINDOW_MS
  });
}

export function createLoginRateLimitMiddleware(config: ApiConfig): RequestHandler {
  return rateLimit({
    store: new RedisStore({ sendCommand: (...args: string[]) => getSharedRedis(config).call(...args) }),
    handler: buildHandler({
      detail: "Too many login attempts from this IP address. Please retry later.",
      scope: "login",
      windowMs: config.API_LOGIN_RATE_LIMIT_WINDOW_MS
    }),
    keyGenerator: (request) => {
      const email = readTrimmedBodyField(request, "email")?.toLowerCase() ?? "unknown-email";
      const tenantReference =
        readTrimmedBodyField(request, "tenantId")?.toLowerCase() ?? "unknown-tenant";

      return `login:${tenantReference}:${email}:${resolveIpKey(request)}`;
    },
    legacyHeaders: false,
    limit: config.API_LOGIN_RATE_LIMIT_MAX,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    windowMs: config.API_LOGIN_RATE_LIMIT_WINDOW_MS
  });
}

export function createWebhookRateLimitMiddleware(config: ApiConfig): RequestHandler {
  return rateLimit({
    store: new RedisStore({ sendCommand: (...args: string[]) => getSharedRedis(config).call(...args) }),
    handler: buildHandler({
      detail: "Inbound webhook traffic temporarily rate limited for this route.",
      scope: "webhook",
      windowMs: config.API_WEBHOOK_RATE_LIMIT_WINDOW_MS
    }),
    keyGenerator: (request) => {
      const tenantId = request.context.tenantId ?? "public";
      const signature =
        request.header("stripe-signature") ??
        request.header("x-birthhub-signature") ??
        "unsigned";

      return `webhook:${tenantId}:${resolveEndpointKey(request)}:${signature}:${resolveIpKey(request)}`;
    },
    legacyHeaders: false,
    limit: (request) =>
      request.context.tenantId
        ? config.API_WEBHOOK_RATE_LIMIT_MAX * config.API_WEBHOOK_RATE_LIMIT_TENANT_MULTIPLIER
        : config.API_WEBHOOK_RATE_LIMIT_MAX,
    standardHeaders: true,
    windowMs: config.API_WEBHOOK_RATE_LIMIT_WINDOW_MS
  });
}
