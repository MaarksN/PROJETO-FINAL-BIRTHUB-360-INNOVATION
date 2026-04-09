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
import type { AgentManifest } from "../manifest/schema.js";
import type { AgentLearningRecord, JsonValue } from "../types/index.js";
export interface ManagedAgentPolicy {
  actions: string[];
  effect: "allow" | "deny";
  enabled?: boolean;
  id: string;
  name: string;
  reason?: string;
}
export interface RuntimePolicyRule {
  action: string;
  effect: "allow" | "deny";
  id: string;
}
export interface RuntimePlannedToolCall {
  input: Record<string, unknown>;
  rationale: string;
  tool: string;
}
export interface AgentRuntimePlanInput {
  contextSummary?: string;
  input: Record<string, unknown>;
  manifest: AgentManifest;
  sharedLearning?: AgentLearningRecord[];
  tenantId: string;
}
export interface AgentRuntimePlan {
  logs: string[];
  toolCalls: RuntimePlannedToolCall[];
}
export interface AgentRuntimeOutputInput {
  input: Record<string, unknown>;
  logs: string[];
  manifest: AgentManifest;
  plan: AgentRuntimePlan;
  sharedLearning?: AgentLearningRecord[];
  steps: Array<{
    call: {
      input: unknown;
      tool: string;
    };
    finishedAt: string;
    output: unknown;
    startedAt: string;
  }>;
}
export interface AgentRuntimeOutput {
  approvals_or_dependencies: string[];
  confidence: "high" | "low" | "medium";
  decisions_to_anticipate: Array<{
    decision: string;
    due_window: string;
    owner: string;
    recommended_action: string;
    why_now: string;
  }>;
  emerging_risks: string[];
  executionMode: "LIVE";
  leading_indicators: string[];
  learning_used: Array<{
    confidence: number;
    id: string;
    summary: string;
  }>;
  next_checkpoint: string;
  opportunities_to_capture: string[];
  preventive_action_plan: Array<{
    action: string;
    checkpoint: string;
    deadline: string;
    expected_impact: string;
    owner: string;
  }>;
  sharedLearningCount: number;
  status: "critical" | "stable" | "watch";
  summary: string;
  tool_results: Array<{
    finishedAt: string;
    output: JsonValue | null;
    startedAt: string;
    tool: string;
  }>;
}
export interface OutputGovernanceDecision {
  reason: string;
  requireApproval: boolean;
  type: "executive-report" | "technical-log";
}
function readString(value: unknown): string | null {
  if (stryMutAct_9fa48("703")) {
    {}
  } else {
    stryCov_9fa48("703");
    return (stryMutAct_9fa48("706") ? typeof value === "string" || value.trim().length > 0 : stryMutAct_9fa48("705") ? false : stryMutAct_9fa48("704") ? true : (stryCov_9fa48("704", "705", "706"), (stryMutAct_9fa48("708") ? typeof value !== "string" : stryMutAct_9fa48("707") ? true : (stryCov_9fa48("707", "708"), typeof value === (stryMutAct_9fa48("709") ? "" : (stryCov_9fa48("709"), "string")))) && (stryMutAct_9fa48("712") ? value.trim().length <= 0 : stryMutAct_9fa48("711") ? value.trim().length >= 0 : stryMutAct_9fa48("710") ? true : (stryCov_9fa48("710", "711", "712"), (stryMutAct_9fa48("713") ? value.length : (stryCov_9fa48("713"), value.trim().length)) > 0)))) ? stryMutAct_9fa48("714") ? value : (stryCov_9fa48("714"), value.trim()) : null;
  }
}
function readObjective(input: Record<string, unknown>): string {
  if (stryMutAct_9fa48("715")) {
    {}
  } else {
    stryCov_9fa48("715");
    const directCandidates = stryMutAct_9fa48("716") ? [] : (stryCov_9fa48("716"), [input.objective, input.brief, input.prompt, input.task, input.goal, (stryMutAct_9fa48("719") ? typeof input.context === "object" || input.context !== null : stryMutAct_9fa48("718") ? false : stryMutAct_9fa48("717") ? true : (stryCov_9fa48("717", "718", "719"), (stryMutAct_9fa48("721") ? typeof input.context !== "object" : stryMutAct_9fa48("720") ? true : (stryCov_9fa48("720", "721"), typeof input.context === (stryMutAct_9fa48("722") ? "" : (stryCov_9fa48("722"), "object")))) && (stryMutAct_9fa48("724") ? input.context === null : stryMutAct_9fa48("723") ? true : (stryCov_9fa48("723", "724"), input.context !== null)))) ? (input.context as Record<string, unknown>).objective : null]);
    for (const candidate of directCandidates) {
      if (stryMutAct_9fa48("725")) {
        {}
      } else {
        stryCov_9fa48("725");
        const value = readString(candidate);
        if (stryMutAct_9fa48("727") ? false : stryMutAct_9fa48("726") ? true : (stryCov_9fa48("726", "727"), value)) {
          if (stryMutAct_9fa48("728")) {
            {}
          } else {
            stryCov_9fa48("728");
            return value;
          }
        }
      }
    }
    return stryMutAct_9fa48("729") ? "" : (stryCov_9fa48("729"), "Executar o agente com rastreabilidade, governanca e proximo passo claro.");
  }
}
function readPrimaryOwner(input: Record<string, unknown>): string {
  if (stryMutAct_9fa48("730")) {
    {}
  } else {
    stryCov_9fa48("730");
    const candidates = stryMutAct_9fa48("731") ? [] : (stryCov_9fa48("731"), [input.owner, input.requestedBy, input.userId, (stryMutAct_9fa48("734") ? typeof input.context === "object" || input.context !== null : stryMutAct_9fa48("733") ? false : stryMutAct_9fa48("732") ? true : (stryCov_9fa48("732", "733", "734"), (stryMutAct_9fa48("736") ? typeof input.context !== "object" : stryMutAct_9fa48("735") ? true : (stryCov_9fa48("735", "736"), typeof input.context === (stryMutAct_9fa48("737") ? "" : (stryCov_9fa48("737"), "object")))) && (stryMutAct_9fa48("739") ? input.context === null : stryMutAct_9fa48("738") ? true : (stryCov_9fa48("738", "739"), input.context !== null)))) ? (input.context as Record<string, unknown>).owner : null]);
    for (const candidate of candidates) {
      if (stryMutAct_9fa48("740")) {
        {}
      } else {
        stryCov_9fa48("740");
        const value = readString(candidate);
        if (stryMutAct_9fa48("742") ? false : stryMutAct_9fa48("741") ? true : (stryCov_9fa48("741", "742"), value)) {
          if (stryMutAct_9fa48("743")) {
            {}
          } else {
            stryCov_9fa48("743");
            return value;
          }
        }
      }
    }
    return stryMutAct_9fa48("744") ? "" : (stryCov_9fa48("744"), "tenant-ops");
  }
}
function normalizeJsonValue(value: unknown): JsonValue | null {
  if (stryMutAct_9fa48("745")) {
    {}
  } else {
    stryCov_9fa48("745");
    if (stryMutAct_9fa48("748") ? (value === null || typeof value === "string" || typeof value === "number") && typeof value === "boolean" : stryMutAct_9fa48("747") ? false : stryMutAct_9fa48("746") ? true : (stryCov_9fa48("746", "747", "748"), (stryMutAct_9fa48("750") ? (value === null || typeof value === "string") && typeof value === "number" : stryMutAct_9fa48("749") ? false : (stryCov_9fa48("749", "750"), (stryMutAct_9fa48("752") ? value === null && typeof value === "string" : stryMutAct_9fa48("751") ? false : (stryCov_9fa48("751", "752"), (stryMutAct_9fa48("754") ? value !== null : stryMutAct_9fa48("753") ? false : (stryCov_9fa48("753", "754"), value === null)) || (stryMutAct_9fa48("756") ? typeof value !== "string" : stryMutAct_9fa48("755") ? false : (stryCov_9fa48("755", "756"), typeof value === (stryMutAct_9fa48("757") ? "" : (stryCov_9fa48("757"), "string")))))) || (stryMutAct_9fa48("759") ? typeof value !== "number" : stryMutAct_9fa48("758") ? false : (stryCov_9fa48("758", "759"), typeof value === (stryMutAct_9fa48("760") ? "" : (stryCov_9fa48("760"), "number")))))) || (stryMutAct_9fa48("762") ? typeof value !== "boolean" : stryMutAct_9fa48("761") ? false : (stryCov_9fa48("761", "762"), typeof value === (stryMutAct_9fa48("763") ? "" : (stryCov_9fa48("763"), "boolean")))))) {
      if (stryMutAct_9fa48("764")) {
        {}
      } else {
        stryCov_9fa48("764");
        return value;
      }
    }
    if (stryMutAct_9fa48("766") ? false : stryMutAct_9fa48("765") ? true : (stryCov_9fa48("765", "766"), Array.isArray(value))) {
      if (stryMutAct_9fa48("767")) {
        {}
      } else {
        stryCov_9fa48("767");
        return stryMutAct_9fa48("768") ? value.map(item => normalizeJsonValue(item)) : (stryCov_9fa48("768"), value.map(stryMutAct_9fa48("769") ? () => undefined : (stryCov_9fa48("769"), item => normalizeJsonValue(item))).filter(stryMutAct_9fa48("770") ? () => undefined : (stryCov_9fa48("770"), (item): item is JsonValue => stryMutAct_9fa48("773") ? item === undefined : stryMutAct_9fa48("772") ? false : stryMutAct_9fa48("771") ? true : (stryCov_9fa48("771", "772", "773"), item !== undefined))));
      }
    }
    if (stryMutAct_9fa48("776") ? typeof value !== "object" : stryMutAct_9fa48("775") ? false : stryMutAct_9fa48("774") ? true : (stryCov_9fa48("774", "775", "776"), typeof value === (stryMutAct_9fa48("777") ? "" : (stryCov_9fa48("777"), "object")))) {
      if (stryMutAct_9fa48("778")) {
        {}
      } else {
        stryCov_9fa48("778");
        const objectValue: Record<string, JsonValue> = {};
        for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
          if (stryMutAct_9fa48("779")) {
            {}
          } else {
            stryCov_9fa48("779");
            const normalized = normalizeJsonValue(child);
            if (stryMutAct_9fa48("782") ? normalized === undefined : stryMutAct_9fa48("781") ? false : stryMutAct_9fa48("780") ? true : (stryCov_9fa48("780", "781", "782"), normalized !== undefined)) {
              if (stryMutAct_9fa48("783")) {
                {}
              } else {
                stryCov_9fa48("783");
                objectValue[key] = normalized;
              }
            }
          }
        }
        return objectValue;
      }
    }
    return null;
  }
}
function normalizePolicyAction(action: string): string {
  if (stryMutAct_9fa48("784")) {
    {}
  } else {
    stryCov_9fa48("784");
    const trimmed = stryMutAct_9fa48("785") ? action : (stryCov_9fa48("785"), action.trim());
    if (stryMutAct_9fa48("788") ? false : stryMutAct_9fa48("787") ? true : stryMutAct_9fa48("786") ? trimmed : (stryCov_9fa48("786", "787", "788"), !trimmed)) {
      if (stryMutAct_9fa48("789")) {
        {}
      } else {
        stryCov_9fa48("789");
        return stryMutAct_9fa48("790") ? "Stryker was here!" : (stryCov_9fa48("790"), "");
      }
    }
    if (stryMutAct_9fa48("793") ? trimmed !== "tool:execute" : stryMutAct_9fa48("792") ? false : stryMutAct_9fa48("791") ? true : (stryCov_9fa48("791", "792", "793"), trimmed === (stryMutAct_9fa48("794") ? "" : (stryCov_9fa48("794"), "tool:execute")))) {
      if (stryMutAct_9fa48("795")) {
        {}
      } else {
        stryCov_9fa48("795");
        return stryMutAct_9fa48("796") ? "" : (stryCov_9fa48("796"), "tool.*");
      }
    }
    if (stryMutAct_9fa48("799") ? trimmed.endsWith("tool:") : stryMutAct_9fa48("798") ? false : stryMutAct_9fa48("797") ? true : (stryCov_9fa48("797", "798", "799"), trimmed.startsWith(stryMutAct_9fa48("800") ? "" : (stryCov_9fa48("800"), "tool:")))) {
      if (stryMutAct_9fa48("801")) {
        {}
      } else {
        stryCov_9fa48("801");
        return stryMutAct_9fa48("802") ? `` : (stryCov_9fa48("802"), `tool.${stryMutAct_9fa48("803") ? trimmed : (stryCov_9fa48("803"), trimmed.slice((stryMutAct_9fa48("804") ? "" : (stryCov_9fa48("804"), "tool:")).length))}`);
      }
    }
    if (stryMutAct_9fa48("807") ? trimmed.endsWith("tool.") : stryMutAct_9fa48("806") ? false : stryMutAct_9fa48("805") ? true : (stryCov_9fa48("805", "806", "807"), trimmed.startsWith(stryMutAct_9fa48("808") ? "" : (stryCov_9fa48("808"), "tool.")))) {
      if (stryMutAct_9fa48("809")) {
        {}
      } else {
        stryCov_9fa48("809");
        return trimmed;
      }
    }
    return trimmed.replace(/:/g, stryMutAct_9fa48("810") ? "" : (stryCov_9fa48("810"), "."));
  }
}
function buildRuntimePolicyRulesFromManifest(manifest: AgentManifest): RuntimePolicyRule[] {
  if (stryMutAct_9fa48("811")) {
    {}
  } else {
    stryCov_9fa48("811");
    const rules: RuntimePolicyRule[] = stryMutAct_9fa48("812") ? ["Stryker was here"] : (stryCov_9fa48("812"), []);
    for (const policy of manifest.policies) {
      if (stryMutAct_9fa48("813")) {
        {}
      } else {
        stryCov_9fa48("813");
        for (const action of policy.actions) {
          if (stryMutAct_9fa48("814")) {
            {}
          } else {
            stryCov_9fa48("814");
            const normalizedAction = normalizePolicyAction(action);
            if (stryMutAct_9fa48("817") ? false : stryMutAct_9fa48("816") ? true : stryMutAct_9fa48("815") ? normalizedAction : (stryCov_9fa48("815", "816", "817"), !normalizedAction)) {
              if (stryMutAct_9fa48("818")) {
                {}
              } else {
                stryCov_9fa48("818");
                continue;
              }
            }
            rules.push(stryMutAct_9fa48("819") ? {} : (stryCov_9fa48("819"), {
              action: normalizedAction,
              effect: policy.effect,
              id: stryMutAct_9fa48("820") ? `` : (stryCov_9fa48("820"), `${policy.id}:${normalizedAction}`)
            }));
          }
        }
      }
    }
    return rules;
  }
}
function buildRuntimePolicyRulesFromManagedPolicies(managedPolicies: ManagedAgentPolicy[] = stryMutAct_9fa48("821") ? ["Stryker was here"] : (stryCov_9fa48("821"), [])): RuntimePolicyRule[] {
  if (stryMutAct_9fa48("822")) {
    {}
  } else {
    stryCov_9fa48("822");
    const rules: RuntimePolicyRule[] = stryMutAct_9fa48("823") ? ["Stryker was here"] : (stryCov_9fa48("823"), []);
    for (const policy of managedPolicies) {
      if (stryMutAct_9fa48("824")) {
        {}
      } else {
        stryCov_9fa48("824");
        if (stryMutAct_9fa48("827") ? (policy.enabled ?? true) !== false : stryMutAct_9fa48("826") ? false : stryMutAct_9fa48("825") ? true : (stryCov_9fa48("825", "826", "827"), (stryMutAct_9fa48("828") ? policy.enabled && true : (stryCov_9fa48("828"), policy.enabled ?? (stryMutAct_9fa48("829") ? false : (stryCov_9fa48("829"), true)))) === (stryMutAct_9fa48("830") ? true : (stryCov_9fa48("830"), false)))) {
          if (stryMutAct_9fa48("831")) {
            {}
          } else {
            stryCov_9fa48("831");
            continue;
          }
        }
        for (const action of policy.actions) {
          if (stryMutAct_9fa48("832")) {
            {}
          } else {
            stryCov_9fa48("832");
            const normalizedAction = normalizePolicyAction(action);
            if (stryMutAct_9fa48("835") ? false : stryMutAct_9fa48("834") ? true : stryMutAct_9fa48("833") ? normalizedAction : (stryCov_9fa48("833", "834", "835"), !normalizedAction)) {
              if (stryMutAct_9fa48("836")) {
                {}
              } else {
                stryCov_9fa48("836");
                continue;
              }
            }
            rules.push(stryMutAct_9fa48("837") ? {} : (stryCov_9fa48("837"), {
              action: normalizedAction,
              effect: policy.effect,
              id: stryMutAct_9fa48("838") ? `` : (stryCov_9fa48("838"), `${policy.id}:${normalizedAction}`)
            }));
          }
        }
      }
    }
    return rules;
  }
}
function summarizeLearning(records: AgentLearningRecord[] = stryMutAct_9fa48("839") ? ["Stryker was here"] : (stryCov_9fa48("839"), [])): Array<{
  confidence: number;
  id: string;
  summary: string;
}> {
  if (stryMutAct_9fa48("840")) {
    {}
  } else {
    stryCov_9fa48("840");
    return stryMutAct_9fa48("841") ? records.map(record => ({
      confidence: record.confidence,
      id: record.id,
      summary: record.summary
    })) : (stryCov_9fa48("841"), records.slice(0, 5).map(stryMutAct_9fa48("842") ? () => undefined : (stryCov_9fa48("842"), record => stryMutAct_9fa48("843") ? {} : (stryCov_9fa48("843"), {
      confidence: record.confidence,
      id: record.id,
      summary: record.summary
    }))));
  }
}
function toolIsSensitive(toolId: string): boolean {
  if (stryMutAct_9fa48("844")) {
    {}
  } else {
    stryCov_9fa48("844");
    const normalized = stryMutAct_9fa48("845") ? toolId.toUpperCase() : (stryCov_9fa48("845"), toolId.toLowerCase());
    return stryMutAct_9fa48("848") ? (normalized.includes("approval") || normalized.includes("audit") || normalized.includes("notification") || normalized.includes("sync") || normalized.includes("write")) && normalized.includes("adapter") : stryMutAct_9fa48("847") ? false : stryMutAct_9fa48("846") ? true : (stryCov_9fa48("846", "847", "848"), (stryMutAct_9fa48("850") ? (normalized.includes("approval") || normalized.includes("audit") || normalized.includes("notification") || normalized.includes("sync")) && normalized.includes("write") : stryMutAct_9fa48("849") ? false : (stryCov_9fa48("849", "850"), (stryMutAct_9fa48("852") ? (normalized.includes("approval") || normalized.includes("audit") || normalized.includes("notification")) && normalized.includes("sync") : stryMutAct_9fa48("851") ? false : (stryCov_9fa48("851", "852"), (stryMutAct_9fa48("854") ? (normalized.includes("approval") || normalized.includes("audit")) && normalized.includes("notification") : stryMutAct_9fa48("853") ? false : (stryCov_9fa48("853", "854"), (stryMutAct_9fa48("856") ? normalized.includes("approval") && normalized.includes("audit") : stryMutAct_9fa48("855") ? false : (stryCov_9fa48("855", "856"), normalized.includes(stryMutAct_9fa48("857") ? "" : (stryCov_9fa48("857"), "approval")) || normalized.includes(stryMutAct_9fa48("858") ? "" : (stryCov_9fa48("858"), "audit")))) || normalized.includes(stryMutAct_9fa48("859") ? "" : (stryCov_9fa48("859"), "notification")))) || normalized.includes(stryMutAct_9fa48("860") ? "" : (stryCov_9fa48("860"), "sync")))) || normalized.includes(stryMutAct_9fa48("861") ? "" : (stryCov_9fa48("861"), "write")))) || normalized.includes(stryMutAct_9fa48("862") ? "" : (stryCov_9fa48("862"), "adapter")));
  }
}
export function buildRuntimePolicyRules(manifest: AgentManifest, managedPolicies: ManagedAgentPolicy[] = stryMutAct_9fa48("863") ? ["Stryker was here"] : (stryCov_9fa48("863"), [])): RuntimePolicyRule[] {
  if (stryMutAct_9fa48("864")) {
    {}
  } else {
    stryCov_9fa48("864");
    const merged = new Map<string, RuntimePolicyRule>();
    for (const rule of stryMutAct_9fa48("865") ? [] : (stryCov_9fa48("865"), [...buildRuntimePolicyRulesFromManifest(manifest), ...buildRuntimePolicyRulesFromManagedPolicies(managedPolicies)])) {
      if (stryMutAct_9fa48("866")) {
        {}
      } else {
        stryCov_9fa48("866");
        merged.set(rule.id, rule);
      }
    }
    return Array.from(merged.values());
  }
}
export function buildAgentRuntimePlan(input: AgentRuntimePlanInput): AgentRuntimePlan {
  if (stryMutAct_9fa48("867")) {
    {}
  } else {
    stryCov_9fa48("867");
    const objective = readObjective(input.input);
    const sharedLearning = stryMutAct_9fa48("868") ? input.sharedLearning && [] : (stryCov_9fa48("868"), input.sharedLearning ?? (stryMutAct_9fa48("869") ? ["Stryker was here"] : (stryCov_9fa48("869"), [])));
    const logs = stryMutAct_9fa48("870") ? [] : (stryCov_9fa48("870"), [stryMutAct_9fa48("871") ? `` : (stryCov_9fa48("871"), `Resolved manifest ${input.manifest.agent.id}@${input.manifest.agent.version}.`), stryMutAct_9fa48("872") ? `` : (stryCov_9fa48("872"), `Planning live execution for tenant ${input.tenantId}.`), stryMutAct_9fa48("873") ? `` : (stryCov_9fa48("873"), `Loaded ${sharedLearning.length} shared learning record(s).`)]);
    const toolCalls = input.manifest.tools.map(stryMutAct_9fa48("874") ? () => undefined : (stryCov_9fa48("874"), (tool, index) => stryMutAct_9fa48("875") ? {} : (stryCov_9fa48("875"), {
      input: stryMutAct_9fa48("876") ? {} : (stryCov_9fa48("876"), {
        contextSummary: stryMutAct_9fa48("877") ? input.contextSummary && null : (stryCov_9fa48("877"), input.contextSummary ?? null),
        objective,
        sequence: stryMutAct_9fa48("878") ? index - 1 : (stryCov_9fa48("878"), index + 1),
        sharedLearning: summarizeLearning(sharedLearning),
        sourcePayload: input.input,
        toolDescription: tool.description,
        toolName: tool.name
      }),
      rationale: stryMutAct_9fa48("879") ? `` : (stryCov_9fa48("879"), `Executar ${tool.name} para avancar o objetivo '${objective}'.`),
      tool: tool.id
    })));
    logs.push(stryMutAct_9fa48("880") ? `` : (stryCov_9fa48("880"), `Built ${toolCalls.length} manifest-native tool call(s).`));
    return stryMutAct_9fa48("881") ? {} : (stryCov_9fa48("881"), {
      logs,
      toolCalls
    });
  }
}
export function inferOutputGovernance(input: {
  manifest: AgentManifest;
  plan: AgentRuntimePlan;
}): OutputGovernanceDecision {
  if (stryMutAct_9fa48("882")) {
    {}
  } else {
    stryCov_9fa48("882");
    const requiresApprovalByTool = stryMutAct_9fa48("883") ? input.plan.toolCalls.every(call => toolIsSensitive(call.tool)) : (stryCov_9fa48("883"), input.plan.toolCalls.some(stryMutAct_9fa48("884") ? () => undefined : (stryCov_9fa48("884"), call => toolIsSensitive(call.tool))));
    const requiresApprovalByUseCase = stryMutAct_9fa48("885") ? input.manifest.tags["use-case"].every(tag => ["autonomous-monitoring", "commercial-operations", "multi-agent-execution"].includes(tag)) : (stryCov_9fa48("885"), input.manifest.tags[stryMutAct_9fa48("886") ? "" : (stryCov_9fa48("886"), "use-case")].some(stryMutAct_9fa48("887") ? () => undefined : (stryCov_9fa48("887"), tag => (stryMutAct_9fa48("888") ? [] : (stryCov_9fa48("888"), [stryMutAct_9fa48("889") ? "" : (stryCov_9fa48("889"), "autonomous-monitoring"), stryMutAct_9fa48("890") ? "" : (stryCov_9fa48("890"), "commercial-operations"), stryMutAct_9fa48("891") ? "" : (stryCov_9fa48("891"), "multi-agent-execution")])).includes(tag))));
    const requireApproval = stryMutAct_9fa48("894") ? requiresApprovalByTool && requiresApprovalByUseCase : stryMutAct_9fa48("893") ? false : stryMutAct_9fa48("892") ? true : (stryCov_9fa48("892", "893", "894"), requiresApprovalByTool || requiresApprovalByUseCase);
    return stryMutAct_9fa48("895") ? {} : (stryCov_9fa48("895"), {
      reason: requireApproval ? stryMutAct_9fa48("896") ? "" : (stryCov_9fa48("896"), "Sensitive toolchain or governed use-case detected.") : stryMutAct_9fa48("897") ? "" : (stryCov_9fa48("897"), "Execution remained within non-sensitive reporting scope."),
      requireApproval,
      type: requireApproval ? stryMutAct_9fa48("898") ? "" : (stryCov_9fa48("898"), "executive-report") : stryMutAct_9fa48("899") ? "" : (stryCov_9fa48("899"), "technical-log")
    });
  }
}
export function buildAgentRuntimeOutput(input: AgentRuntimeOutputInput): AgentRuntimeOutput {
  if (stryMutAct_9fa48("900")) {
    {}
  } else {
    stryCov_9fa48("900");
    const owner = readPrimaryOwner(input.input);
    const sharedLearning = stryMutAct_9fa48("901") ? input.sharedLearning && [] : (stryCov_9fa48("901"), input.sharedLearning ?? (stryMutAct_9fa48("902") ? ["Stryker was here"] : (stryCov_9fa48("902"), [])));
    const governance = inferOutputGovernance(stryMutAct_9fa48("903") ? {} : (stryCov_9fa48("903"), {
      manifest: input.manifest,
      plan: input.plan
    }));
    const status: AgentRuntimeOutput["status"] = governance.requireApproval ? stryMutAct_9fa48("904") ? "" : (stryCov_9fa48("904"), "watch") : (stryMutAct_9fa48("908") ? sharedLearning.length <= 0 : stryMutAct_9fa48("907") ? sharedLearning.length >= 0 : stryMutAct_9fa48("906") ? false : stryMutAct_9fa48("905") ? true : (stryCov_9fa48("905", "906", "907", "908"), sharedLearning.length > 0)) ? stryMutAct_9fa48("909") ? "" : (stryCov_9fa48("909"), "stable") : stryMutAct_9fa48("910") ? "" : (stryCov_9fa48("910"), "watch");
    const tool_results = input.steps.map(stryMutAct_9fa48("911") ? () => undefined : (stryCov_9fa48("911"), step => stryMutAct_9fa48("912") ? {} : (stryCov_9fa48("912"), {
      finishedAt: step.finishedAt,
      output: normalizeJsonValue(step.output),
      startedAt: step.startedAt,
      tool: step.call.tool
    })));
    const summary = governance.requireApproval ? stryMutAct_9fa48("913") ? `` : (stryCov_9fa48("913"), `${input.manifest.agent.name} concluiu a execucao live e abriu governanca adicional antes da publicacao final.`) : stryMutAct_9fa48("914") ? `` : (stryCov_9fa48("914"), `${input.manifest.agent.name} concluiu a execucao live com ${tool_results.length} ferramenta(s) do manifesto.`);
    return stryMutAct_9fa48("915") ? {} : (stryCov_9fa48("915"), {
      approvals_or_dependencies: governance.requireApproval ? stryMutAct_9fa48("916") ? [] : (stryCov_9fa48("916"), [stryMutAct_9fa48("917") ? "" : (stryCov_9fa48("917"), "Aprovacao humana recomendada antes de compartilhar externamente.")]) : stryMutAct_9fa48("918") ? ["Stryker was here"] : (stryCov_9fa48("918"), []),
      confidence: (stryMutAct_9fa48("922") ? sharedLearning.length <= 0 : stryMutAct_9fa48("921") ? sharedLearning.length >= 0 : stryMutAct_9fa48("920") ? false : stryMutAct_9fa48("919") ? true : (stryCov_9fa48("919", "920", "921", "922"), sharedLearning.length > 0)) ? stryMutAct_9fa48("923") ? "" : (stryCov_9fa48("923"), "high") : stryMutAct_9fa48("924") ? "" : (stryCov_9fa48("924"), "medium"),
      decisions_to_anticipate: stryMutAct_9fa48("925") ? [] : (stryCov_9fa48("925"), [stryMutAct_9fa48("926") ? {} : (stryCov_9fa48("926"), {
        decision: stryMutAct_9fa48("927") ? "" : (stryCov_9fa48("927"), "Publicar ou acionar o proximo passo recomendado"),
        due_window: stryMutAct_9fa48("928") ? "" : (stryCov_9fa48("928"), "Proxima janela operacional"),
        owner,
        recommended_action: governance.requireApproval ? stryMutAct_9fa48("929") ? "" : (stryCov_9fa48("929"), "Revisar o output e aprovar a acao sensivel.") : stryMutAct_9fa48("930") ? "" : (stryCov_9fa48("930"), "Executar o proximo passo priorizado pelo agente."),
        why_now: stryMutAct_9fa48("931") ? "" : (stryCov_9fa48("931"), "A execucao terminou com sinais suficientes para uma decisao operacional.")
      })]),
      emerging_risks: governance.requireApproval ? stryMutAct_9fa48("932") ? [] : (stryCov_9fa48("932"), [stryMutAct_9fa48("933") ? "" : (stryCov_9fa48("933"), "O output envolve acao ou artefato sensivel que pede dupla checagem.")]) : stryMutAct_9fa48("934") ? ["Stryker was here"] : (stryCov_9fa48("934"), []),
      executionMode: stryMutAct_9fa48("935") ? "" : (stryCov_9fa48("935"), "LIVE"),
      leading_indicators: input.plan.toolCalls.map(stryMutAct_9fa48("936") ? () => undefined : (stryCov_9fa48("936"), call => stryMutAct_9fa48("937") ? `` : (stryCov_9fa48("937"), `tool-ready:${call.tool}`))),
      learning_used: summarizeLearning(sharedLearning),
      next_checkpoint: new Date(stryMutAct_9fa48("938") ? Date.now() - 60 * 60 * 1000 : (stryCov_9fa48("938"), Date.now() + (stryMutAct_9fa48("939") ? 60 * 60 / 1000 : (stryCov_9fa48("939"), (stryMutAct_9fa48("940") ? 60 / 60 : (stryCov_9fa48("940"), 60 * 60)) * 1000)))).toISOString(),
      opportunities_to_capture: stryMutAct_9fa48("941") ? [] : (stryCov_9fa48("941"), [stryMutAct_9fa48("942") ? "" : (stryCov_9fa48("942"), "Reaproveitar o plano e os aprendizados compartilhados em execucoes correlatas.")]),
      preventive_action_plan: stryMutAct_9fa48("943") ? [] : (stryCov_9fa48("943"), [stryMutAct_9fa48("944") ? {} : (stryCov_9fa48("944"), {
        action: governance.requireApproval ? stryMutAct_9fa48("945") ? "" : (stryCov_9fa48("945"), "Concluir revisao humana do output") : stryMutAct_9fa48("946") ? "" : (stryCov_9fa48("946"), "Propagar o resultado para o proximo fluxo de trabalho"),
        checkpoint: stryMutAct_9fa48("947") ? "" : (stryCov_9fa48("947"), "1h"),
        deadline: new Date(stryMutAct_9fa48("948") ? Date.now() - 2 * 60 * 60 * 1000 : (stryCov_9fa48("948"), Date.now() + (stryMutAct_9fa48("949") ? 2 * 60 * 60 / 1000 : (stryCov_9fa48("949"), (stryMutAct_9fa48("950") ? 2 * 60 / 60 : (stryCov_9fa48("950"), (stryMutAct_9fa48("951") ? 2 / 60 : (stryCov_9fa48("951"), 2 * 60)) * 60)) * 1000)))).toISOString(),
        expected_impact: governance.requireApproval ? stryMutAct_9fa48("952") ? "" : (stryCov_9fa48("952"), "Reduzir risco operacional antes da entrega final.") : stryMutAct_9fa48("953") ? "" : (stryCov_9fa48("953"), "Ganhar velocidade com rastreabilidade."),
        owner
      })]),
      sharedLearningCount: sharedLearning.length,
      status,
      summary,
      tool_results
    });
  }
}