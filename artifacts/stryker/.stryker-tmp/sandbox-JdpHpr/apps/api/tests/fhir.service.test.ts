// @ts-nocheck
// 
import assert from "node:assert/strict";
import test from "node:test";

import { prisma } from "@birthub/database";

import { fhirService } from "../src/modules/fhir/service.js";

function stubMethod(target: Record<string, unknown>, key: string, value: unknown): () => void {
  const original = target[key];
  target[key] = value;
  return () => {
    target[key] = original;
  };
}

void test("fhirService.searchPatients keeps the explicit patient search limit", async () => {
  const calls: Array<Record<string, unknown>> = [];
  const restore = stubMethod(prisma.patient as unknown as Record<string, unknown>, "findMany", (args: Record<string, unknown>) => {
    calls.push(args);
    return Promise.resolve([]);
  });

  try {
    const bundle = await fhirService.searchPatients(
      {
        organizationId: "org_clinic",
        tenantId: "tenant_clinic",
        userId: "user_clinic"
      },
      {
        identifier: "MRN-001"
      },
      "https://example.test/api/fhir/R4"
    );

    assert.equal(calls.length, 1);
    assert.equal(calls[0]?.take, 25);
    assert.equal(bundle.resourceType, "Bundle");
    assert.equal(bundle.type, "searchset");
  } finally {
    restore();
  }
});
