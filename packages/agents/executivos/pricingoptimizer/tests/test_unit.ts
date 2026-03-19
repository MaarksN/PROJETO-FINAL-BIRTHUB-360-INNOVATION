// [SOURCE] BirthHub360_Agentes_Parallel_Plan - PricingOptimizer
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { PricingOptimizerAgent } from "../agent.js";
import {
  DEFAULT_PRICINGOPTIMIZER_CONTRACT,
  type PricingEvent,
  type PricingOptimizerInput
} from "../schemas.js";
import type { PricingOptimizerToolAdapters } from "../tools.js";

const VALID_INPUT: PricingOptimizerInput = {
  constraints: {
    currency: "BRL",
    language: "pt-BR",
    maxActions: 4
  },
  requestId: "req-pricingoptimizer-unit-001",
  sections: ["elasticity", "discount_leakage", "win_rate_impact"],
  segments: ["enterprise", "mid_market", "strategic_accounts"],
  targetGrossMarginPct: 72,
  tenantId: "tenant_exec_demo",
  window: {
    endDate: "2026-03-31",
    startDate: "2026-03-01"
  }
};

void test("PricingOptimizer returns success output on happy path", async () => {
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

  const output = await agent.run(VALID_INPUT);

  assert.equal(output.status, "success");
  assert.equal(output.fallback.applied, false);
  assert.ok(output.pricingBrief.signals.length >= 2);
  assert.ok(output.observability.metrics.toolCalls >= 3);
  assert.ok(
    output.observability.events.some(
      (event: PricingEvent) => event.name === "pricingoptimizer.response.generated"
    )
  );
});

void test("PricingOptimizer returns error when contract mode is hard_fail", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "pricingoptimizer-contract-"));
  const contractPath = path.join(tempDir, "contract.yaml");
  const contract = {
    ...DEFAULT_PRICINGOPTIMIZER_CONTRACT,
    failureMode: "hard_fail",
    retry: {
      baseDelayMs: 1,
      maxAttempts: 2
    }
  };
  await writeFile(contractPath, JSON.stringify(contract, null, 2), "utf8");

  const failingAdapters: PricingOptimizerToolAdapters = {
    async fetchDiscountLeak() {
      throw new Error("discount leak unavailable");
    },
    async fetchPriceElasticity() {
      throw new Error("price elasticity unavailable");
    },
    async fetchWinRateImpact() {
      throw new Error("win-rate unavailable");
    }
  };

  try {
    const agent = new PricingOptimizerAgent({
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
        (event: PricingEvent) => event.name === "pricingoptimizer.fallback.applied"
      )
    );
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
});
