import assert from "node:assert/strict";
import test from "node:test";
import { requireAuthorization } from "../authorization.js";
// [SOURCE] docs/Checklist-Session-Security.md — S-001 item

function createMockRes() {
  const state: { statusCode?: number; payload?: unknown } = {};
  return {
    status(code: number) {
      state.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      state.payload = payload;
      return this;
    },
    state,
  };
}

test("requireAuthorization permite quando scope e role atendem", () => {
  const middleware = requireAuthorization({ scopes: ["deals:write"], roles: ["admin"] });
  const req = { user: { scopes: ["deals:write"], roles: ["admin"] } };
  const res = createMockRes();
  let nextCalled = false;

  middleware(req as any, res as any, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
});

test("requireAuthorization bloqueia quando scope falta", () => {
  const middleware = requireAuthorization({ scopes: ["deals:write"] });
  const req = { user: { scopes: [], roles: ["admin"] } };
  const res = createMockRes();

  middleware(req as any, res as any, () => undefined);
  assert.equal(res.state.statusCode, 403);
});

test("X-Debug nao eleva privilegio para role admin", () => {
  const middleware = requireAuthorization({ roles: ["admin"] });
  const req = {
    headers: { "x-debug": "1" },
    user: { scopes: ["deals:read"], roles: ["sales"] },
  };
  const res = createMockRes();
  let nextCalled = false;

  middleware(req as any, res as any, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.state.statusCode, 403);
  assert.deepEqual(
    res.state.payload,
    {
      error: {
        code: "AUTH_ROLE_MISSING",
        message: "Insufficient role",
        details: { requiredRoles: ["admin"] },
      },
    },
  );
});
