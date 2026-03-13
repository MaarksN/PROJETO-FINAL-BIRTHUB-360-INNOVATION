import { Router } from "express";
import { z } from "zod";

import { RequireFeature } from "../../common/guards/index.js";
import { asyncHandler, ProblemDetailsError } from "../../lib/problem-details.js";
import { LimitExceededError } from "../billing/index.js";
import { packInstallerService } from "./pack-installer.service.js";

export function createPackInstallerRouter(): Router {
  const router = Router();

  router.post(
    "/install",
    RequireFeature("agents"),
    asyncHandler(async (request, response) => {
      const tenantId = request.context.tenantId ?? "default-tenant";
      const payload = z
        .object({
          activateAgents: z.boolean().default(true),
          connectors: z.record(z.string(), z.unknown()).default({}),
          packId: z.string().min(1).default("corporate-v1")
        })
        .parse(request.body);

      let result: Awaited<ReturnType<typeof packInstallerService.installPackAtomic>>;

      try {
        result = await packInstallerService.installPackAtomic({
          ...payload,
          tenantId
        });
      } catch (error) {
        if (error instanceof LimitExceededError) {
          throw new ProblemDetailsError({
            detail: `Plano atual permite no máximo ${error.limit} agentes (${error.current} já criados).`,
            status: 402,
            title: "Payment Required"
          });
        }

        throw error;
      }

      response.status(201).json({
        requestId: request.context.requestId,
        ...result
      });
    })
  );

  router.post(
    "/uninstall",
    asyncHandler(async (request, response) => {
      const tenantId = request.context.tenantId ?? "default-tenant";
      const payload = z.object({ packId: z.string().min(1) }).parse(request.body);

      const result = await packInstallerService.uninstallPackAtomic({
        packId: payload.packId,
        tenantId
      });

      response.status(200).json({
        requestId: request.context.requestId,
        ...result
      });
    })
  );

  router.get(
    "/status",
    asyncHandler(async (request, response) => {
      const tenantId = request.context.tenantId ?? "default-tenant";
      const packs = await packInstallerService.getPackStatus(tenantId);

      response.status(200).json({
        packs,
        requestId: request.context.requestId
      });
    })
  );

  router.post(
    "/:packId/version",
    asyncHandler(async (request, response) => {
      const tenantId = request.context.tenantId ?? "default-tenant";
      const payload = z
        .object({
          latestAvailableVersion: z.string().min(1)
        })
        .parse(request.body);

      const result = await packInstallerService.updatePackVersion({
        latestAvailableVersion: payload.latestAvailableVersion,
        packId: request.params.packId,
        tenantId
      });

      response.status(200).json({
        requestId: request.context.requestId,
        ...result
      });
    })
  );

  router.get(
    "/:packId",
    asyncHandler(async (request, response) => {
      const tenantId = request.context.tenantId ?? "default-tenant";
      const statuses = await packInstallerService.getPackStatus(tenantId);
      const pack = statuses.find((item) => item.packId === request.params.packId);

      if (!pack) {
        throw new ProblemDetailsError({
          detail: `Pack ${request.params.packId} not found for tenant ${tenantId}.`,
          status: 404,
          title: "Pack Not Found"
        });
      }

      response.status(200).json({
        pack,
        requestId: request.context.requestId
      });
    })
  );

  return router;
}
