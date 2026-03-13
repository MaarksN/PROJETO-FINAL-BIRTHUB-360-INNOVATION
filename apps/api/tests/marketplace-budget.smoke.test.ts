import assert from "node:assert/strict";
import test from "node:test";

import type { ApiConfig } from "@birthub/config";
import request from "supertest";

import { createApp } from "../src/app.js";

const baseConfig: ApiConfig = {
  API_CORS_ORIGINS: "http://localhost:3001",
  API_PORT: 3000,
  API_RATE_LIMIT_MAX: 120,
  API_RATE_LIMIT_WINDOW_MS: 60_000,
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/birthub_cycle1",
  EXTERNAL_HEALTHCHECK_URLS: "",
  LOG_LEVEL: "info",
  NODE_ENV: "test",
  OTEL_EXPORTER_OTLP_ENDPOINT: undefined,
  OTEL_SERVICE_NAME: "birthub-api-test",
  QUEUE_BACKPRESSURE_THRESHOLD: 10_000,
  QUEUE_NAME: "birthub-cycle1",
  REDIS_URL: "redis://localhost:6379",
  SENTRY_DSN: undefined,
  SENTRY_ENVIRONMENT: "test",
  SESSION_SECRET: "test-session-secret",
  WEB_BASE_URL: "http://localhost:3001",
  corsOrigins: ["http://localhost:3001"],
  externalHealthcheckUrls: []
};

void test("marketplace search returns facets and ranked agents", async () => {
  const app = createApp({
    config: baseConfig,
    shouldExposeDocs: false
  });

  const response = await request(app)
    .get("/api/v1/agents/search?q=sales&page=1&pageSize=5")
    .expect(200);

  assert.ok(Array.isArray(response.body.results));
  assert.ok(typeof response.body.facets === "object");
  assert.ok(response.body.results.length >= 1);
  assert.ok(response.headers.etag);

  await request(app)
    .get("/api/v1/agents/search?q=sales&page=1&pageSize=5")
    .set("If-None-Match", response.headers.etag as string)
    .expect(304);
});

void test("budget endpoints configure and consume tenant budget", async () => {
  const app = createApp({
    config: baseConfig,
    shouldExposeDocs: false
  });

  await request(app)
    .post("/api/v1/budgets/limits")
    .set("x-tenant-id", "tenant-budget")
    .send({ agentId: "sales-pack", limit: 1 })
    .expect(200);

  await request(app)
    .post("/api/v1/budgets/consume")
    .set("x-tenant-id", "tenant-budget")
    .send({ agentId: "sales-pack", costBRL: 0.2, executionMode: "LIVE" })
    .expect(200);

  const usageResponse = await request(app)
    .get("/api/v1/budgets/usage")
    .set("x-tenant-id", "tenant-budget")
    .expect(200);

  assert.ok(Array.isArray(usageResponse.body.records));
  assert.ok(Array.isArray(usageResponse.body.usageEvents));
  assert.equal(usageResponse.body.records[0].tenantId, "tenant-budget");
});
