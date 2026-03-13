import { existsSync } from "node:fs";
import path from "node:path";

import {
  loadManifestCatalog,
  recommendAgentsForTenant,
  searchManifestCatalog,
  type ManifestCatalogEntry,
  type ManifestSearchFilters,
  type ManifestSearchResult
} from "@birthub/agents-core";

interface CatalogCache {
  entries: ManifestCatalogEntry[];
  loadedAt: number;
}

const CACHE_TTL_MS = 60_000;

function resolveCatalogRoot(): string {
  const candidates = [
    path.join(process.cwd(), "packages", "agent-packs"),
    path.join(process.cwd(), "..", "..", "packages", "agent-packs"),
    path.join(process.cwd(), "..", "packages", "agent-packs")
  ];

  const found = candidates.find((candidate) => existsSync(candidate));

  if (!found) {
    throw new Error("Unable to locate packages/agent-packs directory.");
  }

  return found;
}

function normalizeTagList(value: string | string[] | undefined): string[] | undefined {
  if (!value) {
    return undefined;
  }

  const raw = Array.isArray(value) ? value.join(",") : value;
  const parsed = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : undefined;
}

export class MarketplaceService {
  private cache: CatalogCache | null = null;
  private readonly catalogRoot: string;

  constructor(catalogRoot = resolveCatalogRoot()) {
    this.catalogRoot = catalogRoot;
  }

  async getCatalog(forceReload = false): Promise<ManifestCatalogEntry[]> {
    const now = Date.now();

    if (!forceReload && this.cache && now - this.cache.loadedAt < CACHE_TTL_MS) {
      return this.cache.entries;
    }

    const entries = await loadManifestCatalog(this.catalogRoot);
    this.cache = {
      entries,
      loadedAt: now
    };

    return entries;
  }

  async search(input: {
    domains?: string | string[];
    industries?: string | string[];
    levels?: string | string[];
    page?: number;
    pageSize?: number;
    personas?: string | string[];
    query?: string;
    tags?: string | string[];
    useCases?: string | string[];
  }): Promise<ManifestSearchResult> {
    const catalog = await this.getCatalog();

    const filters: ManifestSearchFilters = {
      domains: normalizeTagList(input.domains),
      industries: normalizeTagList(input.industries),
      levels: normalizeTagList(input.levels),
      personas: normalizeTagList(input.personas),
      tags: normalizeTagList(input.tags),
      useCases: normalizeTagList(input.useCases)
    };

    return searchManifestCatalog(catalog, {
      filters,
      page: input.page,
      pageSize: input.pageSize,
      query: input.query
    });
  }

  async recommend(tenantIndustry: string, limit = 6) {
    const catalog = await this.getCatalog();
    return recommendAgentsForTenant(catalog, tenantIndustry, limit);
  }

  async getAgentById(agentId: string): Promise<ManifestCatalogEntry | null> {
    const catalog = await this.getCatalog();
    return catalog.find((entry) => entry.manifest.agent.id === agentId) ?? null;
  }

  async getAgentDocs(agentId: string): Promise<string | null> {
    const entry = await this.getAgentById(agentId);

    if (!entry) {
      return null;
    }

    const { manifest } = entry;

    return [
      `# ${manifest.agent.name}`,
      "",
      manifest.agent.description,
      "",
      "## Prompt",
      manifest.agent.prompt,
      "",
      "## Skills",
      ...manifest.skills.map((skill) => `- **${skill.name}**: ${skill.description}`),
      "",
      "## Tools",
      ...manifest.tools.map((tool) => `- **${tool.name}**: ${tool.description}`)
    ].join("\n");
  }

  async getAgentChangelog(agentId: string): Promise<string[] | null> {
    const entry = await this.getAgentById(agentId);
    return entry ? entry.manifest.agent.changelog : null;
  }

  async getCapabilityMatrix(): Promise<
    Array<{
      agentId: string;
      agentName: string;
      domain: string[];
      tools: string[];
    }>
  > {
    const catalog = await this.getCatalog();

    return catalog.map((entry) => ({
      agentId: entry.manifest.agent.id,
      agentName: entry.manifest.agent.name,
      domain: entry.manifest.tags.domain,
      tools: entry.manifest.tools.map((tool) => tool.name)
    }));
  }
}

export const marketplaceService = new MarketplaceService();
