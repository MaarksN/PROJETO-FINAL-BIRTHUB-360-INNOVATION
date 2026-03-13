import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const requestId = request.cookies.get("bh_request_id")?.value ?? crypto.randomUUID();
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-request-id", requestId);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  response.cookies.set("bh_request_id", requestId, {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    secure: false
  });
  response.headers.set("x-request-id", requestId);

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
