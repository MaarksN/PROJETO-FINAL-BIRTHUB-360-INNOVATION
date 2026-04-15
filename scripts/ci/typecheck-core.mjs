#!/usr/bin/env node

import path from "node:path";

import { portableNodeExecutable, projectRoot, run } from "./shared.mjs";

const typescriptCli = path.join(projectRoot, "node_modules", "typescript", "bin", "tsc");

const coreTypecheckWorkspaces = [
  "packages/config",
  "packages/workflows-core",
  "packages/agents-core",
  "packages/shared-types",
  "packages/auth",
  "packages/logger",
  "apps/web",
  "packages/database",
  "packages/queue",
  "packages/utils",
  "apps/api",
  "packages/testing",
  "apps/worker"
];

for (const workspacePath of coreTypecheckWorkspaces) {
  run(portableNodeExecutable, [typescriptCli, "-p", "tsconfig.json", "--noEmit"], {
    cwd: path.join(projectRoot, workspacePath)
  });
}
