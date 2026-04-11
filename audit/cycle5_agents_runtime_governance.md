# Cycle 5 - Agents Runtime Governance

- Data da revisao: 2026-04-11
- Escopo: runtime e governanca de 15 agentes executivos
- Snapshot base: `artifacts/agent-governance/executive-agents-governance.json`

## Estado atual

- Agentes avaliados: 15
- Retry budget presente: 15/15
- Fallback handling presente: 15/15
- `requestId` declarado, mas nao propagado no runtime: 15/15
- `runtime_enforcement` declarado no contrato: 14/15
- `runtime_enforcement` realmente aplicado: 0/14
- Logging via `console.*`: 15/15
- Maturidade real segundo o snapshot: 15/15 `estrutural`, 0 `operacional`, 0 `parcial`, 0 `fragil`

## Leitura de execucao

Os agentes executivos executam um fluxo local coerente:

1. validam entrada;
2. carregam contrato default ou custom;
3. acionam tools com retry local;
4. aplicam fallback quando necessario;
5. retornam output estruturado com eventos e metricas.

Esse fluxo existe e foi observado nos testes executados neste ciclo. O problema nao e ausencia de comportamento, e ausencia de governanca executavel de plataforma sobre esse comportamento.

## Failure behavior e fallback

Pontos positivos:

- Todos os agentes revisados tem modos de falha declarados.
- Todos os agentes revisados implementam retry local.
- Todos os agentes revisados conseguem emitir resposta `success`, `fallback` ou `error`.

Pontos que impedem classificacao operacional:

- O teto de governanca de runtime continua local ao agente e nao ao runtime compartilhado.
- `runtime_enforcement` e `runtime_cycle` sao declarados e ignorados no caminho de execucao.
- O fallback nao vira trilha operacional centralizada com correlacao, fila ou politica comum de escalacao.
- O `requestId` nao e carregado para os eventos emitidos, o que quebra lineage operacional entre chamada, tool e resposta.

## Classificacao de maturidade

| Classe | Quantidade | Agentes | Justificativa |
| --- | --- | --- | --- |
| estrutural | 15 | `boardprep-ai`, `brand-guardian`, `budget-fluid`, `capital-allocator`, `churn-deflector`, `competitor-xray`, `crisis-navigator`, `culture-pulse`, `expansion-mapper`, `market-sentinel`, `narrative-weaver`, `pipeline-oracle`, `pricing-optimizer`, `quota-architect`, `trend-catcher` | Todos possuem contrato, schema, retry, fallback e testes; nenhum possui governanca de runtime aplicavel de forma controlavel e rastreavel ponta a ponta. |

Nenhum agente foi classificado como `operacional` porque nao ha evidencia de execucao governada com:

- correlacao por `requestId`;
- enforcement de runtime declarado;
- observabilidade roteada para um sink operacional;
- gate de validacao global verde.

## Riscos de execucao nao controlada

- Politicas declaradas em YAML nao governam o comportamento executavel.
- Falhas e fallback ficam encapsulados dentro do agente e nao sob orquestracao soberana.
- Nao ha evidencia de kill switch, circuit breaker comum ou dead-letter para a familia executiva.
- A resposta final informa fallback, mas a plataforma nao demonstra rastrear taxa de fallback por agente.

## Validacao executada

Comandos executados neste ciclo:

- `pnpm typecheck`
  - Falhou no workspace atual porque o script depende de `corepack`, que nao esta disponivel no ambiente; o comando tambem acusou `Unsupported engine` para Node `v25.9.0` quando o repo pede `>=24 <25`.
- `pnpm lint`
  - Falhou pelo mesmo motivo: `corepack` ausente e engine fora da faixa desejada.
- Testes direcionados de runtime/agentes
  - `node --import tsx --test ...`
  - Resultado: `38 pass`, `0 fail`.

Pacotes cobertos nos testes direcionados desta rodada:

- `packages/agent-runtime`
- `boardprep-ai`
- `capital-allocator`
- `churn-deflector`
- `crisis-navigator`
- `culture-pulse`
- `expansion-mapper`
- `market-sentinel`
- `pipeline-oracle`
- `pricing-optimizer`

## Conclusao honesta

O sistema executivo nao esta quebrado no sentido funcional local. Ele esta estrutural: roda, reage a erro e produz output consistente sob teste. O que falta e governanca de execucao compartilhada, auditavel e aplicavel. Sem isso, o sistema continua controlavel apenas no nivel do codigo do agente, nao no nivel da plataforma.
