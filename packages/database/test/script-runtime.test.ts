import assert from "node:assert/strict";
import test from "node:test";

import { createScriptRuntime } from "../scripts/lib/runtime.js";

void test("script runtime requires declared environment variables", () => {
  const runtime = createScriptRuntime(
    {
      logger: {
        error: () => undefined
      },
      name: "db-runtime-test"
    },
    {
      env: {}
    }
  );

  assert.throws(() => runtime.requireEnv("DATABASE_URL"), /DATABASE_URL is required for db-runtime-test/);
});

void test("script runtime writes a success report with executed steps", async () => {
  const reports: Array<{ path: string; payload: unknown }> = [];

  const runtime = createScriptRuntime(
    {
      logger: {
        error: () => undefined
      },
      name: "db-runtime-test"
    },
    {
      now: (() => {
        let tick = 0;
        return () => new Date(Date.UTC(2026, 3, 13, 12, 0, tick++));
      })(),
      writeJsonReport: async (path, payload) => {
        reports.push({ path, payload });
        return path;
      }
    }
  );

  await runtime.run(async () => {
    await runtime.recordStep("prepare", async () => undefined);
  });

  assert.equal(reports.length, 1);
  assert.equal(reports[0]?.path, "scripts/db-runtime-test.json");
  assert.match(JSON.stringify(reports[0]?.payload), /"status":"passed"/);
  assert.match(JSON.stringify(reports[0]?.payload), /"name":"prepare"/);
});

void test("script runtime writes a failure report and sets process exit code on error", async () => {
  const reports: Array<{ path: string; payload: unknown }> = [];
  const previousExitCode = process.exitCode;
  delete process.exitCode;

  const runtime = createScriptRuntime(
    {
      logger: {
        error: () => undefined
      },
      name: "db-runtime-failure"
    },
    {
      writeJsonReport: async (path, payload) => {
        reports.push({ path, payload });
        return path;
      }
    }
  );

  try {
    await runtime.run(async () => {
      await runtime.recordStep("explode", async () => {
        throw new Error("boom");
      });
    });

    assert.equal(process.exitCode, 1);
    assert.equal(reports.length, 1);
    assert.match(JSON.stringify(reports[0]?.payload), /"status":"failed"/);
    assert.match(JSON.stringify(reports[0]?.payload), /"message":"boom"/);
    assert.match(JSON.stringify(reports[0]?.payload), /"name":"explode"/);
  } finally {
    process.exitCode = previousExitCode;
  }
});
