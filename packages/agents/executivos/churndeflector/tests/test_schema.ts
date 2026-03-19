// [SOURCE] BirthHub360_Agentes_Parallel_Plan - ChurnDeflector
import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { ZodError } from "zod";

import { ChurnDeflectorAgent } from "../agent.js";
import {
  ChurnDeflectorInputSchema,
  type ChurnDeflectorInput
} from "../schemas.js";

void test("ChurnDeflector schema rejects missing required fields", () => {
  const invalidPayload = {
    constraints: {
      currency: "BRL",
      language: "pt-BR",
      maxActions: 4
    },
    requestId: "req-schema-invalid-001",
    sections: ["risk_cohorts"],
    segments: ["enterprise"],
    targetGrossRevenueRetentionPct: 95,
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  };

  assert.throws(
    () => ChurnDeflectorInputSchema.parse(invalidPayload),
    (error) => error instanceof ZodError
  );
});

void test("ChurnDeflector run rejects unknown input fields", async () => {
  const agent = new ChurnDeflectorAgent({
    contractPath: path.resolve(
      process.cwd(),
      "audit",
      "pending_review",
      "ciclo1_churndeflector",
      "missing_contract.yaml"
    ),
    sleep: async () => undefined
  });

  const invalidRuntimePayload = {
    constraints: {
      currency: "BRL",
      language: "pt-BR",
      maxActions: 4
    },
    requestId: "req-runtime-invalid-001",
    sections: ["risk_cohorts", "retention_actions"],
    segments: ["enterprise", "mid_market"],
    targetGrossRevenueRetentionPct: 95,
    tenantId: "tenant_exec_demo",
    unknownField: "not-allowed",
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  } as unknown as ChurnDeflectorInput;

  await assert.rejects(
    () => agent.run(invalidRuntimePayload),
    (error) => error instanceof ZodError
  );
});
