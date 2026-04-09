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
import { createHash } from "node:crypto";
import { z } from "zod";
import { BaseTool, type BaseToolOptions, type ToolExecutionContext } from "./baseTool.js";
const dbWriteInputSchema = z.object(stryMutAct_9fa48("1292") ? {} : (stryCov_9fa48("1292"), {
  data: z.record(z.string(), z.unknown()),
  operation: z.enum(stryMutAct_9fa48("1293") ? [] : (stryCov_9fa48("1293"), [stryMutAct_9fa48("1294") ? "" : (stryCov_9fa48("1294"), "DELETE"), stryMutAct_9fa48("1295") ? "" : (stryCov_9fa48("1295"), "INSERT"), stryMutAct_9fa48("1296") ? "" : (stryCov_9fa48("1296"), "UPDATE"), stryMutAct_9fa48("1297") ? "" : (stryCov_9fa48("1297"), "UPSERT")])),
  table: stryMutAct_9fa48("1298") ? z.string().max(1) : (stryCov_9fa48("1298"), z.string().min(1)),
  where: z.record(z.string(), z.unknown()).default({})
})).strict();
const dbWriteOutputSchema = z.object(stryMutAct_9fa48("1299") ? {} : (stryCov_9fa48("1299"), {
  affectedRows: z.number().int().nonnegative()
})).strict();
export type DbWriteInput = z.infer<typeof dbWriteInputSchema>;
export type DbWriteOutput = z.infer<typeof dbWriteOutputSchema>;
export interface DbWriteAuditEvent {
  action: "db-write";
  actorAgentId: string;
  digest: string;
  operation: DbWriteInput["operation"];
  table: string;
  tenantId: string;
}
export type DbWriteAuditPublisher = (event: DbWriteAuditEvent) => Promise<void>;
export type DbWriteExecutor = (input: {
  data: Record<string, unknown>;
  operation: DbWriteInput["operation"];
  table: string;
  tenantId: string;
  where: Record<string, unknown>;
}) => Promise<number>;
export interface DbWriteToolOptions extends BaseToolOptions {
  auditPublisher?: DbWriteAuditPublisher;
  executor?: DbWriteExecutor;
}
export class DbWriteTool extends BaseTool<DbWriteInput, DbWriteOutput> {
  private readonly auditPublisher: DbWriteAuditPublisher | undefined;
  private readonly executor: DbWriteExecutor;
  constructor(options: DbWriteToolOptions = {}) {
    if (stryMutAct_9fa48("1300")) {
      {}
    } else {
      stryCov_9fa48("1300");
      super(stryMutAct_9fa48("1301") ? {} : (stryCov_9fa48("1301"), {
        description: stryMutAct_9fa48("1302") ? "" : (stryCov_9fa48("1302"), "Database mutation tool with mandatory audit event emission."),
        inputSchema: dbWriteInputSchema,
        name: stryMutAct_9fa48("1303") ? "" : (stryCov_9fa48("1303"), "db-write"),
        outputSchema: dbWriteOutputSchema
      }), options);
      this.auditPublisher = options.auditPublisher;
      this.executor = stryMutAct_9fa48("1304") ? options.executor && (() => Promise.resolve(0)) : (stryCov_9fa48("1304"), options.executor ?? (stryMutAct_9fa48("1305") ? () => undefined : (stryCov_9fa48("1305"), () => Promise.resolve(0))));
    }
  }
  protected async execute(input: DbWriteInput, context: ToolExecutionContext): Promise<DbWriteOutput> {
    if (stryMutAct_9fa48("1306")) {
      {}
    } else {
      stryCov_9fa48("1306");
      if (stryMutAct_9fa48("1309") ? false : stryMutAct_9fa48("1308") ? true : stryMutAct_9fa48("1307") ? this.auditPublisher : (stryCov_9fa48("1307", "1308", "1309"), !this.auditPublisher)) {
        if (stryMutAct_9fa48("1310")) {
          {}
        } else {
          stryCov_9fa48("1310");
          throw new Error(stryMutAct_9fa48("1311") ? "" : (stryCov_9fa48("1311"), "db-write requires an audit publisher before commit."));
        }
      }
      const payload = stryMutAct_9fa48("1312") ? {} : (stryCov_9fa48("1312"), {
        data: input.data,
        operation: input.operation,
        table: input.table,
        tenantId: context.tenantId,
        where: input.where
      });
      const digest = createHash(stryMutAct_9fa48("1313") ? "" : (stryCov_9fa48("1313"), "sha256")).update(JSON.stringify(payload)).digest(stryMutAct_9fa48("1314") ? "" : (stryCov_9fa48("1314"), "hex"));
      await this.auditPublisher(stryMutAct_9fa48("1315") ? {} : (stryCov_9fa48("1315"), {
        action: stryMutAct_9fa48("1316") ? "" : (stryCov_9fa48("1316"), "db-write"),
        actorAgentId: context.agentId,
        digest,
        operation: input.operation,
        table: input.table,
        tenantId: context.tenantId
      }));
      const affectedRows = await this.executor(payload);
      return stryMutAct_9fa48("1317") ? {} : (stryCov_9fa48("1317"), {
        affectedRows
      });
    }
  }
}