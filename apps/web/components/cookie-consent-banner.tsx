// @ts-nocheck
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  fetchWithSession,
  getStoredSession
} from "../lib/auth-client";
import { useI18n } from "../providers/I18nProvider";
import { useUserPreferencesStore } from "../stores/user-preferences-store";

export function CookieConsentBanner() {
  const { dictionary: copy } = useI18n();
  const hydrated = useUserPreferencesStore((state) => state.hydrated);
  const hydratePreferences = useUserPreferencesStore((state) => state.hydrate);
  const preferences = useUserPreferencesStore((state) => state.preferences);
  const session = useMemo(() => getStoredSession(), []);
  const [isSaving, setIsSaving] = useState(false);

  async function saveBannerConsent(status: "GRANTED" | "REVOKED") {
    setIsSaving(true);

    try {
      const response = await fetchWithSession("/api/v1/privacy/consents", {
        body: JSON.stringify({
          decisions: [
            {
              purpose: "ANALYTICS",
              source: "BANNER",
              status
            }
          ]
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "PUT"
      });

      if (!response.ok) {
        throw new Error(`Falha ao registrar consentimento (${response.status}).`);
      }

      await hydratePreferences();
    } finally {
      setIsSaving(false);
    }
  }

  if (!session || !hydrated || preferences.cookieConsent !== "PENDING") {
    return null;
  }

  return (
    <aside className="cookie-consent-banner">
      <div className="cookie-consent-banner__copy">
        <strong>{copy.consentBanner.title}</strong>
        <p className="cookie-consent-banner__description">{copy.consentBanner.description}</p>
      </div>
      <div className="cookie-consent-banner__actions">
        <button
          className="action-button"
          disabled={isSaving}
          onClick={() => {
            void saveBannerConsent("GRANTED");
          }}
          type="button"
        >
          {copy.consentBanner.accept}
        </button>
        <button
          className="ghost-button ghost-button--inverse"
          disabled={isSaving}
          onClick={() => {
            void saveBannerConsent("REVOKED");
          }}
          type="button"
        >
          {copy.consentBanner.reject}
        </button>
        <Link className="cookie-consent-banner__link" href="/settings/privacy">
          {copy.consentBanner.settings}
        </Link>
      </div>
    </aside>
  );
}
