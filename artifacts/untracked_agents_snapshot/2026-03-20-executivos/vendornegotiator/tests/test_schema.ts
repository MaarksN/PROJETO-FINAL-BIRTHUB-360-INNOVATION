// [SOURCE] BirthHub360_Agentes_Parallel_Plan - VendorNegotiator
import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { ZodError } from "zod";

import { VendorNegotiatorAgent } from "../agent.js";
import { VendorNegotiatorInputSchema, type VendorNegotiatorInput } from "../schemas.js";

void test("VendorNegotiator schema rejects missing required fields", () => {
  const invalidPayload = {
    constraints: {
      currency: "BRL",
      language: "pt-BR",
      maxActions: 4
    },
    requestId: "req-schema-invalid-001",
    sections: ["allocation_rebalance"],
    segments: ["enterprise"],
    targetBudgetEfficiencyPct: 67,
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  };

  assert.throws(
    () => VendorNegotiatorInputSchema.parse(invalidPayload),
    (error) => error instanceof ZodError
  );
});

void test("VendorNegotiator run rejects unknown input fields", async () => {
  const agent = new VendorNegotiatorAgent({
    contractPath: path.resolve(
      process.cwd(),
      "audit",
      "pending_review",
      "ciclo1_vendornegotiator",
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
    sections: ["allocation_rebalance", "forecast_drift"],
    segments: ["enterprise", "mid_market"],
    targetBudgetEfficiencyPct: 67,
    tenantId: "tenant_exec_demo",
    unknownField: "not-allowed",
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  } as unknown as VendorNegotiatorInput;

  await assert.rejects(
    () => agent.run(invalidRuntimePayload),
    (error) => error instanceof ZodError
  );
});
