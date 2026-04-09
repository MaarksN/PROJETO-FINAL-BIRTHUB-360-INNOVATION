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
import { randomUUID } from "node:crypto";
export type CalendarProvider = "google" | "ics";
export type CalendarAction = "create_event" | "list_events";
export interface CalendarInput {
  action: CalendarAction;
  endAt?: string;
  provider: CalendarProvider;
  startAt?: string;
  summary?: string;
}
export interface CalendarResult {
  action: CalendarAction;
  eventId: string;
  provider: CalendarProvider;
  raw: string;
}
function generateIcs(input: CalendarInput): string {
  if (stryMutAct_9fa48("1209")) {
    {}
  } else {
    stryCov_9fa48("1209");
    return (stryMutAct_9fa48("1210") ? [] : (stryCov_9fa48("1210"), [stryMutAct_9fa48("1211") ? "" : (stryCov_9fa48("1211"), "BEGIN:VCALENDAR"), stryMutAct_9fa48("1212") ? "" : (stryCov_9fa48("1212"), "VERSION:2.0"), stryMutAct_9fa48("1213") ? "" : (stryCov_9fa48("1213"), "BEGIN:VEVENT"), stryMutAct_9fa48("1214") ? `` : (stryCov_9fa48("1214"), `UID:${randomUUID()}`), stryMutAct_9fa48("1215") ? `` : (stryCov_9fa48("1215"), `SUMMARY:${stryMutAct_9fa48("1216") ? input.summary && "Untitled" : (stryCov_9fa48("1216"), input.summary ?? (stryMutAct_9fa48("1217") ? "" : (stryCov_9fa48("1217"), "Untitled")))}`), stryMutAct_9fa48("1218") ? `` : (stryCov_9fa48("1218"), `DTSTART:${(stryMutAct_9fa48("1219") ? input.startAt && new Date().toISOString() : (stryCov_9fa48("1219"), input.startAt ?? new Date().toISOString())).replace(stryMutAct_9fa48("1220") ? /[^-:]/g : (stryCov_9fa48("1220"), /[-:]/g), stryMutAct_9fa48("1221") ? "Stryker was here!" : (stryCov_9fa48("1221"), ""))}`), stryMutAct_9fa48("1222") ? `` : (stryCov_9fa48("1222"), `DTEND:${(stryMutAct_9fa48("1223") ? input.endAt && new Date(Date.now() + 3_600_000).toISOString() : (stryCov_9fa48("1223"), input.endAt ?? new Date(stryMutAct_9fa48("1224") ? Date.now() - 3_600_000 : (stryCov_9fa48("1224"), Date.now() + 3_600_000)).toISOString())).replace(stryMutAct_9fa48("1225") ? /[^-:]/g : (stryCov_9fa48("1225"), /[-:]/g), stryMutAct_9fa48("1226") ? "Stryker was here!" : (stryCov_9fa48("1226"), ""))}`), stryMutAct_9fa48("1227") ? "" : (stryCov_9fa48("1227"), "END:VEVENT"), stryMutAct_9fa48("1228") ? "" : (stryCov_9fa48("1228"), "END:VCALENDAR")])).join(stryMutAct_9fa48("1229") ? "" : (stryCov_9fa48("1229"), "\n"));
  }
}
export function callCalendarTool(input: CalendarInput, options?: {
  simulate?: boolean;
}): Promise<CalendarResult> {
  if (stryMutAct_9fa48("1230")) {
    {}
  } else {
    stryCov_9fa48("1230");
    if (stryMutAct_9fa48("1233") ? false : stryMutAct_9fa48("1232") ? true : stryMutAct_9fa48("1231") ? options?.simulate ?? true : (stryCov_9fa48("1231", "1232", "1233"), !(stryMutAct_9fa48("1234") ? options?.simulate && true : (stryCov_9fa48("1234"), (stryMutAct_9fa48("1235") ? options.simulate : (stryCov_9fa48("1235"), options?.simulate)) ?? (stryMutAct_9fa48("1236") ? false : (stryCov_9fa48("1236"), true)))))) {
      if (stryMutAct_9fa48("1237")) {
        {}
      } else {
        stryCov_9fa48("1237");
        throw new Error(stryMutAct_9fa48("1238") ? "" : (stryCov_9fa48("1238"), "Live calendar calls are disabled in this environment."));
      }
    }
    const raw = (stryMutAct_9fa48("1241") ? input.provider !== "ics" : stryMutAct_9fa48("1240") ? false : stryMutAct_9fa48("1239") ? true : (stryCov_9fa48("1239", "1240", "1241"), input.provider === (stryMutAct_9fa48("1242") ? "" : (stryCov_9fa48("1242"), "ics")))) ? generateIcs(input) : JSON.stringify(stryMutAct_9fa48("1243") ? {} : (stryCov_9fa48("1243"), {
      endAt: input.endAt,
      startAt: input.startAt,
      summary: input.summary
    }));
    return Promise.resolve(stryMutAct_9fa48("1244") ? {} : (stryCov_9fa48("1244"), {
      action: input.action,
      eventId: stryMutAct_9fa48("1245") ? `` : (stryCov_9fa48("1245"), `evt_${Date.now()}`),
      provider: input.provider,
      raw
    }));
  }
}