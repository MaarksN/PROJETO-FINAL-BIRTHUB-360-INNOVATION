// [SOURCE] BirthHub360_Agentes_Parallel_Plan - CapitalAllocator
import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { ZodError } from "zod";

import { CapitalAllocatorAgent } from "../agent.js";
import {
  CapitalAllocatorInputSchema,
  type CapitalAllocatorInput
} from "../schemas.js";

void test("CapitalAllocator schema rejects missing required fields", () => {
  const invalidPayload = {
    businessUnits: ["Sales", "Marketing"],
    capitalBudget: 2_500_000,
    constraints: {
      currency: "BRL",
      language: "pt-BR",
      maxAllocations: 4
    },
    objectives: ["growth"],
    planningHorizonMonths: 12,
    requestId: "req-schema-invalid-001",
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  };

  assert.throws(
    () => CapitalAllocatorInputSchema.parse(invalidPayload),
    (error) => error instanceof ZodError
  );
});

void test("CapitalAllocator run rejects unknown input fields", async () => {
  const agent = new CapitalAllocatorAgent({
    contractPath: path.resolve(
      process.cwd(),
      "audit",
      "pending_review",
      "ciclo1_capitalallocator",
      "missing_contract.yaml"
    ),
    sleep: async () => undefined
  });

  const invalidRuntimePayload = {
    businessUnits: ["Sales", "Marketing"],
    capitalBudget: 2_500_000,
    constraints: {
      currency: "BRL",
      language: "pt-BR",
      maxAllocations: 4
    },
    objectives: ["growth"],
    planningHorizonMonths: 12,
    requestId: "req-runtime-invalid-001",
    tenantId: "tenant_exec_demo",
    unknownField: "not-allowed",
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  } as unknown as CapitalAllocatorInput;

  await assert.rejects(
    () => agent.run(invalidRuntimePayload),
    (error) => error instanceof ZodError
  );
});
