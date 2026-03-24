import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { isInstallableManifest, loadManifestCatalog } from "@birthub/agents-core";

import compilerModule from "../../../scripts/agent/compile-github-agents.ts";
import helperModule from "../../../scripts/agent/github-agent-collection.ts";

const { compileGithubAgentsCollection } = compilerModule as {
  compileGithubAgentsCollection: typeof import("../../../scripts/agent/compile-github-agents.js").compileGithubAgentsCollection;
};
const { GITHUB_AGENT_COLLECTION_DESCRIPTOR_ID } = helperModule as {
  GITHUB_AGENT_COLLECTION_DESCRIPTOR_ID: string;
};

void test("github agents compiler builds a canonical manifest collection from .github/agents", async () => {
  const currentFile = fileURLToPath(import.meta.url);
  const packageRoot = path.resolve(path.dirname(currentFile), "..");
  const workspaceRoot = path.resolve(packageRoot, "..", "..");
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "github-agents-compiler-"));
  const collectionRoot = path.join(tempRoot, "github-agents-v1");

  try {
    const summary = await compileGithubAgentsCollection({
      outputRoot: collectionRoot,
      workspaceRoot
    });
    const catalog = await loadManifestCatalog(collectionRoot);
    const installableCatalog = catalog.filter((entry) => isInstallableManifest(entry.manifest));
    const descriptor = catalog.find((entry) => entry.manifest.agent.id === GITHUB_AGENT_COLLECTION_DESCRIPTOR_ID);
    const planner = catalog.find((entry) => entry.manifest.agent.id === "planner-github-pack");

    assert.ok(summary.sourceCount >= 300);
    assert.equal(summary.installableCount, summary.sourceCount);
    assert.equal(summary.totalCount, summary.installableCount + 1);
    assert.equal(catalog.length, summary.totalCount);
    assert.equal(installableCatalog.length, summary.installableCount);
    assert.ok(descriptor, "Expected compiled collection descriptor manifest.");
    assert.ok(planner, "Expected planner-github-pack to be compiled from .github/agents/planner.agent.md.");
    assert.match(planner.manifest.agent.prompt, /IDENTIDADE E MISSAO/);
    assert.match(planner.manifest.agent.prompt, /FORMATO DE SAIDA/);
  } finally {
    await rm(tempRoot, { force: true, recursive: true });
  }
});
