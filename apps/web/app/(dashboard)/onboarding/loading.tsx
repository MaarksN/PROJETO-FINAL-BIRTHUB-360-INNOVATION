// @ts-expect-error TODO: remover suppressão ampla
import { ProductLoadingShell } from "../../../components/dashboard/page-fragments.js";

export default function OnboardingLoading() {
  return (
    <ProductLoadingShell
      description="Montando progresso, passos concluidos e proxima CTA."
      title="Carregando onboarding"
    />
  );
}

