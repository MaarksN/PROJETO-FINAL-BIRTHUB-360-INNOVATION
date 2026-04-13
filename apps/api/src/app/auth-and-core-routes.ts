import type { ApiConfig } from "@birthub/config";
import type { Express } from "express";

import { registerAuthRoutes as defaultRegisterAuthRoutes } from "./auth-routes.js";
import { registerCoreBusinessRoutes as defaultRegisterCoreBusinessRoutes } from "./core-business-routes.js";
import { enqueueTask } from "../lib/queue.js";

export function registerAuthAndCoreRoutes(
  app: Express,
  config: ApiConfig,
  dependencies: {
    enqueueTask?: typeof enqueueTask;
    registerAuthRoutes?: typeof defaultRegisterAuthRoutes;
    registerCoreBusinessRoutes?: typeof defaultRegisterCoreBusinessRoutes;
  } = {}
): void {
  const registerAuthRoutes = dependencies.registerAuthRoutes ?? defaultRegisterAuthRoutes;
  const registerCoreBusinessRoutes =
    dependencies.registerCoreBusinessRoutes ?? defaultRegisterCoreBusinessRoutes;
  const coreDependencies =
    dependencies.enqueueTask === undefined
      ? {}
      : {
          enqueueTask: dependencies.enqueueTask
        };

  registerAuthRoutes(app, config);
  registerCoreBusinessRoutes(app, config, coreDependencies);
}
