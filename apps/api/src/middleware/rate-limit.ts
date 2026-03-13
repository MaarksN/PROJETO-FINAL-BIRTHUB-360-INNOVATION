import type { ApiConfig } from "@birthub/config";
import rateLimit from "express-rate-limit";


import { ProblemDetailsError, toProblemDetails } from "../lib/problem-details.js";

export function createRateLimitMiddleware(config: ApiConfig) {
  return rateLimit({
    handler: (request, response) => {
      const retryAfterSeconds = Math.ceil(config.API_RATE_LIMIT_WINDOW_MS / 1000);
      const isApiKeyRequest = Boolean(request.context.apiKeyId);

      response.setHeader("Retry-After", String(retryAfterSeconds));

      const error = new ProblemDetailsError({
        detail: isApiKeyRequest
          ? "Too many requests for this API key. Please retry later."
          : "Too many requests from this IP address. Please retry later.",
        status: 429,
        title: "Too Many Requests"
      });

      response.status(429).json(toProblemDetails(request, error));
    },
    keyGenerator: (request) =>
      request.context.apiKeyId
        ? `api-key:${request.context.apiKeyId}`
        : `ip:${request.ip ?? request.header("x-forwarded-for") ?? "anonymous"}`,
    legacyHeaders: false,
    limit: (request) => (request.context.apiKeyId ? config.API_KEY_RATE_LIMIT_MAX : config.API_RATE_LIMIT_MAX),
    standardHeaders: true,
    windowMs: config.API_RATE_LIMIT_WINDOW_MS
  });
}
