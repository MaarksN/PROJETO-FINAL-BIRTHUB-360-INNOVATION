import type { ApiConfig } from "@birthub/config";
import { healthResponseSchema } from "@birthub/config";
import { pingDatabase, pingDatabaseDeep } from "@birthub/database";

import { pingRedis } from "./queue.js";

async function pingExternalDependency(url: string): Promise<{ name: string; status: "up" | "down" }> {
  const name = new URL(url).hostname;

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(1500)
    });

    return {
      name,
      status: response.ok ? "up" : "down"
    };
  } catch {
    return {
      name,
      status: "down"
    };
  }
}

export function createHealthService(config: ApiConfig) {
  return async () => {
    const [database, redis, externalDependencies] = await Promise.all([
      pingDatabase(),
      pingRedis(config),
      Promise.all(config.externalHealthcheckUrls.map((url) => pingExternalDependency(url)))
    ]);

    return healthResponseSchema.parse({
      checkedAt: new Date().toISOString(),
      services: {
        database,
        externalDependencies,
        redis
      },
      status:
        database.status === "up" &&
        redis.status === "up" &&
        externalDependencies.every((dependency) => dependency.status === "up")
          ? "ok"
          : "degraded"
    });
  };
}

export function createDeepHealthService(config: ApiConfig) {
  return async () => {
    const [database, redis, externalDependencies] = await Promise.all([
      pingDatabaseDeep(),
      pingRedis(config),
      Promise.all(config.externalHealthcheckUrls.map((url) => pingExternalDependency(url)))
    ]);

    return healthResponseSchema.parse({
      checkedAt: new Date().toISOString(),
      services: {
        database,
        externalDependencies,
        redis
      },
      status:
        database.status === "up" &&
        redis.status === "up" &&
        externalDependencies.every((dependency) => dependency.status === "up")
          ? "ok"
          : "degraded"
    });
  };
}

export function createReadinessService(config: ApiConfig) {
  return async () => {
    // Only check internal core dependencies like redis and database to know if ready to accept traffic
    const [database, redis] = await Promise.all([
      pingDatabase(),
      pingRedis(config)
    ]);

    return {
      checkedAt: new Date().toISOString(),
      services: {
        database,
        externalDependencies: [],
        redis
      },
      status:
        database.status === "up" && redis.status === "up"
          ? "ok"
          : "degraded"
    };
  };
}
