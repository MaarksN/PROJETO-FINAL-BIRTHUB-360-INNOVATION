import { runParallelExecutionLoadTest } from "./parallelLoad.js";

async function main() {
  console.log("Starting baseline run...");
  const metrics = await runParallelExecutionLoadTest(500);
  console.log("Baseline metrics:");
  console.log(metrics);
}

main().catch(console.error);
