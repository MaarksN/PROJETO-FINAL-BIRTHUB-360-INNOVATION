import { createRequire } from "node:module";

type OtelApi = {
  context: {
    active: () => unknown;
  };
  trace: {
    getSpan: (activeContext: unknown) => { setAttribute: (key: string, value: unknown) => void } | undefined;
    getTracer: (name: string) => { startSpan: (name: string) => any } | undefined;
  };
  propagation: {
    setGlobalPropagator: (propagator: unknown) => void;
  };
};

const require = createRequire(import.meta.url);

let otelApi: OtelApi | null = null;
let tracer: any = null;

try {
  otelApi = require("@opentelemetry/api") as OtelApi;
  const { NodeSDK } = require("@opentelemetry/sdk-node");
  const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
  const { OTLPMetricExporter } = require("@opentelemetry/exporter-metrics-otlp-http");
  const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
  const { PeriodicExportingMetricReader } = require("@opentelemetry/sdk-metrics");
  const { W3CTraceContextPropagator } = require("@opentelemetry/core");

  if (otelApi) {
    otelApi.propagation.setGlobalPropagator(new W3CTraceContextPropagator());
  }

  // Setup SDK
  const sdk = new NodeSDK({
    serviceName: "birthub-api",
    traceExporter: new OTLPTraceExporter({ url: process.env.OTLP_TRACE_URL || "http://localhost:4318/v1/traces" }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({ url: process.env.OTLP_METRIC_URL || "http://localhost:4318/v1/metrics" }),
      exportIntervalMillis: 10000,
    }),
    instrumentations: [getNodeAutoInstrumentations()]
  });

  sdk.start();
  tracer = otelApi?.trace.getTracer("birthub-api-custom-tracer");

} catch {
  otelApi = null;
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

export function createCustomSpan(name: string, attributes: Record<string, string> = {}): any {
  if (!tracer) return { end: () => {} };
  const span = tracer.startSpan(name);
  for (const [k, v] of Object.entries(attributes)) {
    span.setAttribute(k, v);
  }
  return span;
}

export function flagTenantForFullSampling(tenantId: string): void {
  forceSampledTenants.add(tenantId);
}

export function shouldForceTenantSampling(tenantId?: string | null): boolean {
  return Boolean(tenantId && forceSampledTenants.has(tenantId));
}
