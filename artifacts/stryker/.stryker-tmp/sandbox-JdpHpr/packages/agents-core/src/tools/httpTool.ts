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
import { isIP } from "node:net";
import { z } from "zod";
import { BaseTool, type BaseToolOptions, type ToolExecutionContext } from "./baseTool.js";
const httpInputSchema = z.object(stryMutAct_9fa48("1367") ? {} : (stryCov_9fa48("1367"), {
  body: z.unknown().optional(),
  headers: z.record(z.string(), z.string()).default({}),
  method: z.enum(stryMutAct_9fa48("1368") ? [] : (stryCov_9fa48("1368"), [stryMutAct_9fa48("1369") ? "" : (stryCov_9fa48("1369"), "DELETE"), stryMutAct_9fa48("1370") ? "" : (stryCov_9fa48("1370"), "GET"), stryMutAct_9fa48("1371") ? "" : (stryCov_9fa48("1371"), "PATCH"), stryMutAct_9fa48("1372") ? "" : (stryCov_9fa48("1372"), "POST"), stryMutAct_9fa48("1373") ? "" : (stryCov_9fa48("1373"), "PUT")])).default(stryMutAct_9fa48("1374") ? "" : (stryCov_9fa48("1374"), "GET")),
  query: z.record(z.string(), z.string()).default({}),
  retries: stryMutAct_9fa48("1376") ? z.number().int().max(0).max(5).default(2) : stryMutAct_9fa48("1375") ? z.number().int().min(0).min(5).default(2) : (stryCov_9fa48("1375", "1376"), z.number().int().min(0).max(5).default(2)),
  timeoutMs: stryMutAct_9fa48("1377") ? z.number().int().positive().min(120_000).optional() : (stryCov_9fa48("1377"), z.number().int().positive().max(120_000).optional()),
  url: z.string().url()
})).strict();
const httpOutputSchema = z.object(stryMutAct_9fa48("1378") ? {} : (stryCov_9fa48("1378"), {
  attempt: z.number().int().positive(),
  body: z.unknown(),
  headers: z.record(z.string(), z.string()),
  status: z.number().int()
})).strict();
export type HttpToolInput = z.infer<typeof httpInputSchema>;
export type HttpToolOutput = z.infer<typeof httpOutputSchema>;
export interface HttpToolOptions extends BaseToolOptions {
  allowlistByTenant?: Record<string, string[]>;
  fetchImpl?: typeof fetch;
}
function sleep(milliseconds: number): Promise<void> {
  if (stryMutAct_9fa48("1379")) {
    {}
  } else {
    stryCov_9fa48("1379");
    return new Promise(stryMutAct_9fa48("1380") ? () => undefined : (stryCov_9fa48("1380"), resolve => setTimeout(resolve, milliseconds)));
  }
}
function isPrivateIpAddress(hostname: string): boolean {
  if (stryMutAct_9fa48("1381")) {
    {}
  } else {
    stryCov_9fa48("1381");
    if (stryMutAct_9fa48("1384") ? isIP(hostname) !== 0 : stryMutAct_9fa48("1383") ? false : stryMutAct_9fa48("1382") ? true : (stryCov_9fa48("1382", "1383", "1384"), isIP(hostname) === 0)) {
      if (stryMutAct_9fa48("1385")) {
        {}
      } else {
        stryCov_9fa48("1385");
        return stryMutAct_9fa48("1386") ? true : (stryCov_9fa48("1386"), false);
      }
    }
    return stryMutAct_9fa48("1389") ? (hostname === "0.0.0.0" || hostname === "::1" || hostname.startsWith("10.") || hostname.startsWith("127.") || hostname.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname) || hostname.startsWith("fc")) && hostname.startsWith("fd") : stryMutAct_9fa48("1388") ? false : stryMutAct_9fa48("1387") ? true : (stryCov_9fa48("1387", "1388", "1389"), (stryMutAct_9fa48("1391") ? (hostname === "0.0.0.0" || hostname === "::1" || hostname.startsWith("10.") || hostname.startsWith("127.") || hostname.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)) && hostname.startsWith("fc") : stryMutAct_9fa48("1390") ? false : (stryCov_9fa48("1390", "1391"), (stryMutAct_9fa48("1393") ? (hostname === "0.0.0.0" || hostname === "::1" || hostname.startsWith("10.") || hostname.startsWith("127.") || hostname.startsWith("192.168.")) && /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname) : stryMutAct_9fa48("1392") ? false : (stryCov_9fa48("1392", "1393"), (stryMutAct_9fa48("1395") ? (hostname === "0.0.0.0" || hostname === "::1" || hostname.startsWith("10.") || hostname.startsWith("127.")) && hostname.startsWith("192.168.") : stryMutAct_9fa48("1394") ? false : (stryCov_9fa48("1394", "1395"), (stryMutAct_9fa48("1397") ? (hostname === "0.0.0.0" || hostname === "::1" || hostname.startsWith("10.")) && hostname.startsWith("127.") : stryMutAct_9fa48("1396") ? false : (stryCov_9fa48("1396", "1397"), (stryMutAct_9fa48("1399") ? (hostname === "0.0.0.0" || hostname === "::1") && hostname.startsWith("10.") : stryMutAct_9fa48("1398") ? false : (stryCov_9fa48("1398", "1399"), (stryMutAct_9fa48("1401") ? hostname === "0.0.0.0" && hostname === "::1" : stryMutAct_9fa48("1400") ? false : (stryCov_9fa48("1400", "1401"), (stryMutAct_9fa48("1403") ? hostname !== "0.0.0.0" : stryMutAct_9fa48("1402") ? false : (stryCov_9fa48("1402", "1403"), hostname === (stryMutAct_9fa48("1404") ? "" : (stryCov_9fa48("1404"), "0.0.0.0")))) || (stryMutAct_9fa48("1406") ? hostname !== "::1" : stryMutAct_9fa48("1405") ? false : (stryCov_9fa48("1405", "1406"), hostname === (stryMutAct_9fa48("1407") ? "" : (stryCov_9fa48("1407"), "::1")))))) || (stryMutAct_9fa48("1408") ? hostname.endsWith("10.") : (stryCov_9fa48("1408"), hostname.startsWith(stryMutAct_9fa48("1409") ? "" : (stryCov_9fa48("1409"), "10.")))))) || (stryMutAct_9fa48("1410") ? hostname.endsWith("127.") : (stryCov_9fa48("1410"), hostname.startsWith(stryMutAct_9fa48("1411") ? "" : (stryCov_9fa48("1411"), "127.")))))) || (stryMutAct_9fa48("1412") ? hostname.endsWith("192.168.") : (stryCov_9fa48("1412"), hostname.startsWith(stryMutAct_9fa48("1413") ? "" : (stryCov_9fa48("1413"), "192.168.")))))) || (stryMutAct_9fa48("1417") ? /^172\.(1[6-9]|2\d|3[^0-1])\./ : stryMutAct_9fa48("1416") ? /^172\.(1[6-9]|2\D|3[0-1])\./ : stryMutAct_9fa48("1415") ? /^172\.(1[^6-9]|2\d|3[0-1])\./ : stryMutAct_9fa48("1414") ? /172\.(1[6-9]|2\d|3[0-1])\./ : (stryCov_9fa48("1414", "1415", "1416", "1417"), /^172\.(1[6-9]|2\d|3[0-1])\./)).test(hostname))) || (stryMutAct_9fa48("1418") ? hostname.endsWith("fc") : (stryCov_9fa48("1418"), hostname.startsWith(stryMutAct_9fa48("1419") ? "" : (stryCov_9fa48("1419"), "fc")))))) || (stryMutAct_9fa48("1420") ? hostname.endsWith("fd") : (stryCov_9fa48("1420"), hostname.startsWith(stryMutAct_9fa48("1421") ? "" : (stryCov_9fa48("1421"), "fd")))));
  }
}
function isBlockedHost(hostname: string): boolean {
  if (stryMutAct_9fa48("1422")) {
    {}
  } else {
    stryCov_9fa48("1422");
    const normalized = stryMutAct_9fa48("1423") ? hostname.toUpperCase() : (stryCov_9fa48("1423"), hostname.toLowerCase());
    return stryMutAct_9fa48("1426") ? (normalized === "localhost" || normalized.endsWith(".localhost") || normalized.endsWith(".local") || normalized === "0.0.0.0" || normalized === "127.0.0.1" || normalized === "::1") && isPrivateIpAddress(normalized) : stryMutAct_9fa48("1425") ? false : stryMutAct_9fa48("1424") ? true : (stryCov_9fa48("1424", "1425", "1426"), (stryMutAct_9fa48("1428") ? (normalized === "localhost" || normalized.endsWith(".localhost") || normalized.endsWith(".local") || normalized === "0.0.0.0" || normalized === "127.0.0.1") && normalized === "::1" : stryMutAct_9fa48("1427") ? false : (stryCov_9fa48("1427", "1428"), (stryMutAct_9fa48("1430") ? (normalized === "localhost" || normalized.endsWith(".localhost") || normalized.endsWith(".local") || normalized === "0.0.0.0") && normalized === "127.0.0.1" : stryMutAct_9fa48("1429") ? false : (stryCov_9fa48("1429", "1430"), (stryMutAct_9fa48("1432") ? (normalized === "localhost" || normalized.endsWith(".localhost") || normalized.endsWith(".local")) && normalized === "0.0.0.0" : stryMutAct_9fa48("1431") ? false : (stryCov_9fa48("1431", "1432"), (stryMutAct_9fa48("1434") ? (normalized === "localhost" || normalized.endsWith(".localhost")) && normalized.endsWith(".local") : stryMutAct_9fa48("1433") ? false : (stryCov_9fa48("1433", "1434"), (stryMutAct_9fa48("1436") ? normalized === "localhost" && normalized.endsWith(".localhost") : stryMutAct_9fa48("1435") ? false : (stryCov_9fa48("1435", "1436"), (stryMutAct_9fa48("1438") ? normalized !== "localhost" : stryMutAct_9fa48("1437") ? false : (stryCov_9fa48("1437", "1438"), normalized === (stryMutAct_9fa48("1439") ? "" : (stryCov_9fa48("1439"), "localhost")))) || (stryMutAct_9fa48("1440") ? normalized.startsWith(".localhost") : (stryCov_9fa48("1440"), normalized.endsWith(stryMutAct_9fa48("1441") ? "" : (stryCov_9fa48("1441"), ".localhost")))))) || (stryMutAct_9fa48("1442") ? normalized.startsWith(".local") : (stryCov_9fa48("1442"), normalized.endsWith(stryMutAct_9fa48("1443") ? "" : (stryCov_9fa48("1443"), ".local")))))) || (stryMutAct_9fa48("1445") ? normalized !== "0.0.0.0" : stryMutAct_9fa48("1444") ? false : (stryCov_9fa48("1444", "1445"), normalized === (stryMutAct_9fa48("1446") ? "" : (stryCov_9fa48("1446"), "0.0.0.0")))))) || (stryMutAct_9fa48("1448") ? normalized !== "127.0.0.1" : stryMutAct_9fa48("1447") ? false : (stryCov_9fa48("1447", "1448"), normalized === (stryMutAct_9fa48("1449") ? "" : (stryCov_9fa48("1449"), "127.0.0.1")))))) || (stryMutAct_9fa48("1451") ? normalized !== "::1" : stryMutAct_9fa48("1450") ? false : (stryCov_9fa48("1450", "1451"), normalized === (stryMutAct_9fa48("1452") ? "" : (stryCov_9fa48("1452"), "::1")))))) || isPrivateIpAddress(normalized));
  }
}
function hostAllowed(hostname: string, allowlist: readonly string[]): boolean {
  if (stryMutAct_9fa48("1453")) {
    {}
  } else {
    stryCov_9fa48("1453");
    if (stryMutAct_9fa48("1456") ? allowlist.length !== 0 : stryMutAct_9fa48("1455") ? false : stryMutAct_9fa48("1454") ? true : (stryCov_9fa48("1454", "1455", "1456"), allowlist.length === 0)) {
      if (stryMutAct_9fa48("1457")) {
        {}
      } else {
        stryCov_9fa48("1457");
        return stryMutAct_9fa48("1458") ? false : (stryCov_9fa48("1458"), true);
      }
    }
    const normalized = stryMutAct_9fa48("1459") ? hostname.toUpperCase() : (stryCov_9fa48("1459"), hostname.toLowerCase());
    return stryMutAct_9fa48("1460") ? allowlist.every(domain => {
      const normalizedDomain = domain.toLowerCase();
      return normalized === normalizedDomain || normalized.endsWith(`.${normalizedDomain}`);
    }) : (stryCov_9fa48("1460"), allowlist.some(domain => {
      if (stryMutAct_9fa48("1461")) {
        {}
      } else {
        stryCov_9fa48("1461");
        const normalizedDomain = stryMutAct_9fa48("1462") ? domain.toUpperCase() : (stryCov_9fa48("1462"), domain.toLowerCase());
        return stryMutAct_9fa48("1465") ? normalized === normalizedDomain && normalized.endsWith(`.${normalizedDomain}`) : stryMutAct_9fa48("1464") ? false : stryMutAct_9fa48("1463") ? true : (stryCov_9fa48("1463", "1464", "1465"), (stryMutAct_9fa48("1467") ? normalized !== normalizedDomain : stryMutAct_9fa48("1466") ? false : (stryCov_9fa48("1466", "1467"), normalized === normalizedDomain)) || (stryMutAct_9fa48("1468") ? normalized.startsWith(`.${normalizedDomain}`) : (stryCov_9fa48("1468"), normalized.endsWith(stryMutAct_9fa48("1469") ? `` : (stryCov_9fa48("1469"), `.${normalizedDomain}`)))));
      }
    }));
  }
}
export class HttpTool extends BaseTool<HttpToolInput, HttpToolOutput> {
  private readonly allowlistByTenant: Record<string, string[]>;
  private readonly fetchImpl: typeof fetch;
  constructor(options: HttpToolOptions = {}) {
    if (stryMutAct_9fa48("1470")) {
      {}
    } else {
      stryCov_9fa48("1470");
      super(stryMutAct_9fa48("1471") ? {} : (stryCov_9fa48("1471"), {
        description: stryMutAct_9fa48("1472") ? "" : (stryCov_9fa48("1472"), "HTTP request tool with timeout, retries and allowlist enforcement."),
        inputSchema: httpInputSchema,
        name: stryMutAct_9fa48("1473") ? "" : (stryCov_9fa48("1473"), "http"),
        outputSchema: httpOutputSchema,
        timeoutMs: 30_000
      }), options);
      this.allowlistByTenant = stryMutAct_9fa48("1474") ? options.allowlistByTenant && {} : (stryCov_9fa48("1474"), options.allowlistByTenant ?? {});
      this.fetchImpl = stryMutAct_9fa48("1475") ? options.fetchImpl && fetch : (stryCov_9fa48("1475"), options.fetchImpl ?? fetch);
    }
  }
  protected async execute(input: HttpToolInput, context: ToolExecutionContext): Promise<HttpToolOutput> {
    if (stryMutAct_9fa48("1476")) {
      {}
    } else {
      stryCov_9fa48("1476");
      const url = new URL(input.url);
      Object.entries(input.query).forEach(([key, value]) => {
        if (stryMutAct_9fa48("1477")) {
          {}
        } else {
          stryCov_9fa48("1477");
          url.searchParams.set(key, value);
        }
      });
      if (stryMutAct_9fa48("1479") ? false : stryMutAct_9fa48("1478") ? true : (stryCov_9fa48("1478", "1479"), isBlockedHost(url.hostname))) {
        if (stryMutAct_9fa48("1480")) {
          {}
        } else {
          stryCov_9fa48("1480");
          throw new Error(stryMutAct_9fa48("1481") ? `` : (stryCov_9fa48("1481"), `HTTP tool blocked host '${url.hostname}' to prevent SSRF.`));
        }
      }
      const allowlist = stryMutAct_9fa48("1482") ? (context.allowlistedDomains ?? this.allowlistByTenant[context.tenantId]) && [] : (stryCov_9fa48("1482"), (stryMutAct_9fa48("1483") ? context.allowlistedDomains && this.allowlistByTenant[context.tenantId] : (stryCov_9fa48("1483"), context.allowlistedDomains ?? this.allowlistByTenant[context.tenantId])) ?? (stryMutAct_9fa48("1484") ? ["Stryker was here"] : (stryCov_9fa48("1484"), [])));
      if (stryMutAct_9fa48("1487") ? false : stryMutAct_9fa48("1486") ? true : stryMutAct_9fa48("1485") ? hostAllowed(url.hostname, allowlist) : (stryCov_9fa48("1485", "1486", "1487"), !hostAllowed(url.hostname, allowlist))) {
        if (stryMutAct_9fa48("1488")) {
          {}
        } else {
          stryCov_9fa48("1488");
          throw new Error(stryMutAct_9fa48("1489") ? `` : (stryCov_9fa48("1489"), `HTTP tool blocked domain '${url.hostname}' because it is outside tenant allowlist.`));
        }
      }
      const totalAttempts = stryMutAct_9fa48("1490") ? input.retries - 1 : (stryCov_9fa48("1490"), input.retries + 1);
      const requestBody = (stryMutAct_9fa48("1493") ? input.body !== undefined : stryMutAct_9fa48("1492") ? false : stryMutAct_9fa48("1491") ? true : (stryCov_9fa48("1491", "1492", "1493"), input.body === undefined)) ? undefined : (stryMutAct_9fa48("1496") ? typeof input.body !== "string" : stryMutAct_9fa48("1495") ? false : stryMutAct_9fa48("1494") ? true : (stryCov_9fa48("1494", "1495", "1496"), typeof input.body === (stryMutAct_9fa48("1497") ? "" : (stryCov_9fa48("1497"), "string")))) ? input.body : JSON.stringify(input.body);
      for (let attempt = 1; stryMutAct_9fa48("1500") ? attempt > totalAttempts : stryMutAct_9fa48("1499") ? attempt < totalAttempts : stryMutAct_9fa48("1498") ? false : (stryCov_9fa48("1498", "1499", "1500"), attempt <= totalAttempts); stryMutAct_9fa48("1501") ? attempt -= 1 : (stryCov_9fa48("1501"), attempt += 1)) {
        if (stryMutAct_9fa48("1502")) {
          {}
        } else {
          stryCov_9fa48("1502");
          try {
            if (stryMutAct_9fa48("1503")) {
              {}
            } else {
              stryCov_9fa48("1503");
              const requestInit: RequestInit = stryMutAct_9fa48("1504") ? {} : (stryCov_9fa48("1504"), {
                headers: input.headers,
                method: input.method,
                signal: AbortSignal.timeout(stryMutAct_9fa48("1505") ? input.timeoutMs && this.timeoutMs : (stryCov_9fa48("1505"), input.timeoutMs ?? this.timeoutMs))
              });
              if (stryMutAct_9fa48("1508") ? requestBody === undefined : stryMutAct_9fa48("1507") ? false : stryMutAct_9fa48("1506") ? true : (stryCov_9fa48("1506", "1507", "1508"), requestBody !== undefined)) {
                if (stryMutAct_9fa48("1509")) {
                  {}
                } else {
                  stryCov_9fa48("1509");
                  requestInit.body = requestBody;
                }
              }
              const response = await this.fetchImpl(url, stryMutAct_9fa48("1510") ? {} : (stryCov_9fa48("1510"), {
                ...requestInit
              }));
              const contentType = stryMutAct_9fa48("1511") ? response.headers.get("content-type") && "" : (stryCov_9fa48("1511"), response.headers.get(stryMutAct_9fa48("1512") ? "" : (stryCov_9fa48("1512"), "content-type")) ?? (stryMutAct_9fa48("1513") ? "Stryker was here!" : (stryCov_9fa48("1513"), "")));
              const responseBody: unknown = contentType.includes(stryMutAct_9fa48("1514") ? "" : (stryCov_9fa48("1514"), "application/json")) ? await response.json() : await response.text();
              const responseHeaders: Record<string, string> = {};
              response.headers.forEach((value, key) => {
                if (stryMutAct_9fa48("1515")) {
                  {}
                } else {
                  stryCov_9fa48("1515");
                  responseHeaders[key] = value;
                }
              });
              return stryMutAct_9fa48("1516") ? {} : (stryCov_9fa48("1516"), {
                attempt,
                body: responseBody,
                headers: responseHeaders,
                status: response.status
              });
            }
          } catch (error) {
            if (stryMutAct_9fa48("1517")) {
              {}
            } else {
              stryCov_9fa48("1517");
              if (stryMutAct_9fa48("1521") ? attempt < totalAttempts : stryMutAct_9fa48("1520") ? attempt > totalAttempts : stryMutAct_9fa48("1519") ? false : stryMutAct_9fa48("1518") ? true : (stryCov_9fa48("1518", "1519", "1520", "1521"), attempt >= totalAttempts)) {
                if (stryMutAct_9fa48("1522")) {
                  {}
                } else {
                  stryCov_9fa48("1522");
                  throw error;
                }
              }
              const jitter = Math.floor(stryMutAct_9fa48("1523") ? Math.random() / 120 : (stryCov_9fa48("1523"), Math.random() * 120));
              await sleep(stryMutAct_9fa48("1524") ? 200 * attempt - jitter : (stryCov_9fa48("1524"), (stryMutAct_9fa48("1525") ? 200 / attempt : (stryCov_9fa48("1525"), 200 * attempt)) + jitter));
            }
          }
        }
      }
      throw new Error(stryMutAct_9fa48("1526") ? "" : (stryCov_9fa48("1526"), "Unexpected HTTP tool retry flow."));
    }
  }
}