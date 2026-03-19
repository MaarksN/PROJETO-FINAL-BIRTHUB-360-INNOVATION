// [SOURCE] BirthHub360_Agentes_Parallel_Plan - MarketSentinel
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { MarketSentinelAgent } from "../agent.js";
import {
  DEFAULT_MARKETSENTINEL_CONTRACT,
  type MarketEvent,
  type MarketSentinelInput
} from "../schemas.js";
import type { MarketSentinelToolAdapters } from "../tools.js";

const VALID_INPUT: MarketSentinelInput = {
  requestId: "req-marketsentinel-unit-001",
  scope: "latam",
  sections: ["macro_trends", "competitors", "customer_sentiment"],
  tenantId: "tenant_exec_demo",
  window: {
    endDate: "2026-03-31",
    startDate: "2026-03-01"
  }
};

void test("MarketSentinel returns success output on happy path", async () => {
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

  const output = await agent.run(VALID_INPUT);

  assert.equal(output.status, "success");
  assert.equal(output.fallback.applied, false);
  assert.ok(output.marketBrief.trendSignals.length >= 2);
  assert.ok(output.observability.metrics.toolCalls >= 3);
  assert.ok(
    output.observability.events.some(
      (event: MarketEvent) => event.name === "marketsentinel.response.generated"
    )
  );
});

void test("MarketSentinel returns error when contract mode is hard_fail", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "marketsentinel-contract-"));
  const contractPath = path.join(tempDir, "contract.yaml");
  const contract = {
    ...DEFAULT_MARKETSENTINEL_CONTRACT,
    failureMode: "hard_fail",
    retry: {
      baseDelayMs: 1,
      maxAttempts: 2
    }
  };
  await writeFile(contractPath, JSON.stringify(contract, null, 2), "utf8");

  const failingAdapters: MarketSentinelToolAdapters = {
    async fetchCompetitorWatch() {
      throw new Error("competitor watch unavailable");
    },
    async fetchMacroSignalFeed() {
      throw new Error("macro feed unavailable");
    },
    async fetchSentimentStream() {
      throw new Error("sentiment stream unavailable");
    }
  };

  try {
    const agent = new MarketSentinelAgent({
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
        (event: MarketEvent) => event.name === "marketsentinel.fallback.applied"
      )
    );
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
});

