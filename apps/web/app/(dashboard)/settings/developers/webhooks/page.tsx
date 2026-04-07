/* eslint-disable max-lines */
"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchWithSession, getStoredSession } from "../../../../../lib/auth-client";

type WebhookEndpoint = {
  _count?: {
    deliveries: number;
  };
  createdAt: string;
  id: string;
  secret: string;
  status: "ACTIVE" | "DISABLED";
  topics: string[];
  url: string;
};

type WebhookDelivery = {
  attempt: number;
  createdAt: string;
  endpointId: string;
  id: string;
  responseStatus: number | null;
  topic: string;
};

const defaultTopics = "agent.finished,agent.failed";
const suggestedTopics = [
  "agent.finished",
  "agent.failed",
  "workflow.finished",
  "tenant.churn_risk"
];

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function parseTopics(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function requestJson<TResponse>(
  input: string,
  init: RequestInit,
  failureLabel: string
): Promise<TResponse> {
  const response = await fetchWithSession(input, init);

  if (!response.ok) {
    throw new Error(`${failureLabel} (${response.status}).`);
  }

  return (await response.json()) as TResponse;
}

async function requestWithoutBody(
  input: string,
  init: RequestInit,
  failureLabel: string
): Promise<void> {
  const response = await fetchWithSession(input, init);

  if (!response.ok) {
    throw new Error(`${failureLabel} (${response.status}).`);
  }
}

async function fetchWebhookEndpoints(): Promise<WebhookEndpoint[]> {
  const payload = await requestJson<{ items: WebhookEndpoint[] }>(
    "/api/v1/settings/webhooks",
    { cache: "no-store" },
    "Falha ao carregar endpoints"
  );

  return payload.items ?? [];
}

async function fetchWebhookDeliveries(endpointId: string): Promise<WebhookDelivery[]> {
  const payload = await requestJson<{ items: WebhookDelivery[] }>(
    `/api/v1/settings/webhooks/${encodeURIComponent(endpointId)}/deliveries?limit=25`,
    { cache: "no-store" },
    "Falha ao carregar entregas"
  );

  return payload.items ?? [];
}

async function createWebhookEndpoint(url: string, topics: string[]): Promise<WebhookEndpoint> {
  const payload = await requestJson<{ endpoint: WebhookEndpoint }>(
    "/api/v1/settings/webhooks",
    {
      body: JSON.stringify({ topics, url }),
      headers: {
        "content-type": "application/json"
      },
      method: "POST"
    },
    "Falha ao criar endpoint"
  );

  return payload.endpoint;
}

async function updateWebhookEndpointStatus(
  endpointId: string,
  status: WebhookEndpoint["status"]
): Promise<WebhookEndpoint> {
  const payload = await requestJson<{ endpoint: WebhookEndpoint }>(
    `/api/v1/settings/webhooks/${encodeURIComponent(endpointId)}`,
    {
      body: JSON.stringify({ status }),
      headers: {
        "content-type": "application/json"
      },
      method: "PATCH"
    },
    "Falha ao atualizar endpoint"
  );

  return payload.endpoint;
}

async function retryWebhookDelivery(deliveryId: string): Promise<void> {
  await requestWithoutBody(
    `/api/v1/settings/webhooks/deliveries/${encodeURIComponent(deliveryId)}/retry`,
    { method: "POST" },
    "Falha ao reenviar delivery"
  );
}

function UnauthenticatedState() {
  return (
    <main style={{ padding: "1.5rem" }}>
      <div className="panel">
        <h1 style={{ marginTop: 0 }}>Webhooks outbound</h1>
        <p>Realize login como administrador para cadastrar endpoints assinados.</p>
      </div>
    </main>
  );
}

interface WebhookEndpointFormProps {
  onCreate: () => void;
  onReload: () => void;
  onTopicsChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  saving: boolean;
  topics: string;
  url: string;
}

function WebhookEndpointForm({
  onCreate,
  onReload,
  onTopicsChange,
  onUrlChange,
  saving,
  topics,
  url
}: Readonly<WebhookEndpointFormProps>) {
  return (
    <section className="panel">
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          justifyContent: "space-between"
        }}
      >
        <div>
          <h2 style={{ marginTop: 0 }}>Novo endpoint</h2>
          <p style={{ color: "var(--muted)", marginBottom: 0 }}>
            Tente com {suggestedTopics.join(", ")} para cobrir eventos de engajamento.
          </p>
        </div>
        <button
          className="ghost-button"
          onClick={() => {
            onReload();
          }}
          type="button"
        >
          Recarregar
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gap: "0.75rem",
          gridTemplateColumns: "2fr 1.4fr auto"
        }}
      >
        <input
          onChange={(event) => onUrlChange(event.target.value)}
          placeholder="https://cliente.example.com/webhooks/birthhub"
          type="url"
          value={url}
        />
        <input
          onChange={(event) => onTopicsChange(event.target.value)}
          placeholder={defaultTopics}
          type="text"
          value={topics}
        />
        <button
          className="action-button"
          disabled={saving || !url.trim()}
          onClick={() => {
            onCreate();
          }}
          type="button"
        >
          Criar endpoint
        </button>
      </div>
    </section>
  );
}

