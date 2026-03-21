import { createRequire } from "node:module";

type OtelApi = {
  context: {
    active: () => unknown;
  };
  trace: {
    getSpan: (activeContext: unknown) => { setAttribute: (key: string, value: unknown) => void } | undefined;
  };
};

const require = createRequire(import.meta.url);

let otelApi: OtelApi | null = null;
let sdkNode: any = null;
let sdkMetrics: any = null;
let sdkResources: any = null;
let semanticConventions: any = null;
let autoInstrumentations: any = null;
let otlpTraceExporter: any = null;
let otlpMetricExporter: any = null;

try {
  otelApi = require("@opentelemetry/api") as OtelApi;
  sdkNode = require("@opentelemetry/sdk-node");
  sdkMetrics = require("@opentelemetry/sdk-metrics");
  sdkResources = require("@opentelemetry/resources");
  semanticConventions = require("@opentelemetry/semantic-conventions");
  autoInstrumentations = require("@opentelemetry/auto-instrumentations-node");
  otlpTraceExporter = require("@opentelemetry/exporter-trace-otlp-http");
  otlpMetricExporter = require("@opentelemetry/exporter-metrics-otlp-http");
} catch (error) {
  otelApi = null;
  console.warn("OpenTelemetry modules not found. Tracing will be disabled during tests.");
}

const forceSampledTenants = new Set<string>();

export function annotateTenantSpan(input: {
  tenantId?: string | null;
  tenantSlug?: string | null;
}): void {
  if (!otelApi) {
    return;
  }

  const span = otelApi.trace.getSpan(otelApi.context.active());

  if (!span) {
    return;
  }

  if (input.tenantId) {
    span.setAttribute("tenant.id", input.tenantId);
    span.setAttribute("tenant.force_sampled", forceSampledTenants.has(input.tenantId));
  }

  if (input.tenantSlug) {
    span.setAttribute("tenant.slug", input.tenantSlug);
  }
}

export function flagTenantForFullSampling(tenantId: string): void {
  forceSampledTenants.add(tenantId);
}

export function shouldForceTenantSampling(tenantId?: string | null): boolean {
  return Boolean(tenantId && forceSampledTenants.has(tenantId));
}

export function startTracing(serviceName: string) {
    if (!sdkNode || process.env.NODE_ENV === 'test') {
        return;
    }

    const { NodeSDK } = sdkNode;
    const { PeriodicExportingMetricReader } = sdkMetrics;
    const { Resource } = sdkResources;
    const { SEMRESATTRS_SERVICE_NAME } = semanticConventions;
    const { getNodeAutoInstrumentations } = autoInstrumentations;
    const { OTLPTraceExporter } = otlpTraceExporter;
    const { OTLPMetricExporter } = otlpMetricExporter;

    const sdk = new NodeSDK({
        resource: new Resource({
            [SEMRESATTRS_SERVICE_NAME]: serviceName,
        }),
        traceExporter: new OTLPTraceExporter({
            url: process.env.OTLP_TRACE_URL || 'http://localhost:4318/v1/traces',
        }),
        metricReader: new PeriodicExportingMetricReader({
            exporter: new OTLPMetricExporter({
                url: process.env.OTLP_METRIC_URL || 'http://localhost:4318/v1/metrics',
            }),
            exportIntervalMillis: 10000,
        }),
        instrumentations: [getNodeAutoInstrumentations()],
    });

    sdk.start();

    process.on('SIGTERM', () => {
        sdk
            .shutdown()
            .then(() => console.log('Tracing terminated'))
            .catch((error: any) => console.log('Error terminating tracing', error))
            .finally(() => process.exit(0));
    });
}
