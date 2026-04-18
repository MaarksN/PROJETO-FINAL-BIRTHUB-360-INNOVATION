// 
import { interpolateValue } from "../interpolation/interpolate.js";
function findFieldValue(text, field) {
    const escapedField = field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`${escapedField}\\s*[:=-]\\s*([^\\n\\r,;]+)`, "i");
    const match = text.match(regex);
    return match?.[1]?.trim() ?? null;
}
// Max input string size (50KB) to prevent ReDoS CPU exhaustion
const MAX_TEXT_LENGTH = 50 * 1024;
export function executeAiTextExtractNode(config, context) {
    const interpolated = interpolateValue(config, context);
    const output = {};
    let textToProcess = interpolated.text || "";
    if (textToProcess.length > MAX_TEXT_LENGTH) {
        textToProcess = textToProcess.slice(0, MAX_TEXT_LENGTH);
    }
    for (const field of interpolated.fields) {
        output[field] = findFieldValue(textToProcess, field);
    }
    return output;
}
