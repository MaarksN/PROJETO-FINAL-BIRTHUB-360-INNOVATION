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
import type { CalendarResult } from "../calendar.tool.js";
import type { CrmResult } from "../crm.tool.js";
import type { EmailSendResult } from "../email.tool.js";
import type { SlackMessageResult } from "../slack.tool.js";
import type { StorageResult } from "../storage.tool.js";
export const connectorMocks = stryMutAct_9fa48("1679") ? {} : (stryCov_9fa48("1679"), {
  calendar: (stryMutAct_9fa48("1680") ? {} : (stryCov_9fa48("1680"), {
    action: stryMutAct_9fa48("1681") ? "" : (stryCov_9fa48("1681"), "create_event"),
    eventId: stryMutAct_9fa48("1682") ? "" : (stryCov_9fa48("1682"), "evt_mock"),
    provider: stryMutAct_9fa48("1683") ? "" : (stryCov_9fa48("1683"), "ics"),
    raw: stryMutAct_9fa48("1684") ? "" : (stryCov_9fa48("1684"), "BEGIN:VCALENDAR...")
  })) satisfies CalendarResult,
  crm: (stryMutAct_9fa48("1685") ? {} : (stryCov_9fa48("1685"), {
    action: stryMutAct_9fa48("1686") ? "" : (stryCov_9fa48("1686"), "create_lead"),
    endpoint: stryMutAct_9fa48("1687") ? "" : (stryCov_9fa48("1687"), "/crm/v3/objects/leads"),
    provider: stryMutAct_9fa48("1688") ? "" : (stryCov_9fa48("1688"), "hubspot"),
    status: stryMutAct_9fa48("1689") ? "" : (stryCov_9fa48("1689"), "ok")
  })) satisfies CrmResult,
  email: (stryMutAct_9fa48("1690") ? {} : (stryCov_9fa48("1690"), {
    bounced: stryMutAct_9fa48("1691") ? true : (stryCov_9fa48("1691"), false),
    messageId: stryMutAct_9fa48("1692") ? "" : (stryCov_9fa48("1692"), "mock_message"),
    provider: stryMutAct_9fa48("1693") ? "" : (stryCov_9fa48("1693"), "smtp"),
    retries: 0
  })) satisfies EmailSendResult,
  slack: (stryMutAct_9fa48("1694") ? {} : (stryCov_9fa48("1694"), {
    mode: stryMutAct_9fa48("1695") ? "" : (stryCov_9fa48("1695"), "webhook"),
    ok: stryMutAct_9fa48("1696") ? false : (stryCov_9fa48("1696"), true),
    ts: stryMutAct_9fa48("1697") ? "" : (stryCov_9fa48("1697"), "2026-03-13T00:00:00.000Z")
  })) satisfies SlackMessageResult,
  storage: (stryMutAct_9fa48("1698") ? {} : (stryCov_9fa48("1698"), {
    action: stryMutAct_9fa48("1699") ? "" : (stryCov_9fa48("1699"), "upload"),
    key: stryMutAct_9fa48("1700") ? "" : (stryCov_9fa48("1700"), "reports/mock.md"),
    provider: stryMutAct_9fa48("1701") ? "" : (stryCov_9fa48("1701"), "s3"),
    signedUrl: stryMutAct_9fa48("1702") ? "" : (stryCov_9fa48("1702"), "https://s3.amazonaws.com/bucket/reports/mock.md?signature=mock")
  })) satisfies StorageResult
});