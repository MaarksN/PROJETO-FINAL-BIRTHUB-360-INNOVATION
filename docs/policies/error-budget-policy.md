# Política de Error Budget

## O que é o Error Budget?
É a quantidade "permitida" de indisponibilidade ou falhas que um serviço pode ter antes de violar seu SLO. Se o SLO é 99.9%, o Error Budget é 0.1%.

## Regras de Congelamento (Feature Freeze)

1. **Monitoramento Contínuo:** O budget é medido continuamente (rolling window de 30 dias) via Datadog/CloudWatch.
2. **Alerta de Risco (Budget < 50% restante):** A engenharia é notificada. Investigação de lentidão ou picos de erro iniciais. Deploys continuam normais.
3. **Alerta Crítico (Budget < 10% restante):** A plataforma de CI/CD emite um bloqueio (Feature Freeze) para o serviço afetado.
4. **Política de Freeze:**
   - **Proibido:** Lançamento de novas features de produto, migrações de banco não urgentes ou mudanças de arquitetura para o serviço que estourou o budget.
   - **Permitido:** Hotfixes para estabilidade, correção de bugs (root cause dos erros), rollback, atualizações de segurança e escalabilidade de infraestrutura (aumento de réplicas).
5. **Duração do Freeze:** O congelamento de features se mantém até que a janela rotativa de 30 dias recupere o budget (matematicamente os dias ruins saem da janela) OU até que a liderança (CTO) aprove uma exceção formal por necessidade crítica de negócio, assumindo o risco de violação de SLA (e possíveis multas contratuais).

## Justificativa
Alinha o incentivo de Desenvolvedores (enviar código rápido) com Operações/SRE (manter o sistema no ar). Se a confiabilidade cai, o foco obrigatoriamente muda de "features" para "estabilidade".
