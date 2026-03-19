// [SOURCE] BirthHub360_Agentes_Parallel_Plan - ExpansionMapper
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { ExpansionMapperAgent } from "../agent.js";
import {
  DEFAULT_EXPANSIONMAPPER_CONTRACT,
  type ExpansionEvent,
  type ExpansionMapperInput
} from "../schemas.js";
import type { ExpansionMapperToolAdapters } from "../tools.js";

const VALID_INPUT: ExpansionMapperInput = {
  constraints: {
    currency: "BRL",
    language: "pt-BR",
    maxActions: 4
  },
  requestId: "req-expansionmapper-unit-001",
  sections: ["geo_opportunities", "segment_whitespace", "risk_constraints"],
  segments: ["enterprise", "mid_market", "strategic_accounts"],
  targetExpansionArr: 4_500_000,
  tenantId: "tenant_exec_demo",
  window: {
    endDate: "2026-03-31",
    startDate: "2026-03-01"
  }
};

void test("ExpansionMapper returns success output on happy path", async () => {
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

  const output = await agent.run(VALID_INPUT);

  assert.equal(output.status, "success");
  assert.equal(output.fallback.applied, false);
  assert.ok(output.expansionBrief.signals.length >= 2);
  assert.ok(output.observability.metrics.toolCalls >= 3);
  assert.ok(
    output.observability.events.some(
      (event: ExpansionEvent) => event.name === "expansionmapper.response.generated"
    )
  );
});

void test("ExpansionMapper returns error when contract mode is hard_fail", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "expansionmapper-contract-"));
  const contractPath = path.join(tempDir, "contract.yaml");
  const contract = {
    ...DEFAULT_EXPANSIONMAPPER_CONTRACT,
    failureMode: "hard_fail",
    retry: {
      baseDelayMs: 1,
      maxAttempts: 2
    }
  };
  await writeFile(contractPath, JSON.stringify(contract, null, 2), "utf8");

  const failingAdapters: ExpansionMapperToolAdapters = {
    async fetchProductAdoption() {
      throw new Error("adoption unavailable");
    },
    async fetchTerritoryIntelligence() {
      throw new Error("territory intelligence unavailable");
    },
    async fetchWhitespaceScoring() {
      throw new Error("whitespace scoring unavailable");
    }
  };

  try {
    const agent = new ExpansionMapperAgent({
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
        (event: ExpansionEvent) => event.name === "expansionmapper.fallback.applied"
      )
    );
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
});
