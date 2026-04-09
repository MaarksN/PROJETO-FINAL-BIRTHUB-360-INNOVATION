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
  concurrency: 2,
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
  // Keep mutation runs isolated from the working tree so interrupted sessions
  // never leave instrumented files behind.
  inPlace: false,
  jsonReporter: {
    fileName: "artifacts/stryker/mutation.json"
  },
  mutate: [
    "packages/auth/**/*.ts",
    "!packages/auth/src/__tests__/**/*.ts",
    "packages/agents-core/src/**/*.ts",
    "!**/*.d.ts",
    "!**/*.test.ts"
  ],
  reporters: ["clear-text", "html", "json"],
  symlinkNodeModules: false,
  tempDirName: "artifacts/stryker/.stryker-tmp",
  testRunner: "command",
  thresholds: {
    break: 60,
    high: 80,
    low: 70
  },
  tsconfigFile: "tsconfig.json"
};
