import test from "node:test";
import assert from "node:assert/strict";
import { createSessionToken, verifySessionToken } from "../lib/auth/session-token.ts";

test("creates and validates signed session token", async () => {
  process.env.DASHBOARD_SESSION_SECRET = "test-secret";

  const token = await createSessionToken({
    sub: "user-1",
    email: "user@example.com",
    role: "admin",
  });

  const session = await verifySessionToken(token);
  assert.deepEqual(session, {
    sub: "user-1",
    email: "user@example.com",
    role: "admin",
  });
});

test("returns null when token is invalid", async () => {
  process.env.DASHBOARD_SESSION_SECRET = "test-secret";
  const session = await verifySessionToken("invalid-token");
  assert.equal(session, null);
});
