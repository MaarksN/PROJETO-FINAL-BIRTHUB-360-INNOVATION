// [SOURCE] Checklist-Session-Security.md - GAP-SEC-001
import assert from "node:assert/strict";
import test from "node:test";

import { prisma, Role, UserStatus } from "@birthub/database";
import request from "supertest";

import { createApp } from "../src/app.js";
import { authenticateRequest, createSession, verifyMfaChallenge } from "../src/modules/auth/auth.service.js";
import { encryptTotpSecret, generateCurrentTotp, generateTotpSecret } from "../src/modules/auth/mfa.service.js";
import { sha256 } from "../src/modules/auth/crypto.js";
import { createTestApiConfig } from "./test-config.js";

function stubMethod(target: object, key: string, value: unknown): () => void {
  const original = Reflect.get(target, key);
  Reflect.set(target, key, value);
  return () => {
    Reflect.set(target, key, original);
  };
}

function createAuthTestApp() {
  return createApp({
    config: createTestApiConfig(),
    healthService: async () => ({
      checkedAt: new Date("2026-03-13T00:00:00.000Z").toISOString(),
      services: {
        database: { status: "up" as const },
        externalDependencies: [],
        redis: { status: "up" as const }
      },
      status: "ok" as const
    }),
    shouldExposeDocs: false
  });
}

void test("auth login returns 200 and creates a session", async () => {
  const restores = [
    stubMethod(prisma.organization, "findFirst", async () => ({ id: "org_1", tenantId: "tenant_1" })),
    stubMethod(prisma.membership, "findFirst", async () => ({
      organizationId: "org_1",
      role: "OWNER",
      tenantId: "tenant_1",
      user: {
        email: "owner@birthub.local",
        id: "user_1",
        mfaEnabled: false,
        passwordHash: sha256("password123"),
        status: UserStatus.ACTIVE
      },
      userId: "user_1"
    })),
    stubMethod(prisma.user, "update", async () => ({ id: "user_1" })),
    stubMethod(prisma.session, "findFirst", async () => null),
    stubMethod(prisma.session, "create", async () => ({
      id: "session_1"
    })),
    stubMethod(prisma.session, "findMany", async () => [{ id: "session_1" }]),
    stubMethod(prisma.session, "updateMany", async () => ({ count: 0 }))
  ];

  try {
    const app = createAuthTestApp();
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "owner@birthub.local",
        password: "password123",
        tenantId: "birthhub-alpha"
      })
      .expect(200);

    assert.equal(response.body.mfaRequired, false);
    assert.equal(response.body.session.userId, "user_1");
    assert.equal(response.body.session.tenantId, "tenant_1");
  } finally {
    for (const restore of restores.reverse()) {
      restore();
    }
  }
});

void test("createSession generates session id with 16-byte hex entropy", async () => {
  const config = createTestApiConfig();
  let capturedSessionId: string | null = null;

  const restores = [
    stubMethod(prisma.session, "create", async (args: { data?: { id?: unknown } }) => {
      const sessionId = args.data?.id;

      if (typeof sessionId !== "string") {
        throw new Error("MISSING_SESSION_ID");
      }

      capturedSessionId = sessionId;
      return { id: sessionId };
    })
  ];

  try {
    const created = await createSession({
      config,
      ipAddress: "127.0.0.1",
      organizationId: "org_1",
      tenantId: "tenant_1",
      userAgent: "auth-test",
      userId: "user_1"
    });

    assert.match(created.sessionId, /^[a-f0-9]{32}$/);
    assert.equal(created.sessionId.length, 32);
    assert.equal(capturedSessionId, created.sessionId);
  } finally {
    for (const restore of restores.reverse()) {
      restore();
    }
  }
});

