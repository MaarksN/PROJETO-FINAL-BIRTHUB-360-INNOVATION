#!/usr/bin/env node

import path from "node:path";

import { projectRoot, run } from "./shared.mjs";

const eslintCli = path.join(
  projectRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "eslint.cmd" : "eslint"
);

const coreLintWorkspaces = [
  { cwd: "packages/config", args: ["."] },
  { cwd: "packages/workflows-core", args: [".", "--config", "eslint.config.mjs"] },
  { cwd: "packages/agents-core", args: ["."] },
  { cwd: "packages/shared-types", args: ["."] },
  { cwd: "packages/auth", args: ["."] },
  { cwd: "packages/logger", args: ["."] },
  { cwd: "apps/web", args: ["."] },
  { cwd: "packages/database", args: ["."] },
  { cwd: "packages/queue", args: ["."] },
  { cwd: "packages/utils", args: ["."] },
  { cwd: "apps/api", args: ["."] },
  { cwd: "packages/testing", args: ["."] },
  { cwd: "apps/worker", args: ["."] }
];

for (const workspace of coreLintWorkspaces) {
  run(eslintCli, workspace.args, {
    cwd: path.join(projectRoot, workspace.cwd)
  });
}
