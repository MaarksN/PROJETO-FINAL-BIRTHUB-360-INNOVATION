import type { ApiConfig } from "@birthub/config";
import { createLogger } from "@birthub/logger";
import type { Express } from "express";

import { enqueueTask } from "../lib/queue.js";
import {
  registerOrganizationCreationRoutes as defaultRegisterOrganizationCreationRoutes
} from "../modules/organizations/router.js";
import { mountProfileRoutes as defaultMountProfileRoutes } from "../modules/profile/router.js";
import { mountTasksRoutes as defaultMountTasksRoutes } from "../modules/tasks/router.js";

const logger = createLogger("api");
type EnqueueTaskDependency = typeof enqueueTask;

export function registerCoreBusinessRoutes(
  app: Express,
  config: ApiConfig,
  dependencies: {
    enqueueTask?: EnqueueTaskDependency;
    mountProfileRoutes?: typeof defaultMountProfileRoutes;
    registerOrganizationCreationRoutes?: typeof defaultRegisterOrganizationCreationRoutes;
    mountTasksRoutes?: typeof defaultMountTasksRoutes;
  } = {}
): void {
  const enqueueTaskDependency = dependencies.enqueueTask ?? enqueueTask;
  const mountProfileRoutes = dependencies.mountProfileRoutes ?? defaultMountProfileRoutes;
  const mountTasksRoutes = dependencies.mountTasksRoutes ?? defaultMountTasksRoutes;
  const registerOrganizationCreationRoutes =
    dependencies.registerOrganizationCreationRoutes ?? defaultRegisterOrganizationCreationRoutes;

  registerOrganizationCreationRoutes(app, {
    logger,
    onCreated: (request, organization) => {
      request.context.organizationId = organization.organizationId;
      request.context.tenantId = organization.tenantId ?? null;
      request.context.userId = organization.ownerUserId;
    },
    paths: ["/api/v1/organizations"]
  });

  mountProfileRoutes(app, config);
  mountTasksRoutes(app, config, {
    enqueueTask: enqueueTaskDependency
  });
}
