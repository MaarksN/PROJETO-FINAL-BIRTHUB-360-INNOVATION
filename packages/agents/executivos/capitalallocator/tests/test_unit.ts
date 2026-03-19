// [SOURCE] BirthHub360_Agentes_Parallel_Plan - CapitalAllocator
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { CapitalAllocatorAgent } from "../agent.js";
import {
  type CapitalAllocatorInput,
  type CapitalEvent,
  DEFAULT_CAPITALALLOCATOR_CONTRACT
} from "../schemas.js";
import type { CapitalAllocatorToolAdapters } from "../tools.js";

const VALID_INPUT: CapitalAllocatorInput = {
  businessUnits: ["Sales", "Marketing", "Product", "Customer Success"],
  capitalBudget: 2_500_000,
  constraints: {
    currency: "BRL",
    language: "pt-BR",
    maxAllocations: 4
  },
  objectives: ["growth", "efficiency"],
  planningHorizonMonths: 12,
  requestId: "req-capitalallocator-unit-001",
  tenantId: "tenant_exec_demo",
  window: {
    endDate: "2026-03-31",
    startDate: "2026-03-01"
  }
};

void test("CapitalAllocator returns success output on happy path", async () => {
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

  const output = await agent.run(VALID_INPUT);

  assert.equal(output.status, "success");
  assert.equal(output.fallback.applied, false);
  assert.ok(output.allocationBrief.allocations.length >= 1);
  assert.ok(output.observability.metrics.toolCalls >= 3);
  assert.ok(
    output.observability.events.some(
      (event: CapitalEvent) => event.name === "capitalallocator.response.generated"
    )
  );
});

void test("CapitalAllocator returns error when contract mode is hard_fail", async () => {
  const tempDir = await mkdtemp(
    path.join(os.tmpdir(), "capitalallocator-contract-")
  );
  const contractPath = path.join(tempDir, "contract.yaml");
  const contract = {
    ...DEFAULT_CAPITALALLOCATOR_CONTRACT,
    failureMode: "hard_fail",
    retry: {
      baseDelayMs: 1,
      maxAttempts: 2
    }
  };
  await writeFile(contractPath, JSON.stringify(contract, null, 2), "utf8");

  const failingAdapters: CapitalAllocatorToolAdapters = {
    async fetchCashflowForecast() {
      throw new Error("cashflow unavailable");
    },
    async fetchPortfolioScenario() {
      throw new Error("portfolio scenario unavailable");
    },
    async fetchStrategicPriority() {
      throw new Error("strategic priority unavailable");
    }
  };

  try {
    const agent = new CapitalAllocatorAgent({
      contractPath,
      sleep: async () => undefined,
      toolAdapters: failingAdapters
    });
    const output = await agent.run(VALID_INPUT);

    assert.equal(output.status, "error");
    assert.equal(output.fallback.applied, true);
    assert.equal(output.fallback.mode, "hard_fail");
    assert.ok(output.fallback.reasons.length >= 3);
    assert.ok(output.observability.metrics.retries >= 3);
    assert.ok(
      output.observability.events.some(
        (event: CapitalEvent) => event.name === "capitalallocator.fallback.applied"
      )
    );
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
});
