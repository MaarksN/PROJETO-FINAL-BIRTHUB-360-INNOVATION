export class PrismaQueryTimeoutError extends Error {
    model;
    operation;
    timeoutMs;
    constructor(operation, timeoutMs, model) {
        super(`Database operation '${model ? `${model}.` : ""}${operation}' exceeded the ${timeoutMs}ms timeout.`);
        this.name = "PrismaQueryTimeoutError";
        this.model = model;
        this.operation = operation;
        this.timeoutMs = timeoutMs;
    }
}
