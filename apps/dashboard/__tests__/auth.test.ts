// [SOURCE] CI-TS-004
import test from "node:test";
import assert from "node:assert/strict";

import { requireApiAuth } from "../pages/api/_utils/auth.ts";

test("security: requireApiAuth should fail when authorization and cookie are missing", async () => {
  const req = {
    headers: {}
  } as any;

  await assert.rejects(
    async () => {
      await requireApiAuth(req);
    },
    { message: "missing_authorization" }
  );
});

test("security: requireApiAuth should succeed when backend returns profile", async () => {
  const originalFetch = globalThis.fetch;
  let capturedAuthHeader: string | null = null;
  let capturedUrl = "";

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    capturedUrl = String(input);
    capturedAuthHeader = new Headers(init?.headers).get("authorization");

    return new Response(JSON.stringify({ tenantId: "test-tenant" }), {
      headers: { "content-type": "application/json" },
      status: 200
    });
  }) as typeof fetch;

  try {
    const req = {
      headers: {
        authorization: "Bearer test-token"
      }
    } as any;

    const result = await requireApiAuth(req);
    const profile = result.profile as { tenantId?: string };

    assert.equal(profile.tenantId, "test-tenant");
    assert.equal(capturedAuthHeader, "Bearer test-token");
    assert.equal(capturedUrl.endsWith("/api/v1/me"), true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
