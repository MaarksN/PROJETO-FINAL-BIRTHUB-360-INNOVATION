import type { CalendarResult } from "../calendar.tool";
import type { CrmResult } from "../crm.tool";
import type { EmailSendResult } from "../email.tool";
import type { SlackMessageResult } from "../slack.tool";
import type { StorageResult } from "../storage.tool";

export const connectorMocks = {
  calendar: {
    action: "create_event",
    eventId: "evt_mock",
    provider: "ics",
    raw: "BEGIN:VCALENDAR..."
  } satisfies CalendarResult,
  crm: {
    action: "create_lead",
    endpoint: "/crm/v3/objects/leads",
    provider: "hubspot",
    status: "ok"
  } satisfies CrmResult,
  email: {
    bounced: false,
    messageId: "mock_message",
    provider: "smtp",
    retries: 0
  } satisfies EmailSendResult,
  slack: {
    mode: "webhook",
    ok: true,
    ts: "2026-03-13T00:00:00.000Z"
  } satisfies SlackMessageResult,
  storage: {
    action: "upload",
    key: "reports/mock.md",
    provider: "s3",
    signedUrl: "https://s3.amazonaws.com/bucket/reports/mock.md?signature=mock"
  } satisfies StorageResult
};
