import { createLogger } from "@birthub/logger";
const logger = createLogger("worker");
import { runParallelExecutionLoadTest } from "./parallelLoad.js";
import { createLogger } from "@birthub/logger";

const logger = createLogger("worker-benchmark");

async function main() {
  const executions = 100000;

  const start = performance.now();
  const metrics = await runParallelExecutionLoadTest(executions);
  const end = performance.now();

  logger.error(`\n\n=== BENCHMARK RESULTS ===`);
  logger.error(`Total benchmark time: ${(end - start).toFixed(2)}ms`);
  logger.error('Metrics:');
  logger.error(`- Success Count: ${metrics.successCount}`);
  logger.error(`- Total Time (internal): ${metrics.totalMs.toFixed(2)}ms`);
  logger.error(`- p50: ${metrics.p50Ms.toFixed(2)}ms`);
  logger.error(`- p95: ${metrics.p95Ms.toFixed(2)}ms`);
  logger.error(`- p99: ${metrics.p99Ms.toFixed(2)}ms`);
}

main().catch((err) => logger.error(err));
