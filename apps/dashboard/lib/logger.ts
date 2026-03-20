// [SOURCE] BirthHub360 — Remediação Forense.html — GAP-DASH-003
type LogPayload = Record<string, unknown>;

function formatMessage(message: string, payload?: LogPayload): string {
  if (!payload) return message;
  return `${message} ${JSON.stringify(payload)}`;
}

export const dashboardLogger = {
  error(payload: LogPayload, message: string) {
    console.error(`[dashboard] ${formatMessage(message, payload)}`);
  },
  info(payload: LogPayload, message: string) {
    console.info(`[dashboard] ${formatMessage(message, payload)}`);
  },
  warn(payload: LogPayload, message: string) {
    console.warn(`[dashboard] ${formatMessage(message, payload)}`);
  }
};
