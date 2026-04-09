import path from "node:path";

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */

const portableNodeExecutable = path.resolve(".tools", "node-v24.14.0-win-x64", "node.exe");

const mutationSuiteCommand =
  process.platform === "win32"
    ? `"${portableNodeExecutable}" scripts/quality/run-mutation-suite.mjs`
    : "node scripts/quality/run-mutation-suite.mjs";

export default {
  $schema: "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  cleanTempDir: "always",
  commandRunner: {
    command: mutationSuiteCommand
  },
  concurrency: 4,
  coverageAnalysis: "off",
  htmlReporter: {
    fileName: "artifacts/stryker/mutation.html"
  },
  ignorePatterns: [
    ".git/**",
    ".next/**",
    ".pytest_cache/**",
    ".tools/**",
    ".turbo/**",
    "**/dist/**",
    "apps/legacy/**",
    "artifacts/**",
    "audit/**",
    "coverage/**",
    "docs/**",
    "logs/**",
    "packages/*/docs/**",
    "node_modules/**",
    "test-results/**"
  ],
  // Keep mutation runs outside the working tree while disabling node_modules
  // symlink discovery on Windows, which walks inaccessible cache folders.
  inPlace: false,
  jsonReporter: {
    fileName: "artifacts/stryker/mutation.json"
  },
  mutate: [
    "packages/auth/index.ts",
    "packages/agents-core/src/manifest/catalog.ts",
    "packages/agents-core/src/manifest/parser.ts",
    "packages/agents-core/src/parser/manifestParser.ts",
    "packages/agents-core/src/schemas/manifest.schema.ts",
    "packages/agents-core/src/tools/slack.tool.ts"
  ],
  reporters: ["clear-text", "html", "json"],
  symlinkNodeModules: process.platform !== "win32",
  tempDirName: ".tools/stryker-tmp",
  testRunner: "command",
  thresholds: {
    break: 60,
    high: 80,
    low: 70
  },
  tsconfigFile: "tsconfig.json"
};
