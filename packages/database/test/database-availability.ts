import type { TestContext } from "node:test";

type ConnectivityProbeClient = {
  $executeRawUnsafe: (query: string) => Promise<unknown>;
};

function isDatabaseUnavailableError(error: unknown): boolean {
  const errorWithCode =
    typeof error === "object" && error !== null ? (error as { code?: unknown; message?: unknown }) : null;

  const rawCode = errorWithCode?.code;
  if (typeof rawCode === "string" && ["ECONNREFUSED", "P1001"].includes(rawCode.toUpperCase())) {
    return true;
  }

  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    message.includes("econnrefused") ||
    message.includes("p1001") ||
    message.includes("can't reach database server") ||
    message.includes("can't connect") ||
    message.includes("connection refused")
  );
}

export async function ensureDatabaseAvailableOrSkip(
  context: TestContext,
  client: ConnectivityProbeClient
): Promise<void> {
  try {
    await client.$executeRawUnsafe("SELECT 1");
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      context.skip("DATABASE_URL configurado, mas o banco não está acessível para este teste de integração.");
      return;
    }

    throw error;
  }
}
