Item: [GAP-SEC-001 - Session ID minimo de 128 bits (16 bytes)] | Data: [2026-03-20T08:44:40-03:00]

Arquivos criados/alterados: [
- C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\apps\api\src\modules\auth\crypto.ts
- C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\apps\api\src\modules\auth\auth.service.ts
- C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\apps\api\tests\auth.test.ts
]

Typecheck: [zero erros (corepack pnpm --filter @birthub/api typecheck)] | Testes: [7 passando / 0 falhando]

Schema strict: [Confirmado sem Any nas alteracoes] | [SOURCE]: [Confirmado em todos]

Anti-drift: [Nenhum rascunho encontrado]

Resultado esperado atingido: [Sim - geracao de session ID migrada para crypto.randomBytes(16).toString("hex"), com teste cobrindo comprimento minimo de 32 caracteres hex]
