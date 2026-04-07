/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  $schema: "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  checkers: ["typescript"],
  commandRunner: {
    command: "node scripts/ci/run-pnpm.mjs test:mutation:run"
  },
  coverageAnalysis: "off",
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
