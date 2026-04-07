"use client";

import { create } from "zustand";

import { fetchWithSession, getStoredSession } from "../lib/auth-client";

export interface NotificationItem {
  content: string;
  createdAt: string;
  id: string;
  isRead: boolean;
  link: string | null;
  metadata?: Record<string, unknown> | null;
  type: string;
}

interface NotificationState {
  error: string | null;
  initialized: boolean;
  isLoading: boolean;
  items: NotificationItem[];
  nextCursor: string | null;
  unreadCount: number;
  loadMore: () => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

interface NotificationFeedPayload {
  items: NotificationItem[];
  nextCursor: string | null;
  unreadCount: number;
}

type NotificationStoreFields = Pick<
  NotificationState,
  "error" | "initialized" | "isLoading" | "items" | "nextCursor" | "unreadCount"
>;

const INITIAL_PAGE_SIZE = 10;
const LOAD_MORE_PAGE_SIZE = 20;

function dedupeNotifications(items: NotificationItem[]): NotificationItem[] {
  const seen = new Set<string>();
  const deduped: NotificationItem[] = [];

  for (const item of items) {
    if (seen.has(item.id)) {
      continue;
    }

    seen.add(item.id);
    deduped.push(item);
  }

  return deduped.sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function hasActiveSession(): boolean {
  return Boolean(getStoredSession());
}

function createLoadingState(): Pick<NotificationStoreFields, "error" | "isLoading"> {
  return {
    error: null,
    isLoading: true
  };
}

function createAnonymousState(): NotificationStoreFields {
  return {
    error: null,
    initialized: true,
    isLoading: false,
    items: [],
    nextCursor: null,
    unreadCount: 0
  };
}

function createFeedState(
  payload: NotificationFeedPayload,
  items: NotificationItem[] = payload.items
): NotificationStoreFields {
  return {
    error: null,
    initialized: true,
    isLoading: false,
    items: dedupeNotifications(items),
    nextCursor: payload.nextCursor,
    unreadCount: payload.unreadCount
  };
}

function createMarkAllAsReadState(
  state: NotificationStoreFields
): Pick<NotificationStoreFields, "error" | "items" | "unreadCount"> {
  return {
    error: null,
    items: state.items.map((item) => ({
      ...item,
      isRead: true
    })),
    unreadCount: 0
  };
}

function createMarkAsReadState(
  state: NotificationStoreFields,
  id: string
): Pick<NotificationStoreFields, "items" | "unreadCount"> {
  const unreadTarget = state.items.find((item) => item.id === id && !item.isRead);

  return {
    items: state.items.map((item) =>
      item.id === id
        ? {
            ...item,
            isRead: true
          }
        : item
    ),
    unreadCount: Math.max(0, state.unreadCount - (unreadTarget ? 1 : 0))
  };
}

async function fetchFeed(
  cursor?: string | null,
  limit = INITIAL_PAGE_SIZE
): Promise<NotificationFeedPayload> {
  const search = new URLSearchParams({
    limit: String(limit)
  });

  if (cursor) {
    search.set("cursor", cursor);
  }

  const response = await fetchWithSession(`/api/v1/notifications?${search.toString()}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Falha ao carregar notificacoes (${response.status}).`);
  }

  return (await response.json()) as NotificationFeedPayload;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  error: null,
  initialized: false,
  isLoading: false,
  items: [],
  nextCursor: null,
  unreadCount: 0,
  async loadMore() {
    const current = get();

    if (!hasActiveSession() || !current.nextCursor || current.isLoading) {
      return;
    }

    set(createLoadingState());

    try {
      const payload = await fetchFeed(current.nextCursor, LOAD_MORE_PAGE_SIZE);

      set((state) => createFeedState(payload, [...state.items, ...payload.items]));
    } catch (error) {
      set({
        error: getErrorMessage(error, "Falha ao carregar mais notificacoes."),
        isLoading: false
      });
    }
  },
  async markAllAsRead() {
    if (!hasActiveSession()) {
      return;
    }

    try {
      const response = await fetchWithSession("/api/v1/notifications/read-all", {
        method: "PATCH"
      });

      if (!response.ok) {
        throw new Error(`Falha ao marcar notificacoes (${response.status}).`);
      }

      set((state) => createMarkAllAsReadState(state));
    } catch (error) {
      set({
        error: getErrorMessage(error, "Falha ao marcar notificacoes.")
      });
    }
  },
  async markAsRead(id) {
    if (!hasActiveSession()) {
      return;
    }

    const snapshot = get();

    set((state) => createMarkAsReadState(state, id));

    try {
      const response = await fetchWithSession(`/api/v1/notifications/${encodeURIComponent(id)}/read`, {
        method: "PATCH"
      });

      if (!response.ok) {
        throw new Error(`Falha ao marcar notificacao (${response.status}).`);
      }
    } catch (error) {
      set({
        error: getErrorMessage(error, "Falha ao marcar notificacao."),
        items: snapshot.items,
        unreadCount: snapshot.unreadCount
      });
      await get().refresh();
    }
  },
  async refresh() {
    if (!hasActiveSession()) {
      set(createAnonymousState());
      return;
    }

    set(createLoadingState());

    try {
      const payload = await fetchFeed(undefined, INITIAL_PAGE_SIZE);

      set(createFeedState(payload));
    } catch (error) {
      set({
        error: getErrorMessage(error, "Falha ao carregar notificacoes."),
        initialized: true,
        isLoading: false
      });
    }
  }
}));
