import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "birthub_dashboard_session";
const SESSION_AUDIENCE = "birthub-dashboard";
const SESSION_ISSUER = "birthub-auth";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

function getSessionSecret() {
  const secret = process.env.DASHBOARD_SESSION_SECRET;
  if (!secret) {
    throw new Error("DASHBOARD_SESSION_SECRET não configurado");
  }

  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: string;
  email: string;
  role: "owner" | "admin" | "member" | "readonly";
};

export async function createSessionToken(payload: SessionPayload) {
  const secret = getSessionSecret();

  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setAudience(SESSION_AUDIENCE)
    .setIssuer(SESSION_ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(secret);
}

export async function verifySessionToken(token?: string) {
  if (!token) {
    return null;
  }

  try {
    const secret = getSessionSecret();
    const { payload } = await jwtVerify(token, secret, {
      audience: SESSION_AUDIENCE,
      issuer: SESSION_ISSUER,
    });

    if (typeof payload.sub !== "string" || typeof payload.email !== "string" || typeof payload.role !== "string") {
      return null;
    }

    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role as SessionPayload["role"],
    };
  } catch {
    return null;
  }
}
