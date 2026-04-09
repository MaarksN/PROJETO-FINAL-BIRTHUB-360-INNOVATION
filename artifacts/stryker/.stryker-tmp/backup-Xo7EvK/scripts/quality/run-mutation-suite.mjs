import { portableNodeExecutable, run } from "../ci/shared.mjs";

const tasks = [
  {
    label: "@birthub/auth",
    args: ["--import", "tsx", "--test", "packages/auth/src/__tests__/*.test.ts"]
  },
  {
    label: "@birthub/agents-core",
    args: ["--import", "tsx", "--test", "packages/agents-core/src/**/*.test.ts"]
  },
  {
    label: "@birthub/api auth",
    args: ["--import", "tsx", "--test", "apps/api/tests/auth.test.ts"]
  }
];

for (const task of tasks) {
  console.log(`[mutation-suite] running ${task.label}`);
  run(portableNodeExecutable, task.args);
}
