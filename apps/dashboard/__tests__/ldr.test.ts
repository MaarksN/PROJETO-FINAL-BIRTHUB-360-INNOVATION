// [SOURCE] apps/dashboard/README.md — LDR
import test from "node:test";
import assert from "node:assert/strict";
import { buildLeadScoringItems } from "../lib/ldr";
import type { AttributionItem } from "../lib/dashboard-types";

test("LDR: should build scored and enriched lead items from attribution", () => {
  const attribution: AttributionItem[] = [
    { source: "Outbound", leads: 80, conversion: "30%", cac: "R$ 500" },
    { source: "Inbound", leads: 25, conversion: "12%", cac: "R$ 1200" }
  ];

  const result = buildLeadScoringItems(attribution);

  assert.equal(result.length, 2);
  assert.equal(result[0]?.source, "Outbound");
  assert.ok(result[0]?.leadScore >= result[1]!.leadScore);
  assert.match(result[0]?.account ?? "", /Outbound Cluster 1/);
  assert.ok(["A", "B", "C"].includes(result[0]?.tier ?? ""));
});
