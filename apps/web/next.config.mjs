import path from "node:path";
import { fileURLToPath } from "node:url";

import { getWebConfig } from "@birthub/config/nextjs";
import { buildSecurityHeaders } from "@birthub/security";

const webConfig = getWebConfig(process.env);
const immutableAssetCache = "public, max-age=31536000, immutable";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isWindows = process.platform === "win32";
const isDevelopmentLike =
  webConfig.NEXT_PUBLIC_ENVIRONMENT === "development" ||
  webConfig.NEXT_PUBLIC_ENVIRONMENT === "test" ||
  webConfig.NEXT_PUBLIC_ENVIRONMENT === "ci" ||
  webConfig.NEXT_PUBLIC_ENVIRONMENT === "ci-local";
const cspReportOnly = isDevelopmentLike ? webConfig.NEXT_PUBLIC_CSP_REPORT_ONLY : false;
const connectSrc = [
  "'self'",
  webConfig.NEXT_PUBLIC_API_URL,
  "https://*.ingest.sentry.io",
  ...(webConfig.NEXT_PUBLIC_POSTHOG_HOST ? [webConfig.NEXT_PUBLIC_POSTHOG_HOST] : []),
  ...(isDevelopmentLike ? ["ws:", "wss:"] : [])
];
const contentSecurityPolicy = {
  "base-uri": ["'self'"],
  "connect-src": connectSrc,
  "default-src": ["'self'"],
  "font-src": ["'self'", "data:"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
  "frame-src": ["'none'"],
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "manifest-src": ["'self'"],
  "object-src": ["'none'"],
  "script-src": ["'self'", "'unsafe-inline'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "worker-src": ["'self'", "blob:"],
  ...(webConfig.CSP_REPORT_URI ? { "report-uri": [webConfig.CSP_REPORT_URI] } : {})
};
const securityHeaders = buildSecurityHeaders({
  contentSecurityPolicy,
  reportOnly: cspReportOnly
});
const turbopackAliases = {
  "@birthub/config": "@birthub/config/nextjs",
  "@birthub/logger": "@birthub/logger/nextjs",
  "@birthub/workflows-core": "@birthub/workflows-core/nextjs"
};

/** @type {import("next").NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  compress: true,
  crossOrigin: "anonymous",
  experimental: {
    sri: {
      algorithm: "sha384"
    }
  },
  output: isWindows ? undefined : "standalone",
  outputFileTracingRoot: path.join(__dirname, "../.."),
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    resolveAlias: turbopackAliases
  },
  async headers() {
    return [
      {
        headers: [
          {
            key: "Cache-Control",
            value: immutableAssetCache
          }
        ],
        source: "/_next/static/(.*)"
      },
      {
        headers: [
          {
            key: "Cache-Control",
            value: immutableAssetCache
          }
        ],
        source: "/(.*\\.(?:avif|css|gif|ico|jpg|jpeg|js|mjs|otf|png|svg|ttf|webp|woff|woff2))"
      },
      {
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600"
          }
        ],
        source: "/.well-known/security.txt"
      },
      {
        headers: securityHeaders,
        source: "/(.*)"
      }
    ];
  }
};

export default nextConfig;
