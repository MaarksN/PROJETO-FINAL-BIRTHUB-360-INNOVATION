import { TenantRequiredError } from "../errors/tenant-required.error.js";
import { requireTenantId } from "../tenant-context.js";
const DEFAULT_FIND_MANY_LIMIT = 100;
const MAX_FIND_MANY_LIMIT = 500;
function omitTenantId(value) {
    if (!value) {
        return value;
    }
    const { tenantId: _tenantId, ...rest } = value;
    return rest;
}
function getScopedTenantId(operation) {
    try {
        return requireTenantId(operation);
    }
    catch (error) {
        if (error instanceof TenantRequiredError) {
            throw error;
        }
        throw new TenantRequiredError(operation);
    }
}
function normalizeFindManyTake(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        return DEFAULT_FIND_MANY_LIMIT;
    }
    return Math.min(Math.max(Math.trunc(value), 1), MAX_FIND_MANY_LIMIT);
}
// @see ADR-008
export class BaseRepository {
    delegate;
    constructor(delegate) {
        this.delegate = delegate;
    }
    async create(args) {
        const tenantId = getScopedTenantId("create");
        const sanitizedData = omitTenantId(args.data);
        return this.delegate.create({
            ...args,
            data: {
                ...(sanitizedData ?? {}),
                tenantId
            }
        });
    }
    async delete(args) {
        const tenantId = getScopedTenantId("delete");
        const where = {
            ...(omitTenantId(args.where) ?? {}),
            tenantId
        };
        const existingRecord = await this.delegate.findFirst({ where });
        if (!existingRecord) {
            throw new Error("Scoped record not found.");
        }
        await this.delegate.deleteMany({ where });
        return existingRecord;
    }
    findFirst(args = {}) {
        const tenantId = getScopedTenantId("findFirst");
        return this.delegate.findFirst({
            ...args,
            where: {
                ...(omitTenantId(args.where) ?? {}),
                tenantId
            }
        });
    }
    findMany(args = {}) {
        const tenantId = getScopedTenantId("findMany");
        const take = normalizeFindManyTake(args.take);
        return this.delegate.findMany({
            ...args,
            take,
            where: {
                ...(omitTenantId(args.where) ?? {}),
                tenantId
            }
        });
    }
    async update(args) {
        const tenantId = getScopedTenantId("update");
        const where = {
            ...(omitTenantId(args.where) ?? {}),
            tenantId
        };
        const data = {
            ...(omitTenantId(args.data) ?? {}),
            tenantId
        };
        const updateResult = await this.delegate.updateMany({
            ...args,
            data,
            where
        });
        if (updateResult.count === 0) {
            throw new Error("Scoped record not found.");
        }
        const updatedRecord = await this.delegate.findFirst({ where });
        if (!updatedRecord) {
            throw new Error("Scoped record not found after update.");
        }
        return updatedRecord;
    }
}
