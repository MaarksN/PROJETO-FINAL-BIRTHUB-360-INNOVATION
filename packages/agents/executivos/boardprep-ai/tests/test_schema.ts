// [SOURCE] BirthHub360_Agentes_Parallel_Plan — BoardPrep AI
import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { ZodError } from "zod";

import { BoardPrepAIAgent } from "../agent.js";
import { BoardPrepInputSchema, type BoardPrepInput } from "../schemas.js";

void test("BoardPrep input schema rejects invalid payloads", () => {
  const invalidPayload = {
    audience: "board",
    constraints: {
      currency: "BRL",
      language: "pt-BR",
      maxRecommendations: 2
    },
    period: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    },
    requestId: "req-invalid-001",
    sections: ["kpis"]
  };

  assert.throws(
    () => BoardPrepInputSchema.parse(invalidPayload),
    (error) => error instanceof ZodError
  );
});

void test("BoardPrep boundary rejects unknown fields at runtime", async () => {
  const agent = new BoardPrepAIAgent({
    contractPath: path.resolve(
      process.cwd(),
      "audit",
      "pending_review",
      "ciclo1_boardprep-ai",
      "missing_contract.yaml"
    ),
    sleep: async () => undefined
  });

  const invalidRuntimePayload = {
    audience: "board",
    constraints: {
      currency: "BRL",
      language: "pt-BR",
      maxRecommendations: 2
    },
    extraField: "unexpected",
    period: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    },
    requestId: "req-invalid-runtime-001",
    sections: ["kpis", "risks"],
    tenantId: "tenant_exec_demo"
  } as unknown as BoardPrepInput;

  await assert.rejects(
    () => agent.run(invalidRuntimePayload),
    (error) => error instanceof ZodError
  );
});
