// [SOURCE] BirthHub360_Agentes_Parallel_Plan - CulturePulse
import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { ZodError } from "zod";

import { CulturePulseAgent } from "../agent.js";
import {
  CulturePulseInputSchema,
  type CulturePulseInput
} from "../schemas.js";

void test("CulturePulse schema rejects missing required fields", () => {
  const invalidPayload = {
    constraints: {
      language: "pt-BR",
      maxInsights: 3
    },
    requestId: "req-schema-invalid-001",
    sections: ["engagement"],
    segments: ["executive_team"],
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  };

  assert.throws(
    () => CulturePulseInputSchema.parse(invalidPayload),
    (error) => error instanceof ZodError
  );
});

void test("CulturePulse run rejects unknown input fields", async () => {
  const agent = new CulturePulseAgent({
    contractPath: path.resolve(
      process.cwd(),
      "audit",
      "pending_review",
      "ciclo1_culturepulse",
      "missing_contract.yaml"
    ),
    sleep: async () => undefined
  });

  const invalidRuntimePayload = {
    constraints: {
      language: "pt-BR",
      maxInsights: 3
    },
    requestId: "req-runtime-invalid-001",
    sections: ["engagement", "retention_risk"],
    segments: ["executive_team", "people_managers"],
    tenantId: "tenant_exec_demo",
    unknownField: "not-allowed",
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  } as unknown as CulturePulseInput;

  await assert.rejects(
    () => agent.run(invalidRuntimePayload),
    (error) => error instanceof ZodError
  );
});
