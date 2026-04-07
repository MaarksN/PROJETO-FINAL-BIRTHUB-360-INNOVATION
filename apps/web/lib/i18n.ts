export type SupportedLocale = "pt-BR";

type Dictionary = {
  consentBanner: {
    accept: string;
    description: string;
    reject: string;
    settings: string;
    title: string;
  };
  navbar: {
    identityDescription: string;
    identityTitle: string;
    items: Array<{
      href: string;
      label: string;
    }>;
  };
};

const dictionaries: Record<SupportedLocale, Dictionary> = {
  "pt-BR": {
    consentBanner: {
      accept: "Aceitar analytics",
      description:
        "Usamos telemetria sem PII para medir pageviews, saude do produto e execucao de agentes. Se voce rejeitar, o tracker externo permanece desligado.",
      reject: "Rejeitar",
      settings: "Abrir central LGPD",
      title: "Consentimento de analytics"
    },
    navbar: {
      identityDescription: "Experiencia conectada ao produto",
      identityTitle: "Central de Operacao",
      items: [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/patients", label: "Pacientes" },
        { href: "/appointments", label: "Agenda" },
        { href: "/workflows", label: "Workflows" },
        { href: "/notifications", label: "Notificacoes" },
        { href: "/analytics", label: "Analytics" },
        { href: "/conversations", label: "Conversas" },
        { href: "/reports", label: "Relatorios" },
        { href: "/onboarding", label: "Onboarding" }
      ]
    }
  }
};

export function getDictionary(locale: SupportedLocale = "pt-BR"): Dictionary {
  return dictionaries[locale];
}

export function formatPtBrDateTime(
  value: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("pt-BR", options).format(date);
}
