// @ts-nocheck
import assert from "node:assert/strict";
import test from "node:test";

import { prisma, Role } from "@birthub/database";
import express from "express";
import request from "supertest";
import { ZodError } from "zod";

import {
  ProblemDetailsError,
  fromZodError,
  toProblemDetails
} from "../src/lib/problem-details.js";
import { createSearchRouter } from "../src/modules/search/router.js";

function stubMethod(target: object, key: string, value: unknown): () => void {
  const original = Reflect.get(target, key);
  Reflect.set(target, key, value);
  return () => {
    Reflect.set(target, key, original);
  };
}

function createSearchTestApp() {
  const app = express();
  app.use((request, _response, next) => {
    request.context = {
      apiKeyId: null,
      authType: "session",
      billingPlanStatus: null,
      breakGlassGrantId: null,
      breakGlassReason: null,
      breakGlassTicket: null,
      impersonatedByUserId: null,
      organizationId: "org_product",
      requestId: "req_search",
      role: Role.MEMBER,
      sessionAccessMode: null,
      sessionId: "session_product",
      tenantId: "tenant_product",
      tenantSlug: "tenant-product",
      traceId: "trace_search",
      userId: "user_product"
    };
    next();
  });
  app.use("/api/v1", createSearchRouter());
  app.use((error: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
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

    res.status(problem.status).json(toProblemDetails(req, problem));
  });
  return app;
}

void test("search router returns tenant-aware grouped results from real backing queries", async () => {
  let workflowWhere: unknown = null;
  let notificationWhere: unknown = null;

  const restores = [
    stubMethod(prisma.workflow, "findMany", (args: { where?: unknown }) => {
      workflowWhere = args.where ?? null;
      return Promise.resolve([
        {
          id: "wf_1",
          name: "Workflow de onboarding",
          status: "PUBLISHED",
          triggerType: "WEBHOOK"
        }
      ]);
    }),
    stubMethod(prisma.conversationThread, "findMany", () =>
      Promise.resolve([
        {
          id: "thread_1",
          messages: [
            {
              contentPreview: "Paciente aguardando retorno"
            }
          ],
          subject: "Retorno onboarding"
        }
      ])
    ),
    stubMethod(prisma.notification, "findMany", (args: { where?: unknown }) => {
      notificationWhere = args.where ?? null;
      return Promise.resolve([
        {
          content: "Workflow de onboarding falhou",
          id: "notif_1",
          type: "workflow_alert"
        }
      ]);
    }),
    stubMethod(prisma.outputArtifact, "findMany", () =>
      Promise.resolve([
        {
          agentId: "agent_1",
          id: "output_1",
          status: "READY",
          type: "executive-report"
        }
      ])
    )
  ];

  try {
    const response = await request(createSearchTestApp())
      .get("/api/v1/search")
      .query({
        q: "onboarding"
      })
      .expect(200);

    assert.deepEqual(workflowWhere, {
      OR: [
        {
          name: {
            contains: "onboarding",
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: "onboarding",
            mode: "insensitive"
          }
        }
      ],
      tenantId: "tenant_product"
    });
    assert.deepEqual(notificationWhere, {
      content: {
        contains: "onboarding",
        mode: "insensitive"
      },
      tenantId: "tenant_product",
      userId: "user_product"
    });
    assert.equal(response.body.query, "onboarding");
    assert.equal(response.body.requestId, "req_search");
    assert.deepEqual(
      response.body.groups.map((group: { id: string }) => group.id),
      ["shortcuts", "workflows", "conversations", "notifications", "reports"]
    );
    assert.equal(response.body.groups[1]?.items[0]?.href, "/workflows/wf_1/edit");
    assert.equal(response.body.groups[2]?.items[0]?.href, "/conversations?thread=thread_1");
  } finally {
    for (const restore of restores.reverse()) {
      restore();
    }
  }
});

void test("search router serves shortcut-only results for very short queries", async () => {
  const workflowCalls: unknown[] = [];
  const restores = [
    stubMethod(prisma.workflow, "findMany", (args: unknown) => {
      workflowCalls.push(args);
      return Promise.resolve([]);
    })
  ];

  try {
    const response = await request(createSearchTestApp())
      .get("/api/v1/search")
      .query({
        q: "a"
      })
      .expect(200);

    assert.equal(workflowCalls.length, 0);
    assert.deepEqual(
      response.body.groups.map((group: { id: string }) => group.id),
      ["shortcuts"]
    );
  } finally {
    for (const restore of restores.reverse()) {
      restore();
    }
  }
});
