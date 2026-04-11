"use client";

import Link from "next/link";

import { useI18n } from "../../providers/I18nProvider";
import {
  ProductEmptyState,
  ProductPageHeader
} from "./page-fragments";

export function ClinicalWorkspaceDisabledState() {
  const { locale } = useI18n();
  const copy =
    locale === "pt-BR"
      ? {
          actionPrimary: "Voltar ao dashboard",
          actionSecondary: "Abrir workflows",
          badge: "Workspace clinico desativado",
          description:
            "Pacientes, agenda, prontuarios e integrações FHIR foram retirados do fluxo principal desta implantacao porque o schema e os fluxos ativos nao sustentam esse dominio hoje.",
          emptyDescription:
            "O modulo foi preservado no codigo, mas ficou explicitamente fora da navegacao e das rotas principais ate que o schema clinico e de interoperabilidade volte a existir de ponta a ponta.",
          emptyTitle: "Superficie clinica fora do produto ativo",
          title: "Modulo clinico temporariamente indisponivel"
        }
      : {
          actionPrimary: "Back to dashboard",
          actionSecondary: "Open workflows",
          badge: "Clinical workspace disabled",
          description:
            "Patients, scheduling, clinical records, and FHIR surfaces were removed from the main product flow because the active schema and runtime do not sustain that domain today.",
          emptyDescription:
            "The module was kept in code, but it is now explicitly outside navigation and the main routes until the clinical and interoperability schema returns end to end.",
          emptyTitle: "Clinical surface is outside the active product",
          title: "Clinical module is temporarily unavailable"
        };

  return (
    <main className="dashboard-content">
      <ProductPageHeader
        badge={copy.badge}
        description={copy.description}
        title={copy.title}
      />
      <ProductEmptyState
        action={
          <div className="hero-actions">
            <Link href="/dashboard">{copy.actionPrimary}</Link>
            <Link className="ghost-button" href="/workflows">
              {copy.actionSecondary}
            </Link>
          </div>
        }
        description={copy.emptyDescription}
        title={copy.emptyTitle}
      />
    </main>
  );
}
