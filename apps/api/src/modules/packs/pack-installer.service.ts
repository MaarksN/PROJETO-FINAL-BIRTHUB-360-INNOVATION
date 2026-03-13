import { prisma } from "@birthub/database";

import { marketplaceService } from "../marketplace/marketplace-service.js";

interface InstallPackInput {
  activateAgents: boolean;
  connectors: Record<string, unknown>;
  packId: string;
  tenantId: string;
}

function isPackAgent(agentId: string): boolean {
  return agentId.endsWith("-pack") && agentId !== "corporate-v1-catalog";
}

function extractPackId(config: unknown): string | null {
  if (!config || typeof config !== "object") {
    return null;
  }

  const value = (config as { packId?: unknown }).packId;
  return typeof value === "string" ? value : null;
}

function extractVersion(config: unknown, field: "installedVersion" | "latestAvailableVersion"): string | null {
  if (!config || typeof config !== "object") {
    return null;
  }

  const value = (config as Record<string, unknown>)[field];
  return typeof value === "string" ? value : null;
}

export class PackInstallerService {
  async installPackAtomic(input: InstallPackInput) {
    const catalog = await marketplaceService.getCatalog();

    const agentsToInstall = catalog.filter((entry) => isPackAgent(entry.manifest.agent.id));

    if (agentsToInstall.length === 0) {
      throw new Error("No installable agents found in catalog.");
    }

    const organization = await prisma.organization.findUnique({
      where: {
        tenantId: input.tenantId
      }
    });

    if (!organization) {
      throw new Error(`Tenant ${input.tenantId} does not exist.`);
    }

    await prisma.$transaction(async (tx) => {
      for (const entry of agentsToInstall) {
        await tx.agent.create({
          data: {
            config: {
              connectors: input.connectors,
              installedAt: new Date().toISOString(),
              installedVersion: entry.manifest.agent.version,
              latestAvailableVersion: entry.manifest.agent.version,
              packId: input.packId,
              sourceAgentId: entry.manifest.agent.id,
              status: input.activateAgents ? "active" : "installed"
            },
            name: entry.manifest.agent.name,
            organizationId: organization.id,
            status: input.activateAgents ? "ACTIVE" : "PAUSED",
            tenantId: input.tenantId
          }
        });
      }

      await tx.auditLog.create({
        data: {
          action: "PACK_INSTALL",
          actorId: null,
          diff: {
            activateAgents: input.activateAgents,
            connectors: input.connectors,
            packId: input.packId
          },
          entityId: input.packId,
          entityType: "agent_pack",
          tenantId: input.tenantId
        }
      });
    });

    return {
      installedAgents: agentsToInstall.length,
      packId: input.packId
    };
  }

  async uninstallPackAtomic(input: { packId: string; tenantId: string }) {
    const agents = await prisma.agent.findMany({
      where: {
        tenantId: input.tenantId
      }
    });

    const idsToDelete = agents
      .filter((agent) => extractPackId(agent.config) === input.packId)
      .map((agent) => agent.id);

    await prisma.$transaction(async (tx) => {
      if (idsToDelete.length > 0) {
        await tx.agent.deleteMany({
          where: {
            id: {
              in: idsToDelete
            }
          }
        });
      }

      await tx.auditLog.create({
        data: {
          action: "PACK_UNINSTALL",
          actorId: null,
          diff: {
            deletedAgents: idsToDelete.length,
            packId: input.packId
          },
          entityId: input.packId,
          entityType: "agent_pack",
          tenantId: input.tenantId
        }
      });
    });

    return {
      deletedAgents: idsToDelete.length,
      packId: input.packId
    };
  }

  async getPackStatus(tenantId: string) {
    const agents = await prisma.agent.findMany({
      where: {
        tenantId
      }
    });

    const grouped = new Map<
      string,
      {
        installedVersion: string;
        latestAvailableVersion: string;
        packId: string;
        status: "active" | "degraded" | "failed" | "installed";
      }
    >();

    for (const agent of agents) {
      const packId = extractPackId(agent.config);

      if (!packId) {
        continue;
      }

      const installedVersion = extractVersion(agent.config, "installedVersion") ?? "1.0.0";
      const latestAvailableVersion = extractVersion(agent.config, "latestAvailableVersion") ?? installedVersion;
      const status =
        agent.status === "ACTIVE"
          ? "active"
          : agent.status === "PAUSED"
            ? "installed"
            : "failed";

      if (!grouped.has(packId)) {
        grouped.set(packId, {
          installedVersion,
          latestAvailableVersion,
          packId,
          status
        });
      }
    }

    return [...grouped.values()];
  }

  async updatePackVersion(input: { latestAvailableVersion: string; packId: string; tenantId: string }) {
    const agents = await prisma.agent.findMany({
      where: {
        tenantId: input.tenantId
      }
    });

    const idsToUpdate = agents
      .filter((agent) => extractPackId(agent.config) === input.packId)
      .map((agent) => agent.id);

    await prisma.$transaction(async (tx) => {
      for (const id of idsToUpdate) {
        const current = await tx.agent.findUnique({ where: { id } });

        if (!current) {
          continue;
        }

        const currentConfig = current.config && typeof current.config === "object" ? current.config : {};

        await tx.agent.update({
          data: {
            config: {
              ...(currentConfig as Record<string, unknown>),
              latestAvailableVersion: input.latestAvailableVersion
            }
          },
          where: { id }
        });
      }
    });

    return {
      affectedAgents: idsToUpdate.length,
      latestAvailableVersion: input.latestAvailableVersion,
      packId: input.packId
    };
  }
}

export const packInstallerService = new PackInstallerService();
