// @ts-nocheck
import assert from "node:assert/strict";
import test from "node:test";

import { prisma, Role, WorkflowTriggerType } from "@birthub/database";
import { workflowCanvasSchema } from "@birthub/workflows-core";
import express from "express";
import request from "supertest";
import { ZodError } from "zod";

import {
  ProblemDetailsError,
  fromZodError,
  toProblemDetails
} from "../src/lib/problem-details.js";
import { createWorkflowsRouter } from "../src/modules/workflows/router.js";
import { createTestApiConfig } from "./test-config.js";

function stubMethod(target: object, key: string, value: unknown): () => void {
  const original: unknown = Reflect.get(target, key) as unknown;
  Reflect.set(target, key, value);
  return () => {
    Reflect.set(target, key, original);
  };
}

function createWorkflowCanvas() {
  return workflowCanvasSchema.parse({
    steps: [
      {
        config: {
          method: "POST",
          path: "/webhooks/trigger/onboarding"
        },
        isTrigger: true,
        key: "trigger_webhook",
        name: "Webhook Trigger",
        type: "TRIGGER_WEBHOOK"
      }
    ],
    transitions: []
  });
}

function createWorkflowsTestApp() {
  const app = express();
  app.use(express.json());
  app.use((request, _response, next) => {
    request.context = {
      apiKeyId: null,
      authType: "session",
      billingPlanStatus: null,
      organizationId: "org_1",
      requestId: "req_1",
      role: Role.ADMIN,
      sessionId: "session_1",
      tenantId: "tenant_1",
      tenantSlug: "tenant-one",
      traceId: "trace_1",
      userId: "user_1"
    };
    next();
  });
  app.use(createWorkflowsRouter(createTestApiConfig()));
  app.use((error: unknown, request: express.Request, response: express.Response, _next: express.NextFunction) => {
    const problem =
      error instanceof ZodError
        ? fromZodError(error)
        : error instanceof ProblemDetailsError
          ? error
          : new ProblemDetailsError({
              detail: error instanceof Error ? error.message : "Unexpected internal server error.",
              status: 500,
              title: "Internal Server Error"
            });

    response.status(problem.status).json(toProblemDetails(request, problem));
  });

  return app;
}

void test("workflows router lists revisions for the active tenant", async () => {
  const expectedItems = [
    {
      createdAt: "2026-04-09T12:00:00.000Z",
      definition: createWorkflowCanvas(),
      id: "rev_2",
      version: 2
    }
  ];
  let receivedOrganizationLookup: unknown = null;
  let receivedRevisionLookup: unknown = null;
  const restores = [
    stubMethod(prisma.organization, "findFirst", (args: unknown) => {
      receivedOrganizationLookup = args;
      return Promise.resolve({
        id: "org_1",
        tenantId: "tenant_1"
      });
    }),
    stubMethod(prisma.workflowRevision, "findMany", (args: unknown) => {
      receivedRevisionLookup = args;
      return Promise.resolve(expectedItems);
    })
  ];

  try {
    const response = await request(createWorkflowsTestApp())
      .get("/api/v1/workflows/wf_1/revisions")
      .expect(200);

    assert.deepEqual(receivedOrganizationLookup, {
      where: {
        OR: [{ id: "tenant_1" }, { tenantId: "tenant_1" }]
      }
    });
    assert.deepEqual(receivedRevisionLookup, {
      orderBy: {
        version: "desc"
      },
      where: {
        tenantId: "tenant_1",
        workflowId: "wf_1"
      }
    });
    assert.deepEqual(response.body, {
      items: expectedItems,
      requestId: "req_1",
      workflowId: "wf_1"
    });
  } finally {
    for (const restore of restores.reverse()) {
      restore();
    }
  }
});

