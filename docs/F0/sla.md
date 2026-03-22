# Política de SLA por Severidade

| Severidade | Descrição | SLA | Exemplos Reais |
|---|---|---|---|
| **P0 (Crítico)** | Sistema indisponível para todos os clientes, perda de dados, brecha de segurança | ≤ 2h | Banco de dados fora do ar, login falhando para 100% dos usuários, vazamento de PII |
| **P1 (Alto)** | Funcionalidade principal quebrada para parte dos clientes, lentidão extrema, falha em pagamentos | ≤ 8h | Relatório mensal não sendo gerado, checkout falhando para 20% das transações |
| **P2 (Médio)** | Funcionalidade secundária quebrada, erro visual bloqueante, degradação de performance | ≤ 72h | Botão fora do lugar impedindo clique em tela secundária, API demorando 5s |
| **P3 (Baixo)** | Erro cosmético, melhoria de UX, dívida técnica menor | ≤ 2 semanas | Texto com typo, padding incorreto, refatoração de função não crítica |

## Escalonamento Automático e Alertas
1. **75% do Prazo:** Quando um chamado atinge 75% do seu SLA sem resolução, um alerta automático (via PagerDuty) é enviado para o owner primário e backup.
2. **Violação do SLA:** Se o prazo é excedido:
   - **P0/P1:** O CTO e o Engineering Manager são notificados imediatamente (Slack/SMS).
   - **P2:** O Engineering Manager é notificado.
   - **P3:** A task é marcada com label `SLA-Violated` para priorização na próxima sprint.

## Comunicação com Stakeholders
- **P0:** Atualizações a cada 30 minutos no canal #incidents e via Statuspage. Email para clientes afetados após resolução.
- **P1:** Atualizações a cada 2 horas no canal #incidents.
- **P2:** Atualizações diárias no card do Jira.
- **P3:** Comunicação na release note da versão.

## Dashboard de SLA
O dashboard oficial para rastreamento de SLA em tempo real está disponível no Jira (Board 'Engineering SLA').

## Histórico de Aderência a SLA (Baseline)
- Últimos 90 dias:
  - P0: 100% de aderência (0 incidentes)
  - P1: 95% de aderência (1 violação por 30 minutos)
  - P2: 85% de aderência (3 violações por 2 dias)
  - P3: 90% de aderência (10 violações)

## Aprovação Formal
[x] Política aprovada por todos os owners técnicos em 2026-03-21.
