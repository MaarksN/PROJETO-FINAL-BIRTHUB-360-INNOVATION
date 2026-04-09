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
import { z } from "zod";
export const orchestratorInputSchema = z.object(stryMutAct_9fa48("1126") ? {} : (stryCov_9fa48("1126"), {
  objective: stryMutAct_9fa48("1127") ? z.string().max(5) : (stryCov_9fa48("1127"), z.string().min(5)),
  availableAgents: stryMutAct_9fa48("1128") ? z.array(z.string().min(1)).max(1) : (stryCov_9fa48("1128"), z.array(stryMutAct_9fa48("1129") ? z.string().max(1) : (stryCov_9fa48("1129"), z.string().min(1))).min(1)),
  maxSteps: stryMutAct_9fa48("1130") ? z.number().int().positive().min(20).default(8) : (stryCov_9fa48("1130"), z.number().int().positive().max(20).default(8))
}));
export const orchestratorOutputSchema = z.object(stryMutAct_9fa48("1131") ? {} : (stryCov_9fa48("1131"), {
  plan: z.array(z.object(stryMutAct_9fa48("1132") ? {} : (stryCov_9fa48("1132"), {
    reason: stryMutAct_9fa48("1133") ? z.string().max(3) : (stryCov_9fa48("1133"), z.string().min(3)),
    sequence: z.number().int().positive(),
    subAgentId: stryMutAct_9fa48("1134") ? z.string().max(1) : (stryCov_9fa48("1134"), z.string().min(1))
  }))),
  queueAgentIds: stryMutAct_9fa48("1135") ? z.array(z.string().min(1)).max(1) : (stryCov_9fa48("1135"), z.array(stryMutAct_9fa48("1136") ? z.string().max(1) : (stryCov_9fa48("1136"), z.string().min(1))).min(1))
}));
export type OrchestratorInput = z.infer<typeof orchestratorInputSchema>;
export type OrchestratorOutput = z.infer<typeof orchestratorOutputSchema>;
export function runOrchestratorSkill(input: OrchestratorInput): Promise<OrchestratorOutput> {
  if (stryMutAct_9fa48("1137")) {
    {}
  } else {
    stryCov_9fa48("1137");
    const selectedAgents = stryMutAct_9fa48("1138") ? input.availableAgents : (stryCov_9fa48("1138"), input.availableAgents.slice(0, input.maxSteps));
    const plan = selectedAgents.map(stryMutAct_9fa48("1139") ? () => undefined : (stryCov_9fa48("1139"), (agentId, index) => stryMutAct_9fa48("1140") ? {} : (stryCov_9fa48("1140"), {
      reason: stryMutAct_9fa48("1141") ? `` : (stryCov_9fa48("1141"), `Executar ${agentId} para avancar o objetivo: ${input.objective}`),
      sequence: stryMutAct_9fa48("1142") ? index - 1 : (stryCov_9fa48("1142"), index + 1),
      subAgentId: agentId
    })));
    return Promise.resolve(orchestratorOutputSchema.parse(stryMutAct_9fa48("1143") ? {} : (stryCov_9fa48("1143"), {
      plan,
      queueAgentIds: selectedAgents
    })));
  }
}
export const orchestratorSkillTemplate = stryMutAct_9fa48("1144") ? {} : (stryCov_9fa48("1144"), {
  id: stryMutAct_9fa48("1145") ? "" : (stryCov_9fa48("1145"), "template.orchestrator.v1"),
  inputSchema: orchestratorInputSchema,
  outputSchema: orchestratorOutputSchema,
  run: runOrchestratorSkill
});