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
export const reporterInputSchema = z.object(stryMutAct_9fa48("1146") ? {} : (stryCov_9fa48("1146"), {
  format: z.enum(stryMutAct_9fa48("1147") ? [] : (stryCov_9fa48("1147"), [stryMutAct_9fa48("1148") ? "" : (stryCov_9fa48("1148"), "markdown"), stryMutAct_9fa48("1149") ? "" : (stryCov_9fa48("1149"), "pdf")])).default(stryMutAct_9fa48("1150") ? "" : (stryCov_9fa48("1150"), "markdown")),
  metrics: z.array(z.object(stryMutAct_9fa48("1151") ? {} : (stryCov_9fa48("1151"), {
    label: stryMutAct_9fa48("1152") ? z.string().max(1) : (stryCov_9fa48("1152"), z.string().min(1)),
    value: z.number()
  })))
}));
export const reporterOutputSchema = z.object(stryMutAct_9fa48("1153") ? {} : (stryCov_9fa48("1153"), {
  content: stryMutAct_9fa48("1154") ? z.string().max(10) : (stryCov_9fa48("1154"), z.string().min(10)),
  format: z.enum(stryMutAct_9fa48("1155") ? [] : (stryCov_9fa48("1155"), [stryMutAct_9fa48("1156") ? "" : (stryCov_9fa48("1156"), "markdown"), stryMutAct_9fa48("1157") ? "" : (stryCov_9fa48("1157"), "pdf")]))
}));
export type ReporterInput = z.infer<typeof reporterInputSchema>;
export type ReporterOutput = z.infer<typeof reporterOutputSchema>;
export function runReporterSkill(input: ReporterInput): Promise<ReporterOutput> {
  if (stryMutAct_9fa48("1158")) {
    {}
  } else {
    stryCov_9fa48("1158");
    const rows = input.metrics.map(stryMutAct_9fa48("1159") ? () => undefined : (stryCov_9fa48("1159"), metric => stryMutAct_9fa48("1160") ? `` : (stryCov_9fa48("1160"), `- ${metric.label}: ${metric.value}`))).join(stryMutAct_9fa48("1161") ? "" : (stryCov_9fa48("1161"), "\n"));
    const markdown = (stryMutAct_9fa48("1162") ? [] : (stryCov_9fa48("1162"), [stryMutAct_9fa48("1163") ? "" : (stryCov_9fa48("1163"), "# Relatorio Executivo"), stryMutAct_9fa48("1164") ? "Stryker was here!" : (stryCov_9fa48("1164"), ""), stryMutAct_9fa48("1165") ? "" : (stryCov_9fa48("1165"), "## Resumo de Metricas"), rows, stryMutAct_9fa48("1166") ? "Stryker was here!" : (stryCov_9fa48("1166"), ""), stryMutAct_9fa48("1167") ? "" : (stryCov_9fa48("1167"), "## Observacoes"), stryMutAct_9fa48("1168") ? "" : (stryCov_9fa48("1168"), "- Priorizar indicadores abaixo da meta."), stryMutAct_9fa48("1169") ? "" : (stryCov_9fa48("1169"), "- Revisar risco de budget em agentes com alto consumo.")])).join(stryMutAct_9fa48("1170") ? "" : (stryCov_9fa48("1170"), "\n"));
    if (stryMutAct_9fa48("1173") ? input.format !== "pdf" : stryMutAct_9fa48("1172") ? false : stryMutAct_9fa48("1171") ? true : (stryCov_9fa48("1171", "1172", "1173"), input.format === (stryMutAct_9fa48("1174") ? "" : (stryCov_9fa48("1174"), "pdf")))) {
      if (stryMutAct_9fa48("1175")) {
        {}
      } else {
        stryCov_9fa48("1175");
        return Promise.resolve(reporterOutputSchema.parse(stryMutAct_9fa48("1176") ? {} : (stryCov_9fa48("1176"), {
          content: stryMutAct_9fa48("1177") ? `` : (stryCov_9fa48("1177"), `PDF_BINARY_PLACEHOLDER::${Buffer.from(markdown, stryMutAct_9fa48("1178") ? "" : (stryCov_9fa48("1178"), "utf8")).toString(stryMutAct_9fa48("1179") ? "" : (stryCov_9fa48("1179"), "base64"))}`),
          format: stryMutAct_9fa48("1180") ? "" : (stryCov_9fa48("1180"), "pdf")
        })));
      }
    }
    return Promise.resolve(reporterOutputSchema.parse(stryMutAct_9fa48("1181") ? {} : (stryCov_9fa48("1181"), {
      content: markdown,
      format: stryMutAct_9fa48("1182") ? "" : (stryCov_9fa48("1182"), "markdown")
    })));
  }
}
export const reporterSkillTemplate = stryMutAct_9fa48("1183") ? {} : (stryCov_9fa48("1183"), {
  id: stryMutAct_9fa48("1184") ? "" : (stryCov_9fa48("1184"), "template.reporter.v1"),
  inputSchema: reporterInputSchema,
  outputSchema: reporterOutputSchema,
  run: runReporterSkill
});