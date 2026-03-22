import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";

let sdk: NodeSDK | undefined;

export function initializeWorkerOpenTelemetry(): void {
  const OTLP_URL = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (sdk || !OTLP_URL) {
    return;
  }

  sdk = new NodeSDK({
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-fs": {
          enabled: false
        }
      })
    ],
    resource: resourceFromAttributes({
      "service.name": process.env.OTEL_SERVICE_NAME || "birthub-worker"
    }),
    traceExporter: new OTLPTraceExporter({
      url: `${OTLP_URL.replace(/\/$/, "")}/v1/traces`
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: `${OTLP_URL.replace(/\/$/, "")}/v1/metrics`
      }),
      exportIntervalMillis: 10000,
    })
  });

  sdk.start();
}

export async function shutdownWorkerOpenTelemetry(): Promise<void> {
  if (!sdk) {
    return;
  }

  await sdk.shutdown();
  sdk = undefined;
}
