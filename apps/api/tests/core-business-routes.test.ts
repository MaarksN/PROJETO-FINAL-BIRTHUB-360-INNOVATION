// @ts-nocheck
// 
import assert from "node:assert/strict";
import test from "node:test";

import express from "express";
import request from "supertest";

import { registerCoreBusinessRoutes } from "../src/app/core-business-routes.js";
import { requestContextMiddleware } from "../src/middleware/request-context.js";
import { createTestApiConfig } from "./test-config.js";

void test("registerCoreBusinessRoutes exposes organization, profile and task endpoints", async () => {
  const app = express();
  app.use(requestContextMiddleware);
  app.use(express.json());
  registerCoreBusinessRoutes(app, createTestApiConfig());

  await request(app)
    .post("/api/v1/organizations")
    .send({})
    .expect(400);

  await request(app)
    .get("/api/v1/me")
    .expect(401);

  await request(app)
    .post("/api/v1/tasks")
    .send({})
    .expect(401);

  assert.ok(app);
});

void test("registerCoreBusinessRoutes delegates organization creation route ownership to the organizations module", async () => {
  const app = express();
  let delegated = false;
  let delegatedOptions:
    | {
        logger?: { info?: (...args: unknown[]) => void };
        onCreated?: (request: { context: Record<string, unknown> }, organization: {
          organizationId: string;
          ownerUserId: string;
          tenantId: string | null;
        }) => void;
        paths: string[];
      }
    | undefined;

  app.use(requestContextMiddleware);
  app.use(express.json());
  registerCoreBusinessRoutes(app, createTestApiConfig(), {
    registerOrganizationCreationRoutes: (target, options) => {
      delegated = true;
      delegatedOptions = options;

      target.post("/api/v1/organizations", (request, response) => {
        options.onCreated?.(request as never, {
          organizationId: "org_test",
          ownerUserId: "user_test",
          tenantId: "tenant_test"
        });

        response.status(201).json({
          organizationId: "org_test",
          ownerUserId: "user_test",
          requestId: request.context.requestId,
          role: "OWNER",
          slug: "org-test",
          tenantId: "tenant_test"
        });
      });
    }
  });

  assert.equal(delegated, true);
  assert.deepEqual(delegatedOptions?.paths, ["/api/v1/organizations"]);

  const response = await request(app)
    .post("/api/v1/organizations")
    .send({
      adminEmail: "owner@birthhub.local",
      adminName: "Owner",
      adminPassword: "password123",
      name: "Org Test"
    })
    .expect(201);

  assert.equal(response.body.organizationId, "org_test");
  assert.equal(response.body.tenantId, "tenant_test");
});
