Item: [GAP-SEC-003 - MFA - codigo de uso unico (invalidar apos primeiro uso)] | Data: [2026-03-20T08:44:40-03:00]

Arquivos criados/alterados: [
- C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\apps\api\src\modules\auth\auth.service.ts
- C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\apps\api\tests\auth.test.ts
]

Typecheck: [zero erros (corepack pnpm --filter @birthub/api typecheck)] | Testes: [7 passando / 0 falhando]

Schema strict: [Confirmado sem Any nas alteracoes] | [SOURCE]: [Confirmado em 100% dos arquivos]

Anti-drift: [Nenhum rascunho encontrado]

Resultado esperado atingido: [Sim - consumo MFA tornou-se atomico com updateMany condicionado a consumedAt: null; reuso retorna MFA_CODE_ALREADY_USED e teste comprova falha no segundo uso]
