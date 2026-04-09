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
export type StorageProvider = "s3" | "supabase";
export type StorageAction = "download" | "upload";
export interface StorageInput {
  action: StorageAction;
  blob?: string;
  bucket: string;
  key: string;
  provider: StorageProvider;
}
export interface StorageResult {
  action: StorageAction;
  key: string;
  provider: StorageProvider;
  signedUrl: string;
}
function buildSignedUrl(provider: StorageProvider, bucket: string, key: string): string {
  if (stryMutAct_9fa48("1661")) {
    {}
  } else {
    stryCov_9fa48("1661");
    if (stryMutAct_9fa48("1664") ? provider !== "s3" : stryMutAct_9fa48("1663") ? false : stryMutAct_9fa48("1662") ? true : (stryCov_9fa48("1662", "1663", "1664"), provider === (stryMutAct_9fa48("1665") ? "" : (stryCov_9fa48("1665"), "s3")))) {
      if (stryMutAct_9fa48("1666")) {
        {}
      } else {
        stryCov_9fa48("1666");
        return stryMutAct_9fa48("1667") ? `` : (stryCov_9fa48("1667"), `https://s3.amazonaws.com/${bucket}/${key}?signature=mock`);
      }
    }
    return stryMutAct_9fa48("1668") ? `` : (stryCov_9fa48("1668"), `https://project.supabase.co/storage/v1/object/public/${bucket}/${key}?token=mock`);
  }
}
export function callStorageTool(input: StorageInput, options?: {
  simulate?: boolean;
}): Promise<StorageResult> {
  if (stryMutAct_9fa48("1669")) {
    {}
  } else {
    stryCov_9fa48("1669");
    if (stryMutAct_9fa48("1672") ? false : stryMutAct_9fa48("1671") ? true : stryMutAct_9fa48("1670") ? options?.simulate ?? true : (stryCov_9fa48("1670", "1671", "1672"), !(stryMutAct_9fa48("1673") ? options?.simulate && true : (stryCov_9fa48("1673"), (stryMutAct_9fa48("1674") ? options.simulate : (stryCov_9fa48("1674"), options?.simulate)) ?? (stryMutAct_9fa48("1675") ? false : (stryCov_9fa48("1675"), true)))))) {
      if (stryMutAct_9fa48("1676")) {
        {}
      } else {
        stryCov_9fa48("1676");
        throw new Error(stryMutAct_9fa48("1677") ? "" : (stryCov_9fa48("1677"), "Live storage calls are disabled in this environment."));
      }
    }
    return Promise.resolve(stryMutAct_9fa48("1678") ? {} : (stryCov_9fa48("1678"), {
      action: input.action,
      key: input.key,
      provider: input.provider,
      signedUrl: buildSignedUrl(input.provider, input.bucket, input.key)
    }));
  }
}