interface WebhookEndpointListProps {
  endpoints: WebhookEndpoint[];
  loading: boolean;
  onSelect: (endpointId: string) => void;
  onToggleStatus: (endpoint: WebhookEndpoint) => void;
  selectedId: string | null;
}

function WebhookEndpointList({
  endpoints,
  loading,
  onSelect,
  onToggleStatus,
  selectedId
}: Readonly<WebhookEndpointListProps>) {
  return (
    <div className="panel">
      <h2 style={{ marginTop: 0 }}>Endpoints cadastrados</h2>

      {loading ? <p>Carregando endpoints...</p> : null}

      <div style={{ display: "grid", gap: "0.75rem" }}>
        {endpoints.map((endpoint) => (
          <article
            key={endpoint.id}
            style={{
              background:
                selectedId === endpoint.id ? "rgba(19,93,102,0.08)" : "rgba(255,255,255,0.7)",
              border: "1px solid var(--border)",
              borderRadius: 18,
              display: "grid",
              gap: "0.45rem",
              padding: "0.9rem"
            }}
          >
            <div
              style={{
                alignItems: "center",
                display: "flex",
                gap: "0.65rem",
                justifyContent: "space-between"
              }}
            >
              <strong>{endpoint.url}</strong>
              <span
                className={`status-pill ${
                  endpoint.status === "ACTIVE" ? "status-green" : "status-red"
                }`}
              >
                {endpoint.status}
              </span>
            </div>
            <small style={{ color: "var(--muted)" }}>Topicos: {endpoint.topics.join(", ")}</small>
            <small style={{ color: "var(--muted)" }}>
              Secret: {endpoint.secret.slice(0, 6)}...{endpoint.secret.slice(-6)}
            </small>
            <small style={{ color: "var(--muted)" }}>
              Deliveries: {endpoint._count?.deliveries ?? 0}
            </small>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
              <button
                className="ghost-button"
                onClick={() => {
                  onSelect(endpoint.id);
                }}
                type="button"
              >
                Ver historico
              </button>
              <button
                className={endpoint.status === "ACTIVE" ? "danger-button" : "action-button"}
                onClick={() => {
                  onToggleStatus(endpoint);
                }}
                type="button"
              >
                {endpoint.status === "ACTIVE" ? "Desativar" : "Reativar"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

interface WebhookDeliveryHistoryProps {
  deliveries: WebhookDelivery[];
  onRetry: (delivery: WebhookDelivery) => void;
  selectedId: string | null;
}

function WebhookDeliveryHistory({
  deliveries,
  onRetry,
  selectedId
}: Readonly<WebhookDeliveryHistoryProps>) {
  if (!selectedId) {
    return (
      <div className="panel">
        <h2 style={{ marginTop: 0 }}>Historico de entregas</h2>
        <p>Selecione um endpoint para ver o historico.</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h2 style={{ marginTop: 0 }}>Historico de entregas</h2>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Quando</th>
              <th>Topico</th>
              <th>Status</th>
              <th>Tentativa</th>
              <th>Acao</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan={5}>Nenhuma entrega registrada ainda.</td>
              </tr>
            ) : (
              deliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td>{new Date(delivery.createdAt).toLocaleString("pt-BR")}</td>
                  <td>{delivery.topic}</td>
                  <td>{delivery.responseStatus ?? "PENDENTE"}</td>
                  <td>{delivery.attempt}</td>
                  <td>
                    <button
                      className="ghost-button"
                      onClick={() => {
                        onRetry(delivery);
                      }}
                      type="button"
                    >
                      Reenviar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function DeveloperWebhooksPage() {
  const session = useMemo(() => getStoredSession(), []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [topics, setTopics] = useState(defaultTopics);
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadEndpoints() {
    setLoading(true);
    setError(null);

    try {
      const items = await fetchWebhookEndpoints();

      setEndpoints(items);
      setSelectedId((current) =>
        current && items.some((item) => item.id === current) ? current : items[0]?.id ?? null
      );
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Falha ao carregar endpoints."));
    } finally {
      setLoading(false);
    }
  }

  async function loadDeliveries(endpointId: string) {
    setError(null);

    try {
      const items = await fetchWebhookDeliveries(endpointId);
      setDeliveries(items);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Falha ao carregar entregas."));
    }
  }

  async function handleCreateEndpoint() {
    setSaving(true);
    setError(null);

    try {
      const endpoint = await createWebhookEndpoint(url, parseTopics(topics));
      setUrl("");
      setTopics(defaultTopics);
      setEndpoints((current) => [endpoint, ...current]);
      setSelectedId(endpoint.id);
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Falha ao criar endpoint."));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleEndpointStatus(endpoint: WebhookEndpoint) {
    setError(null);

    try {
      const status = endpoint.status === "ACTIVE" ? "DISABLED" : "ACTIVE";
      const updatedEndpoint = await updateWebhookEndpointStatus(endpoint.id, status);

      setEndpoints((current) =>
        current.map((item) => (item.id === updatedEndpoint.id ? updatedEndpoint : item))
      );
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Falha ao atualizar endpoint."));
    }
  }

  async function handleRetryDelivery(delivery: WebhookDelivery) {
    setError(null);

    try {
      await retryWebhookDelivery(delivery.id);
      await loadDeliveries(delivery.endpointId);
    } catch (retryError) {
      setError(getErrorMessage(retryError, "Falha ao reenviar delivery."));
    }
  }

  useEffect(() => {
    if (!session) {
      return;
    }

    void loadEndpoints();
  }, [session]);

  useEffect(() => {
    if (!selectedId) {
      setDeliveries([]);
      return;
    }

    void loadDeliveries(selectedId);
  }, [selectedId]);

  if (!session) {
    return <UnauthenticatedState />;
  }

  return (
    <main style={{ display: "grid", gap: "1rem", padding: "1.5rem" }}>
      <section className="hero-card">
        <span className="badge">Developer Settings</span>
        <h1>Webhooks outbound assinados</h1>
        <p style={{ marginBottom: 0 }}>
          Cadastre endpoints por tenant, acompanhe historico de entrega e reenvie cargas com o
          payload exato.
        </p>
      </section>

      <WebhookEndpointForm
        onCreate={() => {
          void handleCreateEndpoint();
        }}
        onReload={() => {
          void loadEndpoints();
        }}
        onTopicsChange={setTopics}
        onUrlChange={setUrl}
        saving={saving}
        topics={topics}
        url={url}
      />

      <section
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "minmax(320px, 1.1fr) minmax(340px, 1fr)"
        }}
      >
        <WebhookEndpointList
          endpoints={endpoints}
          loading={loading}
          onSelect={setSelectedId}
          onToggleStatus={(endpoint) => {
            void handleToggleEndpointStatus(endpoint);
          }}
          selectedId={selectedId}
        />
        <WebhookDeliveryHistory
          deliveries={deliveries}
          onRetry={(delivery) => {
            void handleRetryDelivery(delivery);
          }}
          selectedId={selectedId}
        />
      </section>

      {error ? <p style={{ color: "#9b2f2f", margin: 0 }}>{error}</p> : null}
    </main>
  );
}
