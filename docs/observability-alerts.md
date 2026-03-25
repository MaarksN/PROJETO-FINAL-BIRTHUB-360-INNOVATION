# Alertas Mínimos de Observabilidade (Foco no Core Canônico)

A operação deve priorizar detecção e resposta para o **core canônico**: `apps/web`, `apps/api`, `apps/worker` e `packages/database`. Alertas de satélite devem ser configurados sem competir com a resposta de incidentes P0 do core.

Fonte canônica de fronteiras: `docs/service-catalog.md`.

## Escopo e severidade

- **P0**: risco imediato ao fluxo principal do core.
- **P1**: degradação relevante sem interrupção total do core.
- **P2**: impacto moderado em satélites.
- **P3**: legado/quarentena, sem rota principal de produção.

Referências de política: `docs/operations/f0-sla-severity-policy.md` e `infra/monitoring/alert.rules.yml`.

## 1) `apps/api` (core)

**ApiUnavailable**
- **Threshold**: Indisponibilidade total (`up{job="api"} == 0`) por 2 min.
- **Ação**: `P0`.

**ApiHighErrorRate**
- **Threshold**: `> 5%` das requisições com erro `5xx` em 5 min, mantido por 10 min.
- **Ação**: `P1`.

**ApiHighLatencyP95**
- **Threshold**: P95 `> 500ms` mantido por 10 min.
- **Ação**: `P2`.

## 2) `apps/web` (core)

**WebUnavailable**
- **Threshold**: Indisponibilidade total (`up{job="web"} == 0`) por 2 min.
- **Ação**: `P0`.

**WebAvailabilityDegraded**
- **Threshold**: `> 5%` das verificações de health/readiness degradadas em 5 min, mantido por 10 min.
- **Ação**: `P1`.

**WebHighLatencyP95**
- **Threshold**: Latência P95 da readiness web `> 400ms` por 10 min.
- **Ação**: `P2`.

## 3) `apps/worker` (core)

**WorkerUnavailable**
- **Threshold**: Indisponibilidade total (`up{job="worker"} == 0`) por 2 min.
- **Ação**: `P0`.

**WorkerQueueBacklogHigh**
- **Threshold**: `> 200` jobs de backlog mantido por 10 min.
- **Ação**: `P2`.

**WorkerDlqGrowing**
- **Threshold**: `> 5` novos jobs falhos (DLQ) em 10 min, mantido por 5 min.
- **Ação**: `P1`.

**WorkerHighFailRate**
- **Threshold**: `> 10%` dos jobs falhando mantido por 10 min.
- **Ação**: `P1`.

## 4) `packages/database` (core)

**DatabaseConnectionPoolSaturation**
- **Threshold**: Uso do pool de conexões `> 90%` por 10 min.
- **Ação**: `P2`.

**DatabaseQueryErrorSpike**
- **Threshold**: Taxa de erros de query `> 2/s` por 10 min.
- **Ação**: `P1`.

## Satélites e legado

- **Satélites** (`packages/agent-packs`, `apps/webhook-receiver`, `apps/voice-engine`): alertar no máximo em `P1/P2`, com roteamento que não interrompa triagem do core.
- **Legacy/quarentena** (`apps/dashboard`, `apps/api-gateway`, `apps/agent-orchestrator`, `packages/db`): sem política de alerta `P0`; tratar como `P3` e janela de manutenção.
- **Regra operacional:** nenhuma superfície fora do core pode abrir incidente `P0` por padrão.

## Pós-alerta

A emissão de alerta inicia o runbook de investigação (`docs/runbooks/incident-investigation.md`).
- `P0`: acionamento imediato de on-call.
- `P1`: triagem em até 15 min.
- `P2/P3`: fila operacional e correção programada.
