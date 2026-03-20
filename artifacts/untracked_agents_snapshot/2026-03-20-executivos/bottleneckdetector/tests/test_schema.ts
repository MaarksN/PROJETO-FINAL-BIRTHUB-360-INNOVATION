// [SOURCE] BirthHub360_Agentes_Parallel_Plan - BottleneckDetector
import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { ZodError } from "zod";

import { BottleneckDetectorAgent } from "../agent.js";
import {
  BottleneckDetectorInputSchema,
  type BottleneckDetectorInput
} from "../schemas.js";

void test("BottleneckDetector schema rejects missing required fields", () => {
  const invalidPayload = {
    constraints: {
      currency: "BRL",
      language: "pt-BR",
      maxActions: 4
    },
    requestId: "req-schema-invalid-001",
    sections: ["capacity_model"],
    segments: ["enterprise"],
    targetQuotaAttainmentPct: 102,
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  };

  assert.throws(
    () => BottleneckDetectorInputSchema.parse(invalidPayload),
    (error) => error instanceof ZodError
  );
});

void test("BottleneckDetector run rejects unknown input fields", async () => {
  const agent = new BottleneckDetectorAgent({
    contractPath: path.resolve(
      process.cwd(),
      "audit",
      "pending_review",
      "ciclo1_bottleneckdetector",
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
    sections: ["capacity_model", "territory_balance"],
    segments: ["enterprise", "mid_market"],
    targetQuotaAttainmentPct: 102,
    tenantId: "tenant_exec_demo",
    unknownField: "not-allowed",
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  } as unknown as BottleneckDetectorInput;

  await assert.rejects(
    () => agent.run(invalidRuntimePayload),
    (error) => error instanceof ZodError
  );
});
