// [SOURCE] CI-TS-004
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
} from "../src/webhooks/outbound.js";
import type { Queue } from "bullmq";

type MockJob = { name: string; data: OutboundWebhookJobPayload };
type FetchMockResponse = Pick<Response, "ok" | "status" | "text">;
type WebhookEndpointModelMock = {
  findMany: (args?: unknown) => Promise<unknown>;
  findUnique: (args?: unknown) => Promise<unknown>;
  update: (args: unknown) => Promise<unknown>;
};
type WebhookDeliveryModelMock = {
  create: (args: unknown) => Promise<unknown>;
  update: (args: unknown) => Promise<unknown>;
};

void test("outbound webhooks", async (t) => {
  const webhookEndpointModel = prisma.webhookEndpoint as unknown as WebhookEndpointModelMock;
  const webhookDeliveryModel = prisma.webhookDelivery as unknown as WebhookDeliveryModelMock;
  process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/test";
  process.env.REDIS_URL = "redis://localhost:6379";

  await t.test("enqueueWebhookTopicDeliveries - enqueues jobs for active endpoints matching topic", async () => {
    const mockEndpoints = [
      { id: "ep1", organizationId: "org1", status: WebhookEndpointStatus.ACTIVE, topics: ["user.created"] },
      { id: "ep2", organizationId: "org1", status: WebhookEndpointStatus.ACTIVE, topics: ["user.created", "user.updated"] }
    ];

    webhookEndpointModel.findMany = mock.fn(async () => mockEndpoints);

    const addedJobs: MockJob[] = [];
    const mockQueue = {
      add: async (name: string, data: OutboundWebhookJobPayload) => {
        addedJobs.push({ name, data });
        return { id: "job1" };
      }
    } as unknown as Queue<OutboundWebhookJobPayload>;

    await enqueueWebhookTopicDeliveries(mockQueue, {
      organizationId: "org1",
      payload: { userId: "123" },
      tenantId: "tenant1",
      topic: "user.created"
    });

    assert.equal(addedJobs.length, 2);
    const firstJob = addedJobs[0]!;
    const secondJob = addedJobs[1]!;
    assert.equal(firstJob.name, "user.created");
    assert.equal(firstJob.data.endpointId, "ep1");
    assert.equal(firstJob.data.topic, "user.created");
    assert.deepEqual(firstJob.data.payload, { userId: "123" });

    assert.equal(secondJob.name, "user.created");
    assert.equal(secondJob.data.endpointId, "ep2");
  });

  await t.test("processOutboundWebhookJob - skips disabled endpoints", async () => {
    webhookEndpointModel.findUnique = mock.fn(async () => ({
      id: "ep1",
      status: WebhookEndpointStatus.DISABLED,
      topics: ["user.created"]
    }));

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
    webhookEndpointModel.findUnique = mock.fn(async () => ({
      id: "ep1",
      status: WebhookEndpointStatus.ACTIVE,
      topics: ["user.updated"] // missing user.created
    }));

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

    webhookEndpointModel.findUnique = mock.fn(async () => mockEndpoint);

    webhookDeliveryModel.create = mock.fn(async () => ({ id: "delivery1" }));
    const deliveryUpdateMock = mock.fn(async () => ({}));
    webhookDeliveryModel.update = deliveryUpdateMock;
    const endpointUpdateMock = mock.fn(async () => ({}));
    webhookEndpointModel.update = endpointUpdateMock;

    // Mock fetch
    const fetchMock = t.mock.method(global, "fetch", async (): Promise<FetchMockResponse> => ({
      ok: true,
      status: 200,
      text: async () => "OK"
    }) as Response);

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
    const firstFetchCall = fetchMock.mock.calls[0]!;
    const fetchArgs = firstFetchCall.arguments;
    assert.equal(fetchArgs[0], "https://example.com/webhook");
    const requestInit = fetchArgs[1] as RequestInit;
    assert.equal(requestInit.method, "POST");
    const headers = new Headers(requestInit.headers);
    assert.equal(headers.get("content-type"), "application/json");
    assert.equal(headers.get("x-birthhub-topic"), "user.created");
    // body should be serialized json
    assert.equal(requestInit.body, JSON.stringify({ userId: "123" }));

    // Verify DB updates
    assert.equal(deliveryUpdateMock.mock.calls.length, 1);
    const firstDeliveryUpdate = deliveryUpdateMock.mock.calls[0]!;
    const firstDeliveryUpdateArg = firstDeliveryUpdate.arguments[0] as { data: { success: boolean } };
    assert.equal(firstDeliveryUpdateArg.data.success, true);

    assert.equal(endpointUpdateMock.mock.calls.length, 1);
    const firstEndpointUpdate = endpointUpdateMock.mock.calls[0]!;
    const firstEndpointUpdateArg = firstEndpointUpdate.arguments[0] as { data: { consecutiveFailures: number } };
    assert.equal(firstEndpointUpdateArg.data.consecutiveFailures, 0);
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

    webhookEndpointModel.findUnique = mock.fn(async () => mockEndpoint);
    webhookDeliveryModel.create = mock.fn(async () => ({ id: "delivery1" }));
    const deliveryUpdateMock = mock.fn(async () => ({}));
    webhookDeliveryModel.update = deliveryUpdateMock;
    const endpointUpdateMock = mock.fn(async () => ({}));
    webhookEndpointModel.update = endpointUpdateMock;

    // Mock fetch to return 500
    t.mock.method(global, "fetch", async (): Promise<FetchMockResponse> => ({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error"
    }) as Response);

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
    const firstDeliveryUpdateArg = deliveryUpdateMock.mock.calls[0]!.arguments[0] as {
      data: { statusCode: number; success: boolean };
    };
    assert.equal(firstDeliveryUpdateArg.data.success, false);
    assert.equal(firstDeliveryUpdateArg.data.statusCode, 500);

    // Verify endpoint consecutive failures incremented
    assert.equal(endpointUpdateMock.mock.calls.length, 1);
    const firstEndpointUpdateArg = endpointUpdateMock.mock.calls[0]!.arguments[0] as {
      data: { consecutiveFailures: number; status: WebhookEndpointStatus };
    };
    assert.equal(firstEndpointUpdateArg.data.consecutiveFailures, 3);
    assert.equal(firstEndpointUpdateArg.data.status, WebhookEndpointStatus.ACTIVE);
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

    webhookEndpointModel.findUnique = mock.fn(async () => mockEndpoint);
    webhookDeliveryModel.create = mock.fn(async () => ({ id: "delivery1" }));
    webhookDeliveryModel.update = mock.fn(async () => ({}));
    const endpointUpdateMock = mock.fn(async () => ({}));
    webhookEndpointModel.update = endpointUpdateMock;

    t.mock.method(global, "fetch", async (): Promise<FetchMockResponse> => ({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error"
    }) as Response);

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
    const firstEndpointUpdateArg = endpointUpdateMock.mock.calls[0]!.arguments[0] as {
      data: { consecutiveFailures: number; status: WebhookEndpointStatus };
    };
    assert.equal(firstEndpointUpdateArg.data.consecutiveFailures, 10);
    assert.equal(firstEndpointUpdateArg.data.status, WebhookEndpointStatus.DISABLED);
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

    webhookEndpointModel.findUnique = mock.fn(async () => mockEndpoint);
    webhookDeliveryModel.create = mock.fn(async () => ({ id: "delivery1" }));
    const deliveryUpdateMock = mock.fn(async () => ({}));
    webhookDeliveryModel.update = deliveryUpdateMock;
    const endpointUpdateMock = mock.fn(async () => ({}));
    webhookEndpointModel.update = endpointUpdateMock;

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
    const firstDeliveryUpdateArg = deliveryUpdateMock.mock.calls[0]!.arguments[0] as { data: { errorMessage: string } };
    assert.equal(firstDeliveryUpdateArg.data.errorMessage, "fetch failed");

    assert.equal(endpointUpdateMock.mock.calls.length, 1);
    const firstEndpointUpdateArg = endpointUpdateMock.mock.calls[0]!.arguments[0] as { data: { consecutiveFailures: number } };
    assert.equal(firstEndpointUpdateArg.data.consecutiveFailures, 1);
  });
});
