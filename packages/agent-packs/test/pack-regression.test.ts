import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { loadManifestCatalog, runAgentDryRun } from "@birthub/agents-core";

void test("pack regression: every manifest produces stable dry-run envelope", async () => {
  const catalogRoot = path.join(process.cwd(), "packages", "agent-packs");
  const catalog = await loadManifestCatalog(catalogRoot);

  for (const entry of catalog) {
    assert.ok(entry.manifest.agent.prompt.length >= 10);

    const result = await runAgentDryRun(entry.manifest);
    const output = JSON.parse(result.output) as { agentId: string; tools: string[] };

    assert.equal(output.agentId, entry.manifest.agent.id);
    assert.ok(output.tools.length >= 1);
  }
});
