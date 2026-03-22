import { prisma, Prisma } from "@birthub/database";
import { AgentMemoryBackend, AgentMemoryService } from "@birthub/agents-core";

interface AuditMemoryPayload {
  expiresAt?: number;
  value?: string;
}

function matchesPattern(candidate: string, pattern: string): boolean {
  const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escaped.replace(/\\\*/g, ".*")}$`).test(candidate);
}

function readAuditMemoryPayload(diff: unknown): AuditMemoryPayload {
  if (!diff || typeof diff !== "object") {
    return {};
  }

  const candidate = diff as Record<string, unknown>;
  return {
    ...(typeof candidate.expiresAt === "number" ? { expiresAt: candidate.expiresAt } : {}),
    ...(typeof candidate.value === "string" ? { value: candidate.value } : {})
  };
}

export class PrismaAuditMemoryBackend implements AgentMemoryBackend {
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const tenantId = key.split(":")[0] ?? "unknown";
    const expiresAt = ttlSeconds !== undefined ? Date.now() + ttlSeconds * 1000 : undefined;

    await prisma.auditLog.create({
      data: {
        action: "AGENT_MEMORY_SET",
        diff: {
          ...(expiresAt !== undefined ? { expiresAt } : {}),
          value
        } as Prisma.InputJsonValue,
        entityId: key,
        entityType: "agent_memory",
        tenantId
      }
    });
  }

  async get(key: string): Promise<string | null> {
    const tenantId = key.split(":")[0] ?? "unknown";
    const latest = await prisma.auditLog.findFirst({
      orderBy: {
        createdAt: "desc"
      },
      where: {
        action: {
          in: ["AGENT_MEMORY_DELETE", "AGENT_MEMORY_SET"]
        },
        entityId: key,
        entityType: "agent_memory",
        tenantId
      }
    });

    if (!latest || latest.action === "AGENT_MEMORY_DELETE") {
      return null;
    }

    const payload = readAuditMemoryPayload(latest.diff);
    if (payload.expiresAt !== undefined && payload.expiresAt <= Date.now()) {
      return null;
    }

    return payload.value ?? null;
  }

  async del(key: string): Promise<number> {
    const tenantId = key.split(":")[0] ?? "unknown";
    const before = await this.get(key);

    await prisma.auditLog.create({
      data: {
        action: "AGENT_MEMORY_DELETE",
        diff: {} as Prisma.InputJsonValue,
        entityId: key,
        entityType: "agent_memory",
        tenantId
      }
    });

    return before ? 1 : 0;
  }

  async keys(pattern: string): Promise<string[]> {
    const tenantId = pattern.split(":")[0] ?? "unknown";
    const records = await prisma.auditLog.findMany({
      orderBy: {
        createdAt: "desc"
      },
      where: {
        action: {
          in: ["AGENT_MEMORY_DELETE", "AGENT_MEMORY_SET"]
        },
        entityType: "agent_memory",
        tenantId
      }
    });

    const latestByKey = new Map<
      string,
      {
        action: string;
        diff: unknown;
      }
    >();

    for (const record of records) {
      if (!latestByKey.has(record.entityId)) {
        latestByKey.set(record.entityId, {
          action: record.action,
          diff: record.diff
        });
      }
    }

    return Array.from(latestByKey.entries())
      .filter(([key, value]) => {
        if (value.action === "AGENT_MEMORY_DELETE") {
          return false;
        }

        const payload = readAuditMemoryPayload(value.diff);
        if (payload.expiresAt !== undefined && payload.expiresAt <= Date.now()) {
          return false;
        }

        return matchesPattern(key, pattern);
      })
      .map(([key]) => key);
  }
}

export const runtimeMemory = new AgentMemoryService(new PrismaAuditMemoryBackend());
