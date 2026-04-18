const DEFAULT_TOKEN_BUDGET = 8_000;
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function matchesPattern(candidate, pattern) {
    const regex = new RegExp(`^${escapeRegex(pattern).replace(/\\\*/g, ".*")}$`);
    return regex.test(candidate);
}
export class InMemoryAgentMemoryBackend {
    records = new Map();
    sweepExpired(now = Date.now()) {
        for (const [key, record] of this.records.entries()) {
            if (record.expiresAt !== undefined && record.expiresAt <= now) {
                this.records.delete(key);
            }
        }
    }
    async set(key, value, ttlSeconds) {
        await Promise.resolve();
        const expiresAt = ttlSeconds !== undefined ? Date.now() + ttlSeconds * 1000 : undefined;
        this.records.set(key, expiresAt === undefined ? { value } : { expiresAt, value });
    }
    async get(key) {
        await Promise.resolve();
        this.sweepExpired();
        return this.records.get(key)?.value ?? null;
    }
    async del(key) {
        await Promise.resolve();
        return this.records.delete(key) ? 1 : 0;
    }
    async keys(pattern) {
        await Promise.resolve();
        this.sweepExpired();
        return Array.from(this.records.keys()).filter((key) => matchesPattern(key, pattern));
    }
}
function buildNamespacedKey(tenantId, agentId, memoryKey) {
    if (!tenantId.trim() || !agentId.trim() || !memoryKey.trim()) {
        throw new Error("tenantId, agentId and memoryKey are mandatory");
    }
    return `${tenantId}:${agentId}:${memoryKey}`;
}
function buildSharedLearningKey(tenantId, memoryKey) {
    if (!tenantId.trim() || !memoryKey.trim()) {
        throw new Error("tenantId and memoryKey are mandatory");
    }
    return `${tenantId}:shared-learning:${memoryKey}`;
}
export function estimateTokenCount(content) {
    return Math.ceil(content.length / 4);
}
export function compressConversationMessages(messages, tokenBudget = DEFAULT_TOKEN_BUDGET, tokenEstimator = estimateTokenCount) {
    if (messages.length <= 1) {
        return messages;
    }
    const safeBudget = Math.max(1, tokenBudget);
    const systemMessage = messages.find((message) => message.role === "system");
    const reversibleMessages = messages.filter((message) => message !== systemMessage).slice().reverse();
    const selected = [];
    let currentBudget = systemMessage ? tokenEstimator(systemMessage.content) : 0;
    for (const message of reversibleMessages) {
        const messageTokens = tokenEstimator(message.content);
        if (currentBudget + messageTokens > safeBudget && selected.length > 0) {
            break;
        }
        selected.push(message);
        currentBudget += messageTokens;
    }
    const ordered = selected.reverse();
    if (systemMessage) {
        return [systemMessage, ...ordered];
    }
    return ordered;
}
export class AgentMemoryService {
    backend;
    constructor(backend = new InMemoryAgentMemoryBackend()) {
        this.backend = backend;
    }
    async store(tenantId, agentId, memoryKey, value, ttlSeconds) {
        const namespacedKey = buildNamespacedKey(tenantId, agentId, memoryKey);
        await this.backend.set(namespacedKey, JSON.stringify(value), ttlSeconds);
        return namespacedKey;
    }
    async get(tenantId, agentId, memoryKey) {
        const namespacedKey = buildNamespacedKey(tenantId, agentId, memoryKey);
        const value = await this.backend.get(namespacedKey);
        return value ? JSON.parse(value) : null;
    }
    async delete(tenantId, agentId, memoryKey) {
        const namespacedKey = buildNamespacedKey(tenantId, agentId, memoryKey);
        return this.backend.del(namespacedKey);
    }
    async listByAgent(tenantId, agentId) {
        return this.backend.keys(`${tenantId}:${agentId}:*`);
    }
    async clearByAgent(tenantId, agentId) {
        const keys = await this.listByAgent(tenantId, agentId);
        const deletedCounts = await Promise.all(keys.map((key) => this.backend.del(key)));
        return deletedCounts.reduce((total, count) => total + count, 0);
    }
    async clearBySession(tenantId, agentId, sessionId) {
        const keys = await this.backend.keys(`${tenantId}:${agentId}:conversation:${sessionId}*`);
        const deletedCounts = await Promise.all(keys.map((key) => this.backend.del(key)));
        return deletedCounts.reduce((total, count) => total + count, 0);
    }
    async clearByTenant(tenantId) {
        const keys = await this.backend.keys(`${tenantId}:*`);
        const deletedCounts = await Promise.all(keys.map((key) => this.backend.del(key)));
        return deletedCounts.reduce((total, count) => total + count, 0);
    }
    async publishSharedLearning(tenantId, record, ttlSeconds) {
        const key = buildSharedLearningKey(tenantId, `${record.id}:${record.sourceAgentId}`);
        await this.backend.set(key, JSON.stringify(record), ttlSeconds);
        return key;
    }
    async getSharedLearning(tenantId, recordKey) {
        const value = await this.backend.get(buildSharedLearningKey(tenantId, recordKey));
        return value ? JSON.parse(value) : null;
    }
    async listSharedLearning(tenantId) {
        const keys = await this.backend.keys(buildSharedLearningKey(tenantId, "*"));
        const values = await Promise.all(keys.map((key) => this.backend.get(key)));
        return values
            .filter((value) => value !== null)
            .map((value) => JSON.parse(value))
            .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    }
    async querySharedLearning(tenantId, input = {}) {
        const normalizedKeywords = new Set((input.keywords ?? []).map((keyword) => keyword.trim().toLowerCase()));
        const minimumConfidence = input.minimumConfidence ?? 0;
        const records = await this.listSharedLearning(tenantId);
        return records.filter((record) => {
            if ((input.approvedOnly ?? false) && !record.approved) {
                return false;
            }
            if (record.confidence < minimumConfidence) {
                return false;
            }
            if (normalizedKeywords.size === 0) {
                return true;
            }
            return record.keywords.some((keyword) => normalizedKeywords.has(keyword.trim().toLowerCase()));
        });
    }
    async upsertConversationContext(tenantId, agentId, context, options) {
        const normalizedContext = {
            ...context,
            messages: compressConversationMessages(context.messages, options?.tokenBudget ?? DEFAULT_TOKEN_BUDGET),
            updatedAt: new Date().toISOString()
        };
        await this.store(tenantId, agentId, `conversation:${context.sessionId}`, normalizedContext, options?.ttlSeconds);
        return normalizedContext;
    }
    async getConversationContext(tenantId, agentId, sessionId) {
        return this.get(tenantId, agentId, `conversation:${sessionId}`);
    }
    async appendConversationMessage(tenantId, agentId, sessionId, message, options) {
        const currentContext = (await this.getConversationContext(tenantId, agentId, sessionId)) ?? {
            sessionId,
            messages: [],
            metadata: options?.metadata ?? {},
            updatedAt: new Date().toISOString()
        };
        const nextContext = {
            ...currentContext,
            metadata: options?.metadata ?? currentContext.metadata,
            messages: [
                ...currentContext.messages,
                {
                    content: message.content,
                    createdAt: message.createdAt ?? new Date().toISOString(),
                    role: message.role
                }
            ],
            updatedAt: new Date().toISOString()
        };
        return this.upsertConversationContext(tenantId, agentId, nextContext, options);
    }
}
