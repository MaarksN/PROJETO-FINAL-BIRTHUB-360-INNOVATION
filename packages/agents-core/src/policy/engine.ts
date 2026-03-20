import { isIP } from "node:net";

export type PolicyEffect = "allow" | "deny";
export type PolicyTemplateName = "admin" | "readonly" | "standard";

export interface PolicyRule {
  id: string;
  action: string;
  effect: PolicyEffect;
  enabled?: boolean;
  reason?: string;
  agentId?: string | null;
  tenantId?: string | null;
}

export interface PolicyEvaluationResult {
  granted: boolean;
  reason: string;
  matchedRuleId?: string;
}

export interface PolicyContext {
  tenantId?: string | null;
  metadata?: Record<string, unknown>;
}

// [SOURCE] ADR-015 / Checklist-Session-Security.md - GAP-SEC-005
export const SSRF_BLOCKED_RANGES = [
  "10.0.0.0/8",
  "127.0.0.1/32",
  "169.254.169.254/32",
  "192.168.0.0/16",
  "172.16.0.0/12"
] as const;

export function isBlockedSsrfIp(hostname: string): boolean {
  const normalized = hostname.toLowerCase();

  if (isIP(normalized) === 0) {
    return false;
  }

  return (
    normalized === "0.0.0.0" ||
    normalized === "127.0.0.1" ||
    normalized === "::1" ||
    normalized === "169.254.169.254" ||
    normalized.startsWith("10.") ||
    normalized.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(normalized) ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd")
  );
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesAction(pattern: string, action: string): boolean {
  if (pattern === "*") {
    return true;
  }

  if (!pattern.includes("*")) {
    return pattern === action;
  }

  const regex = new RegExp(`^${escapeRegex(pattern).replace(/\\\*/g, ".*")}$`);
  return regex.test(action);
}

function isRuleEnabled(rule: PolicyRule): boolean {
  return rule.enabled ?? true;
}

function matchesScope(rule: PolicyRule, agentId: string, context: PolicyContext): boolean {
  const tenantMatches = rule.tenantId === undefined || rule.tenantId === null || rule.tenantId === context.tenantId;
  const agentMatches = rule.agentId === undefined || rule.agentId === null || rule.agentId === agentId;
  return tenantMatches && agentMatches;
}

export class PolicyDeniedError extends Error {
  readonly code = "POLICY_DENIED";

  constructor(message: string) {
    super(message);
    this.name = "PolicyDeniedError";
  }
}

export class PolicyEngine {
  private rules: PolicyRule[] = [];

  constructor(initialRules: PolicyRule[] = []) {
    this.rules = initialRules.slice();
  }

  setRules(rules: PolicyRule[]): void {
    this.rules = rules.slice();
  }

  getRules(): PolicyRule[] {
    return this.rules.slice();
  }

  addRule(rule: PolicyRule): void {
    this.rules.push(rule);
  }

  evaluate(agentId: string, action: string, context: PolicyContext = {}): PolicyEvaluationResult {
    const matchingRules = this.rules.filter(
      (rule) =>
        isRuleEnabled(rule) &&
        matchesScope(rule, agentId, context) &&
        matchesAction(rule.action, action)
    );

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

const templateRules: Record<PolicyTemplateName, Omit<PolicyRule, "agentId" | "id" | "tenantId">[]> = {
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

export function createPolicyTemplate(
  template: PolicyTemplateName,
  tenantId: string,
  agentId: string
): PolicyRule[] {
  return templateRules[template].map((rule, index) => ({
    ...rule,
    agentId,
    id: `${template}-${index + 1}`,
    tenantId
  }));
}

export interface ManagedPolicy extends PolicyRule {
  name: string;
}

export class InMemoryPolicyAdminStore {
  private readonly policies = new Map<string, ManagedPolicy>();

  list(tenantId: string, agentId: string): ManagedPolicy[] {
    return Array.from(this.policies.values()).filter(
      (policy) => policy.tenantId === tenantId && policy.agentId === agentId
    );
  }

  upsert(policy: ManagedPolicy): ManagedPolicy {
    this.policies.set(policy.id, { ...policy });
    return policy;
  }

  toggle(policyId: string, enabled: boolean): ManagedPolicy | null {
    const current = this.policies.get(policyId);
    if (!current) {
      return null;
    }

    const updated = { ...current, enabled };
    this.policies.set(policyId, updated);
    return updated;
  }
}
