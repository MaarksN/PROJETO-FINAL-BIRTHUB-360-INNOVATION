// @ts-nocheck
// 
import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

import {
  buildCspHeader,
  buildPermissionsPolicy,
  buildSecurityHeaders,
  computeSubresourceIntegrity,
  createRateLimiter,
  hashIpAddress,
  maskIpAddress,
  resolveSecretCandidates,
  sanitizeHtml,
  scanSecrets,
  verifyHmacSignatureWithCandidates
} from "../../index.js";

test("sanitize removes script", () => {
  assert.equal(sanitizeHtml('<p>ok</p><script>alert(1)</script>'), '<p>ok</p>');
});

test("rate limiter blocks overflow", () => {
  const limiter = createRateLimiter(2, 1000);
  assert.equal(limiter("a"), true);
  assert.equal(limiter("a"), true);
  assert.equal(limiter("a"), false);
});

test("secret scanner catches keys", () => {
  assert.throws(() => scanSecrets("token AKIA1234567890ABCDEF"));
});

test("csp builder outputs directives", () => {
  const csp = buildCspHeader({ "default-src": ["'self'"], "img-src": ["'self'", "data:"] });
  assert.match(csp, /default-src/);
});

test("secret scanner passes clean text", () => {
  assert.doesNotThrow(() => scanSecrets("safe content"));
});

test("permissions policy builder outputs directives", () => {
  const header = buildPermissionsPolicy({
    camera: [],
    fullscreen: ["self"]
  });

  assert.match(header, /camera=\(\)/);
  assert.match(header, /fullscreen=\(self\)/);
});

test("security headers include permissions policy", () => {
  const headers = buildSecurityHeaders({
    contentSecurityPolicy: {
      "default-src": ["'self'"]
    }
  });

  assert.ok(headers.some((header) => header.key === "Permissions-Policy"));
  assert.ok(headers.some((header) => header.key === "Content-Security-Policy"));
});

test("subresource integrity hash is deterministic", () => {
  const integrity = computeSubresourceIntegrity("console.log('ok')");

  assert.match(integrity, /^sha384-/);
});

test("ip hashing is stable and masking removes the last octet", () => {
  const hashA = hashIpAddress("203.0.113.20", "salt-1");
  const hashB = hashIpAddress("203.0.113.20", "salt-1");

  assert.equal(hashA, hashB);
  assert.equal(maskIpAddress("203.0.113.20"), "203.0.113.***");
});

test("rotatable signature verification accepts fallback secrets", () => {
  const payload = JSON.stringify({ ok: true });
  const signature = createHmac("sha256", "old-secret").update(payload).digest("hex");
  const candidates = resolveSecretCandidates("new-secret", ["old-secret"]);

  assert.equal(
    verifyHmacSignatureWithCandidates({
      candidates,
      payload,
      signature
    }),
    true
  );
});
