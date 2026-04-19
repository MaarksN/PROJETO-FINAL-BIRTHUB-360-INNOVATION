#!/usr/bin/env node

import path from "node:path";

import { portableNodeExecutable, projectRoot, run, runPnpm } from "./shared.mjs";

const coreTestWorkspaces = [
  { cwd: "packages/config", args: ["src/**/*.test.ts"] },
  { cwd: "packages/workflows-core", args: ["test/**/*.test.ts"] },
  { cwd: "packages/agents-core", args: ["src/**/*.test.ts"] },
  { cwd: "packages/shared-types", args: ["src/**/*.test.ts"] },
  { cwd: "packages/auth", args: ["src/__tests__/*.test.ts"] },
  { cwd: "packages/logger", args: ["src/**/*.test.ts"] },
  { cwd: "apps/web", args: ["tests/**/*.test.ts"] },
  { cwd: "packages/database", args: ["src/**/*.test.ts", "test/**/*.test.ts"] },
  { cwd: "packages/queue", args: ["tests/**/*.test.ts"] },
  { cwd: "packages/utils", args: ["src/__tests__/*.test.ts"] },
  { cwd: "apps/api", args: ["tests/**/*.test.ts", "test/**/*.test.ts"] },
  { cwd: "packages/testing", args: ["src/**/*.test.ts"] },
  { cwd: "apps/worker", args: ["src/**/*.test.ts", "test/**/*.test.ts"] }
];

// packages/testing exercises the database runtime through the package surface,
// and queue tests consume shared-types from its built package export.
// We bootstrap both builds once before the workspace test sweep.
runPnpm(["--filter", "@birthub/database", "build"]);
runPnpm(["--filter", "@birthub/shared-types", "build"]);

for (const workspace of coreTestWorkspaces) {
  run(portableNodeExecutable, ["--import", "tsx", "--test", ...workspace.args], {
    cwd: path.join(projectRoot, workspace.cwd)
  });
}
