import { createHmac } from "node:crypto";

import type { ApiConfig } from "@birthub/config";
import { prisma, WorkflowTriggerType } from "@birthub/database";
import { Router } from "express";

import { asyncHandler, ProblemDetailsError } from "../../lib/problem-details.js";
import { dedupeTriggerPayload } from "../workflows/runnerQueue.js";
import { runWorkflowNow } from "../workflows/service.js";

export function createWebhooksRouter(config: ApiConfig): Router {
  const router = Router();

  router.post(
    "/webhooks/trigger/:id",
    asyncHandler(async (request, response) => {
      const workflow = await prisma.workflow.findUnique({
        where: {
          id: request.params.id
        }
      });

      if (!workflow || workflow.triggerType !== WorkflowTriggerType.WEBHOOK) {
        throw new ProblemDetailsError({
          detail: "Webhook trigger not found.",
          status: 404,
          title: "Not Found"
        });
      }

      const payload = request.body as Record<string, unknown>;
      const signature = request.header("x-birthhub-signature");
      const expected = createHmac(
        "sha256",
        workflow.webhookSecret ?? config.JOB_HMAC_GLOBAL_SECRET
      )
        .update(JSON.stringify(payload))
        .digest("hex");

      if (!signature || signature !== expected) {
        throw new ProblemDetailsError({
          detail: "Invalid webhook signature.",
          status: 401,
          title: "Unauthorized"
        });
      }

      const dedupeAccepted = await dedupeTriggerPayload(config, workflow.tenantId, payload);
      if (!dedupeAccepted) {
        response.status(200).json({
          deduplicated: true
        });
        return;
      }

      const execution = await runWorkflowNow(
        config,
        workflow.id,
        workflow.organizationId,
        {
          async: true,
          payload
        },
        WorkflowTriggerType.WEBHOOK
      );

      response.status(202).json({
        deduplicated: false,
        executionId: execution.executionId
      });
    })
  );

  return router;
}

