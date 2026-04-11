// @ts-nocheck
import assert from "node:assert/strict";
import test from "node:test";

import request from "supertest";

import { createApp } from "../src/app.js";
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
