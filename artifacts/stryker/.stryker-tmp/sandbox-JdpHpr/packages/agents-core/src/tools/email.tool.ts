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
import { setTimeout as sleep } from "node:timers/promises";
export type EmailProvider = "smtp" | "sendgrid";
export interface EmailSendInput {
  body: string;
  provider: EmailProvider;
  subject: string;
  tenantId: string;
  to: string;
}
export interface EmailSendResult {
  bounced: boolean;
  messageId: string;
  provider: EmailProvider;
  retries: number;
}
export interface EmailAdapter {
  send(input: EmailSendInput): Promise<{
    bounced: boolean;
    messageId: string;
  }>;
}
class MockSmtpAdapter implements EmailAdapter {
  send(input: EmailSendInput): Promise<{
    bounced: boolean;
    messageId: string;
  }> {
    if (stryMutAct_9fa48("1318")) {
      {}
    } else {
      stryCov_9fa48("1318");
      const bounced = stryMutAct_9fa48("1319") ? input.to.startsWith("@bounce.test") : (stryCov_9fa48("1319"), input.to.endsWith(stryMutAct_9fa48("1320") ? "" : (stryCov_9fa48("1320"), "@bounce.test")));
      return Promise.resolve(stryMutAct_9fa48("1321") ? {} : (stryCov_9fa48("1321"), {
        bounced,
        messageId: stryMutAct_9fa48("1322") ? `` : (stryCov_9fa48("1322"), `smtp_${Date.now()}_${stryMutAct_9fa48("1323") ? Math.random().toString(36) : (stryCov_9fa48("1323"), Math.random().toString(36).slice(2, 7))}`)
      }));
    }
  }
}
class MockSendgridAdapter implements EmailAdapter {
  send(input: EmailSendInput): Promise<{
    bounced: boolean;
    messageId: string;
  }> {
    if (stryMutAct_9fa48("1324")) {
      {}
    } else {
      stryCov_9fa48("1324");
      const bounced = stryMutAct_9fa48("1325") ? input.to.startsWith("@bounce.test") : (stryCov_9fa48("1325"), input.to.endsWith(stryMutAct_9fa48("1326") ? "" : (stryCov_9fa48("1326"), "@bounce.test")));
      return Promise.resolve(stryMutAct_9fa48("1327") ? {} : (stryCov_9fa48("1327"), {
        bounced,
        messageId: stryMutAct_9fa48("1328") ? `` : (stryCov_9fa48("1328"), `sendgrid_${Date.now()}_${stryMutAct_9fa48("1329") ? Math.random().toString(36) : (stryCov_9fa48("1329"), Math.random().toString(36).slice(2, 7))}`)
      }));
    }
  }
}
const defaultAdapters: Record<EmailProvider, EmailAdapter> = stryMutAct_9fa48("1330") ? {} : (stryCov_9fa48("1330"), {
  sendgrid: new MockSendgridAdapter(),
  smtp: new MockSmtpAdapter()
});
function isRateLimitError(error: unknown): boolean {
  if (stryMutAct_9fa48("1331")) {
    {}
  } else {
    stryCov_9fa48("1331");
    if (stryMutAct_9fa48("1334") ? false : stryMutAct_9fa48("1333") ? true : stryMutAct_9fa48("1332") ? error instanceof Error : (stryCov_9fa48("1332", "1333", "1334"), !(error instanceof Error))) {
      if (stryMutAct_9fa48("1335")) {
        {}
      } else {
        stryCov_9fa48("1335");
        return stryMutAct_9fa48("1336") ? true : (stryCov_9fa48("1336"), false);
      }
    }
    return /rate|429|limit/i.test(error.message);
  }
}
export async function sendEmail(input: EmailSendInput, options?: {
  adapters?: Partial<Record<EmailProvider, EmailAdapter>>;
  maxRetries?: number;
}): Promise<EmailSendResult> {
  if (stryMutAct_9fa48("1337")) {
    {}
  } else {
    stryCov_9fa48("1337");
    const adapters = stryMutAct_9fa48("1338") ? {} : (stryCov_9fa48("1338"), {
      ...defaultAdapters,
      ...(stryMutAct_9fa48("1339") ? options?.adapters && {} : (stryCov_9fa48("1339"), (stryMutAct_9fa48("1340") ? options.adapters : (stryCov_9fa48("1340"), options?.adapters)) ?? {}))
    });
    const maxRetries = stryMutAct_9fa48("1341") ? Math.min(options?.maxRetries ?? 2, 0) : (stryCov_9fa48("1341"), Math.max(stryMutAct_9fa48("1342") ? options?.maxRetries && 2 : (stryCov_9fa48("1342"), (stryMutAct_9fa48("1343") ? options.maxRetries : (stryCov_9fa48("1343"), options?.maxRetries)) ?? 2), 0));
    const adapter = adapters[input.provider];
    if (stryMutAct_9fa48("1346") ? false : stryMutAct_9fa48("1345") ? true : stryMutAct_9fa48("1344") ? adapter : (stryCov_9fa48("1344", "1345", "1346"), !adapter)) {
      if (stryMutAct_9fa48("1347")) {
        {}
      } else {
        stryCov_9fa48("1347");
        throw new Error(stryMutAct_9fa48("1348") ? `` : (stryCov_9fa48("1348"), `No email adapter configured for provider '${input.provider}'.`));
      }
    }
    let attempt = 0;
    while (stryMutAct_9fa48("1351") ? attempt > maxRetries : stryMutAct_9fa48("1350") ? attempt < maxRetries : stryMutAct_9fa48("1349") ? false : (stryCov_9fa48("1349", "1350", "1351"), attempt <= maxRetries)) {
      if (stryMutAct_9fa48("1352")) {
        {}
      } else {
        stryCov_9fa48("1352");
        try {
          if (stryMutAct_9fa48("1353")) {
            {}
          } else {
            stryCov_9fa48("1353");
            const result = await adapter.send(input);
            return stryMutAct_9fa48("1354") ? {} : (stryCov_9fa48("1354"), {
              bounced: result.bounced,
              messageId: result.messageId,
              provider: input.provider,
              retries: attempt
            });
          }
        } catch (error) {
          if (stryMutAct_9fa48("1355")) {
            {}
          } else {
            stryCov_9fa48("1355");
            if (stryMutAct_9fa48("1358") ? attempt >= maxRetries && !isRateLimitError(error) : stryMutAct_9fa48("1357") ? false : stryMutAct_9fa48("1356") ? true : (stryCov_9fa48("1356", "1357", "1358"), (stryMutAct_9fa48("1361") ? attempt < maxRetries : stryMutAct_9fa48("1360") ? attempt > maxRetries : stryMutAct_9fa48("1359") ? false : (stryCov_9fa48("1359", "1360", "1361"), attempt >= maxRetries)) || (stryMutAct_9fa48("1362") ? isRateLimitError(error) : (stryCov_9fa48("1362"), !isRateLimitError(error))))) {
              if (stryMutAct_9fa48("1363")) {
                {}
              } else {
                stryCov_9fa48("1363");
                throw error;
              }
            }
            stryMutAct_9fa48("1364") ? attempt -= 1 : (stryCov_9fa48("1364"), attempt += 1);
            await sleep(stryMutAct_9fa48("1365") ? 50 / attempt : (stryCov_9fa48("1365"), 50 * attempt));
          }
        }
      }
    }
    throw new Error(stryMutAct_9fa48("1366") ? "" : (stryCov_9fa48("1366"), "Unexpected email retry state."));
  }
}