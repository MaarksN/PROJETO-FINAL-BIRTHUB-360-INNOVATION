type PackCard = {
  id: string;
  name: string;
  domain: string;
  description: string;
  rating: number;
  totalReviews: number;
  agents: string[];
};

const packCards: PackCard[] = [
  {
    id: "sales-acceleration-suite",
    name: "Sales Acceleration Suite",
    domain: "Comercial",
    description:
      "Playbooks para prospecção, cadência automática e priorização de oportunidades com IA.",
    rating: 4.8,
    totalReviews: 238,
    agents: ["SDR", "BDR", "Closer"],
  },
  {
    id: "customer-success-command",
    name: "Customer Success Command",
    domain: "Pós-venda",
    description:
      "Monitoramento de saúde, alertas preditivos de churn e rotinas de expansão por conta.",
    rating: 4.6,
    totalReviews: 174,
    agents: ["Account Manager", "KAM", "Pós-venda"],
  },
  {
    id: "compliance-guardian",
    name: "Compliance Guardian",
    domain: "Jurídico",
    description:
      "Fluxos de revisão contratual, trilha de auditoria e políticas LGPD com automação documental.",
    rating: 4.9,
    totalReviews: 119,
    agents: ["Jurídico", "RevOps", "Sales Ops"],
  },
  {
    id: "ops-insight-hub",
    name: "Ops Insight Hub",
    domain: "Operações",
    description:
      "Consolida dados de funil, produtividade e SLA em painéis acionáveis para líderes.",
    rating: 4.7,
    totalReviews: 201,
    agents: ["Analista", "Gerente Comercial", "Financeiro"],
  },
];

function renderStars(rating: number) {
  const rounded = Math.round(rating);
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

export function MarketplacePackGrid() {
  return (
    <section
      className="marketplace-grid"
      aria-label="Lista de packs disponíveis no marketplace"
    >
      {packCards.map((pack) => (
        <article key={pack.id} className="card marketplace-card">
          <header>
            <p className="marketplace-domain">{pack.domain}</p>
            <h2>{pack.name}</h2>
          </header>

          <p>{pack.description}</p>

          <div
            className="marketplace-rating"
            aria-label={`Avaliação ${pack.rating} de 5`}
          >
            <span aria-hidden="true">{renderStars(pack.rating)}</span>
            <strong>{pack.rating.toFixed(1)}</strong>
            <small>({pack.totalReviews} avaliações)</small>
          </div>

          <ul className="chip-list" aria-label="Agentes incluídos no pack">
            {pack.agents.map((agent) => (
              <li key={agent} className="pill">
                {agent}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
