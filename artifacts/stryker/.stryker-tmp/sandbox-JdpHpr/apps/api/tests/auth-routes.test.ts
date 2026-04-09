// @ts-nocheck
// 
import assert from "node:assert/strict";
import test from "node:test";

import express from "express";
import request from "supertest";

import { registerAuthRoutes } from "../src/app/auth-routes.js";
import { requestContextMiddleware } from "../src/middleware/request-context.js";
import { createTestApiConfig } from "./test-config.js";

void test("registerAuthRoutes exposes login and refresh endpoints with validation/auth guards", async () => {
  const app = express();
  app.use(requestContextMiddleware);
  app.use(express.json());
  registerAuthRoutes(app, createTestApiConfig());

  await request(app)
    .post("/api/v1/auth/login")
    .send({})
    .expect(400);

  await request(app)
    .post("/api/v1/auth/refresh")
    .send({})
    .expect(400);

  await request(app)
    .get("/api/v1/sessions")
    .expect(401);

  assert.ok(app);
});
