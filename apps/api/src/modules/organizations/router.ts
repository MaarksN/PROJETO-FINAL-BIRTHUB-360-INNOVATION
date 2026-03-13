import { Role } from "@birthub/database";
import {
  createOrganizationRequestSchema,
  createOrganizationResponseSchema,
  cursorPaginationQuerySchema
} from "@birthub/config";
import { Router } from "express";
import { z } from "zod";

import { Auditable } from "../../audit/auditable.js";
import { asyncHandler, ProblemDetailsError } from "../../lib/problem-details.js";
import { validateBody } from "../../middleware/validate-body.js";
import {
  createOrganization,
  exportAuditLogsCsv,
  listAuditLogs,
  listMembersForOrganization,
  removeMember,
  updateMemberRole
} from "./service.js";

const memberRoleSchema = z.object({
  role: z.nativeEnum(Role)
});

const auditFilterSchema = cursorPaginationQuerySchema.extend({
  actorId: z.string().optional(),
  entityType: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional()
});

function requireTenantId(tenantId: string | null | undefined): string {
  if (!tenantId) {
    throw new ProblemDetailsError({
      detail: "Active tenant is required for this operation.",
      status: 400,
      title: "Bad Request"
    });
  }

  return tenantId;
}

export function createOrganizationsRouter(): Router {
  const router = Router();

  const createOrganizationHandler = Auditable({
    action: "organization.created",
    entityType: "organization",
    resolveEntityId: (_request, _response, result) =>
      typeof result === "object" && result && "organizationId" in result
        ? String(result.organizationId)
        : undefined,
    resolveTenantId: (_request, _response, result) =>
      typeof result === "object" && result && "tenantId" in result ? String(result.tenantId) : undefined
  })(async (request, response) => {
      const organization = createOrganizationResponseSchema.parse(
      await createOrganization({
        ...request.body,
        requestId: request.context.requestId
      })
    );

    response.status(201).json(organization);
    return organization;
  });

  router.post("/orgs", validateBody(createOrganizationRequestSchema), asyncHandler(createOrganizationHandler));
  router.post(
    "/organizations",
    validateBody(createOrganizationRequestSchema),
    asyncHandler(createOrganizationHandler)
  );

  router.get(
    "/orgs/:id/members",
    asyncHandler(async (request, response) => {
      const pagination = cursorPaginationQuerySchema.parse(request.query);
      const tenantId = requireTenantId(request.tenantContext?.tenantId ?? request.context.tenantId);

      response.status(200).json(
        await listMembersForOrganization({
          cursor: pagination.cursor,
          organizationId: request.params.id,
          take: pagination.take,
          tenantId
        })
      );
    })
  );

  router.patch(
    "/orgs/:id/members/:memberId",
    validateBody(memberRoleSchema),
    asyncHandler(
      Auditable({
        action: "member.role_updated",
        entityType: "member",
        resolveEntityId: (request) => request.params.memberId
      })(async (request, response) => {
        const tenantId = requireTenantId(request.tenantContext?.tenantId ?? request.context.tenantId);
        const membership = await updateMemberRole({
          memberId: request.params.memberId,
          organizationId: request.params.id,
          role: request.body.role,
          tenantId
        });

        response.status(200).json(membership);
        return membership ?? undefined;
      })
    )
  );

  router.delete(
    "/orgs/:id/members/:memberId",
    asyncHandler(
      Auditable({
        action: "member.removed",
        entityType: "member",
        resolveEntityId: (request) => request.params.memberId
      })(async (request, response) => {
        const tenantId = requireTenantId(request.tenantContext?.tenantId ?? request.context.tenantId);
        const membership = await removeMember({
          memberId: request.params.memberId,
          organizationId: request.params.id,
          tenantId
        });

        response.status(200).json(membership);
        return membership;
      })
    )
  );

  router.get(
    "/orgs/:id/audit",
    asyncHandler(async (request, response) => {
      const filters = auditFilterSchema.parse(request.query);
      const tenantId = requireTenantId(request.tenantContext?.tenantId ?? request.context.tenantId);

      response.status(200).json(
        await listAuditLogs({
          actorId: filters.actorId,
          cursor: filters.cursor,
          entityType: filters.entityType,
          from: filters.from,
          organizationId: request.params.id,
          take: filters.take,
          tenantId,
          to: filters.to
        })
      );
    })
  );

  router.get(
    "/orgs/:id/audit/export",
    asyncHandler(async (request, response) => {
      const filters = auditFilterSchema.partial({
        cursor: true,
        take: true
      }).parse(request.query);
      const tenantId = requireTenantId(request.tenantContext?.tenantId ?? request.context.tenantId);
      const csv = await exportAuditLogsCsv({
        actorId: filters.actorId,
        entityType: filters.entityType,
        from: filters.from,
        organizationId: request.params.id,
        tenantId,
        to: filters.to
      });

      response.setHeader("Content-Disposition", 'attachment; filename="audit.csv"');
      response.type("text/csv").send(csv);
    })
  );

  return router;
}
