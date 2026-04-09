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
const semanticVersionRegex = stryMutAct_9fa48("970") ? /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[^0-9A-Za-z.-]+)?$/ : stryMutAct_9fa48("969") ? /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-])?$/ : stryMutAct_9fa48("968") ? /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)$/ : stryMutAct_9fa48("967") ? /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[^0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/ : stryMutAct_9fa48("966") ? /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-])?(?:\+[0-9A-Za-z.-]+)?$/ : stryMutAct_9fa48("965") ? /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)(?:\+[0-9A-Za-z.-]+)?$/ : stryMutAct_9fa48("964") ? /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\D*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/ : stryMutAct_9fa48("963") ? /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/ : stryMutAct_9fa48("962") ? /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[^1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/ : stryMutAct_9fa48("961") ? /^(0|[1-9]\d*)\.(0|[1-9]\D*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/ : stryMutAct_9fa48("960") ? /^(0|[1-9]\d*)\.(0|[1-9]\d)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/ : stryMutAct_9fa48("959") ? /^(0|[1-9]\d*)\.(0|[^1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/ : stryMutAct_9fa48("958") ? /^(0|[1-9]\D*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/ : stryMutAct_9fa48("957") ? /^(0|[1-9]\d)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/ : stryMutAct_9fa48("956") ? /^(0|[^1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/ : stryMutAct_9fa48("955") ? /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?/ : stryMutAct_9fa48("954") ? /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/ : (stryCov_9fa48("954", "955", "956", "957", "958", "959", "960", "961", "962", "963", "964", "965", "966", "967", "968", "969", "970"), /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/);
export const SUPPORTED_AGENT_API_VERSION = stryMutAct_9fa48("971") ? "" : (stryCov_9fa48("971"), "1.0.0");
export const semanticVersionSchema = z.string().regex(semanticVersionRegex, stryMutAct_9fa48("972") ? "" : (stryCov_9fa48("972"), "Expected semantic version (major.minor.patch)"));
const skillReferenceSchema = z.object(stryMutAct_9fa48("973") ? {} : (stryCov_9fa48("973"), {
  id: stryMutAct_9fa48("974") ? z.string().max(1) : (stryCov_9fa48("974"), z.string().min(1)),
  source: stryMutAct_9fa48("975") ? z.string().max(1).optional() : (stryCov_9fa48("975"), z.string().min(1).optional()),
  version: semanticVersionSchema
})).strict();
const toolReferenceSchema = z.object(stryMutAct_9fa48("976") ? {} : (stryCov_9fa48("976"), {
  id: stryMutAct_9fa48("977") ? z.string().max(1) : (stryCov_9fa48("977"), z.string().min(1)),
  maxCalls: stryMutAct_9fa48("978") ? z.number().int().positive().min(1000).default(1) : (stryCov_9fa48("978"), z.number().int().positive().max(1000).default(1)),
  timeoutMs: stryMutAct_9fa48("979") ? z.number().int().positive().min(300_000).default(30_000) : (stryCov_9fa48("979"), z.number().int().positive().max(300_000).default(30_000))
})).strict();
const restrictionPolicySchema = z.object(stryMutAct_9fa48("980") ? {} : (stryCov_9fa48("980"), {
  allowDomains: z.array(stryMutAct_9fa48("981") ? z.string().max(1) : (stryCov_9fa48("981"), z.string().min(1))).default(stryMutAct_9fa48("982") ? ["Stryker was here"] : (stryCov_9fa48("982"), [])),
  allowTools: z.array(stryMutAct_9fa48("983") ? z.string().max(1) : (stryCov_9fa48("983"), z.string().min(1))).default(stryMutAct_9fa48("984") ? ["Stryker was here"] : (stryCov_9fa48("984"), [])),
  denyTools: z.array(stryMutAct_9fa48("985") ? z.string().max(1) : (stryCov_9fa48("985"), z.string().min(1))).default(stryMutAct_9fa48("986") ? ["Stryker was here"] : (stryCov_9fa48("986"), [])),
  maxSteps: stryMutAct_9fa48("987") ? z.number().int().positive().min(100).default(12) : (stryCov_9fa48("987"), z.number().int().positive().max(100).default(12)),
  maxTokens: stryMutAct_9fa48("988") ? z.number().int().positive().min(1_000_000).default(8_000) : (stryCov_9fa48("988"), z.number().int().positive().max(1_000_000).default(8_000))
})).strict();
export const agentManifestSchema = z.object(stryMutAct_9fa48("989") ? {} : (stryCov_9fa48("989"), {
  apiVersion: semanticVersionSchema.default(SUPPORTED_AGENT_API_VERSION),
  version: semanticVersionSchema,
  description: stryMutAct_9fa48("991") ? z.string().max(1).max(2_000).optional() : stryMutAct_9fa48("990") ? z.string().min(1).min(2_000).optional() : (stryCov_9fa48("990", "991"), z.string().min(1).max(2_000).optional()),
  name: stryMutAct_9fa48("993") ? z.string().max(1).max(120) : stryMutAct_9fa48("992") ? z.string().min(1).min(120) : (stryCov_9fa48("992", "993"), z.string().min(1).max(120)),
  system_prompt: stryMutAct_9fa48("995") ? z.string().max(1).max(10_000) : stryMutAct_9fa48("994") ? z.string().min(1).min(10_000) : (stryCov_9fa48("994", "995"), z.string().min(1).max(10_000)),
  memory_ttl: stryMutAct_9fa48("996") ? z.number().int().positive().min(31536000).default(86400) : (stryCov_9fa48("996"), z.number().int().positive().max(31536000).default(86400)),
  restrictions: restrictionPolicySchema.default(stryMutAct_9fa48("997") ? {} : (stryCov_9fa48("997"), {
    allowDomains: stryMutAct_9fa48("998") ? ["Stryker was here"] : (stryCov_9fa48("998"), []),
    allowTools: stryMutAct_9fa48("999") ? ["Stryker was here"] : (stryCov_9fa48("999"), []),
    denyTools: stryMutAct_9fa48("1000") ? ["Stryker was here"] : (stryCov_9fa48("1000"), []),
    maxSteps: 12,
    maxTokens: 8_000
  })),
  skills: stryMutAct_9fa48("1001") ? z.array(skillReferenceSchema).max(1) : (stryCov_9fa48("1001"), z.array(skillReferenceSchema).min(1)),
  tags: z.array(stryMutAct_9fa48("1002") ? z.string().max(1) : (stryCov_9fa48("1002"), z.string().min(1))).default(stryMutAct_9fa48("1003") ? ["Stryker was here"] : (stryCov_9fa48("1003"), [])),
  tools: z.array(toolReferenceSchema),
  metadata: z.record(z.string(), z.unknown()).optional()
})).strict();
export type AgentManifest = z.infer<typeof agentManifestSchema>;