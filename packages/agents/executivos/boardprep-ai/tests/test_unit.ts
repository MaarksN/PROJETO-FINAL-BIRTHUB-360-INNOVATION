// [SOURCE] BirthHub360_Agentes_Parallel_Plan — BoardPrep AI
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { BoardPrepAIAgent } from "../agent.js";
import {
  type BoardPrepEvent,
  DEFAULT_BOARDPREP_CONTRACT,
  type BoardPrepInput
} from "../schemas.js";
import type { BoardPrepToolAdapters } from "../tools.js";

const VALID_INPUT: BoardPrepInput = {
  audience: "board",
  constraints: {
    currency: "BRL",
    language: "pt-BR",
    maxRecommendations: 3
  },
  period: {
    endDate: "2026-03-31",
    startDate: "2026-03-01"
  },
  requestId: "req-boardprep-unit-001",
  sections: ["kpis", "risks", "capital_allocation"],
  tenantId: "tenant_exec_demo"
};

void test("BoardPrep AI returns a successful executive brief on happy path", async () => {
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

  const result = await agent.run(VALID_INPUT);

  assert.equal(result.status, "success");
  assert.equal(result.fallback.applied, false);
  assert.ok(result.executiveBrief.kpiHighlights.length >= 3);
  assert.ok(result.observability.metrics.toolCalls >= 3);
  assert.ok(
    result.observability.events.some(
      (event: BoardPrepEvent) => event.name === "boardprep.response.generated"
    )
  );
});

void test("BoardPrep AI loads canonical package contract by default", async () => {
  const agent = new BoardPrepAIAgent({
    sleep: async () => undefined
  });

  const result = await agent.run(VALID_INPUT);
  const contractLoadedEvent = result.observability.events.find(
    (event: BoardPrepEvent) => event.name === "boardprep.contract.loaded"
  );

  assert.equal(contractLoadedEvent?.details.source, "file");
});

void test("BoardPrep AI returns hard-fail output when contract mode is hard_fail", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "boardprep-contract-"));
  const contractPath = path.join(tempDir, "contract.yaml");
  const customContract = {
    ...DEFAULT_BOARDPREP_CONTRACT,
    failureMode: "hard_fail",
    retry: {
      baseDelayMs: 1,
      maxAttempts: 2
    }
  };

  await writeFile(contractPath, JSON.stringify(customContract, null, 2), "utf8");

  const failingAdapters: BoardPrepToolAdapters = {
    async fetchBoardReportTemplate() {
      throw new Error("board template unavailable");
    },
    async fetchBudgetForecast() {
      throw new Error("budget forecast unavailable");
    },
    async fetchKpiDashboard() {
      throw new Error("kpi dashboard unavailable");
    }
  };

  try {
    const agent = new BoardPrepAIAgent({
      contractPath,
      sleep: async () => undefined,
      toolAdapters: failingAdapters
    });
    const result = await agent.run(VALID_INPUT);

    assert.equal(result.status, "error");
    assert.equal(result.fallback.applied, true);
    assert.equal(result.fallback.mode, "hard_fail");
    assert.ok(result.fallback.reasons.length >= 3);
    assert.ok(result.observability.metrics.retries >= 3);
    assert.ok(
      result.observability.events.some(
        (event: BoardPrepEvent) => event.name === "boardprep.fallback.applied"
      )
    );
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
});
