import { Router } from "express";
import { z } from "zod";

import { requireAuthenticatedSession } from "../../common/guards/index.js";
import { asyncHandler, ProblemDetailsError } from "../../lib/problem-details.js";
import {
  appendConversationMessage,
  createConversation,
  getConversationById,
  listConversations,
  updateConversationStatus
} from "./service.js";

const conversationQuerySchema = z.object({
  channel: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(24),
  q: z.string().trim().min(1).optional(),
  status: z.string().trim().min(1).optional()
});

const createConversationSchema = z.object({
  channel: z.string().trim().min(1).optional(),
  initialMessage: z.string().trim().min(1).max(5_000).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  subject: z.string().trim().min(1).max(160)
});

const appendMessageSchema = z.object({
  content: z.string().trim().min(1).max(5_000)
});

const updateStatusSchema = z.object({
  status: z.string().trim().min(1).max(40)
});

function requireIdentity(input: {
  organizationId: string | null;
  tenantId: string | null;
  userId: string | null;
}) {
  if (!input.organizationId || !input.tenantId || !input.userId) {
    throw new ProblemDetailsError({
      detail: "Authenticated tenant, organization and user context are required.",
      status: 401,
      title: "Unauthorized"
    });
  }

  return {
    organizationId: input.organizationId,
    tenantId: input.tenantId,
    userId: input.userId
  };
}

export function createConversationsRouter(): Router {
  const router = Router();

  router.get(
    "/conversations",
    requireAuthenticatedSession,
    asyncHandler(async (request, response) => {
      const identity = requireIdentity({
        organizationId: request.context.organizationId,
        tenantId: request.context.tenantId,
        userId: request.context.userId
      });
      const query = conversationQuerySchema.parse(request.query);

      const items = await listConversations({
        channel: query.channel,
        limit: query.limit,
        organizationId: identity.organizationId,
        query: query.q,
        status: query.status,
        tenantId: identity.tenantId
      });

      response.status(200).json({
        items,
        requestId: request.context.requestId
      });
    })
  );

  router.get(
    "/conversations/:id",
    requireAuthenticatedSession,
    asyncHandler(async (request, response) => {
      const identity = requireIdentity({
        organizationId: request.context.organizationId,
        tenantId: request.context.tenantId,
        userId: request.context.userId
      });

      const conversation = await getConversationById({
        conversationId: String(request.params.id ?? ""),
        organizationId: identity.organizationId,
        tenantId: identity.tenantId
      });

      if (!conversation) {
        throw new ProblemDetailsError({
          detail: "Conversation not found.",
          status: 404,
          title: "Not Found"
        });
      }

      response.status(200).json({
        conversation,
        requestId: request.context.requestId
      });
    })
  );

  router.post(
    "/conversations",
    requireAuthenticatedSession,
    asyncHandler(async (request, response) => {
      const identity = requireIdentity({
        organizationId: request.context.organizationId,
        tenantId: request.context.tenantId,
        userId: request.context.userId
      });
      const payload = createConversationSchema.parse(request.body);
      const conversation = await createConversation({
        ...payload,
        organizationId: identity.organizationId,
        tenantId: identity.tenantId,
        userId: identity.userId
      });

      response.status(201).json({
        conversation,
        requestId: request.context.requestId
      });
    })
  );

  router.post(
    "/conversations/:id/messages",
    requireAuthenticatedSession,
    asyncHandler(async (request, response) => {
      const identity = requireIdentity({
        organizationId: request.context.organizationId,
        tenantId: request.context.tenantId,
        userId: request.context.userId
      });
      const payload = appendMessageSchema.parse(request.body);
      const message = await appendConversationMessage({
        content: payload.content,
        conversationId: String(request.params.id ?? ""),
        organizationId: identity.organizationId,
        tenantId: identity.tenantId,
        userId: identity.userId
      });

      response.status(201).json({
        message: {
          content:
            typeof message.content === "string"
              ? message.content
              : JSON.stringify(message.content, null, 2),
          createdAt: message.createdAt.toISOString(),
          direction: message.direction,
          id: message.id,
          role: message.role
        },
        requestId: request.context.requestId
      });
    })
  );

  router.patch(
    "/conversations/:id/status",
    requireAuthenticatedSession,
    asyncHandler(async (request, response) => {
      const identity = requireIdentity({
        organizationId: request.context.organizationId,
        tenantId: request.context.tenantId,
        userId: request.context.userId
      });
      const payload = updateStatusSchema.parse(request.body);
      const conversation = await updateConversationStatus({
        conversationId: String(request.params.id ?? ""),
        organizationId: identity.organizationId,
        status: payload.status,
        tenantId: identity.tenantId
      });

      response.status(200).json({
        conversation: {
          id: conversation.id,
          status: conversation.status,
          updatedAt: conversation.updatedAt.toISOString()
        },
        requestId: request.context.requestId
      });
    })
  );

  return router;
}
