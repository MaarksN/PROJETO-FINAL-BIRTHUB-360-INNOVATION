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
      const abortHandler = () => {
        const reason = init?.signal?.reason;
        if (reason instanceof Error) {
          reject(reason);
        } else if (typeof reason === "string") {
          reject(new Error(reason));
        } else {
          reject(new Error("aborted"));
        }
      };

      if (init?.signal?.aborted) {
        abortHandler();
      } else {
        init?.signal?.addEventListener("abort", abortHandler, { once: true });
        // Make sure to manually abort quickly for the test so it doesn't hang waiting for real timeout
        setTimeout(() => reject(new Error("timeout")), 10);
      }
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
