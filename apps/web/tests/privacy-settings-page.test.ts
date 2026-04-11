import assert from "node:assert/strict";
import test from "node:test";

import { JSDOM } from "jsdom";

import {
  clearStoredPrivacySession,
  executeRetentionRun,
  exportPrivacyData,
  formatConsentStatus,
  formatDate,
  formatExecutionMode,
  formatRetentionAction,
  loadPrivacyState,
  persistPrivacyConsents,
  persistRetentionPolicies,
  requestPrivacyAccountDeletion,
  type PrivacyConsent,
  type RetentionPolicy
} from "../app/(dashboard)/settings/privacy/privacy-settings-page.data";

function restoreEnvValue(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}

function installSessionDom() {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;
  const originalLocalStorage = globalThis.localStorage;

  const dom = new JSDOM("", {
    url: "https://app.birthub.test/settings/privacy"
  });
  dom.window.document.cookie = "bh360_csrf=csrf_privacy";
  dom.window.document.cookie = "bh_active_tenant=tenant_privacy";
  dom.window.document.cookie = "bh_user_id=user_privacy";

  Object.defineProperty(globalThis, "window", { configurable: true, value: dom.window });
  Object.defineProperty(globalThis, "document", { configurable: true, value: dom.window.document });
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: dom.window.localStorage
  });

  return () => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
    Object.defineProperty(globalThis, "document", { configurable: true, value: originalDocument });
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: originalLocalStorage
    });
    dom.window.close();
  };
}

function getRequestUrl(input: RequestInfo | URL): string {
  if (input instanceof URL) {
    return input.toString();
  }

  if (typeof input === "string") {
    return input;
  }

  return input.url;
}

function createJsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    headers: {
      "content-type": "application/json"
    },
    status
  });
}

void test("privacy page helpers format consent and retention labels", () => {
  assert.equal(formatDate(null), "Nao registrado");
  assert.equal(formatConsentStatus("GRANTED"), "Concedido");
  assert.equal(formatRetentionAction("ANONYMIZE"), "Anonimizar");
  assert.equal(formatExecutionMode("DRY_RUN"), "Dry-run");
});

void test("privacy page helpers load privacy state through the session-aware client", async () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const originalEnvironment = process.env.NEXT_PUBLIC_ENVIRONMENT;
  const originalFetch = globalThis.fetch;
  const cleanupDom = installSessionDom();

  process.env.NEXT_PUBLIC_API_URL = "https://api.birthub.test";
  process.env.NEXT_PUBLIC_ENVIRONMENT = "development";

  const requests: Array<{ headers: Headers; method: string; url: string }> = [];
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = getRequestUrl(input);
    requests.push({
      headers: new Headers(init?.headers),
      method: init?.method ?? "GET",
      url
    });

    if (url.endsWith("/api/v1/privacy/consents")) {
      return Promise.resolve(
        createJsonResponse({
          history: [
            {
              createdAt: "2026-04-07T11:00:00.000Z",
              id: "event_1",
              newStatus: "GRANTED",
              previousStatus: "PENDING",
              purpose: "ANALYTICS",
              source: "SETTINGS"
            }
          ],
          items: [
            {
              grantedAt: null,
              id: "consent_1",
              lastChangedAt: "2026-04-07T10:00:00.000Z",
              lawfulBasis: "CONSENT",
              purpose: "ANALYTICS",
              revokedAt: null,
              source: "SETTINGS",
              status: "GRANTED"
            }
          ],
          preferences: {
            cookieConsent: "ACCEPTED",
            emailNotifications: true,
            inAppNotifications: true,
            lgpdConsentedAt: "2026-04-07T10:00:00.000Z",
            lgpdConsentStatus: "ACCEPTED",
            lgpdConsentVersion: "2026-04",
            lgpdLegalBasis: "CONSENT",
            marketingEmails: false,
            pushNotifications: true
          }
        })
      );
    }

    if (url.endsWith("/api/v1/privacy/retention")) {
      return Promise.resolve(
        createJsonResponse(
          {
            executions: [],
            items: []
          },
          403
        )
      );
    }

    throw new Error(`Unexpected request: ${url}`);
  }) as typeof fetch;

  try {
    const state = await loadPrivacyState();

    assert.equal(state.consents.length, 1);
    assert.equal(state.consentHistory.length, 1);
    assert.equal(state.retentionAccessDenied, true);
    assert.equal(requests[0]?.url, "/api/bff/api/v1/privacy/consents");
    assert.equal(requests[0]?.headers.get("authorization"), null);
    assert.equal(requests[0]?.headers.get("x-csrf-token"), "csrf_privacy");
    assert.equal(requests[0]?.headers.get("x-active-tenant"), "tenant_privacy");
  } finally {
    globalThis.fetch = originalFetch;
    cleanupDom();
    restoreEnvValue("NEXT_PUBLIC_API_URL", originalApiUrl);
    restoreEnvValue("NEXT_PUBLIC_ENVIRONMENT", originalEnvironment);
  }
});

