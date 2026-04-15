import {
  authIntrospectionResponseSchema,
  loginRequestSchema,
  loginResponseSchema,
  logoutResponseSchema,
  mfaVerifyRequestSchema,
  refreshRequestSchema,
  refreshResponseSchema,
  roleSchema,
  sessionListResponseSchema,
  taskEnqueuedResponseSchema,
  taskRequestSchema
} from "@birthub/config";
import { z } from "zod";

type JsonSchema = Record<string, unknown>;

const problemDetailsSchema = z.object({
  detail: z.string(),
  errors: z.unknown().optional(),
  instance: z.string(),
  status: z.number().int(),
  title: z.string(),
  type: z.string()
});

const enableMfaRequestSchema = z.object({
  totpCode: z.string().regex(/^\d{6}$/)
});

const enableMfaResponseSchema = z.object({
  enabled: z.literal(true),
  requestId: z.string()
});

const mfaSetupResponseSchema = z.object({
  otpauthUrl: z.string(),
  qrCodeDataUrl: z.string(),
  recoveryCodes: z.array(z.string())
});

const profileResponseSchema = z.object({
  plan: z.object({
    code: z.string(),
    creditBalanceCents: z.number().int().nonnegative(),
    currentPeriodEnd: z.string().datetime(),
    hardLocked: z.boolean(),
    isPaid: z.boolean(),
    isWithinGracePeriod: z.boolean(),
    name: z.string(),
    secondsUntilHardLock: z.number().int().nullable(),
    status: z.string()
  }),
  plan_status: z.object({
    code: z.string(),
    hardLocked: z.boolean(),
    isWithinGracePeriod: z.boolean(),
    status: z.string()
  }),
  requestId: z.string(),
  user: z.object({
    id: z.string(),
    organizationId: z.string(),
    role: roleSchema,
    tenantId: z.string()
  })
});

function normalizeJsonSchema(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeJsonSchema(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key]) => key !== "$schema")
        .map(([key, nestedValue]) => [key, normalizeJsonSchema(nestedValue)])
    );
  }

  return value;
}

function toOpenApiSchema(schema: z.ZodTypeAny): JsonSchema {
  return normalizeJsonSchema(z.toJSONSchema(schema)) as JsonSchema;
}

function schemaRef(name: string): JsonSchema {
  return {
    $ref: `#/components/schemas/${name}`
  };
}

function jsonRequestBody(schemaName: string, description: string, required = true): JsonSchema {
  return {
    content: {
      "application/json": {
        schema: schemaRef(schemaName)
      }
    },
    description,
    required
  };
}

function jsonResponse(description: string, schemaName: string): JsonSchema {
  return {
    content: {
      "application/json": {
        schema: schemaRef(schemaName)
      }
    },
    description
  };
}

function problemResponse(description: string): JsonSchema {
  return {
    content: {
      "application/json": {
        schema: schemaRef("ProblemDetails")
      }
    },
    description
  };
}

const componentSchemas = {
  AuthIntrospectionResponse: toOpenApiSchema(authIntrospectionResponseSchema),
  EnableMfaRequest: toOpenApiSchema(enableMfaRequestSchema),
  EnableMfaResponse: toOpenApiSchema(enableMfaResponseSchema),
  LoginRequest: toOpenApiSchema(loginRequestSchema),
  LoginResponse: toOpenApiSchema(loginResponseSchema),
  LogoutResponse: toOpenApiSchema(logoutResponseSchema),
  MfaSetupResponse: toOpenApiSchema(mfaSetupResponseSchema),
  MfaVerifyRequest: toOpenApiSchema(mfaVerifyRequestSchema),
  ProblemDetails: toOpenApiSchema(problemDetailsSchema),
  ProfileResponse: toOpenApiSchema(profileResponseSchema),
  RefreshRequest: toOpenApiSchema(refreshRequestSchema),
  RefreshResponse: toOpenApiSchema(refreshResponseSchema),
  SessionListResponse: toOpenApiSchema(sessionListResponseSchema),
  TaskEnqueuedResponse: toOpenApiSchema(taskEnqueuedResponseSchema),
  TaskRequest: toOpenApiSchema(taskRequestSchema)
} satisfies Record<string, JsonSchema>;

