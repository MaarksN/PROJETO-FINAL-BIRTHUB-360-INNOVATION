import test from "node:test";
import assert from "node:assert/strict";

import { loadManifestCatalog } from "@birthub/agents-core";

void test("corporate-v1 possui manifests carregaveis", async () => {
  const catalog = await loadManifestCatalog(new URL("..", import.meta.url).pathname);
  assert.ok(catalog.length >= 12);
});
