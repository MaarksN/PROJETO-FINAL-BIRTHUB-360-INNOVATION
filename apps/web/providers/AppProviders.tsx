"use client";

import { type ReactNode, useEffect } from "react";

import { CookieConsentBanner } from "../components/cookie-consent-banner.js";
import { PaywallProvider } from "../components/paywall-provider.js";
import { AnalyticsProvider } from "./AnalyticsProvider.js";
import { EngagementProvider } from "./EngagementProvider.js";

function ServiceWorkerBootstrap() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  return null;
}

export function AppProviders({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <PaywallProvider>
      <EngagementProvider>
        <AnalyticsProvider>
          <ServiceWorkerBootstrap />
          {children}
          <CookieConsentBanner />
        </AnalyticsProvider>
      </EngagementProvider>
    </PaywallProvider>
  );
}
