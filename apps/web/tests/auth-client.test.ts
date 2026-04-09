// @ts-nocheck
import assert from "node:assert/strict";
import test from "node:test";

import { JSDOM } from "jsdom";

import { fetchWithSession, resolveApiBaseUrl, toApiUrl } from "../lib/auth-client";

function restoreEnvValue(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}

void test("auth client resolves relative API paths from centralized web config", () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const originalEnvironment = process.env.NEXT_PUBLIC_ENVIRONMENT;

  process.env.NEXT_PUBLIC_API_URL = "https://api.birthub.test";
  process.env.NEXT_PUBLIC_ENVIRONMENT = "development";

  try {
    assert.equal(resolveApiBaseUrl(), "https://api.birthub.test");
    assert.equal(toApiUrl("/api/v1/me"), "https://api.birthub.test/api/v1/me");
    assert.equal(toApiUrl("https://external.example.com/health"), "https://external.example.com/health");
  } finally {
    restoreEnvValue("NEXT_PUBLIC_API_URL", originalApiUrl);
    restoreEnvValue("NEXT_PUBLIC_ENVIRONMENT", originalEnvironment);
  }
});

void test("fetchWithSession forwards session headers and absolute URL through the shared timeout helper", async () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const originalEnvironment = process.env.NEXT_PUBLIC_ENVIRONMENT;
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalLocalStorage = globalThis.localStorage;

  process.env.NEXT_PUBLIC_API_URL = "https://api.birthub.test";
  process.env.NEXT_PUBLIC_ENVIRONMENT = "development";

  const dom = new JSDOM("", {
    url: "https://app.birthub.test/dashboard"
  });
  dom.window.localStorage.setItem("bh_access_token", "atk_123");
  dom.window.localStorage.setItem("bh_csrf_token", "csrf_local");
  Object.defineProperty(globalThis, "window", { configurable: true, value: dom.window });
  Object.defineProperty(globalThis, "document", { configurable: true, value: dom.window.document });
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: dom.window.localStorage
  });

  let requestUrl = "";
  let requestInit: RequestInit | undefined;
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    requestUrl = input instanceof URL ? input.toString() : (input as string);
    requestInit = init;
    return Promise.resolve(
      new Response(JSON.stringify({ ok: true }), {
        headers: {
          "content-type": "application/json"
        },
        status: 200
      })
    );
  }) as typeof fetch;

  try {
    const response = await fetchWithSession("/api/v1/me", {
      method: "GET",
      timeoutMs: 25
    });
    const headers = new Headers(requestInit?.headers);

    assert.equal(response.status, 200);
    assert.equal(requestUrl, "https://api.birthub.test/api/v1/me");
    assert.equal(requestInit?.credentials, "include");
    assert.equal(headers.get("authorization"), "Bearer atk_123");
    assert.equal(headers.get("x-csrf-token"), "csrf_local");
    assert.ok(requestInit?.signal);
  } finally {
    globalThis.fetch = originalFetch;
    Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
    Object.defineProperty(globalThis, "document", { configurable: true, value: originalDocument });
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: originalLocalStorage
    });
    dom.window.close();
    restoreEnvValue("NEXT_PUBLIC_API_URL", originalApiUrl);
    restoreEnvValue("NEXT_PUBLIC_ENVIRONMENT", originalEnvironment);
  }
});

void test("fetchWithSession rejects with the configured timeout message when the request stalls", async () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const originalEnvironment = process.env.NEXT_PUBLIC_ENVIRONMENT;
  const originalFetch = globalThis.fetch;

  process.env.NEXT_PUBLIC_API_URL = "https://api.birthub.test";
  process.env.NEXT_PUBLIC_ENVIRONMENT = "development";

  globalThis.fetch = ((_: RequestInfo | URL, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener(
        "abort",
        () => {
          const reason = init.signal?.reason;
          if (reason instanceof Error) {
            reject(reason);
          } else if (typeof reason === "string") {
            reject(new Error(reason));
          } else {
            reject(new Error("aborted"));
          }
        },
        { once: true }
      );
    })) as typeof fetch;

  try {
    await assert.rejects(
      () =>
        fetchWithSession("/api/v1/me", {
          timeoutMessage: "Session fetch timed out.",
          timeoutMs: 10
        }),
      (err: Error) => err.message === "Session fetch timed out."
    );
  } finally {
    globalThis.fetch = originalFetch;
    restoreEnvValue("NEXT_PUBLIC_API_URL", originalApiUrl);
    restoreEnvValue("NEXT_PUBLIC_ENVIRONMENT", originalEnvironment);
  }
});
