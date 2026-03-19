// [SOURCE] BirthHub360_Agentes_Parallel_Plan - ExpansionMapper
import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { ZodError } from "zod";

import { ExpansionMapperAgent } from "../agent.js";
import {
  ExpansionMapperInputSchema,
  type ExpansionMapperInput
} from "../schemas.js";

void test("ExpansionMapper schema rejects missing required fields", () => {
  const invalidPayload = {
    constraints: {
      currency: "BRL",
      language: "pt-BR",
      maxActions: 4
    },
    requestId: "req-schema-invalid-001",
    sections: ["geo_opportunities"],
    segments: ["enterprise"],
    targetExpansionArr: 4_500_000,
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  };

  assert.throws(
    () => ExpansionMapperInputSchema.parse(invalidPayload),
    (error) => error instanceof ZodError
  );
});

void test("ExpansionMapper run rejects unknown input fields", async () => {
  const agent = new ExpansionMapperAgent({
    contractPath: path.resolve(
      process.cwd(),
      "audit",
      "pending_review",
      "ciclo1_expansionmapper",
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
    sections: ["geo_opportunities", "segment_whitespace"],
    segments: ["enterprise", "mid_market"],
    targetExpansionArr: 4_500_000,
    tenantId: "tenant_exec_demo",
    unknownField: "not-allowed",
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  } as unknown as ExpansionMapperInput;

  await assert.rejects(
    () => agent.run(invalidRuntimePayload),
    (error) => error instanceof ZodError
  );
});
