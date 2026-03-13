import type { NextFunction, Request, Response } from "express";

import { ProblemDetailsError } from "../lib/problem-details.js";

const mutationMethods = new Set(["PATCH", "POST", "PUT"]);

export function contentTypeMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction
): void {
  if (!mutationMethods.has(request.method)) {
    next();
    return;
  }

  if (request.is("application/json")) {
    next();
    return;
  }

  next(
    new ProblemDetailsError({
      detail: "This endpoint only accepts 'application/json' payloads.",
      status: 415,
      title: "Unsupported Media Type"
    })
  );
}
