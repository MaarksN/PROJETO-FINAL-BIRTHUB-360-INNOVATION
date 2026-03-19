// [SOURCE] BirthHub360_Agentes_Parallel_Plan - MarketSentinel
import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { ZodError } from "zod";

import { MarketSentinelAgent } from "../agent.js";
import { MarketSentinelInputSchema, type MarketSentinelInput } from "../schemas.js";

void test("MarketSentinel schema rejects missing required fields", () => {
  const invalidPayload = {
    requestId: "req-schema-invalid-001",
    scope: "latam",
    sections: ["macro_trends"],
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  };

  assert.throws(
    () => MarketSentinelInputSchema.parse(invalidPayload),
    (error) => error instanceof ZodError
  );
});

void test("MarketSentinel run rejects unknown input fields", async () => {
  const agent = new MarketSentinelAgent({
    contractPath: path.resolve(
      process.cwd(),
      "audit",
      "pending_review",
      "ciclo1_marketsentinel",
      "missing_contract.yaml"
    ),
    sleep: async () => undefined
  });

  const invalidRuntimePayload = {
    requestId: "req-runtime-invalid-001",
    scope: "latam",
    sections: ["macro_trends", "competitors"],
    tenantId: "tenant_exec_demo",
    unknownField: "not-allowed",
    window: {
      endDate: "2026-03-31",
      startDate: "2026-03-01"
    }
  } as unknown as MarketSentinelInput;

  await assert.rejects(
    () => agent.run(invalidRuntimePayload),
    (error) => error instanceof ZodError
  );
});

