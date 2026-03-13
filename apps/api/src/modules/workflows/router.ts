import { createHmac } from "node:crypto";

import type { ApiConfig } from "@birthub/config";
import { prisma, Role, WorkflowTriggerType } from "@birthub/database";
import { Router } from "express";

import { RequireRole, requireAuthenticated } from "../../common/guards/index.js";
import { asyncHandler, ProblemDetailsError } from "../../lib/problem-details.js";
import { validateBody } from "../../middleware/validate-body.js";
import { emitWorkflowInternalEvent } from "../webhooks/eventBus.js";
import {
  workflowCreateSchema,
  workflowRunSchema,
  workflowUpdateSchema
} from "./schemas.js";
import {
  archiveWorkflow,
  createWorkflow,
  getWorkflowById,
  listWorkflows,
  runWorkflowNow,
  updateWorkflow
} from "./service.js";

export function createWorkflowsRouter(config: ApiConfig): Router {
  const router = Router();

  router.get(
    "/api/v1/workflows",
    requireAuthenticated,
    asyncHandler(async (request, response) => {
      const organizationId = request.context.tenantId;
      if (!organizationId) {
        throw new ProblemDetailsError({
          detail: "Authenticated organization is required.",
          status: 401,
          title: "Unauthorized"
        });
      }

      const items = await listWorkflows(organizationId);
      response.status(200).json({
        items,
        requestId: request.context.requestId
      });
    })
  );

  router.post(
    "/api/v1/workflows",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    validateBody(workflowCreateSchema),
    asyncHandler(async (request, response) => {
      const organizationId = request.context.tenantId;
      if (!organizationId) {
        throw new ProblemDetailsError({
          detail: "Authenticated organization is required.",
          status: 401,
          title: "Unauthorized"
        });
      }

      const workflow = await createWorkflow(config, organizationId, request.body);
      response.status(201).json({
        requestId: request.context.requestId,
        workflow
      });
    })
  );

  router.get(
    "/api/v1/workflows/:id",
    requireAuthenticated,
    asyncHandler(async (request, response) => {
      const organizationId = request.context.tenantId;
      if (!organizationId) {
        throw new ProblemDetailsError({
          detail: "Authenticated organization is required.",
          status: 401,
          title: "Unauthorized"
        });
      }

      const workflow = await getWorkflowById(request.params.id, organizationId);
      if (!workflow) {
        throw new ProblemDetailsError({
          detail: "Workflow not found.",
          status: 404,
          title: "Not Found"
        });
      }

      response.status(200).json({
        requestId: request.context.requestId,
        workflow
      });
    })
  );

  router.put(
    "/api/v1/workflows/:id",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    validateBody(workflowUpdateSchema),
    asyncHandler(async (request, response) => {
      const organizationId = request.context.tenantId;
      if (!organizationId) {
        throw new ProblemDetailsError({
          detail: "Authenticated organization is required.",
          status: 401,
          title: "Unauthorized"
        });
      }

      const workflow = await updateWorkflow(
        config,
        request.params.id,
        organizationId,
        request.body
      );
      response.status(200).json({
        requestId: request.context.requestId,
        workflow
      });
    })
  );

  router.delete(
    "/api/v1/workflows/:id",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      const organizationId = request.context.tenantId;
      if (!organizationId) {
        throw new ProblemDetailsError({
          detail: "Authenticated organization is required.",
          status: 401,
          title: "Unauthorized"
        });
      }

      await archiveWorkflow(request.params.id, organizationId);
      response.status(204).send();
    })
  );

  router.post(
    "/api/v1/workflows/:id/run",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    validateBody(workflowRunSchema),
    asyncHandler(async (request, response) => {
      const organizationId = request.context.tenantId;
      if (!organizationId) {
        throw new ProblemDetailsError({
          detail: "Authenticated organization is required.",
          status: 401,
          title: "Unauthorized"
        });
      }

      try {
        const result = await runWorkflowNow(
          config,
          request.params.id,
          organizationId,
          request.body,
          WorkflowTriggerType.MANUAL
        );
        response.status(result.mode === "async" ? 202 : 200).json({
          requestId: request.context.requestId,
          ...result
        });
      } catch (error) {
        if (error instanceof Error && error.message === "WORKFLOW_NOT_PUBLISHED") {
          throw new ProblemDetailsError({
            detail: "Only published workflows can be executed.",
            status: 409,
            title: "Conflict"
          });
        }

        throw error;
      }
    })
  );

  router.get(
    "/api/v1/workflows/:id/webhook-url",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      const organizationId = request.context.tenantId;
      if (!organizationId) {
        throw new ProblemDetailsError({
          detail: "Authenticated organization is required.",
          status: 401,
          title: "Unauthorized"
        });
      }

      const workflow = await getWorkflowById(request.params.id, organizationId);
      if (!workflow || workflow.triggerType !== WorkflowTriggerType.WEBHOOK) {
        throw new ProblemDetailsError({
          detail: "Webhook workflow not found.",
          status: 404,
          title: "Not Found"
        });
      }

      const host = request.header("x-forwarded-host") ?? request.header("host") ?? "localhost:3000";
      const protocol = request.header("x-forwarded-proto") ?? "http";
      const webhookUrl = `${protocol}://${host}/webhooks/trigger/${workflow.id}`;

      const signatureSeed = JSON.stringify({ hello: "world" });
      const sampleSignature = createHmac(
        "sha256",
        workflow.webhookSecret ?? config.JOB_HMAC_GLOBAL_SECRET
      )
        .update(signatureSeed)
        .digest("hex");

      response.status(200).json({
        requestId: request.context.requestId,
        sampleSignature,
        webhookUrl
      });
    })
  );

  router.post(
    "/api/v1/workflows/events/:topic",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      const organizationId = request.context.tenantId;
      if (!organizationId) {
        throw new ProblemDetailsError({
          detail: "Authenticated organization is required.",
          status: 401,
          title: "Unauthorized"
        });
      }

      const organization = await prisma.organization.findUnique({
        where: {
          id: organizationId
        }
      });

      if (!organization) {
        throw new ProblemDetailsError({
          detail: "Organization not found.",
          status: 404,
          title: "Not Found"
        });
      }

      emitWorkflowInternalEvent({
        payload: (request.body ?? {}) as Record<string, unknown>,
        tenantId: organization.tenantId,
        topic: request.params.topic
      });

      response.status(202).json({
        accepted: true,
        requestId: request.context.requestId,
        topic: request.params.topic
      });
    })
  );

  return router;
}
