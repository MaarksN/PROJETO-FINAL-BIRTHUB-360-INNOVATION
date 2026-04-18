// @ts-expect-error TODO: remover suppressão ampla
// 
import assert from "node:assert/strict";
import test from "node:test";
import { BillingEventStatus, prisma } from "@birthub/database";
import express from "express";
import request from "supertest";
import Stripe from "stripe";
import { setCacheStoreForTests } from "../src/common/cache/cache-store.js";
import { errorHandler } from "../src/middleware/error-handler.js";
import { STRIPE_API_VERSION } from "../src/modules/billing/stripe.client.js";
import { createStripeWebhookRouter } from "../src/modules/webhooks/stripe.router.js";
import { createTestApiConfig } from "./test-config.js";
function stubMethod(target, key, value) {
    const original = Reflect.get(target, key);
    Reflect.set(target, key, value);
    return () => {
        Reflect.set(target, key, original);
    };
}
function applyUpdateData(current, data) {
    const next = { ...current };
    for (const [key, value] of Object.entries(data)) {
        if (value &&
            typeof value === "object" &&
            "increment" in value &&
            typeof value.increment === "number") {
            next[key] = Number(next[key] ?? 0) + Number(value.increment);
            continue;
        }
        next[key] = value;
    }
    return next;
}
function stringValue(value, fallback = "") {
    return typeof value === "string" ? value : fallback;
}
function createBillingEventHarness(operations) {
    const billingEvents = new Map();
    return {
        billingEvents,
        restores: [
            stubMethod(prisma.billingEvent, "findUnique", (args) => {
                const eventId = args.where?.stripeEventId ?? "";
                return Promise.resolve(billingEvents.get(eventId) ?? null);
            }),
            stubMethod(prisma.billingEvent, "create", (args) => {
                const eventId = stringValue(args.data?.stripeEventId, "evt_unknown");
                operations?.push("create");
                const record = {
                    attemptCount: 0,
                    id: "billing_event_1",
                    status: BillingEventStatus.received,
                    ...args.data
                };
                billingEvents.set(eventId, record);
                return Promise.resolve(record);
            }),
            stubMethod(prisma.billingEvent, "update", (args) => {
                const eventId = args.where?.stripeEventId ?? "";
                const current = billingEvents.get(eventId) ?? {
                    attemptCount: 0,
                    id: "billing_event_1",
                    stripeEventId: eventId
                };
                const next = applyUpdateData(current, args.data ?? {});
                if (next.status === BillingEventStatus.processing) {
                    operations?.push("processing");
                }
                if (next.status === BillingEventStatus.processed) {
                    operations?.push("processed");
                }
                if (next.status === BillingEventStatus.failed) {
                    operations?.push("failed");
                }
                billingEvents.set(eventId, next);
                return Promise.resolve(next);
            }),
            stubMethod(prisma, "$transaction", (callback) => callback(prisma))
        ]
    };
}
function createRecordingCacheStore() {
    const values = new Map();
    const writes = [];
    const store = {
        del(...keys) {
            for (const key of keys) {
                values.delete(key);
            }
            return Promise.resolve(keys.length);
        },
        get(key) {
            return Promise.resolve(values.get(key) ?? null);
        },
        set(key, value, ttlSeconds) {
            writes.push({
                key,
                ttlSeconds,
                value
            });
            values.set(key, value);
            return Promise.resolve();
        }
    };
    return {
        store,
        writes
    };
}
function createWebhookApp(config, dependencies) {
    const app = express();
    app.use("/api/webhooks", createStripeWebhookRouter(config, dependencies));
    app.use(errorHandler);
    return app;
}
void test("stripe webhook rejects events outside the replay window", async () => {
    const config = createTestApiConfig();
    const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
        apiVersion: STRIPE_API_VERSION
    });
    let billingEventCreated = false;
    const payload = JSON.stringify({
        data: {
            object: {
                id: "pi_replay"
            }
        },
        id: "evt_replay_old",
        object: "event",
        type: "payment_intent.created"
    });
    const signature = stripe.webhooks.generateTestHeaderString({
        payload,
        secret: config.STRIPE_WEBHOOK_SECRET,
        timestamp: Math.floor(Date.now() / 1000) - config.STRIPE_WEBHOOK_TOLERANCE_SECONDS - 15
    });
    const restores = [
        stubMethod(prisma.billingEvent, "create", () => {
            billingEventCreated = true;
            return Promise.resolve({ id: "billing_event_1" });
        })
    ];
    try {
        const app = createWebhookApp(config);
        await request(app)
            .post("/api/webhooks/stripe")
            .set("stripe-signature", signature)
            .set("content-type", "application/json")
            .send(payload)
            .expect(400);
        assert.equal(billingEventCreated, false);
    }
    finally {
        for (const restore of restores.reverse()) {
            restore();
        }
    }
});
void test("stripe webhook marks billing event as failed when domain processing errors", async () => {
    const config = createTestApiConfig();
    const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
        apiVersion: STRIPE_API_VERSION
    });
    const billingEventHarness = createBillingEventHarness();
    const payload = JSON.stringify({
        data: {
            object: {
                id: "pi_failure"
            }
        },
        id: "evt_processing_failure",
        object: "event",
        type: "payment_intent.created"
    });
    const signature = stripe.webhooks.generateTestHeaderString({
        payload,
        secret: config.STRIPE_WEBHOOK_SECRET
    });
    try {
        const app = createWebhookApp(config, {
            processStripeBillingEvent: () => {
                throw new Error("domain failed");
            }
        });
        await request(app)
            .post("/api/webhooks/stripe")
            .set("stripe-signature", signature)
            .set("content-type", "application/json")
            .send(payload)
            .expect(500);
        const persistedEvent = billingEventHarness.billingEvents.get("evt_processing_failure");
        assert.equal(persistedEvent?.status, BillingEventStatus.failed);
        assert.equal(persistedEvent?.attemptCount, 1);
        assert.match(stringValue(persistedEvent?.lastError), /domain failed/);
    }
    finally {
        for (const restore of billingEventHarness.restores.reverse()) {
            restore();
        }
    }
});
void test("stripe webhook persists the raw event before invoking domain processing and writes idempotency TTL", async () => {
    const config = createTestApiConfig();
    const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
        apiVersion: STRIPE_API_VERSION
    });
    const operations = [];
    const billingEventHarness = createBillingEventHarness(operations);
    const cacheStore = createRecordingCacheStore();
    const payload = JSON.stringify({
        data: {
            object: {
                id: "pi_audit"
            }
        },
        id: "evt_audit_order",
        object: "event",
        type: "payment_intent.created"
    });
    const signature = stripe.webhooks.generateTestHeaderString({
        payload,
        secret: config.STRIPE_WEBHOOK_SECRET
    });
    setCacheStoreForTests(cacheStore.store);
    try {
        const app = createWebhookApp(config, {
            processStripeBillingEvent: ({ event }) => {
                operations.push("domain");
                assert.equal(billingEventHarness.billingEvents.get(event.id)?.status, BillingEventStatus.processing);
                return Promise.resolve({});
            }
        });
        await request(app)
            .post("/api/webhooks/stripe")
            .set("stripe-signature", signature)
            .set("content-type", "application/json")
            .send(payload)
            .expect(200);
        assert.deepEqual(operations.slice(0, 3), ["create", "processing", "domain"]);
        assert.deepEqual(cacheStore.writes, [
            {
                key: "idempotency:stripe_webhook:evt_audit_order",
                ttlSeconds: 86400,
                value: "processed"
            }
        ]);
    }
    finally {
        setCacheStoreForTests(null);
        for (const restore of billingEventHarness.restores.reverse()) {
            restore();
        }
    }
});

