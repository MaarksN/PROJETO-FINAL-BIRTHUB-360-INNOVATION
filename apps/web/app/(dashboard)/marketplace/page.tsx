// @ts-nocheck
// 
import { getWebConfig } from "@birthub/config/web";
import Link from "next/link";

import { PackInstaller } from "../../../components/wizards/PackInstaller";
import {
  fetchAgentChangelog,
  fetchAgentDocs,
  fetchMarketplaceRecommendations,
  fetchMarketplaceSearch
} from "../../../lib/marketplace-api.server";

type SearchParams = Record<string, string | string[] | undefined>;

const EXECUTIVE_PREMIUM_TAG = "executive-premium";
const INSTALLER_PACK_LIMIT = 8;

function readParam(value: string | string[] | undefined): string {
  if (!value) {
    return "";
  }

  return Array.isArray(value) ? value[0] ?? "" : value;
}

export default async function MarketplacePage({
  searchParams
}: Readonly<{
  searchParams?: Promise<SearchParams>;
}>) {
  const config = getWebConfig();
  const resolvedParams = (await searchParams) ?? {};

  const query = readParam(resolvedParams.q);
  const domain = readParam(resolvedParams.domain);
  const level = readParam(resolvedParams.level);
  const tag = readParam(resolvedParams.tags);
  const tenantIndustry = readParam(resolvedParams.tenantIndustry) || "sales";
  const selectedAgentId = readParam(resolvedParams.agentId);

  const [search, recommendations, executivePremium] = await Promise.all([
    fetchMarketplaceSearch({
      domain,
      level,
      page: "1",
      pageSize: "12",
      q: query,
      tags: tag
    }),
    fetchMarketplaceRecommendations(tenantIndustry),
    fetchMarketplaceSearch({
      page: "1",
      pageSize: "24",
      useCase: "executive-premium"
    })
  ]);

  const [docs, changelog] = selectedAgentId
    ? await Promise.all([
        fetchAgentDocs(selectedAgentId).catch(() => null),
        fetchAgentChangelog(selectedAgentId).catch(() => null)
      ])
    : [null, null];

  const availablePacks = (() => {
    const dedupe = new Set<string>();
    const merged = [...executivePremium.results, ...search.results].map((result) => ({
      description: result.agent.description,
      id: result.agent.id,
      name: result.agent.name
    }));

    return merged.filter((item) => {
      if (dedupe.has(item.id)) {
        return false;
      }

      dedupe.add(item.id);
      return true;
    });
  })();

  return (
    <main
      style={{
        alignItems: "start",
        display: "grid",
        gap: "1.5rem",
        gridTemplateColumns: selectedAgentId ? "minmax(0, 1fr) 360px" : "minmax(0, 1fr)",
        padding: "1.5rem"
      }}
    >
      <div style={{ display: "grid", gap: "1.5rem" }}>
      <header style={{ display: "grid", gap: "0.5rem" }}>
        <small style={{ color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Agent Marketplace
        </small>
        <h1 style={{ margin: 0 }}>Descoberta de Agent Packs</h1>
        <p style={{ color: "var(--muted)", margin: 0 }}>
          Busca full-text com facets por domain, level e tags. Sugestoes personalizadas para o ramo do tenant.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <Link href="/packs">Ver packs instalados</Link>
          <Link href="/settings/billing#agent-budget">Gerenciar budget por agente</Link>
          <Link href={`/marketplace?tags=${encodeURIComponent(EXECUTIVE_PREMIUM_TAG)}`}>
            Ver colecao premium executiva
          </Link>
        </div>
      </header>

      {executivePremium.results.length > 0 ? (
        <section
          style={{
            background: "linear-gradient(135deg, rgba(15,23,42,0.94), rgba(30,58,138,0.92))",
            border: "1px solid rgba(148, 163, 184, 0.28)",
            borderRadius: 20,
            color: "#f8fafc",
            display: "grid",
            gap: "1rem",
            padding: "1.15rem"
          }}
        >
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <small style={{ letterSpacing: "0.08em", opacity: 0.8, textTransform: "uppercase" }}>
              Collection Spotlight
            </small>
            <h2 style={{ margin: 0 }}>Executive Premium Agents Collection</h2>
            <p style={{ margin: 0, maxWidth: 860, opacity: 0.92 }}>
              Linha oficial com camadas premium de evidencia, memoria decisoria, radar de risco,
              handoff entre especialistas e governanca reforcada para contexto executivo.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
              <span
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 999,
                  padding: "0.35rem 0.7rem"
                }}
              >
                {executivePremium.total} agentes premium
              </span>
              <span
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 999,
                  padding: "0.35rem 0.7rem"
                }}
              >
                14 camadas premium compartilhadas
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gap: "0.8rem", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
            {executivePremium.results.map((item) => (
              <article
                key={`spotlight-${item.agent.id}`}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  borderRadius: 16,
                  display: "grid",
                  gap: "0.45rem",
                  padding: "0.95rem"
                }}
              >
                <strong>{item.agent.name}</strong>
                <small style={{ opacity: 0.82 }}>{item.agent.id}</small>
                <p style={{ margin: 0, opacity: 0.92 }}>{item.agent.description}</p>
                <small>
                  {item.tags.domain.join(", ")} / {item.tags.level.join(", ")}
                </small>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <Link
                    href={`/marketplace?agentId=${encodeURIComponent(item.agent.id)}`}
                    style={{ color: "#f8fafc" }}
                  >
                    Abrir docs inline
                  </Link>
                  <Link
                    href={`/marketplace?tags=${encodeURIComponent(EXECUTIVE_PREMIUM_TAG)}&agentId=${encodeURIComponent(item.agent.id)}`}
                    style={{ color: "#bfdbfe" }}
                  >
                    Ver na busca premium
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <PackInstaller apiUrl={config.NEXT_PUBLIC_API_URL} availablePacks={availablePacks.slice(0, INSTALLER_PACK_LIMIT)} />

      <form
        style={{
          background: "rgba(255,255,255,0.76)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          display: "grid",
          gap: "0.8rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          padding: "1rem"
        }}
      >
        <label>
          Busca
          <input defaultValue={query} name="q" placeholder="Ex: sales, budget, legal" type="text" />
        </label>
        <label>
          Domain
          <input defaultValue={domain} name="domain" placeholder="sales, finance, ops" type="text" />
        </label>
        <label>
          Level
          <input defaultValue={level} name="level" placeholder="c-level, department" type="text" />
        </label>
        <label>
          Tag
          <input defaultValue={tag} name="tags" placeholder="retention, strategy" type="text" />
        </label>
        <label>
          Tenant Industry
          <input defaultValue={tenantIndustry} name="tenantIndustry" placeholder="sales" type="text" />
        </label>
        <button style={{ alignSelf: "end" }} type="submit">
          Filtrar
        </button>
      </form>

      {executivePremium.results.length ? (
        <section style={{ display: "grid", gap: "0.8rem" }}>
          <div style={{ alignItems: "baseline", display: "flex", gap: "0.6rem" }}>
            <h2 style={{ margin: 0 }}>Executive Premium v1</h2>
            <small style={{ color: "var(--muted)" }}>
              {executivePremium.total} agentes premium governados para suites executivas
            </small>
          </div>
          <div style={{ display: "grid", gap: "0.8rem", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
            {executivePremium.results.map((item) => (
              <article
                key={item.agent.id}
                style={{
                  background: "rgba(11, 69, 86, 0.08)",
                  border: "1px solid rgba(11, 69, 86, 0.18)",
                  borderRadius: 14,
                  display: "grid",
                  gap: "0.45rem",
                  padding: "0.9rem"
                }}
              >
                <strong>{item.agent.name}</strong>
                <small style={{ color: "var(--muted)" }}>{item.agent.id}</small>
                <p style={{ margin: 0 }}>{item.agent.description}</p>
                <small>Domain: {item.tags.domain.join(", ")}</small>
                <small>Persona: {item.tags.persona.join(", ")}</small>
                <small>Use-case: {item.tags["use-case"].join(", ")}</small>
                <Link href={`/marketplace?agentId=${encodeURIComponent(item.agent.id)}`}>Abrir docs inline</Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section style={{ display: "grid", gap: "0.8rem" }}>
        <h2 style={{ margin: 0 }}>Sugestoes para {recommendations.tenantIndustry}</h2>
        <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {recommendations.recommendations.map((item) => (
            <article
              key={item.agent.id}
              style={{
                background: "rgba(30, 58, 138,0.08)",
                border: "1px solid rgba(30, 58, 138,0.18)",
                borderRadius: 14,
                padding: "0.85rem"
              }}
            >
              <strong>{item.agent.name}</strong>
              <p style={{ marginBottom: "0.4rem" }}>{item.agent.description}</p>
              <small>Score: {item.recommendationScore}</small>
            </article>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gap: "0.8rem" }}>
        <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0 }}>Resultados ({search.total})</h2>
          <Link href="/marketplace/compare">Comparar capabilities</Link>
        </div>

        <div style={{ color: "var(--muted)", display: "grid", gap: "0.2rem" }}>
          <small>Facets domain: {Object.keys(search.facets.domains).join(", ") || "-"}</small>
          <small>Facets level: {Object.keys(search.facets.levels).join(", ") || "-"}</small>
          <small>Facets persona: {Object.keys(search.facets.personas).join(", ") || "-"}</small>
        </div>

        <div style={{ display: "grid", gap: "0.9rem", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
          {search.results.map((item) => (
            <article
              key={item.agent.id}
              style={{
                backdropFilter: "blur(10px)",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                boxShadow: "0 12px 32px rgba(30, 58, 138,0.08)",
                display: "grid",
                gap: "0.45rem",
                padding: "0.95rem"
              }}
            >
              <strong>{item.agent.name}</strong>
              <small style={{ color: "var(--muted)" }}>{item.agent.id}</small>
              {item.tags["use-case"].includes(EXECUTIVE_PREMIUM_TAG) ? (
                <small
                  style={{
                    color: "var(--accent-strong)",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase"
                  }}
                >
                  Executive Premium
                </small>
              ) : null}
              <p style={{ margin: 0 }}>{item.agent.description}</p>
              <small>Tags: {item.tags.domain.join(", ")} / {item.tags.level.join(", ")}</small>
              <small>Use-case: {item.tags["use-case"].join(", ")}</small>
              <small>Tools: {item.tools.map((tool) => tool.name).join(", ")}</small>
              <small style={{ color: "var(--accent-strong)" }}>Score: {item.score}</small>
              <small>
                Approval: {item.approvalRate ? `${Math.round(item.approvalRate * 100)}%` : "Sem votos"} · Feedbacks:{" "}
                {item.feedbackCount ?? 0}
              </small>
              <Link href={`/marketplace?agentId=${encodeURIComponent(item.agent.id)}`}>Abrir docs inline</Link>
            </article>
          ))}
        </div>
      </section>

      </div>

      {docs && selectedAgentId ? (
        <aside
          style={{
            background: "rgba(255,255,255,0.94)",
            border: "1px solid var(--border)",
            borderRadius: 18,
            display: "grid",
            gap: "0.9rem",
            padding: "1rem",
            position: "sticky",
            top: "1rem"
          }}
        >
          <div>
            <small style={{ color: "var(--muted)", textTransform: "uppercase" }}>Side Drawer</small>
            <h3 style={{ margin: "0.2rem 0 0" }}>{selectedAgentId}</h3>
          </div>
          <pre
            style={{
              background: "#f8f6ef",
              borderRadius: 12,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              margin: 0,
              maxHeight: 360,
              overflowX: "auto",
              padding: "0.8rem",
              whiteSpace: "pre-wrap"
            }}
          >
            {docs.docs}
          </pre>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <strong>Changelog visual</strong>
            {changelog?.changelog?.length ? (
              changelog.changelog.map((item) => (
                <div
                  key={item}
                  style={{
                    background: "rgba(30, 58, 138,0.06)",
                    border: "1px solid rgba(30, 58, 138,0.12)",
                    borderRadius: 12,
                    padding: "0.7rem"
                  }}
                >
                  {item}
                </div>
              ))
            ) : (
              <small style={{ color: "var(--muted)" }}>Sem changelog disponivel.</small>
            )}
          </div>
        </aside>
      ) : null}
    </main>
  );
}
