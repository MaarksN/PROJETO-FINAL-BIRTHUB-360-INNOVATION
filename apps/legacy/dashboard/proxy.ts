import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { fetchWithTimeout } from "@birthub/utils";

const PUBLIC_PATHS = ["/login", "/api/session/login", "/api/session/logout", "/_next", "/favicon.ico"];
const AUTH_PROBE_TIMEOUT_MS = 5_000;

function resolveApiBaseUrl(): string {
  return process.env.API_URL?.trim() || "http://localhost:3000";
}

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(`${resolveApiBaseUrl()}/api/v1/me`, {
      cache: "no-store",
      headers: {
        ...(request.headers.get("authorization")
          ? { authorization: request.headers.get("authorization") as string }
          : {}),
        ...(request.headers.get("cookie") ? { cookie: request.headers.get("cookie") as string } : {})
      },
      timeoutMessage: `Legacy auth probe exceeded the ${AUTH_PROBE_TIMEOUT_MS}ms timeout budget.`,
      timeoutMs: AUTH_PROBE_TIMEOUT_MS
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  if (PUBLIC_PATHS.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (await isAuthenticated(request)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