void test("auth login with MFA enabled returns challenge token", async () => {
  const restores = [
    stubMethod(prisma.organization, "findFirst", async () => ({ id: "org_1", tenantId: "tenant_1" })),
    stubMethod(prisma.membership, "findFirst", async () => ({
      organizationId: "org_1",
      role: "OWNER",
      tenantId: "tenant_1",
      user: {
        email: "owner@birthub.local",
        id: "user_1",
        mfaEnabled: true,
        passwordHash: sha256("password123"),
        status: UserStatus.ACTIVE
      },
      userId: "user_1"
    })),
    stubMethod(prisma.user, "update", async () => ({ id: "user_1" })),
    stubMethod(prisma.session, "findFirst", async () => null),
    stubMethod(prisma.mfaChallenge, "create", async () => ({ id: "challenge_1" }))
  ];

  try {
    const app = createAuthTestApp();
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "owner@birthub.local",
        password: "password123",
        tenantId: "birthhub-alpha"
      })
      .expect(200);

    assert.equal(response.body.mfaRequired, true);
    assert.equal(typeof response.body.challengeToken, "string");
  } finally {
    for (const restore of restores.reverse()) {
      restore();
    }
  }
});

void test("auth MFA challenge verification accepts valid TOTP", async () => {
  const config = createTestApiConfig();
  const secret = generateTotpSecret();
  const encrypted = encryptTotpSecret(secret, config.AUTH_MFA_ENCRYPTION_KEY);
  const validTotp = generateCurrentTotp(secret);

  const restores = [
    stubMethod(prisma.mfaChallenge, "findUnique", async () => ({
      consumedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      id: "challenge_1",
      organizationId: "org_1",
      tenantId: "tenant_1",
      userId: "user_1"
    })),
    stubMethod(prisma.user, "findUnique", async () => ({
      id: "user_1",
      mfaSecret: encrypted
    })),
    stubMethod(prisma.mfaChallenge, "updateMany", async () => ({ count: 1 })),
    stubMethod(prisma.membership, "findUnique", async () => ({ role: Role.OWNER })),
    stubMethod(prisma.session, "create", async () => ({ id: "session_2" })),
    stubMethod(prisma.session, "findMany", async () => [{ id: "session_2" }]),
    stubMethod(prisma.session, "updateMany", async () => ({ count: 0 }))
  ];

  try {
    const app = createApp({
      config,
      shouldExposeDocs: false
    });

    const response = await request(app)
      .post("/api/v1/auth/mfa/challenge")
      .send({
        challengeToken: "mfa_token_for_test",
        totpCode: validTotp
      })
      .expect(200);

    assert.equal(response.body.mfaRequired, false);
    assert.equal(response.body.session.userId, "user_1");
    assert.equal(response.body.session.tenantId, "tenant_1");
  } finally {
    for (const restore of restores.reverse()) {
      restore();
    }
  }
});

void test("verifyMfaChallenge rejects MFA challenge token reuse after first success", async () => {
  const config = createTestApiConfig();
  const secret = generateTotpSecret();
  const encrypted = encryptTotpSecret(secret, config.AUTH_MFA_ENCRYPTION_KEY);
  const validTotp = generateCurrentTotp(secret);
  let consumeCount = 0;

  const restores = [
    stubMethod(prisma.mfaChallenge, "findUnique", async () => ({
      consumedAt: null,
      expiresAt: new Date(Date.now() + 60_000),
      id: "challenge_1",
      organizationId: "org_1",
      tenantId: "tenant_1",
      userId: "user_1"
    })),
    stubMethod(prisma.user, "findUnique", async () => ({
      id: "user_1",
      mfaSecret: encrypted
    })),
    stubMethod(prisma.mfaChallenge, "updateMany", async () => {
      consumeCount += 1;
      return { count: consumeCount === 1 ? 1 : 0 };
    }),
    stubMethod(prisma.membership, "findUnique", async () => ({ role: Role.OWNER })),
    stubMethod(prisma.session, "create", async () => ({ id: "session_2" })),
    stubMethod(prisma.session, "findMany", async () => [{ id: "session_2" }]),
    stubMethod(prisma.session, "updateMany", async () => ({ count: 0 }))
  ];

  try {
    await verifyMfaChallenge({
      challengeToken: "mfa_token_for_test",
      config,
      ipAddress: null,
      totpCode: validTotp,
      userAgent: "auth-test"
    });

    await assert.rejects(
      () =>
        verifyMfaChallenge({
          challengeToken: "mfa_token_for_test",
          config,
          ipAddress: null,
          totpCode: validTotp,
          userAgent: "auth-test"
        }),
      (error: unknown) => error instanceof Error && error.message === "MFA_CODE_ALREADY_USED"
    );
  } finally {
    for (const restore of restores.reverse()) {
      restore();
    }
  }
});

