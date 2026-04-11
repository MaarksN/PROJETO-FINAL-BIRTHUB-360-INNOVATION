import assert from "node:assert/strict";
import test from "node:test";

import { isBffPathAllowed } from "../app/api/bff/policy";

void test("BFF allowlist covers critical same-origin routes and blocks unknown paths", () => {
  assert.equal(isBffPathAllowed("api/v1/admin/users"), true);
  assert.equal(isBffPathAllowed("api/v1/sessions"), true);
  assert.equal(isBffPathAllowed("api/v1/workflows"), true);
  assert.equal(isBffPathAllowed("api/v1/settings/webhooks"), false);
});
