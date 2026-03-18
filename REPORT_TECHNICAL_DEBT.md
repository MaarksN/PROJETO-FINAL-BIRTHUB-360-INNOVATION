# Relatorio Consolidado de Divida Tecnica (BirthHub360)

Atualizado em `2026-03-17` para refletir o estado real do go-live planejado para `2026-03-20`.

## Escopo de release considerado

O gate oficial de lancamento considera apenas o **core canonico**:

- `apps/web`
- `apps/api`
- `apps/worker`
- `packages/database`

Superficies legadas ou satelites como `apps/dashboard`, `packages/db`, `apps/api-gateway`, `apps/agent-orchestrator`, `apps/voice-engine` e `apps/webhook-receiver` ficam fora do criterio de pronto do go-live, salvo promocao explicita.

## Divida tecnica ativa que impacta o go-live

### P0 - Gate de instalacao e release

1. **Drift de lockfile entre workspace e manifesto**
   - Sintoma validado em `2026-03-17`: `pnpm install --frozen-lockfile` falhava porque `pnpm-lock.yaml` estava desalinhado de `apps/agent-orchestrator/package.json`.
   - Estado atual: corrigido por sincronizacao do lockfile, sem upgrade oportunista.
   - Acao permanente: manter `pnpm install --frozen-lockfile` como criterio de aceite antes do go-live.

2. **Postinstall dependente de `pnpm` no PATH**
   - Sintoma validado em `2026-03-17`: o `postinstall` raiz falhava em Windows ao chamar `pnpm db:generate`.
   - Impacto: falso bloqueio de setup e de pipeline local.
   - Acao: o `postinstall` passa a usar um runner Node do proprio repositorio para executar `db:generate`.

### P1 - Quarentena de legado ainda aberta

1. **Dashboard legado ainda consome `@birthub/db`**
   - Evidencia: `apps/dashboard/src/components/kanban-board.tsx` e `apps/dashboard/src/lib/data.ts`.
   - Impacto: a desativacao do legado ainda nao e total; o pacote legado segue existindo por compatibilidade.
   - Acao: manter como superficie explicitamente em sunset e fora do gate do go-live, bloqueando novos usos fora da quarentena.

2. **Hotspots grandes demais para refactor pre-launch**
   - `apps/api/src/modules/billing/service.ts`: ~1500 linhas
   - `apps/api/src/modules/auth/auth.service.ts`: ~1008 linhas
   - `apps/worker/src/agents/runtime.ts`: ~989 linhas
   - `apps/api/src/modules/agents/service.ts`: ~850 linhas
   - `apps/worker/src/worker.ts`: ~822 linhas
   - `apps/web/app/(dashboard)/workflows/[id]/edit/page.tsx`: ~558 linhas
   - Impacto: risco de regressao se houver refactor estrutural perto do go-live.
   - Acao: ate `2026-03-20`, permitir apenas correcoes cirurgicas, ajustes de config/observabilidade, testes de regressao e fixes de gates.

### P2 - Operacao e narrativa

1. **Suite Python de integracao e lenta, nao quebrada**
   - Evidencia: `pytest tests/integration` passou `20/20`, mas levou cerca de `85s`.
   - Impacto: pressao em CI e no war room; nao e bloqueador enquanto permanecer verde.
   - Acao: manter fora do gate canonico de go-live e reservar budget de execucao nos checks dedicados.

2. **Documentacao historica estava defasada**
   - O relatorio anterior apontava TODOs e bypasses ja resolvidos e descrevia testes Python como quebrados, o que nao corresponde mais ao estado atual.
   - Acao: tratar os documentos executaveis e os artefatos recentes como fonte de verdade, com docs operacionais atualizadas para o corte de `2026-03-20`.

## Baseline validado em 2026-03-17

- `pytest tests/integration`: `20/20` verde
- `pytest apps/agent-orchestrator/tests apps/webhook-receiver/tests`: `7/7` verde
- `node scripts/ci/workspace-audit.mjs`: verde

## Recomendacao operacional

1. Exigir verde para install congelado, doctor, scorecard, lint/typecheck/test/build do core, E2E mestre e preflights.
2. Nao abrir refactors estruturais nos hotspots antes de `2026-03-20`.
3. Manter o legado explicitamente em quarentena, sem promover novas dependencias dele no core.
