export interface StoredSession {
  accessToken: string;
  csrfToken: string;
  tenantId: string;
  userId: string;
}

export function getStoredSession(): StoredSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const accessToken = localStorage.getItem("bh_access_token");
  const csrfToken = localStorage.getItem("bh_csrf_token");
  const tenantId = localStorage.getItem("bh_tenant_id");
  const userId = localStorage.getItem("bh_user_id");

  if (!accessToken || !csrfToken || !tenantId || !userId) {
    return null;
  }

  return {
    accessToken,
    csrfToken,
    tenantId,
    userId
  };
}

export async function fetchWithSession(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const session = getStoredSession();

  if (!session) {
    throw new Error("Sessao nao encontrada. Realize login novamente.");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${session.accessToken}`);
  headers.set("x-csrf-token", session.csrfToken);
  headers.set("x-tenant-id", session.tenantId);
  const nextInit: RequestInit = {
    ...init,
    credentials: "include",
    headers
  };

  return fetch(input, nextInit);
}
