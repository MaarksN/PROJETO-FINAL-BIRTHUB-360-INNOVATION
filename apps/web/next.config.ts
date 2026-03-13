import type { NextConfig } from "next";

const nextPublicApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
const cspReportUri = process.env.CSP_REPORT_URI;
const cspReportOnly = (process.env.NEXT_PUBLIC_CSP_REPORT_ONLY ?? "true") === "true";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob:",
  `connect-src 'self' ${nextPublicApiUrl} https://*.ingest.sentry.io`,
  "font-src 'self' data:",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  cspReportUri ? `report-uri ${cspReportUri}` : ""
]
  .filter(Boolean)
  .join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  headers() {
    return Promise.resolve([
      {
        headers: [
          {
            key: cspReportOnly
              ? "Content-Security-Policy-Report-Only"
              : "Content-Security-Policy",
            value: contentSecurityPolicy
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
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          }
        ],
        source: "/(.*)"
      }
    ]);
  }
};

export default nextConfig;
