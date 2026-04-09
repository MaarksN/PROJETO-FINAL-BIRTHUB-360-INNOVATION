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
import { createConversationsRouter } from "../src/modules/conversations/router.js";

function stubMethod(target: object, key: string, value: unknown): () => void {
  const original = Reflect.get(target, key);
  Reflect.set(target, key, value);
  return () => {
    Reflect.set(target, key, original);
  };
}

function createConversationsTestApp() {
  const app = express();
  app.use(express.json());
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
      requestId: "req_conversations",
      role: Role.MEMBER,
      sessionAccessMode: null,
      sessionId: "session_product",
      tenantId: "tenant_product",
      tenantSlug: "tenant-product",
      traceId: "trace_conversations",
      userId: "user_product"
    };
    next();
  });
  app.use("/api/v1", createConversationsRouter());
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

void test("conversations router lists scoped threads with filters and previews", async () => {
  let receivedWhere: unknown = null;

  const restore = stubMethod(prisma.conversationThread, "findMany", (args: { where?: unknown }) => {
    receivedWhere = args.where ?? null;
    return Promise.resolve([
      {
        _count: {
          messages: 3
        },
        channel: "whatsapp",
        createdAt: new Date("2026-04-07T12:00:00.000Z"),
        customerReference: "cust_1",
        id: "thread_1",
        leadReference: "lead_1",
        messages: [
          {
            contentPreview: "Paciente aguardando orientacao",
            createdAt: new Date("2026-04-07T13:00:00.000Z")
          }
        ],
        status: "open",
        subject: "Duvida sobre retorno",
        updatedAt: new Date("2026-04-07T13:30:00.000Z")
      }
    ]);
  });

  try {
    const response = await request(createConversationsTestApp())
      .get("/api/v1/conversations")
      .query({
        channel: "whatsapp",
        q: "retorno",
        status: "open"
      })
      .expect(200);

    assert.deepEqual(receivedWhere, {
      OR: [
        {
          subject: {
            contains: "retorno",
            mode: "insensitive"
          }
        },
        {
          customerReference: {
            contains: "retorno",
            mode: "insensitive"
          }
        },
        {
          leadReference: {
            contains: "retorno",
            mode: "insensitive"
          }
        },
        {
          messages: {
            some: {
              contentPreview: {
                contains: "retorno",
                mode: "insensitive"
              }
            }
          }
        }
      ],
      channel: "whatsapp",
      organizationId: "org_product",
      status: "open",
      tenantId: "tenant_product"
    });
    assert.equal(response.body.requestId, "req_conversations");
    assert.equal(response.body.items[0]?.id, "thread_1");
    assert.equal(response.body.items[0]?.messageCount, 3);
    assert.equal(response.body.items[0]?.lastMessagePreview, "Paciente aguardando orientacao");
  } finally {
    restore();
  }
});

void test("conversations router creates a thread and reloads the scoped detail", async () => {
  let createdThreadPayload: unknown = null;
  let createdMessagePayload: unknown = null;

  const tx = {
    conversationMessage: {
      create: (args: { data?: unknown }) => {
        createdMessagePayload = args.data ?? null;
        return Promise.resolve({ id: "message_1" });
      }
    },
    conversationThread: {
      create: (args: { data?: unknown }) => {
        createdThreadPayload = args.data ?? null;
        return Promise.resolve({ id: "thread_2" });
      }
    }
  };

  const restores = [
    stubMethod(prisma, "$transaction", (callback: (client: typeof tx) => Promise<unknown>) => callback(tx)),
    stubMethod(prisma.conversationThread, "findFirst", () =>
      Promise.resolve({
        channel: "internal",
        createdAt: new Date("2026-04-07T14:00:00.000Z"),
        customerReference: null,
        id: "thread_2",
        leadReference: null,
        messages: [
          {
            agentId: null,
            content: "Primeira nota",
            contentPreview: "Primeira nota",
            createdAt: new Date("2026-04-07T14:00:00.000Z"),
            direction: "internal",
            id: "message_1",
            metadata: {
              origin: "dashboard"
            },
            role: "operator"
          }
        ],
        metadata: {
          origin: "dashboard"
        },
        status: "open",
        subject: "Acompanhamento inicial",
        updatedAt: new Date("2026-04-07T14:00:00.000Z")
      })
    )
  ];

  try {
    const response = await request(createConversationsTestApp())
      .post("/api/v1/conversations")
      .send({
        initialMessage: "Primeira nota",
        metadata: {
          origin: "dashboard"
        },
        subject: "Acompanhamento inicial"
      })
      .expect(201);

    assert.deepEqual(createdThreadPayload, {
      channel: "internal",
      metadata: {
        origin: "dashboard"
      },
      organizationId: "org_product",
      status: "open",
      subject: "Acompanhamento inicial",
      tenantId: "tenant_product"
    });
    assert.deepEqual(createdMessagePayload, {
      content: "Primeira nota",
      contentPreview: "Primeira nota",
      direction: "internal",
      metadata: {
        createdByUserId: "user_product",
        origin: "dashboard"
      },
      organizationId: "org_product",
      role: "operator",
      tenantId: "tenant_product",
      threadId: "thread_2"
    });
    assert.equal(response.body.requestId, "req_conversations");
    assert.equal(response.body.conversation.id, "thread_2");
    assert.equal(response.body.conversation.messages[0]?.id, "message_1");
  } finally {
    for (const restore of restores.reverse()) {
      restore();
    }
  }
});

void test("conversations router validates subject before creating a thread", async () => {
  const response = await request(createConversationsTestApp())
    .post("/api/v1/conversations")
    .send({
      initialMessage: "Sem assunto"
    })
    .expect(400);

  assert.match(String(response.body.detail ?? ""), /invalid/i);
});
