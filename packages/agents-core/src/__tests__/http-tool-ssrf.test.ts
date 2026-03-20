// [SOURCE] ADR-015 / Checklist-Session-Security.md - GAP-SEC-005
import assert from "node:assert/strict";
import test from "node:test";

import { HttpTool } from "../tools/httpTool.js";

function defaultContext() {
  return {
    agentId: "agent-security-test",
    tenantId: "tenant-security-test"
  };
}

test("HttpTool blocks internal/private IPv4 ranges required by SSRF policy", async () => {
  const tool = new HttpTool();
  const blockedUrls = [
    "http://10.1.2.3/resource",
    "http://127.0.0.1/internal",
    "http://169.254.169.254/latest/meta-data",
    "http://192.168.1.20/private",
    "http://172.16.1.10/private"
  ];

  for (const url of blockedUrls) {
    await assert.rejects(
      () =>
        tool.run(
          {
            url
          },
          defaultContext()
        ),
      (error: unknown) =>
        error instanceof Error && error.message.includes("blocked host") && error.message.includes("SSRF")
    );
  }
});

test("HttpTool allows public URLs when host is not blocked", async () => {
  let calledUrl: string | null = null;
  const tool = new HttpTool({
    fetchImpl: async (input) => {
      calledUrl = String(input);
      return new Response(JSON.stringify({ ok: true }), {
        headers: {
          "content-type": "application/json"
        },
        status: 200
      });
    }
  });

  const output = await tool.run(
    {
      url: "https://example.com/health"
    },
    defaultContext()
  );

  assert.equal(calledUrl, "https://example.com/health");
  assert.equal(output.status, 200);
  assert.equal(output.attempt, 1);
  assert.deepEqual(output.body, { ok: true });
});
