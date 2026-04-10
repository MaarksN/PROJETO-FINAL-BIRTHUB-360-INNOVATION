// @ts-nocheck
import assert from "node:assert/strict";
import test from "node:test";

import {
  RetentionAction,
  RetentionDataCategory,
  RetentionExecutionMode,
  Role,
  prisma
} from "@birthub/database";
import request from "supertest";

import { createPrivacyRouter } from "../src/modules/privacy/router.js";
import {
  createAuthenticatedApiTestApp,
  stubMethod
} from "./http-test-helpers.js";
import { createTestApiConfig } from "./test-config.js";

function createPrivacyTestApp() {
  return createAuthenticatedApiTestApp({
    contextOverrides: {
      role: Role.OWNER
    },
    mountPath: "/api/v1/privacy",
    router: createPrivacyRouter(createTestApiConfig())
  });
}

void test("privacy router runs retention with dry-run as the default execution mode", async () => {
  const organizationLookups: unknown[] = [];
  const policyUpserts: unknown[] = [];
  let receivedPolicyLookup: unknown = null;
  let receivedOutputArtifactCount: unknown = null;
  let receivedExecutionCreate: unknown = null;
  let receivedAuditLogCreate: unknown = null;
  const restores = [
    stubMethod(prisma.organization, "findFirst", (args: unknown) => {
      organizationLookups.push(args);
      return Promise.resolve({
        id: "org_1",
        tenantId: "tenant_1"
      });
    }),
    stubMethod(prisma.dataRetentionPolicy, "upsert", (args: unknown) => {
      policyUpserts.push(args);
      return Promise.resolve({});
    }),
    stubMethod(prisma.dataRetentionPolicy, "findMany", (args: unknown) => {
      receivedPolicyLookup = args;
      return Promise.resolve([
        {
          action: RetentionAction.ANONYMIZE,
          dataCategory: RetentionDataCategory.OUTPUT_ARTIFACTS,
          id: "policy_1",
          retentionDays: 30
        }
      ]);
    }),
    stubMethod(prisma.outputArtifact, "count", (args: unknown) => {
      receivedOutputArtifactCount = args;
      return Promise.resolve(4);
    }),
    stubMethod(prisma.dataRetentionExecution, "create", (args: unknown) => {
      receivedExecutionCreate = args;
      return Promise.resolve({
        id: "ret_exec_1"
      });
    }),
    stubMethod(prisma.auditLog, "create", (args: unknown) => {
      receivedAuditLogCreate = args;
      return Promise.resolve({});
    }),
    stubMethod(prisma, "$transaction", (input: unknown) => {
      if (Array.isArray(input)) {
        return Promise.all(input);
      }

      throw new Error("UNEXPECTED_TRANSACTION_SHAPE");
    })
  ];

  try {
    const response = await request(createPrivacyTestApp())
      .post("/api/v1/privacy/retention/run")
      .send({})
      .expect(200);

    assert.equal(organizationLookups.length, 2);
    assert.deepEqual(organizationLookups[0], {
      where: {
        OR: [{ id: "org_1" }, { tenantId: "org_1" }]
      }
    });
    assert.deepEqual(organizationLookups[1], {
      where: {
        OR: [{ id: "org_1" }, { tenantId: "org_1" }]
      }
    });
    assert.equal(policyUpserts.length > 0, true);
    assert.deepEqual(receivedPolicyLookup, {
      orderBy: {
        id: "asc"
      },
      take: 25,
      where: {
        enabled: true,
        organizationId: "org_1"
      }
    });
    assert.equal(receivedOutputArtifactCount.where.organizationId, "org_1");
    assert.ok(receivedOutputArtifactCount.where.createdAt.lt instanceof Date);
    assert.deepEqual(receivedExecutionCreate, {
      data: {
        action: RetentionAction.ANONYMIZE,
        affectedCount: 0,
        dataCategory: RetentionDataCategory.OUTPUT_ARTIFACTS,
        mode: RetentionExecutionMode.DRY_RUN,
        organizationId: "org_1",
        policyId: "policy_1",
        scannedCount: 4,
        tenantId: "tenant_1"
      }
    });
    assert.deepEqual(receivedAuditLogCreate, {
      data: {
        action: "privacy.retention.executed",
        diff: {
          after: {
            action: RetentionAction.ANONYMIZE,
            affectedCount: 0,
            dataCategory: RetentionDataCategory.OUTPUT_ARTIFACTS,
            mode: RetentionExecutionMode.DRY_RUN,
            scannedCount: 4
          },
          before: {}
        },
        entityId: "ret_exec_1",
        entityType: "data_retention_execution",
        tenantId: "tenant_1"
      }
    });
    assert.deepEqual(response.body, {
      items: [
        {
          affectedCount: 0,
          dataCategory: RetentionDataCategory.OUTPUT_ARTIFACTS,
          executionId: "ret_exec_1",
          scannedCount: 4
        }
      ],
      requestId: "req_1"
    });
  } finally {
    for (const restore of restores.reverse()) {
      restore();
    }
  }
});

void test("privacy router returns not found when retention is requested for an unknown organization", async () => {
  const restore = stubMethod(prisma.organization, "findFirst", () => Promise.resolve(null));

  try {
    const response = await request(createPrivacyTestApp())
      .post("/api/v1/privacy/retention/run")
      .send({})
      .expect(404);

    assert.equal(response.body.status, 404);
    assert.equal(response.body.title, "Not Found");
  } finally {
    restore();
  }
});

void test("privacy router rejects retention payloads with an invalid execution mode", async () => {
  const response = await request(createPrivacyTestApp())
    .post("/api/v1/privacy/retention/run")
    .send({
      mode: "INVALID_MODE"
    })
    .expect(400);

  assert.equal(response.body.status, 400);
  assert.equal(response.body.title, "Bad Request");
});
