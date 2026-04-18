// @ts-expect-error TODO: remover suppressão ampla
import { ProductLoadingShell } from "../../../components/dashboard/page-fragments.js";

export default function AnalyticsLoading() {
  return (
    <ProductLoadingShell
      description="Buscando metricas executivas, coortes e uso agregado."
      title="Carregando analytics"
    />
  );
}

