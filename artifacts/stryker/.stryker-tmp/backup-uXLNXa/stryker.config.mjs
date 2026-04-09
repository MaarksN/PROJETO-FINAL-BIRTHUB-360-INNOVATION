/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
// @ts-nocheck

const mutationSuiteCommand =
  process.platform === "win32"
    ? ".\\.tools\\node-v24.14.0-win-x64\\node.exe scripts/quality/run-mutation-suite.mjs"
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
  inPlace: true,
  ignorePatterns: [
    ".git/**",
    ".next/**",
    ".pytest_cache/**",
    ".tools/**",
    ".turbo/**",
    "apps/dashboard/**",
    "apps/legacy/**",
    "artifacts/**",
    "audit/**",
    "coverage/**",
    "docs/**",
    "logs/**",
    "node_modules/**",
    "test-results/**"
  ],
  // On Windows, Stryker's node_modules symlink discovery walks inaccessible
  // cache directories like `.pytest_cache` and aborts before running mutants.
  symlinkNodeModules: process.platform !== "win32",
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
