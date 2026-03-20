// [SOURCE] apps/dashboard/README.md — AE
import test from "node:test";
import assert from "node:assert/strict";
import { calculateRoi, generateProposal, type ProposalInput } from "../lib/ae.ts";

test("AE: proposal generator should include key business sections", () => {
  const input: ProposalInput = {
    accountName: "Conta XPTO",
    businessGoal: "Aumentar win-rate em 10%",
    offerSummary: "Squad RevOps + automações",
    implementationWindow: "60 dias"
  };

  const output = generateProposal(input);

  assert.match(output, /Conta XPTO/);
  assert.match(output, /Aumentar win-rate em 10%/);
  assert.match(output, /60 dias/);
});

test("AE: ROI calculator should return deterministic result", () => {
  const result = calculateRoi({
    monthlyInvestment: 20000,
    expectedMonthlyRevenueLift: 36000,
    monthlyCostReduction: 4000
  });

  assert.equal(result.netMonthlyGain, 20000);
  assert.equal(result.roiPercent, 100);
  assert.equal(result.paybackMonths, 1);
});
