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
export const MANIFEST_VERSION = "1.0.0" as const;
const nonEmptyString = stryMutAct_9fa48("252") ? z.string().min(1) : stryMutAct_9fa48("251") ? z.string().trim().max(1) : (stryCov_9fa48("251", "252"), z.string().trim().min(1));
const jsonSchemaObject = z.record(z.string(), z.unknown()).default(stryMutAct_9fa48("253") ? {} : (stryCov_9fa48("253"), {
  type: stryMutAct_9fa48("254") ? "" : (stryCov_9fa48("254"), "object")
}));
const tagListSchema = stryMutAct_9fa48("255") ? z.array(nonEmptyString).max(1) : (stryCov_9fa48("255"), z.array(nonEmptyString).min(1));
const keywordListSchema = stryMutAct_9fa48("256") ? z.array(nonEmptyString).max(5) : (stryCov_9fa48("256"), z.array(nonEmptyString).min(5));

// Default-deny governance: every manifest object schema in this module is strict.

export const manifestTagsSchema = z.object(stryMutAct_9fa48("257") ? {} : (stryCov_9fa48("257"), {
  domain: tagListSchema,
  level: tagListSchema,
  persona: tagListSchema,
  "use-case": tagListSchema,
  industry: tagListSchema
})).strict();
export const skillManifestSchema = z.object(stryMutAct_9fa48("258") ? {} : (stryCov_9fa48("258"), {
  description: nonEmptyString,
  id: nonEmptyString,
  inputSchema: jsonSchemaObject,
  name: nonEmptyString,
  outputSchema: jsonSchemaObject
})).strict();
export const toolManifestSchema = z.object(stryMutAct_9fa48("259") ? {} : (stryCov_9fa48("259"), {
  description: nonEmptyString,
  id: nonEmptyString,
  inputSchema: jsonSchemaObject,
  name: nonEmptyString,
  outputSchema: jsonSchemaObject,
  timeoutMs: z.number().int().positive().default(15_000)
})).strict();
export const policyManifestSchema = z.object(stryMutAct_9fa48("260") ? {} : (stryCov_9fa48("260"), {
  actions: stryMutAct_9fa48("261") ? z.array(nonEmptyString).max(1) : (stryCov_9fa48("261"), z.array(nonEmptyString).min(1)),
  effect: z.enum(stryMutAct_9fa48("262") ? [] : (stryCov_9fa48("262"), [stryMutAct_9fa48("263") ? "" : (stryCov_9fa48("263"), "allow"), stryMutAct_9fa48("264") ? "" : (stryCov_9fa48("264"), "deny")])),
  id: nonEmptyString,
  name: nonEmptyString
})).strict();
export const agentDescriptorSchema = z.object(stryMutAct_9fa48("265") ? {} : (stryCov_9fa48("265"), {
  changelog: z.array(nonEmptyString).default(stryMutAct_9fa48("266") ? ["Stryker was here"] : (stryCov_9fa48("266"), [])),
  description: nonEmptyString,
  id: nonEmptyString,
  kind: z.enum(stryMutAct_9fa48("267") ? [] : (stryCov_9fa48("267"), [stryMutAct_9fa48("268") ? "" : (stryCov_9fa48("268"), "agent"), stryMutAct_9fa48("269") ? "" : (stryCov_9fa48("269"), "catalog")])).default(stryMutAct_9fa48("270") ? "" : (stryCov_9fa48("270"), "agent")),
  name: nonEmptyString,
  prompt: nonEmptyString,
  tenantId: nonEmptyString.default(stryMutAct_9fa48("271") ? "" : (stryCov_9fa48("271"), "catalog")),
  version: nonEmptyString
})).strict();
export const agentManifestSchema = z.object(stryMutAct_9fa48("272") ? {} : (stryCov_9fa48("272"), {
  agent: agentDescriptorSchema,
  keywords: keywordListSchema,
  manifestVersion: z.literal(MANIFEST_VERSION),
  policies: stryMutAct_9fa48("273") ? z.array(policyManifestSchema).max(1) : (stryCov_9fa48("273"), z.array(policyManifestSchema).min(1)),
  skills: stryMutAct_9fa48("274") ? z.array(skillManifestSchema).max(1) : (stryCov_9fa48("274"), z.array(skillManifestSchema).min(1)),
  tags: manifestTagsSchema,
  tools: stryMutAct_9fa48("275") ? z.array(toolManifestSchema).max(1) : (stryCov_9fa48("275"), z.array(toolManifestSchema).min(1))
})).strict();
export type AgentManifest = z.infer<typeof agentManifestSchema>;
export type AgentManifestTags = z.infer<typeof manifestTagsSchema>;
export type AgentManifestKeywords = z.infer<typeof keywordListSchema>;