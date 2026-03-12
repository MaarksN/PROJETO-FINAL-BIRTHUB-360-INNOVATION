import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "../../../../lib/auth/session";

type LoginPayload = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as LoginPayload;

  const expectedEmail = process.env.DASHBOARD_AUTH_EMAIL;
  const expectedPassword = process.env.DASHBOARD_AUTH_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return NextResponse.json({ ok: false, error: "Configuração de autenticação incompleta" }, { status: 500 });
  }

  if (!payload.email || !payload.password || payload.email !== expectedEmail || payload.password !== expectedPassword) {
    return NextResponse.json({ ok: false, error: "Credenciais inválidas" }, { status: 401 });
  }

  const token = await createSessionToken({
    sub: payload.email,
    email: payload.email,
    role: "owner",
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
