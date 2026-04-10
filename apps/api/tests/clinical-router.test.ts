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
import { createClinicalRouter } from "../src/modules/clinical/router.js";
import { clinicalService } from "../src/modules/clinical/service.js";

function stubMethod(target: object, key: string, value: unknown): () => void {
  const original = Reflect.get(target, key);
  Reflect.set(target, key, value);
  return () => {
    Reflect.set(target, key, original);
  };
}

function createClinicalTestApp() {
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
      requestId: "req_clinic",
      role: Role.MEMBER,
      sessionAccessMode: null,
      sessionId: "session_clinic",
      tenantId: "tenant_clinic",
      tenantSlug: "tenant-clinic",
      traceId: "trace_clinic",
      userId: "user_clinic"
    };
    next();
  });
  app.use("/api/v1", createClinicalRouter());
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

void test("clinical router lists patients with search and risk filters", async () => {
  let received: unknown = null;
  const restore = stubMethod(clinicalService, "listPatients", (context: unknown, filters: unknown) => {
    received = { context, filters };
    return Promise.resolve({
      items: [],
      pageSize: 25
    });
  });

  try {
    const response = await request(createClinicalTestApp())
      .get("/api/v1/patients")
      .query({
        limit: "25",
        riskLevel: "HIGH",
        search: "Maria",
        status: "ACTIVE"
      })
      .expect(200);

    assert.deepEqual(received, {
      context: {
        organizationId: "org_clinic",
        tenantId: "tenant_clinic",
        userId: "user_clinic"
      },
      filters: {
        limit: 25,
        riskLevel: "HIGH",
        search: "Maria",
        status: "ACTIVE"
      }
    });
    assert.deepEqual(response.body, {
      items: [],
      pageSize: 25,
      requestId: "req_clinic"
    });
  } finally {
    restore();
  }
});

void test("clinical router creates appointments with validated payload", async () => {
  let received: unknown = null;
  const restore = stubMethod(clinicalService, "createAppointment", (context: unknown, payload: unknown) => {
    received = { context, payload };
    return Promise.resolve({
      appointment: {
        id: "appt_1"
      }
    });
  });

  try {
    const response = await request(createClinicalTestApp())
      .post("/api/v1/appointments")
      .send({
        bloodPressureSystolic: 138,
        patientId: "patient_1",
        scheduledAt: "2026-04-07T14:00",
        type: "PRENATAL"
      })
      .expect(201);

    assert.deepEqual(received, {
      context: {
        organizationId: "org_clinic",
        tenantId: "tenant_clinic",
        userId: "user_clinic"
      },
      payload: {
        bloodPressureSystolic: 138,
        patientId: "patient_1",
        scheduledAt: "2026-04-07T14:00",
        type: "PRENATAL"
      }
    });
    assert.deepEqual(response.body, {
      appointment: {
        id: "appt_1"
      },
      requestId: "req_clinic"
    });
  } finally {
    restore();
  }
});

void test("clinical router versions a clinical note via PATCH", async () => {
  let received: unknown = null;
  const restore = stubMethod(clinicalService, "updateClinicalNote", (context: unknown, noteGroupId: unknown, payload: unknown) => {
    received = { context, noteGroupId, payload };
    return Promise.resolve({
      note: {
        noteGroupId: "note-group-1",
        version: 2
      }
    });
  });

  try {
    const response = await request(createClinicalTestApp())
      .patch("/api/v1/clinical-notes/note-group-1")
      .send({
        assessment: "Sem sinais de alarme.",
        title: "Evolucao de retorno"
      })
      .expect(200);

    assert.deepEqual(received, {
      context: {
        organizationId: "org_clinic",
        tenantId: "tenant_clinic",
        userId: "user_clinic"
      },
      noteGroupId: "note-group-1",
      payload: {
        assessment: "Sem sinais de alarme.",
        title: "Evolucao de retorno"
      }
    });
    assert.deepEqual(response.body, {
      note: {
        noteGroupId: "note-group-1",
        version: 2
      },
      requestId: "req_clinic"
    });
  } finally {
    restore();
  }
});
