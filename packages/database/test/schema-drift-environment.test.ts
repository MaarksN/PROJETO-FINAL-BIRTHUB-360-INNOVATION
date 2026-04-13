import assert from "node:assert/strict";
import test from "node:test";

import { getSchemaDriftEnvironment } from "../scripts/lib/env.js";

void test("schema drift environment trims configured URLs", () => {
  const environment = getSchemaDriftEnvironment({
    DATABASE_URL: "  postgresql://db.example/birthub  ",
    SHADOW_DATABASE_URL: "  postgresql://shadow.example/birthub  "
  });

  assert.deepEqual(environment, {
    databaseUrl: "postgresql://db.example/birthub",
    shadowDatabaseUrl: "postgresql://shadow.example/birthub"
  });
});

void test("schema drift environment treats blank URLs as undefined", () => {
  const environment = getSchemaDriftEnvironment({
    DATABASE_URL: "   ",
    SHADOW_DATABASE_URL: ""
  });

  assert.deepEqual(environment, {
    databaseUrl: undefined,
    shadowDatabaseUrl: undefined
  });
});
