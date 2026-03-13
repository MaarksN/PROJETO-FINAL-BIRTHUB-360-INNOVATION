import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { loadManifestCatalog, parseAgentManifest } from "@birthub/agents-core";

void test("all catalog manifests pass schema validation", async () => {
  const catalogRoot = path.join(process.cwd(), "packages", "agent-packs");
  const catalog = await loadManifestCatalog(catalogRoot);

  assert.ok(catalog.length >= 12, "Expected at least 12 manifests in catalog");

  for (const entry of catalog) {
    const parsed = parseAgentManifest(entry.manifest);
    assert.ok(parsed.tags.domain.length > 0);
    assert.ok(parsed.tags.level.length > 0);
    assert.ok(parsed.tags.persona.length > 0);
    assert.ok(parsed.tags["use-case"].length > 0);
    assert.ok(parsed.tags.industry.length > 0);
  }
});
