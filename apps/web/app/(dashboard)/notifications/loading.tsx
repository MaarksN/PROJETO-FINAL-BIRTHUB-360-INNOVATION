// @ts-expect-error TODO: remover suppressão ampla
import { ProductLoadingShell } from "../../../components/dashboard/page-fragments.js";

export default function NotificationsLoading() {
  return (
    <ProductLoadingShell
      description="Buscando feed, preferencias e contadores de leitura."
      title="Carregando notificacoes"
    />
  );
}

