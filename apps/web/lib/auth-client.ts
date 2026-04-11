import { getWebConfig } from "@birthub/config";
import {
  fetchWithTimeout,
  type FetchWithTimeoutInit
} from "../../../packages/utils/src/fetch";
import {
  ACTIVE_TENANT_COOKIE_NAME,
  API_CSRF_COOKIE_NAME,
  LEGACY_ACCESS_TOKEN_STORAGE_KEY,
  LEGACY_CSRF_STORAGE_KEY,
  LEGACY_REFRESH_TOKEN_STORAGE_KEY,
  LEGACY_TENANT_STORAGE_KEY,
  LEGACY_USER_ID_STORAGE_KEY,
  normalizeStoredSession,
  readCookieValueFromHeader,
  type StoredSession,
  USER_ID_COOKIE_NAME
} from "./session-context";

const SESSION_FETCH_TIMEOUT_MS = 10_000;

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function isInternalWebPath(value: string): boolean {
  return value.startsWith("/api/auth") || value.startsWith("/api/bff");
}

export function resolveApiBaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  return getWebConfig({
    ...env,
    NEXT_PUBLIC_ENVIRONMENT: env.NEXT_PUBLIC_ENVIRONMENT ?? "development"
  }).NEXT_PUBLIC_API_URL;
}

export function toApiUrl(input: string, env: NodeJS.ProcessEnv = process.env): string {
  if (!input.startsWith("/") || isAbsoluteUrl(input) || isInternalWebPath(input)) {
    return input;
  }

  return new URL(input, resolveApiBaseUrl(env)).toString();
}

export function getStoredSession(): StoredSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  return normalizeStoredSession({
    tenantId:
      getCookieValue(ACTIVE_TENANT_COOKIE_NAME) ?? localStorage.getItem(LEGACY_TENANT_STORAGE_KEY) ?? undefined,
    userId: getCookieValue(USER_ID_COOKIE_NAME) ?? localStorage.getItem(LEGACY_USER_ID_STORAGE_KEY) ?? undefined
  });
}

export function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  return readCookieValueFromHeader(document.cookie, name);
}

export function setCookieValue(
  name: string,
  value: string,
  options: {
    maxAgeSeconds?: number;
    path?: string;
    sameSite?: "lax" | "none" | "strict";
  } = {}
): void {
  if (typeof document === "undefined") {
    return;
  }

  const segments = [`${name}=${encodeURIComponent(value)}`];
  const sameSite = options.sameSite ?? "lax";
  segments.push(`Path=${options.path ?? "/"}`);
  segments.push(`SameSite=${sameSite.charAt(0).toUpperCase()}${sameSite.slice(1)}`);

  if (options.maxAgeSeconds !== undefined) {
    segments.push(`Max-Age=${Math.max(0, Math.floor(options.maxAgeSeconds))}`);
  }

  document.cookie = segments.join("; ");
}

export function persistStoredSession(session: StoredSession): void {
  const normalized = normalizeStoredSession(session);

  if (!normalized) {
    clearStoredSession();
    return;
  }

  if (normalized.tenantId) {
    setCookieValue(ACTIVE_TENANT_COOKIE_NAME, normalized.tenantId);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(LEGACY_TENANT_STORAGE_KEY, normalized.tenantId);
    }
  }

  if (normalized.userId) {
    setCookieValue(USER_ID_COOKIE_NAME, normalized.userId);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(LEGACY_USER_ID_STORAGE_KEY, normalized.userId);
    }
  }

  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(LEGACY_ACCESS_TOKEN_STORAGE_KEY);
    localStorage.removeItem(LEGACY_REFRESH_TOKEN_STORAGE_KEY);
  }
}

export function clearStoredSession(): void {
  setCookieValue(ACTIVE_TENANT_COOKIE_NAME, "", { maxAgeSeconds: 0 });
  setCookieValue(USER_ID_COOKIE_NAME, "", { maxAgeSeconds: 0 });

  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.removeItem(LEGACY_ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(LEGACY_REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(LEGACY_CSRF_STORAGE_KEY);
  localStorage.removeItem(LEGACY_TENANT_STORAGE_KEY);
  localStorage.removeItem(LEGACY_USER_ID_STORAGE_KEY);
}

function getClientCsrfToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  return getCookieValue(API_CSRF_COOKIE_NAME) ?? localStorage.getItem(LEGACY_CSRF_STORAGE_KEY);
}

export async function fetchWithSession(
  input: RequestInfo | URL,
  init: FetchWithTimeoutInit = {}
): Promise<Response> {
  const session = getStoredSession();

  const headers = new Headers(init.headers);
  const csrfToken = getClientCsrfToken();
  if (csrfToken) {
    headers.set("x-csrf-token", csrfToken);
  }

  if (session?.tenantId) {
    headers.set("x-active-tenant", session.tenantId);
  }

  const nextInit: FetchWithTimeoutInit = {
    ...init,
    credentials: "include",
    headers,
    timeoutMs: init.timeoutMs ?? SESSION_FETCH_TIMEOUT_MS
  };

  if (typeof input === "string") {
    return fetchWithTimeout(toApiUrl(input), nextInit);
  }

  return fetchWithTimeout(input, nextInit);
}
