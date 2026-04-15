"use client";

import {
  Search,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState
} from "react";

import {
  EXECUTIVE_PREMIUM_COLLECTION_HREF,
  EXECUTIVE_PREMIUM_SHARED_LAYER_COUNT
} from "../../lib/executive-premium";
import { fetchSearchResults } from "../../lib/product-api";
import { useI18n } from "../../providers/I18nProvider";

type SearchGroup = {
  id: string;
  items: Array<{
    href: string;
    id: string;
    subtitle: string;
    title: string;
    type: string;
  }>;
  label: string;
};

const iconByGroup: Record<string, LucideIcon> = {
  conversations: Sparkles,
  notifications: Sparkles,
  reports: Sparkles,
  shortcuts: Search,
  workflows: Sparkles
};

export function GlobalSearch() {
  const { locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<SearchGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const copy = useMemo(
    () =>
      locale === "pt-BR"
        ? {
            buttonLabel: "Buscar",
            closeAriaLabel: "Fechar busca global",
            emptyLabel: "Nenhum resultado encontrado.",
            loadingLabel: "Buscando resultados...",
            openAriaLabel: "Abrir busca global",
            placeholder: "Buscar workflows, premium, reports, notificacoes, conversations e Sales OS",
            shortcutsLabel: "Atalhos"
          }
        : {
            buttonLabel: "Search",
            closeAriaLabel: "Close global search",
            emptyLabel: "No results found.",
            loadingLabel: "Searching results...",
            openAriaLabel: "Open global search",
            placeholder: "Search workflows, premium, reports, notifications, conversations, and Sales OS",
            shortcutsLabel: "Shortcuts"
          },
    [locale]
  );
  const localShortcuts = useMemo(
    () =>
      locale === "pt-BR"
        ? [
            {
              href: EXECUTIVE_PREMIUM_COLLECTION_HREF,
              id: "shortcut-executive-premium",
              subtitle: `${EXECUTIVE_PREMIUM_SHARED_LAYER_COUNT} camadas premium para board, C-level, risco e memoria decisoria.`,
              title: "Executive Premium",
              type: "shortcut"
            },
            {
              href: "/packs",
              id: "shortcut-premium-packs",
              subtitle: "Veja status, ativacao e rollout dos packs premium executivos instalados.",
              title: "Premium Packs",
              type: "shortcut"
            },
            {
              href: "/sales-os",
              id: "shortcut-sales-os",
              subtitle: "BirthHub Sales OS unificado com modulos, roleplays e mentor contextual.",
              title: "Sales OS",
              type: "shortcut"
            }
          ]
        : [
            {
              href: EXECUTIVE_PREMIUM_COLLECTION_HREF,
              id: "shortcut-executive-premium",
              subtitle: `${EXECUTIVE_PREMIUM_SHARED_LAYER_COUNT} premium layers for board, C-level, risk, and decision memory.`,
              title: "Executive Premium",
              type: "shortcut"
            },
            {
              href: "/packs",
              id: "shortcut-premium-packs",
              subtitle: "Review status, activation, and rollout of installed executive premium packs.",
              title: "Premium Packs",
              type: "shortcut"
            },
            {
              href: "/sales-os",
              id: "shortcut-sales-os",
              subtitle: "Unified BirthHub Sales OS with modules, roleplays, and contextual mentor.",
              title: "Sales OS",
              type: "shortcut"
            }
          ],
    [locale]
  );

  const shortcutHint = useMemo(
    () =>
      typeof navigator !== "undefined" && navigator.platform.toLowerCase().includes("mac")
        ? "cmd+k"
        : "ctrl+k",
    []
  );

  const handleKeydown = useEffectEvent((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      setOpen((current) => !current);
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  });

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  useEffect(() => {
    if (!open) {
      return;
    }

    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsLoading(true);
      setError(null);
      void fetchSearchResults(deferredQuery)
        .then((payload) => {
          setGroups(payload.groups);
        })
        .catch((searchError) => {
          setError(
            searchError instanceof Error ? searchError.message : "Falha ao carregar busca global."
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 220);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [deferredQuery, open, pathname]);

  const mergedGroups = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    const matchedShortcuts = localShortcuts.filter((item) => {
      if (!normalizedQuery) {
        return true;
      }

      const haystack = `${item.title} ${item.subtitle} ${item.type}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });

    if (matchedShortcuts.length === 0) {
      return groups;
    }

    const existingShortcuts = groups.find((group) => group.id === "shortcuts");
    const mergedShortcutItems = [
      ...(existingShortcuts?.items ?? []),
      ...matchedShortcuts.filter(
        (shortcut) => !(existingShortcuts?.items ?? []).some((item) => item.href === shortcut.href)
      )
    ];
    const otherGroups = groups.filter((group) => group.id !== "shortcuts");

    return [
      {
        id: "shortcuts",
        items: mergedShortcutItems,
        label: existingShortcuts?.label ?? copy.shortcutsLabel
      },
      ...otherGroups
    ];
  }, [copy.shortcutsLabel, deferredQuery, groups, localShortcuts]);

  return (
    <>
      <button
        aria-expanded={open}
        aria-label={copy.openAriaLabel}
        className="command-button"
        onClick={() => {
          startTransition(() => {
            setOpen(true);
          });
        }}
        type="button"
      >
        <Search size={16} />
        <span>{copy.buttonLabel}</span>
        <kbd>{shortcutHint}</kbd>
      </button>

      {open ? (
        <div className="search-overlay" role="dialog" aria-modal="true">
          <button
            aria-label={copy.closeAriaLabel}
            className="search-overlay__backdrop"
            onClick={() => setOpen(false)}
            type="button"
          />
          <div className="search-dialog">
            <div className="search-dialog__header">
              <Search size={18} />
              <input
                onChange={(event) => {
                  startTransition(() => {
                    setQuery(event.target.value);
                  });
                }}
                placeholder={copy.placeholder}
                ref={inputRef}
                value={query}
              />
            </div>

            <div className="search-dialog__body">
              {error ? <p className="search-error">{error}</p> : null}
              {isLoading ? <p className="search-muted">{copy.loadingLabel}</p> : null}
              {!isLoading && mergedGroups.length === 0 ? (
                <p className="search-muted">{copy.emptyLabel}</p>
              ) : null}

              {mergedGroups.map((group) => {
                const Icon = iconByGroup[group.id] ?? Search;

                return (
                  <section className="search-group" key={group.id}>
                    <div className="search-group__header">
                      <div>
                        <Icon size={14} />
                        <strong>{group.label}</strong>
                      </div>
                      <span>{group.items.length}</span>
                    </div>
                    <div className="search-group__items">
                      {group.items.map((item) => (
                        <Link
                          className="search-item"
                          href={item.href}
                          key={item.id}
                          onClick={() => {
                            setOpen(false);
                            router.prefetch(item.href);
                          }}
                        >
                          <div>
                            <strong>{item.title}</strong>
                            <p>{item.subtitle}</p>
                          </div>
                          <span>{item.type}</span>
                        </Link>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