void test("privacy page helpers persist consent, retention, export and deletion requests", async () => {
  const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;
  const originalEnvironment = process.env.NEXT_PUBLIC_ENVIRONMENT;
  const originalFetch = globalThis.fetch;
  const cleanupDom = installSessionDom();

  process.env.NEXT_PUBLIC_API_URL = "https://api.birthub.test";
  process.env.NEXT_PUBLIC_ENVIRONMENT = "development";

  const calls: Array<{ body: string | null; method: string; url: string }> = [];
  globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = getRequestUrl(input);
    calls.push({
      body: typeof init?.body === "string" ? init.body : null,
      method: init?.method ?? "GET",
      url
    });

    if (url.endsWith("/api/v1/privacy/consents")) {
      return Promise.resolve(new Response(null, { status: 200 }));
    }

    if (url.endsWith("/api/v1/privacy/retention")) {
      return Promise.resolve(new Response(null, { status: 200 }));
    }

    if (url.endsWith("/api/v1/privacy/retention/run")) {
      return Promise.resolve(
        createJsonResponse({
          items: [
            {
              affectedCount: 2,
              dataCategory: "OUTPUT_ARTIFACTS",
              executionId: "execution_1",
              scannedCount: 10
            }
          ]
        })
      );
    }

    if (url.endsWith("/api/v1/privacy/export")) {
      return Promise.resolve(new Response("{\"tenant\":\"alpha\"}", { status: 200 }));
    }

    if (url.endsWith("/api/v1/privacy/delete-account")) {
      return Promise.resolve(new Response(null, { status: 202 }));
    }

    throw new Error(`Unexpected request: ${url}`);
  }) as typeof fetch;

  const consents: PrivacyConsent[] = [
    {
      grantedAt: null,
      id: "consent_analytics",
      lastChangedAt: "2026-04-07T10:00:00.000Z",
      lawfulBasis: "CONSENT",
      purpose: "ANALYTICS",
      revokedAt: null,
      source: "SETTINGS",
      status: "GRANTED"
    }
  ];
  const policies: RetentionPolicy[] = [
    {
      action: "ANONYMIZE",
      createdAt: "2026-04-07T10:00:00.000Z",
      dataCategory: "OUTPUT_ARTIFACTS",
      enabled: true,
      id: "policy_1",
      legalBasis: "LEGITIMATE_INTEREST",
      retentionDays: 30,
      updatedAt: "2026-04-07T10:00:00.000Z"
    }
  ];

  try {
    await persistPrivacyConsents(consents);
    await persistRetentionPolicies(policies);
    const retentionResults = await executeRetentionRun("DRY_RUN");
    const exportPayload = await exportPrivacyData();
    await requestPrivacyAccountDeletion("EXCLUIR MINHA CONTA");

    assert.equal(retentionResults[0]?.executionId, "execution_1");
    assert.equal(exportPayload.fileName.startsWith("birthub360-export-"), true);
    assert.equal(await exportPayload.blob.text(), "{\"tenant\":\"alpha\"}");
    assert.equal(calls[0]?.method, "PUT");
    assert.match(calls[0]?.body ?? "", /ANALYTICS/);
    assert.equal(calls[1]?.method, "PUT");
    assert.match(calls[1]?.body ?? "", /OUTPUT_ARTIFACTS/);
    assert.equal(calls[2]?.method, "POST");
    assert.equal(calls[3]?.method, "GET");
    assert.equal(calls[4]?.method, "POST");

    clearStoredPrivacySession();
    assert.equal(globalThis.localStorage.getItem("bh_access_token"), null);
    assert.equal(globalThis.localStorage.getItem("bh_csrf_token"), null);
  } finally {
    globalThis.fetch = originalFetch;
    cleanupDom();
    restoreEnvValue("NEXT_PUBLIC_API_URL", originalApiUrl);
    restoreEnvValue("NEXT_PUBLIC_ENVIRONMENT", originalEnvironment);
  }
});
