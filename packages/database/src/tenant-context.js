import { AsyncLocalStorage } from "node:async_hooks";
import { TenantRequiredError } from "./errors/tenant-required.error.js";
const tenantContextStorage = new AsyncLocalStorage();
function normalizeTenantId(tenantId, operation) {
    const normalizedTenantId = tenantId?.trim();
    if (!normalizedTenantId) {
        throw new TenantRequiredError(operation);
    }
    return normalizedTenantId;
}
export function runWithTenantContext(context, callback) {
    const normalizedContext = Object.freeze({
        ...context,
        tenantId: normalizeTenantId(context.tenantId, "tenant context bootstrap")
    });
    return tenantContextStorage.run(normalizedContext, callback);
}
export function getTenantContext() {
    return tenantContextStorage.getStore() ?? null;
}
export function requireTenantId(operation = "this operation") {
    return normalizeTenantId(getTenantContext()?.tenantId, operation);
}
