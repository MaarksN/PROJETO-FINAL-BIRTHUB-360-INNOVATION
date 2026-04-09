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
import type { AgentLearningRecord } from "../types/index.js";
const DEFAULT_TOKEN_BUDGET = 8_000;
export type ConversationRole = "assistant" | "system" | "tool" | "user";
export interface ConversationMessage {
  role: ConversationRole;
  content: string;
  createdAt: string;
}
export interface ConversationContext {
  sessionId: string;
  messages: ConversationMessage[];
  metadata: Record<string, unknown>;
  updatedAt: string;
}
interface BackendRecord {
  value: string;
  expiresAt?: number;
}
export interface AgentMemoryBackend {
  del(key: string): Promise<number>;
  get(key: string): Promise<string | null>;
  keys(pattern: string): Promise<string[]>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
}
function escapeRegex(value: string): string {
  if (stryMutAct_9fa48("276")) {
    {}
  } else {
    stryCov_9fa48("276");
    return value.replace(stryMutAct_9fa48("277") ? /[^.*+?^${}()|[\]\\]/g : (stryCov_9fa48("277"), /[.*+?^${}()|[\]\\]/g), stryMutAct_9fa48("278") ? "" : (stryCov_9fa48("278"), "\\$&"));
  }
}
function matchesPattern(candidate: string, pattern: string): boolean {
  if (stryMutAct_9fa48("279")) {
    {}
  } else {
    stryCov_9fa48("279");
    const regex = new RegExp(stryMutAct_9fa48("280") ? `` : (stryCov_9fa48("280"), `^${escapeRegex(pattern).replace(/\\\*/g, stryMutAct_9fa48("281") ? "" : (stryCov_9fa48("281"), ".*"))}$`));
    return regex.test(candidate);
  }
}
export class InMemoryAgentMemoryBackend implements AgentMemoryBackend {
  private readonly records = new Map<string, BackendRecord>();
  private sweepExpired(now: number = Date.now()): void {
    if (stryMutAct_9fa48("282")) {
      {}
    } else {
      stryCov_9fa48("282");
      for (const [key, record] of this.records.entries()) {
        if (stryMutAct_9fa48("283")) {
          {}
        } else {
          stryCov_9fa48("283");
          if (stryMutAct_9fa48("286") ? record.expiresAt !== undefined || record.expiresAt <= now : stryMutAct_9fa48("285") ? false : stryMutAct_9fa48("284") ? true : (stryCov_9fa48("284", "285", "286"), (stryMutAct_9fa48("288") ? record.expiresAt === undefined : stryMutAct_9fa48("287") ? true : (stryCov_9fa48("287", "288"), record.expiresAt !== undefined)) && (stryMutAct_9fa48("291") ? record.expiresAt > now : stryMutAct_9fa48("290") ? record.expiresAt < now : stryMutAct_9fa48("289") ? true : (stryCov_9fa48("289", "290", "291"), record.expiresAt <= now)))) {
            if (stryMutAct_9fa48("292")) {
              {}
            } else {
              stryCov_9fa48("292");
              this.records.delete(key);
            }
          }
        }
      }
    }
  }
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (stryMutAct_9fa48("293")) {
      {}
    } else {
      stryCov_9fa48("293");
      await Promise.resolve();
      const expiresAt = (stryMutAct_9fa48("296") ? ttlSeconds === undefined : stryMutAct_9fa48("295") ? false : stryMutAct_9fa48("294") ? true : (stryCov_9fa48("294", "295", "296"), ttlSeconds !== undefined)) ? stryMutAct_9fa48("297") ? Date.now() - ttlSeconds * 1000 : (stryCov_9fa48("297"), Date.now() + (stryMutAct_9fa48("298") ? ttlSeconds / 1000 : (stryCov_9fa48("298"), ttlSeconds * 1000))) : undefined;
      this.records.set(key, (stryMutAct_9fa48("301") ? expiresAt !== undefined : stryMutAct_9fa48("300") ? false : stryMutAct_9fa48("299") ? true : (stryCov_9fa48("299", "300", "301"), expiresAt === undefined)) ? stryMutAct_9fa48("302") ? {} : (stryCov_9fa48("302"), {
        value
      }) : stryMutAct_9fa48("303") ? {} : (stryCov_9fa48("303"), {
        expiresAt,
        value
      }));
    }
  }
  async get(key: string): Promise<string | null> {
    if (stryMutAct_9fa48("304")) {
      {}
    } else {
      stryCov_9fa48("304");
      await Promise.resolve();
      this.sweepExpired();
      return stryMutAct_9fa48("305") ? this.records.get(key)?.value && null : (stryCov_9fa48("305"), (stryMutAct_9fa48("306") ? this.records.get(key).value : (stryCov_9fa48("306"), this.records.get(key)?.value)) ?? null);
    }
  }
  async del(key: string): Promise<number> {
    if (stryMutAct_9fa48("307")) {
      {}
    } else {
      stryCov_9fa48("307");
      await Promise.resolve();
      return this.records.delete(key) ? 1 : 0;
    }
  }
  async keys(pattern: string): Promise<string[]> {
    if (stryMutAct_9fa48("308")) {
      {}
    } else {
      stryCov_9fa48("308");
      await Promise.resolve();
      this.sweepExpired();
      return stryMutAct_9fa48("309") ? Array.from(this.records.keys()) : (stryCov_9fa48("309"), Array.from(this.records.keys()).filter(stryMutAct_9fa48("310") ? () => undefined : (stryCov_9fa48("310"), key => matchesPattern(key, pattern))));
    }
  }
}
function buildNamespacedKey(tenantId: string, agentId: string, memoryKey: string): string {
  if (stryMutAct_9fa48("311")) {
    {}
  } else {
    stryCov_9fa48("311");
    if (stryMutAct_9fa48("314") ? (!tenantId.trim() || !agentId.trim()) && !memoryKey.trim() : stryMutAct_9fa48("313") ? false : stryMutAct_9fa48("312") ? true : (stryCov_9fa48("312", "313", "314"), (stryMutAct_9fa48("316") ? !tenantId.trim() && !agentId.trim() : stryMutAct_9fa48("315") ? false : (stryCov_9fa48("315", "316"), (stryMutAct_9fa48("317") ? tenantId.trim() : (stryCov_9fa48("317"), !(stryMutAct_9fa48("318") ? tenantId : (stryCov_9fa48("318"), tenantId.trim())))) || (stryMutAct_9fa48("319") ? agentId.trim() : (stryCov_9fa48("319"), !(stryMutAct_9fa48("320") ? agentId : (stryCov_9fa48("320"), agentId.trim())))))) || (stryMutAct_9fa48("321") ? memoryKey.trim() : (stryCov_9fa48("321"), !(stryMutAct_9fa48("322") ? memoryKey : (stryCov_9fa48("322"), memoryKey.trim())))))) {
      if (stryMutAct_9fa48("323")) {
        {}
      } else {
        stryCov_9fa48("323");
        throw new Error(stryMutAct_9fa48("324") ? "" : (stryCov_9fa48("324"), "tenantId, agentId and memoryKey are mandatory"));
      }
    }
    return stryMutAct_9fa48("325") ? `` : (stryCov_9fa48("325"), `${tenantId}:${agentId}:${memoryKey}`);
  }
}
function buildSharedLearningKey(tenantId: string, memoryKey: string): string {
  if (stryMutAct_9fa48("326")) {
    {}
  } else {
    stryCov_9fa48("326");
    if (stryMutAct_9fa48("329") ? !tenantId.trim() && !memoryKey.trim() : stryMutAct_9fa48("328") ? false : stryMutAct_9fa48("327") ? true : (stryCov_9fa48("327", "328", "329"), (stryMutAct_9fa48("330") ? tenantId.trim() : (stryCov_9fa48("330"), !(stryMutAct_9fa48("331") ? tenantId : (stryCov_9fa48("331"), tenantId.trim())))) || (stryMutAct_9fa48("332") ? memoryKey.trim() : (stryCov_9fa48("332"), !(stryMutAct_9fa48("333") ? memoryKey : (stryCov_9fa48("333"), memoryKey.trim())))))) {
      if (stryMutAct_9fa48("334")) {
        {}
      } else {
        stryCov_9fa48("334");
        throw new Error(stryMutAct_9fa48("335") ? "" : (stryCov_9fa48("335"), "tenantId and memoryKey are mandatory"));
      }
    }
    return stryMutAct_9fa48("336") ? `` : (stryCov_9fa48("336"), `${tenantId}:shared-learning:${memoryKey}`);
  }
}
export function estimateTokenCount(content: string): number {
  if (stryMutAct_9fa48("337")) {
    {}
  } else {
    stryCov_9fa48("337");
    return Math.ceil(stryMutAct_9fa48("338") ? content.length * 4 : (stryCov_9fa48("338"), content.length / 4));
  }
}
export function compressConversationMessages(messages: ConversationMessage[], tokenBudget: number = DEFAULT_TOKEN_BUDGET, tokenEstimator: (content: string) => number = estimateTokenCount): ConversationMessage[] {
  if (stryMutAct_9fa48("339")) {
    {}
  } else {
    stryCov_9fa48("339");
    if (stryMutAct_9fa48("343") ? messages.length > 1 : stryMutAct_9fa48("342") ? messages.length < 1 : stryMutAct_9fa48("341") ? false : stryMutAct_9fa48("340") ? true : (stryCov_9fa48("340", "341", "342", "343"), messages.length <= 1)) {
      if (stryMutAct_9fa48("344")) {
        {}
      } else {
        stryCov_9fa48("344");
        return messages;
      }
    }
    const safeBudget = stryMutAct_9fa48("345") ? Math.min(1, tokenBudget) : (stryCov_9fa48("345"), Math.max(1, tokenBudget));
    const systemMessage = messages.find(stryMutAct_9fa48("346") ? () => undefined : (stryCov_9fa48("346"), message => stryMutAct_9fa48("349") ? message.role !== "system" : stryMutAct_9fa48("348") ? false : stryMutAct_9fa48("347") ? true : (stryCov_9fa48("347", "348", "349"), message.role === (stryMutAct_9fa48("350") ? "" : (stryCov_9fa48("350"), "system")))));
    const reversibleMessages = stryMutAct_9fa48("353") ? messages.slice().reverse() : stryMutAct_9fa48("352") ? messages.filter(message => message !== systemMessage).reverse() : stryMutAct_9fa48("351") ? messages.filter(message => message !== systemMessage).slice() : (stryCov_9fa48("351", "352", "353"), messages.filter(stryMutAct_9fa48("354") ? () => undefined : (stryCov_9fa48("354"), message => stryMutAct_9fa48("357") ? message === systemMessage : stryMutAct_9fa48("356") ? false : stryMutAct_9fa48("355") ? true : (stryCov_9fa48("355", "356", "357"), message !== systemMessage))).slice().reverse());
    const selected: ConversationMessage[] = stryMutAct_9fa48("358") ? ["Stryker was here"] : (stryCov_9fa48("358"), []);
    let currentBudget = systemMessage ? tokenEstimator(systemMessage.content) : 0;
    for (const message of reversibleMessages) {
      if (stryMutAct_9fa48("359")) {
        {}
      } else {
        stryCov_9fa48("359");
        const messageTokens = tokenEstimator(message.content);
        if (stryMutAct_9fa48("362") ? currentBudget + messageTokens > safeBudget || selected.length > 0 : stryMutAct_9fa48("361") ? false : stryMutAct_9fa48("360") ? true : (stryCov_9fa48("360", "361", "362"), (stryMutAct_9fa48("365") ? currentBudget + messageTokens <= safeBudget : stryMutAct_9fa48("364") ? currentBudget + messageTokens >= safeBudget : stryMutAct_9fa48("363") ? true : (stryCov_9fa48("363", "364", "365"), (stryMutAct_9fa48("366") ? currentBudget - messageTokens : (stryCov_9fa48("366"), currentBudget + messageTokens)) > safeBudget)) && (stryMutAct_9fa48("369") ? selected.length <= 0 : stryMutAct_9fa48("368") ? selected.length >= 0 : stryMutAct_9fa48("367") ? true : (stryCov_9fa48("367", "368", "369"), selected.length > 0)))) {
          if (stryMutAct_9fa48("370")) {
            {}
          } else {
            stryCov_9fa48("370");
            break;
          }
        }
        selected.push(message);
        stryMutAct_9fa48("371") ? currentBudget -= messageTokens : (stryCov_9fa48("371"), currentBudget += messageTokens);
      }
    }
    const ordered = stryMutAct_9fa48("372") ? selected : (stryCov_9fa48("372"), selected.reverse());
    if (stryMutAct_9fa48("374") ? false : stryMutAct_9fa48("373") ? true : (stryCov_9fa48("373", "374"), systemMessage)) {
      if (stryMutAct_9fa48("375")) {
        {}
      } else {
        stryCov_9fa48("375");
        return stryMutAct_9fa48("376") ? [] : (stryCov_9fa48("376"), [systemMessage, ...ordered]);
      }
    }
    return ordered;
  }
}
export class AgentMemoryService {
  constructor(private readonly backend: AgentMemoryBackend = new InMemoryAgentMemoryBackend()) {}
  async store<TValue>(tenantId: string, agentId: string, memoryKey: string, value: TValue, ttlSeconds?: number): Promise<string> {
    if (stryMutAct_9fa48("377")) {
      {}
    } else {
      stryCov_9fa48("377");
      const namespacedKey = buildNamespacedKey(tenantId, agentId, memoryKey);
      await this.backend.set(namespacedKey, JSON.stringify(value), ttlSeconds);
      return namespacedKey;
    }
  }
  async get<TValue>(tenantId: string, agentId: string, memoryKey: string): Promise<TValue | null> {
    if (stryMutAct_9fa48("378")) {
      {}
    } else {
      stryCov_9fa48("378");
      const namespacedKey = buildNamespacedKey(tenantId, agentId, memoryKey);
      const value = await this.backend.get(namespacedKey);
      return value ? JSON.parse(value) as TValue : null;
    }
  }
  async delete(tenantId: string, agentId: string, memoryKey: string): Promise<number> {
    if (stryMutAct_9fa48("379")) {
      {}
    } else {
      stryCov_9fa48("379");
      const namespacedKey = buildNamespacedKey(tenantId, agentId, memoryKey);
      return this.backend.del(namespacedKey);
    }
  }
  async listByAgent(tenantId: string, agentId: string): Promise<string[]> {
    if (stryMutAct_9fa48("380")) {
      {}
    } else {
      stryCov_9fa48("380");
      return this.backend.keys(stryMutAct_9fa48("381") ? `` : (stryCov_9fa48("381"), `${tenantId}:${agentId}:*`));
    }
  }
  async clearByAgent(tenantId: string, agentId: string): Promise<number> {
    if (stryMutAct_9fa48("382")) {
      {}
    } else {
      stryCov_9fa48("382");
      const keys = await this.listByAgent(tenantId, agentId);
      const deletedCounts = await Promise.all(keys.map(stryMutAct_9fa48("383") ? () => undefined : (stryCov_9fa48("383"), key => this.backend.del(key))));
      return deletedCounts.reduce(stryMutAct_9fa48("384") ? () => undefined : (stryCov_9fa48("384"), (total, count) => stryMutAct_9fa48("385") ? total - count : (stryCov_9fa48("385"), total + count)), 0);
    }
  }
  async clearBySession(tenantId: string, agentId: string, sessionId: string): Promise<number> {
    if (stryMutAct_9fa48("386")) {
      {}
    } else {
      stryCov_9fa48("386");
      const keys = await this.backend.keys(stryMutAct_9fa48("387") ? `` : (stryCov_9fa48("387"), `${tenantId}:${agentId}:conversation:${sessionId}*`));
      const deletedCounts = await Promise.all(keys.map(stryMutAct_9fa48("388") ? () => undefined : (stryCov_9fa48("388"), key => this.backend.del(key))));
      return deletedCounts.reduce(stryMutAct_9fa48("389") ? () => undefined : (stryCov_9fa48("389"), (total, count) => stryMutAct_9fa48("390") ? total - count : (stryCov_9fa48("390"), total + count)), 0);
    }
  }
  async clearByTenant(tenantId: string): Promise<number> {
    if (stryMutAct_9fa48("391")) {
      {}
    } else {
      stryCov_9fa48("391");
      const keys = await this.backend.keys(stryMutAct_9fa48("392") ? `` : (stryCov_9fa48("392"), `${tenantId}:*`));
      const deletedCounts = await Promise.all(keys.map(stryMutAct_9fa48("393") ? () => undefined : (stryCov_9fa48("393"), key => this.backend.del(key))));
      return deletedCounts.reduce(stryMutAct_9fa48("394") ? () => undefined : (stryCov_9fa48("394"), (total, count) => stryMutAct_9fa48("395") ? total - count : (stryCov_9fa48("395"), total + count)), 0);
    }
  }
  async publishSharedLearning(tenantId: string, record: AgentLearningRecord, ttlSeconds?: number): Promise<string> {
    if (stryMutAct_9fa48("396")) {
      {}
    } else {
      stryCov_9fa48("396");
      const key = buildSharedLearningKey(tenantId, stryMutAct_9fa48("397") ? `` : (stryCov_9fa48("397"), `${record.id}:${record.sourceAgentId}`));
      await this.backend.set(key, JSON.stringify(record), ttlSeconds);
      return key;
    }
  }
  async getSharedLearning(tenantId: string, recordKey: string): Promise<AgentLearningRecord | null> {
    if (stryMutAct_9fa48("398")) {
      {}
    } else {
      stryCov_9fa48("398");
      const value = await this.backend.get(buildSharedLearningKey(tenantId, recordKey));
      return value ? JSON.parse(value) as AgentLearningRecord : null;
    }
  }
  async listSharedLearning(tenantId: string): Promise<AgentLearningRecord[]> {
    if (stryMutAct_9fa48("399")) {
      {}
    } else {
      stryCov_9fa48("399");
      const keys = await this.backend.keys(buildSharedLearningKey(tenantId, stryMutAct_9fa48("400") ? "" : (stryCov_9fa48("400"), "*")));
      const values = await Promise.all(keys.map(stryMutAct_9fa48("401") ? () => undefined : (stryCov_9fa48("401"), key => this.backend.get(key))));
      return stryMutAct_9fa48("403") ? values.map(value => JSON.parse(value) as AgentLearningRecord).sort((left, right) => right.createdAt.localeCompare(left.createdAt)) : stryMutAct_9fa48("402") ? values.filter((value): value is string => value !== null).map(value => JSON.parse(value) as AgentLearningRecord) : (stryCov_9fa48("402", "403"), values.filter(stryMutAct_9fa48("404") ? () => undefined : (stryCov_9fa48("404"), (value): value is string => stryMutAct_9fa48("407") ? value === null : stryMutAct_9fa48("406") ? false : stryMutAct_9fa48("405") ? true : (stryCov_9fa48("405", "406", "407"), value !== null))).map(stryMutAct_9fa48("408") ? () => undefined : (stryCov_9fa48("408"), value => JSON.parse(value) as AgentLearningRecord)).sort(stryMutAct_9fa48("409") ? () => undefined : (stryCov_9fa48("409"), (left, right) => right.createdAt.localeCompare(left.createdAt))));
    }
  }
  async querySharedLearning(tenantId: string, input: {
    approvedOnly?: boolean;
    keywords?: string[];
    minimumConfidence?: number;
  } = {}): Promise<AgentLearningRecord[]> {
    if (stryMutAct_9fa48("410")) {
      {}
    } else {
      stryCov_9fa48("410");
      const normalizedKeywords = new Set((stryMutAct_9fa48("411") ? input.keywords && [] : (stryCov_9fa48("411"), input.keywords ?? (stryMutAct_9fa48("412") ? ["Stryker was here"] : (stryCov_9fa48("412"), [])))).map(stryMutAct_9fa48("413") ? () => undefined : (stryCov_9fa48("413"), keyword => stryMutAct_9fa48("415") ? keyword.toLowerCase() : stryMutAct_9fa48("414") ? keyword.trim().toUpperCase() : (stryCov_9fa48("414", "415"), keyword.trim().toLowerCase()))));
      const minimumConfidence = stryMutAct_9fa48("416") ? input.minimumConfidence && 0 : (stryCov_9fa48("416"), input.minimumConfidence ?? 0);
      const records = await this.listSharedLearning(tenantId);
      return stryMutAct_9fa48("417") ? records : (stryCov_9fa48("417"), records.filter(record => {
        if (stryMutAct_9fa48("418")) {
          {}
        } else {
          stryCov_9fa48("418");
          if (stryMutAct_9fa48("421") ? (input.approvedOnly ?? false) || !record.approved : stryMutAct_9fa48("420") ? false : stryMutAct_9fa48("419") ? true : (stryCov_9fa48("419", "420", "421"), (stryMutAct_9fa48("422") ? input.approvedOnly && false : (stryCov_9fa48("422"), input.approvedOnly ?? (stryMutAct_9fa48("423") ? true : (stryCov_9fa48("423"), false)))) && (stryMutAct_9fa48("424") ? record.approved : (stryCov_9fa48("424"), !record.approved)))) {
            if (stryMutAct_9fa48("425")) {
              {}
            } else {
              stryCov_9fa48("425");
              return stryMutAct_9fa48("426") ? true : (stryCov_9fa48("426"), false);
            }
          }
          if (stryMutAct_9fa48("430") ? record.confidence >= minimumConfidence : stryMutAct_9fa48("429") ? record.confidence <= minimumConfidence : stryMutAct_9fa48("428") ? false : stryMutAct_9fa48("427") ? true : (stryCov_9fa48("427", "428", "429", "430"), record.confidence < minimumConfidence)) {
            if (stryMutAct_9fa48("431")) {
              {}
            } else {
              stryCov_9fa48("431");
              return stryMutAct_9fa48("432") ? true : (stryCov_9fa48("432"), false);
            }
          }
          if (stryMutAct_9fa48("435") ? normalizedKeywords.size !== 0 : stryMutAct_9fa48("434") ? false : stryMutAct_9fa48("433") ? true : (stryCov_9fa48("433", "434", "435"), normalizedKeywords.size === 0)) {
            if (stryMutAct_9fa48("436")) {
              {}
            } else {
              stryCov_9fa48("436");
              return stryMutAct_9fa48("437") ? false : (stryCov_9fa48("437"), true);
            }
          }
          return stryMutAct_9fa48("438") ? record.keywords.every(keyword => normalizedKeywords.has(keyword.trim().toLowerCase())) : (stryCov_9fa48("438"), record.keywords.some(stryMutAct_9fa48("439") ? () => undefined : (stryCov_9fa48("439"), keyword => normalizedKeywords.has(stryMutAct_9fa48("441") ? keyword.toLowerCase() : stryMutAct_9fa48("440") ? keyword.trim().toUpperCase() : (stryCov_9fa48("440", "441"), keyword.trim().toLowerCase())))));
        }
      }));
    }
  }
  async upsertConversationContext(tenantId: string, agentId: string, context: ConversationContext, options?: {
    tokenBudget?: number;
    ttlSeconds?: number;
  }): Promise<ConversationContext> {
    if (stryMutAct_9fa48("442")) {
      {}
    } else {
      stryCov_9fa48("442");
      const normalizedContext: ConversationContext = stryMutAct_9fa48("443") ? {} : (stryCov_9fa48("443"), {
        ...context,
        messages: compressConversationMessages(context.messages, stryMutAct_9fa48("444") ? options?.tokenBudget && DEFAULT_TOKEN_BUDGET : (stryCov_9fa48("444"), (stryMutAct_9fa48("445") ? options.tokenBudget : (stryCov_9fa48("445"), options?.tokenBudget)) ?? DEFAULT_TOKEN_BUDGET)),
        updatedAt: new Date().toISOString()
      });
      await this.store(tenantId, agentId, stryMutAct_9fa48("446") ? `` : (stryCov_9fa48("446"), `conversation:${context.sessionId}`), normalizedContext, stryMutAct_9fa48("447") ? options.ttlSeconds : (stryCov_9fa48("447"), options?.ttlSeconds));
      return normalizedContext;
    }
  }
  async getConversationContext(tenantId: string, agentId: string, sessionId: string): Promise<ConversationContext | null> {
    if (stryMutAct_9fa48("448")) {
      {}
    } else {
      stryCov_9fa48("448");
      return this.get<ConversationContext>(tenantId, agentId, stryMutAct_9fa48("449") ? `` : (stryCov_9fa48("449"), `conversation:${sessionId}`));
    }
  }
  async appendConversationMessage(tenantId: string, agentId: string, sessionId: string, message: Omit<ConversationMessage, "createdAt"> & {
    createdAt?: string;
  }, options?: {
    metadata?: Record<string, unknown>;
    tokenBudget?: number;
    ttlSeconds?: number;
  }): Promise<ConversationContext> {
    if (stryMutAct_9fa48("450")) {
      {}
    } else {
      stryCov_9fa48("450");
      const currentContext = stryMutAct_9fa48("451") ? (await this.getConversationContext(tenantId, agentId, sessionId)) && {
        sessionId,
        messages: [],
        metadata: options?.metadata ?? {},
        updatedAt: new Date().toISOString()
      } : (stryCov_9fa48("451"), (await this.getConversationContext(tenantId, agentId, sessionId)) ?? (stryMutAct_9fa48("452") ? {} : (stryCov_9fa48("452"), {
        sessionId,
        messages: stryMutAct_9fa48("453") ? ["Stryker was here"] : (stryCov_9fa48("453"), []),
        metadata: stryMutAct_9fa48("454") ? options?.metadata && {} : (stryCov_9fa48("454"), (stryMutAct_9fa48("455") ? options.metadata : (stryCov_9fa48("455"), options?.metadata)) ?? {}),
        updatedAt: new Date().toISOString()
      })));
      const nextContext: ConversationContext = stryMutAct_9fa48("456") ? {} : (stryCov_9fa48("456"), {
        ...currentContext,
        metadata: stryMutAct_9fa48("457") ? options?.metadata && currentContext.metadata : (stryCov_9fa48("457"), (stryMutAct_9fa48("458") ? options.metadata : (stryCov_9fa48("458"), options?.metadata)) ?? currentContext.metadata),
        messages: stryMutAct_9fa48("459") ? [] : (stryCov_9fa48("459"), [...currentContext.messages, stryMutAct_9fa48("460") ? {} : (stryCov_9fa48("460"), {
          content: message.content,
          createdAt: stryMutAct_9fa48("461") ? message.createdAt && new Date().toISOString() : (stryCov_9fa48("461"), message.createdAt ?? new Date().toISOString()),
          role: message.role
        })]),
        updatedAt: new Date().toISOString()
      });
      return this.upsertConversationContext(tenantId, agentId, nextContext, options);
    }
  }
}