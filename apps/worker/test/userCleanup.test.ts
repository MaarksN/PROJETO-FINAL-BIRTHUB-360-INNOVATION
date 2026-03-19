import assert from "node:assert/strict";
import test from "node:test";
import type { PrismaClient } from "@birthub/database";

import { cleanupSuspendedUsers } from "../src/jobs/userCleanup.js";

void test("cleanupSuspendedUsers anonymizes stale suspended users", async () => {
  const updates: Array<Record<string, unknown>> = [];
  const prismaClient = {
    user: {
      findMany: async () => [
        {
          email: "owner@birthub.local",
          id: "user_1",
          status: "SUSPENDED"
        }
      ],
      update: async (input: Record<string, unknown>) => {
        return input;
      }
    },
    $transaction: async (queries: Promise<unknown>[]) => {
      const resolved = await Promise.all(queries);
      updates.push(...(resolved as Array<Record<string, unknown>>));
      return resolved;
    }
  } as unknown as PrismaClient;

  const result = await cleanupSuspendedUsers(
    prismaClient,
    new Date("2026-03-13T00:00:00.000Z")
  );

  assert.equal(result.anonymized, 1);
  assert.equal(updates.length, 1);
  assert.equal(
    (updates[0]?.data as { email: string }).email,
    "deleted+user_1@redacted.local"
  );
  assert.equal((updates[0]?.data as { name: string }).name, "Deleted User");
});
