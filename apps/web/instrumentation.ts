// @ts-expect-error TODO: remover suppressão ampla
// 
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config.js");
  }
}

