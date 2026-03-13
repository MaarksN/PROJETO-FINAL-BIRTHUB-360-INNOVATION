import type { NextFunction, Request, RequestHandler, Response } from "express";

import { getApiConfig } from "@birthub/config";

import { ProblemDetailsError } from "../../lib/problem-details.js";
import { canUseFeature, type PlanFeature } from "../../modules/billing/service.js";

const config = getApiConfig();

export function RequireFeature(feature: PlanFeature): RequestHandler {
  return async (request: Request, _response: Response, next: NextFunction) => {
    try {
      const organizationId = request.context.tenantId;

      if (!organizationId) {
        throw new ProblemDetailsError({
          detail: "Authentication is required before checking plan features.",
          status: 401,
          title: "Unauthorized"
        });
      }

      const { allowed, snapshot } = await canUseFeature(
        organizationId,
        feature,
        config.BILLING_GRACE_PERIOD_DAYS
      );

      if (!allowed) {
        throw new ProblemDetailsError({
          detail: snapshot.hardLocked
            ? "Your subscription is locked due to failed payments. Update billing to continue."
            : `The active plan does not include feature '${feature}'.`,
          status: 402,
          title: "Payment Required"
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
