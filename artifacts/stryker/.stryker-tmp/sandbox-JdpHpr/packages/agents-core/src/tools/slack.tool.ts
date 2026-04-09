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
export type SlackMode = "webhook" | "api";
export interface SlackMessageInput {
  channel: string;
  mode: SlackMode;
  text: string;
  token?: string;
  webhookUrl?: string;
}
export interface SlackMessageResult {
  mode: SlackMode;
  ok: boolean;
  ts: string;
}
const SLACK_REQUEST_TIMEOUT_MS = 10_000;
async function postWithTimeout(url: string, init: RequestInit): Promise<Response> {
  if (stryMutAct_9fa48("1609")) {
    {}
  } else {
    stryCov_9fa48("1609");
    return fetch(url, stryMutAct_9fa48("1610") ? {} : (stryCov_9fa48("1610"), {
      ...init,
      signal: AbortSignal.timeout(SLACK_REQUEST_TIMEOUT_MS)
    }));
  }
}
export async function postSlackMessage(input: SlackMessageInput, options?: {
  simulate?: boolean;
}): Promise<SlackMessageResult> {
  if (stryMutAct_9fa48("1611")) {
    {}
  } else {
    stryCov_9fa48("1611");
    if (stryMutAct_9fa48("1614") ? options?.simulate && true : stryMutAct_9fa48("1613") ? false : stryMutAct_9fa48("1612") ? true : (stryCov_9fa48("1612", "1613", "1614"), (stryMutAct_9fa48("1615") ? options.simulate : (stryCov_9fa48("1615"), options?.simulate)) ?? (stryMutAct_9fa48("1616") ? false : (stryCov_9fa48("1616"), true)))) {
      if (stryMutAct_9fa48("1617")) {
        {}
      } else {
        stryCov_9fa48("1617");
        return stryMutAct_9fa48("1618") ? {} : (stryCov_9fa48("1618"), {
          mode: input.mode,
          ok: stryMutAct_9fa48("1619") ? false : (stryCov_9fa48("1619"), true),
          ts: new Date().toISOString()
        });
      }
    }
    if (stryMutAct_9fa48("1622") ? input.mode !== "webhook" : stryMutAct_9fa48("1621") ? false : stryMutAct_9fa48("1620") ? true : (stryCov_9fa48("1620", "1621", "1622"), input.mode === (stryMutAct_9fa48("1623") ? "" : (stryCov_9fa48("1623"), "webhook")))) {
      if (stryMutAct_9fa48("1624")) {
        {}
      } else {
        stryCov_9fa48("1624");
        if (stryMutAct_9fa48("1627") ? false : stryMutAct_9fa48("1626") ? true : stryMutAct_9fa48("1625") ? input.webhookUrl : (stryCov_9fa48("1625", "1626", "1627"), !input.webhookUrl)) {
          if (stryMutAct_9fa48("1628")) {
            {}
          } else {
            stryCov_9fa48("1628");
            throw new Error(stryMutAct_9fa48("1629") ? "" : (stryCov_9fa48("1629"), "webhookUrl is required for Slack webhook mode."));
          }
        }
        const response = await postWithTimeout(input.webhookUrl, stryMutAct_9fa48("1630") ? {} : (stryCov_9fa48("1630"), {
          body: JSON.stringify(stryMutAct_9fa48("1631") ? {} : (stryCov_9fa48("1631"), {
            channel: input.channel,
            text: input.text
          })),
          headers: stryMutAct_9fa48("1632") ? {} : (stryCov_9fa48("1632"), {
            "content-type": stryMutAct_9fa48("1633") ? "" : (stryCov_9fa48("1633"), "application/json")
          }),
          method: stryMutAct_9fa48("1634") ? "" : (stryCov_9fa48("1634"), "POST")
        }));
        if (stryMutAct_9fa48("1637") ? false : stryMutAct_9fa48("1636") ? true : stryMutAct_9fa48("1635") ? response.ok : (stryCov_9fa48("1635", "1636", "1637"), !response.ok)) {
          if (stryMutAct_9fa48("1638")) {
            {}
          } else {
            stryCov_9fa48("1638");
            throw new Error(stryMutAct_9fa48("1639") ? `` : (stryCov_9fa48("1639"), `Slack webhook failed with status ${response.status}.`));
          }
        }
        return stryMutAct_9fa48("1640") ? {} : (stryCov_9fa48("1640"), {
          mode: input.mode,
          ok: stryMutAct_9fa48("1641") ? false : (stryCov_9fa48("1641"), true),
          ts: new Date().toISOString()
        });
      }
    }
    if (stryMutAct_9fa48("1644") ? false : stryMutAct_9fa48("1643") ? true : stryMutAct_9fa48("1642") ? input.token : (stryCov_9fa48("1642", "1643", "1644"), !input.token)) {
      if (stryMutAct_9fa48("1645")) {
        {}
      } else {
        stryCov_9fa48("1645");
        throw new Error(stryMutAct_9fa48("1646") ? "" : (stryCov_9fa48("1646"), "token is required for Slack API mode."));
      }
    }
    const response = await postWithTimeout(stryMutAct_9fa48("1647") ? "" : (stryCov_9fa48("1647"), "https://slack.com/api/chat.postMessage"), stryMutAct_9fa48("1648") ? {} : (stryCov_9fa48("1648"), {
      body: JSON.stringify(stryMutAct_9fa48("1649") ? {} : (stryCov_9fa48("1649"), {
        channel: input.channel,
        text: input.text
      })),
      headers: stryMutAct_9fa48("1650") ? {} : (stryCov_9fa48("1650"), {
        authorization: stryMutAct_9fa48("1651") ? `` : (stryCov_9fa48("1651"), `Bearer ${input.token}`),
        "content-type": stryMutAct_9fa48("1652") ? "" : (stryCov_9fa48("1652"), "application/json")
      }),
      method: stryMutAct_9fa48("1653") ? "" : (stryCov_9fa48("1653"), "POST")
    }));
    if (stryMutAct_9fa48("1656") ? false : stryMutAct_9fa48("1655") ? true : stryMutAct_9fa48("1654") ? response.ok : (stryCov_9fa48("1654", "1655", "1656"), !response.ok)) {
      if (stryMutAct_9fa48("1657")) {
        {}
      } else {
        stryCov_9fa48("1657");
        throw new Error(stryMutAct_9fa48("1658") ? `` : (stryCov_9fa48("1658"), `Slack API failed with status ${response.status}.`));
      }
    }
    return stryMutAct_9fa48("1659") ? {} : (stryCov_9fa48("1659"), {
      mode: input.mode,
      ok: stryMutAct_9fa48("1660") ? false : (stryCov_9fa48("1660"), true),
      ts: new Date().toISOString()
    });
  }
}