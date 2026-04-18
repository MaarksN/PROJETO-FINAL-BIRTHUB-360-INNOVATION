import { z } from "zod";
import { BaseTool } from "./baseTool.js";
const dbReadInputSchema = z
    .object({
    params: z.array(z.unknown()).default([]),
    query: z.string().min(1)
})
    .strict();
const dbReadOutputSchema = z
    .object({
    rowCount: z.number().int().nonnegative(),
    rows: z.array(z.unknown())
})
    .strict();
function isReadOnlyQuery(query) {
    return /^\s*(select|with)\b/i.test(query);
}
export class DbReadTool extends BaseTool {
    executor;
    constructor(options = {}) {
        super({
            description: "Read-only database access with mandatory tenant scoping.",
            inputSchema: dbReadInputSchema,
            name: "db-read",
            outputSchema: dbReadOutputSchema
        }, options);
        this.executor = options.executor ?? (() => Promise.resolve([]));
    }
    async execute(input, context) {
        if (!isReadOnlyQuery(input.query)) {
            throw new Error("db-read only accepts SELECT/WITH statements.");
        }
        const scopedQuery = `${input.query}\n-- tenant_scope: ${context.tenantId}`;
        const rows = await this.executor({
            params: [...input.params, context.tenantId],
            query: scopedQuery,
            tenantId: context.tenantId
        });
        return {
            rowCount: rows.length,
            rows
        };
    }
}
