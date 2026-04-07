"use client";

import {
  useEffect,
  useMemo,
  useState,
  useTransition
} from "react";

import { getWebConfig } from "@birthub/config";

import {
  fetchWithSession,
  getStoredSession
} from "../../../../lib/auth-client";
import { useUserPreferencesStore } from "../../../../stores/user-preferences-store";

const webConfig = getWebConfig();
const DELETE_CONFIRMATION = "EXCLUIR MINHA CONTA";

type ConsentPurpose = "ANALYTICS" | "HEALTH_DATA_SHARING" | "MARKETING";
type ConsentSource = "API" | "BANNER" | "SETTINGS";
type ConsentStatus = "GRANTED" | "PENDING" | "REVOKED";
type RetentionAction = "ANONYMIZE" | "DELETE";
type RetentionDataCategory =
  | "LOGIN_ALERTS"
  | "MFA_CHALLENGES"
  | "MFA_RECOVERY_CODES"
  | "OUTPUT_ARTIFACTS"
  | "SUSPENDED_USERS";
type RetentionExecutionMode = "AUTOMATED" | "DRY_RUN" | "MANUAL";

type PrivacyConsent = {
  grantedAt: string | null;
  id: string;
  lastChangedAt: string;
  lawfulBasis: string;
  purpose: ConsentPurpose;
  revokedAt: string | null;
  source: ConsentSource;
  status: ConsentStatus;
};

type PrivacyConsentEvent = {
  createdAt: string;
  id: string;
  newStatus: ConsentStatus;
  previousStatus: ConsentStatus | null;
  purpose: ConsentPurpose;
  source: ConsentSource;
};

type PrivacyConsentPreferences = {
  cookieConsent: "ACCEPTED" | "PENDING" | "REJECTED";
  emailNotifications: boolean;
  inAppNotifications: boolean;
  lgpdConsentedAt: string | null;
  lgpdConsentStatus: "ACCEPTED" | "PENDING" | "REJECTED";
  lgpdConsentVersion: string;
  lgpdLegalBasis:
    | "CONSENT"
    | "CONTRACT"
    | "HEALTH_PROTECTION"
    | "LEGAL_OBLIGATION"
    | "LEGITIMATE_INTEREST";
  marketingEmails: boolean;
  pushNotifications: boolean;
};

type RetentionPolicy = {
  action: RetentionAction;
  createdAt: string;
  dataCategory: RetentionDataCategory;
  enabled: boolean;
  id: string;
  legalBasis: string;
  retentionDays: number;
  updatedAt: string;
};

type RetentionExecution = {
  action: RetentionAction;
  affectedCount: number;
  createdAt: string;
  dataCategory: RetentionDataCategory;
  id: string;
  mode: RetentionExecutionMode;
  scannedCount: number;
};

type RetentionRunResult = {
  affectedCount: number;
  dataCategory: RetentionDataCategory;
  executionId: string;
  scannedCount: number;
};

const consentCopy: Record<
  ConsentPurpose,
  {
    description: string;
    title: string;
  }
> = {
  ANALYTICS: {
    description: "Telemetria sem PII para produto, performance e qualidade operacional.",
    title: "Analytics e telemetria"
  },
  HEALTH_DATA_SHARING: {
    description: "Compartilhamento controlado de dados clinicos para integracoes e interoperabilidade.",
    title: "Compartilhamento de dados de saude"
  },
  MARKETING: {
    description: "Comunicacoes promocionais, novidades do produto e convites comerciais.",
    title: "Marketing e campanhas"
  }
};

const retentionCopy: Record<RetentionDataCategory, string> = {
  LOGIN_ALERTS: "Alertas de novo dispositivo e sinais de acesso suspeito.",
  MFA_CHALLENGES: "Desafios temporarios de MFA usados no login.",
  MFA_RECOVERY_CODES: "Codigos de recuperacao de MFA ja usados ou expirados.",
  OUTPUT_ARTIFACTS: "Artefatos gerados por automacoes, execucoes e relatorios.",
  SUSPENDED_USERS: "Contas suspensas elegiveis para anonimizacao posterior."
};

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "Nao registrado";
  }

  return new Date(value).toLocaleString("pt-BR");
}

function formatConsentStatus(status: ConsentStatus): string {
  switch (status) {
    case "GRANTED":
      return "Concedido";
    case "REVOKED":
      return "Revogado";
    default:
      return "Pendente";
  }
}

