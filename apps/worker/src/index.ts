import { createServer } from "node:http";
import { createRequire } from "node:module";

import { getWorkerConfig } from "@birthub/config";
import { createLogger } from "@birthub/logger";

const require = createRequire(import.meta.url);

try {
  const { NodeSDK } = require("@opentelemetry/sdk-node");
  const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
  const { OTLPMetricExporter } = require("@opentelemetry/exporter-metrics-otlp-http");
  const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
  const { PeriodicExportingMetricReader } = require("@opentelemetry/sdk-metrics");
  const { W3CTraceContextPropagator } = require("@opentelemetry/core");
  const otelApi = require("@opentelemetry/api");

  if (otelApi) {
    otelApi.propagation.setGlobalPropagator(new W3CTraceContextPropagator());
  }

  const sdk = new NodeSDK({
    serviceName: "birthub-worker",
    traceExporter: new OTLPTraceExporter({ url: process.env.OTLP_TRACE_URL || "http://localhost:4318/v1/traces" }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({ url: process.env.OTLP_METRIC_URL || "http://localhost:4318/v1/metrics" }),
      exportIntervalMillis: 10000,
    }),
    instrumentations: [getNodeAutoInstrumentations()]
  });

  sdk.start();
} catch (error) {
  console.warn("OpenTelemetry SDK not initialized in worker:", error);
}

import {
  evaluateFailRateAlerts,
  LoggingFailRateNotifier,
  NoopFailRateMetricsSource
} from "./alerts/failRateAlert.js";
import { startCycle2Jobs } from "./jobs/scheduler.js";
import { cleanupSuspendedUsers } from "./jobs/userCleanup.js";
import { createBirthHubWorker } from "./worker.js";

const config = getWorkerConfig();
const logger = createLogger("worker-bootstrap");
const runtime = createBirthHubWorker();
const cleanupIntervalMs = 24 * 60 * 60 * 1000;
const failRateIntervalMs = 5 * 60 * 1000;
const failRateMetricsSource = new NoopFailRateMetricsSource();
const failRateNotifier = new LoggingFailRateNotifier();
const cycle2Jobs = startCycle2Jobs();
const healthServer = createServer((request, response) => {
  if (request.url !== "/health") {
    response.writeHead(404).end();
    return;
  }

  response.writeHead(200, {
    "content-type": "application/json"
  });
  response.end(
    JSON.stringify({
      checkedAt: new Date().toISOString(),
      queueName: config.QUEUE_NAME,
      status: "ok",
      workerConcurrency: config.WORKER_CONCURRENCY
    })
  );
});
const cleanupTimer = setInterval(() => {
  void cleanupSuspendedUsers()
    .then((result) => {
      logger.info(result, "Suspended users cleanup executed");
    })
    .catch((error) => {
      logger.error({ error }, "Suspended users cleanup failed");
    });
}, cleanupIntervalMs);
const failRateTimer = setInterval(() => {
  void evaluateFailRateAlerts({
    notifier: failRateNotifier,
    source: failRateMetricsSource,
    threshold: 0.2,
    windowMinutes: 5
  }).catch((error) => {
    logger.error({ error }, "Fail-rate alert evaluation failed");
  });
}, failRateIntervalMs);

void cleanupSuspendedUsers()
  .then((result) => {
    logger.info(result, "Initial suspended users cleanup executed");
  })
  .catch((error) => {
    logger.error({ error }, "Initial suspended users cleanup failed");
  });

logger.info(
  {
    concurrency: config.WORKER_CONCURRENCY,
    healthPort: config.WORKER_HEALTH_PORT,
    queueName: config.QUEUE_NAME,
    queues: runtime.workers.map((worker) => worker.name)
  },
  "BirthHub360 worker online"
);

healthServer.listen(config.WORKER_HEALTH_PORT, () => {
  logger.info({ healthPort: config.WORKER_HEALTH_PORT }, "Worker health server online");
});

let isShuttingDown = false;

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  logger.info({ signal }, "Shutting down worker");
  clearInterval(cleanupTimer);
  clearInterval(failRateTimer);
  await new Promise<void>((resolve, reject) => {
    healthServer.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
  await cycle2Jobs.stop();
  await runtime.close();
  logger.info({ signal }, "Worker shutdown completed");
}

process.once("SIGINT", () => {
  void shutdown("SIGINT");
});

process.once("SIGTERM", () => {
  void shutdown("SIGTERM");
});
