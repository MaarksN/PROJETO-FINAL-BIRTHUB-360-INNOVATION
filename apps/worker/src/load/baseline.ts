import { createLogger } from "@birthub/logger";
const logger = createLogger("worker");
import { runParallelExecutionLoadTest } from "./parallelLoad.js";

async function main() {
  logger.info("Starting baseline run...");
  const metrics = await runParallelExecutionLoadTest(500);
  logger.info("Baseline metrics:");
  logger.info(metrics);
}

main().catch(console.error);
