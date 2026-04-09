// @ts-nocheck
import assert from "node:assert/strict";
import test from "node:test";

import { Role } from "@birthub/database";
import express from "express";
import request from "supertest";
import { ZodError } from "zod";

import {
  ProblemDetailsError,
  fromZodError,
  toProblemDetails
} from "../src/lib/problem-details.js";
import { createFhirRouter } from "../src/modules/fhir/router.js";
import { fhirService } from "../src/modules/fhir/service.js";

function stubMethod(target: object, key: string, value: unknown): () => void {
  const original = Reflect.get(target, key);
  Reflect.set(target, key, value);
  return () => {
    Reflect.set(target, key, original);
  };
}

function createFhirTestApp() {
  const app = express();
  app.use(express.json());
  app.use((request, _response, next) => {
    request.context = {
      apiKeyId: null,
      authType: "session",
      billingPlanStatus: null,
      breakGlassGrantId: null,
      breakGlassReason: null,
      breakGlassTicket: null,
      impersonatedByUserId: null,
      organizationId: "org_clinic",
      requestId: "req_fhir",
      role: Role.MEMBER,
      sessionAccessMode: null,
      sessionId: "session_clinic",
      tenantId: "tenant_clinic",
      tenantSlug: "tenant-clinic",
      traceId: "trace_fhir",
      userId: "user_clinic"
    };
    next();
  });
  app.use(
    createFhirRouter({
      recordAudit: () => Promise.resolve()
    })
  );
  app.use((error: unknown, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const problem =
      error instanceof ZodError
        ? fromZodError(error)
        : error instanceof ProblemDetailsError
          ? error
          : new ProblemDetailsError({
              detail: error instanceof Error ? error.message : "Unexpected internal server error.",
              status: 500,
              title: "Internal Server Error"
            });

    res.status(problem.status).json(toProblemDetails(req, problem));
  });
  return app;
}

void test("FHIR metadata responds as application/fhir+json", async () => {
  const response = await request(createFhirTestApp())
    .get("/api/fhir/R4/metadata")
    .expect(200);

  assert.match(String(response.headers["content-type"] ?? ""), /application\/fhir\+json/i);
  assert.equal(response.body.resourceType, "CapabilityStatement");
  assert.equal(response.body.fhirVersion, "4.0.1");
});

void test("FHIR patient read delegates to the service with tenant-aware context", async () => {
  let received: unknown = null;
  const restore = stubMethod(fhirService, "getPatient", (context: unknown, patientId: unknown) => {
    received = { context, patientId };
    return Promise.resolve({
      id: "patient_1",
      resourceType: "Patient"
    });
  });

  try {
    const response = await request(createFhirTestApp())
      .get("/api/fhir/R4/Patient/patient_1")
      .expect(200);

    assert.deepEqual(received, {
      context: {
        actorId: "user_clinic",
        organizationId: "org_clinic",
        tenantId: "tenant_clinic",
        userId: "user_clinic"
      },
      patientId: "patient_1"
    });
    assert.equal(response.body.resourceType, "Patient");
  } finally {
    restore();
  }
});

void test("FHIR patient search requires at least one search parameter", async () => {
  const response = await request(createFhirTestApp())
    .get("/api/fhir/R4/Patient")
    .expect(400);

  assert.match(String(response.body.detail ?? ""), /search parameter/i);
});
