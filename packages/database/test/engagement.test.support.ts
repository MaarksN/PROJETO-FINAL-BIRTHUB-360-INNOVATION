type InjectedClient = {
  auditLog: {
    create: (_args: unknown) => Promise<unknown>;
  };
  membership: {
    findMany: (_args: unknown) => Promise<unknown[]>;
  };
  notification: {
    count: (_args: unknown) => Promise<number>;
    create: (_args: unknown) => Promise<unknown>;
    createMany: (_args: unknown) => Promise<{ count: number }>;
    findMany: (_args: unknown) => Promise<unknown[]>;
    updateMany: (_args: unknown) => Promise<{ count: number }>;
  };
  userPreference: {
    findUnique: (_args: unknown) => Promise<Record<string, unknown> | null>;
    upsert: (_args: unknown) => Promise<{ inAppNotifications: boolean }>;
  };
};

export function createInjectedClient(): InjectedClient {
  return {
    auditLog: {
      create: (_args: unknown) => Promise.resolve({})
    },
    membership: {
      findMany: (_args: unknown) => Promise.resolve([])
    },
    notification: {
      count: (_args: unknown) => Promise.resolve(0),
      create: (_args: unknown) => Promise.resolve({}),
      createMany: (_args: unknown) => Promise.resolve({ count: 0 }),
      findMany: (_args: unknown) => Promise.resolve([]),
      updateMany: (_args: unknown) => Promise.resolve({ count: 0 })
    },
    userPreference: {
      findUnique: (_args: unknown) => Promise.resolve(null),
      upsert: (_args: unknown) => Promise.resolve({ inAppNotifications: true })
    }
  };
}
