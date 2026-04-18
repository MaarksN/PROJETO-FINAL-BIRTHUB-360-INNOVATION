"use client";

import { type ReactNode, useEffect } from "react";

import { getStoredSession } from "../lib/auth-client.js";
import { useNotificationStore } from "../stores/notification-store.js";
import { useUserPreferencesStore } from "../stores/user-preferences-store.js";

export function EngagementProvider({ children }: Readonly<{ children: ReactNode }>) {
  const hydratePreferences = useUserPreferencesStore((state) => state.hydrate);
  const inAppNotifications = useUserPreferencesStore(
    (state) => state.preferences.inAppNotifications
  );
  const refreshNotifications = useNotificationStore((state) => state.refresh);

  useEffect(() => {
    if (!getStoredSession()) {
      return;
    }

    void hydratePreferences();
  }, [hydratePreferences]);

  useEffect(() => {
    if (!getStoredSession() || inAppNotifications === false) {
      return;
    }

    void refreshNotifications();

    const interval = window.setInterval(() => {
      void refreshNotifications();
    }, 60_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [inAppNotifications, refreshNotifications]);

  return children;
}


