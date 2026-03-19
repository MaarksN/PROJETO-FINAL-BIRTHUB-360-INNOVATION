import { cleanupSuspendedUsers } from "../src/jobs/userCleanup.js";
import type { PrismaClient } from "@birthub/database";

async function run() {
  const suspendedUsers = Array.from({ length: 1000 }).map((_, i) => ({
    id: `user_${i}`,
    status: "SUSPENDED"
  }));

  let calls = 0;
  let totalTime = 0;

  const prismaClient = {
    user: {
      findMany: async () => suspendedUsers,
      update: async (input: Record<string, unknown>) => {
        calls++;
        // Simulate DB latency
        const start = performance.now();
        await new Promise((resolve) => setTimeout(resolve, 1));
        totalTime += performance.now() - start;
        return input;
      }
    },
    $transaction: async (queries: Promise<any>[]) => {
      calls += queries.length;
      const start = performance.now();
      await new Promise((resolve) => setTimeout(resolve, queries.length * 1));
      totalTime += performance.now() - start;
      return Promise.all(queries);
    }
  } as unknown as PrismaClient;

  console.time("cleanupSuspendedUsers");
  const result = await cleanupSuspendedUsers(
    prismaClient,
    new Date("2026-03-13T00:00:00.000Z")
  );
  console.timeEnd("cleanupSuspendedUsers");

  console.log(`Updated ${result.anonymized} users`);
  console.log(`DB calls: ${calls}`);
  console.log(`Simulated DB latency: ${totalTime.toFixed(2)}ms`);
}

run().catch(console.error);
