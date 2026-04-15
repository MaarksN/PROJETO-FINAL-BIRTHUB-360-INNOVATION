import Link from "next/link";

import { ProductPageHeader } from "../../../components/dashboard/page-fragments";
import { SalesOsShell } from "../../../components/sales-os/SalesOsShell";
import { fetchMarketplaceSearch } from "../../../lib/marketplace-api.server";
import { SALES_OS_MODULES, salesOsTools } from "../../../lib/sales-os/catalog";
import { getRequestLocale } from "../../../lib/i18n.server";

const EXECUTIVE_PREMIUM_TAG = "executive-premium";
const EXECUTIVE_PREMIUM_PAGE_SIZE = 4;

const toolCount = salesOsTools.length;
const moduleCount = SALES_OS_MODULES.length;
const roleplayCount = salesOsTools.filter((tool) => tool.isChat).length;

const pageCopy = {
  "en-US": {
    badge: "Unified Sales OS",
    back: "Back to dashboard",
    catalogLoading: "Loading the Sales OS catalog...",
    copied: "Copied",
    copyOutput: "Copy",
    description:
      "A single operating surface for pre-sales, sales, marketing, CS, revops, finance, and risk, now inside the canonical BirthHub dashboard.",
    emptySearchDescription: "Refine your search or switch modules to find another operation.",
    emptySearchTitle: "No tools found",
    emptyWorkspaceDescription: "Select a tool to open its playbook, add context, and execute it.",
    emptyWorkspaceTitle: "Choose a tool",
    imageBriefHint: "Image brief",
    mentorDescription: "Contextual guidance based on the active module.",
    mentorGreeting: "I am your operating mentor for",
    mentorInputPlaceholder: "Ask about strategy, scripts, risk, or the next move...",
    mentorTitle: "Sales OS Mentor",
    micUnsupported: "Voice recognition is not available in this browser.",
    moduleLabel: "modules",
    moduleSearchPlaceholder: "Search modules by function, team, or description...",
    noImageSelected: "No image attached.",
    openSdrPlatform: "SDR platform",
    openMentor: "Mentor",
    outputEmpty: "Output will appear here after you run the protocol.",
    premiumAgentsLabel: "premium executive agents",
    premiumDescription:
      "Executive premium agents add evidence scorecards, governance shield, decision memory, and board-ready handoffs for C-level operations.",
    premiumLayersLabel: "premium layers",
    premiumSpotlight: "Executive Premium Collection",
    premiumViewAll: "Open executive premium collection",
    outputTitle: "Output",
    removeImage: "Remove image",
    roleplayCountLabel: "roleplays",
    roleplayInputPlaceholder: "Write your answer or record an objection...",
    running: "Running...",
    runProtocol: "Run protocol",
    send: "Send",
    title: "BirthHub Sales OS",
    toolCountLabel: "tools",
    toolSearchPlaceholder: "Search tools by name, prompt, or description...",
    uploadImage: "Attach image for analysis",
    visionHint: "Vision ready"
  },
  "pt-BR": {
    badge: "Sales OS unificado",
    back: "Voltar para dashboard",
    catalogLoading: "Carregando catalogo do Sales OS...",
    copied: "Copiado",
    copyOutput: "Copiar",
    description:
      "Superficie unica para pre-sales, sales, marketing, CS, revops, financeiro e risco, integrada ao dashboard canonico do BirthHub.",
    emptySearchDescription: "Refine sua busca ou troque de modulo para encontrar outra operacao.",
    emptySearchTitle: "Nenhuma ferramenta encontrada",
    emptyWorkspaceDescription: "Selecione uma ferramenta para abrir o playbook, preencher contexto e executar.",
    emptyWorkspaceTitle: "Escolha uma ferramenta",
    imageBriefHint: "Image brief",
    mentorDescription: "Mentoria contextual baseada no modulo ativo.",
    mentorGreeting: "Sou seu mentor operacional para",
    mentorInputPlaceholder: "Pergunte por estrategia, script, risco ou proximo passo...",
    mentorTitle: "Mentor Sales OS",
    micUnsupported: "Reconhecimento de voz nao disponivel neste navegador.",
    moduleLabel: "modulos",
    moduleSearchPlaceholder: "Buscar modulo por area, funcao ou descricao...",
    noImageSelected: "Nenhuma imagem anexada.",
    openSdrPlatform: "Plataforma SDR",
    openMentor: "Mentor",
    outputEmpty: "A saida vai aparecer aqui assim que voce rodar o protocolo.",
    premiumAgentsLabel: "agentes executivos premium",
    premiumDescription:
      "Os agentes executivos premium adicionam score de evidencia, governanca reforcada, memoria decisoria e handoff pronto para board e C-level.",
    premiumLayersLabel: "camadas premium",
    premiumSpotlight: "Colecao Premium Executiva",
    premiumViewAll: "Abrir colecao premium executiva",
    outputTitle: "Saida",
    removeImage: "Remover imagem",
    roleplayCountLabel: "roleplays",
    roleplayInputPlaceholder: "Escreva sua resposta ou grave uma objecao...",
    running: "Executando...",
    runProtocol: "Rodar protocolo",
    send: "Enviar",
    title: "BirthHub Sales OS",
    toolCountLabel: "ferramentas",
    toolSearchPlaceholder: "Buscar ferramenta por nome, prompt ou descricao...",
    uploadImage: "Anexar imagem para analise",
    visionHint: "Vision ready"
  }
} as const;

