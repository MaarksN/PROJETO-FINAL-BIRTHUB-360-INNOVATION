// 
import { createHmac } from "node:crypto";
import CircuitBreaker from "opossum";
import { LRUCache } from "lru-cache";
import { interpolateValue } from "../interpolation/interpolate.js";
function assertSafeUrl(rawUrl) {
    const parsed = new URL(rawUrl);
    const normalizedHost = parsed.hostname.toLowerCase();
    const blockedHosts = new Set([
        "localhost",
        "0.0.0.0",
        "127.0.0.1",
        "::1",
        "host.docker.internal"
    ]);
    if (blockedHosts.has(normalizedHost)) {
        throw new Error("SSRF_GUARD_BLOCKED_HOST");
    }
    if (normalizedHost.endsWith(".internal")) {
        throw new Error("SSRF_GUARD_BLOCKED_INTERNAL_DOMAIN");
    }
    return parsed;
}
function parseResponseBody(response) {
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
        return response.json();
    }
    return response.text();
}
const fetchWithTimeout = async (url, options, timeoutMs) => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
        controller.abort();
    }, timeoutMs);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        return response;
    }
    finally {
        clearTimeout(timer);
    }
};
const circuitBreakers = new LRUCache({
    max: 1000,
    ttl: 1000 * 60 * 60 // 1 hour
});
function getCircuitBreaker(host) {
    let breaker = circuitBreakers.get(host);
    if (!breaker) {
        breaker = new CircuitBreaker(fetchWithTimeout, {
            errorThresholdPercentage: 50,
            resetTimeout: 30000,
            timeout: 10000, // Timeout max per fetch logic
            volumeThreshold: 5 // Need at least 5 failures before opening
        });
        circuitBreakers.set(host, breaker);
    }
    return breaker;
}
export async function executeHttpRequestNode(config, context, rateLimiter) {
    const interpolated = interpolateValue(config, context);
    const safeUrl = assertSafeUrl(interpolated.url);
    const timeoutMs = Math.min(Math.max(interpolated.timeout_ms ?? 2500, 1), 10_000);
    const headers = new Headers(interpolated.headers ?? {});
    if (interpolated.auth?.bearer) {
        headers.set("Authorization", `Bearer ${interpolated.auth.bearer}`);
    }
    const hasBody = interpolated.body !== undefined && interpolated.method !== "GET";
    if (hasBody && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }
    if (hasBody && interpolated.webhookSecret) {
        const payload = JSON.stringify(interpolated.body);
        const signature = createHmac("sha256", interpolated.webhookSecret).update(payload).digest("hex");
        headers.set("X-BirthHub-Signature", signature);
    }
    if (rateLimiter) {
        // 10 requests per second per tenant per host
        await rateLimiter.consume(`httpreq:${context.tenantId}:${safeUrl.host}`, 10, 1);
    }
    const breaker = getCircuitBreaker(safeUrl.host);
    const response = await breaker.fire(safeUrl.toString(), {
        body: hasBody ? JSON.stringify(interpolated.body) : null,
        headers,
        method: interpolated.method ?? "GET"
    }, timeoutMs);
    const responseBody = await parseResponseBody(response);
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
    });
    return {
        body: responseBody,
        headers: responseHeaders,
        status: response.status
    };
}
