// @ts-nocheck
import assert from "node:assert/strict";
import test from "node:test";

import { Role } from "@birthub/database";
import request from "supertest";

import { createAnalyticsRouter } from "../src/modules/analytics/router.js";
import { analyticsRouterService } from "../src/modules/analytics/service.js";
import {
  createAuthenticatedApiTestApp,
  stubMethod
} from "./http-test-helpers.js";

function createAnalyticsTestApp(role: Role = Role.ADMIN) {
  return createAuthenticatedApiTestApp({
    contextOverrides: {
      requestId: "req_analytics",
      role
    },
    mountPath: "/api/v1/analytics",
    router: createAnalyticsRouter()
  });
}

void test("analytics router parses usage date range filters before delegating to the service", async () => {
  let received: unknown = null;
  const restore = stubMethod(analyticsRouterService, "getUsageMetrics", (input: unknown) => {
    received = input;
    return Promise.resolve([
      {
        activeTenants: 8,
        day: "2026-04-10"
      }
    ]);
  });

  try {
    const response = await request(createAnalyticsTestApp())
      .get("/api/v1/analytics/usage")
      .query({
        from: "2026-04-01T00:00:00.000Z",
        to: "2026-04-10T23:59:59.000Z"
      })
      .expect(200);

    assert.ok(received);
    assert.ok(received.from instanceof Date);
    assert.ok(received.to instanceof Date);
    assert.deepEqual(response.body, {
      items: [
        {
          activeTenants: 8,
          day: "2026-04-10"
        }
      ],
      requestId: "req_analytics"
    });
  } finally {
    restore();
  }
});

void test("analytics router blocks super-admin routes for regular admins", async () => {
  const response = await request(createAnalyticsTestApp(Role.ADMIN))
    .get("/api/v1/analytics/quality-report")
    .expect(403);

  assert.equal(response.body.status, 403);
  assert.equal(response.body.title, "Forbidden");
});

void test("analytics router exports billing csv for super admins", async () => {
  let received: unknown = null;
  const restore = stubMethod(analyticsRouterService, "exportBillingCsv", (input: unknown) => {
    received = input;
    return Promise.resolve("tenant,amount\nacme,1200\n");
  });

  try {
    const response = await request(createAnalyticsTestApp(Role.SUPER_ADMIN))
      .get("/api/v1/analytics/billing/export")
      .query({
        from: "2026-04-01T00:00:00.000Z"
      })
      .expect(200);

    assert.ok(received.from instanceof Date);
    assert.match(String(response.headers["content-type"] ?? ""), /text\/csv/i);
    assert.match(String(response.headers["content-disposition"] ?? ""), /billing-export\.csv/i);
    assert.equal(response.text, "tenant,amount\nacme,1200\n");
  } finally {
    restore();
  }
});
