// [SOURCE] BirthHub360_Agentes_Parallel_Plan - PricingOptimizer
import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { ZodError } from "zod";

import { PricingOptimizerAgent } from "../agent.js";
import {
  PricingOptimizerInputSchema,
  type PricingOptimizerInput
} from "../schemas.js";

void test("PricingOptimizer schema rejects missing required fields", () => {
  const invalidPayload = {
    constraints: {
      currency: "BRL",
      language: "pt-BR",
      maxActions: 4
    },
    requestId: "req-schema-invalid-001",
    sections: ["elasticity"],
    segments: ["enterprise"],
    targetGrossMarginPct: 72,
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  };

  assert.throws(
    () => PricingOptimizerInputSchema.parse(invalidPayload),
    (error) => error instanceof ZodError
  );
});

void test("PricingOptimizer run rejects unknown input fields", async () => {
  const agent = new PricingOptimizerAgent({
    contractPath: path.resolve(
      process.cwd(),
      "audit",
      "pending_review",
      "ciclo1_pricingoptimizer",
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
    sections: ["elasticity", "discount_leakage"],
    segments: ["enterprise", "mid_market"],
    targetGrossMarginPct: 72,
    tenantId: "tenant_exec_demo",
    unknownField: "not-allowed",
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  } as unknown as PricingOptimizerInput;

  await assert.rejects(
    () => agent.run(invalidRuntimePayload),
    (error) => error instanceof ZodError
  );
});
