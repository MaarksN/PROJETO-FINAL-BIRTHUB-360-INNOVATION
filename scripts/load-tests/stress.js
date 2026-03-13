import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
const TENANT_ID = __ENV.TENANT_ID || "birthhub-alpha";
const LOGIN_EMAIL = __ENV.LOGIN_EMAIL || "owner@birthub.local";
const LOGIN_PASSWORD = __ENV.LOGIN_PASSWORD || "password123";
const WEBHOOK_URL = __ENV.WEBHOOK_URL || `${BASE_URL}/api/v1/tasks`;

export const options = {
  vus: 100,
  duration: "10m",
  thresholds: {
    http_req_duration: ["p(95)<300"],
    http_req_failed: ["rate<0.01"]
  }
};

export default function () {
  const loginPayload = JSON.stringify({
    email: LOGIN_EMAIL,
    password: LOGIN_PASSWORD,
    tenantId: TENANT_ID
  });
  const loginResponse = http.post(`${BASE_URL}/api/v1/auth/login`, loginPayload, {
    headers: { "Content-Type": "application/json" },
    tags: { endpoint: "auth_login" }
  });

  check(loginResponse, {
    "login returns 200": (response) => response.status === 200
  });

  const sessionToken = loginResponse.json("session.token");
  const webhookPayload = JSON.stringify({
    agentId: "ceo-pack",
    approvalRequired: false,
    estimatedCostBRL: 0.5,
    executionMode: "LIVE",
    payload: {
      trigger: "k6-stress",
      ts: Date.now()
    },
    type: "sync-session"
  });
  const webhookHeaders = {
    "Content-Type": "application/json",
    "x-tenant-id": TENANT_ID
  };

  if (sessionToken) {
    webhookHeaders.Authorization = `Bearer ${sessionToken}`;
  }

  const webhookResponse = http.post(WEBHOOK_URL, webhookPayload, {
    headers: webhookHeaders,
    tags: { endpoint: "webhook_or_task" }
  });

  check(webhookResponse, {
    "ingestion accepted or backpressured": (response) =>
      response.status === 200 || response.status === 202 || response.status === 503
  });

  sleep(1);
}
