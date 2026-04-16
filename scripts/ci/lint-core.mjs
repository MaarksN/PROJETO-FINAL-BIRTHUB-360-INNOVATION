#!/usr/bin/env node

import path from "node:path";

import { portableNodeExecutable, projectRoot, run } from "./shared.mjs";

const eslintCli = path.join(
  projectRoot,
  "node_modules",
  "eslint",
  "bin",
  "eslint.js"
);

const REQUIRED_LINT_NODE_OPTION = "--max-old-space-size=8192";

function withLintNodeOptions(existingNodeOptions = process.env.NODE_OPTIONS ?? "") {
  if (existingNodeOptions.includes("--max-old-space-size")) {
    return existingNodeOptions;
  }

  return [existingNodeOptions.trim(), REQUIRED_LINT_NODE_OPTION].filter(Boolean).join(" ");
}

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
  run(portableNodeExecutable, [eslintCli, ...workspace.args], {
    cwd: path.join(projectRoot, workspace.cwd),
    env: {
      NODE_OPTIONS: withLintNodeOptions()
    }
  });
}
