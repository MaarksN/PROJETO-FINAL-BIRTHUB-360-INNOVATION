# Linha Canônica de Agentes (Core Operacional)

## Política de execução

- Linha canônica de produto: `packages/agent-packs`.
- Crescimento de novos agentes fora da linha canônica: **congelado**.
- Catálogo GitHub legado foi arquivado em `docs/archive/github-agents` e está fora do caminho crítico de runtime.

## Famílias canônicas por capacidade

| Capacidade | Família canônica | Legado consolidado | Regra operacional |
| --- | --- | --- | --- |
| Prospecção | `sdr`, `bdr`, `ldr` | variações de nomenclatura e persona | persona deve ser configuração, não novo agente |
| Fechamento | `ae` | `executivo_negocios` | usar `ae` como runtime principal |
| Expansão/conta | `kam` | `account_manager` | usar `kam` como runtime principal |
| Pré-vendas | `pre_vendas` | `pre_sales` | manter `pre_sales` apenas em compatibilidade documental |
| Canais/parcerias | `parcerias` | `partners` | manter `partners` apenas em compatibilidade documental |
| Pós-venda | `pos_venda` | `pos-venda` | `pos-venda` permanece somente como shim de compatibilidade |

## Contrato mínimo por agent-pack

Todo agent-pack canônico deve declarar explicitamente:

1. **Entrada** (schema + contexto obrigatório).
2. **Saída** (schema + critérios de sucesso).
3. **Guarda-corpos** (limites, políticas e validações).
4. **Cair pra trás** (fallback e degradação segura).
5. **Observabilidade** (logs, métricas e sinais de erro).
6. **Portões de aprovação** (humano/no-op quando risco alto).

## Critérios de sunset das variantes legadas

- Sem consumidores runtime no core por 2 ciclos de release.
- Equivalência funcional validada por smoke/testes direcionados.
- Evidência operacional publicada em `docs/evidence/`.
