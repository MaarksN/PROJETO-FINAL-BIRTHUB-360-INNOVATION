# Validação do Jules — modo cruzado cru

Data: 2026-03-12

## Escopo
Validação cruzada direta, baseada em evidência, sem interpretação expandida:
1. Histórico Git (commits de Jules).
2. Confronto com checklist/prompt por ciclo.
3. Estado técnico atual (lint/test/build).

## Evidência A — Git (forense cru)
### Commits de trabalho do Jules usados na validação
- `68d4034` (ciclo 02)
- `2382c28` (ciclo 04)
- `1294481` e `d6b148b` (ciclo 07)
- `cffd1b6` (ciclo 09)
- `703f5e4` (ciclo 10)

### Resultado bruto
- Arquivos únicos mapeados desses commits: **31**.
- Arquivos que ainda existem no `HEAD`: **31/31**.
- Artefatos Markdown de documentação nesses commits: **30**.

## Evidência B — Cruzamento com CHECKLIST E PROMPTS (cru)
### Arquivos de referência usados
- `CHECKLIST E PROMPTS/INDEX_BirthHub360_v4.html`
- `CHECKLIST E PROMPTS/BirthHub360_Ciclo_02_JULES.html`
- `CHECKLIST E PROMPTS/BirthHub360_Ciclo_04_JULES.html`
- `CHECKLIST E PROMPTS/BirthHub360_Ciclo_07_JULES.html`
- `CHECKLIST E PROMPTS/BirthHub360_Ciclo_09_JULES.html`
- `CHECKLIST E PROMPTS/BirthHub360_Ciclo_10_JULES.html`
- `CHECKLIST E PROMPTS/BirthHub360_Prompt_Ciclo_10_JULES.html`

### Resultado do confronto por ciclo (palavras/tema vs entrega)
- Ciclo 02: match para `multi-tenancy`, `isolamento`, `tenant`.
- Ciclo 04: match para `manifest`, `review`.
- Ciclo 07: match para `billing`, `reembolso`, `grandfathering`, `checkout`, `pci`.
- Ciclo 09: match para `onboarding`, `fricção`, `aha`.
- Ciclo 10: match para `marketplace`, `curadoria`, `malicioso`, `moderação`, `verificação`.

## Evidência C — Sanidade técnica (estado atual)
### Comandos executados
1. `pnpm lint`
2. `pnpm test`
3. `pnpm --filter @birthub/dashboard test`
4. `pnpm test:agents`
5. `pnpm build`

### Resultado bruto por comando
- `pnpm lint`: **PASS**.
- `pnpm test`: **FAIL** (`@birthub/dashboard`).
- `pnpm --filter @birthub/dashboard test`: **FAIL**
  - `isRtlLanguage` não exportado de `../lib/platform-i18n.ts`.
  - `../lib/sanitize` não encontrado.
- `pnpm test:agents`: **FAIL** (16 erros de coleta/import em múltiplos agentes).
- `pnpm build`: **FAIL**
  - `TS5097` em `@birthub/agent-runtime`.
  - `TS5097` em `@birthub/conversation-core`.

## Saída objetiva (sem expansão)
- Validação cruzada documental dos ciclos de Jules: **coberta**.
- Validação técnica fim-a-fim do monorepo: **reprovada no estado atual**.
