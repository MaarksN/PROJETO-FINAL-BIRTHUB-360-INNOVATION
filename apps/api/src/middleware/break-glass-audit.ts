import { prisma, SessionAccessMode } from "@birthub/database";
import type { NextFunction, Request, Response } from "express";

export function breakGlassAuditMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  if (
    request.context.authType !== "session" ||
    request.context.sessionAccessMode !== SessionAccessMode.BREAK_GLASS ||
    !request.context.tenantId ||
    !request.context.impersonatedByUserId
  ) {
    next();
    return;
  }

  response.on("finish", () => {
    void prisma.auditLog.create({
      data: {
        action: "admin.break_glass.accessed",
        actorId: request.context.impersonatedByUserId,
        diff: {
          after: {
            breakGlassGrantId: request.context.breakGlassGrantId,
            breakGlassReason: request.context.breakGlassReason,
            breakGlassTicket: request.context.breakGlassTicket,
            method: request.method,
            path: request.originalUrl,
            requestId: request.context.requestId,
            statusCode: response.statusCode,
            targetUserId: request.context.userId
          },
          before: {}
        },
        entityId:
          request.context.breakGlassGrantId ??
          request.context.sessionId ??
          request.context.organizationId ??
          "break-glass",
        entityType: "break_glass_session",
        tenantId: request.context.tenantId
      }
    }).catch(() => undefined);
  });

  next();
}
