import assert from "node:assert/strict";
import test from "node:test";

import { postSlackMessage } from "../tools/slack.tool.js";

void test("slack tool simulates by default", async () => {
  const result = await postSlackMessage({
    channel: "ops-alerts",
    mode: "api",
    text: "hello"
  });

  assert.equal(result.mode, "api");
  assert.equal(result.ok, true);
  assert.ok(result.ts.length > 0);
});

void test("slack tool propagates timeout through abort signal", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = ((_: RequestInfo | URL, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener(
        "abort",
        () => {
          const err = init.signal?.reason instanceof Error ? init.signal.reason : new Error(String(init.signal?.reason ?? "aborted"));
          reject(err);
        },
        { once: true }
      );
    })) as typeof fetch;

  try {
    await assert.rejects(
      () =>
        postSlackMessage(
          {
            channel: "ops-alerts",
            mode: "webhook",
            text: "hello",
            webhookUrl: "https://hooks.slack.test/services/abc"
          },
          {
            simulate: false
          }
        ),
      /The operation was aborted|aborted|timeout/i
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
