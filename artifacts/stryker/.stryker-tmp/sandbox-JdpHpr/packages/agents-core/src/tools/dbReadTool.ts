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
import { BaseTool, type BaseToolOptions, type ToolExecutionContext } from "./baseTool.js";
const dbReadInputSchema = z.object(stryMutAct_9fa48("1267") ? {} : (stryCov_9fa48("1267"), {
  params: z.array(z.unknown()).default(stryMutAct_9fa48("1268") ? ["Stryker was here"] : (stryCov_9fa48("1268"), [])),
  query: stryMutAct_9fa48("1269") ? z.string().max(1) : (stryCov_9fa48("1269"), z.string().min(1))
})).strict();
const dbReadOutputSchema = z.object(stryMutAct_9fa48("1270") ? {} : (stryCov_9fa48("1270"), {
  rowCount: z.number().int().nonnegative(),
  rows: z.array(z.unknown())
})).strict();
export type DbReadInput = z.infer<typeof dbReadInputSchema>;
export type DbReadOutput = z.infer<typeof dbReadOutputSchema>;
export type DbReadExecutor = (input: {
  params: unknown[];
  query: string;
  tenantId: string;
}) => Promise<unknown[]>;
export interface DbReadToolOptions extends BaseToolOptions {
  executor?: DbReadExecutor;
}
function isReadOnlyQuery(query: string): boolean {
  if (stryMutAct_9fa48("1271")) {
    {}
  } else {
    stryCov_9fa48("1271");
    return (stryMutAct_9fa48("1274") ? /^\S*(select|with)\b/i : stryMutAct_9fa48("1273") ? /^\s(select|with)\b/i : stryMutAct_9fa48("1272") ? /\s*(select|with)\b/i : (stryCov_9fa48("1272", "1273", "1274"), /^\s*(select|with)\b/i)).test(query);
  }
}
export class DbReadTool extends BaseTool<DbReadInput, DbReadOutput> {
  private readonly executor: DbReadExecutor;
  constructor(options: DbReadToolOptions = {}) {
    if (stryMutAct_9fa48("1275")) {
      {}
    } else {
      stryCov_9fa48("1275");
      super(stryMutAct_9fa48("1276") ? {} : (stryCov_9fa48("1276"), {
        description: stryMutAct_9fa48("1277") ? "" : (stryCov_9fa48("1277"), "Read-only database access with mandatory tenant scoping."),
        inputSchema: dbReadInputSchema,
        name: stryMutAct_9fa48("1278") ? "" : (stryCov_9fa48("1278"), "db-read"),
        outputSchema: dbReadOutputSchema
      }), options);
      this.executor = stryMutAct_9fa48("1279") ? options.executor && (() => Promise.resolve([])) : (stryCov_9fa48("1279"), options.executor ?? (stryMutAct_9fa48("1280") ? () => undefined : (stryCov_9fa48("1280"), () => Promise.resolve(stryMutAct_9fa48("1281") ? ["Stryker was here"] : (stryCov_9fa48("1281"), [])))));
    }
  }
  protected async execute(input: DbReadInput, context: ToolExecutionContext): Promise<DbReadOutput> {
    if (stryMutAct_9fa48("1282")) {
      {}
    } else {
      stryCov_9fa48("1282");
      if (stryMutAct_9fa48("1285") ? false : stryMutAct_9fa48("1284") ? true : stryMutAct_9fa48("1283") ? isReadOnlyQuery(input.query) : (stryCov_9fa48("1283", "1284", "1285"), !isReadOnlyQuery(input.query))) {
        if (stryMutAct_9fa48("1286")) {
          {}
        } else {
          stryCov_9fa48("1286");
          throw new Error(stryMutAct_9fa48("1287") ? "" : (stryCov_9fa48("1287"), "db-read only accepts SELECT/WITH statements."));
        }
      }
      const scopedQuery = stryMutAct_9fa48("1288") ? `` : (stryCov_9fa48("1288"), `${input.query}\n-- tenant_scope: ${context.tenantId}`);
      const rows = await this.executor(stryMutAct_9fa48("1289") ? {} : (stryCov_9fa48("1289"), {
        params: stryMutAct_9fa48("1290") ? [] : (stryCov_9fa48("1290"), [...input.params, context.tenantId]),
        query: scopedQuery,
        tenantId: context.tenantId
      }));
      return stryMutAct_9fa48("1291") ? {} : (stryCov_9fa48("1291"), {
        rowCount: rows.length,
        rows
      });
    }
  }
}