void test("workflows router reverts a revision using the authenticated tenant scope", async () => {
  const workflowCanvas = createWorkflowCanvas();
  let organizationLookupCount = 0;
  let workflowFindFirstCount = 0;
  let receivedRevisionLookup: unknown = null;
  let receivedTransactionUpdate: unknown = null;
  let receivedTransactionCreate: unknown = null;
  let receivedTransitionDelete: unknown = null;
  let receivedStepDelete: unknown = null;
  const restores = [
    stubMethod(prisma.organization, "findFirst", () => {
      organizationLookupCount += 1;
      return Promise.resolve({
        id: "org_1",
        tenantId: "tenant_1"
      });
    }),
    stubMethod(prisma.workflow, "findFirst", (args: unknown) => {
      workflowFindFirstCount += 1;

      if (workflowFindFirstCount === 1) {
        return Promise.resolve({
          definition: workflowCanvas,
          executions: [],
          id: "wf_1",
          organizationId: "org_1",
          status: "PUBLISHED",
          steps: [],
          tenantId: "tenant_1",
          transitions: [],
          triggerType: WorkflowTriggerType.MANUAL
        });
      }

      return Promise.resolve({
        definition: workflowCanvas,
        executions: [],
        id: "wf_1",
        name: "Onboarding Workflow",
        organizationId: "org_1",
        status: "DRAFT",
        steps: [],
        tenantId: "tenant_1",
        transitions: [],
        triggerType: WorkflowTriggerType.MANUAL
      });
    }),
    stubMethod(prisma.workflowRevision, "findUnique", (args: unknown) => {
      receivedRevisionLookup = args;
      return Promise.resolve({
        definition: workflowCanvas,
        tenantId: "tenant_1",
        version: 3,
        workflowId: "wf_1"
      });
    }),
    stubMethod(prisma, "$transaction", async (callback: (tx: Record<string, unknown>) => Promise<unknown>) => {
      return callback({
        workflow: {
          update: async (args: unknown) => {
            receivedTransactionUpdate = args;
            return {
              cronExpression: null,
              id: "wf_1",
              organizationId: "org_1",
              tenantId: "tenant_1",
              triggerType: WorkflowTriggerType.MANUAL
            };
          }
        },
        workflowRevision: {
          create: async (args: unknown) => {
            receivedTransactionCreate = args;
            return {};
          }
        },
        workflowStep: {
          deleteMany: async (args: unknown) => {
            receivedStepDelete = args;
            return {};
          }
        },
        workflowTransition: {
          deleteMany: async (args: unknown) => {
            receivedTransitionDelete = args;
            return {};
          }
        }
      });
    })
  ];

  try {
    const response = await request(createWorkflowsTestApp())
      .post("/api/v1/workflows/wf_1/revert")
      .send({
        version: 3
      })
      .expect(200);

    assert.equal(organizationLookupCount, 1);
    assert.equal(workflowFindFirstCount, 2);
    assert.deepEqual(receivedRevisionLookup, {
      where: {
        workflowId_version: {
          version: 3,
          workflowId: "wf_1"
        }
      }
    });
    assert.deepEqual(receivedTransactionUpdate, {
      data: {
        definition: workflowCanvas,
        publishedAt: null,
        status: "DRAFT",
        version: {
          increment: 1
        }
      },
      where: {
        id: "wf_1"
      }
    });
    assert.deepEqual(receivedTransactionCreate, {
      data: {
        definition: workflowCanvas,
        organizationId: "org_1",
        tenantId: "tenant_1",
        version: 3,
        workflowId: "wf_1"
      }
    });
    assert.deepEqual(receivedTransitionDelete, {
      where: {
        workflowId: "wf_1"
      }
    });
    assert.deepEqual(receivedStepDelete, {
      where: {
        workflowId: "wf_1"
      }
    });
    assert.equal(response.body.requestId, "req_1");
    assert.equal(response.body.workflow.id, "wf_1");
    assert.equal(response.body.workflow.status, "DRAFT");
    assert.equal(response.body.workflow.name, "Onboarding Workflow");
    assert.ok(response.body.workflow.stepLint);
  } finally {
    for (const restore of restores.reverse()) {
      restore();
    }
  }
});

void test("workflows router rejects invalid revert payloads", async () => {
  const response = await request(createWorkflowsTestApp())
    .post("/api/v1/workflows/wf_1/revert")
    .send({
      version: 0
    })
    .expect(400);

  assert.equal(response.body.status, 400);
  assert.equal(response.body.title, "Bad Request");
});
