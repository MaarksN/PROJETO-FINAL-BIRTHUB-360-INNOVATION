"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  fetchWithSession,
  getStoredSession
} from "../lib/auth-client";
import { getDictionary } from "../lib/i18n";
import { useUserPreferencesStore } from "../stores/user-preferences-store";

export function CookieConsentBanner() {
  const copy = getDictionary();
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
    <aside
      style={{
        backdropFilter: "blur(14px)",
        background: "rgba(16,42,67,0.94)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 24,
        bottom: 20,
        color: "#f8fafc",
        display: "grid",
        gap: "0.9rem",
        left: 20,
        maxWidth: 520,
        padding: "1rem 1.1rem",
        position: "fixed",
        right: 20,
        width: "min(100% - 40px, 520px)",
        zIndex: 1200
      }}
    >
      <div style={{ display: "grid", gap: "0.35rem" }}>
        <strong>{copy.consentBanner.title}</strong>
        <p style={{ color: "rgba(226,232,240,0.9)", margin: 0 }}>
          {copy.consentBanner.description}
        </p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
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
          className="ghost-button"
          disabled={isSaving}
          onClick={() => {
            void saveBannerConsent("REVOKED");
          }}
          style={{
            background: "rgba(255,255,255,0.08)",
            borderColor: "rgba(255,255,255,0.18)",
            color: "#f8fafc"
          }}
          type="button"
        >
          {copy.consentBanner.reject}
        </button>
        <Link
          href="/settings/privacy"
          style={{
            alignItems: "center",
            color: "#f8fafc",
            display: "inline-flex",
            fontWeight: 600,
            textDecoration: "none"
          }}
        >
          {copy.consentBanner.settings}
        </Link>
      </div>
    </aside>
  );
}
