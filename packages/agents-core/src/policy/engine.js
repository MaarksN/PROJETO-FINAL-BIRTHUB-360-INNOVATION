function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function matchesAction(pattern, action) {
    if (pattern === "*") {
        return true;
    }
    if (!pattern.includes("*")) {
        return pattern === action;
    }
    const regex = new RegExp(`^${escapeRegex(pattern).replace(/\\\*/g, ".*")}$`);
    return regex.test(action);
}
function isRuleEnabled(rule) {
    return rule.enabled ?? true;
}
function matchesScope(rule, agentId, context) {
    const tenantMatches = rule.tenantId === undefined || rule.tenantId === null || rule.tenantId === context.tenantId;
    const agentMatches = rule.agentId === undefined || rule.agentId === null || rule.agentId === agentId;
    return tenantMatches && agentMatches;
}
export class PolicyDeniedError extends Error {
    code = "POLICY_DENIED";
    constructor(message) {
        super(message);
        this.name = "PolicyDeniedError";
    }
}
export class PolicyEngine {
    rules = [];
    constructor(initialRules = []) {
        this.rules = initialRules.slice();
    }
    setRules(rules) {
        this.rules = rules.slice();
    }
    getRules() {
        return this.rules.slice();
    }
    addRule(rule) {
        this.rules.push(rule);
    }
    evaluate(agentId, action, context = {}) {
        const matchingRules = this.rules.filter((rule) => isRuleEnabled(rule) &&
            matchesScope(rule, agentId, context) &&
            matchesAction(rule.action, action));
        const denyRule = matchingRules.find((rule) => rule.effect === "deny");
        if (denyRule) {
            return {
                granted: false,
                matchedRuleId: denyRule.id,
                reason: denyRule.reason ?? `Action '${action}' blocked by rule '${denyRule.id}'.`
            };
        }
        const allowRule = matchingRules.find((rule) => rule.effect === "allow");
        if (allowRule) {
            return {
                granted: true,
                matchedRuleId: allowRule.id,
                reason: allowRule.reason ?? `Action '${action}' allowed by rule '${allowRule.id}'.`
            };
        }
        return {
            granted: false,
            reason: `Action '${action}' denied by default policy (no allow rule found).`
        };
    }
}
const templateRules = {
    readonly: [
        { action: "tool.http", effect: "allow", reason: "Read-only template allows HTTP reads." },
        { action: "tool.db-read", effect: "allow", reason: "Read-only template allows query-only access." },
        { action: "tool.db-write", effect: "deny", reason: "Read-only template blocks mutations." },
        { action: "tool.send-email", effect: "deny", reason: "Read-only template blocks external messages." }
    ],
    standard: [
        { action: "tool.http", effect: "allow", reason: "Standard template allows HTTP tool." },
        { action: "tool.db-read", effect: "allow", reason: "Standard template allows read access." },
        { action: "tool.db-write", effect: "allow", reason: "Standard template allows controlled writes." },
        { action: "tool.send-email", effect: "allow", reason: "Standard template allows email notifications." }
    ],
    admin: [{ action: "tool.*", effect: "allow", reason: "Admin template grants full tool access." }]
};
export function createPolicyTemplate(template, tenantId, agentId) {
    return templateRules[template].map((rule, index) => ({
        ...rule,
        agentId,
        id: `${template}-${index + 1}`,
        tenantId
    }));
}
export class InMemoryPolicyAdminStore {
    policies = new Map();
    list(tenantId, agentId) {
        return Array.from(this.policies.values()).filter((policy) => policy.tenantId === tenantId && policy.agentId === agentId);
    }
    upsert(policy) {
        this.policies.set(policy.id, { ...policy });
        return policy;
    }
    toggle(policyId, enabled) {
        const current = this.policies.get(policyId);
        if (!current) {
            return null;
        }
        const updated = { ...current, enabled };
        this.policies.set(policyId, updated);
        return updated;
    }
}
