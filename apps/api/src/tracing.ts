import { createRequire } from "node:module";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type OtelApi = any;

const require = createRequire(import.meta.url);

let otelApi: OtelApi = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let tracer: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  otelApi = require("@opentelemetry/api");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { NodeSDK } = require("@opentelemetry/sdk-node");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { OTLPMetricExporter } = require("@opentelemetry/exporter-metrics-otlp-http");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { PeriodicExportingMetricReader } = require("@opentelemetry/sdk-metrics");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { W3CTraceContextPropagator } = require("@opentelemetry/core");

  if (otelApi) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    otelApi.propagation.setGlobalPropagator(new W3CTraceContextPropagator());
  }

  // Setup SDK
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const sdk = new NodeSDK({
    serviceName: "birthub-api",
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    traceExporter: new OTLPTraceExporter({ url: process.env.OTLP_TRACE_URL || "http://localhost:4318/v1/traces" }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    metricReader: new PeriodicExportingMetricReader({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      exporter: new OTLPMetricExporter({ url: process.env.OTLP_METRIC_URL || "http://localhost:4318/v1/metrics" }),
      exportIntervalMillis: 10000,
    }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    instrumentations: [getNodeAutoInstrumentations()]
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  sdk.start();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const span = otelApi.trace.getSpan(otelApi.context.active());

  if (!span) {
    return;
  }

  if (input.tenantId) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    span.setAttribute("tenant.id", input.tenantId);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    span.setAttribute("tenant.force_sampled", forceSampledTenants.has(input.tenantId));
  }

  if (input.tenantSlug) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    span.setAttribute("tenant.slug", input.tenantSlug);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createCustomSpan(name: string, attributes: Record<string, string> = {}): any {
  if (!tracer) return { end: () => {} };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const span = tracer.startSpan(name);
  for (const [k, v] of Object.entries(attributes)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
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