function formatRetentionAction(action: RetentionAction): string {
  return action === "ANONYMIZE" ? "Anonimizar" : "Excluir";
}

function formatExecutionMode(mode: RetentionExecutionMode): string {
  switch (mode) {
    case "AUTOMATED":
      return "Automatizado";
    case "DRY_RUN":
      return "Dry-run";
    default:
      return "Manual";
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export default function PrivacySettingsPageClient() {
  const [confirmation, setConfirmation] = useState("");
  const [consentHistory, setConsentHistory] = useState<PrivacyConsentEvent[]>([]);
  const [consentPreferences, setConsentPreferences] =
    useState<PrivacyConsentPreferences | null>(null);
  const [consents, setConsents] = useState<PrivacyConsent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const [retentionAccessDenied, setRetentionAccessDenied] = useState(false);
  const [retentionExecutions, setRetentionExecutions] = useState<RetentionExecution[]>([]);
  const [retentionPolicies, setRetentionPolicies] = useState<RetentionPolicy[]>([]);
  const [retentionRunItems, setRetentionRunItems] = useState<RetentionRunResult[]>([]);
  const [isPending, startTransition] = useTransition();
  const hydratePreferences = useUserPreferencesStore((state) => state.hydrate);
  const session = useMemo(() => getStoredSession(), []);

  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadState = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [consentResponse, retentionResponse] = await Promise.all([
          fetchWithSession("/api/v1/privacy/consents", {
            cache: "no-store"
          }),
          fetchWithSession("/api/v1/privacy/retention", {
            cache: "no-store"
          })
        ]);

        if (!consentResponse.ok) {
          throw new Error(`Falha ao carregar consentimentos (${consentResponse.status}).`);
        }

        const consentPayload = await parseJson<{
          history?: PrivacyConsentEvent[];
          items?: PrivacyConsent[];
          preferences?: PrivacyConsentPreferences;
        }>(consentResponse);

        let nextRetentionPolicies: RetentionPolicy[] = [];
        let nextRetentionExecutions: RetentionExecution[] = [];
        let nextRetentionDenied = false;

        if (retentionResponse.ok) {
          const retentionPayload = await parseJson<{
            executions?: RetentionExecution[];
            items?: RetentionPolicy[];
          }>(retentionResponse);
          nextRetentionPolicies = retentionPayload.items ?? [];
          nextRetentionExecutions = retentionPayload.executions ?? [];
        } else if (retentionResponse.status === 401 || retentionResponse.status === 403) {
          nextRetentionDenied = true;
        } else {
          throw new Error(`Falha ao carregar retencao (${retentionResponse.status}).`);
        }

        if (cancelled) {
          return;
        }

        setConsentHistory(consentPayload.history ?? []);
        setConsents(consentPayload.items ?? []);
        setConsentPreferences(consentPayload.preferences ?? null);
        setRetentionPolicies(nextRetentionPolicies);
        setRetentionExecutions(nextRetentionExecutions);
        setRetentionAccessDenied(nextRetentionDenied);
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Falha ao carregar configuracoes de privacidade."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadState();

    return () => {
      cancelled = true;
    };
  }, [session]);

  const updateConsentStatus = (purpose: ConsentPurpose, status: ConsentStatus) => {
    setConsents((current) =>
      current.map((item) =>
        item.purpose === purpose
          ? {
              ...item,
              status
            }
          : item
      )
    );
  };

  const updateRetentionPolicy = (
    dataCategory: RetentionDataCategory,
    next: Partial<Pick<RetentionPolicy, "action" | "enabled" | "retentionDays">>
  ) => {
    setRetentionPolicies((current) =>
      current.map((item) =>
        item.dataCategory === dataCategory
          ? {
              ...item,
              ...next
            }
          : item
      )
    );
  };

  const reloadPrivacyState = async () => {
    await hydratePreferences();
    const [consentResponse, retentionResponse] = await Promise.all([
      fetchWithSession("/api/v1/privacy/consents", {
        cache: "no-store"
      }),
      fetchWithSession("/api/v1/privacy/retention", {
        cache: "no-store"
      })
    ]);

    if (consentResponse.ok) {
      const consentPayload = await parseJson<{
        history?: PrivacyConsentEvent[];
        items?: PrivacyConsent[];
        preferences?: PrivacyConsentPreferences;
      }>(consentResponse);
      setConsentHistory(consentPayload.history ?? []);
      setConsents(consentPayload.items ?? []);
      setConsentPreferences(consentPayload.preferences ?? null);
    }

    if (retentionResponse.ok) {
      const retentionPayload = await parseJson<{
        executions?: RetentionExecution[];
        items?: RetentionPolicy[];
      }>(retentionResponse);
      setRetentionExecutions(retentionPayload.executions ?? []);
      setRetentionPolicies(retentionPayload.items ?? []);
      setRetentionAccessDenied(false);
    } else if (retentionResponse.status === 401 || retentionResponse.status === 403) {
      setRetentionAccessDenied(true);
    }
  };

  const saveConsentDecisions = () => {
    startTransition(() => {
      void (async () => {
        try {
          setError(null);
          setNotice("Salvando consentimentos LGPD...");

          const response = await fetchWithSession("/api/v1/privacy/consents", {
            body: JSON.stringify({
              decisions: consents.map((item) => ({
                purpose: item.purpose,
                source: "SETTINGS",
                status: item.status
              }))
            }),
            headers: {
              "content-type": "application/json"
            },
            method: "PUT"
          });

          if (!response.ok) {
            throw new Error(`Falha ao salvar consentimentos (${response.status}).`);
          }

          await reloadPrivacyState();
          setNotice("Consentimentos atualizados com sucesso.");
        } catch (requestError) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Falha ao salvar consentimentos."
          );
        }
      })();
    });
  };

  const saveRetentionSettings = () => {
    startTransition(() => {
      void (async () => {
        try {
          setError(null);
          setNotice("Salvando politica de retencao...");

          const response = await fetchWithSession("/api/v1/privacy/retention", {
            body: JSON.stringify({
              policies: retentionPolicies.map((policy) => ({
                action: policy.action,
                dataCategory: policy.dataCategory,
                enabled: policy.enabled,
                retentionDays: policy.retentionDays
              }))
            }),
            headers: {
              "content-type": "application/json"
            },
            method: "PUT"
          });

          if (!response.ok) {
            throw new Error(`Falha ao salvar retencao (${response.status}).`);
          }

          await reloadPrivacyState();
          setNotice("Politica de retencao atualizada.");
        } catch (requestError) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Falha ao salvar politica de retencao."
          );
        }
      })();
    });
  };

  const runRetention = (mode: "DRY_RUN" | "MANUAL") => {
    startTransition(() => {
      void (async () => {
        try {
          setError(null);
          setNotice(
            mode === "DRY_RUN"
              ? "Executando simulacao de retencao..."
              : "Executando retencao manual..."
          );

          const response = await fetchWithSession("/api/v1/privacy/retention/run", {
            body: JSON.stringify({
              mode
            }),
            headers: {
              "content-type": "application/json"
            },
            method: "POST"
          });

          if (!response.ok) {
            throw new Error(`Falha ao executar retencao (${response.status}).`);
          }

          const payload = await parseJson<{
            items?: RetentionRunResult[];
          }>(response);

          setRetentionRunItems(payload.items ?? []);
          await reloadPrivacyState();
          setNotice(
            mode === "DRY_RUN"
              ? "Dry-run concluido. Revise os volumes antes do rollout."
              : "Retencao manual executada com sucesso."
          );
        } catch (requestError) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Falha ao executar retencao."
          );
        }
      })();
    });
  };

  const downloadExport = () => {
    startTransition(() => {
      void (async () => {
        try {
          setError(null);
          setNotice("Gerando exportacao do tenant...");
          const response = await fetchWithSession(
            `${webConfig.NEXT_PUBLIC_API_URL}/api/v1/privacy/export`
          );

          if (!response.ok) {
            throw new Error(`Falha ao exportar dados (${response.status})`);
          }

          const content = await response.text();
          const blob = new Blob([content], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `birthub360-export-${new Date().toISOString().slice(0, 10)}.json`;
          link.click();
          URL.revokeObjectURL(url);
          setNotice("Exportacao concluida.");
        } catch (requestError) {
          setError(
            requestError instanceof Error ? requestError.message : "Falha ao exportar dados."
          );
        }
      })();
    });
  };

  const requestDeletion = () => {
    startTransition(() => {
      void (async () => {
        try {
          setError(null);
          setNotice("Processando exclusao e anonimizacao da conta...");

          const response = await fetchWithSession(
            `${webConfig.NEXT_PUBLIC_API_URL}/api/v1/privacy/delete-account`,
            {
              body: JSON.stringify({
                confirmationText: confirmation
              }),
              headers: {
                "content-type": "application/json"
              },
              method: "POST"
            }
          );

          if (!response.ok) {
            throw new Error(`Falha ao excluir conta (${response.status})`);
          }

          localStorage.removeItem("bh_access_token");
          localStorage.removeItem("bh_refresh_token");
          localStorage.removeItem("bh_csrf_token");
          localStorage.removeItem("bh_tenant_id");
          localStorage.removeItem("bh_user_id");
          window.location.assign("/login");
        } catch (requestError) {
          setError(
            requestError instanceof Error ? requestError.message : "Falha ao excluir conta."
          );
        }
      })();
    });
  };

  return (
    <section style={{ display: "grid", gap: "1.25rem" }}>
      <header style={{ display: "grid", gap: "0.4rem" }}>
        <span className="badge">LGPD e Privacy Ops</span>
        <h1 style={{ margin: 0 }}>Privacidade, consentimento e retencao</h1>
        <p style={{ color: "var(--muted)", margin: 0 }}>
          Esta tela concentra o baseline operacional de compliance: consentimentos LGPD,
          historico auditavel, politicas de retencao, exportacao e exclusao com anonimizacao.
        </p>
      </header>

      <article
        style={{
          background: "rgba(255,255,255,0.78)",
          border: "1px solid var(--border)",
          borderRadius: "1.25rem",
          display: "grid",
          gap: "1rem",
          padding: "1rem"
        }}
      >
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <strong>Consentimentos LGPD</strong>
          <p style={{ margin: 0 }}>
            Ajuste consentimentos por finalidade e acompanhe as ultimas alteracoes registradas.
          </p>
        </div>

        {consentPreferences ? (
          <div
            style={{
              background: "rgba(19,93,102,0.05)",
              border: "1px solid rgba(19,93,102,0.12)",
              borderRadius: "1rem",
              display: "grid",
              gap: "0.35rem",
              padding: "0.9rem"
            }}
          >
            <strong>Centro canonico de consentimento</strong>
            <p style={{ color: "var(--muted)", margin: 0 }}>
              Status geral: {consentPreferences.lgpdConsentStatus}. Base legal:{" "}
              {consentPreferences.lgpdLegalBasis.toLowerCase().replaceAll("_", " ")}. Versao ativa:{" "}
              {consentPreferences.lgpdConsentVersion}.
            </p>
            <small style={{ color: "var(--muted)" }}>
              Ultimo aceite registrado: {formatDate(consentPreferences.lgpdConsentedAt)}. Todas as
              alteracoes sao auditadas no backend e no historico abaixo.
            </small>
          </div>
        ) : null}

        {isLoading ? (
          <p style={{ color: "var(--muted)", margin: 0 }}>Carregando estado de privacidade...</p>
        ) : consents.length === 0 ? (
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Nenhum consentimento inicializado para o usuario atual.
          </p>
        ) : (
          <div style={{ display: "grid", gap: "0.85rem" }}>
            {consents.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid rgba(15,23,42,0.08)",
                  borderRadius: "1rem",
                  display: "grid",
                  gap: "0.6rem",
                  padding: "0.9rem"
                }}
              >
                <div style={{ display: "grid", gap: "0.25rem" }}>
                  <strong>{consentCopy[item.purpose].title}</strong>
                  <p style={{ color: "var(--muted)", margin: 0 }}>
                    {consentCopy[item.purpose].description}
                  </p>
                  <small style={{ color: "var(--muted)" }}>
                    Status atual: {formatConsentStatus(item.status)}. Ultima alteracao:{" "}
                    {formatDate(item.lastChangedAt)}.
                  </small>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
                  <button
                    disabled={isPending}
                    onClick={() => updateConsentStatus(item.purpose, "GRANTED")}
                    type="button"
                  >
                    Conceder
                  </button>
                  <button
                    className="ghost-button"
                    disabled={isPending}
                    onClick={() => updateConsentStatus(item.purpose, "PENDING")}
                    type="button"
                  >
                    Deixar pendente
                  </button>
                  <button
                    className="ghost-button"
                    disabled={isPending}
                    onClick={() => updateConsentStatus(item.purpose, "REVOKED")}
                    type="button"
                  >
                    Revogar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <button disabled={isPending || isLoading || consents.length === 0} onClick={saveConsentDecisions} type="button">
            {isPending ? "Salvando..." : "Salvar consentimentos"}
          </button>
        </div>

        <div style={{ display: "grid", gap: "0.5rem" }}>
          <strong>Historico recente</strong>
          {consentHistory.length === 0 ? (
            <p style={{ color: "var(--muted)", margin: 0 }}>
              Ainda nao ha eventos recentes de consentimento.
            </p>
          ) : (
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {consentHistory.slice(0, 8).map((event) => (
                <div
                  key={event.id}
                  style={{
                    borderTop: "1px solid rgba(15,23,42,0.08)",
                    display: "grid",
                    gap: "0.2rem",
                    paddingTop: "0.5rem"
                  }}
                >
                  <strong>{consentCopy[event.purpose].title}</strong>
                  <small style={{ color: "var(--muted)" }}>
                    {formatDate(event.createdAt)} | {formatConsentStatus(event.previousStatus ?? "PENDING")}{" "}
                    para {formatConsentStatus(event.newStatus)} via {event.source.toLowerCase()}.
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>

      <article
        style={{
          background: "rgba(255,255,255,0.78)",
          border: "1px solid var(--border)",
          borderRadius: "1.25rem",
          display: "grid",
          gap: "1rem",
          padding: "1rem"
        }}
      >
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <strong>Politica de retencao e anonimizacao</strong>
          <p style={{ margin: 0 }}>
            Owners podem revisar prazos por categoria, salvar a politica e executar dry-run antes
            da aplicacao manual.
          </p>
        </div>

        {retentionAccessDenied ? (
          <p style={{ color: "var(--muted)", margin: 0 }}>
            O estado de retencao esta disponivel apenas para o owner do tenant atual.
          </p>
        ) : isLoading ? (
          <p style={{ color: "var(--muted)", margin: 0 }}>Carregando politicas de retencao...</p>
        ) : retentionPolicies.length === 0 ? (
          <p style={{ color: "var(--muted)", margin: 0 }}>
            Nenhuma politica carregada para o tenant atual.
          </p>
        ) : (
          <div style={{ display: "grid", gap: "0.85rem" }}>
            {retentionPolicies.map((policy) => (
              <div
                key={policy.id}
                style={{
                  border: "1px solid rgba(15,23,42,0.08)",
                  borderRadius: "1rem",
                  display: "grid",
                  gap: "0.75rem",
                  padding: "0.9rem"
                }}
              >
                <div style={{ display: "grid", gap: "0.25rem" }}>
                  <strong>{policy.dataCategory}</strong>
                  <p style={{ color: "var(--muted)", margin: 0 }}>
                    {retentionCopy[policy.dataCategory]}
                  </p>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "0.75rem",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
                  }}
                >
                  <label style={{ display: "grid", gap: "0.35rem" }}>
                    <span>Ativo</span>
                    <input
                      checked={policy.enabled}
                      onChange={(event) =>
                        updateRetentionPolicy(policy.dataCategory, {
                          enabled: event.target.checked
                        })
                      }
                      type="checkbox"
                    />
                  </label>
                  <label style={{ display: "grid", gap: "0.35rem" }}>
                    <span>Acao</span>
                    <select
                      onChange={(event) =>
                        updateRetentionPolicy(policy.dataCategory, {
                          action: event.target.value as RetentionAction
                        })
                      }
                      value={policy.action}
                    >
                      <option value="ANONYMIZE">Anonimizar</option>
                      <option value="DELETE">Excluir</option>
                    </select>
                  </label>
                  <label style={{ display: "grid", gap: "0.35rem" }}>
                    <span>Retencao (dias)</span>
                    <input
                      min={1}
                      onChange={(event) =>
                        updateRetentionPolicy(policy.dataCategory, {
                          retentionDays: Number(event.target.value || policy.retentionDays)
                        })
                      }
                      type="number"
                      value={policy.retentionDays}
                    />
                  </label>
                </div>

                <small style={{ color: "var(--muted)" }}>
                  Base legal: {policy.legalBasis.toLowerCase().replaceAll("_", " ")}. Ultima
                  atualizacao: {formatDate(policy.updatedAt)}. Acao atual:{" "}
                  {formatRetentionAction(policy.action)}.
                </small>
              </div>
            ))}
          </div>
        )}

        {!retentionAccessDenied && retentionPolicies.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <button disabled={isPending} onClick={saveRetentionSettings} type="button">
              {isPending ? "Salvando..." : "Salvar retencao"}
            </button>
            <button className="ghost-button" disabled={isPending} onClick={() => runRetention("DRY_RUN")} type="button">
              Executar dry-run
            </button>
            <button className="ghost-button" disabled={isPending} onClick={() => runRetention("MANUAL")} type="button">
              Executar agora
            </button>
          </div>
        ) : null}

        {!retentionAccessDenied ? (
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <strong>Ultimas execucoes</strong>
            {retentionExecutions.length === 0 ? (
              <p style={{ color: "var(--muted)", margin: 0 }}>
                Nenhuma execucao de retencao registrada ate agora.
              </p>
            ) : (
              <div style={{ display: "grid", gap: "0.45rem" }}>
                {retentionExecutions.slice(0, 8).map((execution) => (
                  <div
                    key={execution.id}
                    style={{
                      borderTop: "1px solid rgba(15,23,42,0.08)",
                      display: "grid",
                      gap: "0.2rem",
                      paddingTop: "0.5rem"
                    }}
                  >
                    <strong>{execution.dataCategory}</strong>
                    <small style={{ color: "var(--muted)" }}>
                      {formatDate(execution.createdAt)} | {formatExecutionMode(execution.mode)} |{" "}
                      {formatRetentionAction(execution.action)} | {execution.affectedCount} itens
                      afetados de {execution.scannedCount} avaliados.
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {!retentionAccessDenied && retentionRunItems.length > 0 ? (
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <strong>Resultado da ultima execucao manual</strong>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {retentionRunItems.map((item) => (
                <div
                  key={item.executionId}
                  style={{
                    borderTop: "1px solid rgba(15,23,42,0.08)",
                    display: "grid",
                    gap: "0.2rem",
                    paddingTop: "0.5rem"
                  }}
                >
                  <strong>{item.dataCategory}</strong>
                  <small style={{ color: "var(--muted)" }}>
                    {item.scannedCount} registros avaliados, {item.affectedCount} afetados.
                  </small>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </article>

      <article
        style={{
          background: "rgba(255,255,255,0.78)",
          border: "1px solid var(--border)",
          borderRadius: "1.25rem",
          display: "grid",
          gap: "0.85rem",
          padding: "1rem"
        }}
      >
        <strong>Exportar meus dados</strong>
        <p style={{ margin: 0 }}>
          Gera um JSON consolidado do tenant atual, com organizacao, membros, workflows, billing,
          auditoria e metadados operacionais sem secrets.
        </p>
        <button disabled={isPending} onClick={downloadExport} type="button">
          {isPending ? "Gerando..." : "Exportar meus dados"}
        </button>
      </article>

      <article
        style={{
          background: "rgba(255,255,255,0.78)",
          border: "1px solid rgba(161,29,45,0.18)",
          borderRadius: "1.25rem",
          display: "grid",
          gap: "0.85rem",
          padding: "1rem"
        }}
      >
        <strong>Solicitar exclusao de conta e dados pessoais</strong>
        <p style={{ margin: 0 }}>
          Fluxo estrito com soft-delete, obfuscacao de PII, revogacao de sessoes e cancelamento de
          cobranca do tenant quando aplicavel.
        </p>
        <label style={{ display: "grid", gap: "0.35rem" }}>
          <span>Digite {DELETE_CONFIRMATION}</span>
          <input
            onChange={(event) => setConfirmation(event.target.value)}
            value={confirmation}
          />
        </label>
        <button
          disabled={isPending || confirmation !== DELETE_CONFIRMATION}
          onClick={requestDeletion}
          type="button"
        >
          {isPending ? "Excluindo..." : "Solicitar Exclusao de Conta"}
        </button>
      </article>

      {session ? (
        <small style={{ color: "var(--muted)" }}>
          Usuario ativo: {session.userId} no tenant {session.tenantId}
        </small>
      ) : null}
      {error ? <p style={{ color: "#a11d2d", margin: 0 }}>{error}</p> : null}
      {notice ? <p style={{ color: "var(--accent-strong)", margin: 0 }}>{notice}</p> : null}
    </section>
  );
}
