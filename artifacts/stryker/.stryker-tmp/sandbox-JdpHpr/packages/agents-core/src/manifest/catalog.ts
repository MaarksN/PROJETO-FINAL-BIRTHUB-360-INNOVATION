// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parseAgentManifest } from "./parser.js";
import type { AgentManifest, AgentManifestTags } from "./schema.js";
export interface ManifestCatalogEntry {
  manifest: AgentManifest;
  manifestPath: string;
}
export interface ManifestSearchFilters {
  domains?: string[];
  industries?: string[];
  levels?: string[];
  personas?: string[];
  tags?: string[];
  useCases?: string[];
}
export interface ManifestSearchResult {
  facets: {
    domains: Record<string, number>;
    industries: Record<string, number>;
    levels: Record<string, number>;
    personas: Record<string, number>;
    tags: Record<string, number>;
    useCases: Record<string, number>;
  };
  page: number;
  pageSize: number;
  results: Array<ManifestCatalogEntry & {
    score: number;
  }>;
  total: number;
}
export function isInstallableManifest(manifest: AgentManifest): boolean {
  if (stryMutAct_9fa48("13")) {
    {}
  } else {
    stryCov_9fa48("13");
    return stryMutAct_9fa48("16") ? manifest.agent.kind === "catalog" : stryMutAct_9fa48("15") ? false : stryMutAct_9fa48("14") ? true : (stryCov_9fa48("14", "15", "16"), manifest.agent.kind !== (stryMutAct_9fa48("17") ? "" : (stryCov_9fa48("17"), "catalog")));
  }
}
async function walkDirectory(dirPath: string): Promise<string[]> {
  if (stryMutAct_9fa48("18")) {
    {}
  } else {
    stryCov_9fa48("18");
    const entries = await readdir(dirPath, stryMutAct_9fa48("19") ? {} : (stryCov_9fa48("19"), {
      withFileTypes: stryMutAct_9fa48("20") ? false : (stryCov_9fa48("20"), true)
    }));
    const files: string[] = stryMutAct_9fa48("21") ? ["Stryker was here"] : (stryCov_9fa48("21"), []);
    for (const entry of entries) {
      if (stryMutAct_9fa48("22")) {
        {}
      } else {
        stryCov_9fa48("22");
        const entryPath = path.join(dirPath, entry.name);
        if (stryMutAct_9fa48("24") ? false : stryMutAct_9fa48("23") ? true : (stryCov_9fa48("23", "24"), entry.isDirectory())) {
          if (stryMutAct_9fa48("25")) {
            {}
          } else {
            stryCov_9fa48("25");
            files.push(...(await walkDirectory(entryPath)));
            continue;
          }
        }
        if (stryMutAct_9fa48("28") ? entry.isFile() || entry.name === "manifest.json" : stryMutAct_9fa48("27") ? false : stryMutAct_9fa48("26") ? true : (stryCov_9fa48("26", "27", "28"), entry.isFile() && (stryMutAct_9fa48("30") ? entry.name !== "manifest.json" : stryMutAct_9fa48("29") ? true : (stryCov_9fa48("29", "30"), entry.name === (stryMutAct_9fa48("31") ? "" : (stryCov_9fa48("31"), "manifest.json")))))) {
          if (stryMutAct_9fa48("32")) {
            {}
          } else {
            stryCov_9fa48("32");
            files.push(entryPath);
          }
        }
      }
    }
    return files;
  }
}
function normalize(value: string): string {
  if (stryMutAct_9fa48("33")) {
    {}
  } else {
    stryCov_9fa48("33");
    return stryMutAct_9fa48("35") ? value.toLowerCase() : stryMutAct_9fa48("34") ? value.trim().toUpperCase() : (stryCov_9fa48("34", "35"), value.trim().toLowerCase());
  }
}
export function canonicalizeAgentId(value: string): string {
  if (stryMutAct_9fa48("36")) {
    {}
  } else {
    stryCov_9fa48("36");
    return normalize(value).replace(stryMutAct_9fa48("39") ? /[_\S]+/g : stryMutAct_9fa48("38") ? /[^_\s]+/g : stryMutAct_9fa48("37") ? /[_\s]/g : (stryCov_9fa48("37", "38", "39"), /[_\s]+/g), stryMutAct_9fa48("40") ? "" : (stryCov_9fa48("40"), "-")).replace(stryMutAct_9fa48("41") ? /-/g : (stryCov_9fa48("41"), /-+/g), stryMutAct_9fa48("42") ? "" : (stryCov_9fa48("42"), "-"));
  }
}
export function agentIdsMatch(left: string, right: string): boolean {
  if (stryMutAct_9fa48("43")) {
    {}
  } else {
    stryCov_9fa48("43");
    return stryMutAct_9fa48("46") ? canonicalizeAgentId(left) !== canonicalizeAgentId(right) : stryMutAct_9fa48("45") ? false : stryMutAct_9fa48("44") ? true : (stryCov_9fa48("44", "45", "46"), canonicalizeAgentId(left) === canonicalizeAgentId(right));
  }
}
export function findManifestCatalogEntryByAgentId(catalog: ManifestCatalogEntry[], agentId: string): ManifestCatalogEntry | null {
  if (stryMutAct_9fa48("47")) {
    {}
  } else {
    stryCov_9fa48("47");
    const canonicalAgentId = canonicalizeAgentId(agentId);
    return stryMutAct_9fa48("48") ? catalog.find(entry => canonicalizeAgentId(entry.manifest.agent.id) === canonicalAgentId) && null : (stryCov_9fa48("48"), catalog.find(stryMutAct_9fa48("49") ? () => undefined : (stryCov_9fa48("49"), entry => stryMutAct_9fa48("52") ? canonicalizeAgentId(entry.manifest.agent.id) !== canonicalAgentId : stryMutAct_9fa48("51") ? false : stryMutAct_9fa48("50") ? true : (stryCov_9fa48("50", "51", "52"), canonicalizeAgentId(entry.manifest.agent.id) === canonicalAgentId))) ?? null);
  }
}
function hasAny(candidateValues: string[], targetValues?: string[]): boolean {
  if (stryMutAct_9fa48("53")) {
    {}
  } else {
    stryCov_9fa48("53");
    if (stryMutAct_9fa48("56") ? !targetValues && targetValues.length === 0 : stryMutAct_9fa48("55") ? false : stryMutAct_9fa48("54") ? true : (stryCov_9fa48("54", "55", "56"), (stryMutAct_9fa48("57") ? targetValues : (stryCov_9fa48("57"), !targetValues)) || (stryMutAct_9fa48("59") ? targetValues.length !== 0 : stryMutAct_9fa48("58") ? false : (stryCov_9fa48("58", "59"), targetValues.length === 0)))) {
      if (stryMutAct_9fa48("60")) {
        {}
      } else {
        stryCov_9fa48("60");
        return stryMutAct_9fa48("61") ? false : (stryCov_9fa48("61"), true);
      }
    }
    const candidateSet = new Set(candidateValues.map(normalize));
    return stryMutAct_9fa48("62") ? targetValues.map(normalize).every(value => candidateSet.has(value)) : (stryCov_9fa48("62"), targetValues.map(normalize).some(stryMutAct_9fa48("63") ? () => undefined : (stryCov_9fa48("63"), value => candidateSet.has(value))));
  }
}
function collectFlatTags(tags: AgentManifestTags): string[] {
  if (stryMutAct_9fa48("64")) {
    {}
  } else {
    stryCov_9fa48("64");
    return (stryMutAct_9fa48("65") ? [] : (stryCov_9fa48("65"), [...tags.domain, ...tags.level, ...tags.persona, ...tags[stryMutAct_9fa48("66") ? "" : (stryCov_9fa48("66"), "use-case")], ...tags.industry])).map(normalize);
  }
}
function calculateSearchScore(manifest: AgentManifest, query?: string): number {
  if (stryMutAct_9fa48("67")) {
    {}
  } else {
    stryCov_9fa48("67");
    const normalizedQuery = query ? normalize(query) : stryMutAct_9fa48("68") ? "Stryker was here!" : (stryCov_9fa48("68"), "");
    const canonicalQuery = query ? canonicalizeAgentId(query) : stryMutAct_9fa48("69") ? "Stryker was here!" : (stryCov_9fa48("69"), "");
    if (stryMutAct_9fa48("72") ? false : stryMutAct_9fa48("71") ? true : stryMutAct_9fa48("70") ? normalizedQuery : (stryCov_9fa48("70", "71", "72"), !normalizedQuery)) {
      if (stryMutAct_9fa48("73")) {
        {}
      } else {
        stryCov_9fa48("73");
        return 1;
      }
    }
    const agentId = canonicalizeAgentId(manifest.agent.id);
    const name = normalize(manifest.agent.name);
    const description = normalize(manifest.agent.description);
    const tags = collectFlatTags(manifest.tags);
    const keywords = manifest.keywords.map(normalize);
    const skills = manifest.skills.map(stryMutAct_9fa48("74") ? () => undefined : (stryCov_9fa48("74"), skill => stryMutAct_9fa48("75") ? `` : (stryCov_9fa48("75"), `${normalize(skill.name)} ${normalize(skill.description)}`)));
    const tools = manifest.tools.map(stryMutAct_9fa48("76") ? () => undefined : (stryCov_9fa48("76"), tool => stryMutAct_9fa48("77") ? `` : (stryCov_9fa48("77"), `${normalize(tool.name)} ${normalize(tool.description)}`)));
    let score = 0;
    if (stryMutAct_9fa48("80") ? name !== normalizedQuery : stryMutAct_9fa48("79") ? false : stryMutAct_9fa48("78") ? true : (stryCov_9fa48("78", "79", "80"), name === normalizedQuery)) {
      if (stryMutAct_9fa48("81")) {
        {}
      } else {
        stryCov_9fa48("81");
        stryMutAct_9fa48("82") ? score -= 32 : (stryCov_9fa48("82"), score += 32);
      }
    }
    if (stryMutAct_9fa48("85") ? agentId !== canonicalQuery : stryMutAct_9fa48("84") ? false : stryMutAct_9fa48("83") ? true : (stryCov_9fa48("83", "84", "85"), agentId === canonicalQuery)) {
      if (stryMutAct_9fa48("86")) {
        {}
      } else {
        stryCov_9fa48("86");
        stryMutAct_9fa48("87") ? score -= 28 : (stryCov_9fa48("87"), score += 28);
      }
    }
    if (stryMutAct_9fa48("89") ? false : stryMutAct_9fa48("88") ? true : (stryCov_9fa48("88", "89"), name.includes(normalizedQuery))) {
      if (stryMutAct_9fa48("90")) {
        {}
      } else {
        stryCov_9fa48("90");
        stryMutAct_9fa48("91") ? score -= 20 : (stryCov_9fa48("91"), score += 20);
      }
    }
    if (stryMutAct_9fa48("93") ? false : stryMutAct_9fa48("92") ? true : (stryCov_9fa48("92", "93"), agentId.includes(canonicalQuery))) {
      if (stryMutAct_9fa48("94")) {
        {}
      } else {
        stryCov_9fa48("94");
        stryMutAct_9fa48("95") ? score -= 14 : (stryCov_9fa48("95"), score += 14);
      }
    }
    if (stryMutAct_9fa48("97") ? false : stryMutAct_9fa48("96") ? true : (stryCov_9fa48("96", "97"), description.includes(normalizedQuery))) {
      if (stryMutAct_9fa48("98")) {
        {}
      } else {
        stryCov_9fa48("98");
        stryMutAct_9fa48("99") ? score -= 12 : (stryCov_9fa48("99"), score += 12);
      }
    }
    for (const tag of tags) {
      if (stryMutAct_9fa48("100")) {
        {}
      } else {
        stryCov_9fa48("100");
        if (stryMutAct_9fa48("102") ? false : stryMutAct_9fa48("101") ? true : (stryCov_9fa48("101", "102"), tag.includes(normalizedQuery))) {
          if (stryMutAct_9fa48("103")) {
            {}
          } else {
            stryCov_9fa48("103");
            stryMutAct_9fa48("104") ? score -= 6 : (stryCov_9fa48("104"), score += 6);
          }
        }
      }
    }
    for (const keyword of keywords) {
      if (stryMutAct_9fa48("105")) {
        {}
      } else {
        stryCov_9fa48("105");
        if (stryMutAct_9fa48("107") ? false : stryMutAct_9fa48("106") ? true : (stryCov_9fa48("106", "107"), keyword.includes(normalizedQuery))) {
          if (stryMutAct_9fa48("108")) {
            {}
          } else {
            stryCov_9fa48("108");
            stryMutAct_9fa48("109") ? score -= 8 : (stryCov_9fa48("109"), score += 8);
          }
        }
      }
    }
    for (const skillText of skills) {
      if (stryMutAct_9fa48("110")) {
        {}
      } else {
        stryCov_9fa48("110");
        if (stryMutAct_9fa48("112") ? false : stryMutAct_9fa48("111") ? true : (stryCov_9fa48("111", "112"), skillText.includes(normalizedQuery))) {
          if (stryMutAct_9fa48("113")) {
            {}
          } else {
            stryCov_9fa48("113");
            stryMutAct_9fa48("114") ? score -= 4 : (stryCov_9fa48("114"), score += 4);
          }
        }
      }
    }
    for (const toolText of tools) {
      if (stryMutAct_9fa48("115")) {
        {}
      } else {
        stryCov_9fa48("115");
        if (stryMutAct_9fa48("117") ? false : stryMutAct_9fa48("116") ? true : (stryCov_9fa48("116", "117"), toolText.includes(normalizedQuery))) {
          if (stryMutAct_9fa48("118")) {
            {}
          } else {
            stryCov_9fa48("118");
            stryMutAct_9fa48("119") ? score -= 3 : (stryCov_9fa48("119"), score += 3);
          }
        }
      }
    }
    return score;
  }
}
function buildFacets(entries: ManifestCatalogEntry[]): ManifestSearchResult["facets"] {
  if (stryMutAct_9fa48("120")) {
    {}
  } else {
    stryCov_9fa48("120");
    const facets: ManifestSearchResult["facets"] = stryMutAct_9fa48("121") ? {} : (stryCov_9fa48("121"), {
      domains: {},
      industries: {},
      levels: {},
      personas: {},
      tags: {},
      useCases: {}
    });
    const increment = (bucket: Record<string, number>, value: string) => {
      if (stryMutAct_9fa48("122")) {
        {}
      } else {
        stryCov_9fa48("122");
        const normalized = normalize(value);
        bucket[normalized] = stryMutAct_9fa48("123") ? (bucket[normalized] ?? 0) - 1 : (stryCov_9fa48("123"), (stryMutAct_9fa48("124") ? bucket[normalized] && 0 : (stryCov_9fa48("124"), bucket[normalized] ?? 0)) + 1);
        facets.tags[normalized] = stryMutAct_9fa48("125") ? (facets.tags[normalized] ?? 0) - 1 : (stryCov_9fa48("125"), (stryMutAct_9fa48("126") ? facets.tags[normalized] && 0 : (stryCov_9fa48("126"), facets.tags[normalized] ?? 0)) + 1);
      }
    };
    for (const entry of entries) {
      if (stryMutAct_9fa48("127")) {
        {}
      } else {
        stryCov_9fa48("127");
        for (const domain of entry.manifest.tags.domain) {
          if (stryMutAct_9fa48("128")) {
            {}
          } else {
            stryCov_9fa48("128");
            increment(facets.domains, domain);
          }
        }
        for (const level of entry.manifest.tags.level) {
          if (stryMutAct_9fa48("129")) {
            {}
          } else {
            stryCov_9fa48("129");
            increment(facets.levels, level);
          }
        }
        for (const persona of entry.manifest.tags.persona) {
          if (stryMutAct_9fa48("130")) {
            {}
          } else {
            stryCov_9fa48("130");
            increment(facets.personas, persona);
          }
        }
        for (const useCase of entry.manifest.tags[stryMutAct_9fa48("131") ? "" : (stryCov_9fa48("131"), "use-case")]) {
          if (stryMutAct_9fa48("132")) {
            {}
          } else {
            stryCov_9fa48("132");
            increment(facets.useCases, useCase);
          }
        }
        for (const industry of entry.manifest.tags.industry) {
          if (stryMutAct_9fa48("133")) {
            {}
          } else {
            stryCov_9fa48("133");
            increment(facets.industries, industry);
          }
        }
      }
    }
    return facets;
  }
}
export async function loadManifestCatalog(baseDir: string): Promise<ManifestCatalogEntry[]> {
  if (stryMutAct_9fa48("134")) {
    {}
  } else {
    stryCov_9fa48("134");
    const manifestPaths = await walkDirectory(baseDir);
    const catalogEntries: ManifestCatalogEntry[] = stryMutAct_9fa48("135") ? ["Stryker was here"] : (stryCov_9fa48("135"), []);
    for (const manifestPath of manifestPaths) {
      if (stryMutAct_9fa48("136")) {
        {}
      } else {
        stryCov_9fa48("136");
        const manifestRaw = await readFile(manifestPath, stryMutAct_9fa48("137") ? "" : (stryCov_9fa48("137"), "utf8"));
        const manifestJson = JSON.parse(manifestRaw) as unknown;
        const manifest = parseAgentManifest(manifestJson);
        catalogEntries.push(stryMutAct_9fa48("138") ? {} : (stryCov_9fa48("138"), {
          manifest,
          manifestPath
        }));
      }
    }
    return catalogEntries;
  }
}
export function searchManifestCatalog(catalog: ManifestCatalogEntry[], input: {
  filters?: ManifestSearchFilters;
  includeCatalogEntries?: boolean;
  page?: number;
  pageSize?: number;
  query?: string;
}): ManifestSearchResult {
  if (stryMutAct_9fa48("139")) {
    {}
  } else {
    stryCov_9fa48("139");
    const page = stryMutAct_9fa48("140") ? Math.min(input.page ?? 1, 1) : (stryCov_9fa48("140"), Math.max(stryMutAct_9fa48("141") ? input.page && 1 : (stryCov_9fa48("141"), input.page ?? 1), 1));
    const pageSize = stryMutAct_9fa48("142") ? Math.max(Math.max(input.pageSize ?? 12, 1), 100) : (stryCov_9fa48("142"), Math.min(stryMutAct_9fa48("143") ? Math.min(input.pageSize ?? 12, 1) : (stryCov_9fa48("143"), Math.max(stryMutAct_9fa48("144") ? input.pageSize && 12 : (stryCov_9fa48("144"), input.pageSize ?? 12), 1)), 100));
    const filters = stryMutAct_9fa48("145") ? input.filters && {} : (stryCov_9fa48("145"), input.filters ?? {});
    const includeCatalogEntries = stryMutAct_9fa48("146") ? input.includeCatalogEntries && false : (stryCov_9fa48("146"), input.includeCatalogEntries ?? (stryMutAct_9fa48("147") ? true : (stryCov_9fa48("147"), false)));
    const filtered = stryMutAct_9fa48("148") ? catalog : (stryCov_9fa48("148"), catalog.filter(entry => {
      if (stryMutAct_9fa48("149")) {
        {}
      } else {
        stryCov_9fa48("149");
        const tags = entry.manifest.tags;
        return stryMutAct_9fa48("152") ? (includeCatalogEntries || isInstallableManifest(entry.manifest)) && hasAny(tags.domain, filters.domains) && hasAny(tags.level, filters.levels) && hasAny(tags.persona, filters.personas) && hasAny(tags["use-case"], filters.useCases) && hasAny(tags.industry, filters.industries) || hasAny(collectFlatTags(tags), filters.tags) : stryMutAct_9fa48("151") ? false : stryMutAct_9fa48("150") ? true : (stryCov_9fa48("150", "151", "152"), (stryMutAct_9fa48("154") ? (includeCatalogEntries || isInstallableManifest(entry.manifest)) && hasAny(tags.domain, filters.domains) && hasAny(tags.level, filters.levels) && hasAny(tags.persona, filters.personas) && hasAny(tags["use-case"], filters.useCases) || hasAny(tags.industry, filters.industries) : stryMutAct_9fa48("153") ? true : (stryCov_9fa48("153", "154"), (stryMutAct_9fa48("156") ? (includeCatalogEntries || isInstallableManifest(entry.manifest)) && hasAny(tags.domain, filters.domains) && hasAny(tags.level, filters.levels) && hasAny(tags.persona, filters.personas) || hasAny(tags["use-case"], filters.useCases) : stryMutAct_9fa48("155") ? true : (stryCov_9fa48("155", "156"), (stryMutAct_9fa48("158") ? (includeCatalogEntries || isInstallableManifest(entry.manifest)) && hasAny(tags.domain, filters.domains) && hasAny(tags.level, filters.levels) || hasAny(tags.persona, filters.personas) : stryMutAct_9fa48("157") ? true : (stryCov_9fa48("157", "158"), (stryMutAct_9fa48("160") ? (includeCatalogEntries || isInstallableManifest(entry.manifest)) && hasAny(tags.domain, filters.domains) || hasAny(tags.level, filters.levels) : stryMutAct_9fa48("159") ? true : (stryCov_9fa48("159", "160"), (stryMutAct_9fa48("162") ? includeCatalogEntries || isInstallableManifest(entry.manifest) || hasAny(tags.domain, filters.domains) : stryMutAct_9fa48("161") ? true : (stryCov_9fa48("161", "162"), (stryMutAct_9fa48("164") ? includeCatalogEntries && isInstallableManifest(entry.manifest) : stryMutAct_9fa48("163") ? true : (stryCov_9fa48("163", "164"), includeCatalogEntries || isInstallableManifest(entry.manifest))) && hasAny(tags.domain, filters.domains))) && hasAny(tags.level, filters.levels))) && hasAny(tags.persona, filters.personas))) && hasAny(tags[stryMutAct_9fa48("165") ? "" : (stryCov_9fa48("165"), "use-case")], filters.useCases))) && hasAny(tags.industry, filters.industries))) && hasAny(collectFlatTags(tags), filters.tags));
      }
    }));
    const ranked = stryMutAct_9fa48("167") ? filtered.map(entry => ({
      ...entry,
      score: calculateSearchScore(entry.manifest, input.query)
    })).sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      return left.manifest.agent.name.localeCompare(right.manifest.agent.name);
    }) : stryMutAct_9fa48("166") ? filtered.map(entry => ({
      ...entry,
      score: calculateSearchScore(entry.manifest, input.query)
    })).filter(entry => entry.score > 0) : (stryCov_9fa48("166", "167"), filtered.map(stryMutAct_9fa48("168") ? () => undefined : (stryCov_9fa48("168"), entry => stryMutAct_9fa48("169") ? {} : (stryCov_9fa48("169"), {
      ...entry,
      score: calculateSearchScore(entry.manifest, input.query)
    }))).filter(stryMutAct_9fa48("170") ? () => undefined : (stryCov_9fa48("170"), entry => stryMutAct_9fa48("174") ? entry.score <= 0 : stryMutAct_9fa48("173") ? entry.score >= 0 : stryMutAct_9fa48("172") ? false : stryMutAct_9fa48("171") ? true : (stryCov_9fa48("171", "172", "173", "174"), entry.score > 0))).sort((left, right) => {
      if (stryMutAct_9fa48("175")) {
        {}
      } else {
        stryCov_9fa48("175");
        if (stryMutAct_9fa48("178") ? right.score === left.score : stryMutAct_9fa48("177") ? false : stryMutAct_9fa48("176") ? true : (stryCov_9fa48("176", "177", "178"), right.score !== left.score)) {
          if (stryMutAct_9fa48("179")) {
            {}
          } else {
            stryCov_9fa48("179");
            return stryMutAct_9fa48("180") ? right.score + left.score : (stryCov_9fa48("180"), right.score - left.score);
          }
        }
        return left.manifest.agent.name.localeCompare(right.manifest.agent.name);
      }
    }));
    const start = stryMutAct_9fa48("181") ? (page - 1) / pageSize : (stryCov_9fa48("181"), (stryMutAct_9fa48("182") ? page + 1 : (stryCov_9fa48("182"), page - 1)) * pageSize);
    const end = stryMutAct_9fa48("183") ? start - pageSize : (stryCov_9fa48("183"), start + pageSize);
    return stryMutAct_9fa48("184") ? {} : (stryCov_9fa48("184"), {
      facets: buildFacets(filtered),
      page,
      pageSize,
      results: stryMutAct_9fa48("185") ? ranked : (stryCov_9fa48("185"), ranked.slice(start, end)),
      total: ranked.length
    });
  }
}
export function recommendAgentsForTenant(catalog: ManifestCatalogEntry[], tenantIndustry: string, limit = 6): Array<ManifestCatalogEntry & {
  recommendationScore: number;
}> {
  if (stryMutAct_9fa48("186")) {
    {}
  } else {
    stryCov_9fa48("186");
    const normalizedIndustry = normalize(tenantIndustry);
    return stryMutAct_9fa48("189") ? catalog.map(entry => {
      const industryTags = entry.manifest.tags.industry.map(normalize);
      const domainTags = entry.manifest.tags.domain.map(normalize);
      let recommendationScore = 1;
      if (industryTags.includes(normalizedIndustry)) {
        recommendationScore += 15;
      }
      if (domainTags.includes(normalizedIndustry)) {
        recommendationScore += 9;
      }
      if (normalizedIndustry.includes("sales") && (entry.manifest.agent.id.includes("cro") || entry.manifest.agent.id.includes("sales"))) {
        recommendationScore += 10;
      }
      return {
        ...entry,
        recommendationScore
      };
    }).sort((left, right) => right.recommendationScore - left.recommendationScore).slice(0, limit) : stryMutAct_9fa48("188") ? catalog.filter(entry => isInstallableManifest(entry.manifest)).map(entry => {
      const industryTags = entry.manifest.tags.industry.map(normalize);
      const domainTags = entry.manifest.tags.domain.map(normalize);
      let recommendationScore = 1;
      if (industryTags.includes(normalizedIndustry)) {
        recommendationScore += 15;
      }
      if (domainTags.includes(normalizedIndustry)) {
        recommendationScore += 9;
      }
      if (normalizedIndustry.includes("sales") && (entry.manifest.agent.id.includes("cro") || entry.manifest.agent.id.includes("sales"))) {
        recommendationScore += 10;
      }
      return {
        ...entry,
        recommendationScore
      };
    }).slice(0, limit) : stryMutAct_9fa48("187") ? catalog.filter(entry => isInstallableManifest(entry.manifest)).map(entry => {
      const industryTags = entry.manifest.tags.industry.map(normalize);
      const domainTags = entry.manifest.tags.domain.map(normalize);
      let recommendationScore = 1;
      if (industryTags.includes(normalizedIndustry)) {
        recommendationScore += 15;
      }
      if (domainTags.includes(normalizedIndustry)) {
        recommendationScore += 9;
      }
      if (normalizedIndustry.includes("sales") && (entry.manifest.agent.id.includes("cro") || entry.manifest.agent.id.includes("sales"))) {
        recommendationScore += 10;
      }
      return {
        ...entry,
        recommendationScore
      };
    }).sort((left, right) => right.recommendationScore - left.recommendationScore) : (stryCov_9fa48("187", "188", "189"), catalog.filter(stryMutAct_9fa48("190") ? () => undefined : (stryCov_9fa48("190"), entry => isInstallableManifest(entry.manifest))).map(entry => {
      if (stryMutAct_9fa48("191")) {
        {}
      } else {
        stryCov_9fa48("191");
        const industryTags = entry.manifest.tags.industry.map(normalize);
        const domainTags = entry.manifest.tags.domain.map(normalize);
        let recommendationScore = 1;
        if (stryMutAct_9fa48("193") ? false : stryMutAct_9fa48("192") ? true : (stryCov_9fa48("192", "193"), industryTags.includes(normalizedIndustry))) {
          if (stryMutAct_9fa48("194")) {
            {}
          } else {
            stryCov_9fa48("194");
            stryMutAct_9fa48("195") ? recommendationScore -= 15 : (stryCov_9fa48("195"), recommendationScore += 15);
          }
        }
        if (stryMutAct_9fa48("197") ? false : stryMutAct_9fa48("196") ? true : (stryCov_9fa48("196", "197"), domainTags.includes(normalizedIndustry))) {
          if (stryMutAct_9fa48("198")) {
            {}
          } else {
            stryCov_9fa48("198");
            stryMutAct_9fa48("199") ? recommendationScore -= 9 : (stryCov_9fa48("199"), recommendationScore += 9);
          }
        }
        if (stryMutAct_9fa48("202") ? normalizedIndustry.includes("sales") || entry.manifest.agent.id.includes("cro") || entry.manifest.agent.id.includes("sales") : stryMutAct_9fa48("201") ? false : stryMutAct_9fa48("200") ? true : (stryCov_9fa48("200", "201", "202"), normalizedIndustry.includes(stryMutAct_9fa48("203") ? "" : (stryCov_9fa48("203"), "sales")) && (stryMutAct_9fa48("205") ? entry.manifest.agent.id.includes("cro") && entry.manifest.agent.id.includes("sales") : stryMutAct_9fa48("204") ? true : (stryCov_9fa48("204", "205"), entry.manifest.agent.id.includes(stryMutAct_9fa48("206") ? "" : (stryCov_9fa48("206"), "cro")) || entry.manifest.agent.id.includes(stryMutAct_9fa48("207") ? "" : (stryCov_9fa48("207"), "sales")))))) {
          if (stryMutAct_9fa48("208")) {
            {}
          } else {
            stryCov_9fa48("208");
            stryMutAct_9fa48("209") ? recommendationScore -= 10 : (stryCov_9fa48("209"), recommendationScore += 10);
          }
        }
        return stryMutAct_9fa48("210") ? {} : (stryCov_9fa48("210"), {
          ...entry,
          recommendationScore
        });
      }
    }).sort(stryMutAct_9fa48("211") ? () => undefined : (stryCov_9fa48("211"), (left, right) => stryMutAct_9fa48("212") ? right.recommendationScore + left.recommendationScore : (stryCov_9fa48("212"), right.recommendationScore - left.recommendationScore))).slice(0, limit));
  }
}