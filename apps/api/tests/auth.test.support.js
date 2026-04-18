import assert from "node:assert/strict";
import { createApp } from "../src/app.js";
import { createTestApiConfig } from "./test-config.js";
export function stubMethod(target, key, value) {
    const original = Reflect.get(target, key);
    Reflect.set(target, key, value);
    return () => {
        Reflect.set(target, key, original);
    };
}
export function createAuthTestApp(config = createTestApiConfig()) {
    return createApp({
        config,
        healthService: () => Promise.resolve({
            checkedAt: new Date("2026-03-13T00:00:00.000Z").toISOString(),
            services: {
                database: { status: "up" },
                externalDependencies: [],
                redis: { status: "up" }
            },
            status: "ok"
        }),
        shouldExposeDocs: false
    });
}
export function readSetCookies(response) {
    const headerValue = response.headers["set-cookie"];
    return Array.isArray(headerValue)
        ? headerValue.filter((value) => typeof value === "string")
        : [];
}
export function assertAuthCookies(config, cookies) {
    for (const cookieName of [
        config.API_AUTH_COOKIE_NAME,
        config.API_AUTH_REFRESH_COOKIE_NAME,
        config.API_CSRF_COOKIE_NAME
    ]) {
        assert.ok(cookies.some((value) => value.startsWith(`${cookieName}=`)));
    }
}
