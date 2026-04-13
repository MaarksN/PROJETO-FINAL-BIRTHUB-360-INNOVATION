// @ts-nocheck
// 
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { defineConfig } from "@playwright/test";

const bundledPnpm = resolve(
  process.cwd(),
  ".tools/node-v24.14.0-win-x64/node_modules/corepack/dist/pnpm.js"
);
const globalCorepackPnpm = resolve(dirname(process.execPath), "node_modules/corepack/dist/pnpm.js");
const pnpmCli = existsSync(bundledPnpm)
  ? bundledPnpm
  : existsSync(globalCorepackPnpm)
    ? globalCorepackPnpm
    : null;
const webServerCommand = pnpmCli
  ? `node "${pnpmCli}" --filter @birthub/web dev`
  : "npm run dev --workspace @birthub/web";
const remoteBaseUrl = process.env.E2E_BASE_URL?.trim();
const baseURL = remoteBaseUrl && remoteBaseUrl.length > 0 ? remoteBaseUrl : "http://127.0.0.1:3001";
const apiURL = process.env.E2E_API_URL?.trim() || baseURL;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:3001",
    trace: "retain-on-failure",
    video: "on",
  },
  webServer: remoteBaseUrl
    ? undefined
    : {
        command: webServerCommand,
        url: "http://127.0.0.1:3001/",
        reuseExistingServer: true,
        env: {
          BIRTHUB_ENABLE_CLINICAL_WORKSPACE:
            process.env.BIRTHUB_ENABLE_CLINICAL_WORKSPACE ??
            process.env.E2E_ENABLE_CLINICAL_WORKSPACE ??
            "false",
          BIRTHUB_ENABLE_FHIR_FACADE:
            process.env.BIRTHUB_ENABLE_FHIR_FACADE ??
            process.env.E2E_ENABLE_FHIR_FACADE ??
            "false",
          BIRTHUB_ENABLE_PRIVACY_ADVANCED:
            process.env.BIRTHUB_ENABLE_PRIVACY_ADVANCED ??
            process.env.E2E_ENABLE_PRIVACY_ADVANCED ??
            "false",
          NEXT_PUBLIC_API_URL: apiURL,
          NEXT_PUBLIC_APP_URL: baseURL,
          NEXT_PUBLIC_ENABLE_CLINICAL_WORKSPACE:
            process.env.NEXT_PUBLIC_ENABLE_CLINICAL_WORKSPACE ??
            process.env.E2E_ENABLE_CLINICAL_WORKSPACE ??
            "false",
          NEXT_PUBLIC_ENABLE_FHIR_FACADE:
            process.env.NEXT_PUBLIC_ENABLE_FHIR_FACADE ??
            process.env.E2E_ENABLE_FHIR_FACADE ??
            "false",
          NEXT_PUBLIC_ENABLE_PRIVACY_ADVANCED:
            process.env.NEXT_PUBLIC_ENABLE_PRIVACY_ADVANCED ??
            process.env.E2E_ENABLE_PRIVACY_ADVANCED ??
            "false",
          NEXT_PUBLIC_ENVIRONMENT: "test",
          WEB_PORT: "3001"
        },
      },
});
