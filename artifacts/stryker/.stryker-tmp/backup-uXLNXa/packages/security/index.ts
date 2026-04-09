// @ts-nocheck
import {
  createHash,
  createHmac,
  timingSafeEqual
} from "node:crypto";

import DOMPurify from "isomorphic-dompurify";

export type CspDirectives = Record<string, string[]>;
export type PermissionsPolicyDirectives = Record<string, string[]>;

export interface SecurityHeader {
  key: string;
  value: string;
}

export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOWED_TAGS: ["a", "b", "br", "em", "i", "li", "ol", "p", "strong", "ul"]
  });
}

export function createRateLimiter(max: number, windowMs: number) {
  const store = new Map<string, number[]>();

  return (key: string): boolean => {
    const now = Date.now();
    const items = (store.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);
    items.push(now);
    store.set(key, items);
    return items.length <= max;
  };
}

const secretPatterns = [
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bASIA[0-9A-Z]{16}\b/,
  /\bsk_(?:live|test)_[A-Za-z0-9]{20,}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bAIza[0-9A-Za-z\-_]{35}\b/,
  /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9._-]{8,}\.[A-Za-z0-9._-]{8,}\b/,
  /-----BEGIN (?:RSA|EC|OPENSSH|PGP) PRIVATE KEY-----/
];

export function scanSecrets(content: string): void {
  for (const pattern of secretPatterns) {
    if (pattern.test(content)) {
      throw new Error(`secret_pattern_detected:${pattern}`);
    }
  }
}

export function buildCspHeader(directives: CspDirectives): string {
  return Object.entries(directives)
    .filter(([, values]) => values.length > 0)
    .map(([directive, values]) => `${directive} ${values.join(" ")}`)
    .join("; ");
}

export function buildPermissionsPolicy(policy: PermissionsPolicyDirectives): string {
  return Object.entries(policy)
    .map(([directive, allowlist]) => `${directive}=(${allowlist.join(" ")})`)
    .join(", ");
}

export function defaultPermissionsPolicy(): PermissionsPolicyDirectives {
  return {
    accelerometer: [],
    autoplay: ["self"],
    camera: [],
    "display-capture": [],
    fullscreen: ["self"],
    geolocation: [],
    gyroscope: [],
    magnetometer: [],
    microphone: [],
    payment: ["self"],
    usb: []
  };
}

export function buildSecurityHeaders(input: {
  contentSecurityPolicy?: CspDirectives;
  permissionsPolicy?: PermissionsPolicyDirectives;
  reportOnly?: boolean;
} = {}): SecurityHeader[] {
  const headers: SecurityHeader[] = [];

  if (input.contentSecurityPolicy) {
    headers.push({
      key: input.reportOnly ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy",
      value: buildCspHeader(input.contentSecurityPolicy)
    });
  }

  headers.push(
    {
      key: "Permissions-Policy",
      value: buildPermissionsPolicy(input.permissionsPolicy ?? defaultPermissionsPolicy())
    },
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin"
    },
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload"
    },
    {
      key: "X-Content-Type-Options",
      value: "nosniff"
    },
    {
      key: "X-Frame-Options",
      value: "DENY"
    },
    {
      key: "X-Permitted-Cross-Domain-Policies",
      value: "none"
    },
    {
      key: "Cross-Origin-Opener-Policy",
      value: "same-origin"
    },
    {
      key: "Cross-Origin-Resource-Policy",
      value: "same-origin"
    },
    {
      key: "Origin-Agent-Cluster",
      value: "?1"
    }
  );

  return headers;
}

export function computeSubresourceIntegrity(
  payload: Buffer | string,
  algorithm: "sha256" | "sha384" | "sha512" = "sha384"
): string {
  const digest = createHash(algorithm).update(payload).digest("base64");
  return `${algorithm}-${digest}`;
}

function normalizeForwardedIp(value: string): string {
  const forwarded = value.split(",")[0]?.trim() ?? value.trim();
  return forwarded.startsWith("::ffff:") ? forwarded.slice(7) : forwarded;
}

export function normalizeIpAddress(ipAddress: string | null | undefined): string | null {
  if (!ipAddress) {
    return null;
  }

  const normalized = normalizeForwardedIp(ipAddress);
  return normalized.length > 0 ? normalized : null;
}

export function hashIpAddress(ipAddress: string | null | undefined, salt: string): string | null {
  const normalized = normalizeIpAddress(ipAddress);

  if (!normalized) {
    return null;
  }

  return createHmac("sha256", salt).update(normalized).digest("hex");
}

export function maskIpAddress(ipAddress: string | null | undefined): string | null {
  const normalized = normalizeIpAddress(ipAddress);

  if (!normalized) {
    return null;
  }

  if (normalized.includes(":")) {
    const segments = normalized.split(":");
    if (segments.length <= 2) {
      return "****";
    }

    return `${segments.slice(0, 2).join(":")}:****`;
  }

  const octets = normalized.split(".");
  if (octets.length !== 4) {
    return "***";
  }

  return `${octets[0]}.${octets[1]}.${octets[2]}.***`;
}

export function resolveSecretCandidates(
  currentSecret: string,
  fallbacks?: string | string[] | null
): string[] {
  const fallbackValues = Array.isArray(fallbacks)
    ? fallbacks
    : (fallbacks ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

  return [currentSecret, ...fallbackValues].filter(
    (value, index, items) => value.length > 0 && items.indexOf(value) === index
  );
}

function decodeSignature(signature: string, encoding: "base64url" | "hex"): Buffer {
  return Buffer.from(signature, encoding);
}

export function verifyHmacSignatureWithCandidates(input: {
  candidates: string[];
  encoding?: "base64url" | "hex";
  payload: string;
  signature: string;
}): boolean {
  const encoding = input.encoding ?? "hex";
  const actual = decodeSignature(input.signature, encoding);

  return input.candidates.some((candidate) => {
    const expected = createHmac("sha256", candidate).update(input.payload).digest();

    return expected.length === actual.length && timingSafeEqual(expected, actual);
  });
}
