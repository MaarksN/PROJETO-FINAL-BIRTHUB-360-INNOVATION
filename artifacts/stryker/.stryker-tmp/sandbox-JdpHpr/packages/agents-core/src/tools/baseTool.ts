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
import type { ZodType } from "zod";
import { PolicyDeniedError, type PolicyContext, type PolicyEngine } from "../policy/engine.js";
export interface ToolCostMetadata {
  estimatedCostUsd?: number;
  unit?: "call" | "token";
}
export interface ToolExecutionContext {
  agentId: string;
  tenantId: string;
  action?: string;
  timeoutMs?: number;
  policyContext?: PolicyContext;
  allowlistedDomains?: string[];
  traceId?: string;
}
export interface ToolDefinition<TInput, TOutput> {
  name: string;
  description?: string;
  inputSchema: ZodType<TInput>;
  outputSchema: ZodType<TOutput>;
  timeoutMs?: number;
  cost?: ToolCostMetadata;
}
export interface BaseToolOptions {
  policyEngine?: PolicyEngine;
}
export abstract class BaseTool<TInput, TOutput> {
  readonly name: string;
  readonly description: string | undefined;
  readonly timeoutMs: number;
  readonly cost: ToolCostMetadata | undefined;
  protected readonly inputSchema: ZodType<TInput>;
  protected readonly outputSchema: ZodType<TOutput>;
  protected readonly policyEngine: PolicyEngine | undefined;
  constructor(definition: ToolDefinition<TInput, TOutput>, options: BaseToolOptions = {}) {
    if (stryMutAct_9fa48("1185")) {
      {}
    } else {
      stryCov_9fa48("1185");
      this.name = definition.name;
      this.description = definition.description;
      this.inputSchema = definition.inputSchema;
      this.outputSchema = definition.outputSchema;
      this.timeoutMs = stryMutAct_9fa48("1186") ? definition.timeoutMs && 30_000 : (stryCov_9fa48("1186"), definition.timeoutMs ?? 30_000);
      this.cost = definition.cost;
      this.policyEngine = options.policyEngine;
    }
  }
  async run(rawInput: unknown, context: ToolExecutionContext): Promise<TOutput> {
    if (stryMutAct_9fa48("1187")) {
      {}
    } else {
      stryCov_9fa48("1187");
      const input = this.inputSchema.parse(rawInput);
      const action = stryMutAct_9fa48("1188") ? context.action && `tool.${this.name}` : (stryCov_9fa48("1188"), context.action ?? (stryMutAct_9fa48("1189") ? `` : (stryCov_9fa48("1189"), `tool.${this.name}`)));
      if (stryMutAct_9fa48("1191") ? false : stryMutAct_9fa48("1190") ? true : (stryCov_9fa48("1190", "1191"), this.policyEngine)) {
        if (stryMutAct_9fa48("1192")) {
          {}
        } else {
          stryCov_9fa48("1192");
          const evaluation = this.policyEngine.evaluate(context.agentId, action, stryMutAct_9fa48("1193") ? context.policyContext && context : (stryCov_9fa48("1193"), context.policyContext ?? context));
          if (stryMutAct_9fa48("1196") ? false : stryMutAct_9fa48("1195") ? true : stryMutAct_9fa48("1194") ? evaluation.granted : (stryCov_9fa48("1194", "1195", "1196"), !evaluation.granted)) {
            if (stryMutAct_9fa48("1197")) {
              {}
            } else {
              stryCov_9fa48("1197");
              throw new PolicyDeniedError(evaluation.reason);
            }
          }
        }
      }
      const timeoutMs = stryMutAct_9fa48("1198") ? context.timeoutMs && this.timeoutMs : (stryCov_9fa48("1198"), context.timeoutMs ?? this.timeoutMs);
      const output = await this.withTimeout(this.execute(input, context), timeoutMs);
      return this.outputSchema.parse(output);
    }
  }
  protected abstract execute(input: TInput, context: ToolExecutionContext): Promise<TOutput>;
  private async withTimeout<TResult>(promise: Promise<TResult>, timeoutMs: number): Promise<TResult> {
    if (stryMutAct_9fa48("1199")) {
      {}
    } else {
      stryCov_9fa48("1199");
      let timeoutHandle: NodeJS.Timeout | undefined;
      try {
        if (stryMutAct_9fa48("1200")) {
          {}
        } else {
          stryCov_9fa48("1200");
          const timeoutPromise = new Promise<never>((_, reject) => {
            if (stryMutAct_9fa48("1201")) {
              {}
            } else {
              stryCov_9fa48("1201");
              timeoutHandle = setTimeout(() => {
                if (stryMutAct_9fa48("1202")) {
                  {}
                } else {
                  stryCov_9fa48("1202");
                  reject(new Error(stryMutAct_9fa48("1203") ? `` : (stryCov_9fa48("1203"), `Tool '${this.name}' timed out after ${timeoutMs}ms`)));
                }
              }, timeoutMs);
            }
          });
          return await Promise.race(stryMutAct_9fa48("1204") ? [] : (stryCov_9fa48("1204"), [promise, timeoutPromise]));
        }
      } finally {
        if (stryMutAct_9fa48("1205")) {
          {}
        } else {
          stryCov_9fa48("1205");
          if (stryMutAct_9fa48("1207") ? false : stryMutAct_9fa48("1206") ? true : (stryCov_9fa48("1206", "1207"), timeoutHandle)) {
            if (stryMutAct_9fa48("1208")) {
              {}
            } else {
              stryCov_9fa48("1208");
              clearTimeout(timeoutHandle);
            }
          }
        }
      }
    }
  }
}