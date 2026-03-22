import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { resourceFromAttributes } from "@opentelemetry/resources";
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';

const OTLP_URL = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318';

const metricExporter = new OTLPMetricExporter({
  url: `${OTLP_URL.replace(/\/$/, "")}/v1/metrics`,
});

const meterProvider = new MeterProvider({
  resource: resourceFromAttributes({
      "service.name": process.env.OTEL_SERVICE_NAME || "birthub-worker"
  }),
  readers: [
    new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: 10000,
    })
  ]
});

const meter = meterProvider.getMeter('birthub-worker-metrics');

export const workerQueueGauge = meter.createUpDownCounter('worker_queue_depth', {
  description: 'Current depth of the worker queue (BullMQ)',
});

export function updateWorkerQueueDepth(depth: number, queueName: string) {
  workerQueueGauge.add(depth, { queue: queueName });
}