void test("auth logout returns 200 for a valid session token", async () => {
  const expiresAt = new Date(Date.now() + 60_000);
  const sessionToken = "atk_valid";

  const restores = [
    stubMethod(prisma.session, "findUnique", async () => ({
      expiresAt,
      id: "session_1",
      organizationId: "org_1",
      tenantId: "tenant_1",
      revokedAt: null,
      userId: "user_1"
    })),
    stubMethod(prisma.user, "findUnique", async () => ({
      id: "user_1",
      status: UserStatus.ACTIVE
    })),
    stubMethod(prisma.session, "update", async () => ({ id: "session_1" }))
  ];

  try {
    const app = createAuthTestApp();
    const response = await request(app)
      .post("/api/v1/auth/logout")
      .set("Authorization", `Bearer ${sessionToken}`)
      .set("x-csrf-token", "csrf_1")
      .set("Cookie", ["bh360_csrf=csrf_1"])
      .expect(200);

    assert.equal(response.body.revokedSessions, 1);
  } finally {
    for (const restore of restores.reverse()) {
      restore();
    }
  }
});

void test("auth protected endpoint returns 401 for expired or invalid session tokens", async () => {
  const app = createAuthTestApp();

  let restore = stubMethod(prisma.session, "findUnique", async () => ({
    expiresAt: new Date(Date.now() - 60_000),
    id: "session_expired",
    organizationId: "org_1",
    tenantId: "tenant_1",
    revokedAt: null,
    userId: "user_1"
  }));

  await request(app).get("/api/v1/sessions").set("Authorization", "Bearer atk_expired").expect(401);
  restore();

  restore = stubMethod(prisma.session, "findUnique", async () => null);
  await request(app).get("/api/v1/sessions").set("Authorization", "Bearer atk_invalid").expect(401);
  restore();
});

void test("createSession enforces concurrent session limit for privileged roles", async () => {
  const config = createTestApiConfig();
  const revokedPayloads: unknown[] = [];

  const restores = [
    stubMethod(prisma.session, "create", async () => ({ id: "session_new" })),
    stubMethod(
      prisma.session,
      "findMany",
      async () => [{ id: "session_new" }, { id: "session_old_1" }, { id: "session_old_2" }]
    ),
    stubMethod(prisma.session, "updateMany", async (args: unknown) => {
      revokedPayloads.push(args);
      return { count: 2 };
    })
  ];

  try {
    await createSession({
      config,
      ipAddress: "127.0.0.1",
      organizationId: "org_1",
      role: Role.ADMIN,
      tenantId: "tenant_1",
      userAgent: "auth-test",
      userId: "user_1"
    });

    assert.equal(revokedPayloads.length, 1);
  } finally {
    for (const restore of restores.reverse()) {
      restore();
    }
  }
});

void test("authenticateRequest rejects idle-expired session", async () => {
  const restores = [
    stubMethod(prisma.session, "findUnique", async () => ({
      expiresAt: new Date(Date.now() + 60_000),
      id: "session_idle_expired",
      lastActivityAt: new Date(Date.now() - 31 * 60_000),
      organizationId: "org_1",
      refreshExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      revokedAt: null,
      tenantId: "tenant_1",
      userId: "user_1"
    }))
  ];

  try {
    const authenticated = await authenticateRequest({
      config: { API_AUTH_IDLE_TIMEOUT_MINUTES: 30 },
      sessionToken: "atk_idle_expired"
    });
    assert.equal(authenticated, null);
  } finally {
    for (const restore of restores.reverse()) {
      restore();
    }
  }
});
