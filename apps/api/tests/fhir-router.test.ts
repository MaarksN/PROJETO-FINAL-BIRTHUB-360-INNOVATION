// @ts-nocheck
import assert from "node:assert/strict";
import test from "node:test";

import express from "express";
import request from "supertest";

import { createApp } from "../src/app.js";
import { createFhirRouter } from "../src/modules/fhir/router.js";
import { createTestApiConfig } from "./test-config.js";

void test("FHIR routes are not mounted in the main API surface while the interoperability facade is disabled", async () => {
  const response = await request(
    createApp({
      config: createTestApiConfig()
    })
  )
    .get("/api/fhir/R4/metadata")
    .expect(404);

  assert.equal(response.body.status, 404);
  assert.equal(response.body.title, "Not Found");
});

void test("standalone FHIR router short-circuits by default while interoperability remains orphaned", async () => {
  const app = express();
  app.use(createFhirRouter());

  const response = await request(app).get("/api/fhir/R4/metadata").expect(404);

  assert.equal(response.body.status, 404);
  assert.equal(response.body.title, "Not Found");
  assert.match(response.body.detail, /FHIR facade router is disabled/i);
});

void test("standalone FHIR router only reaches authentication when the capability is explicitly re-enabled", async () => {
  const app = express();
  app.use(
    createFhirRouter({
      config: {
        fhirFacadeEnabled: true
      }
    })
  );

  const response = await request(app).get("/api/fhir/R4/metadata").expect(401);

  assert.equal(response.body.status, 401);
  assert.equal(response.body.title, "Unauthorized");
});
