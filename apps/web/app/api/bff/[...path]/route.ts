import { NextRequest, NextResponse } from "next/server";

import { getWebConfig } from "@birthub/config";

import { fetchWithTimeout } from "../../../../../../packages/utils/src/fetch";

import { isBffPathAllowed } from "../policy";

const webConfig = getWebConfig();
const BFF_PROXY_TIMEOUT_MS = 8_000;

async function proxy(request: NextRequest, path: string): Promise<NextResponse> {
  if (!isBffPathAllowed(path)) {
    return NextResponse.json({ error: "Path is not allowed by BFF policy." }, { status: 403 });
  }

  const requestInit: RequestInit = {
    headers: {
      authorization: request.headers.get("authorization") ?? "",
      "content-type": request.headers.get("content-type") ?? "application/json",
      cookie: request.headers.get("cookie") ?? "",
      "x-correlation-id": request.headers.get("x-correlation-id") ?? ""
    },
    method: request.method
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    requestInit.body = await request.text();
  }

  const response = await fetchWithTimeout(`${webConfig.NEXT_PUBLIC_API_URL}/${path}`, {
    ...requestInit,
    timeoutMessage: `BFF proxy exceeded the ${BFF_PROXY_TIMEOUT_MS}ms timeout budget.`,
    timeoutMs: BFF_PROXY_TIMEOUT_MS
  });

  const nextResponse = new NextResponse(await response.text(), { status: response.status });
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    nextResponse.headers.set("set-cookie", setCookie);
  }
  return nextResponse;
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxy(request, path.join("/"));
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxy(request, path.join("/"));
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxy(request, path.join("/"));
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return proxy(request, path.join("/"));
}
