import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { loadManifestCatalog, runAgentDryRun } from "@birthub/agents-core";

void test("dry-run smoke execution works for every manifest", async () => {
  const catalogRoot = path.join(process.cwd(), "packages", "agent-packs");
  const catalog = await loadManifestCatalog(catalogRoot);

  for (const entry of catalog) {
    const result = await runAgentDryRun(entry.manifest);

    assert.ok(result.logs.some((log) => log.includes("Simulating LLM call")));
    assert.ok(result.outputHash.length === 64);
  }
});
