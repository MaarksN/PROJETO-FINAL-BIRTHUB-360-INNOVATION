import Link from "next/link";

import { ProductPageHeader } from "../../../../components/dashboard/page-fragments";
import { SdrAutomaticPlatform } from "../../../../components/sales-os/sdr-automatic-platform";
import { getRequestLocale } from "../../../../lib/i18n.server";

const pageCopy = {
  "en-US": {
    back: "Back to Sales OS",
    badge: "Embedded prototype",
    description:
      "Dedicated SDR operating surface with predictive ranking, qualification assist, smart scheduling, and guided handoff.",
    home: "Dashboard",
    title: "BirthHub SDR Automatic"
  },
  "pt-BR": {
    back: "Voltar para Sales OS",
    badge: "Prototipo incorporado",
    description:
      "Superficie dedicada para SDR com ranking preditivo, apoio de qualificacao, agendamento inteligente e handoff guiado.",
    home: "Dashboard",
    title: "BirthHub SDR Automatic"
  }
} as const;

export default async function SdrAutomaticPage() {
  const locale = await getRequestLocale();
  const copy = pageCopy[locale] ?? pageCopy["pt-BR"];

  return (
    <main className="dashboard-content">
      <ProductPageHeader
        actions={
          <div className="hero-actions">
            <Link href="/sales-os">{copy.back}</Link>
            <Link className="ghost-button" href="/dashboard">
              {copy.home}
            </Link>
          </div>
        }
        badge={copy.badge}
        description={copy.description}
        title={copy.title}
      />

      <SdrAutomaticPlatform locale={locale} />
    </main>
  );
}
