import { performance } from "node:perf_hooks";

async function mockRunWorkflowNow() {
  return new Promise((resolve) => setTimeout(resolve, 50));
}

async function runSequential(count: number) {
  const start = performance.now();
  for (let i = 0; i < count; i++) {
    await mockRunWorkflowNow();
  }
  return performance.now() - start;
}

async function runConcurrentChunked(count: number, limit: number) {
  const start = performance.now();
  const items = Array.from({ length: count });

  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);
    await Promise.all(chunk.map(() => mockRunWorkflowNow()));
  }
  return performance.now() - start;
}

async function main() {
  console.log("Starting benchmark...");
  const count = 50;

  const seqTime = await runSequential(count);
  console.log(`Sequential time: ${seqTime.toFixed(2)}ms`);

  const conTime = await runConcurrentChunked(count, 10);
  console.log(`Concurrent (chunked 10) time: ${conTime.toFixed(2)}ms`);
}

main().catch(console.error);
