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

import { fetchSearchResults } from "../../lib/product-api";

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
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [groups, setGroups] = useState<SearchGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const shortcutHint = useMemo(
    () => (navigator.platform.toLowerCase().includes("mac") ? "cmd+k" : "ctrl+k"),
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

  return (
    <>
      <button
        aria-expanded={open}
        aria-label="Abrir busca global"
        className="command-button"
        onClick={() => {
          startTransition(() => {
            setOpen(true);
          });
        }}
        type="button"
      >
        <Search size={16} />
        <span>Buscar</span>
        <kbd>{shortcutHint}</kbd>
      </button>

      {open ? (
        <div className="search-overlay" role="dialog" aria-modal="true">
          <button
            aria-label="Fechar busca global"
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
                placeholder="Buscar workflows, reports, notificacoes e conversations"
                ref={inputRef}
                value={query}
              />
            </div>

            <div className="search-dialog__body">
              {error ? <p className="search-error">{error}</p> : null}
              {isLoading ? <p className="search-muted">Buscando resultados...</p> : null}
              {!isLoading && groups.length === 0 ? (
                <p className="search-muted">Nenhum resultado encontrado.</p>
              ) : null}

              {groups.map((group) => {
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
