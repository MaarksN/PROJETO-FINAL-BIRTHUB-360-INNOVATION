"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BellOff,
  CheckCheck,
  ExternalLink,
  MoonStar,
  SunMedium
} from "lucide-react";

import { useThemeMode } from "../../providers/ThemeProvider";
import {
  type NotificationItem,
  useNotificationStore
} from "../../stores/notification-store";
import { useUserPreferencesStore } from "../../stores/user-preferences-store";
import { BrandLogo } from "../brand/BrandLogo";
import { GlobalSearch } from "./GlobalSearch";

function toDisplayDateLabel(value: string): string {
  const current = new Date();
  const target = new Date(value);
  const dayDiff = Math.floor(
    (Date.UTC(current.getFullYear(), current.getMonth(), current.getDate()) -
      Date.UTC(target.getFullYear(), target.getMonth(), target.getDate())) /
      (24 * 60 * 60 * 1000)
  );

  if (dayDiff === 0) {
    return "Hoje";
  }

  if (dayDiff === 1) {
    return "Ontem";
  }

  return target.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short"
  });
}

function groupByDay(items: NotificationItem[]) {
  return items.reduce<Array<{ label: string; items: NotificationItem[] }>>((groups, item) => {
    const label = toDisplayDateLabel(item.createdAt);
    const currentGroup = groups.find((group) => group.label === label);

    if (currentGroup) {
      currentGroup.items.push(item);
      return groups;
    }

    groups.push({
      items: [item],
      label
    });
    return groups;
  }, []);
}

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/workflows", label: "Workflows" },
  { href: "/notifications", label: "Notificacoes" },
  { href: "/analytics", label: "Analytics" },
  { href: "/conversations", label: "Conversations" },
  { href: "/reports", label: "Reports" },
  { href: "/onboarding", label: "Onboarding" }
];

export function Navbar() {
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const { mode, toggleMode } = useThemeMode();
  const items = useNotificationStore((state) => state.items);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const refresh = useNotificationStore((state) => state.refresh);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const notificationsEnabled = useUserPreferencesStore(
    (state) => state.preferences.inAppNotifications
  );

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const grouped = useMemo(() => groupByDay(items.slice(0, 10)), [items]);

  return (
    <>
      <div className="dashboard-topbar__identity">
        <BrandLogo href="/dashboard" size="sm" theme={mode === "dark" ? "dark" : "light"} />
        <div className="dashboard-title__meta">
          <span>Central de Operacao</span>
          <strong>Experiencia conectada ao produto</strong>
        </div>
      </div>

      <div className="dashboard-topbar__content">
        <nav className="dashboard-nav" aria-label="Navegacao principal">
          {navItems.map((item) => {
            const active =
              pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                aria-current={active ? "page" : undefined}
                data-active={active ? "true" : "false"}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="dashboard-topbar__actions">
          <GlobalSearch />

          <button
            aria-label={mode === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
            className="ghost-button"
            onClick={toggleMode}
            type="button"
          >
            {mode === "dark" ? <SunMedium size={16} /> : <MoonStar size={16} />}
            <span>{mode === "dark" ? "Claro" : "Escuro"}</span>
          </button>

          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              aria-expanded={open}
              aria-label="Abrir central de notificacoes"
              className="ghost-button"
              onClick={() => {
                if (!open) {
                  void refresh();
                }
                setOpen((current) => !current);
              }}
              style={{
                alignItems: "center",
                display: "inline-flex",
                gap: "0.45rem",
                position: "relative"
              }}
              type="button"
            >
              {notificationsEnabled === false ? <BellOff size={18} /> : <Bell size={18} />}
              <span>Feed</span>
              {notificationsEnabled !== false && unreadCount > 0 ? (
                <span className="notification-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>
              ) : null}
            </button>

            {open ? (
              <div className="notification-dropdown">
                <div className="notification-dropdown__header">
                  <div>
                    <strong>Notificacoes</strong>
                    <p>Atualizacao leve em tempo real com persistencia no backend.</p>
                  </div>
                  <button
                    className="ghost-button"
                    onClick={() => {
                      void markAllAsRead();
                    }}
                    type="button"
                  >
                    <CheckCheck size={16} />
                    <span>Ler tudo</span>
                  </button>
                </div>

                {notificationsEnabled === false ? (
                  <div className="panel" style={{ borderRadius: 18, padding: "0.9rem" }}>
                    <strong>Notificacoes in-app desativadas</strong>
                    <p style={{ marginBottom: 0 }}>
                      Reative em preferencias para voltar a receber avisos no app.
                    </p>
                  </div>
                ) : grouped.length === 0 ? (
                  <div className="panel" style={{ borderRadius: 18, padding: "0.9rem" }}>
                    <strong>Feed vazio</strong>
                    <p style={{ marginBottom: 0 }}>Nenhuma notificacao recente para este usuario.</p>
                  </div>
                ) : (
                  <div className="notification-dropdown__list">
                    {grouped.map((group) => (
                      <section className="notification-day-group" key={group.label}>
                        <small>{group.label}</small>
                        {group.items.map((item) => (
                          <a
                            className="notification-card"
                            href={item.link ?? "/notifications"}
                            key={item.id}
                            onClick={() => {
                              setOpen(false);
                              if (!item.isRead) {
                                void markAsRead(item.id);
                              }
                            }}
                          >
                            <div className="notification-card__title">
                              <strong>{item.type.replace(/_/g, " ")}</strong>
                              <small>
                                {new Date(item.createdAt).toLocaleTimeString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </small>
                            </div>
                            <span>{item.content}</span>
                            <span className="notification-card__link">
                              Abrir detalhe
                              <ExternalLink size={14} />
                            </span>
                          </a>
                        ))}
                      </section>
                    ))}
                  </div>
                )}

                <div className="notification-dropdown__footer">
                  <Link href="/notifications" onClick={() => setOpen(false)}>
                    Ver central
                  </Link>
                  <Link href="/profile/notifications" onClick={() => setOpen(false)}>
                    Preferencias
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
