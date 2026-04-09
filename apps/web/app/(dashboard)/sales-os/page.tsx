import Link from "next/link";

import { ProductPageHeader } from "../../../components/dashboard/page-fragments";
import { SalesOsShell } from "../../../components/sales-os/SalesOsShell";
import { SALES_OS_MODULES, salesOsTools } from "../../../lib/sales-os/catalog";
import { getRequestLocale } from "../../../lib/i18n.server";

const toolCount = salesOsTools.length;
const moduleCount = SALES_OS_MODULES.length;
const roleplayCount = salesOsTools.filter((tool) => tool.isChat).length;

export default async function SalesOsPage() {
  const locale = await getRequestLocale();
  const isPtBr = locale === "pt-BR";

  return (
    <main className="dashboard-content">
      <ProductPageHeader
        actions={
          <div className="hero-actions">
            <span className="badge">{moduleCount} {isPtBr ? "modulos" : "modules"}</span>
            <span className="badge">{toolCount} {isPtBr ? "ferramentas" : "tools"}</span>
            <span className="badge">{roleplayCount} {isPtBr ? "roleplays" : "roleplays"}</span>
            <Link className="ghost-button" href="/dashboard">
              {isPtBr ? "Voltar para dashboard" : "Back to dashboard"}
            </Link>
          </div>
        }
        badge={isPtBr ? "Sales OS unificado" : "Unified Sales OS"}
        description={
          isPtBr
            ? "Superficie unica para pre-sales, sales, marketing, CS, revops, financeiro e risco, integrada ao dashboard canonico do BirthHub."
            : "A single operating surface for pre-sales, sales, marketing, CS, revops, finance, and risk, now inside the canonical BirthHub dashboard."
        }
        title={isPtBr ? "BirthHub Sales OS" : "BirthHub Sales OS"}
      />

      <SalesOsShell
        copy={{
          catalogLoading: isPtBr ? "Carregando catalogo do Sales OS..." : "Loading the Sales OS catalog...",
          copied: isPtBr ? "Copiado" : "Copied",
          copyOutput: isPtBr ? "Copiar" : "Copy",
          emptySearchDescription: isPtBr
            ? "Refine sua busca ou troque de modulo para encontrar outra operacao."
            : "Refine your search or switch modules to find another operation.",
          emptySearchTitle: isPtBr ? "Nenhuma ferramenta encontrada" : "No tools found",
          emptyWorkspaceDescription: isPtBr
            ? "Selecione uma ferramenta para abrir o playbook, preencher contexto e executar."
            : "Select a tool to open its playbook, add context, and execute it.",
          emptyWorkspaceTitle: isPtBr ? "Escolha uma ferramenta" : "Choose a tool",
          imageBriefHint: isPtBr ? "Image brief" : "Image brief",
          mentorDescription: isPtBr
            ? "Mentoria contextual baseada no modulo ativo."
            : "Contextual guidance based on the active module.",
          mentorGreeting: isPtBr ? "Sou seu mentor operacional para" : "I am your operating mentor for",
          mentorInputPlaceholder: isPtBr
            ? "Pergunte por estrategia, script, risco ou proximo passo..."
            : "Ask about strategy, scripts, risk, or the next move...",
          mentorTitle: isPtBr ? "Mentor Sales OS" : "Sales OS Mentor",
          micUnsupported: isPtBr
            ? "Reconhecimento de voz nao disponivel neste navegador."
            : "Voice recognition is not available in this browser.",
          moduleSearchPlaceholder: isPtBr
            ? "Buscar modulo por area, funcao ou descricao..."
            : "Search modules by function, team, or description...",
          noImageSelected: isPtBr ? "Nenhuma imagem anexada." : "No image attached.",
          openMentor: isPtBr ? "Mentor" : "Mentor",
          outputEmpty: isPtBr
            ? "A saida vai aparecer aqui assim que voce rodar o protocolo."
            : "Output will appear here after you run the protocol.",
          outputTitle: isPtBr ? "Saida" : "Output",
          removeImage: isPtBr ? "Remover imagem" : "Remove image",
          roleplayInputPlaceholder: isPtBr
            ? "Escreva sua resposta ou grave uma objecao..."
            : "Write your answer or record an objection...",
          running: isPtBr ? "Executando..." : "Running...",
          runProtocol: isPtBr ? "Rodar protocolo" : "Run protocol",
          send: isPtBr ? "Enviar" : "Send",
          toolSearchPlaceholder: isPtBr
            ? "Buscar ferramenta por nome, prompt ou descricao..."
            : "Search tools by name, prompt, or description...",
          uploadImage: isPtBr ? "Anexar imagem para analise" : "Attach image for analysis",
          visionHint: isPtBr ? "Vision ready" : "Vision ready"
        }}
      />
    </main>
  );
}
