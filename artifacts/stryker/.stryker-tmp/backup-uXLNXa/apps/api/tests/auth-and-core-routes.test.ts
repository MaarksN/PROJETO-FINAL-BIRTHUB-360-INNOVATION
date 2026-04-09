import assert from "node:assert/strict";
import test from "node:test";

import express from "express";

import { registerAuthAndCoreRoutes } from "../src/app/auth-and-core-routes.js";
import { createTestApiConfig } from "./test-config.js";

void test("registerAuthAndCoreRoutes delegates auth and core route registration with shared dependencies", () => {
  const app = express();
  const config = createTestApiConfig();
  const calls: string[] = [];
  const dependency = async () => Promise.resolve({ jobId: "job_1" });

  registerAuthAndCoreRoutes(app, config, {
    enqueueTask: dependency,
    registerAuthRoutes: (receivedApp, receivedConfig) => {
      assert.equal(receivedApp, app);
      assert.equal(receivedConfig, config);
      calls.push("auth");
    },
    registerCoreBusinessRoutes: (receivedApp, receivedConfig, receivedDependencies) => {
      assert.equal(receivedApp, app);
      assert.equal(receivedConfig, config);
      assert.ok(receivedDependencies);
      assert.equal(receivedDependencies.enqueueTask, dependency);
      calls.push("core");
    }
  });

  assert.deepEqual(calls, ["auth", "core"]);
});
