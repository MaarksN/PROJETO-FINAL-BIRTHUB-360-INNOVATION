import type { Request, Response, NextFunction } from "express";

export function cloudLoggingMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const correlationId = req.header("x-correlation-id") ?? "n/a";

  if (process.env.NODE_ENV !== "test") {
    console.info("[cloud-log]", {
      method: req.method,
      path: req.path,
      correlationId,
    });
  }

  next();
}
