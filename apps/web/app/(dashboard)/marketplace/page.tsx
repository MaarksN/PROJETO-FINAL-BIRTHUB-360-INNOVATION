import { getWebConfig } from "@birthub/config";
import Link from "next/link";

import { PackInstaller } from "../../../components/wizards/PackInstaller.js";
import {
  fetchAgentDocs,
  fetchMarketplaceRecommendations,
  fetchMarketplaceSearch
} from "../../../lib/marketplace-api.js";

type SearchParams = Record<string, string | string[] | undefined>;

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

  const [search, recommendations] = await Promise.all([
    fetchMarketplaceSearch({
      domain,
      level,
      page: "1",
      pageSize: "12",
      q: query,
      tags: tag
    }),
    fetchMarketplaceRecommendations(tenantIndustry)
  ]);

  const docs = selectedAgentId ? await fetchAgentDocs(selectedAgentId).catch(() => null) : null;

  const availablePacks = search.results.map((result) => ({
    description: result.agent.description,
    id: result.agent.id,
    name: result.agent.name
  }));

  return (
    <main style={{ display: "grid", gap: "1.5rem", padding: "1.5rem" }}>
      <header style={{ display: "grid", gap: "0.5rem" }}>
        <small style={{ color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Agent Marketplace
        </small>
        <h1 style={{ margin: 0 }}>Descoberta de Agent Packs</h1>
        <p style={{ color: "var(--muted)", margin: 0 }}>
          Busca full-text com facets por domain, level e tags. Sugestoes personalizadas para o ramo do tenant.
        </p>
      </header>

      <PackInstaller apiUrl={config.NEXT_PUBLIC_API_URL} availablePacks={availablePacks.slice(0, 8)} />

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

      <section style={{ display: "grid", gap: "0.8rem" }}>
        <h2 style={{ margin: 0 }}>Sugestoes para {recommendations.tenantIndustry}</h2>
        <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {recommendations.recommendations.map((item) => (
            <article
              key={item.agent.id}
              style={{
                background: "rgba(19,93,102,0.08)",
                border: "1px solid rgba(19,93,102,0.18)",
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
                boxShadow: "0 12px 32px rgba(19,93,102,0.08)",
                display: "grid",
                gap: "0.45rem",
                padding: "0.95rem"
              }}
            >
              <strong>{item.agent.name}</strong>
              <small style={{ color: "var(--muted)" }}>{item.agent.id}</small>
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

      {docs ? (
        <section
          style={{
            background: "rgba(255,255,255,0.88)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: "1rem"
          }}
        >
          <h3 style={{ marginTop: 0 }}>Documentacao Inline ({selectedAgentId})</h3>
          <pre
            style={{
              background: "#f8f6ef",
              borderRadius: 12,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              overflowX: "auto",
              padding: "0.8rem",
              whiteSpace: "pre-wrap"
            }}
          >
            {docs.docs}
          </pre>
        </section>
      ) : null}
    </main>
  );
}
