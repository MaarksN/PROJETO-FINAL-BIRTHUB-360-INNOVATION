import { defineConfig } from "@playwright/test";

const port = Number.parseInt(process.env.PLAYWRIGHT_PORT ?? "3001", 10);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL,
    trace: "retain-on-failure"
  },
  webServer: {
    command: `pnpm --filter @birthub/web exec next dev --webpack -p ${port}`,
    env: {
      ...process.env,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3000",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? baseURL,
      NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT ?? "test",
      NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED ?? "1",
      WEB_BASE_URL: process.env.WEB_BASE_URL ?? baseURL
    },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: baseURL
  }
});
