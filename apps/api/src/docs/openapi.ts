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

const loginRequest = loginRequestSchema.openapi("LoginRequest", {
  example: {
    email: "owner@birthub.local",
    password: "Password123!",
    tenantId: "tenant_demo"
  }
});

const loginResponse = loginResponseSchema.openapi("LoginResponse", {
  example: {
    requestId: "req_demo",
    session: {
      expiresAt: "2026-03-14T00:00:00.000Z",
      tenantId: "tenant_demo",
      token: "token_demo",
      userId: "user_demo"
    }
  }
});

const createOrganizationRequest = createOrganizationRequestSchema.openapi("CreateOrganizationRequest", {
  example: {
    adminEmail: "owner@birthub.local",
    adminName: "BirthHub Owner",
    name: "BirthHub Demo",
    slug: "birthhub-demo"
  }
});

const createOrganizationResponse = createOrganizationResponseSchema.openapi("CreateOrganizationResponse", {
  example: {
    organizationId: "org_demo",
    ownerUserId: "user_demo",
    requestId: "req_demo",
    role: "OWNER",
    slug: "birthhub-demo",
    tenantId: "tenant_demo"
  }
});

const taskRequest = taskRequestSchema.openapi("CreateTaskRequest", {
  example: {
    payload: {
      channel: "email"
    },
    type: "send-welcome-email"
  }
});

const taskResponse = taskEnqueuedResponseSchema.openapi("CreateTaskResponse", {
  example: {
    jobId: "42",
    requestId: "req_demo"
  }
});

const healthResponse = healthResponseSchema.openapi("HealthResponse", {
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
  }
});

registry.registerPath({
  method: "get",
  path: "/api/v1/health",
  responses: {
    200: {
      content: {
        "application/json": {
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
          schema: loginRequest
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        "application/json": {
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
          schema: createOrganizationRequest
        }
      }
    }
  },
  responses: {
    201: {
      content: {
        "application/json": {
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
          schema: taskRequest
        }
      }
    }
  },
  responses: {
    202: {
      content: {
        "application/json": {
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
