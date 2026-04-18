import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parseAgentManifest } from "./parser.js";
export function isInstallableManifest(manifest) {
    return manifest.agent.kind !== "catalog";
}
async function walkDirectory(dirPath) {
    const entries = await readdir(dirPath, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const entryPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await walkDirectory(entryPath)));
            continue;
        }
        if (entry.isFile() && entry.name === "manifest.json") {
            files.push(entryPath);
        }
    }
    return files;
}
function normalize(value) {
    return value.trim().toLowerCase();
}
export function canonicalizeAgentId(value) {
    return normalize(value).replace(/[_\s]+/g, "-").replace(/-+/g, "-");
}
export function agentIdsMatch(left, right) {
    return canonicalizeAgentId(left) === canonicalizeAgentId(right);
}
export function findManifestCatalogEntryByAgentId(catalog, agentId) {
    const canonicalAgentId = canonicalizeAgentId(agentId);
    return (catalog.find((entry) => canonicalizeAgentId(entry.manifest.agent.id) === canonicalAgentId) ??
        null);
}
function hasAny(candidateValues, targetValues) {
    if (!targetValues || targetValues.length === 0) {
        return true;
    }
    const candidateSet = new Set(candidateValues.map(normalize));
    return targetValues.map(normalize).some((value) => candidateSet.has(value));
}
function collectFlatTags(tags) {
    return [...tags.domain, ...tags.level, ...tags.persona, ...tags["use-case"], ...tags.industry].map(normalize);
}
function calculateSearchScore(manifest, query) {
    const normalizedQuery = query ? normalize(query) : "";
    const canonicalQuery = query ? canonicalizeAgentId(query) : "";
    if (!normalizedQuery) {
        return 1;
    }
    const agentId = canonicalizeAgentId(manifest.agent.id);
    const name = normalize(manifest.agent.name);
    const description = normalize(manifest.agent.description);
    const tags = collectFlatTags(manifest.tags);
    const keywords = manifest.keywords.map(normalize);
    const skills = manifest.skills.map((skill) => `${normalize(skill.name)} ${normalize(skill.description)}`);
    const tools = manifest.tools.map((tool) => `${normalize(tool.name)} ${normalize(tool.description)}`);
    let score = 0;
    if (name === normalizedQuery) {
        score += 32;
    }
    if (agentId === canonicalQuery) {
        score += 28;
    }
    if (name.includes(normalizedQuery)) {
        score += 20;
    }
    if (agentId.includes(canonicalQuery)) {
        score += 14;
    }
    if (description.includes(normalizedQuery)) {
        score += 12;
    }
    for (const tag of tags) {
        if (tag.includes(normalizedQuery)) {
            score += 6;
        }
    }
    for (const keyword of keywords) {
        if (keyword.includes(normalizedQuery)) {
            score += 8;
        }
    }
    for (const skillText of skills) {
        if (skillText.includes(normalizedQuery)) {
            score += 4;
        }
    }
    for (const toolText of tools) {
        if (toolText.includes(normalizedQuery)) {
            score += 3;
        }
    }
    return score;
}
function buildFacets(entries) {
    const facets = {
        domains: {},
        industries: {},
        levels: {},
        personas: {},
        tags: {},
        useCases: {}
    };
    const increment = (bucket, value) => {
        const normalized = normalize(value);
        bucket[normalized] = (bucket[normalized] ?? 0) + 1;
        facets.tags[normalized] = (facets.tags[normalized] ?? 0) + 1;
    };
    for (const entry of entries) {
        for (const domain of entry.manifest.tags.domain) {
            increment(facets.domains, domain);
        }
        for (const level of entry.manifest.tags.level) {
            increment(facets.levels, level);
        }
        for (const persona of entry.manifest.tags.persona) {
            increment(facets.personas, persona);
        }
        for (const useCase of entry.manifest.tags["use-case"]) {
            increment(facets.useCases, useCase);
        }
        for (const industry of entry.manifest.tags.industry) {
            increment(facets.industries, industry);
        }
    }
    return facets;
}
export async function loadManifestCatalog(baseDir) {
    const manifestPaths = await walkDirectory(baseDir);
    const catalogEntries = [];
    for (const manifestPath of manifestPaths) {
        const manifestRaw = await readFile(manifestPath, "utf8");
        const manifestJson = JSON.parse(manifestRaw);
        const manifest = parseAgentManifest(manifestJson);
        catalogEntries.push({
            manifest,
            manifestPath
        });
    }
    return catalogEntries;
}
export function searchManifestCatalog(catalog, input) {
    const page = Math.max(input.page ?? 1, 1);
    const pageSize = Math.min(Math.max(input.pageSize ?? 12, 1), 100);
    const filters = input.filters ?? {};
    const includeCatalogEntries = input.includeCatalogEntries ?? false;
    const filtered = catalog.filter((entry) => {
        const tags = entry.manifest.tags;
        return ((includeCatalogEntries || isInstallableManifest(entry.manifest)) &&
            hasAny(tags.domain, filters.domains) &&
            hasAny(tags.level, filters.levels) &&
            hasAny(tags.persona, filters.personas) &&
            hasAny(tags["use-case"], filters.useCases) &&
            hasAny(tags.industry, filters.industries) &&
            hasAny(collectFlatTags(tags), filters.tags));
    });
    const ranked = filtered
        .map((entry) => ({
        ...entry,
        score: calculateSearchScore(entry.manifest, input.query)
    }))
        .filter((entry) => entry.score > 0)
        .sort((left, right) => {
        if (right.score !== left.score) {
            return right.score - left.score;
        }
        return left.manifest.agent.name.localeCompare(right.manifest.agent.name);
    });
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
        facets: buildFacets(filtered),
        page,
        pageSize,
        results: ranked.slice(start, end),
        total: ranked.length
    };
}
export function recommendAgentsForTenant(catalog, tenantIndustry, limit = 6) {
    const normalizedIndustry = normalize(tenantIndustry);
    return catalog
        .filter((entry) => isInstallableManifest(entry.manifest))
        .map((entry) => {
        const industryTags = entry.manifest.tags.industry.map(normalize);
        const domainTags = entry.manifest.tags.domain.map(normalize);
        let recommendationScore = 1;
        if (industryTags.includes(normalizedIndustry)) {
            recommendationScore += 15;
        }
        if (domainTags.includes(normalizedIndustry)) {
            recommendationScore += 9;
        }
        if (normalizedIndustry.includes("sales") &&
            (entry.manifest.agent.id.includes("cro") || entry.manifest.agent.id.includes("sales"))) {
            recommendationScore += 10;
        }
        return {
            ...entry,
            recommendationScore
        };
    })
        .sort((left, right) => right.recommendationScore - left.recommendationScore)
        .slice(0, limit);
}
