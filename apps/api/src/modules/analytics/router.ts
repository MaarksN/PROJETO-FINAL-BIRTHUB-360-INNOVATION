import { Role } from "@birthub/database";
import { Router } from "express";
import { z } from "zod";

import { RequireRole, requireAuthenticated } from "../../common/guards/index.js";
import { asyncHandler } from "../../lib/problem-details.js";
import {
  exportBillingCsv,
  getActiveTenantsMetrics,
  getCohortMetrics,
  getExecutiveMetrics,
  getUsageMetrics
} from "./service.js";

const dateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional()
});

export function createAnalyticsRouter(): Router {
  const router = Router();

  router.get(
    "/usage",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      const range = dateRangeSchema.parse(request.query);
      const usage = await getUsageMetrics({
        from: range.from ? new Date(range.from) : undefined,
        to: range.to ? new Date(range.to) : undefined
      });

      response.status(200).json({
        items: usage,
        requestId: request.context.requestId
      });
    })
  );

  router.get(
    "/executive",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      response.status(200).json({
        metrics: await getExecutiveMetrics(),
        requestId: request.context.requestId
      });
    })
  );

  router.get(
    "/cohort",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      response.status(200).json({
        items: await getCohortMetrics(),
        requestId: request.context.requestId
      });
    })
  );

  router.get(
    "/billing/export",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      const range = dateRangeSchema.parse(request.query);
      const csv = await exportBillingCsv({
        from: range.from ? new Date(range.from) : undefined,
        to: range.to ? new Date(range.to) : undefined
      });

      response.setHeader("Content-Disposition", 'attachment; filename="billing-export.csv"');
      response.type("text/csv").send(csv);
    })
  );

  router.get(
    "/active-tenants",
    requireAuthenticated,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      response.status(200).json({
        metrics: await getActiveTenantsMetrics(),
        requestId: request.context.requestId
      });
    })
  );

  return router;
}
