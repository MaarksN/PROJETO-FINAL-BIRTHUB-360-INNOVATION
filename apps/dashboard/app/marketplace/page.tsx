import { MarketplacePackGrid } from "../../components/marketplace-pack-grid";

export default function MarketplacePage() {
  return (
    <main className="container">
      <header className="header">
        <div>
          <h1>Marketplace de Packs</h1>
          <p className="muted">
            Explore packs verificados por domínio com descrição, avaliação média
            e agentes incluídos.
          </p>
        </div>
      </header>

      <MarketplacePackGrid />
    </main>
  );
}
