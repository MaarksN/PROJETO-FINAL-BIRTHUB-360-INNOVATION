import { getWebConfig } from "@birthub/config";
import {
  fetchWithTimeout,
  type FetchWithTimeoutInit
} from "../../../packages/utils/src/fetch";

export interface StoredSession {
  accessToken?: string;
  csrfToken?: string;
  tenantId?: string;
  userId?: string;
}

export const SESSION_FETCH_TIMEOUT_MS = 10_000;

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

export function resolveApiBaseUrl(env: NodeJS.ProcessEnv = process.env): string {
  return getWebConfig({
    ...env,
    NEXT_PUBLIC_ENVIRONMENT: env.NEXT_PUBLIC_ENVIRONMENT ?? "development"
  }).NEXT_PUBLIC_API_URL;
}

export function toApiUrl(input: string, env: NodeJS.ProcessEnv = process.env): string {
  if (!input.startsWith("/") || isAbsoluteUrl(input)) {
    return input;
  }

  return new URL(input, resolveApiBaseUrl(env)).toString();
}

export function getStoredSession(): StoredSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const accessToken = localStorage.getItem("bh_access_token");
  const csrfToken = localStorage.getItem("bh_csrf_token");
  const tenantId = localStorage.getItem("bh_tenant_id");
  const userId = localStorage.getItem("bh_user_id");

  if (!accessToken && !csrfToken && !tenantId && !userId) {
    return null;
  }

  return {
    ...(accessToken ? { accessToken } : {}),
    ...(csrfToken ? { csrfToken } : {}),
    ...(tenantId ? { tenantId } : {}),
    ...(userId ? { userId } : {})
  };
}

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

export async function fetchWithSession(
  input: RequestInfo | URL,
  init: FetchWithTimeoutInit = {}
): Promise<Response> {
  const session = getStoredSession();

  const headers = new Headers(init.headers);

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const csrfToken = session?.csrfToken ?? getCookieValue("bh360_csrf");
  if (csrfToken) {
    headers.set("x-csrf-token", csrfToken);
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
