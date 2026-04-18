import { PolicyDeniedError } from "../policy/engine.js";
export class BaseTool {
    name;
    description;
    timeoutMs;
    cost;
    inputSchema;
    outputSchema;
    policyEngine;
    constructor(definition, options = {}) {
        this.name = definition.name;
        this.description = definition.description;
        this.inputSchema = definition.inputSchema;
        this.outputSchema = definition.outputSchema;
        this.timeoutMs = definition.timeoutMs ?? 30_000;
        this.cost = definition.cost;
        this.policyEngine = options.policyEngine;
    }
    async run(rawInput, context) {
        const input = this.inputSchema.parse(rawInput);
        const action = context.action ?? `tool.${this.name}`;
        if (this.policyEngine) {
            const evaluation = this.policyEngine.evaluate(context.agentId, action, context.policyContext ?? context);
            if (!evaluation.granted) {
                throw new PolicyDeniedError(evaluation.reason);
            }
        }
        const timeoutMs = context.timeoutMs ?? this.timeoutMs;
        const output = await this.withTimeout(this.execute(input, context), timeoutMs);
        return this.outputSchema.parse(output);
    }
    async withTimeout(promise, timeoutMs) {
        let timeoutHandle;
        try {
            const timeoutPromise = new Promise((_, reject) => {
                timeoutHandle = setTimeout(() => {
                    reject(new Error(`Tool '${this.name}' timed out after ${timeoutMs}ms`));
                }, timeoutMs);
            });
            return await Promise.race([promise, timeoutPromise]);
        }
        finally {
            if (timeoutHandle) {
                clearTimeout(timeoutHandle);
            }
        }
    }
}
