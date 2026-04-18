export class ExceededQuotaError extends Error {
    current;
    limit;
    resetAt;
    resourceType;
    tenantId;
    upgradeUrl;
    constructor(input) {
        super(`Quota exceeded for ${input.resourceType}.`);
        this.name = "ExceededQuotaError";
        this.current = input.current;
        this.limit = input.limit;
        this.resetAt = input.resetAt;
        this.resourceType = input.resourceType;
        this.tenantId = input.tenantId;
        this.upgradeUrl = input.upgradeUrl ?? "/billing";
    }
}
