import { createHash } from "node:crypto";
import { z } from "zod";
import { BaseTool } from "./baseTool.js";
const dbWriteInputSchema = z
    .object({
    data: z.record(z.string(), z.unknown()),
    operation: z.enum(["DELETE", "INSERT", "UPDATE", "UPSERT"]),
    table: z.string().min(1),
    where: z.record(z.string(), z.unknown()).default({})
})
    .strict();
const dbWriteOutputSchema = z
    .object({
    affectedRows: z.number().int().nonnegative()
})
    .strict();
export class DbWriteTool extends BaseTool {
    auditPublisher;
    executor;
    constructor(options = {}) {
        super({
            description: "Database mutation tool with mandatory audit event emission.",
            inputSchema: dbWriteInputSchema,
            name: "db-write",
            outputSchema: dbWriteOutputSchema
        }, options);
        this.auditPublisher = options.auditPublisher;
        this.executor = options.executor ?? (() => Promise.resolve(0));
    }
    async execute(input, context) {
        if (!this.auditPublisher) {
            throw new Error("db-write requires an audit publisher before commit.");
        }
        const payload = {
            data: input.data,
            operation: input.operation,
            table: input.table,
            tenantId: context.tenantId,
            where: input.where
        };
        const digest = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
        await this.auditPublisher({
            action: "db-write",
            actorAgentId: context.agentId,
            digest,
            operation: input.operation,
            table: input.table,
            tenantId: context.tenantId
        });
        const affectedRows = await this.executor(payload);
        return { affectedRows };
    }
}
