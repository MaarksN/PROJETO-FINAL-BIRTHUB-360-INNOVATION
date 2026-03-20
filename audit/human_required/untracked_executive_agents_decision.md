<!-- [SOURCE] GOV-003 -->
# Decisão Humana Requerida — Untracked Executive Agents

**Data:** 2026-03-20
**Status:** RESOLVIDO

## Diretórios detectados (não rastreados no Git)
- `packages/agents/executivos/bottleneckdetector/`
- `packages/agents/executivos/complianceenforcer/`
- `packages/agents/executivos/resourcebalancer/`
- `packages/agents/executivos/supplychainsync/`
- `packages/agents/executivos/vendornegotiator/`

## Análise técnica
- Estrutura completa encontrada em todos: `contract.yaml`, `system_prompt.md`, `agent.ts`, `schemas.ts`, `tools.ts`, `acceptance.md`, `tests/*`, `seeds/dev_seed.json`.
- Marcador `[SOURCE]` presente em todos os arquivos internos.
- Testes unitários/schemas executados com PASS (4/4 em cada diretório).
- Não há evidência dessas entidades no `audit/validation_log.md` atual com aprovação final Jules para inclusão em REGISTRY de produção.

## Decisão necessária
1. **Versionar agora no repositório** como novos agentes do ciclo atual.
2. **Mover para branch/artefato separado** e manter fora do baseline desta remediação.
3. **Descartar do workspace** por não fazer parte do escopo aprovado.

## Recomendação técnica
- Opção 2 (separar) para evitar poluir a remediação forense atual sem aprovação formal de governança de agentes.

## Decisão aplicada
- Opção escolhida: **2 (separar)**.
- Ação executada: diretórios movidos para `artifacts/untracked_agents_snapshot/2026-03-20-executivos/`.
