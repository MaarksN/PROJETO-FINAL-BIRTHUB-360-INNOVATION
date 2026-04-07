import { headers } from "next/headers";

import { resolveLocale, type SupportedLocale } from "./i18n";

export async function getRequestLocale(): Promise<SupportedLocale> {
  const requestHeaders = await headers();
  return resolveLocale(requestHeaders.get("accept-language"));
}
