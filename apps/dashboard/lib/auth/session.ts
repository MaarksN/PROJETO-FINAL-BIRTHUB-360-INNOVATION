import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./session-token";

export { SESSION_COOKIE } from "./session-token";
export { createSessionToken } from "./session-token";

export async function getServerSession() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}
