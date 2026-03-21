import { performance } from "node:perf_hooks";

import type { NextFunction, Request, Response } from "express";

type MetricLabels = Record<string, string>;

const requestCounters = new Map<string, number>();
const jobCounters = new Map<string, number>();
const storageGauges = new Map<string, number>();

// Novas métricas (F7)
const dbPoolGauges = new Map<string, number>();
const llmCounters = new Map<string, number>();
const workerGauges = new Map<string, number>();
const businessCounters = new Map<string, number>();

function serializeMetricKey(name: string, labels: MetricLabels): string {
  const stableLabels = Object.entries(labels)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}="${value.replace(/"/g, '\\"')}"`)
    .join(",");

  return stableLabels ? `${name}{${stableLabels}}` : name;
}

function incrementMetric(store: Map<string, number>, name: string, labels: MetricLabels, amount = 1): void {
  const key = serializeMetricKey(name, labels);
  store.set(key, (store.get(key) ?? 0) + amount);
}

function setMetric(store: Map<string, number>, name: string, labels: MetricLabels, value: number): void {
  const key = serializeMetricKey(name, labels);
  store.set(key, value);
}

function renderMetricSection(type: "counter" | "gauge", name: string, help: string, store: Map<string, number>): string {
  const lines = [`# HELP ${name} ${help}`, `# TYPE ${name} ${type}`];

  for (const [key, value] of store.entries()) {
    lines.push(`${key} ${value}`);
  }

  return lines.join("\n");
}

export function recordTenantJobMetric(tenantId: string, jobName: string): void {
  incrementMetric(jobCounters, "birthub_tenant_jobs_total", {
    job_name: jobName,
    tenant_id: tenantId
  });
}

export function setTenantStorageMetric(tenantId: string, bytes: number): void {
  setMetric(storageGauges, "birthub_tenant_storage_bytes", { tenant_id: tenantId }, bytes);
}

export function setDbConnectionPoolUsage(connections: number): void {
  setMetric(dbPoolGauges, "birthub_db_pool_usage", {}, connections);
}

export function recordLlmMetrics(provider: string, tokens: number, latencyMs: number, isError = false): void {
  incrementMetric(llmCounters, "birthub_llm_tokens_total", { provider }, tokens);
  incrementMetric(llmCounters, "birthub_llm_latency_ms_total", { provider }, latencyMs);
  if (isError) {
    incrementMetric(llmCounters, "birthub_llm_errors_total", { provider }, 1);
  }
}

export function recordBusinessMetric(metricType: "active_tenants" | "billing_processed" | "agents_running", amount = 1): void {
  incrementMetric(businessCounters, "birthub_business_metrics_total", { type: metricType }, amount);
}

export function setWorkerQueueMetrics(queueName: string, waitTimeMs: number, processingTimeMs: number, dlqSize: number): void {
  setMetric(workerGauges, "birthub_queue_wait_time_ms", { queue: queueName }, waitTimeMs);
  setMetric(workerGauges, "birthub_queue_processing_time_ms", { queue: queueName }, processingTimeMs);
  setMetric(workerGauges, "birthub_queue_dlq_size", { queue: queueName }, dlqSize);
}

function resolveRoutePath(request: Request): string {
  // Express types `route` as `any`; we narrow it explicitly to avoid unsafe member access
  const route = request.route as { path?: string } | undefined;
  return route?.path ?? request.path;
}

export function metricsMiddleware(request: Request, response: Response, next: NextFunction): void {
  const startedAt = performance.now();

  response.on("finish", () => {
    incrementMetric(requestCounters, "birthub_tenant_requests_total", {
      method: request.method,
      route: resolveRoutePath(request),
      status: String(response.statusCode),
      tenant_id: request.context.tenantId ?? "anonymous"
    });

    incrementMetric(requestCounters, "birthub_tenant_request_duration_ms_total", {
      method: request.method,
      route: resolveRoutePath(request),
      tenant_id: request.context.tenantId ?? "anonymous"
    }, Math.round(performance.now() - startedAt));
  });

  next();
}

export function metricsHandler(_request: Request, response: Response): void {
  response
    .type("text/plain; version=0.0.4")
    .send(
      [
        renderMetricSection(
          "counter",
          "birthub_tenant_requests_total",
          "Total HTTP requests grouped by tenant.",
          requestCounters
        ),
        renderMetricSection(
          "counter",
          "birthub_tenant_jobs_total",
          "Total worker jobs grouped by tenant.",
          jobCounters
        ),
        renderMetricSection(
          "gauge",
          "birthub_tenant_storage_bytes",
          "Current storage footprint estimate grouped by tenant.",
          storageGauges
        ),
        renderMetricSection(
          "gauge",
          "birthub_db_pool_usage",
          "Database connection pool usage.",
          dbPoolGauges
        ),
        renderMetricSection(
          "counter",
          "birthub_llm_tokens_total",
          "LLM tokens usage and latency metrics.",
          llmCounters
        ),
        renderMetricSection(
          "gauge",
          "birthub_queue_wait_time_ms",
          "Worker queue depth and processing time metrics.",
          workerGauges
        ),
        renderMetricSection(
          "counter",
          "birthub_business_metrics_total",
          "High level business tracking metrics.",
          businessCounters
        )
      ].join("\n")
    );
}
