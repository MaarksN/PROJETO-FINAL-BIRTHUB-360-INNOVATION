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
export type CrmProvider = "hubspot" | "salesforce";
export type CrmAction = "create_lead" | "update_lead" | "create_contact";
export interface CrmInput {
  action: CrmAction;
  payload: Record<string, unknown>;
  provider: CrmProvider;
  tenantId: string;
}
export interface CrmResult {
  action: CrmAction;
  endpoint: string;
  provider: CrmProvider;
  status: "ok";
}
function resolveEndpoint(provider: CrmProvider, action: CrmAction): string {
  if (stryMutAct_9fa48("1246")) {
    {}
  } else {
    stryCov_9fa48("1246");
    const mapping: Record<CrmProvider, Record<CrmAction, string>> = stryMutAct_9fa48("1247") ? {} : (stryCov_9fa48("1247"), {
      hubspot: stryMutAct_9fa48("1248") ? {} : (stryCov_9fa48("1248"), {
        create_contact: stryMutAct_9fa48("1249") ? "" : (stryCov_9fa48("1249"), "/crm/v3/objects/contacts"),
        create_lead: stryMutAct_9fa48("1250") ? "" : (stryCov_9fa48("1250"), "/crm/v3/objects/leads"),
        update_lead: stryMutAct_9fa48("1251") ? "" : (stryCov_9fa48("1251"), "/crm/v3/objects/leads/{id}")
      }),
      salesforce: stryMutAct_9fa48("1252") ? {} : (stryCov_9fa48("1252"), {
        create_contact: stryMutAct_9fa48("1253") ? "" : (stryCov_9fa48("1253"), "/services/data/v60.0/sobjects/Contact"),
        create_lead: stryMutAct_9fa48("1254") ? "" : (stryCov_9fa48("1254"), "/services/data/v60.0/sobjects/Lead"),
        update_lead: stryMutAct_9fa48("1255") ? "" : (stryCov_9fa48("1255"), "/services/data/v60.0/sobjects/Lead/{id}")
      })
    });
    return mapping[provider][action];
  }
}
export async function callCrmTool(input: CrmInput, options?: {
  simulate?: boolean;
}): Promise<CrmResult> {
  if (stryMutAct_9fa48("1256")) {
    {}
  } else {
    stryCov_9fa48("1256");
    await Promise.resolve();
    const endpoint = resolveEndpoint(input.provider, input.action);
    if (stryMutAct_9fa48("1259") ? false : stryMutAct_9fa48("1258") ? true : stryMutAct_9fa48("1257") ? options?.simulate ?? true : (stryCov_9fa48("1257", "1258", "1259"), !(stryMutAct_9fa48("1260") ? options?.simulate && true : (stryCov_9fa48("1260"), (stryMutAct_9fa48("1261") ? options.simulate : (stryCov_9fa48("1261"), options?.simulate)) ?? (stryMutAct_9fa48("1262") ? false : (stryCov_9fa48("1262"), true)))))) {
      if (stryMutAct_9fa48("1263")) {
        {}
      } else {
        stryCov_9fa48("1263");
        throw new Error(stryMutAct_9fa48("1264") ? "" : (stryCov_9fa48("1264"), "Live CRM calls are disabled in this environment."));
      }
    }
    return stryMutAct_9fa48("1265") ? {} : (stryCov_9fa48("1265"), {
      action: input.action,
      endpoint,
      provider: input.provider,
      status: stryMutAct_9fa48("1266") ? "" : (stryCov_9fa48("1266"), "ok")
    });
  }
}