export const openApiDocument = {
  components: {
    schemas: componentSchemas
  },
  info: {
    description:
      "Mounted business API baseline for the canonical BirthHub360 runtime. Operational, parked and compatibility-only surfaces are intentionally excluded.",
    title: "BirthHub360 API",
    version: "1.1.0"
  },
  jsonSchemaDialect: "https://json-schema.org/draft/2020-12/schema",
  openapi: "3.1.0",
  paths: {
    "/api/v1/agents/search": {
      get: {
        responses: {
          "200": {
            description: "Agent marketplace search results"
          }
        },
        summary: "Search agent manifests",
        tags: ["agents"]
      }
    },
    "/api/v1/auth/introspect": {
      get: {
        operationId: "introspectApiKey",
        responses: {
          "200": jsonResponse(
            "Introspects the provided API key or bearer token. Returns inactive when no credential is present.",
            "AuthIntrospectionResponse"
          ),
          "500": problemResponse("Unexpected internal server error.")
        },
        summary: "Inspect API key activity",
        tags: ["auth"]
      }
    },
    "/api/v1/auth/login": {
      post: {
        operationId: "loginWithPassword",
        requestBody: jsonRequestBody("LoginRequest", "Credentials required to create a session."),
        responses: {
          "200": jsonResponse(
            "Authenticated session payload or MFA challenge envelope.",
            "LoginResponse"
          ),
          "400": problemResponse("Request payload is invalid."),
          "401": problemResponse("Credentials or tenant reference are invalid."),
          "429": problemResponse("Login rate limit exceeded."),
          "500": problemResponse("Unexpected internal server error.")
        },
        summary: "Authenticate with email and password",
        tags: ["auth"]
      }
    },
    "/api/v1/auth/logout": {
      post: {
        operationId: "logoutCurrentSession",
        responses: {
          "200": jsonResponse("Revokes the current authenticated session.", "LogoutResponse"),
          "401": problemResponse("A valid authenticated session is required."),
          "500": problemResponse("Unexpected internal server error.")
        },
        summary: "Logout the current session",
        tags: ["auth"]
      }
    },
    "/api/v1/auth/mfa/challenge": {
      post: {
        operationId: "verifyMfaChallenge",
        requestBody: jsonRequestBody(
          "MfaVerifyRequest",
          "Challenge token plus either a TOTP code or a recovery code."
        ),
        responses: {
          "200": jsonResponse("Authenticated session payload after MFA verification.", "LoginResponse"),
          "400": problemResponse("Request payload is invalid."),
          "401": problemResponse("MFA challenge is invalid or expired."),
          "500": problemResponse("Unexpected internal server error.")
        },
        summary: "Complete MFA challenge",
        tags: ["auth"]
      }
    },
    "/api/v1/auth/mfa/enable": {
      post: {
        operationId: "enableMfa",
        requestBody: jsonRequestBody("EnableMfaRequest", "TOTP code used to enable MFA."),
        responses: {
          "200": jsonResponse("Confirms MFA was enabled for the authenticated user.", "EnableMfaResponse"),
          "400": problemResponse("The provided TOTP code is invalid."),
          "401": problemResponse("A valid authenticated session is required."),
          "500": problemResponse("Unexpected internal server error.")
        },
        summary: "Enable MFA for the authenticated user",
        tags: ["auth"]
      }
    },
    "/api/v1/auth/mfa/setup": {
      post: {
        operationId: "setupMfa",
        responses: {
          "200": jsonResponse("Returns the MFA enrollment payload for the authenticated user.", "MfaSetupResponse"),
          "401": problemResponse("A valid authenticated session is required."),
          "404": problemResponse("User not found for MFA setup."),
          "500": problemResponse("Unexpected internal server error.")
        },
        summary: "Create MFA enrollment data",
        tags: ["auth"]
      }
    },
    "/api/v1/auth/refresh": {
      post: {
        operationId: "refreshSession",
        requestBody: jsonRequestBody("RefreshRequest", "Refresh token used to renew the session."),
        responses: {
          "200": jsonResponse("Returns a renewed session payload.", "RefreshResponse"),
          "400": problemResponse("Request payload is invalid."),
          "401": problemResponse("Refresh token is invalid or expired."),
          "409": problemResponse("Refresh token reuse was detected."),
          "500": problemResponse("Unexpected internal server error.")
        },
        summary: "Refresh an authenticated session",
        tags: ["auth"]
      }
    },
    "/api/v1/budgets/usage": {
      get: {
        responses: {
          "200": {
            description: "Budget usage snapshot"
          }
        },
        summary: "Get budget usage",
        tags: ["budgets"]
      }
    },
    "/api/v1/me": {
      get: {
        operationId: "getCurrentProfile",
        responses: {
          "200": jsonResponse(
            "Returns the authenticated profile and its billing snapshot.",
            "ProfileResponse"
          ),
          "401": problemResponse("A valid tenant-scoped authenticated session is required."),
          "500": problemResponse("Unexpected internal server error.")
        },
        summary: "Get the authenticated profile",
        tags: ["profile"]
      }
    },
    "/api/v1/outputs": {
      get: {
        responses: {
          "200": {
            description: "List outputs"
          }
        },
        summary: "List outputs",
        tags: ["outputs"]
      }
    },
    "/api/v1/sessions": {
      get: {
        operationId: "listSessions",
        responses: {
          "200": jsonResponse("Lists active sessions for the authenticated user.", "SessionListResponse"),
          "401": problemResponse("A valid authenticated session is required."),
          "500": problemResponse("Unexpected internal server error.")
        },
        summary: "List active sessions",
        tags: ["sessions"]
      }
    },
    "/api/v1/sessions/{sessionId}": {
      delete: {
        operationId: "revokeSessionById",
        parameters: [
          {
            in: "path",
            name: "sessionId",
            required: true,
            schema: {
              minLength: 1,
              type: "string"
            }
          }
        ],
        responses: {
          "200": jsonResponse("Revokes a specific session for the authenticated user.", "LogoutResponse"),
          "400": problemResponse("A valid session id is required."),
          "401": problemResponse("A valid authenticated session is required."),
          "500": problemResponse("Unexpected internal server error.")
        },
        summary: "Revoke a specific session",
        tags: ["sessions"]
      }
    },
    "/api/v1/sessions/logout-all": {
      post: {
        operationId: "logoutAllSessions",
        responses: {
          "200": jsonResponse("Revokes all sessions for the authenticated user.", "LogoutResponse"),
          "401": problemResponse("A valid authenticated session is required."),
          "500": problemResponse("Unexpected internal server error.")
        },
        summary: "Logout every active session",
        tags: ["sessions"]
      }
    },
    "/api/v1/tasks": {
      post: {
        operationId: "enqueueTask",
        requestBody: jsonRequestBody("TaskRequest", "Task submission payload for asynchronous processing."),
        responses: {
          "202": jsonResponse("Task accepted and queued for worker processing.", "TaskEnqueuedResponse"),
          "400": problemResponse("Request payload is invalid."),
          "401": problemResponse("A valid authenticated session is required."),
          "402": problemResponse("The task was rejected because budget usage is exhausted."),
          "429": problemResponse("The tenant exceeded the queue rate limit."),
          "503": problemResponse("Queue backpressure prevents accepting new work."),
          "500": problemResponse("Unexpected internal server error.")
        },
        summary: "Submit an operational task",
        tags: ["tasks"]
      }
    }
  },
  servers: [
    {
      url: "http://localhost:3000"
    }
  ]
} as const;
