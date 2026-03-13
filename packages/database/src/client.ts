import { Prisma, PrismaClient } from "@prisma/client";

import { PrismaQueryTimeoutError } from "./errors/prisma-query-timeout.error.js";
import { requireTenantId } from "./tenant-context.js";

const QUERY_TIMEOUT_MS = 5_000;

const globalForPrisma = globalThis as typeof globalThis & {
  birthubPrisma?: PrismaClient;
};

function raceWithTimeout<T>(
  promise: Promise<T>,
  operation: string,
  model?: string | undefined
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      const timer = setTimeout(() => {
        reject(new PrismaQueryTimeoutError(operation, QUERY_TIMEOUT_MS, model));
      }, QUERY_TIMEOUT_MS);

      promise.finally(() => {
        clearTimeout(timer);
      });
    })
  ]);
}

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
  });

  client.$use(async (params, next) => {
    return raceWithTimeout(next(params), params.action, params.model);
  }) as PrismaClient;

  return client;
}

export const prisma = globalForPrisma.birthubPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.birthubPrisma = prisma;
}

// @see ADR-008
export async function withTenantDatabaseContext<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>,
  client: PrismaClient = prisma
): Promise<T> {
  const tenantId = requireTenantId("database transaction");

  return client.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`;
    return callback(tx);
  });
}

export async function pingDatabase(): Promise<{ status: "up" | "down"; message?: string }> {
  try {
    await raceWithTimeout(prisma.$queryRaw`SELECT 1`, "$queryRaw");
    return { status: "up" };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "Unknown database error",
      status: "down"
    };
  }
}
