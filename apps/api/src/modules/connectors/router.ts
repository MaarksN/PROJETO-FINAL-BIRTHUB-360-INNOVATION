import type { ApiConfig } from "@birthub/config";
import { Role } from "@birthub/database";
import { Router } from "express";
import { z } from "zod";

import {
  RequireRole,
  requireAuthenticatedSession
} from "../../common/guards/index.js";
import { asyncHandler, ProblemDetailsError } from "../../lib/problem-details.js";
import {
  connectorsService,
  parseConnectorOauthState,
  type ConnectorProvider
} from "./service.js";

const providerSchema = z.enum([
  "hubspot",
  "google-workspace",
  "microsoft-graph",
  "salesforce",
  "pipedrive",
  "twilio-whatsapp"
]);

const credentialSchema = z
  .object({
    expiresAt: z.string().datetime().optional(),
    value: z.string().min(1)
  })
  .strict();

const upsertConnectorSchema = z
  .object({
    accountKey: z.string().min(1).optional(),
    authType: z.string().min(1).optional(),
    credentials: z.record(z.string(), credentialSchema).optional(),
    displayName: z.string().min(1).optional(),
    externalAccountId: z.string().min(1).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
    provider: providerSchema,
    scopes: z.array(z.string().min(1)).optional(),
    status: z.string().min(1).optional()
  })
  .strict();

const connectSchema = z
  .object({
    accountKey: z.string().min(1).optional(),
    scopes: z.array(z.string().min(1)).optional()
  })
  .strict();

const callbackSchema = z
  .object({
    accessToken: z.string().min(1).optional(),
    accountKey: z.string().min(1).optional(),
    code: z.string().min(1).optional(),
    displayName: z.string().min(1).optional(),
    expiresAt: z.string().datetime().optional(),
    externalAccountId: z.string().min(1).optional(),
    refreshToken: z.string().min(1).optional(),
    scopes: z.array(z.string().min(1)).optional(),
    state: z.string().min(1)
  })
  .strict();

const syncSchema = z
  .object({
    accountKey: z.string().min(1).optional(),
    cursor: z.record(z.string(), z.unknown()).optional(),
    scope: z.string().min(1).optional()
  })
  .strict();

type AuthenticatedConnectorRequest = {
  context: {
    organizationId?: string | null;
    requestId: string;
    tenantId?: string | null;
    userId?: string | null;
  };
};

type ConnectorRequestContext = {
  organizationId: string;
  requestId: string;
  tenantId: string;
  userId: string;
};

function requireOrganizationContext(input: {
  organizationId?: string | null;
  tenantId?: string | null;
  userId?: string | null;
}) {
  if (!input.organizationId || !input.tenantId || !input.userId) {
    throw new ProblemDetailsError({
      detail: "Authenticated organization context is required for connector operations.",
      status: 401,
      title: "Unauthorized"
    });
  }

  return {
    organizationId: input.organizationId,
    tenantId: input.tenantId,
    userId: input.userId
  };
}

function readProvider(value: unknown): ConnectorProvider {
  return providerSchema.parse(value);
}

function requireConnectorRequestContext(
  request: AuthenticatedConnectorRequest
): ConnectorRequestContext {
  return {
    ...requireOrganizationContext({
      organizationId: request.context.organizationId,
      tenantId: request.context.tenantId,
      userId: request.context.userId
    }),
    requestId: request.context.requestId
  };
}

function readOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function readOptionalScopes(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const scopes = value
      .flatMap((item) => (typeof item === "string" ? item.split(/[,\s]+/) : []))
      .map((item) => item.trim())
      .filter(Boolean);

    return scopes.length > 0 ? scopes : undefined;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  const scopes = value
    .split(/[,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return scopes.length > 0 ? scopes : undefined;
}

function buildCallbackPayload(input: Record<string, unknown>) {
  return callbackSchema.parse({
    accessToken: readOptionalString(input.accessToken ?? input.access_token),
    accountKey: readOptionalString(input.accountKey ?? input.account_key),
    code: readOptionalString(input.code),
    displayName: readOptionalString(input.displayName ?? input.display_name),
    expiresAt: readOptionalString(input.expiresAt ?? input.expires_at),
    externalAccountId: readOptionalString(input.externalAccountId ?? input.external_account_id),
    refreshToken: readOptionalString(input.refreshToken ?? input.refresh_token),
    scopes: readOptionalScopes(input.scopes ?? input.scope),
    state: readOptionalString(input.state)
  });
}

function resolveCallbackContext(input: {
  organizationId?: string | null;
  provider: ConnectorProvider;
  state: string;
  tenantId?: string | null;
}) {
  if (input.organizationId && input.tenantId) {
    return {
      accountKey: undefined,
      organizationId: input.organizationId,
      tenantId: input.tenantId
    };
  }

  const parsedState = parseConnectorOauthState(input.state);
  if (parsedState.provider !== input.provider) {
    throw new ProblemDetailsError({
      detail: `Connector OAuth state was issued for provider '${parsedState.provider}', not '${input.provider}'.`,
      status: 409,
      title: "Connector State Mismatch"
    });
  }

  return {
    accountKey: parsedState.accountKey,
    organizationId: parsedState.organizationId,
    tenantId: parsedState.tenantId
  };
}

function buildUpsertConnectorInput(
  payload: z.infer<typeof upsertConnectorSchema>,
  context: ConnectorRequestContext
) {
  return {
    ...(payload.accountKey ? { accountKey: payload.accountKey } : {}),
    ...(payload.authType ? { authType: payload.authType } : {}),
    ...(payload.credentials ? { credentials: payload.credentials } : {}),
    ...(payload.displayName ? { displayName: payload.displayName } : {}),
    ...(payload.externalAccountId ? { externalAccountId: payload.externalAccountId } : {}),
    ...(payload.metadata ? { metadata: payload.metadata } : {}),
    organizationId: context.organizationId,
    provider: payload.provider,
    ...(payload.scopes ? { scopes: payload.scopes } : {}),
    ...(payload.status ? { status: payload.status } : {}),
    tenantId: context.tenantId
  };
}

function buildConnectSessionInput(input: {
  config: ApiConfig;
  context: ConnectorRequestContext;
  payload: z.infer<typeof connectSchema>;
  provider: ConnectorProvider;
}) {
  return {
    ...(input.payload.accountKey ? { accountKey: input.payload.accountKey } : {}),
    config: input.config,
    organizationId: input.context.organizationId,
    provider: input.provider,
    requestId: input.context.requestId,
    ...(input.payload.scopes ? { scopes: input.payload.scopes } : {}),
    tenantId: input.context.tenantId,
    userId: input.context.userId
  };
}

function buildFinalizeConnectSessionInput(input: {
  callbackContext: ReturnType<typeof resolveCallbackContext>;
  payload: z.infer<typeof callbackSchema>;
  provider: ConnectorProvider;
}) {
  return {
    ...(input.payload.accessToken ? { accessToken: input.payload.accessToken } : {}),
    ...(input.payload.accountKey || input.callbackContext.accountKey
      ? { accountKey: input.payload.accountKey ?? input.callbackContext.accountKey }
      : {}),
    ...(input.payload.code ? { code: input.payload.code } : {}),
    ...(input.payload.displayName ? { displayName: input.payload.displayName } : {}),
    ...(input.payload.expiresAt ? { expiresAt: input.payload.expiresAt } : {}),
    ...(input.payload.externalAccountId ? { externalAccountId: input.payload.externalAccountId } : {}),
    organizationId: input.callbackContext.organizationId,
    provider: input.provider,
    ...(input.payload.refreshToken ? { refreshToken: input.payload.refreshToken } : {}),
    ...(input.payload.scopes ? { scopes: input.payload.scopes } : {}),
    state: input.payload.state,
    tenantId: input.callbackContext.tenantId
  };
}

function buildTriggerSyncInput(input: {
  config: ApiConfig;
  context: ConnectorRequestContext;
  payload: z.infer<typeof syncSchema>;
  provider: ConnectorProvider;
}) {
  return {
    ...(input.payload.accountKey ? { accountKey: input.payload.accountKey } : {}),
    config: input.config,
    ...(input.payload.cursor ? { cursor: input.payload.cursor } : {}),
    organizationId: input.context.organizationId,
    provider: input.provider,
    ...(input.payload.scope ? { scope: input.payload.scope } : {}),
    tenantId: input.context.tenantId
  };
}

async function handleConnectorCallbackResponse(input: {
  provider: ConnectorProvider;
  request: {
    context: {
      organizationId?: string | null;
      requestId: string;
      tenantId?: string | null;
    };
  };
  response: {
    json(body: unknown): void;
    status(code: number): { json(body: unknown): void };
  };
  payload: z.infer<typeof callbackSchema>;
}) {
  const callbackContext = resolveCallbackContext({
    organizationId: input.request.context.organizationId,
    provider: input.provider,
    state: input.payload.state,
    tenantId: input.request.context.tenantId
  });
  const connector = await connectorsService.finalizeConnectSession(
    buildFinalizeConnectSessionInput({
      callbackContext,
      payload: input.payload,
      provider: input.provider
    })
  );

  input.response.status(200).json({
    connector,
    requestId: input.request.context.requestId
  });
}

function registerListRoute(router: Router): void {
  router.get(
    "/",
    requireAuthenticatedSession,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      const context = requireConnectorRequestContext(request);
      const items = await connectorsService.listConnectors({
        organizationId: context.organizationId
      });

      response.status(200).json({
        items,
        requestId: context.requestId
      });
    })
  );
}

