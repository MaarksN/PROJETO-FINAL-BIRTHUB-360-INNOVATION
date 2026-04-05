import type { ApiConfig } from "@birthub/config";
import { getApiConfig } from "@birthub/config";
import express from "express";
import type { Express } from "express";

import {
  createDeepHealthService,
  createHealthService,
  createReadinessHealthService
} from "./lib/health.js";
import { enqueueTask } from "./lib/queue.js";
import {
  configureAppInfrastructure,
  registerGlobalErrorHandling,
  registerOperationalRoutes
} from "./app/core.js";
import { registerAuthAndCoreRoutes } from "./app/auth-and-core-routes.js";
import { mountModuleRouters } from "./app/module-routes.js";

export interface AppDependencies {
  config?: ApiConfig;
  deepHealthService?: ReturnType<typeof createDeepHealthService>;
  enqueueTask?: typeof enqueueTask;
  healthService?: ReturnType<typeof createHealthService>;
  readinessService?: ReturnType<typeof createReadinessHealthService>;
  shouldExposeDocs?: boolean;
}

export function createApp(dependencies: AppDependencies = {}): Express {
  const config = dependencies.config ?? getApiConfig();
  const shouldExposeDocs = dependencies.shouldExposeDocs ?? config.NODE_ENV !== "production";
  const app = express();

<<<<<<< HEAD
  configureAppInfrastructure(app, config);
  registerOperationalRoutes(app, config, {
    ...(dependencies.deepHealthService ? { deepHealthService: dependencies.deepHealthService } : {}),
    ...(dependencies.healthService ? { healthService: dependencies.healthService } : {}),
    ...(dependencies.readinessService ? { readinessService: dependencies.readinessService } : {}),
    shouldExposeDocs
=======
  configureCacheStore(config.REDIS_URL, config.NODE_ENV);
  if (config.NODE_ENV !== "test") {
    registerTenantCacheInvalidationMiddleware();
  }
  initializeWorkflowInternalEventBridge(config);

  app.disable("x-powered-by");
  app.use(requestContextMiddleware);
  app.use(authenticationMiddleware(config.API_AUTH_COOKIE_NAME, config));
  app.use(tenantContextMiddleware);
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );
  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => {
        if (!origin || config.corsOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(
          new ProblemDetailsError({
            detail: `Origin '${origin}' is not present in the API allowlist.`,
            status: 403,
            title: "Forbidden"
          })
        );
      }
    })
  );
  if (stripeWebhookEnabled) {
    app.use(
      "/api/webhooks",
      createWebhookRateLimitMiddleware(config),
      createStripeWebhookRouter(config)
    );
  }
  app.use(contentTypeMiddleware);
  app.use((request, response, next) => {
    request.setTimeout(config.API_HANDLER_TIMEOUT_MS);
    response.setTimeout(config.API_HANDLER_TIMEOUT_MS, () => {
      if (response.headersSent) {
        return;
      }

      next(
        new ProblemDetailsError({
          detail: `Request exceeded ${config.API_HANDLER_TIMEOUT_MS}ms timeout budget.`,
          status: 408,
          title: "Request Timeout"
        })
      );
    });
    next();
>>>>>>> origin/jules-f8-database-integrity-16939282469267761297
  });
  registerAuthAndCoreRoutes(app, config, {
    ...(dependencies.enqueueTask ? { enqueueTask: dependencies.enqueueTask } : {})
  });
  mountModuleRouters(app, config);

  registerGlobalErrorHandling(app);

  return app;
}
