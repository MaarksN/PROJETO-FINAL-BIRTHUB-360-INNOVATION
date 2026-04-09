// @ts-nocheck
// 
import assert from "node:assert/strict";
import test from "node:test";

import express from "express";
import request from "supertest";

import { registerCoreBusinessRoutes } from "../src/app/core-business-routes.js";
import { requestContextMiddleware } from "../src/middleware/request-context.js";
import { createTestApiConfig } from "./test-config.js";

void test("registerCoreBusinessRoutes exposes organization, profile and task endpoints", async () => {
  const app = express();
  app.use(requestContextMiddleware);
  app.use(express.json());
  registerCoreBusinessRoutes(app, createTestApiConfig());

  await request(app)
    .post("/api/v1/organizations")
    .send({})
    .expect(400);

  await request(app)
    .get("/api/v1/me")
    .expect(401);

  await request(app)
    .post("/api/v1/tasks")
    .send({})
    .expect(401);

  assert.ok(app);
});
