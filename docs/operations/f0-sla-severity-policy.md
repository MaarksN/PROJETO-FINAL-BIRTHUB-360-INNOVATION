# F0 — Política de SLA por Severidade

## Escopo

Esta política define classificação, comunicação, escalonamento, alertas preventivos e baseline operacional do ciclo F0.

## SLA por severidade

| Severidade | Critério objetivo | TTA/ack | Mitigação inicial | Correção alvo | Stakeholders |
| --- | --- | ---: | ---: | ---: | --- |
| P0 | indisponibilidade total, incidente de segurança crítico, risco imediato de receita/compliance | até 5 min | até 30 min | até 2 horas para contenção / até 24 horas para correção completa | engenharia, produto, security, liderança |
| P1 | degradação severa sem outage total, workflow crítico falhando, perda funcional relevante | até 15 min | até 2 horas | até 8 horas | owner do domínio, PM, suporte |
| P2 | defeito moderado, workaround disponível, dívida de impacto operacional controlado | até 4 horas úteis | até 24 horas | até 72 horas | owner do domínio e stakeholders afetados |
| P3 | melhoria, ajuste menor, debt sem risco operacional imediato | até 2 dias úteis | backlogado | até 2 semanas | owner do domínio |

## Exemplos reais de classificação

- **P0:** falha de autenticação generalizada, vazamento de segredo, fila parada com impacto em faturamento.
- **P1:** API com degradação forte de latência, job crítico acumulando backlog, build canônico quebrado em branch de release.
- **P2:** dashboard administrativo com erro parcial e workaround, teste intermitente em área não crítica.
- **P3:** refino visual, cleanup técnico sem impacto imediato ao usuário.

## Escalonamento automático

1. Ao atingir **75% do prazo**, o owner do domínio e o backup recebem alerta preventivo.
2. Ao violar SLA, o incidente é escalado automaticamente para `Security` ou `DevOps` quando aplicável.
3. P0 e P1 exigem atualização contínua no canal oficial do domínio até normalização.
4. Incidentes sem owner explícito são promovidos imediatamente para `@platform-architecture`.

## Plano de comunicação

| Severidade | Frequência | Canal mínimo | Conteúdo obrigatório |
| --- | --- | --- | --- |
| P0 | a cada 30 min | canal do domínio + liderança | impacto, hipótese, mitigação, próximo checkpoint |
| P1 | a cada 2 h | canal do domínio + stakeholders diretos | status, workaround, ETA, risco residual |
| P2 | diário | canal do domínio | owner, prioridade, prazo, dependências |
| P3 | semanal | backlog/ritual | prioridade, janela planejada |

## Baseline operacional de 90 dias

Como snapshot F0 local, o histórico de aderência é registrado com baseline documental:

- `P0/P1`: sem evidência de incidentes abertos no repositório local no momento do freeze.
- `P2/P3`: backlog tratado como dívida controlada via documentação e gates de CI.
- Thresholds e alertas de latência já estão refletidos em `docs/observability-alerts.md`.

## Aprovação formal

| Área | Responsável | Status | Data |
| --- | --- | --- | --- |
| Web | `@product-frontend` | Aprovado | 2026-03-22 |
| API | `@platform-api` | Aprovado | 2026-03-22 |
| Worker | `@platform-automation` | Aprovado | 2026-03-22 |
| Database | `@platform-data` | Aprovado | 2026-03-22 |
| Security | `@platform-architecture` | Aprovado | 2026-03-22 |
| DevOps | `@platform-architecture` | Aprovado | 2026-03-22 |
