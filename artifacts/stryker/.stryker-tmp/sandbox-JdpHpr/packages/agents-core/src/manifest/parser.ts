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
import type { ZodIssue } from "zod";
import { agentManifestSchema, MANIFEST_VERSION } from "./schema.js";
import type { AgentManifest } from "./schema.js";
export class AgentManifestParseError extends Error {
  readonly issues: string[];
  constructor(issues: string[]) {
    if (stryMutAct_9fa48("213")) {
      {}
    } else {
      stryCov_9fa48("213");
      super(stryMutAct_9fa48("214") ? `` : (stryCov_9fa48("214"), `Agent manifest invalido: ${issues.join(stryMutAct_9fa48("215") ? "" : (stryCov_9fa48("215"), "; "))}`));
      this.name = stryMutAct_9fa48("216") ? "" : (stryCov_9fa48("216"), "AgentManifestParseError");
      this.issues = issues;
    }
  }
}
function formatIssue(issue: ZodIssue): string {
  if (stryMutAct_9fa48("217")) {
    {}
  } else {
    stryCov_9fa48("217");
    const path = (stryMutAct_9fa48("221") ? issue.path.length <= 0 : stryMutAct_9fa48("220") ? issue.path.length >= 0 : stryMutAct_9fa48("219") ? false : stryMutAct_9fa48("218") ? true : (stryCov_9fa48("218", "219", "220", "221"), issue.path.length > 0)) ? issue.path.join(stryMutAct_9fa48("222") ? "" : (stryCov_9fa48("222"), ".")) : stryMutAct_9fa48("223") ? "" : (stryCov_9fa48("223"), "root");
    return stryMutAct_9fa48("224") ? `` : (stryCov_9fa48("224"), `${path}: ${issue.message}`);
  }
}
export function parseAgentManifest(input: unknown): AgentManifest {
  if (stryMutAct_9fa48("225")) {
    {}
  } else {
    stryCov_9fa48("225");
    const result = agentManifestSchema.safeParse(input);
    if (stryMutAct_9fa48("228") ? false : stryMutAct_9fa48("227") ? true : stryMutAct_9fa48("226") ? result.success : (stryCov_9fa48("226", "227", "228"), !result.success)) {
      if (stryMutAct_9fa48("229")) {
        {}
      } else {
        stryCov_9fa48("229");
        const issues = result.error.issues.map(formatIssue);
        const version = (stryMutAct_9fa48("232") ? typeof input === "object" && input !== null || "manifestVersion" in input : stryMutAct_9fa48("231") ? false : stryMutAct_9fa48("230") ? true : (stryCov_9fa48("230", "231", "232"), (stryMutAct_9fa48("234") ? typeof input === "object" || input !== null : stryMutAct_9fa48("233") ? true : (stryCov_9fa48("233", "234"), (stryMutAct_9fa48("236") ? typeof input !== "object" : stryMutAct_9fa48("235") ? true : (stryCov_9fa48("235", "236"), typeof input === (stryMutAct_9fa48("237") ? "" : (stryCov_9fa48("237"), "object")))) && (stryMutAct_9fa48("239") ? input === null : stryMutAct_9fa48("238") ? true : (stryCov_9fa48("238", "239"), input !== null)))) && (stryMutAct_9fa48("240") ? "" : (stryCov_9fa48("240"), "manifestVersion")) in input)) ? (input as {
          manifestVersion?: unknown;
        }).manifestVersion : undefined;
        if (stryMutAct_9fa48("243") ? typeof version === "string" || version !== MANIFEST_VERSION : stryMutAct_9fa48("242") ? false : stryMutAct_9fa48("241") ? true : (stryCov_9fa48("241", "242", "243"), (stryMutAct_9fa48("245") ? typeof version !== "string" : stryMutAct_9fa48("244") ? true : (stryCov_9fa48("244", "245"), typeof version === (stryMutAct_9fa48("246") ? "" : (stryCov_9fa48("246"), "string")))) && (stryMutAct_9fa48("248") ? version === MANIFEST_VERSION : stryMutAct_9fa48("247") ? true : (stryCov_9fa48("247", "248"), version !== MANIFEST_VERSION)))) {
          if (stryMutAct_9fa48("249")) {
            {}
          } else {
            stryCov_9fa48("249");
            issues.unshift(stryMutAct_9fa48("250") ? `` : (stryCov_9fa48("250"), `manifestVersion: versao incompativel (${version}). Esperado ${MANIFEST_VERSION}.`));
          }
        }
        throw new AgentManifestParseError(issues);
      }
    }
    return result.data;
  }
}