import assert from "node:assert/strict";
import test from "node:test";

import { buildDbReadQueryTemplate } from "./runtime.tools.js";

void test("buildDbReadQueryTemplate removes the synthetic tenant param when the query does not reference it", () => {
  const template = buildDbReadQueryTemplate(
    "SELECT id FROM workflows WHERE status = $1\n-- tenant_scope: tenant_1",
    ["PUBLISHED", "tenant_1"],
    "tenant_1"
  );

  assert.deepEqual(template.strings, ["SELECT id FROM workflows WHERE status = ", ""]);
  assert.deepEqual(template.values, ["PUBLISHED"]);
});

void test("buildDbReadQueryTemplate keeps the tenant param when the query references it explicitly", () => {
  const template = buildDbReadQueryTemplate(
    'SELECT id FROM workflows WHERE status = $1 AND "tenantId" = $2\n-- tenant_scope: tenant_1',
    ["PUBLISHED", "tenant_1"],
    "tenant_1"
  );

  assert.deepEqual(template.strings, [
    "SELECT id FROM workflows WHERE status = ",
    ' AND "tenantId" = ',
    ""
  ]);
  assert.deepEqual(template.values, ["PUBLISHED", "tenant_1"]);
});

void test("buildDbReadQueryTemplate rejects sparse placeholders", () => {
  assert.throws(
    () =>
      buildDbReadQueryTemplate(
        "SELECT id FROM workflows WHERE id = $2\n-- tenant_scope: tenant_1",
        ["wf_1", "tenant_1"],
        "tenant_1"
      ),
    /contiguous and start at \$1/i
  );
});
