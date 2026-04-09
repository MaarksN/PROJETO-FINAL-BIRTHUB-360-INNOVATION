// @ts-nocheck
"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ProductEmptyState,
  ProductPageHeader
} from "../../../components/dashboard/page-fragments";
import {
  appendConversationNote,
  createConversation,
  fetchConversationDetail,
  fetchConversationList,
  updateConversationStatus
} from "../../../lib/product-api";

type ConversationListItem = {
  channel: string;
  createdAt: string;
  customerReference: string | null;
  id: string;
  lastMessageAt: string | null;
  lastMessagePreview: string | null;
  leadReference: string | null;
  messageCount: number;
  status: string;
  subject: string | null;
  updatedAt: string;
};

type ConversationDetail = {
  channel: string;
  createdAt: string;
  customerReference: string | null;
  id: string;
  leadReference: string | null;
  messages: Array<{
    content: string;
    createdAt: string;
    direction: string;
    id: string;
    role: string | null;
  }>;
  status: string;
  subject: string | null;
  updatedAt: string;
};

export default function ConversationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    channel: "",
    q: "",
    status: ""
  });
  const [items, setItems] = useState<ConversationListItem[]>([]);
  const [detail, setDetail] = useState<ConversationDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [composer, setComposer] = useState("");
  const [newConversation, setNewConversation] = useState({
    initialMessage: "",
    subject: ""
  });
  const selectedId = searchParams.get("thread") ?? "";
  const deferredQuery = useDeferredValue(filters.q);

  useEffect(() => {
    setLoadingList(true);
    setError(null);

    const nextFilters: {
      channel?: string;
      q?: string;
      status?: string;
    } = {};

    if (filters.channel) {
      nextFilters.channel = filters.channel;
    }

    if (deferredQuery) {
      nextFilters.q = deferredQuery;
    }

    if (filters.status) {
      nextFilters.status = filters.status;
    }

    void fetchConversationList(nextFilters)
      .then((payload) => {
        setItems(payload.items);

        if (!selectedId && payload.items[0]?.id) {
          router.replace(`/conversations?thread=${encodeURIComponent(payload.items[0].id)}`, {
            scroll: false
          });
        }
      })
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "Falha ao carregar conversas.");
      })
      .finally(() => {
        setLoadingList(false);
      });
  }, [deferredQuery, filters.channel, filters.status, router, selectedId]);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }

    setLoadingDetail(true);
    void fetchConversationDetail(selectedId)
      .then((payload) => {
        setDetail(payload.conversation);
      })
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "Falha ao carregar conversa.");
      })
      .finally(() => {
        setLoadingDetail(false);
      });
  }, [selectedId]);

  const selectedSummary = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId]
  );

  return (
    <main className="dashboard-content">
      <ProductPageHeader
        actions={
          <div className="hero-actions">
            <button
              className="action-button"
              onClick={() => {
                if (!newConversation.subject.trim()) {
                  setError("Informe um assunto para abrir a thread.");
                  return;
                }

                setError(null);
                void createConversation(newConversation)
                  .then((payload) => {
                    setNewConversation({
                      initialMessage: "",
                      subject: ""
                    });
                    router.replace(`/conversations?thread=${encodeURIComponent(payload.conversation.id)}`);
                  })
                  .catch((creationError) => {
                    setError(
                      creationError instanceof Error
                        ? creationError.message
                        : "Falha ao criar conversa."
                    );
                  });
              }}
              type="button"
            >
              Nova thread
            </button>
          </div>
        }
        badge="Conversations"
        description="Fila operacional para acompanhar threads, registrar notas internas e fechar atendimentos sem sair do produto."
        title="Conversations UI"
      />

      <section
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "minmax(280px, 0.9fr) minmax(0, 1.4fr)"
        }}
      >
        <aside className="panel" style={{ display: "grid", gap: "0.85rem", alignContent: "start" }}>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            <input
              onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))}
              placeholder="Buscar por assunto ou mensagem"
              value={filters.q}
            />
            <select
              onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
              value={filters.status}
            >
              <option value="">Todos os status</option>
              <option value="open">open</option>
              <option value="pending">pending</option>
              <option value="resolved">resolved</option>
            </select>
            <select
              onChange={(event) => setFilters((current) => ({ ...current, channel: event.target.value }))}
              value={filters.channel}
            >
              <option value="">Todos os canais</option>
              <option value="internal">internal</option>
              <option value="whatsapp">whatsapp</option>
              <option value="email">email</option>
            </select>
          </div>

          <div style={{ display: "grid", gap: "0.55rem" }}>
            <input
              onChange={(event) =>
                setNewConversation((current) => ({ ...current, subject: event.target.value }))
              }
              placeholder="Assunto da nova thread"
              value={newConversation.subject}
            />
            <textarea
              onChange={(event) =>
                setNewConversation((current) => ({
                  ...current,
                  initialMessage: event.target.value
                }))
              }
              placeholder="Mensagem inicial opcional"
              value={newConversation.initialMessage}
            />
          </div>

          {error ? (
            <div className="empty-state">
              <strong>Falha operacional</strong>
              <p>{error}</p>
            </div>
          ) : null}

          {loadingList ? <p style={{ color: "var(--muted)", margin: 0 }}>Carregando threads...</p> : null}

          {!loadingList && items.length === 0 ? (
            <ProductEmptyState
              description="Nenhuma thread encontrada para os filtros atuais."
              title="Sem conversas"
            />
          ) : (
            <div style={{ display: "grid", gap: "0.65rem" }}>
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    router.replace(`/conversations?thread=${encodeURIComponent(item.id)}`, {
                      scroll: false
                    });
                  }}
                  style={{
                    background: selectedId === item.id ? "rgba(19, 93, 102, 0.08)" : "transparent",
                    border: "1px solid var(--border)",
                    borderRadius: 20,
                    color: "inherit",
                    display: "grid",
                    gap: "0.3rem",
                    padding: "0.85rem",
                    textAlign: "left"
                  }}
                  type="button"
                >
                  <strong>{item.subject ?? `Thread ${item.id.slice(0, 8)}`}</strong>
                  <span style={{ color: "var(--muted)" }}>
                    {item.channel} · {item.status} · {item.messageCount} mensagens
                  </span>
                  <span>{item.lastMessagePreview ?? "Sem preview ainda."}</span>
                </button>
              ))}
            </div>
          )}
        </aside>

        <section className="panel" style={{ display: "grid", gap: "0.85rem", alignContent: "start" }}>
          {!selectedSummary ? (
            <ProductEmptyState
              description="Escolha uma thread na coluna lateral para abrir o contexto completo."
              title="Nenhuma conversa selecionada"
            />
          ) : loadingDetail ? (
            <p style={{ color: "var(--muted)", margin: 0 }}>Carregando detalhe da conversa...</p>
          ) : detail ? (
            <>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "grid", gap: "0.25rem" }}>
                  <h2 style={{ marginBottom: 0 }}>{detail.subject ?? "Thread sem assunto"}</h2>
                  <span style={{ color: "var(--muted)" }}>
                    {detail.channel} · atualizada em {new Date(detail.updatedAt).toLocaleString("pt-BR")}
                  </span>
                </div>
                <select
                  onChange={(event) => {
                    void updateConversationStatus(detail.id, event.target.value)
                      .then(() => {
                        setDetail((current) =>
                          current ? { ...current, status: event.target.value } : current
                        );
                        setItems((current) =>
                          current.map((item) =>
                            item.id === detail.id ? { ...item, status: event.target.value } : item
                          )
                        );
                      })
                      .catch((statusError) => {
                        setError(
                          statusError instanceof Error
                            ? statusError.message
                            : "Falha ao atualizar status."
                        );
                      });
                  }}
                  value={detail.status}
                >
                  <option value="open">open</option>
                  <option value="pending">pending</option>
                  <option value="resolved">resolved</option>
                </select>
              </div>

              <div style={{ display: "grid", gap: "0.75rem" }}>
                {detail.messages.length === 0 ? (
                  <ProductEmptyState
                    description="Ainda nao ha mensagens registradas nesta thread."
                    title="Thread sem mensagens"
                  />
                ) : (
                  detail.messages.map((message) => (
                    <article
                      key={message.id}
                      style={{
                        background:
                          message.direction === "internal"
                            ? "rgba(19, 93, 102, 0.08)"
                            : "rgba(255,255,255,0.48)",
                        border: "1px solid var(--border)",
                        borderRadius: 18,
                        display: "grid",
                        gap: "0.4rem",
                        padding: "0.85rem"
                      }}
                    >
                      <div
                        style={{
                          alignItems: "center",
                          display: "flex",
                          justifyContent: "space-between"
                        }}
                      >
                        <strong>{message.role ?? message.direction}</strong>
                        <span style={{ color: "var(--muted)" }}>
                          {new Date(message.createdAt).toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <pre
                        style={{
                          margin: 0,
                          overflowX: "auto",
                          whiteSpace: "pre-wrap"
                        }}
                      >
                        {message.content}
                      </pre>
                    </article>
                  ))
                )}
              </div>

              <div style={{ display: "grid", gap: "0.65rem" }}>
                <textarea
                  onChange={(event) => setComposer(event.target.value)}
                  placeholder="Registrar nota interna"
                  value={composer}
                />
                <button
                  className="action-button"
                  onClick={() => {
                    if (!composer.trim()) {
                      setError("Escreva uma nota antes de enviar.");
                      return;
                    }

                    void appendConversationNote(detail.id, composer)
                      .then(async () => {
                        setComposer("");
                        const payload = await fetchConversationDetail(detail.id);
                        setDetail(payload.conversation);
                      })
                      .catch((noteError) => {
                        setError(
                          noteError instanceof Error ? noteError.message : "Falha ao publicar nota."
                        );
                      });
                  }}
                  type="button"
                >
                  Publicar nota
                </button>
              </div>
            </>
          ) : null}
        </section>
      </section>
    </main>
  );
}
