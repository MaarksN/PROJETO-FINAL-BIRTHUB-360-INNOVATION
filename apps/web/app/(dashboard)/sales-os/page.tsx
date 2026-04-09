// @ts-nocheck
import Link from "next/link";

import { ProductPageHeader } from "../../../components/dashboard/page-fragments";
import { SalesOsShell } from "../../../components/sales-os/SalesOsShell";
import { SALES_OS_MODULES, salesOsTools } from "../../../lib/sales-os/catalog";
import { getRequestLocale } from "../../../lib/i18n.server";

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
    openMentor: "Mentor",
    outputEmpty: "Output will appear here after you run the protocol.",
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
    openMentor: "Mentor",
    outputEmpty: "A saida vai aparecer aqui assim que voce rodar o protocolo.",
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

  return (
    <main className="dashboard-content">
      <ProductPageHeader
        actions={
          <div className="hero-actions">
            <span className="badge">{moduleCount} {copy.moduleLabel}</span>
            <span className="badge">{toolCount} {copy.toolCountLabel}</span>
            <span className="badge">{roleplayCount} {copy.roleplayCountLabel}</span>
            <Link className="ghost-button" href="/dashboard">
              {copy.back}
            </Link>
          </div>
        }
        badge={copy.badge}
        description={copy.description}
        title={copy.title}
      />

      <SalesOsShell copy={copy} />
    </main>
  );
}
