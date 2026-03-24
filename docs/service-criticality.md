# Matriz de Criticidade por Serviço (Canônica)

## Níveis
- **P0 (Crítico):** indisponibilidade causa interrupção direta da operação principal.
- **P1 (Alto):** degradação relevante com workaround parcial.
- **P2 (Médio):** impacto moderado sem parada do fluxo principal.

## Serviços

| Serviço | Criticidade | Justificativa | RTO | RPO |
|---|---|---|---|---|
| `apps/api` | P0 | API principal do produto e porta de entrada do runtime canônico. | 30 min | 5 min |
| `apps/web` | P0 | Interface principal de operação do produto para usuários finais. | 30 min | 15 min |
| `apps/worker` | P0 | Execução assíncrona crítica (jobs, rotinas e processamento de backoffice). | 30 min | 10 min |
| `packages/database` (PostgreSQL/Prisma) | P0 | Persistência transacional principal (`@birthub/database`). | 30 min | 5 min |
| `packages/agent-packs` | P0 | Catálogo de agentes realmente carregado por API e Worker em runtime. | 30 min | 10 min |
| `apps/webhook-receiver` | P1 | Entrada de eventos externos; importante, mas fora do núcleo canônico. | 1 h | 15 min |
| `apps/voice-engine` | P2 | Superfície satélite sem bloqueio direto do fluxo principal. | 4 h | 1 h |
| `apps/dashboard` | P2 | Superfície legada/suporte; não é rota principal do runtime canônico. | 4 h | 1 h |

## Diretriz de atendimento
- Incidentes **P0**: acionamento imediato de on-call + comunicação a cada 30 min.
- Incidentes **P1**: triagem em até 15 min + comunicação horária.
- Incidentes **P2**: tratativa em horário comercial, salvo escalonamento.
