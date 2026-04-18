// 
import { interpolateValue } from "../interpolation/interpolate.js";
function readSource(path, context) {
    if (!path) {
        return [];
    }
    const normalized = path.replace(/^\$\./, "");
    const segments = normalized.split(".").filter(Boolean);
    let cursor = context;
    for (const segment of segments) {
        if (typeof cursor !== "object" || cursor === null || !(segment in cursor)) {
            return [];
        }
        cursor = cursor[segment];
    }
    if (!Array.isArray(cursor)) {
        return [];
    }
    return cursor;
}
function shouldKeep(item, filter) {
    if (!filter) {
        return true;
    }
    // Minimal and deterministic filter support to avoid arbitrary code execution.
    if (filter === "truthy") {
        return Boolean(item);
    }
    if (filter === "non-empty-object") {
        return typeof item === "object" && item !== null && Object.keys(item).length > 0;
    }
    return true;
}
export function executeTransformerNode(config, context) {
    const source = readSource(config.sourcePath, context);
    const filtered = source.filter((item) => shouldKeep(item, config.filter));
    if (!config.map) {
        return filtered;
    }
    return filtered.map((_item) => interpolateValue(config.map, context));
}
