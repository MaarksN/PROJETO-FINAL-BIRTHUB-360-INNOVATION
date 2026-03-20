// [SOURCE] CI-TS-004
import test from "node:test";
import assert from "node:assert/strict";
import { requireApiAuth } from "../pages/api/_utils/auth";
import { SignJWT } from "jose";

test("security: requireApiAuth should fail if DASHBOARD_JWT_SECRET is missing", async () => {
  // Clear the environment variable to ensure we are testing the fix
  const originalSecret = process.env.DASHBOARD_JWT_SECRET;
  delete process.env.DASHBOARD_JWT_SECRET;

  try {
    const secret = new TextEncoder().encode("any-secret");
    const token = await new SignJWT({ tenantId: "test-tenant" })
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as any;

    await assert.rejects(
      async () => {
        await requireApiAuth(req);
      },
      { message: "DASHBOARD_JWT_SECRET is not defined" }
    );
  } finally {
    // Restore the environment variable
    if (originalSecret !== undefined) {
      process.env.DASHBOARD_JWT_SECRET = originalSecret;
    }
  }
});

test("security: requireApiAuth should succeed with correct DASHBOARD_JWT_SECRET", async () => {
  const originalSecret = process.env.DASHBOARD_JWT_SECRET;
  const testSecret = "test-jwt-secret-12345678";
  process.env.DASHBOARD_JWT_SECRET = testSecret;

  try {
    const secret = new TextEncoder().encode(testSecret);
    const token = await new SignJWT({ tenantId: "test-tenant" })
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    } as any;

    const result = await requireApiAuth(req);
    const profile = result.profile as { tenantId?: string };
    assert.equal(profile.tenantId, "test-tenant");
  } finally {
    if (originalSecret !== undefined) {
      process.env.DASHBOARD_JWT_SECRET = originalSecret;
    } else {
      delete process.env.DASHBOARD_JWT_SECRET;
    }
  }
});
