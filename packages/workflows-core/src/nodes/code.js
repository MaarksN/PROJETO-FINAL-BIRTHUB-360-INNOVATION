// 
import vm from "node:vm";
const MAX_MEMORY_BYTES = 128 * 1024 * 1024;
export function executeCodeNode(config, input, context) {
    const serializedInput = JSON.stringify(input ?? null);
    if (Buffer.byteLength(serializedInput, "utf8") > MAX_MEMORY_BYTES) {
        throw new Error("CODE_NODE_MEMORY_LIMIT_EXCEEDED");
    }
    const timeout = Math.min(Math.max(config.timeout_ms ?? 1000, 1), 1000);
    const script = new vm.Script(`
      "use strict";
      const runner = (input, context) => {
        ${config.source}
      };
      runner(input, context);
    `, {
        filename: "workflow-step-code.js"
    });
    const sandbox = Object.freeze({
        context,
        input
    });
    const result = script.runInNewContext(sandbox, {
        timeout
    });
    if (Buffer.byteLength(JSON.stringify(result ?? null), "utf8") > MAX_MEMORY_BYTES) {
        throw new Error("CODE_NODE_MEMORY_LIMIT_EXCEEDED");
    }
    return result;
}
