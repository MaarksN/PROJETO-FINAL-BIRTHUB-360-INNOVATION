// [SOURCE] apps/dashboard/README.md — AE (compatibilidade com closer)
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

test("Sales OS: closer module identifiers should remain declared in constants", () => {
  const constantsPath = resolve(process.cwd(), "lib/sales-os/constants.ts");
  const content = readFileSync(constantsPath, "utf8");

  assert.match(content, /id:\s*'closer_warroom'/);
  assert.match(content, /id:\s*'roleplay_cfo'/);
  assert.match(content, /id:\s*'close_email'/);
});
