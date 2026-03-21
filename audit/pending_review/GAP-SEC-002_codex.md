Item: [GAP-SEC-002 - RBAC como modelo base de autorizacao no MVP] | Data: [2026-03-20T08:44:40-03:00]

Arquivos criados/alterados: [
- C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\apps\api\src\common\guards\require-role.ts
- C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\apps\api\tests\rbac.test.ts
]

Typecheck: [zero erros (corepack pnpm --filter @birthub/api typecheck)] | Testes: [3 passando / 0 falhando]

Schema strict: [Confirmado sem Any nas alteracoes] | [SOURCE]: [Confirmado em 100% dos arquivos]

Anti-drift: [Nenhum rascunho encontrado]

Resultado esperado atingido: [Sim - RBAC mapeado com RBACContext + ROLE_PERMISSIONS; testes cobrem autorizado, nao autorizado (403), super_admin e role invalida rejeitada]
