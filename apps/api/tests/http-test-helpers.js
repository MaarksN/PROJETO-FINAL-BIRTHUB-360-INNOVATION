import { Role } from "@birthub/database";
import express from "express";
import { ZodError } from "zod";
import { ProblemDetailsError, fromZodError, toProblemDetails } from "../src/lib/problem-details.js";
export function stubMethod(target, key, value) {
    const original = Reflect.get(target, key);
    Reflect.set(target, key, value);
    return () => {
        Reflect.set(target, key, original);
    };
}
export function createAuthenticatedApiTestApp(input) {
    const app = express();
    if (input.useJson !== false) {
        app.use(express.json());
    }
    app.use((request, _response, next) => {
        const baseContext = {
            apiKeyId: null,
            authType: "session",
            billingPlanStatus: null,
            breakGlassGrantId: null,
            breakGlassReason: null,
            breakGlassTicket: null,
            impersonatedByUserId: null,
            organizationId: "org_1",
            requestId: "req_1",
            role: Role.ADMIN,
            sessionAccessMode: null,
            sessionId: "session_1",
            tenantId: "tenant_1",
            tenantSlug: "tenant-one",
            traceId: "trace_1",
            userId: "user_1"
        };
        request.context = {
            ...baseContext,
            ...(input.contextOverrides ?? {})
        };
        next();
    });
    if (input.mountPath) {
        app.use(input.mountPath, input.router);
    }
    else {
        app.use(input.router);
    }
    app.use((error, request, response, _next) => {
        const problem = error instanceof ZodError
            ? fromZodError(error)
            : error instanceof ProblemDetailsError
                ? error
                : new ProblemDetailsError({
                    detail: error instanceof Error ? error.message : "Unexpected internal server error.",
                    status: 500,
                    title: "Internal Server Error"
                });
        response.status(problem.status).json(toProblemDetails(request, problem));
    });
    return app;
}
