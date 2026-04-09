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
import { jwtVerify, SignJWT } from "jose";
export type AuthUser = {
  id: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
  email?: string | undefined;
};
export type JWTPayload = AuthUser & {
  type: "access" | "refresh";
  jti: string;
};
export type TokenPair = {
  accessToken: string;
  refreshToken: string;
};
export type AuthConfig = {
  jwtSecret: string;
  accessTtlSec: number;
  refreshTtlSec: number;
};
export type AuthService = {
  issueTokens(user: AuthUser): Promise<TokenPair>;
  verifyAccessToken(token: string): Promise<JWTPayload>;
  rotateRefreshToken(refreshToken: string): Promise<TokenPair>;
  requireRole(role: string): (user: AuthUser) => void;
  requirePermission(permission: string): (user: AuthUser) => void;
};
function secret(config: AuthConfig): Uint8Array {
  if (stryMutAct_9fa48("1703")) {
    {}
  } else {
    stryCov_9fa48("1703");
    return new TextEncoder().encode(config.jwtSecret);
  }
}
export function createAuthService(config: AuthConfig): AuthService {
  if (stryMutAct_9fa48("1704")) {
    {}
  } else {
    stryCov_9fa48("1704");
    const refreshStore = new Map<string, JWTPayload>();
    async function sign(payload: JWTPayload, ttlSec: number): Promise<string> {
      if (stryMutAct_9fa48("1705")) {
        {}
      } else {
        stryCov_9fa48("1705");
        return new SignJWT(payload).setProtectedHeader(stryMutAct_9fa48("1706") ? {} : (stryCov_9fa48("1706"), {
          alg: stryMutAct_9fa48("1707") ? "" : (stryCov_9fa48("1707"), "HS256")
        })).setIssuedAt().setExpirationTime(stryMutAct_9fa48("1708") ? `` : (stryCov_9fa48("1708"), `${ttlSec}s`)).setJti(payload.jti).sign(secret(config));
      }
    }
    return stryMutAct_9fa48("1709") ? {} : (stryCov_9fa48("1709"), {
      async issueTokens(user) {
        if (stryMutAct_9fa48("1710")) {
          {}
        } else {
          stryCov_9fa48("1710");
          const base = stryMutAct_9fa48("1711") ? {} : (stryCov_9fa48("1711"), {
            ...user
          });
          const refreshPayload: JWTPayload = stryMutAct_9fa48("1712") ? {} : (stryCov_9fa48("1712"), {
            ...base,
            type: stryMutAct_9fa48("1713") ? "" : (stryCov_9fa48("1713"), "refresh"),
            jti: crypto.randomUUID()
          });
          const accessPayload: JWTPayload = stryMutAct_9fa48("1714") ? {} : (stryCov_9fa48("1714"), {
            ...base,
            type: stryMutAct_9fa48("1715") ? "" : (stryCov_9fa48("1715"), "access"),
            jti: crypto.randomUUID()
          });
          const refreshToken = await sign(refreshPayload, config.refreshTtlSec);
          refreshStore.set(refreshPayload.jti, refreshPayload);
          return stryMutAct_9fa48("1716") ? {} : (stryCov_9fa48("1716"), {
            accessToken: await sign(accessPayload, config.accessTtlSec),
            refreshToken
          });
        }
      },
      async verifyAccessToken(token) {
        if (stryMutAct_9fa48("1717")) {
          {}
        } else {
          stryCov_9fa48("1717");
          const {
            payload
          } = await jwtVerify(token, secret(config));
          if (stryMutAct_9fa48("1720") ? payload.type === "access" : stryMutAct_9fa48("1719") ? false : stryMutAct_9fa48("1718") ? true : (stryCov_9fa48("1718", "1719", "1720"), payload.type !== (stryMutAct_9fa48("1721") ? "" : (stryCov_9fa48("1721"), "access")))) throw new Error(stryMutAct_9fa48("1722") ? "" : (stryCov_9fa48("1722"), "invalid_token_type"));
          return payload as unknown as JWTPayload;
        }
      },
      async rotateRefreshToken(refreshToken) {
        if (stryMutAct_9fa48("1723")) {
          {}
        } else {
          stryCov_9fa48("1723");
          const {
            payload
          } = await jwtVerify(refreshToken, secret(config));
          const refreshPayload = payload as unknown as JWTPayload;
          if (stryMutAct_9fa48("1726") ? refreshPayload.type === "refresh" : stryMutAct_9fa48("1725") ? false : stryMutAct_9fa48("1724") ? true : (stryCov_9fa48("1724", "1725", "1726"), refreshPayload.type !== (stryMutAct_9fa48("1727") ? "" : (stryCov_9fa48("1727"), "refresh")))) throw new Error(stryMutAct_9fa48("1728") ? "" : (stryCov_9fa48("1728"), "invalid_token_type"));
          if (stryMutAct_9fa48("1731") ? false : stryMutAct_9fa48("1730") ? true : stryMutAct_9fa48("1729") ? refreshStore.has(refreshPayload.jti) : (stryCov_9fa48("1729", "1730", "1731"), !refreshStore.has(refreshPayload.jti))) throw new Error(stryMutAct_9fa48("1732") ? "" : (stryCov_9fa48("1732"), "refresh_revoked"));
          refreshStore.delete(refreshPayload.jti);
          const user: AuthUser = stryMutAct_9fa48("1733") ? {} : (stryCov_9fa48("1733"), {
            id: refreshPayload.id,
            tenantId: refreshPayload.tenantId,
            roles: refreshPayload.roles,
            permissions: refreshPayload.permissions,
            ...((stryMutAct_9fa48("1736") ? refreshPayload.email === undefined : stryMutAct_9fa48("1735") ? false : stryMutAct_9fa48("1734") ? true : (stryCov_9fa48("1734", "1735", "1736"), refreshPayload.email !== undefined)) ? stryMutAct_9fa48("1737") ? {} : (stryCov_9fa48("1737"), {
              email: refreshPayload.email
            }) : {})
          });
          return this.issueTokens(user);
        }
      },
      requireRole(role: string) {
        if (stryMutAct_9fa48("1738")) {
          {}
        } else {
          stryCov_9fa48("1738");
          return (user: AuthUser) => {
            if (stryMutAct_9fa48("1739")) {
              {}
            } else {
              stryCov_9fa48("1739");
              if (stryMutAct_9fa48("1742") ? false : stryMutAct_9fa48("1741") ? true : stryMutAct_9fa48("1740") ? user.roles.includes(role) : (stryCov_9fa48("1740", "1741", "1742"), !user.roles.includes(role))) throw new Error(stryMutAct_9fa48("1743") ? "" : (stryCov_9fa48("1743"), "forbidden_role"));
            }
          };
        }
      },
      requirePermission(permission: string) {
        if (stryMutAct_9fa48("1744")) {
          {}
        } else {
          stryCov_9fa48("1744");
          return (user: AuthUser) => {
            if (stryMutAct_9fa48("1745")) {
              {}
            } else {
              stryCov_9fa48("1745");
              if (stryMutAct_9fa48("1748") ? false : stryMutAct_9fa48("1747") ? true : stryMutAct_9fa48("1746") ? user.permissions.includes(permission) : (stryCov_9fa48("1746", "1747", "1748"), !user.permissions.includes(permission))) throw new Error(stryMutAct_9fa48("1749") ? "" : (stryCov_9fa48("1749"), "forbidden_permission"));
            }
          };
        }
      }
    });
  }
}