function registerUpsertRoute(router: Router): void {
  router.post(
    "/",
    requireAuthenticatedSession,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      const payload = upsertConnectorSchema.parse(request.body ?? {});
      const context = requireConnectorRequestContext(request);
      const connector = await connectorsService.upsertConnector(
        buildUpsertConnectorInput(payload, context)
      );

      response.status(201).json({
        connector,
        requestId: context.requestId
      });
    })
  );
}

function registerConnectRoute(router: Router, config: ApiConfig): void {
  router.post(
    "/:provider/connect",
    requireAuthenticatedSession,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      const payload = connectSchema.parse(request.body ?? {});
      const provider = readProvider(request.params.provider);
      const context = requireConnectorRequestContext(request);
      const session = await connectorsService.createConnectSession(
        buildConnectSessionInput({
          config,
          context,
          payload,
          provider
        })
      );

      response.status(200).json({
        authorizationUrl: session.authorizationUrl,
        connector: session.connector,
        requestId: context.requestId,
        state: session.state
      });
    })
  );
}

function registerPostCallbackRoute(router: Router): void {
  router.post(
    "/:provider/callback",
    requireAuthenticatedSession,
    asyncHandler(async (request, response) => {
      const payload = callbackSchema.parse(request.body ?? {});
      const provider = readProvider(request.params.provider);

      await handleConnectorCallbackResponse({
        payload,
        provider,
        request,
        response
      });
    })
  );
}

function registerGetCallbackRoute(router: Router): void {
  router.get(
    "/:provider/callback",
    requireAuthenticatedSession,
    asyncHandler(async (request, response) => {
      const payload = buildCallbackPayload(request.query as Record<string, unknown>);
      const provider = readProvider(request.params.provider);

      await handleConnectorCallbackResponse({
        payload,
        provider,
        request,
        response
      });
    })
  );
}

function registerSyncRoute(router: Router, config: ApiConfig): void {
  router.post(
    "/:provider/sync",
    requireAuthenticatedSession,
    RequireRole(Role.ADMIN),
    asyncHandler(async (request, response) => {
      const payload = syncSchema.parse(request.body ?? {});
      const provider = readProvider(request.params.provider);
      const context = requireConnectorRequestContext(request);
      const sync = await connectorsService.triggerSync(
        buildTriggerSyncInput({
          config,
          context,
          payload,
          provider
        })
      );

      response.status(202).json({
        requestId: context.requestId,
        sync
      });
    })
  );
}

export function createConnectorsRouter(config: ApiConfig): Router {
  const router = Router();
  registerListRoute(router);
  registerUpsertRoute(router);
  registerConnectRoute(router, config);
  router.use("/:provider/callback", requireAuthenticatedSession);
  registerPostCallbackRoute(router);
  registerGetCallbackRoute(router);
  registerSyncRoute(router, config);

  return router;
}
