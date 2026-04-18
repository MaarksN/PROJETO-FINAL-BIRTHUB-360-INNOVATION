// 
import { interpolateValue } from "../interpolation/interpolate.js";
function readPath(pathExpression, context) {
    const normalized = pathExpression.replace(/^\$\./, "");
    const segments = normalized.split(".").filter(Boolean);
    let cursor = context;
    for (const segment of segments) {
        if (typeof cursor !== "object" || cursor === null || !(segment in cursor)) {
            return undefined;
        }
        cursor = cursor[segment];
    }
    return cursor;
}
export function executeConditionNode(config, context) {
    const interpolated = interpolateValue(config, context);
    const value = readPath(interpolated.path, context);
    const expected = interpolated.value;
    const result = (() => {
        switch (interpolated.operator) {
            case "==":
                return value === expected;
            case "!=":
                return value !== expected;
            case ">":
                return Number(value) > Number(expected);
            case ">=":
                return Number(value) >= Number(expected);
            case "<":
                return Number(value) < Number(expected);
            case "<=":
                return Number(value) <= Number(expected);
            default:
                return false;
        }
    })();
    return {
        expected,
        operator: interpolated.operator,
        result,
        value
    };
}
