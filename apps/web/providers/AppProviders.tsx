// @ts-expect-error TODO: remover suppressão ampla
// 
"use client";

import { Suspense, type ReactNode, useEffect } from "react";

import { CookieConsentBanner } from "../components/cookie-consent-banner.js";
import { ToastViewport } from "../components/dashboard/ToastViewport.js";
import type { SupportedLocale } from "../lib/i18n.js";
import { PaywallProvider } from "../components/paywall-provider.js";
import { AnalyticsProvider } from "./AnalyticsProvider.js";
import { EngagementProvider } from "./EngagementProvider.js";
import { I18nProvider } from "./I18nProvider.js";
import { ThemeProvider } from "./ThemeProvider.js";

function ServiceWorkerBootstrap() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  return null;
}

export function AppProviders({
  children,
  locale
}: Readonly<{
  children: ReactNode;
  locale: SupportedLocale;
}>) {
  return (
    <I18nProvider locale={locale}>
      <ThemeProvider>
        <PaywallProvider>
          <EngagementProvider>
            <Suspense fallback={null}>
              <AnalyticsProvider>
                <ServiceWorkerBootstrap />
                {children}
                <CookieConsentBanner />
                <ToastViewport />
              </AnalyticsProvider>
            </Suspense>
          </EngagementProvider>
        </PaywallProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}

