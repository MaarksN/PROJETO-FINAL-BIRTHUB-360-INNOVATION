// @ts-expect-error TODO: remover suppressão ampla
import { ProductLoadingShell } from "../../../components/dashboard/page-fragments";

export default function ConversationsLoading() {
  return (
    <ProductLoadingShell
      description="Buscando threads, mensagens e estado operacional das conversations."
      title="Carregando conversations"
    />
  );
}

