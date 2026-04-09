// @ts-nocheck
// 
import { EventEmitter } from "node:events";

import { createLogger } from "@birthub/logger";

const logger = createLogger("worker-internal-event-bus");
const bus = new EventEmitter();

export interface InternalEventPayload {
  event: string;
  payload: Record<string, unknown>;
  tenantId: string;
}

bus.on("tenant.churn_risk", (payload: InternalEventPayload) => {
  logger.warn(payload, "Internal churn-risk event emitted");
});

export function emitInternalEvent(input: InternalEventPayload): void {
  bus.emit(input.event, input);
}
