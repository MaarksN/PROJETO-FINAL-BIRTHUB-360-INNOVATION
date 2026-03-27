import { runParallelExecutionLoadTest } from "./parallelLoad.js";
import { createLogger } from "@birthub/logger";

const logger = createLogger("worker-baseline");

async function main() {
  console.log("Starting baseline run...");
  const metrics = await runParallelExecutionLoadTest(500);
  console.log("Baseline metrics:");
  console.log(metrics);
}

main().catch((err) => logger.error(err));
