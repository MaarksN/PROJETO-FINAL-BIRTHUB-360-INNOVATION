import { AsyncLocalStorage } from "node:async_hooks";

import pino, { type Logger, type LoggerOptions } from "pino";

export interface LogContext {
  requestId?: string | null;
  tenantId?: string | null;
  userId?: string | null;
  jobId?: string | null;
  traceId?: string | null;
}

const logContextStore = new AsyncLocalStorage<LogContext>();

function normalizeContext(context: LogContext): Required<LogContext> {
  return {
    jobId: context.jobId ?? null,
    requestId: context.requestId ?? null,
    tenantId: context.tenantId ?? null,
    traceId: context.traceId ?? context.requestId ?? null,
    userId: context.userId ?? null
  };
}

export function getLogContext(): Required<LogContext> {
  return normalizeContext(logContextStore.getStore() ?? {});
}

export function runWithLogContext<T>(context: LogContext, callback: () => T): T {
  const current = getLogContext();
  return logContextStore.run(
    normalizeContext({
      ...current,
      ...context
    }),
    callback
  );
}

export function updateLogContext(context: LogContext): void {
  const current = getLogContext();
  logContextStore.enterWith(
    normalizeContext({
      ...current,
      ...context
    })
  );
}

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

let otelApi: any = null;
try {
  otelApi = require("@opentelemetry/api");
} catch {
  // Ignora se o OTEL não estiver disponível no escopo do package
}

export function createLogger(service: string, options?: LoggerOptions): Logger {
  const isProduction = process.env.NODE_ENV === "production";
  const loggerOptions: LoggerOptions = {
    ...options,
    base: {
      service
    },
    formatters: {
      level: (label) => ({
        level: label
      })
    },
    level: process.env.LOG_LEVEL ?? "info",
    messageKey: "message",
    mixin: () => {
      let activeTraceId: string | null = null;
      if (otelApi) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
          const spanContext = otelApi.trace.getSpanContext(otelApi.context.active());
          if (spanContext) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            activeTraceId = spanContext.traceId;
          }
        } catch {
          // Silently ignore if context API fails
        }
      }

      const logContext = getLogContext();
      if (activeTraceId && !logContext.traceId) {
        logContext.traceId = activeTraceId;
      }

      // Validação F7 para campos obrigatórios
      return {
        ...logContext,
        service,
        tenant_id: logContext.tenantId ?? "system",
        trace_id: logContext.traceId
      };
    },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`
  };

  if (!isProduction) {
    loggerOptions.transport = {
      options: {
        colorize: true,
        ignore: "pid,hostname",
        translateTime: "SYS:standard"
      },
      target: "pino-pretty"
    };
  }

  return pino(loggerOptions);
}
