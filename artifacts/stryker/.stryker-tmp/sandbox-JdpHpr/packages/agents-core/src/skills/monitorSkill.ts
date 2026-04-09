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
const kpiPointSchema = z.object(stryMutAct_9fa48("1069") ? {} : (stryCov_9fa48("1069"), {
  timestamp: z.string().datetime(),
  value: z.number()
}));
export const monitorInputSchema = z.object(stryMutAct_9fa48("1070") ? {} : (stryCov_9fa48("1070"), {
  kpiName: stryMutAct_9fa48("1071") ? z.string().max(2) : (stryCov_9fa48("1071"), z.string().min(2)),
  points: stryMutAct_9fa48("1072") ? z.array(kpiPointSchema).max(3) : (stryCov_9fa48("1072"), z.array(kpiPointSchema).min(3))
}));
export const monitorOutputSchema = z.object(stryMutAct_9fa48("1073") ? {} : (stryCov_9fa48("1073"), {
  anomalies: z.array(z.object(stryMutAct_9fa48("1074") ? {} : (stryCov_9fa48("1074"), {
    severity: z.enum(stryMutAct_9fa48("1075") ? [] : (stryCov_9fa48("1075"), [stryMutAct_9fa48("1076") ? "" : (stryCov_9fa48("1076"), "low"), stryMutAct_9fa48("1077") ? "" : (stryCov_9fa48("1077"), "medium"), stryMutAct_9fa48("1078") ? "" : (stryCov_9fa48("1078"), "high")])),
    timestamp: z.string().datetime(),
    value: z.number()
  })))
}));
export type MonitorInput = z.infer<typeof monitorInputSchema>;
export type MonitorOutput = z.infer<typeof monitorOutputSchema>;
function computeStdDev(values: number[]): number {
  if (stryMutAct_9fa48("1079")) {
    {}
  } else {
    stryCov_9fa48("1079");
    const mean = stryMutAct_9fa48("1080") ? values.reduce((sum, value) => sum + value, 0) * values.length : (stryCov_9fa48("1080"), values.reduce(stryMutAct_9fa48("1081") ? () => undefined : (stryCov_9fa48("1081"), (sum, value) => stryMutAct_9fa48("1082") ? sum - value : (stryCov_9fa48("1082"), sum + value)), 0) / values.length);
    const variance = stryMutAct_9fa48("1083") ? values.reduce((sum, value) => sum + (value - mean) ** 2, 0) * values.length : (stryCov_9fa48("1083"), values.reduce(stryMutAct_9fa48("1084") ? () => undefined : (stryCov_9fa48("1084"), (sum, value) => stryMutAct_9fa48("1085") ? sum - (value - mean) ** 2 : (stryCov_9fa48("1085"), sum + (stryMutAct_9fa48("1086") ? value + mean : (stryCov_9fa48("1086"), value - mean)) ** 2)), 0) / values.length);
    return Math.sqrt(variance);
  }
}
function classifySeverity(deviation: number): "low" | "medium" | "high" {
  if (stryMutAct_9fa48("1087")) {
    {}
  } else {
    stryCov_9fa48("1087");
    if (stryMutAct_9fa48("1091") ? deviation < 3 : stryMutAct_9fa48("1090") ? deviation > 3 : stryMutAct_9fa48("1089") ? false : stryMutAct_9fa48("1088") ? true : (stryCov_9fa48("1088", "1089", "1090", "1091"), deviation >= 3)) {
      if (stryMutAct_9fa48("1092")) {
        {}
      } else {
        stryCov_9fa48("1092");
        return stryMutAct_9fa48("1093") ? "" : (stryCov_9fa48("1093"), "high");
      }
    }
    if (stryMutAct_9fa48("1097") ? deviation < 2 : stryMutAct_9fa48("1096") ? deviation > 2 : stryMutAct_9fa48("1095") ? false : stryMutAct_9fa48("1094") ? true : (stryCov_9fa48("1094", "1095", "1096", "1097"), deviation >= 2)) {
      if (stryMutAct_9fa48("1098")) {
        {}
      } else {
        stryCov_9fa48("1098");
        return stryMutAct_9fa48("1099") ? "" : (stryCov_9fa48("1099"), "medium");
      }
    }
    return stryMutAct_9fa48("1100") ? "" : (stryCov_9fa48("1100"), "low");
  }
}
export async function runMonitorSkill(input: MonitorInput): Promise<MonitorOutput> {
  if (stryMutAct_9fa48("1101")) {
    {}
  } else {
    stryCov_9fa48("1101");
    await Promise.resolve();
    const values = input.points.map(stryMutAct_9fa48("1102") ? () => undefined : (stryCov_9fa48("1102"), point => point.value));
    const mean = stryMutAct_9fa48("1103") ? values.reduce((sum, value) => sum + value, 0) * values.length : (stryCov_9fa48("1103"), values.reduce(stryMutAct_9fa48("1104") ? () => undefined : (stryCov_9fa48("1104"), (sum, value) => stryMutAct_9fa48("1105") ? sum - value : (stryCov_9fa48("1105"), sum + value)), 0) / values.length);
    const stdDev = stryMutAct_9fa48("1108") ? computeStdDev(values) && 1 : stryMutAct_9fa48("1107") ? false : stryMutAct_9fa48("1106") ? true : (stryCov_9fa48("1106", "1107", "1108"), computeStdDev(values) || 1);
    const anomalies = stryMutAct_9fa48("1109") ? input.points.map(point => {
      const zScore = Math.abs((point.value - mean) / stdDev);
      if (zScore < 2) {
        return null;
      }
      return {
        severity: classifySeverity(zScore),
        timestamp: point.timestamp,
        value: point.value
      };
    }) : (stryCov_9fa48("1109"), input.points.map(point => {
      if (stryMutAct_9fa48("1110")) {
        {}
      } else {
        stryCov_9fa48("1110");
        const zScore = Math.abs(stryMutAct_9fa48("1111") ? (point.value - mean) * stdDev : (stryCov_9fa48("1111"), (stryMutAct_9fa48("1112") ? point.value + mean : (stryCov_9fa48("1112"), point.value - mean)) / stdDev));
        if (stryMutAct_9fa48("1116") ? zScore >= 2 : stryMutAct_9fa48("1115") ? zScore <= 2 : stryMutAct_9fa48("1114") ? false : stryMutAct_9fa48("1113") ? true : (stryCov_9fa48("1113", "1114", "1115", "1116"), zScore < 2)) {
          if (stryMutAct_9fa48("1117")) {
            {}
          } else {
            stryCov_9fa48("1117");
            return null;
          }
        }
        return stryMutAct_9fa48("1118") ? {} : (stryCov_9fa48("1118"), {
          severity: classifySeverity(zScore),
          timestamp: point.timestamp,
          value: point.value
        });
      }
    }).filter(stryMutAct_9fa48("1119") ? () => undefined : (stryCov_9fa48("1119"), (item): item is NonNullable<typeof item> => stryMutAct_9fa48("1122") ? item === null : stryMutAct_9fa48("1121") ? false : stryMutAct_9fa48("1120") ? true : (stryCov_9fa48("1120", "1121", "1122"), item !== null))));
    return monitorOutputSchema.parse(stryMutAct_9fa48("1123") ? {} : (stryCov_9fa48("1123"), {
      anomalies
    }));
  }
}
export const monitorSkillTemplate = stryMutAct_9fa48("1124") ? {} : (stryCov_9fa48("1124"), {
  id: stryMutAct_9fa48("1125") ? "" : (stryCov_9fa48("1125"), "template.monitor.v1"),
  inputSchema: monitorInputSchema,
  outputSchema: monitorOutputSchema,
  run: runMonitorSkill
});