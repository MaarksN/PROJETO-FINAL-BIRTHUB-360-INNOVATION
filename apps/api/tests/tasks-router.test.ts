import assert from "node:assert/strict";
import test from "node:test";

import express from "express";
import request from "supertest";

import { QueueBackpressureError, TenantQueueRateLimitError } from "../src/lib/queue.js";
import { requestContextMiddleware } from "../src/middleware/request-context.js";
import { BudgetExceededError } from "../src/modules/budget/budget.types.js";
import { createTasksRouter } from "../src/modules/tasks/router.js";
import { createTestApiConfig } from "./test-config.js";

void test("createTasksRouter requires an authenticated session for POST /api/v1/tasks", async () => {
  const app = express();
  app.use(requestContextMiddleware);
  app.use(express.json());
  app.use("/api/v1", createTasksRouter(createTestApiConfig()));

  await request(app)
    .post("/api/v1/tasks")
    .send({
      type: "send-welcome-email"
    })
    .expect(401);
});

void test("createTasksRouter enqueues tasks with the same public contract and side effects", async () => {
  const config = createTestApiConfig();
  const app = express();
  let consumedBudget: Record<string, unknown> | null = null;
  let queuedPayload: Record<string, unknown> | null = null;

  app.use(requestContextMiddleware);
  app.use(express.json());
  app.use((request, _response, next) => {
    request.context.authType = "session";
    request.context.organizationId = "org_1";
    request.context.requestId = "req_task_1";
    request.context.role = "MEMBER";
    request.context.sessionId = "session_1";
    request.context.tenantId = "tenant_1";
    request.context.userId = "user_1";
    next();
  });
  app.use(
    "/api/v1",
    createTasksRouter(config, {
      budgetService: {
        consumeBudget: async (input) => {
          consumedBudget = input as Record<string, unknown>;
          return {
            agentId: "ceo-pack",
            consumed: 0.5,
            currency: "BRL",
            id: "budget_1",
            limit: 100,
            tenantId: "tenant_1",
            updatedAt: new Date().toISOString()
          };
        }
      },
      enqueueTask: async (_receivedConfig, payload) => {
        queuedPayload = payload as Record<string, unknown>;
        return { jobId: "job_123" };
      }
    })
  );

  const response = await request(app)
    .post("/api/v1/tasks")
    .send({
      agentId: "ceo-pack",
      approvalRequired: false,
      estimatedCostBRL: 0.5,
      executionMode: "LIVE",
      payload: {
        description: "hello"
      },
      type: "send-welcome-email"
    })
    .expect(202);

  assert.deepEqual(response.body, {
    jobId: "job_123",
    requestId: "req_task_1"
  });
  assert.equal(consumedBudget?.actorId, "user_1");
  assert.equal(consumedBudget?.organizationId, "org_1");
  assert.equal(consumedBudget?.tenantId, "tenant_1");
  assert.equal(queuedPayload?.tenantId, "tenant_1");
  assert.equal(queuedPayload?.userId, "user_1");
  assert.equal(queuedPayload?.requestId, "req_task_1");
  assert.equal(queuedPayload?.type, "send-welcome-email");
});

void test("createTasksRouter preserves budget exceeded translation", async () => {
  const app = express();
  app.use(requestContextMiddleware);
  app.use(express.json());
  app.use((request, _response, next) => {
    request.context.authType = "session";
    request.context.organizationId = "org_1";
    request.context.requestId = "req_task_budget";
    request.context.role = "MEMBER";
    request.context.sessionId = "session_1";
    request.context.tenantId = "tenant_1";
    request.context.userId = "user_1";
    next();
  });
  app.use(
    "/api/v1",
    createTasksRouter(createTestApiConfig(), {
      budgetService: {
        consumeBudget: async () => {
          throw new BudgetExceededError({
            agentId: "ceo-pack",
            consumed: 100,
            limit: 100,
            tenantId: "tenant_1"
          });
        }
      },
      enqueueTask: async () => ({ jobId: "job_unused" })
    })
  );

  const response = await request(app)
    .post("/api/v1/tasks")
    .send({
      type: "send-welcome-email"
    })
    .expect(402);

  assert.equal(response.body.title, "Budget Exceeded");
});

void test("createTasksRouter preserves queue translation for rate limiting and backpressure", async () => {
  const makeApp = (error: Error) => {
    const app = express();
    app.use(requestContextMiddleware);
    app.use(express.json());
    app.use((request, _response, next) => {
      request.context.authType = "session";
      request.context.organizationId = "org_1";
      request.context.requestId = "req_task_queue";
      request.context.role = "MEMBER";
      request.context.sessionId = "session_1";
      request.context.tenantId = "tenant_1";
      request.context.userId = "user_1";
      next();
    });
    app.use(
      "/api/v1",
      createTasksRouter(createTestApiConfig(), {
        budgetService: {
          consumeBudget: async () => ({
            agentId: "ceo-pack",
            consumed: 0.5,
            currency: "BRL",
            id: "budget_1",
            limit: 100,
            tenantId: "tenant_1",
            updatedAt: new Date().toISOString()
          })
        },
        enqueueTask: async () => {
          throw error;
        }
      })
    );
    return app;
  };

  const rateLimited = await request(makeApp(new TenantQueueRateLimitError("tenant_1", 120)))
    .post("/api/v1/tasks")
    .send({
      type: "send-welcome-email"
    })
    .expect(429);

  assert.equal(rateLimited.body.title, "Too Many Requests");

  const backpressure = await request(makeApp(new QueueBackpressureError(10_000, 10_000)))
    .post("/api/v1/tasks")
    .send({
      type: "send-welcome-email"
    })
    .expect(503);

  assert.equal(backpressure.body.title, "Service Unavailable");
});
