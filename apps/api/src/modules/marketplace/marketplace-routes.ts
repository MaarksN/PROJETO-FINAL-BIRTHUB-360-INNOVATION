import { Router } from "express";

import { asyncHandler, ProblemDetailsError } from "../../lib/problem-details.js";
import { marketplaceService } from "./marketplace-service.js";

function parsePositiveInt(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.floor(parsed);
}

export function createMarketplaceRouter(): Router {
  const router = Router();

  router.get(
    "/search",
    asyncHandler(async (request, response) => {
      const result = await marketplaceService.search({
        domains: request.query.domain as string | string[] | undefined,
        industries: request.query.industry as string | string[] | undefined,
        levels: request.query.level as string | string[] | undefined,
        page: parsePositiveInt(request.query.page, 1),
        pageSize: parsePositiveInt(request.query.pageSize, 12),
        personas: request.query.persona as string | string[] | undefined,
        query: (request.query.q as string | undefined) ?? "",
        tags: request.query.tags as string | string[] | undefined,
        useCases: request.query.useCase as string | string[] | undefined
      });

      response.status(200).json({
        facets: result.facets,
        page: result.page,
        pageSize: result.pageSize,
        requestId: request.context.requestId,
        results: result.results.map((entry) => ({
          agent: entry.manifest.agent,
          score: entry.score,
          tags: entry.manifest.tags,
          tools: entry.manifest.tools.map((tool) => ({
            description: tool.description,
            id: tool.id,
            name: tool.name
          }))
        })),
        total: result.total
      });
    })
  );

  router.get(
    "/recommendations",
    asyncHandler(async (request, response) => {
      const tenantIndustry =
        (request.query.tenantIndustry as string | undefined) ??
        request.header("x-tenant-industry") ??
        "sales";

      const recommendations = await marketplaceService.recommend(tenantIndustry, 6);

      response.status(200).json({
        requestId: request.context.requestId,
        tenantIndustry,
        recommendations: recommendations.map((entry) => ({
          agent: entry.manifest.agent,
          recommendationScore: entry.recommendationScore,
          tags: entry.manifest.tags
        }))
      });
    })
  );

  router.get(
    "/compare/matrix",
    asyncHandler(async (request, response) => {
      const matrix = await marketplaceService.getCapabilityMatrix();

      response.status(200).json({
        matrix,
        requestId: request.context.requestId
      });
    })
  );

  router.get(
    "/:agentId/docs",
    asyncHandler(async (request, response) => {
      const docs = await marketplaceService.getAgentDocs(request.params.agentId);

      if (!docs) {
        throw new ProblemDetailsError({
          detail: `Agent ${request.params.agentId} not found in catalog.`,
          status: 404,
          title: "Agent Not Found"
        });
      }

      response.status(200).json({
        docs,
        requestId: request.context.requestId
      });
    })
  );

  router.get(
    "/:agentId/changelog",
    asyncHandler(async (request, response) => {
      const changelog = await marketplaceService.getAgentChangelog(request.params.agentId);

      if (!changelog) {
        throw new ProblemDetailsError({
          detail: `Agent ${request.params.agentId} not found in catalog.`,
          status: 404,
          title: "Agent Not Found"
        });
      }

      response.status(200).json({
        changelog,
        requestId: request.context.requestId
      });
    })
  );

  return router;
}
