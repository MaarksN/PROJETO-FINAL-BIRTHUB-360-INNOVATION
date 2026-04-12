// @ts-nocheck
import assert from "node:assert/strict";
import test from "node:test";

import express from "express";
import request from "supertest";

import { createApp } from "../src/app.js";
import { createClinicalRouter } from "../src/modules/clinical/router.js";
import { createTestApiConfig } from "./test-config.js";

void test("clinical routes are not mounted in the main API surface while the clinical workspace is disabled", async () => {
  const response = await request(
    createApp({
      config: createTestApiConfig()
    })
  )
    .get("/api/v1/patients")
    .expect(404);

  assert.equal(response.body.status, 404);
  assert.equal(response.body.title, "Not Found");
});

void test("standalone clinical router short-circuits by default while the domain remains orphaned", async () => {
  const app = express();
  app.use("/api/v1", createClinicalRouter());

  const response = await request(app).get("/api/v1/patients").expect(404);

  assert.equal(response.body.status, 404);
  assert.equal(response.body.title, "Not Found");
  assert.match(response.body.detail, /clinical workspace router is disabled/i);
});

void test("standalone clinical router only reaches authentication when the capability is explicitly re-enabled", async () => {
  const app = express();
  app.use(
    "/api/v1",
    createClinicalRouter({
      clinicalWorkspaceEnabled: true
    })
  );

  const response = await request(app).get("/api/v1/patients").expect(401);

  assert.equal(response.body.status, 401);
  assert.equal(response.body.title, "Unauthorized");
});
