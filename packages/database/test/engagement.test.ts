import assert from "node:assert/strict";
import test from "node:test";

import { NotificationType, Role } from "@prisma/client";

import { prisma } from "../src/client.js";
import {
  createNotificationForOrganizationRoles,
  createNotificationForUser,
  ensureUserPreference,
  listNotifications
} from "../src/repositories/engagement.js";

void test("ensureUserPreference upserts tenant-scoped preference data", async () => {
  const original = prisma.userPreference.upsert.bind(prisma.userPreference);
  let received: unknown = null;

  prisma.userPreference.upsert = (async (args: unknown) => {
    received = args;
    return { inAppNotifications: true };
  }) as unknown as typeof prisma.userPreference.upsert;

  try {
    await ensureUserPreference({
      organizationId: "org_1",
      tenantId: "tenant_1",
      userId: "user_1"
    });

    assert.deepEqual(received, {
      create: {
        organizationId: "org_1",
        tenantId: "tenant_1",
        userId: "user_1"
      },
      update: {},
      where: {
        organizationId_userId: {
          organizationId: "org_1",
          userId: "user_1"
        }
      }
    });
  } finally {
    prisma.userPreference.upsert = original;
  }
});

void test("createNotificationForUser skips persistence when in-app notifications are disabled", async () => {
  const originalPreferenceUpsert = prisma.userPreference.upsert.bind(prisma.userPreference);
  const originalCreate = prisma.notification.create.bind(prisma.notification);
  let createCalled = false;

  prisma.userPreference.upsert = (async () =>
    ({
      inAppNotifications: false
    })) as unknown as typeof prisma.userPreference.upsert;
  prisma.notification.create = (async () => {
    createCalled = true;
    return {} as never;
  }) as unknown as typeof prisma.notification.create;

  try {
    const result = await createNotificationForUser({
      content: "hello",
      organizationId: "org_1",
      tenantId: "tenant_1",
      type: NotificationType.INFO,
      userId: "user_1"
    });

    assert.equal(result, null);
    assert.equal(createCalled, false);
  } finally {
    prisma.userPreference.upsert = originalPreferenceUpsert;
    prisma.notification.create = originalCreate;
  }
});

void test("createNotificationForOrganizationRoles only creates notifications for users with enabled preference", async () => {
  const originalFindMany = prisma.membership.findMany.bind(prisma.membership);
  const originalCreateMany = prisma.notification.createMany.bind(prisma.notification);
  let createManyArgs: unknown = null;

  prisma.membership.findMany = (async () =>
    [
      {
        role: Role.ADMIN,
        tenantId: "tenant_1",
        user: {
          preferences: [
            {
              inAppNotifications: true,
              organizationId: "org_1"
            }
          ]
        },
        userId: "user_admin"
      },
      {
        role: Role.OWNER,
        tenantId: "tenant_1",
        user: {
          preferences: [
            {
              inAppNotifications: false,
              organizationId: "org_1"
            }
          ]
        },
        userId: "user_owner"
      }
    ]) as unknown as typeof prisma.membership.findMany;
  prisma.notification.createMany = (async (args: unknown) => {
    createManyArgs = args;
    return { count: 1 };
  }) as unknown as typeof prisma.notification.createMany;

  try {
    const result = await createNotificationForOrganizationRoles({
      content: "ops",
      organizationId: "org_1",
      tenantId: "tenant_1",
      type: NotificationType.INFO
    });

    assert.deepEqual(result, { count: 1 });
    assert.deepEqual(createManyArgs, {
      data: [
        {
          content: "ops",
          link: null,
          organizationId: "org_1",
          tenantId: "tenant_1",
          type: "INFO",
          userId: "user_admin"
        }
      ]
    });
    assert.equal((createManyArgs as { take?: number }).take, undefined);
  } finally {
    prisma.membership.findMany = originalFindMany;
    prisma.notification.createMany = originalCreateMany;
  }
});

void test("createNotificationForOrganizationRoles caps membership reads", async () => {
  const originalFindMany = prisma.membership.findMany.bind(prisma.membership);
  let received: unknown = null;

  prisma.membership.findMany = (async (args: unknown) => {
    received = args;
    return [];
  }) as unknown as typeof prisma.membership.findMany;

  try {
    const result = await createNotificationForOrganizationRoles({
      content: "ops",
      organizationId: "org_1",
      tenantId: "tenant_1",
      type: NotificationType.INFO
    });

    assert.deepEqual(result, { count: 0 });
    assert.equal((received as { take?: number }).take, 100);
  } finally {
    prisma.membership.findMany = originalFindMany;
  }
});

void test("listNotifications returns bounded items, next cursor and unread count", async () => {
  const originalFindMany = prisma.notification.findMany.bind(prisma.notification);
  const originalCount = prisma.notification.count.bind(prisma.notification);

  prisma.notification.findMany = (async () =>
    [
      { id: "n3" },
      { id: "n2" },
      { id: "n1" }
    ]) as unknown as typeof prisma.notification.findMany;
  prisma.notification.count = (async () => 7) as unknown as typeof prisma.notification.count;

  try {
    const result = await listNotifications({
      limit: 2,
      tenantId: "tenant_1",
      userId: "user_1"
    });

    assert.deepEqual(result, {
      items: [{ id: "n3" }, { id: "n2" }],
      nextCursor: "n2",
      unreadCount: 7
    });
  } finally {
    prisma.notification.findMany = originalFindMany;
    prisma.notification.count = originalCount;
  }
});
