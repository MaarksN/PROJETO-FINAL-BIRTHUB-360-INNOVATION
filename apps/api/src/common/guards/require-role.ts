import type { NextFunction, Request, RequestHandler, Response } from "express";

import { Role } from "@birthub/database";

import { ProblemDetailsError } from "../../lib/problem-details.js";
import { assertRole } from "../../modules/auth/auth.service.js";

/** @see ADR-011 */
// [SOURCE] ADR-012
export interface RBACContext {
  organizationId: string;
  role: Role;
  tenantId: string;
  userId: string;
}

type RbacPermission =
  | "agent:read"
  | "agent:write"
  | "analytics:read"
  | "apikey:manage"
  | "billing:read"
  | "billing:write"
  | "organization:admin"
  | "user:read"
  | "user:write";

export const ROLE_PERMISSIONS: Record<Role, readonly RbacPermission[]> = {
  [Role.SUPER_ADMIN]: [
    "agent:read",
    "agent:write",
    "analytics:read",
    "apikey:manage",
    "billing:read",
    "billing:write",
    "organization:admin",
    "user:read",
    "user:write"
  ],
  [Role.OWNER]: [
    "agent:read",
    "agent:write",
    "analytics:read",
    "apikey:manage",
    "billing:read",
    "billing:write",
    "organization:admin",
    "user:read",
    "user:write"
  ],
  [Role.ADMIN]: [
    "agent:read",
    "agent:write",
    "analytics:read",
    "apikey:manage",
    "billing:read",
    "billing:write",
    "user:read",
    "user:write"
  ],
  [Role.MEMBER]: ["agent:read", "analytics:read", "billing:read", "user:read"],
  [Role.READONLY]: ["agent:read", "analytics:read", "billing:read", "user:read"]
};

export function hasRolePermission(role: Role, permission: RbacPermission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function RequireRole(minimumRole: Role): RequestHandler {
  return async (request: Request, _response: Response, next: NextFunction) => {
    try {
      const userId = request.context.userId;
      const organizationId = request.context.organizationId;

      if (!userId || !organizationId) {
        throw new ProblemDetailsError({
          detail: "Authentication is required before role authorization.",
          status: 401,
          title: "Unauthorized"
        });
      }

      const hasRole = await assertRole({
        minimumRole,
        organizationId,
        userId
      });

      if (!hasRole) {
        throw new ProblemDetailsError({
          detail: `Role '${minimumRole}' is required for this operation.`,
          status: 403,
          title: "Forbidden"
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireAuthenticated(request: Request, _response: Response, next: NextFunction): void {
  if (
    !request.context.userId ||
    !request.context.organizationId ||
    !request.context.tenantId
  ) {
    next(
      new ProblemDetailsError({
        detail: "A valid session or API key is required.",
        status: 401,
        title: "Unauthorized"
      })
    );
    return;
  }

  next();
}

export function requireAuthenticatedSession(
  request: Request,
  _response: Response,
  next: NextFunction
): void {
  if (
    request.context.authType !== "session" ||
    !request.context.userId ||
    !request.context.organizationId ||
    !request.context.tenantId ||
    !request.context.sessionId
  ) {
    next(
      new ProblemDetailsError({
        detail: "A valid authenticated session is required.",
        status: 401,
        title: "Unauthorized"
      })
    );
    return;
  }

  next();
}
