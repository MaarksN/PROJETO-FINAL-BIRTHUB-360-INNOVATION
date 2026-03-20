<!-- [SOURCE] M-003 -->
# Bloqueio Técnico — M-003 (Injeção BKB em runtime)

**Data:** 2026-03-20
**Status:** BLOQUEADO — AGUARDANDO HUMANO

## Contexto
- Os `system_prompt.md` dos agentes-alvo já contêm instrução explícita de consulta BKB.
- Nesta rodada, não foi encontrada evidência técnica de pipeline/runtime de injeção de contexto BKB além da instrução textual nos prompts.

## Evidência técnica
- Busca por integração/runtime com BKB em código executável de `packages/agents` e `agents` não encontrou mecanismo inequívoco de ingestão de base de conhecimento por tenant.
- Resultados atuais demonstram guardrail de prompt, mas não comprovam transporte de contexto BKB em execução.

## Risco
- Prompts podem referenciar BKB inexistente em runtime e induzir respostas sem base factual.

## Decisão humana requerida
1. Confirmar o componente oficial de runtime que injeta BKB por tenant (path, contrato e estratégia de teste).
2. Autorizar implementação técnica de integração BKB (se inexistente) em ciclo dedicado.
3. Definir critério de aceite mínimo (ex.: teste de integração com evidência de payload contextual).