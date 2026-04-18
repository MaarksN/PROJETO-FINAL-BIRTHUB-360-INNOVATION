const TOKEN_PATTERN = /{{\s*([^{}]+)\s*}}/g;
function resolvePath(pathExpression, context) {
    const normalizedPath = pathExpression.replace(/^\$\./, "");
    const segments = normalizedPath.split(".").filter(Boolean);
    let cursor = context;
    for (const segment of segments) {
        if (typeof cursor !== "object" || cursor === null || !(segment in cursor)) {
            return undefined;
        }
        cursor = cursor[segment];
    }
    return cursor;
}
export function interpolateTemplate(value, context) {
    return value.replace(TOKEN_PATTERN, (_token, expression) => {
        const resolved = resolvePath(String(expression).trim(), context);
        if (resolved === undefined || resolved === null) {
            return "";
        }
        if (typeof resolved === "string") {
            return resolved;
        }
        return JSON.stringify(resolved);
    });
}
export function interpolateValue(value, context) {
    if (typeof value === "string") {
        return interpolateTemplate(value, context);
    }
    if (Array.isArray(value)) {
        const mapped = value.map((item) => interpolateValue(item, context));
        return mapped;
    }
    if (typeof value === "object" && value !== null) {
        const output = {};
        for (const [key, objectValue] of Object.entries(value)) {
            output[key] = interpolateValue(objectValue, context);
        }
        return output;
    }
    return value;
}
