import { setTimeout as sleep } from "node:timers/promises";
import { randomUUID } from "node:crypto";
class MockSmtpAdapter {
    send(input) {
        const bounced = input.to.endsWith("@bounce.test");
        return Promise.resolve({
            bounced,
            messageId: `smtp_${Date.now()}_${randomUUID()}`
        });
    }
}
class MockSendgridAdapter {
    send(input) {
        const bounced = input.to.endsWith("@bounce.test");
        return Promise.resolve({
            bounced,
            messageId: `sendgrid_${Date.now()}_${randomUUID()}`
        });
    }
}
const defaultAdapters = {
    sendgrid: new MockSendgridAdapter(),
    smtp: new MockSmtpAdapter()
};
function isRateLimitError(error) {
    if (!(error instanceof Error)) {
        return false;
    }
    return /rate|429|limit/i.test(error.message);
}
export async function sendEmail(input, options) {
    const adapters = { ...defaultAdapters, ...(options?.adapters ?? {}) };
    const maxRetries = Math.max(options?.maxRetries ?? 2, 0);
    const adapter = adapters[input.provider];
    if (!adapter) {
        throw new Error(`No email adapter configured for provider '${input.provider}'.`);
    }
    let attempt = 0;
    while (attempt <= maxRetries) {
        try {
            const result = await adapter.send(input);
            return {
                bounced: result.bounced,
                messageId: result.messageId,
                provider: input.provider,
                retries: attempt
            };
        }
        catch (error) {
            if (attempt >= maxRetries || !isRateLimitError(error)) {
                throw error;
            }
            attempt += 1;
            await sleep(50 * attempt);
        }
    }
    throw new Error("Unexpected email retry state.");
}
