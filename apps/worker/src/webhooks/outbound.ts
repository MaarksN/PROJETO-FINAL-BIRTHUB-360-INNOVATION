import assert from "node:assert/strict";
import test, { mock } from "node:test";
import { prisma, WebhookEndpointStatus } from "@birthub/database";

test.afterEach(() => {
  mock.restoreAll();
});

// In Node.js test runner, prisma object methods might be properties that need different mocking.
// Using mock.method on prisma.model can fail if the model itself isn't a plain object with methods.
// We'll wrap the prisma models in a way that mock.method works, or just mock the object directly
// if the test runner throws "The argument 'methodName' must be a method."
import {
  enqueueWebhookTopicDeliveries,
  processOutboundWebhookJob,
  type OutboundWebhookJobPayload
} from "./outbound.js";
import type { Queue } from "bullmq";

test("outbound webhooks", async (t) => {
  process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/test";
  process.env.REDIS_URL = "redis://localhost:6379";

  await t.test("enqueueWebhookTopicDeliveries - enqueues jobs for active endpoints matching topic", async () => {
    const mockEndpoints = [
      { id: "ep1", organizationId: "org1", status: WebhookEndpointStatus.ACTIVE, topics: ["user.created"] },
      { id: "ep2", organizationId: "org1", status: WebhookEndpointStatus.ACTIVE, topics: ["user.created", "user.updated"] }
    ];

    prisma.webhookEndpoint.findMany = mock.fn(async () => mockEndpoints) as any;

    const addedJobs: Array<{ name: string; data: any }> = [];
    const mockQueue = {
      add: async (name: string, data: any) => {
        addedJobs.push({ name, data });
        return { id: "job1" } as any;
      }
    } as Queue<OutboundWebhookJobPayload>;

    await enqueueWebhookTopicDeliveries(mockQueue, {
      organizationId: "org1",
      payload: { userId: "123" },
      tenantId: "tenant1",
      topic: "user.created"
    });

    assert.equal(addedJobs.length, 2);
    assert.equal(addedJobs[0].name, "user.created");
    assert.equal(addedJobs[0].data.endpointId, "ep1");
    assert.equal(addedJobs[0].data.topic, "user.created");
    assert.deepEqual(addedJobs[0].data.payload, { userId: "123" });

    assert.equal(addedJobs[1].name, "user.created");
    assert.equal(addedJobs[1].data.endpointId, "ep2");
  });

  await t.test("processOutboundWebhookJob - skips disabled endpoints", async () => {
    prisma.webhookEndpoint.findUnique = mock.fn(async () => ({
      id: "ep1",
      status: WebhookEndpointStatus.DISABLED,
      topics: ["user.created"]
    })) as any;

    const result = await processOutboundWebhookJob({
      endpointId: "ep1",
      organizationId: "org1",
      payload: { userId: "123" },
      tenantId: "tenant1",
      topic: "user.created"
    });

    assert.equal(result.skipped, true);
  });

  await t.test("processOutboundWebhookJob - skips endpoints not matching topic", async () => {
    prisma.webhookEndpoint.findUnique = mock.fn(async () => ({
      id: "ep1",
      status: WebhookEndpointStatus.ACTIVE,
      topics: ["user.updated"] // missing user.created
    })) as any;

    const result = await processOutboundWebhookJob({
      endpointId: "ep1",
      organizationId: "org1",
      payload: { userId: "123" },
      tenantId: "tenant1",
      topic: "user.created"
    });

    assert.equal(result.skipped, true);
  });

  await t.test("processOutboundWebhookJob - successful delivery", async () => {
    const mockEndpoint = {
      id: "ep1",
      status: WebhookEndpointStatus.ACTIVE,
      topics: ["user.created"],
      secret: "supersecret",
      url: "https://example.com/webhook",
      consecutiveFailures: 0
    };

    prisma.webhookEndpoint.findUnique = mock.fn(async () => mockEndpoint) as any;
    
    const deliveryCreateMock = mock.fn(async () => ({ id: "delivery1" })) as any;
    prisma.webhookDelivery.create = deliveryCreateMock;

    const deliveryUpdateMock = mock.fn(async () => ({})) as any;
    prisma.webhookDelivery.update = deliveryUpdateMock;
    
    const endpointUpdateMock = mock.fn(async () => ({})) as any;
    prisma.webhookEndpoint.update = endpointUpdateMock;

    // Mock fetch
    const fetchMock = t.mock.method(global, "fetch", async () => ({
      ok: true,
      status: 200,
      text: async () => "OK"
    }));

    const result = await processOutboundWebhookJob({
      attempt: 1,
      endpointId: "ep1",
      organizationId: "org1",
      payload: { userId: "123" },
      tenantId: "tenant1",
      topic: "user.created"
    });

    assert.equal(result.skipped, false);
    assert.equal(result.deliveryId, "delivery1");
    assert.equal(result.statusCode, 200);

    // Verify fetch call
    assert.equal(fetchMock.mock.calls.length, 1);
    const fetchArgs = fetchMock.mock.calls[0].arguments;
    assert.equal(fetchArgs[0], "https://example.com/webhook");
    assert.equal(fetchArgs[1].method, "POST");
    assert.equal(fetchArgs[1].headers["content-type"], "application/json");
    assert.equal(fetchArgs[1].headers["x-birthhub-topic"], "user.created");
    // body should be serialized json
    assert.equal(fetchArgs[1].body, JSON.stringify({ userId: "123" }));

    // Verify DB updates
    assert.equal(deliveryUpdateMock.mock.calls.length, 1);
    assert.equal(deliveryUpdateMock.mock.calls[0].arguments[0].data.success, true);
    
    assert.equal(endpointUpdateMock.mock.calls.length, 1);
    assert.equal(endpointUpdateMock.mock.calls[0].arguments[0].data.consecutiveFailures, 0);
  });

  await t.test("processOutboundWebhookJob - non-200 response marks failure and increments failures", async () => {
    const mockEndpoint = {
      id: "ep1",
      status: WebhookEndpointStatus.ACTIVE,
      topics: ["user.created"],
      secret: "supersecret",
      url: "https://example.com/webhook",
      consecutiveFailures: 2
    };

    prisma.webhookEndpoint.findUnique = mock.fn(async () => mockEndpoint) as any;
    prisma.webhookDelivery.create = mock.fn(async () => ({ id: "delivery1" })) as any;
    
    const deliveryUpdateMock = mock.fn(async () => ({})) as any;
    prisma.webhookDelivery.update = deliveryUpdateMock;
    
    const endpointUpdateMock = mock.fn(async () => ({})) as any;
    prisma.webhookEndpoint.update = endpointUpdateMock;

    // Mock fetch to return 500
    t.mock.method(global, "fetch", async () => ({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error"
    }));

    await assert.rejects(
      async () => {
        await processOutboundWebhookJob({
          attempt: 1,
          endpointId: "ep1",
          organizationId: "org1",
          payload: { userId: "123" },
          tenantId: "tenant1",
          topic: "user.created"
        });
      },
      /Webhook delivery failed with status 500/
    );

    // Initial update sets success=false
    assert.equal(deliveryUpdateMock.mock.calls.length, 2); // First update in try, second in catch
    assert.equal(deliveryUpdateMock.mock.calls[0].arguments[0].data.success, false);
    assert.equal(deliveryUpdateMock.mock.calls[0].arguments[0].data.statusCode, 500);

    // Verify endpoint consecutive failures incremented
    assert.equal(endpointUpdateMock.mock.calls.length, 1);
    assert.equal(endpointUpdateMock.mock.calls[0].arguments[0].data.consecutiveFailures, 3);
    assert.equal(endpointUpdateMock.mock.calls[0].arguments[0].data.status, WebhookEndpointStatus.ACTIVE);
  });

  await t.test("processOutboundWebhookJob - 10 consecutive failures disables endpoint", async () => {
    const mockEndpoint = {
      id: "ep1",
      status: WebhookEndpointStatus.ACTIVE,
      topics: ["user.created"],
      secret: "supersecret",
      url: "https://example.com/webhook",
      consecutiveFailures: 9
    };

    prisma.webhookEndpoint.findUnique = mock.fn(async () => mockEndpoint) as any;
    prisma.webhookDelivery.create = mock.fn(async () => ({ id: "delivery1" })) as any;
    prisma.webhookDelivery.update = mock.fn(async () => ({})) as any;
    
    const endpointUpdateMock = mock.fn(async () => ({})) as any;
    prisma.webhookEndpoint.update = endpointUpdateMock;

    mock.method(global, "fetch", async () => ({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error"
    }));

    await assert.rejects(
      async () => {
        await processOutboundWebhookJob({
          endpointId: "ep1",
          organizationId: "org1",
          payload: { userId: "123" },
          tenantId: "tenant1",
          topic: "user.created"
        });
      },
      /Webhook delivery failed with status 500/
    );

    assert.equal(endpointUpdateMock.mock.calls.length, 1);
    assert.equal(endpointUpdateMock.mock.calls[0].arguments[0].data.consecutiveFailures, 10);
    assert.equal(endpointUpdateMock.mock.calls[0].arguments[0].data.status, WebhookEndpointStatus.DISABLED);
  });

  await t.test("processOutboundWebhookJob - network error sets error message", async () => {
    const mockEndpoint = {
      id: "ep1",
      status: WebhookEndpointStatus.ACTIVE,
      topics: ["user.created"],
      secret: "supersecret",
      url: "https://example.com/webhook",
      consecutiveFailures: 0
    };

    prisma.webhookEndpoint.findUnique = mock.fn(async () => mockEndpoint) as any;
    prisma.webhookDelivery.create = mock.fn(async () => ({ id: "delivery1" })) as any;
    
    const deliveryUpdateMock = mock.fn(async () => ({})) as any;
    prisma.webhookDelivery.update = deliveryUpdateMock;
    
    const endpointUpdateMock = mock.fn(async () => ({})) as any;
    prisma.webhookEndpoint.update = endpointUpdateMock;

    t.mock.method(global, "fetch", async () => {
      throw new Error("fetch failed");
    });

    await assert.rejects(
      async () => {
        await processOutboundWebhookJob({
          endpointId: "ep1",
          organizationId: "org1",
          payload: { userId: "123" },
          tenantId: "tenant1",
          topic: "user.created"
        });
      },
      /fetch failed/
    );

    assert.equal(deliveryUpdateMock.mock.calls.length, 1);
    assert.equal(deliveryUpdateMock.mock.calls[0].arguments[0].data.errorMessage, "fetch failed");

    assert.equal(endpointUpdateMock.mock.calls.length, 1);
    assert.equal(endpointUpdateMock.mock.calls[0].arguments[0].data.consecutiveFailures, 1);
  });
});