import assert from "node:assert/strict";
import test from "node:test";

import {
  ConsentPurpose,
  ConsentSource,
  ConsentStatus,
  prisma
} from "@birthub/database";

import {
  ensurePrivacyConsents,
  savePrivacyConsentDecisions
} from "../src/modules/privacy/consent.service.js";

function stubMethod(target: Record<string, unknown>, key: string, value: unknown): () => void {
  const original = target[key];
  target[key] = value;
  return () => {
    target[key] = original;
  };
}

type PrivacyConsentUpsertCall = Record<string, unknown> & {
  create?: {
    purpose?: ConsentPurpose;
  };
};

void test("ensurePrivacyConsents initializes the canonical consent purposes", async () => {
  const organization = {
    id: "org_alpha",
    tenantId: "tenant_alpha"
  };
  const upsertCalls: PrivacyConsentUpsertCall[] = [];
  const restores = [
    stubMethod(prisma.organization as unknown as Record<string, unknown>, "findFirst", () =>
      Promise.resolve(organization)
    ),
    stubMethod(
      prisma.privacyConsent as unknown as Record<string, unknown>,
      "upsert",
      (args: PrivacyConsentUpsertCall) => {
      upsertCalls.push(args);
      return Promise.resolve({});
      }
    ),
    stubMethod(prisma as unknown as Record<string, unknown>, "$transaction", (input: unknown) =>
      Array.isArray(input) ? Promise.all(input) : Promise.resolve(input)
    )
  ];

  try {
    const result = await ensurePrivacyConsents({
      organizationReference: organization.id,
      userId: "user_alpha"
    });

    assert.deepEqual(result, organization);
    assert.equal(upsertCalls.length, 3);
    assert.deepEqual(
      upsertCalls.map((call) => call.create?.purpose),
      [
        ConsentPurpose.ANALYTICS,
        ConsentPurpose.MARKETING,
        ConsentPurpose.HEALTH_DATA_SHARING
      ]
    );
  } finally {
    restores.reverse().forEach((restore) => restore());
  }
});

void test("savePrivacyConsentDecisions bounds the consent snapshot read for LGPD recompute", async () => {
  const organization = {
    id: "org_alpha",
    tenantId: "tenant_alpha"
  };
  const consentSnapshotCalls: Array<Record<string, unknown>> = [];
  const transactionClient = {
    auditLog: {
      create: () => Promise.resolve({})
    },
    privacyConsent: {
      findMany: (args: Record<string, unknown>) => {
        consentSnapshotCalls.push(args);
        return Promise.resolve([
          {
            purpose: ConsentPurpose.ANALYTICS,
            status: ConsentStatus.GRANTED
          },
          {
            purpose: ConsentPurpose.MARKETING,
            status: ConsentStatus.PENDING
          },
          {
            purpose: ConsentPurpose.HEALTH_DATA_SHARING,
            status: ConsentStatus.PENDING
          }
        ]);
      },
      findUnique: () =>
        Promise.resolve({
          grantedAt: null,
          id: "consent_analytics",
          source: ConsentSource.SETTINGS,
          status: ConsentStatus.PENDING
        }),
      update: () =>
        Promise.resolve({
          id: "consent_analytics",
          purpose: ConsentPurpose.ANALYTICS,
          source: ConsentSource.SETTINGS,
          status: ConsentStatus.GRANTED
        })
    },
    privacyConsentEvent: {
      create: () => Promise.resolve({})
    },
    userPreference: {
      findUnique: () => Promise.resolve(null),
      upsert: () => Promise.resolve({})
    }
  };
  const restores = [
    stubMethod(prisma.organization as unknown as Record<string, unknown>, "findFirst", () =>
      Promise.resolve(organization)
    ),
    stubMethod(prisma.privacyConsent as unknown as Record<string, unknown>, "upsert", () =>
      Promise.resolve({})
    ),
    stubMethod(prisma as unknown as Record<string, unknown>, "$transaction", (input: unknown) => {
      if (typeof input === "function") {
        return input(transactionClient);
      }

      return Array.isArray(input) ? Promise.all(input) : Promise.resolve(input);
    })
  ];

  try {
    const result = await savePrivacyConsentDecisions({
      decisions: [
        {
          purpose: ConsentPurpose.ANALYTICS,
          source: ConsentSource.SETTINGS,
          status: ConsentStatus.GRANTED
        }
      ],
      organizationReference: organization.id,
      userId: "user_alpha"
    });

    assert.equal(result.length, 1);
    assert.equal(consentSnapshotCalls.length, 1);
    assert.equal(consentSnapshotCalls[0]?.take, 3);
    assert.deepEqual(consentSnapshotCalls[0]?.orderBy, {
      purpose: "asc"
    });
  } finally {
    restores.reverse().forEach((restore) => restore());
  }
});
