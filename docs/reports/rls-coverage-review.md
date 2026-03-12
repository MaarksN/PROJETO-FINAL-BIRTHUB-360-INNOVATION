# Revisão de RLS e Cobertura

Validamos via scripts da base que novas migrações estão sujeitas aos check de scripts linting que requerem explicitamente o uso de `ENABLE ROW LEVEL SECURITY`. Essa imposição não recaiu a tabelas estáticas justificadas (Planos/Stripe globais), garantindo conformidade correta em todo novo Pull Request gerado doravante.
