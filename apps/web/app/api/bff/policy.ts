export const ALLOWED_BFF_PREFIXES = [
  "api/v1/admin",
  "api/v1/analytics",
  "api/v1/auth",
  "api/v1/billing",
  "api/v1/me",
  "api/v1/notifications",
  "api/v1/privacy",
  "api/v1/search",
  "api/v1/sessions",
  "api/v1/team",
  "api/v1/users",
  "api/v1/workflows",
  "api/v1/outputs"
] as const;

export function isBffPathAllowed(path: string): boolean {
  return ALLOWED_BFF_PREFIXES.some((prefix) => path.startsWith(prefix));
}
