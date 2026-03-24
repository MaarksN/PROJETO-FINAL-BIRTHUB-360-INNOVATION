import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import compilerModule from "../../../scripts/agent/compile-github-agents.ts";
import readinessModule from "../../../scripts/agent/check-github-agent-readiness.ts";

const { compileGithubAgentsCollection } = compilerModule as {
  compileGithubAgentsCollection: typeof import("../../../scripts/agent/compile-github-agents.js").compileGithubAgentsCollection;
};
const { verifyGithubAgentsReadiness } = readinessModule as {
  verifyGithubAgentsReadiness: typeof import("../../../scripts/agent/check-github-agent-readiness.js").verifyGithubAgentsReadiness;
};

void test("github agents readiness gate validates manifest, integration, policy, adapters and evidence", async () => {
  const currentFile = fileURLToPath(import.meta.url);
  const packageRoot = path.resolve(path.dirname(currentFile), "..");
  const workspaceRoot = path.resolve(packageRoot, "..", "..");
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "github-agents-readiness-"));
  const collectionRoot = path.join(tempRoot, "github-agents-v1");
  const reportRoot = path.join(tempRoot, "reports");

  try {
    const summary = await compileGithubAgentsCollection({
      outputRoot: collectionRoot,
      workspaceRoot
    });
    const report = await verifyGithubAgentsReadiness({
      collectionRoot,
      reportRoot,
      workspaceRoot
    });

    assert.equal(report.failures.length, 0, report.failures.map((failure) => failure.message).join("\n"));
    assert.equal(report.descriptor.found, true);
    assert.equal(report.installableCount, summary.installableCount);
    assert.equal(report.totalCount, summary.totalCount);
    assert.equal(report.passedCount, summary.installableCount);
    assert.ok(report.results.every((result) => Object.values(result.checks).every(Boolean)));
  } finally {
    await rm(tempRoot, { force: true, recursive: true });
  }
});
