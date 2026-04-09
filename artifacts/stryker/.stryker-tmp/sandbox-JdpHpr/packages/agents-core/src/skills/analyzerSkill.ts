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
export const analyzerInputSchema = z.object(stryMutAct_9fa48("1004") ? {} : (stryCov_9fa48("1004"), {
  context: stryMutAct_9fa48("1005") ? z.string().max(10) : (stryCov_9fa48("1005"), z.string().min(10)),
  objective: stryMutAct_9fa48("1006") ? z.string().max(3) : (stryCov_9fa48("1006"), z.string().min(3))
}));
export const analyzerOutputSchema = z.object(stryMutAct_9fa48("1007") ? {} : (stryCov_9fa48("1007"), {
  insights: stryMutAct_9fa48("1008") ? z.array(z.string().min(3)).max(1) : (stryCov_9fa48("1008"), z.array(stryMutAct_9fa48("1009") ? z.string().max(3) : (stryCov_9fa48("1009"), z.string().min(3))).min(1)),
  score: stryMutAct_9fa48("1011") ? z.number().max(0).max(100) : stryMutAct_9fa48("1010") ? z.number().min(0).min(100) : (stryCov_9fa48("1010", "1011"), z.number().min(0).max(100))
}));
export type AnalyzerInput = z.infer<typeof analyzerInputSchema>;
export type AnalyzerOutput = z.infer<typeof analyzerOutputSchema>;
export async function runAnalyzerSkill(input: AnalyzerInput): Promise<AnalyzerOutput> {
  if (stryMutAct_9fa48("1012")) {
    {}
  } else {
    stryCov_9fa48("1012");
    await Promise.resolve();
    const normalizedContext = stryMutAct_9fa48("1013") ? input.context.toUpperCase() : (stryCov_9fa48("1013"), input.context.toLowerCase());
    const positiveSignals = stryMutAct_9fa48("1014") ? [] : (stryCov_9fa48("1014"), [stryMutAct_9fa48("1015") ? "" : (stryCov_9fa48("1015"), "growth"), stryMutAct_9fa48("1016") ? "" : (stryCov_9fa48("1016"), "win"), stryMutAct_9fa48("1017") ? "" : (stryCov_9fa48("1017"), "healthy"), stryMutAct_9fa48("1018") ? "" : (stryCov_9fa48("1018"), "efficient"), stryMutAct_9fa48("1019") ? "" : (stryCov_9fa48("1019"), "improve")]);
    const hits = stryMutAct_9fa48("1020") ? positiveSignals.length : (stryCov_9fa48("1020"), positiveSignals.filter(stryMutAct_9fa48("1021") ? () => undefined : (stryCov_9fa48("1021"), signal => normalizedContext.includes(signal))).length);
    const score = stryMutAct_9fa48("1022") ? Math.max(100, 40 + hits * 12) : (stryCov_9fa48("1022"), Math.min(100, stryMutAct_9fa48("1023") ? 40 - hits * 12 : (stryCov_9fa48("1023"), 40 + (stryMutAct_9fa48("1024") ? hits / 12 : (stryCov_9fa48("1024"), hits * 12)))));
    return analyzerOutputSchema.parse(stryMutAct_9fa48("1025") ? {} : (stryCov_9fa48("1025"), {
      insights: stryMutAct_9fa48("1026") ? [] : (stryCov_9fa48("1026"), [stryMutAct_9fa48("1027") ? `` : (stryCov_9fa48("1027"), `Objetivo analisado: ${input.objective}.`), stryMutAct_9fa48("1028") ? `` : (stryCov_9fa48("1028"), `Sinais positivos identificados: ${hits}.`), stryMutAct_9fa48("1029") ? "" : (stryCov_9fa48("1029"), "Priorize a execucao de maior impacto no curto prazo.")]),
      score
    }));
  }
}
export const analyzerSkillTemplate = stryMutAct_9fa48("1030") ? {} : (stryCov_9fa48("1030"), {
  id: stryMutAct_9fa48("1031") ? "" : (stryCov_9fa48("1031"), "template.analyzer.v1"),
  inputSchema: analyzerInputSchema,
  outputSchema: analyzerOutputSchema,
  run: runAnalyzerSkill
});