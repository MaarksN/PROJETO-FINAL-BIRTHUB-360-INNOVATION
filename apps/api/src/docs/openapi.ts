import { OpenApiGeneratorV3, OpenAPIRegistry, extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import {
  createOrganizationRequestSchema,
  createOrganizationResponseSchema,
  healthResponseSchema,
  loginRequestSchema,
  loginResponseSchema,
  taskEnqueuedResponseSchema,
  taskRequestSchema
} from "@birthub/config";
import { z } from "zod";

extendZodWithOpenApi(z);

const registry = new OpenAPIRegistry();

const loginRequest = registry.register("LoginRequest", loginRequestSchema);
const loginResponse = registry.register("LoginResponse", loginResponseSchema);
const createOrganizationRequest = registry.register(
  "CreateOrganizationRequest",
  createOrganizationRequestSchema
);
const createOrganizationResponse = registry.register(
  "CreateOrganizationResponse",
  createOrganizationResponseSchema
);
const taskRequest = registry.register("CreateTaskRequest", taskRequestSchema);
const taskResponse = registry.register("CreateTaskResponse", taskEnqueuedResponseSchema);
const healthResponse = registry.register("HealthResponse", healthResponseSchema);

registry.registerPath({
  method: "get",
  path: "/api/v1/health",
  responses: {
    200: {
      content: {
        "application/json": {
          example: {
            checkedAt: "2026-03-13T00:00:00.000Z",
            services: {
              database: {
                status: "up"
              },
              externalDependencies: [
                {
                  name: "example.com",
                  status: "up"
                }
              ],
              redis: {
                status: "up"
              }
            },
            status: "ok"
          },
          schema: healthResponse
        }
      },
      description: "Runtime health summary for database, Redis and external dependencies."
    }
  },
  summary: "Health check",
  tags: ["Platform"]
});

registry.registerPath({
  method: "post",
  path: "/api/v1/auth/login",
  request: {
    body: {
      content: {
        "application/json": {
          example: {
            email: "owner@birthub.local",
            password: "Password123!",
            tenantId: "tenant_demo"
          },
          schema: loginRequest
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        "application/json": {
          example: {
            requestId: "req_demo",
            session: {
              expiresAt: "2026-03-14T00:00:00.000Z",
              tenantId: "tenant_demo",
              token: "token_demo",
              userId: "user_demo"
            }
          },
          schema: loginResponse
        }
      },
      description: "Creates a development session payload with correlation metadata."
    }
  },
  summary: "Authenticate user",
  tags: ["Auth"]
});

registry.registerPath({
  method: "post",
  path: "/api/v1/organizations",
  request: {
    body: {
      content: {
        "application/json": {
          example: {
            adminEmail: "owner@birthub.local",
            adminName: "BirthHub Owner",
            name: "BirthHub Demo",
            slug: "birthhub-demo"
          },
          schema: createOrganizationRequest
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        "application/json": {
          example: {
            organizationId: "org_demo",
            ownerUserId: "user_demo",
            requestId: "req_demo",
            role: "OWNER",
            slug: "birthhub-demo",
            tenantId: "tenant_demo"
          },
          schema: createOrganizationResponse
        }
      },
      description: "Creates the initial tenant and owner membership."
    }
  },
  summary: "Provision organization",
  tags: ["Organizations"]
});

registry.registerPath({
  method: "post",
  path: "/api/v1/tasks",
  request: {
    body: {
      content: {
        "application/json": {
          example: {
            payload: {
              channel: "email"
            },
            type: "send-welcome-email"
          },
          schema: taskRequest
        }
      }
    }
  },
  responses: {
    202: {
      content: {
        "application/json": {
          example: {
            jobId: "42",
            requestId: "req_demo"
          },
          schema: taskResponse
        }
      },
      description: "Queues work for the worker with propagated request correlation."
    }
  },
  summary: "Enqueue task",
  tags: ["Workers"]
});

type GeneratedOpenApiDocument = ReturnType<OpenApiGeneratorV3["generateDocument"]>;

// ADR-030: the API exposes a generated contract in development so clients can integrate against the same schemas.
export const openApiDocument: GeneratedOpenApiDocument = new OpenApiGeneratorV3(
  registry.definitions
).generateDocument({
  info: {
    title: "BirthHub360 Cycle 1 API",
    version: "1.0.0"
  },
  openapi: "3.0.0",
  servers: [
    {
      url: "http://localhost:3000"
    }
  ]
});
