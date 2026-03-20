// [SOURCE] BirthHub360_Agentes_Parallel_Plan - ComplianceEnforcer
import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { ZodError } from "zod";

import { ComplianceEnforcerAgent } from "../agent.js";
import { ComplianceEnforcerInputSchema, type ComplianceEnforcerInput } from "../schemas.js";

void test("ComplianceEnforcer schema rejects missing required fields", () => {
  const invalidPayload = {
    constraints: {
      currency: "BRL",
      language: "pt-BR",
      maxActions: 4
    },
    requestId: "req-schema-invalid-001",
    sections: ["battlecards"],
    segments: ["enterprise"],
    targetRecoveryPct: 22,
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  };

  assert.throws(
    () => ComplianceEnforcerInputSchema.parse(invalidPayload),
    (error) => error instanceof ZodError
  );
});

void test("ComplianceEnforcer run rejects unknown input fields", async () => {
  const agent = new ComplianceEnforcerAgent({
    contractPath: path.resolve(
      process.cwd(),
      "audit",
      "pending_review",
      "ciclo1_complianceenforcer",
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
    sections: ["battlecards", "pricing_benchmarks"],
    segments: ["enterprise", "mid_market"],
    targetRecoveryPct: 22,
    tenantId: "tenant_exec_demo",
    unknownField: "not-allowed",
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  } as unknown as ComplianceEnforcerInput;

  await assert.rejects(
    () => agent.run(invalidRuntimePayload),
    (error) => error instanceof ZodError
  );
});
