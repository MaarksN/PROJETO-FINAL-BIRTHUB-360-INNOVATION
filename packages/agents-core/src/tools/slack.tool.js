const SLACK_REQUEST_TIMEOUT_MS = 10_000;
async function postWithTimeout(url, init) {
    return fetch(url, {
        ...init,
        signal: AbortSignal.timeout(SLACK_REQUEST_TIMEOUT_MS)
    });
}
export async function postSlackMessage(input, options) {
    if (options?.simulate ?? true) {
        return {
            mode: input.mode,
            ok: true,
            ts: new Date().toISOString()
        };
    }
    if (input.mode === "webhook") {
        if (!input.webhookUrl) {
            throw new Error("webhookUrl is required for Slack webhook mode.");
        }
        const response = await postWithTimeout(input.webhookUrl, {
            body: JSON.stringify({ channel: input.channel, text: input.text }),
            headers: { "content-type": "application/json" },
            method: "POST"
        });
        if (!response.ok) {
            throw new Error(`Slack webhook failed with status ${response.status}.`);
        }
        return {
            mode: input.mode,
            ok: true,
            ts: new Date().toISOString()
        };
    }
    if (!input.token) {
        throw new Error("token is required for Slack API mode.");
    }
    const response = await postWithTimeout("https://slack.com/api/chat.postMessage", {
        body: JSON.stringify({ channel: input.channel, text: input.text }),
        headers: {
            authorization: `Bearer ${input.token}`,
            "content-type": "application/json"
        },
        method: "POST"
    });
    if (!response.ok) {
        throw new Error(`Slack API failed with status ${response.status}.`);
    }
    return {
        mode: input.mode,
        ok: true,
        ts: new Date().toISOString()
    };
}
