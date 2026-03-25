# SLO/SLI por Serviço (Core Canônico)

Fonte de fronteiras: `docs/service-catalog.md`.

## apps/api (P0)
- **SLI disponibilidade:** respostas válidas (`2xx`/`3xx`) sobre total de requisições.
- **SLO disponibilidade mensal:** `99.9%`.
- **SLI latência p95:** tempo de resposta por endpoint crítico.
- **SLO latência p95:** `< 800ms`.

## apps/web (P0)
- **SLI disponibilidade:** health/readiness `ok` sobre total de checks sintéticos.
- **SLO disponibilidade mensal:** `99.9%`.
- **SLI latência p95:** latência do endpoint `/readiness`.
- **SLO latência p95:** `< 400ms`.

## apps/worker + queue (P0)
- **SLI disponibilidade:** worker em estado `up` com dependências obrigatórias disponíveis.
- **SLO disponibilidade mensal:** `99.9%`.
- **SLI atraso de fila p95:** tempo entre enqueue e início de processamento.
- **SLO atraso p95:** `< 30s`.
- **SLI fail-rate:** jobs `failed`/jobs processados.
- **SLO fail-rate mensal:** `< 1%`.
- **SLI DLQ:** jobs enviados para DLQ/total.
- **SLO DLQ mensal:** `< 0.5%`.

## packages/database (P0)
- **SLI disponibilidade:** conexões bem-sucedidas/total de tentativas.
- **SLO disponibilidade mensal:** `99.95%`.
- **SLI saturação:** razão de uso do pool de conexões.
- **SLO saturação:** `< 90%` sustentado.
- **SLI latência query p95:** consultas críticas por domínio.
- **SLO p95:** `< 100ms` (lookup) e `< 500ms` (agregações).

## Satélites e legado
- Satélites (`packages/agent-packs`, `apps/webhook-receiver`, `apps/voice-engine`) seguem SLO próprio sem competir com P0 do core.
- Superfícies `legacy/quarentena` não definem SLO de go-live e não podem abrir incidentes P0 por padrão.
