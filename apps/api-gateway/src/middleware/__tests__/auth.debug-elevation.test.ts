// [SOURCE] BirthHub360 Remediacao Forense - S-001
import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";
import type { Response } from "express";
import type { AuthRequest } from "../auth.js";

test("authenticateToken ignora header X-Debug e nao eleva role para admin", async () => {
  const previousJwtSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "test-secret-for-debug-header";

  try {
    const { authenticateToken } = await import("../auth.js");
    const token = jwt.sign(
      { sub: "user-1", roles: ["sales"], scopes: ["leads:read"] },
      process.env.JWT_SECRET,
    );

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
        "x-debug": "1",
      },
    } as unknown as AuthRequest;
    const res = {} as Response;

    await new Promise<void>((resolve, reject) => {
      authenticateToken(req, res, (error?: unknown) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    assert.ok(Array.isArray(req.user?.roles), "roles should be present in authenticated request");
    assert.deepEqual(req.user?.roles, ["sales"]);
    assert.equal(req.user?.roles?.includes("admin"), false);
  } finally {
    if (previousJwtSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = previousJwtSecret;
    }
  }
});
