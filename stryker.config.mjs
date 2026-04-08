/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  $schema: "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  appendPlugins: ["@stryker-mutator/typescript-checker"],
  checkers: ["typescript"],
  commandRunner: {
    command: "node scripts/ci/run-pnpm.mjs test:mutation:run"
  },
  coverageAnalysis: "off",
  ignorePatterns: [
    ".git/**",
    ".next/**",
    ".tools/**",
    ".turbo/**",
    "artifacts/**",
    "coverage/**",
    "docs/**",
    "node_modules/**",
    "test-results/**"
  ],
  mutate: [
    "packages/auth/src/**/*.ts",
    "packages/agents-core/src/**/*.ts",
    "apps/api/src/modules/auth/**/*.ts",
    "!**/*.d.ts",
    "!**/*.test.ts"
  ],
  reporters: ["clear-text", "html", "json"],
  tempDirName: "artifacts/stryker/.stryker-tmp",
  testRunner: "command",
  thresholds: {
    break: 60,
    high: 80,
    low: 70
  },
  tsconfigFile: "tsconfig.json"
};
