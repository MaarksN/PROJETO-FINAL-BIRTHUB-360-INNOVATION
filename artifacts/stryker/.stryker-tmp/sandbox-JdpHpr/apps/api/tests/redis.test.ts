// @ts-nocheck
// 
import assert from "node:assert/strict";
import test from "node:test";

import { getBullConnection } from "../src/lib/redis.js";

void test("getBullConnection derives Redis connection details with timeout and TLS metadata", () => {
  const connection = getBullConnection("rediss://user:secret@cache.birthhub360.com:6380/4?tls=true");
  const rawConnection = connection as Record<string, unknown>;

  assert.equal(rawConnection.host, "cache.birthhub360.com");
  assert.equal(rawConnection.port, 6380);
  assert.equal(rawConnection.db, 4);
  assert.equal(rawConnection.username, "user");
  assert.equal(rawConnection.password, "secret");
  assert.equal(rawConnection.connectTimeout, 5_000);
  assert.equal(rawConnection.enableOfflineQueue, false);
  assert.deepEqual(rawConnection.tls, {});
});

void test("getBullConnection reuses the cached connection object per Redis URL", () => {
  const first = getBullConnection("redis://cache.birthhub360.com:6379/0");
  const second = getBullConnection("redis://cache.birthhub360.com:6379/0");

  assert.equal(first, second);
});