export default async function SalesOsPage() {
  const locale = await getRequestLocale();
  const copy = pageCopy[locale] ?? pageCopy["pt-BR"];
  const executivePremium = await fetchMarketplaceSearch({
    page: "1",
    pageSize: String(EXECUTIVE_PREMIUM_PAGE_SIZE),
    tags: EXECUTIVE_PREMIUM_TAG
  }).catch(() => null);
  const executivePremiumCount = executivePremium?.total ?? 0;

  return (
    <main className="dashboard-content">
      <ProductPageHeader
        actions={
          <div className="hero-actions">
            <span className="badge">{moduleCount} {copy.moduleLabel}</span>
            <span className="badge">{toolCount} {copy.toolCountLabel}</span>
            <span className="badge">{roleplayCount} {copy.roleplayCountLabel}</span>
            {executivePremiumCount > 0 ? (
              <span className="badge">{executivePremiumCount} {copy.premiumAgentsLabel}</span>
            ) : null}
            <Link className="ghost-button" href="/sales-os/sdr-automatico">
              {copy.openSdrPlatform}
            </Link>
            <Link className="ghost-button" href={`/marketplace?tags=${encodeURIComponent(EXECUTIVE_PREMIUM_TAG)}`}>
              {copy.premiumViewAll}
            </Link>
            <Link className="ghost-button" href="/dashboard">
              {copy.back}
            </Link>
          </div>
        }
        badge={copy.badge}
        description={copy.description}
        title={copy.title}
      />

      {executivePremium?.results?.length ? (
        <section
          style={{
            background: "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,58,138,0.92))",
            border: "1px solid rgba(148, 163, 184, 0.26)",
            borderRadius: "1.5rem",
            color: "#f8fafc",
            display: "grid",
            gap: "1rem",
            marginBottom: "1.25rem",
            padding: "1.1rem"
          }}
        >
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <small style={{ letterSpacing: "0.08em", opacity: 0.8, textTransform: "uppercase" }}>
              {copy.premiumSpotlight}
            </small>
            <strong style={{ fontSize: "1.1rem" }}>{copy.premiumDescription}</strong>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              <span
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 999,
                  padding: "0.35rem 0.75rem"
                }}
              >
                {executivePremiumCount} {copy.premiumAgentsLabel}
              </span>
              <span
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 999,
                  padding: "0.35rem 0.75rem"
                }}
              >
                14 {copy.premiumLayersLabel}
              </span>
            </div>
          </div>

          <div style={{ display: "grid", gap: "0.8rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {executivePremium.results.map((item) => (
              <article
                key={item.agent.id}
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: 16,
                  display: "grid",
                  gap: "0.45rem",
                  padding: "0.95rem"
                }}
              >
                <strong>{item.agent.name}</strong>
                <small style={{ opacity: 0.8 }}>{item.tags.domain.join(", ")} / {item.tags.level.join(", ")}</small>
                <p style={{ margin: 0, opacity: 0.92 }}>{item.agent.description}</p>
                <Link
                  href={`/marketplace?tags=${encodeURIComponent(EXECUTIVE_PREMIUM_TAG)}&agentId=${encodeURIComponent(item.agent.id)}`}
                  style={{ color: "#bfdbfe" }}
                >
                  {copy.premiumViewAll}
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <SalesOsShell copy={copy} />
    </main>
  );
}
