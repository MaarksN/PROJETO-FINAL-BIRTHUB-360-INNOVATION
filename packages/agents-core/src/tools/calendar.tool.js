import { randomUUID } from "node:crypto";
function generateIcs(input) {
    return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `UID:${randomUUID()}`,
        `SUMMARY:${input.summary ?? "Untitled"}`,
        `DTSTART:${(input.startAt ?? new Date().toISOString()).replace(/[-:]/g, "")}`,
        `DTEND:${(input.endAt ?? new Date(Date.now() + 3_600_000).toISOString()).replace(/[-:]/g, "")}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\n");
}
export function callCalendarTool(input, options) {
    if (!(options?.simulate ?? true)) {
        throw new Error("Live calendar calls are disabled in this environment.");
    }
    const raw = input.provider === "ics" ? generateIcs(input) : JSON.stringify({
        endAt: input.endAt,
        startAt: input.startAt,
        summary: input.summary
    });
    return Promise.resolve({
        action: input.action,
        eventId: `evt_${Date.now()}`,
        provider: input.provider,
        raw
    });
}
