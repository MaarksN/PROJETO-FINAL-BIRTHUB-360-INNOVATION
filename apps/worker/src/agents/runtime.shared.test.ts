import assert from "node:assert/strict";
import test from "node:test";

import { buildToolCostTable } from "./runtime.budget.js";
import { matchesPattern, readSessionId } from "./runtime.shared.js";

void test("readSessionId prefers top-level value and falls back to nested context", () => {
  assert.equal(readSessionId({ sessionId: "top-level" }), "top-level");
  assert.equal(readSessionId({ context: { sessionId: "nested" } }), "nested");
  assert.equal(readSessionId({}), null);
});

void test("matchesPattern supports wildcard segments and tool costs include timeouts", () => {
  assert.equal(matchesPattern("tenant:agent:session", "tenant:*:session"), true);

  const costs = buildToolCostTable({
    defaultToolCostBrl: 0.15,
    manifest: {
      agent: {
        id: "agent.demo",
        name: "Agent Demo",
        version: "1.0.0"
      },
      description: "demo",
      keywords: [],
      policies: [],
      tags: {
        domain: [],
        industry: [],
        level: [],
        persona: [],
        "use-case": []
      },
      tools: [
        {
          description: "tool",
          id: "custom-tool",
          name: "Custom Tool",
          timeoutMs: 30_000
        }
      ]
    }
  });

  assert.equal(typeof costs["custom-tool"], "number");
  assert.equal(costs["custom-tool"]! > 0.15, true);
});
