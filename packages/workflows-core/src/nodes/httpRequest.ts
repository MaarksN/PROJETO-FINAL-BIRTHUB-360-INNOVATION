import { interpolateValue } from "../interpolation/interpolate.js";
import type { WorkflowRuntimeContext } from "../types.js";

interface HttpRequestNodeConfig {
  auth?: {
    bearer?: string;
  };
  body?: unknown;
  headers?: Record<string, string>;
  method?: "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
  timeout_ms?: number;
  url: string;
}

function assertSafeUrl(rawUrl: string): URL {
  const parsed = new URL(rawUrl);
  const normalizedHost = parsed.hostname.toLowerCase();

  const blockedHosts = new Set([
    "localhost",
    "0.0.0.0",
    "127.0.0.1",
    "::1",
    "host.docker.internal"
  ]);

  if (blockedHosts.has(normalizedHost)) {
    throw new Error("SSRF_GUARD_BLOCKED_HOST");
  }

  if (normalizedHost.endsWith(".internal")) {
    throw new Error("SSRF_GUARD_BLOCKED_INTERNAL_DOMAIN");
  }

  return parsed;
}

function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function executeHttpRequestNode(
  config: HttpRequestNodeConfig,
  context: WorkflowRuntimeContext
): Promise<{
  body: unknown;
  headers: Record<string, string>;
  status: number;
}> {
  const interpolated = interpolateValue(config, context);
  const safeUrl = assertSafeUrl(interpolated.url);
  const timeoutMs = Math.min(Math.max(interpolated.timeout_ms ?? 2500, 1), 10_000);
  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const headers = new Headers(interpolated.headers ?? {});
    if (interpolated.auth?.bearer) {
      headers.set("Authorization", `Bearer ${interpolated.auth.bearer}`);
    }

    const hasBody = interpolated.body !== undefined && interpolated.method !== "GET";
    if (hasBody && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(safeUrl.toString(), {
      body: hasBody ? JSON.stringify(interpolated.body) : undefined,
      headers,
      method: interpolated.method ?? "GET",
      signal: controller.signal
    });

    const responseBody = await parseResponseBody(response);
    return {
      body: responseBody,
      headers: Object.fromEntries(response.headers.entries()),
      status: response.status
    };
  } finally {
    clearTimeout(timer);
  }
}

export type { HttpRequestNodeConfig };

