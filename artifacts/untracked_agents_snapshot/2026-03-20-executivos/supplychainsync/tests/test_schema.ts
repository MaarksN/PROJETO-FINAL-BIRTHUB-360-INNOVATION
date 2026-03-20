// [SOURCE] BirthHub360_Agentes_Parallel_Plan - SupplyChainSync
import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { ZodError } from "zod";

import { SupplyChainSyncAgent } from "../agent.js";
import { SupplyChainSyncInputSchema, type SupplyChainSyncInput } from "../schemas.js";

void test("SupplyChainSync schema rejects missing required fields", () => {
  const invalidPayload = {
    constraints: {
      currency: "BRL",
      language: "pt-BR",
      maxActions: 4
    },
    requestId: "req-schema-invalid-001",
    sections: ["emerging_signals"],
    segments: ["enterprise"],
    targetSignalConfidencePct: 42,
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  };

  assert.throws(
    () => SupplyChainSyncInputSchema.parse(invalidPayload),
    (error) => error instanceof ZodError
  );
});

void test("SupplyChainSync run rejects unknown input fields", async () => {
  const agent = new SupplyChainSyncAgent({
    contractPath: path.resolve(
      process.cwd(),
      "audit",
      "pending_review",
      "ciclo1_supplychainsync",
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
    sections: ["emerging_signals", "topic_clusters"],
    segments: ["enterprise", "mid_market"],
    targetSignalConfidencePct: 42,
    tenantId: "tenant_exec_demo",
    unknownField: "not-allowed",
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  } as unknown as SupplyChainSyncInput;

  await assert.rejects(
    () => agent.run(invalidRuntimePayload),
    (error) => error instanceof ZodError
  );
});
