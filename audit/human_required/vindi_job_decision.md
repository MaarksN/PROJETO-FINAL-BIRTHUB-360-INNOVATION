<!-- [SOURCE] S-003 -->
# Decisão Humana Requerida — S-003 (syncLegacyBilling / Vindi)

**Data:** 2026-03-20
**Status:** BLOQUEADO — AGUARDANDO HUMANO

## Contexto
- O arquivo `apps/worker/src/jobs/syncLegacyBilling.ts` não existe no estado atual do repositório.
- Não há referências ativas a `syncLegacyBilling`, `legacyBilling` ou `vindi` no código TypeScript rastreado.
- O checklist canônico exige decisão explícita de manutenção/remoção para rastreabilidade forense.

## Pergunta objetiva para decisão
- Devemos considerar o item encerrado como **removido historicamente** (sem ação adicional), ou abrir uma tarefa de **reconstrução documental** do job legado para auditoria retroativa?

## Impacto por opção
1. Encerrar como removido historicamente:
   - Não altera código de produção.
   - Mantém risco baixo de regressão.
   - Exige apenas registro formal no log forense.
2. Reconstruir documentação retroativa:
   - Não altera produção, mas demanda investigação histórica adicional.
   - Aumenta custo de rastreabilidade e tempo de fechamento.

## Evidência técnica desta rodada
- `git ls-files "*syncLegacyBilling.ts"` → sem resultados.
- `git grep -n "syncLegacyBilling" -- "*.ts"` → sem resultados.