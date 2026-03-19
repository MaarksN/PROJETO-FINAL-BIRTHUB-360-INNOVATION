import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAgentRuntimeOutput,
  parseAgentRuntimeOutput,
  type AgentRuntimePlan,
} from "../runtime/manifestRuntime.js";
import type { AgentManifest } from "../manifest/schema.js";
// [SOURCE] checklist agent prompt templates — output schema

const manifest: AgentManifest = {
  agent: {
    changelog: ["init"],
    description: "Runtime test agent",
    id: "runtime-test-agent",
    kind: "agent",
    name: "Runtime Test Agent",
    prompt: "Act with structured outputs.",
    tenantId: "catalog",
    version: "1.0.0",
  },
  keywords: ["runtime", "schema", "validation", "strict", "output"],
  manifestVersion: "1.0.0",
  policies: [
    {
      actions: ["tool:execute"],
      effect: "allow",
      id: "runtime-test-agent.policy.standard",
      name: "default",
    },
  ],
  required_tools: [],
  skills: [
    {
      description: "skill",
      id: "runtime-test-agent.skill.default",
      inputSchema: { type: "object" },
      name: "Skill",
      outputSchema: { type: "object" },
    },
  ],
  tags: {
    domain: ["test"],
    industry: ["saas"],
    level: ["ops"],
    persona: ["qa"],
    "use-case": ["runtime-validation"],
  },
  tools: [
    {
      description: "tool",
      id: "runtime-test-agent.tool.default",
      inputSchema: { type: "object" },
      name: "Tool",
      outputSchema: { type: "object" },
      timeoutMs: 1000,
    },
  ],
  fallback_behavior: {
    tool_unavailable: {
      retry_attempts: 3,
      backoff_strategy: "exponential",
      base_delay_ms: 500,
    },
    http_429: {
      wait_ms: 1000,
      retry_attempts: 1,
    },
    exhausted: {
      notify_human: true,
      silence: false,
      loop: false,
    },
  },
};

const plan: AgentRuntimePlan = {
  logs: ["planning"],
  toolCalls: [
    {
      input: { sourcePayload: { metric: 1 } },
      rationale: "run tool",
      tool: "runtime-test-agent.tool.default",
    },
  ],
};

test("buildAgentRuntimeOutput returns strict-schema compliant payload", () => {
  const output = buildAgentRuntimeOutput({
    input: {
      owner: "ops",
      objective: "validate output",
    },
    logs: [],
    manifest,
    plan,
    sharedLearning: [],
    steps: [
      {
        call: {
          input: { metric: 1 },
          tool: "runtime-test-agent.tool.default",
        },
        finishedAt: new Date().toISOString(),
        output: { ok: true },
        startedAt: new Date().toISOString(),
      },
    ],
  });

  assert.equal(output.executionMode, "LIVE");
  assert.ok(Array.isArray(output.tool_results));
});

test("parseAgentRuntimeOutput rejects malformed payload at boundary", () => {
  assert.throws(
    () =>
      parseAgentRuntimeOutput({
        approvals_or_dependencies: [],
        confidence: "high",
        decisions_to_anticipate: [],
        emerging_risks: [],
        executionMode: "LIVE",
        leading_indicators: [],
        learning_used: [],
        next_checkpoint: "2026-01-01T00:00:00.000Z",
        opportunities_to_capture: [],
        preventive_action_plan: [],
        sharedLearningCount: 0,
        status: "stable",
        summary: "ok",
        tool_results: [],
        rogue: true,
      }),
    /rogue/,
  );
});
