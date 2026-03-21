import test from "node:test";
import assert from "node:assert/strict";

process.env.JWT_SECRET = "test-secret-123";

const { authenticateToken } = await import("../auth.js");
import { HttpError } from "../../errors/http-error.js";

test("authenticateToken prevents debug elevation headers from granting internal roles", () => {
  const req = {
    headers: {
      "x-service-token": "wrong-internal-token",
      "x-debug": "true",
      "x-debug-elevation": "admin",
      "authorization": "Bearer invalid-jwt-for-test"
    }
  } as any;

  let errorThrown: any = null;

  // Mock next function to catch the error
  const next = (err?: any) => {
    errorThrown = err;
  };

  authenticateToken(req, {} as any, next);

  // Since it provided an invalid internal token and an invalid JWT, it should throw a 403 Invalid token or 401
  assert.ok(errorThrown instanceof HttpError, "Expected HttpError to be thrown");
  assert.equal(errorThrown.status, 403);

  // The crucial part: the request user object must NOT have been elevated
  assert.equal(req.user, undefined, "User object should not exist if authentication failed");
});
