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
export const generatorInputSchema = z.object(stryMutAct_9fa48("1032") ? {} : (stryCov_9fa48("1032"), {
  brief: stryMutAct_9fa48("1033") ? z.string().max(10) : (stryCov_9fa48("1033"), z.string().min(10)),
  format: z.enum(stryMutAct_9fa48("1034") ? [] : (stryCov_9fa48("1034"), [stryMutAct_9fa48("1035") ? "" : (stryCov_9fa48("1035"), "markdown"), stryMutAct_9fa48("1036") ? "" : (stryCov_9fa48("1036"), "html")])).default(stryMutAct_9fa48("1037") ? "" : (stryCov_9fa48("1037"), "markdown")),
  tone: stryMutAct_9fa48("1038") ? z.string().max(2).default("executive") : (stryCov_9fa48("1038"), z.string().min(2).default(stryMutAct_9fa48("1039") ? "" : (stryCov_9fa48("1039"), "executive")))
}));
export const generatorOutputSchema = z.object(stryMutAct_9fa48("1040") ? {} : (stryCov_9fa48("1040"), {
  artifact: stryMutAct_9fa48("1041") ? z.string().max(30) : (stryCov_9fa48("1041"), z.string().min(30)),
  format: z.enum(stryMutAct_9fa48("1042") ? [] : (stryCov_9fa48("1042"), [stryMutAct_9fa48("1043") ? "" : (stryCov_9fa48("1043"), "markdown"), stryMutAct_9fa48("1044") ? "" : (stryCov_9fa48("1044"), "html")]))
}));
export type GeneratorInput = z.infer<typeof generatorInputSchema>;
export type GeneratorOutput = z.infer<typeof generatorOutputSchema>;
function createMarkdownArtifact(input: GeneratorInput): string {
  if (stryMutAct_9fa48("1045")) {
    {}
  } else {
    stryCov_9fa48("1045");
    return (stryMutAct_9fa48("1046") ? [] : (stryCov_9fa48("1046"), [stryMutAct_9fa48("1047") ? `` : (stryCov_9fa48("1047"), `# Entrega Gerada`), stryMutAct_9fa48("1048") ? "Stryker was here!" : (stryCov_9fa48("1048"), ""), stryMutAct_9fa48("1049") ? `` : (stryCov_9fa48("1049"), `## Tom`), stryMutAct_9fa48("1050") ? `` : (stryCov_9fa48("1050"), `${input.tone}`), stryMutAct_9fa48("1051") ? "Stryker was here!" : (stryCov_9fa48("1051"), ""), stryMutAct_9fa48("1052") ? "" : (stryCov_9fa48("1052"), "## Brief"), input.brief, stryMutAct_9fa48("1053") ? "Stryker was here!" : (stryCov_9fa48("1053"), ""), stryMutAct_9fa48("1054") ? "" : (stryCov_9fa48("1054"), "## Proposta"), stryMutAct_9fa48("1055") ? "" : (stryCov_9fa48("1055"), "1. Diagnostico inicial"), stryMutAct_9fa48("1056") ? "" : (stryCov_9fa48("1056"), "2. Plano de execucao"), stryMutAct_9fa48("1057") ? "" : (stryCov_9fa48("1057"), "3. Metricas de sucesso")])).join(stryMutAct_9fa48("1058") ? "" : (stryCov_9fa48("1058"), "\n"));
  }
}
function createHtmlArtifact(input: GeneratorInput): string {
  if (stryMutAct_9fa48("1059")) {
    {}
  } else {
    stryCov_9fa48("1059");
    return stryMutAct_9fa48("1060") ? `` : (stryCov_9fa48("1060"), `<article><h1>Entrega Gerada</h1><h2>Tom</h2><p>${input.tone}</p><h2>Brief</h2><p>${input.brief}</p><h2>Proposta</h2><ol><li>Diagnostico inicial</li><li>Plano de execucao</li><li>Metricas de sucesso</li></ol></article>`);
  }
}
export async function runGeneratorSkill(input: GeneratorInput): Promise<GeneratorOutput> {
  if (stryMutAct_9fa48("1061")) {
    {}
  } else {
    stryCov_9fa48("1061");
    await Promise.resolve();
    const artifact = (stryMutAct_9fa48("1064") ? input.format !== "html" : stryMutAct_9fa48("1063") ? false : stryMutAct_9fa48("1062") ? true : (stryCov_9fa48("1062", "1063", "1064"), input.format === (stryMutAct_9fa48("1065") ? "" : (stryCov_9fa48("1065"), "html")))) ? createHtmlArtifact(input) : createMarkdownArtifact(input);
    return generatorOutputSchema.parse(stryMutAct_9fa48("1066") ? {} : (stryCov_9fa48("1066"), {
      artifact,
      format: input.format
    }));
  }
}
export const generatorSkillTemplate = stryMutAct_9fa48("1067") ? {} : (stryCov_9fa48("1067"), {
  id: stryMutAct_9fa48("1068") ? "" : (stryCov_9fa48("1068"), "template.generator.v1"),
  inputSchema: generatorInputSchema,
  outputSchema: generatorOutputSchema,
  run: runGeneratorSkill
});