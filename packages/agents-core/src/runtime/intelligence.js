function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function slugify(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-+/g, "-");
}
function uniqueStrings(values) {
    const seen = new Set();
    const result = [];
    for (const value of values.map((item) => item.trim()).filter(Boolean)) {
        const normalized = value.toLowerCase();
        if (seen.has(normalized)) {
            continue;
        }
        seen.add(normalized);
        result.push(value);
    }
    return result;
}
function normalizeString(value) {
    if (!value) {
        return null;
    }
    const normalized = slugify(value).replace(/-/g, " ");
    return normalized.length > 0 ? normalized : null;
}
function visitValue(value, visitor, depth = 0) {
    if (depth > 5) {
        return;
    }
    visitor(value);
    if (Array.isArray(value)) {
        for (const item of value) {
            visitValue(item, visitor, depth + 1);
        }
        return;
    }
    if (isRecord(value)) {
        for (const child of Object.values(value)) {
            visitValue(child, visitor, depth + 1);
        }
    }
}
function pickFirstString(value, candidates) {
    const normalizedCandidates = candidates.map((candidate) => candidate.toLowerCase());
    const queue = [value];
    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) {
            continue;
        }
        if (isRecord(current)) {
            for (const [key, child] of Object.entries(current)) {
                if (normalizedCandidates.includes(key.toLowerCase()) && typeof child === "string" && child.trim()) {
                    return child.trim();
                }
            }
            for (const child of Object.values(current)) {
                queue.push(child);
            }
        }
        else if (Array.isArray(current)) {
            for (const item of current) {
                queue.push(item);
            }
        }
    }
    return null;
}
function pickFirstBoolean(value, candidates) {
    const normalizedCandidates = candidates.map((candidate) => candidate.toLowerCase());
    const queue = [value];
    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) {
            continue;
        }
        if (isRecord(current)) {
            for (const [key, child] of Object.entries(current)) {
                if (normalizedCandidates.includes(key.toLowerCase()) && typeof child === "boolean") {
                    return child;
                }
            }
            for (const child of Object.values(current)) {
                queue.push(child);
            }
        }
        else if (Array.isArray(current)) {
            for (const item of current) {
                queue.push(item);
            }
        }
    }
    return null;
}
function normalizeEnum(value, map, fallback) {
    if (!value) {
        return fallback;
    }
    const normalized = normalizeString(value);
    if (!normalized) {
        return fallback;
    }
    for (const [needle, target] of Object.entries(map)) {
        if (normalized.includes(needle)) {
            return target;
        }
    }
    return normalized.replace(/\s+/g, "-");
}
function inferRegulationFromIndustry(industry) {
    if (["fintech", "finance", "healthcare", "public-sector", "security"].includes(industry)) {
        return "regulated";
    }
    return "standard";
}
export function readTextSignals(value, limit = 16) {
    const results = [];
    visitValue(value, (candidate) => {
        if (results.length >= limit) {
            return;
        }
        if (typeof candidate === "string") {
            const normalized = candidate.trim().replace(/\s+/g, " ");
            if (normalized.length >= 4) {
                results.push(normalized);
            }
        }
    });
    return uniqueStrings(results).slice(0, limit);
}
export function readNumericSignals(value, limit = 32) {
    const results = [];
    visitValue(value, (candidate) => {
        if (results.length >= limit) {
            return;
        }
        if (typeof candidate === "number" && Number.isFinite(candidate)) {
            results.push(candidate);
        }
    });
    return results.slice(0, limit);
}
export function summarizeNumericSignals(numbers) {
    if (numbers.length === 0) {
        return {
            average: 0,
            count: 0,
            max: null,
            min: null,
            outlierCount: 0,
            total: 0,
            trend: "none"
        };
    }
    const total = numbers.reduce((sum, value) => sum + value, 0);
    const average = total / numbers.length;
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const variance = numbers.reduce((sum, value) => sum + (value - average) ** 2, 0) / Math.max(numbers.length, 1);
    const deviation = Math.sqrt(variance);
    const outlierCount = deviation === 0
        ? 0
        : numbers.filter((value) => Math.abs(value - average) > deviation * 2).length;
    const delta = numbers.at(-1) - numbers[0];
    const trend = numbers.length < 2
        ? "none"
        : Math.abs(delta) <= Math.max(Math.abs(average) * 0.03, 1)
            ? "flat"
            : delta > 0
                ? "up"
                : delta < 0
                    ? "down"
                    : "mixed";
    return {
        average: Math.round(average * 100) / 100,
        count: numbers.length,
        max,
        min,
        outlierCount,
        total: Math.round(total * 100) / 100,
        trend
    };
}
export function inferSegmentProfile(value, fallbackTags) {
    const industry = normalizeEnum(pickFirstString(value, ["industry", "vertical", "sector", "market"]) ??
        fallbackTags?.industry[0] ??
        null, {
        bank: "finance",
        ecommerce: "retail",
        finance: "finance",
        fintech: "fintech",
        health: "healthcare",
        hospital: "healthcare",
        industrial: "industrial",
        manufacturing: "industrial",
        public: "public-sector",
        retail: "retail",
        saas: "saas",
        sales: "sales-tech",
        security: "security"
    }, "cross-industry");
    const clientSegment = normalizeEnum(pickFirstString(value, ["clientSegment", "customerSegment", "customerType", "icp", "segment"]) ??
        null, {
        b2b: "b2b",
        b2c: "b2c",
        enterprise: "enterprise",
        mid: "mid-market",
        partner: "partner-led",
        smb: "smb",
        startup: "startup"
    }, fallbackTags?.level[0] ?? "general");
    const companySize = normalizeEnum(pickFirstString(value, ["companySize", "accountSize", "employeeBand", "size", "employees"]) ??
        null, {
        enterprise: "enterprise",
        large: "large",
        mid: "mid-market",
        small: "smb",
        smb: "smb",
        startup: "startup"
    }, clientSegment);
    const geography = normalizeEnum(pickFirstString(value, ["geography", "region", "country", "locale", "marketRegion"]) ?? null, {
        brazil: "brazil",
        br: "brazil",
        europe: "europe",
        global: "global",
        latam: "latam",
        portugal: "portugal",
        us: "united-states"
    }, "global");
    const buyingMotion = normalizeEnum(pickFirstString(value, ["buyingMotion", "motion", "salesMotion", "goToMarketMotion"]) ?? null, {
        inbound: "inbound",
        outbound: "outbound",
        partner: "partner-led",
        plg: "product-led",
        self: "self-serve",
        sales: "sales-led"
    }, "hybrid");
    const maturity = normalizeEnum(pickFirstString(value, ["maturity", "stage", "lifecycleStage", "digitalMaturity"]) ?? null, {
        early: "emerging",
        enterprise: "enterprise-ready",
        growth: "growth",
        mature: "established",
        scale: "growth",
        startup: "emerging"
    }, "growth");
    const regulation = normalizeEnum(pickFirstString(value, ["regulation", "complianceMode"]) ??
        (pickFirstBoolean(value, ["regulated", "highlyRegulated"]) ? "regulated" : null), {
        high: "highly-regulated",
        regulated: "regulated",
        standard: "standard"
    }, inferRegulationFromIndustry(industry));
    const explicitSignals = [
        pickFirstString(value, ["industry", "vertical", "sector", "market"]),
        pickFirstString(value, ["clientSegment", "customerSegment", "customerType", "icp", "segment"]),
        pickFirstString(value, ["companySize", "accountSize", "employeeBand", "size", "employees"]),
        pickFirstString(value, ["geography", "region", "country", "locale", "marketRegion"]),
        pickFirstString(value, ["buyingMotion", "motion", "salesMotion", "goToMarketMotion"]),
        pickFirstString(value, ["maturity", "stage", "lifecycleStage", "digitalMaturity"]),
        pickFirstString(value, ["regulation", "complianceMode"])
    ].filter(Boolean).length;
    const confidence = explicitSignals >= 5 ? "high" : explicitSignals >= 3 ? "medium" : "low";
    return {
        buyingMotion,
        clientSegment,
        companySize,
        confidence,
        geography,
        industry,
        maturity,
        regulation
    };
}
export function buildSegmentKeywords(profile) {
    return uniqueStrings([
        profile.industry,
        profile.clientSegment,
        profile.companySize,
        profile.geography,
        profile.buyingMotion,
        profile.regulation,
        profile.maturity,
        `${profile.industry}-${profile.clientSegment}`,
        `${profile.geography}-${profile.buyingMotion}`
    ]);
}
export { buildMemoryKey, buildPremiumLayersAssessment, buildRecommendedActions, describeCapabilityIntent, inferCapabilityType, inferCollaborationTargets, summarizePremiumLayers } from "./intelligenceRuntime.js";
