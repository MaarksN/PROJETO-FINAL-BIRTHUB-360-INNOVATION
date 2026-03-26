import { runParallelExecutionLoadTest } from "./parallelLoad.js";

async function main() {
  const executions = 100000;

  const start = performance.now();
  const metrics = await runParallelExecutionLoadTest(executions);
  const end = performance.now();

  console.error(`\n\n=== BENCHMARK RESULTS ===`);
  console.error(`Total benchmark time: ${(end - start).toFixed(2)}ms`);
  console.error('Metrics:');
  console.error(`- Success Count: ${metrics.successCount}`);
  console.error(`- Total Time (internal): ${metrics.totalMs.toFixed(2)}ms`);
  console.error(`- p50: ${metrics.p50Ms.toFixed(2)}ms`);
  console.error(`- p95: ${metrics.p95Ms.toFixed(2)}ms`);
  console.error(`- p99: ${metrics.p99Ms.toFixed(2)}ms`);
}

main().catch(console.error);
