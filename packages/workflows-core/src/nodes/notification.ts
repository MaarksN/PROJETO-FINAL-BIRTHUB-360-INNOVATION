import { interpolateValue } from "../interpolation/interpolate.js";
import type { WorkflowRuntimeContext } from "../types.js";

export interface NotificationConfig {
  channel: "email" | "inapp";
  message: string;
  to: string;
}

export interface NotificationDispatcher {
  send: (message: NotificationConfig) => Promise<void>;
}

export async function executeNotificationNode(
  config: NotificationConfig,
  context: WorkflowRuntimeContext,
  dispatcher?: NotificationDispatcher
): Promise<{
  delivered: boolean;
  payload: NotificationConfig;
}> {
  const payload = interpolateValue(config, context);

  if (dispatcher) {
    await dispatcher.send(payload);
  }

  return {
    delivered: true,
    payload
  };
}

