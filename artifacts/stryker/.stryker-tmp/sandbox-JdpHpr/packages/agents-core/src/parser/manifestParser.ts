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
import { ZodError, type ZodIssue } from "zod";
import { agentManifestSchema, type AgentManifest, SUPPORTED_AGENT_API_VERSION } from "../schemas/manifest.schema.js";
export class AgentManifestParseError extends Error {
  readonly issues: string[];
  constructor(issues: string[]) {
    if (stryMutAct_9fa48("462")) {
      {}
    } else {
      stryCov_9fa48("462");
      super(stryMutAct_9fa48("463") ? `` : (stryCov_9fa48("463"), `Manifesto de agente inválido: ${issues.join(stryMutAct_9fa48("464") ? "" : (stryCov_9fa48("464"), "; "))}`));
      this.name = stryMutAct_9fa48("465") ? "" : (stryCov_9fa48("465"), "AgentManifestParseError");
      this.issues = issues;
    }
  }
}
function compareSemverVersions(left: string, right: string): number {
  if (stryMutAct_9fa48("466")) {
    {}
  } else {
    stryCov_9fa48("466");
    const [leftCore = stryMutAct_9fa48("467") ? "" : (stryCov_9fa48("467"), "0.0.0")] = left.split(stryMutAct_9fa48("468") ? "" : (stryCov_9fa48("468"), "-"));
    const [rightCore = stryMutAct_9fa48("469") ? "" : (stryCov_9fa48("469"), "0.0.0")] = right.split(stryMutAct_9fa48("470") ? "" : (stryCov_9fa48("470"), "-"));
    const leftParts = leftCore.split(stryMutAct_9fa48("471") ? "" : (stryCov_9fa48("471"), ".")).map(stryMutAct_9fa48("472") ? () => undefined : (stryCov_9fa48("472"), value => Number.parseInt(value, 10)));
    const rightParts = rightCore.split(stryMutAct_9fa48("473") ? "" : (stryCov_9fa48("473"), ".")).map(stryMutAct_9fa48("474") ? () => undefined : (stryCov_9fa48("474"), value => Number.parseInt(value, 10)));
    for (let index = 0; stryMutAct_9fa48("477") ? index >= 3 : stryMutAct_9fa48("476") ? index <= 3 : stryMutAct_9fa48("475") ? false : (stryCov_9fa48("475", "476", "477"), index < 3); stryMutAct_9fa48("478") ? index -= 1 : (stryCov_9fa48("478"), index += 1)) {
      if (stryMutAct_9fa48("479")) {
        {}
      } else {
        stryCov_9fa48("479");
        const delta = stryMutAct_9fa48("480") ? (leftParts[index] ?? 0) + (rightParts[index] ?? 0) : (stryCov_9fa48("480"), (stryMutAct_9fa48("481") ? leftParts[index] && 0 : (stryCov_9fa48("481"), leftParts[index] ?? 0)) - (stryMutAct_9fa48("482") ? rightParts[index] && 0 : (stryCov_9fa48("482"), rightParts[index] ?? 0)));
        if (stryMutAct_9fa48("485") ? delta === 0 : stryMutAct_9fa48("484") ? false : stryMutAct_9fa48("483") ? true : (stryCov_9fa48("483", "484", "485"), delta !== 0)) {
          if (stryMutAct_9fa48("486")) {
            {}
          } else {
            stryCov_9fa48("486");
            return delta;
          }
        }
      }
    }
    return 0;
  }
}
function formatIssue(issue: ZodIssue): string {
  if (stryMutAct_9fa48("487")) {
    {}
  } else {
    stryCov_9fa48("487");
    const path = (stryMutAct_9fa48("491") ? issue.path.length <= 0 : stryMutAct_9fa48("490") ? issue.path.length >= 0 : stryMutAct_9fa48("489") ? false : stryMutAct_9fa48("488") ? true : (stryCov_9fa48("488", "489", "490", "491"), issue.path.length > 0)) ? issue.path.join(stryMutAct_9fa48("492") ? "" : (stryCov_9fa48("492"), ".")) : stryMutAct_9fa48("493") ? "" : (stryCov_9fa48("493"), "manifest");
    if (stryMutAct_9fa48("496") ? path === "tools" && issue.code === "invalid_type" || issue.expected === "array" : stryMutAct_9fa48("495") ? false : stryMutAct_9fa48("494") ? true : (stryCov_9fa48("494", "495", "496"), (stryMutAct_9fa48("498") ? path === "tools" || issue.code === "invalid_type" : stryMutAct_9fa48("497") ? true : (stryCov_9fa48("497", "498"), (stryMutAct_9fa48("500") ? path !== "tools" : stryMutAct_9fa48("499") ? true : (stryCov_9fa48("499", "500"), path === (stryMutAct_9fa48("501") ? "" : (stryCov_9fa48("501"), "tools")))) && (stryMutAct_9fa48("503") ? issue.code !== "invalid_type" : stryMutAct_9fa48("502") ? true : (stryCov_9fa48("502", "503"), issue.code === (stryMutAct_9fa48("504") ? "" : (stryCov_9fa48("504"), "invalid_type")))))) && (stryMutAct_9fa48("506") ? issue.expected !== "array" : stryMutAct_9fa48("505") ? true : (stryCov_9fa48("505", "506"), issue.expected === (stryMutAct_9fa48("507") ? "" : (stryCov_9fa48("507"), "array")))))) {
      if (stryMutAct_9fa48("508")) {
        {}
      } else {
        stryCov_9fa48("508");
        return stryMutAct_9fa48("509") ? `` : (stryCov_9fa48("509"), `O campo 'tools' precisa ser um array.`);
      }
    }
    if (stryMutAct_9fa48("512") ? path === "skills" && issue.code === "invalid_type" || issue.expected === "array" : stryMutAct_9fa48("511") ? false : stryMutAct_9fa48("510") ? true : (stryCov_9fa48("510", "511", "512"), (stryMutAct_9fa48("514") ? path === "skills" || issue.code === "invalid_type" : stryMutAct_9fa48("513") ? true : (stryCov_9fa48("513", "514"), (stryMutAct_9fa48("516") ? path !== "skills" : stryMutAct_9fa48("515") ? true : (stryCov_9fa48("515", "516"), path === (stryMutAct_9fa48("517") ? "" : (stryCov_9fa48("517"), "skills")))) && (stryMutAct_9fa48("519") ? issue.code !== "invalid_type" : stryMutAct_9fa48("518") ? true : (stryCov_9fa48("518", "519"), issue.code === (stryMutAct_9fa48("520") ? "" : (stryCov_9fa48("520"), "invalid_type")))))) && (stryMutAct_9fa48("522") ? issue.expected !== "array" : stryMutAct_9fa48("521") ? true : (stryCov_9fa48("521", "522"), issue.expected === (stryMutAct_9fa48("523") ? "" : (stryCov_9fa48("523"), "array")))))) {
      if (stryMutAct_9fa48("524")) {
        {}
      } else {
        stryCov_9fa48("524");
        return stryMutAct_9fa48("525") ? `` : (stryCov_9fa48("525"), `O campo 'skills' precisa ser um array.`);
      }
    }
    return stryMutAct_9fa48("526") ? `` : (stryCov_9fa48("526"), `${path}: ${issue.message}`);
  }
}
export function parseAgentManifest(input: unknown, options?: {
  supportedApiVersion?: string;
}): AgentManifest {
  if (stryMutAct_9fa48("527")) {
    {}
  } else {
    stryCov_9fa48("527");
    const supportedApiVersion = stryMutAct_9fa48("528") ? options?.supportedApiVersion && SUPPORTED_AGENT_API_VERSION : (stryCov_9fa48("528"), (stryMutAct_9fa48("529") ? options.supportedApiVersion : (stryCov_9fa48("529"), options?.supportedApiVersion)) ?? SUPPORTED_AGENT_API_VERSION);
    try {
      if (stryMutAct_9fa48("530")) {
        {}
      } else {
        stryCov_9fa48("530");
        const manifest = agentManifestSchema.parse(input);
        if (stryMutAct_9fa48("534") ? compareSemverVersions(manifest.apiVersion, supportedApiVersion) <= 0 : stryMutAct_9fa48("533") ? compareSemverVersions(manifest.apiVersion, supportedApiVersion) >= 0 : stryMutAct_9fa48("532") ? false : stryMutAct_9fa48("531") ? true : (stryCov_9fa48("531", "532", "533", "534"), compareSemverVersions(manifest.apiVersion, supportedApiVersion) > 0)) {
          if (stryMutAct_9fa48("535")) {
            {}
          } else {
            stryCov_9fa48("535");
            throw new AgentManifestParseError(stryMutAct_9fa48("536") ? [] : (stryCov_9fa48("536"), [stryMutAct_9fa48("537") ? `` : (stryCov_9fa48("537"), `apiVersion: versão '${manifest.apiVersion}' não suportada. Versão máxima suportada: '${supportedApiVersion}'.`)]));
          }
        }
        return manifest;
      }
    } catch (error) {
      if (stryMutAct_9fa48("538")) {
        {}
      } else {
        stryCov_9fa48("538");
        if (stryMutAct_9fa48("540") ? false : stryMutAct_9fa48("539") ? true : (stryCov_9fa48("539", "540"), error instanceof AgentManifestParseError)) {
          if (stryMutAct_9fa48("541")) {
            {}
          } else {
            stryCov_9fa48("541");
            throw error;
          }
        }
        if (stryMutAct_9fa48("543") ? false : stryMutAct_9fa48("542") ? true : (stryCov_9fa48("542", "543"), error instanceof ZodError)) {
          if (stryMutAct_9fa48("544")) {
            {}
          } else {
            stryCov_9fa48("544");
            const issues = error.issues.map(formatIssue);
            throw new AgentManifestParseError(issues);
          }
        }
        throw error;
      }
    }
  }
}