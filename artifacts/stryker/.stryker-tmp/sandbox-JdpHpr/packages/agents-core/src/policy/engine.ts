// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
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
function escapeRegex(value: string): string {
  if (stryMutAct_9fa48("545")) {
    {}
  } else {
    stryCov_9fa48("545");
    return value.replace(stryMutAct_9fa48("546") ? /[^.*+?^${}()|[\]\\]/g : (stryCov_9fa48("546"), /[.*+?^${}()|[\]\\]/g), stryMutAct_9fa48("547") ? "" : (stryCov_9fa48("547"), "\\$&"));
  }
}
function matchesAction(pattern: string, action: string): boolean {
  if (stryMutAct_9fa48("548")) {
    {}
  } else {
    stryCov_9fa48("548");
    if (stryMutAct_9fa48("551") ? pattern !== "*" : stryMutAct_9fa48("550") ? false : stryMutAct_9fa48("549") ? true : (stryCov_9fa48("549", "550", "551"), pattern === (stryMutAct_9fa48("552") ? "" : (stryCov_9fa48("552"), "*")))) {
      if (stryMutAct_9fa48("553")) {
        {}
      } else {
        stryCov_9fa48("553");
        return stryMutAct_9fa48("554") ? false : (stryCov_9fa48("554"), true);
      }
    }
    if (stryMutAct_9fa48("557") ? false : stryMutAct_9fa48("556") ? true : stryMutAct_9fa48("555") ? pattern.includes("*") : (stryCov_9fa48("555", "556", "557"), !pattern.includes(stryMutAct_9fa48("558") ? "" : (stryCov_9fa48("558"), "*")))) {
      if (stryMutAct_9fa48("559")) {
        {}
      } else {
        stryCov_9fa48("559");
        return stryMutAct_9fa48("562") ? pattern !== action : stryMutAct_9fa48("561") ? false : stryMutAct_9fa48("560") ? true : (stryCov_9fa48("560", "561", "562"), pattern === action);
      }
    }
    const regex = new RegExp(stryMutAct_9fa48("563") ? `` : (stryCov_9fa48("563"), `^${escapeRegex(pattern).replace(/\\\*/g, stryMutAct_9fa48("564") ? "" : (stryCov_9fa48("564"), ".*"))}$`));
    return regex.test(action);
  }
}
function isRuleEnabled(rule: PolicyRule): boolean {
  if (stryMutAct_9fa48("565")) {
    {}
  } else {
    stryCov_9fa48("565");
    return stryMutAct_9fa48("566") ? rule.enabled && true : (stryCov_9fa48("566"), rule.enabled ?? (stryMutAct_9fa48("567") ? false : (stryCov_9fa48("567"), true)));
  }
}
function matchesScope(rule: PolicyRule, agentId: string, context: PolicyContext): boolean {
  if (stryMutAct_9fa48("568")) {
    {}
  } else {
    stryCov_9fa48("568");
    const tenantMatches = stryMutAct_9fa48("571") ? (rule.tenantId === undefined || rule.tenantId === null) && rule.tenantId === context.tenantId : stryMutAct_9fa48("570") ? false : stryMutAct_9fa48("569") ? true : (stryCov_9fa48("569", "570", "571"), (stryMutAct_9fa48("573") ? rule.tenantId === undefined && rule.tenantId === null : stryMutAct_9fa48("572") ? false : (stryCov_9fa48("572", "573"), (stryMutAct_9fa48("575") ? rule.tenantId !== undefined : stryMutAct_9fa48("574") ? false : (stryCov_9fa48("574", "575"), rule.tenantId === undefined)) || (stryMutAct_9fa48("577") ? rule.tenantId !== null : stryMutAct_9fa48("576") ? false : (stryCov_9fa48("576", "577"), rule.tenantId === null)))) || (stryMutAct_9fa48("579") ? rule.tenantId !== context.tenantId : stryMutAct_9fa48("578") ? false : (stryCov_9fa48("578", "579"), rule.tenantId === context.tenantId)));
    const agentMatches = stryMutAct_9fa48("582") ? (rule.agentId === undefined || rule.agentId === null) && rule.agentId === agentId : stryMutAct_9fa48("581") ? false : stryMutAct_9fa48("580") ? true : (stryCov_9fa48("580", "581", "582"), (stryMutAct_9fa48("584") ? rule.agentId === undefined && rule.agentId === null : stryMutAct_9fa48("583") ? false : (stryCov_9fa48("583", "584"), (stryMutAct_9fa48("586") ? rule.agentId !== undefined : stryMutAct_9fa48("585") ? false : (stryCov_9fa48("585", "586"), rule.agentId === undefined)) || (stryMutAct_9fa48("588") ? rule.agentId !== null : stryMutAct_9fa48("587") ? false : (stryCov_9fa48("587", "588"), rule.agentId === null)))) || (stryMutAct_9fa48("590") ? rule.agentId !== agentId : stryMutAct_9fa48("589") ? false : (stryCov_9fa48("589", "590"), rule.agentId === agentId)));
    return stryMutAct_9fa48("593") ? tenantMatches || agentMatches : stryMutAct_9fa48("592") ? false : stryMutAct_9fa48("591") ? true : (stryCov_9fa48("591", "592", "593"), tenantMatches && agentMatches);
  }
}
export class PolicyDeniedError extends Error {
  readonly code = stryMutAct_9fa48("594") ? "" : (stryCov_9fa48("594"), "POLICY_DENIED");
  constructor(message: string) {
    super(message);
    this.name = stryMutAct_9fa48("595") ? "" : (stryCov_9fa48("595"), "PolicyDeniedError");
  }
}
export class PolicyEngine {
  private rules: PolicyRule[] = stryMutAct_9fa48("596") ? ["Stryker was here"] : (stryCov_9fa48("596"), []);
  constructor(initialRules: PolicyRule[] = stryMutAct_9fa48("597") ? ["Stryker was here"] : (stryCov_9fa48("597"), [])) {
    if (stryMutAct_9fa48("598")) {
      {}
    } else {
      stryCov_9fa48("598");
      this.rules = stryMutAct_9fa48("599") ? initialRules : (stryCov_9fa48("599"), initialRules.slice());
    }
  }
  setRules(rules: PolicyRule[]): void {
    if (stryMutAct_9fa48("600")) {
      {}
    } else {
      stryCov_9fa48("600");
      this.rules = stryMutAct_9fa48("601") ? rules : (stryCov_9fa48("601"), rules.slice());
    }
  }
  getRules(): PolicyRule[] {
    if (stryMutAct_9fa48("602")) {
      {}
    } else {
      stryCov_9fa48("602");
      return stryMutAct_9fa48("603") ? this.rules : (stryCov_9fa48("603"), this.rules.slice());
    }
  }
  addRule(rule: PolicyRule): void {
    if (stryMutAct_9fa48("604")) {
      {}
    } else {
      stryCov_9fa48("604");
      this.rules.push(rule);
    }
  }
  evaluate(agentId: string, action: string, context: PolicyContext = {}): PolicyEvaluationResult {
    if (stryMutAct_9fa48("605")) {
      {}
    } else {
      stryCov_9fa48("605");
      const matchingRules = stryMutAct_9fa48("606") ? this.rules : (stryCov_9fa48("606"), this.rules.filter(stryMutAct_9fa48("607") ? () => undefined : (stryCov_9fa48("607"), rule => stryMutAct_9fa48("610") ? isRuleEnabled(rule) && matchesScope(rule, agentId, context) || matchesAction(rule.action, action) : stryMutAct_9fa48("609") ? false : stryMutAct_9fa48("608") ? true : (stryCov_9fa48("608", "609", "610"), (stryMutAct_9fa48("612") ? isRuleEnabled(rule) || matchesScope(rule, agentId, context) : stryMutAct_9fa48("611") ? true : (stryCov_9fa48("611", "612"), isRuleEnabled(rule) && matchesScope(rule, agentId, context))) && matchesAction(rule.action, action)))));
      const denyRule = matchingRules.find(stryMutAct_9fa48("613") ? () => undefined : (stryCov_9fa48("613"), rule => stryMutAct_9fa48("616") ? rule.effect !== "deny" : stryMutAct_9fa48("615") ? false : stryMutAct_9fa48("614") ? true : (stryCov_9fa48("614", "615", "616"), rule.effect === (stryMutAct_9fa48("617") ? "" : (stryCov_9fa48("617"), "deny")))));
      if (stryMutAct_9fa48("619") ? false : stryMutAct_9fa48("618") ? true : (stryCov_9fa48("618", "619"), denyRule)) {
        if (stryMutAct_9fa48("620")) {
          {}
        } else {
          stryCov_9fa48("620");
          return stryMutAct_9fa48("621") ? {} : (stryCov_9fa48("621"), {
            granted: stryMutAct_9fa48("622") ? true : (stryCov_9fa48("622"), false),
            matchedRuleId: denyRule.id,
            reason: stryMutAct_9fa48("623") ? denyRule.reason && `Action '${action}' blocked by rule '${denyRule.id}'.` : (stryCov_9fa48("623"), denyRule.reason ?? (stryMutAct_9fa48("624") ? `` : (stryCov_9fa48("624"), `Action '${action}' blocked by rule '${denyRule.id}'.`)))
          });
        }
      }
      const allowRule = matchingRules.find(stryMutAct_9fa48("625") ? () => undefined : (stryCov_9fa48("625"), rule => stryMutAct_9fa48("628") ? rule.effect !== "allow" : stryMutAct_9fa48("627") ? false : stryMutAct_9fa48("626") ? true : (stryCov_9fa48("626", "627", "628"), rule.effect === (stryMutAct_9fa48("629") ? "" : (stryCov_9fa48("629"), "allow")))));
      if (stryMutAct_9fa48("631") ? false : stryMutAct_9fa48("630") ? true : (stryCov_9fa48("630", "631"), allowRule)) {
        if (stryMutAct_9fa48("632")) {
          {}
        } else {
          stryCov_9fa48("632");
          return stryMutAct_9fa48("633") ? {} : (stryCov_9fa48("633"), {
            granted: stryMutAct_9fa48("634") ? false : (stryCov_9fa48("634"), true),
            matchedRuleId: allowRule.id,
            reason: stryMutAct_9fa48("635") ? allowRule.reason && `Action '${action}' allowed by rule '${allowRule.id}'.` : (stryCov_9fa48("635"), allowRule.reason ?? (stryMutAct_9fa48("636") ? `` : (stryCov_9fa48("636"), `Action '${action}' allowed by rule '${allowRule.id}'.`)))
          });
        }
      }
      return stryMutAct_9fa48("637") ? {} : (stryCov_9fa48("637"), {
        granted: stryMutAct_9fa48("638") ? true : (stryCov_9fa48("638"), false),
        reason: stryMutAct_9fa48("639") ? `` : (stryCov_9fa48("639"), `Action '${action}' denied by default policy (no allow rule found).`)
      });
    }
  }
}
const templateRules: Record<PolicyTemplateName, Omit<PolicyRule, "agentId" | "id" | "tenantId">[]> = stryMutAct_9fa48("640") ? {} : (stryCov_9fa48("640"), {
  readonly: stryMutAct_9fa48("641") ? [] : (stryCov_9fa48("641"), [stryMutAct_9fa48("642") ? {} : (stryCov_9fa48("642"), {
    action: stryMutAct_9fa48("643") ? "" : (stryCov_9fa48("643"), "tool.http"),
    effect: stryMutAct_9fa48("644") ? "" : (stryCov_9fa48("644"), "allow"),
    reason: stryMutAct_9fa48("645") ? "" : (stryCov_9fa48("645"), "Read-only template allows HTTP reads.")
  }), stryMutAct_9fa48("646") ? {} : (stryCov_9fa48("646"), {
    action: stryMutAct_9fa48("647") ? "" : (stryCov_9fa48("647"), "tool.db-read"),
    effect: stryMutAct_9fa48("648") ? "" : (stryCov_9fa48("648"), "allow"),
    reason: stryMutAct_9fa48("649") ? "" : (stryCov_9fa48("649"), "Read-only template allows query-only access.")
  }), stryMutAct_9fa48("650") ? {} : (stryCov_9fa48("650"), {
    action: stryMutAct_9fa48("651") ? "" : (stryCov_9fa48("651"), "tool.db-write"),
    effect: stryMutAct_9fa48("652") ? "" : (stryCov_9fa48("652"), "deny"),
    reason: stryMutAct_9fa48("653") ? "" : (stryCov_9fa48("653"), "Read-only template blocks mutations.")
  }), stryMutAct_9fa48("654") ? {} : (stryCov_9fa48("654"), {
    action: stryMutAct_9fa48("655") ? "" : (stryCov_9fa48("655"), "tool.send-email"),
    effect: stryMutAct_9fa48("656") ? "" : (stryCov_9fa48("656"), "deny"),
    reason: stryMutAct_9fa48("657") ? "" : (stryCov_9fa48("657"), "Read-only template blocks external messages.")
  })]),
  standard: stryMutAct_9fa48("658") ? [] : (stryCov_9fa48("658"), [stryMutAct_9fa48("659") ? {} : (stryCov_9fa48("659"), {
    action: stryMutAct_9fa48("660") ? "" : (stryCov_9fa48("660"), "tool.http"),
    effect: stryMutAct_9fa48("661") ? "" : (stryCov_9fa48("661"), "allow"),
    reason: stryMutAct_9fa48("662") ? "" : (stryCov_9fa48("662"), "Standard template allows HTTP tool.")
  }), stryMutAct_9fa48("663") ? {} : (stryCov_9fa48("663"), {
    action: stryMutAct_9fa48("664") ? "" : (stryCov_9fa48("664"), "tool.db-read"),
    effect: stryMutAct_9fa48("665") ? "" : (stryCov_9fa48("665"), "allow"),
    reason: stryMutAct_9fa48("666") ? "" : (stryCov_9fa48("666"), "Standard template allows read access.")
  }), stryMutAct_9fa48("667") ? {} : (stryCov_9fa48("667"), {
    action: stryMutAct_9fa48("668") ? "" : (stryCov_9fa48("668"), "tool.db-write"),
    effect: stryMutAct_9fa48("669") ? "" : (stryCov_9fa48("669"), "allow"),
    reason: stryMutAct_9fa48("670") ? "" : (stryCov_9fa48("670"), "Standard template allows controlled writes.")
  }), stryMutAct_9fa48("671") ? {} : (stryCov_9fa48("671"), {
    action: stryMutAct_9fa48("672") ? "" : (stryCov_9fa48("672"), "tool.send-email"),
    effect: stryMutAct_9fa48("673") ? "" : (stryCov_9fa48("673"), "allow"),
    reason: stryMutAct_9fa48("674") ? "" : (stryCov_9fa48("674"), "Standard template allows email notifications.")
  })]),
  admin: stryMutAct_9fa48("675") ? [] : (stryCov_9fa48("675"), [stryMutAct_9fa48("676") ? {} : (stryCov_9fa48("676"), {
    action: stryMutAct_9fa48("677") ? "" : (stryCov_9fa48("677"), "tool.*"),
    effect: stryMutAct_9fa48("678") ? "" : (stryCov_9fa48("678"), "allow"),
    reason: stryMutAct_9fa48("679") ? "" : (stryCov_9fa48("679"), "Admin template grants full tool access.")
  })])
});
export function createPolicyTemplate(template: PolicyTemplateName, tenantId: string, agentId: string): PolicyRule[] {
  if (stryMutAct_9fa48("680")) {
    {}
  } else {
    stryCov_9fa48("680");
    return templateRules[template].map(stryMutAct_9fa48("681") ? () => undefined : (stryCov_9fa48("681"), (rule, index) => stryMutAct_9fa48("682") ? {} : (stryCov_9fa48("682"), {
      ...rule,
      agentId,
      id: stryMutAct_9fa48("683") ? `` : (stryCov_9fa48("683"), `${template}-${stryMutAct_9fa48("684") ? index - 1 : (stryCov_9fa48("684"), index + 1)}`),
      tenantId
    })));
  }
}
export interface ManagedPolicy extends PolicyRule {
  name: string;
}
export class InMemoryPolicyAdminStore {
  private readonly policies = new Map<string, ManagedPolicy>();
  list(tenantId: string, agentId: string): ManagedPolicy[] {
    if (stryMutAct_9fa48("685")) {
      {}
    } else {
      stryCov_9fa48("685");
      return stryMutAct_9fa48("686") ? Array.from(this.policies.values()) : (stryCov_9fa48("686"), Array.from(this.policies.values()).filter(stryMutAct_9fa48("687") ? () => undefined : (stryCov_9fa48("687"), policy => stryMutAct_9fa48("690") ? policy.tenantId === tenantId || policy.agentId === agentId : stryMutAct_9fa48("689") ? false : stryMutAct_9fa48("688") ? true : (stryCov_9fa48("688", "689", "690"), (stryMutAct_9fa48("692") ? policy.tenantId !== tenantId : stryMutAct_9fa48("691") ? true : (stryCov_9fa48("691", "692"), policy.tenantId === tenantId)) && (stryMutAct_9fa48("694") ? policy.agentId !== agentId : stryMutAct_9fa48("693") ? true : (stryCov_9fa48("693", "694"), policy.agentId === agentId))))));
    }
  }
  upsert(policy: ManagedPolicy): ManagedPolicy {
    if (stryMutAct_9fa48("695")) {
      {}
    } else {
      stryCov_9fa48("695");
      this.policies.set(policy.id, stryMutAct_9fa48("696") ? {} : (stryCov_9fa48("696"), {
        ...policy
      }));
      return policy;
    }
  }
  toggle(policyId: string, enabled: boolean): ManagedPolicy | null {
    if (stryMutAct_9fa48("697")) {
      {}
    } else {
      stryCov_9fa48("697");
      const current = this.policies.get(policyId);
      if (stryMutAct_9fa48("700") ? false : stryMutAct_9fa48("699") ? true : stryMutAct_9fa48("698") ? current : (stryCov_9fa48("698", "699", "700"), !current)) {
        if (stryMutAct_9fa48("701")) {
          {}
        } else {
          stryCov_9fa48("701");
          return null;
        }
      }
      const updated = stryMutAct_9fa48("702") ? {} : (stryCov_9fa48("702"), {
        ...current,
        enabled
      });
      this.policies.set(policyId, updated);
      return updated;
    }
  }
}