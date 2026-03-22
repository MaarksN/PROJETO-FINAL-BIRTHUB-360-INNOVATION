import type { ApiConfig } from "@birthub/config";
import { getApiConfig } from "@birthub/config";
import express from "express";
import type { Express } from "express";

import { createHealthService } from "./lib/health.js";
import { errorHandler, notFoundMiddleware } from "./middleware/error-handler.js";
import { enqueueTask } from "./lib/queue.js";
import { configureAppInfrastructure, registerOperationalRoutes } from "./app/core.js";
import { registerAuthAndCoreRoutes } from "./app/auth-and-core-routes.js";
import { mountModuleRouters } from "./app/module-routes.js";

export interface AppDependencies {
  config?: ApiConfig;
  enqueueTask?: typeof enqueueTask;
  healthService?: ReturnType<typeof createHealthService>;
  shouldExposeDocs?: boolean;
}

export function createApp(dependencies: AppDependencies = {}): Express {
  const config = dependencies.config ?? getApiConfig();
  const shouldExposeDocs = dependencies.shouldExposeDocs ?? config.NODE_ENV !== "production";
  const app = express();

  configureAppInfrastructure(app, config);
  registerOperationalRoutes(app, config, {
    ...(dependencies.healthService ? { healthService: dependencies.healthService } : {}),
    shouldExposeDocs
  });
  registerAuthAndCoreRoutes(app, config, {
    ...(dependencies.enqueueTask ? { enqueueTask: dependencies.enqueueTask } : {})
  });
  mountModuleRouters(app, config);

  app.use(notFoundMiddleware);
  app.use(errorHandler);

  return app;
}
