import assert from "node:assert/strict";
import test from "node:test";

import { MANIFEST_VERSION } from "../manifest/schema.js";
import {
  buildAgentRuntimeOutput,
  buildAgentRuntimePlan,
  inferSegmentProfile,
  summarizeNumericSignals
} from "../runtime/index.js";

import type { AgentManifest } from "../manifest/schema.js";

const manifest: AgentManifest = {
  agent: {
    changelog: [] as string[],
    description: "Agent for runtime intelligence tests",
    id: "runtime-intelligence.demo",
    kind: "agent",
    name: "Runtime Intelligence Demo",
    prompt: "IDENTIDADE E MISSAO\nDemo",
    tenantId: "catalog",
    version: "1.0.0"
  },
  keywords: ["runtime", "intelligence", "demo", "planner", "reviewer", "segment", "memory", "handoff"],
  manifestVersion: MANIFEST_VERSION,
  policies: [
    {
      actions: ["tool:execute", "memory:read", "memory:write", "learning:read", "learning:write"],
      effect: "allow",
      id: "runtime-intelligence.demo.policy.standard",
      name: "Standard"
    }
  ],
  skills: [
    {
      description: "Diagnose segment-aware operational patterns",
      id: "runtime-intelligence.demo.skill.diagnose",
      inputSchema: { type: "object" },
      name: "Diagnose",
      outputSchema: { type: "object" }
    },
    {
      description: "Recommend next best action",
      id: "runtime-intelligence.demo.skill.recommend",
      inputSchema: { type: "object" },
      name: "Recommend",
      outputSchema: { type: "object" }
    }
  ],
  tags: {
    domain: ["finance", "operations"],
    industry: ["fintech"],
    level: ["specialist"],
    persona: ["analyst"],
    "use-case": ["forecasting", "multi-agent-execution"]
  },
  tools: [
    {
      description: "Process numbers and metrics",
      id: "runtime-intelligence.demo.tool.data-processor",
      inputSchema: { type: "object" },
      name: "Data Processor",
      outputSchema: { type: "object" },
      timeoutMs: 15000
    },
    {
      description: "Coordinate another agent handoff",
      id: "runtime-intelligence.demo.tool.agent-handoff",
      inputSchema: { type: "object" },
      name: "Agent Handoff",
      outputSchema: { type: "object" },
      timeoutMs: 15000
    }
  ]
};

void test("segment profile and numeric summary are inferred from runtime input", () => {
  const profile = inferSegmentProfile({
    companySize: "Mid Market",
    geography: "Brazil",
    industry: "Fintech",
    maturity: "Growth",
    segment: "B2B",
    values: [12, 16, 18]
  }, manifest.tags);
  const numericSummary = summarizeNumericSignals([12, 16, 18]);

  assert.equal(profile.industry, "fintech");
  assert.equal(profile.companySize, "mid-market");
  assert.equal(profile.geography, "brazil");
  assert.equal(profile.clientSegment, "b2b");
  assert.equal(numericSummary.trend, "up");
});

void test("runtime plan and output include segment adaptation, memory and handoff guidance", () => {
  const input = {
    companySize: "Mid Market",
    geography: "Brazil",
    industry: "Fintech",
    objective: "Protect renewal revenue",
    owner: "revops",
    segment: "Enterprise",
    values: [90, 95, 130],
    notes: ["renewal risk rising", "expansion opportunity detected"]
  };

  const plan = buildAgentRuntimePlan({
    input,
    manifest,
    sharedLearning: [
      {
        approved: true,
        appliesTo: [manifest.agent.id],
        confidence: 0.91,
        createdAt: new Date().toISOString(),
        evidence: ["historical renewal playbook"],
        id: "learn-1",
        keywords: ["renewal", "fintech", "enterprise"],
        lessonType: "execution-pattern",
        sourceAgentId: manifest.agent.id,
        summary: "Enterprise fintech renewals benefit from early escalation.",
        tenantId: "tenant-1"
      }
    ],
    tenantId: "tenant-1"
  });

  assert.equal(plan.toolCalls.length, 2);
  const firstCallInput = plan.toolCalls[0]?.input as { segmentProfile?: { industry?: string }; dataSummary?: { trend?: string } } | undefined;
  assert.equal(firstCallInput?.segmentProfile?.industry, "fintech");
  assert.equal(firstCallInput?.dataSummary?.trend, "up");

  const output = buildAgentRuntimeOutput({
    input,
    logs: plan.logs,
    manifest,
    plan,
    sharedLearning: [
      {
        approved: true,
        appliesTo: [manifest.agent.id],
        confidence: 0.91,
        createdAt: new Date().toISOString(),
        evidence: ["historical renewal playbook"],
        id: "learn-1",
        keywords: ["renewal", "fintech", "enterprise"],
        lessonType: "execution-pattern",
        sourceAgentId: manifest.agent.id,
        summary: "Enterprise fintech renewals benefit from early escalation.",
        tenantId: "tenant-1"
      }
    ],
    steps: [
      {
        call: {
          input: plan.toolCalls[0]?.input ?? {},
          tool: manifest.tools[0]!.id
        },
        finishedAt: new Date().toISOString(),
        output: {
          evidence: ["renewal cohort drift"],
          numericSummary: {
            average: 105,
            count: 3,
            outlierCount: 1,
            trend: "up"
          }
        },
        startedAt: new Date().toISOString()
      }
    ]
  });

  assert.equal(output.agent_id, manifest.agent.id);
  assert.equal(output.segment_profile.industry, "fintech");
  assert.equal(output.memory_writeback.ttlHours, 24 * 30);
  assert.equal(output.specialist_deliverables.length > 0, true);
  assert.equal(output.suggested_handoffs.length > 0, true);
  assert.equal(output.leading_indicators.some((item) => item === "industry:fintech"), true);
});
