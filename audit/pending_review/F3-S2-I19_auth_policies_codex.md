Item: [F3-S2-I19 - Extrair módulo auth-policies.service.ts: políticas de lockout, expiração, whitelist] | Data: [2026-03-21T13:40:00-03:00]

Arquivos criados/alterados: [
- apps/api/src/modules/auth/auth.service.policies.ts
- apps/api/src/modules/auth/auth.service.ts
]

Typecheck: [zero erros (corepack pnpm --filter @birthub/api typecheck)] | Testes: [passando]

Schema strict: [Confirmado sem Any nas alteracoes] | [SOURCE]: [Confirmado em 100% dos arquivos]

Anti-drift: [Nenhum rascunho encontrado]

Resultado esperado atingido: [Sim - lógica de políticas e usuários extraída para `auth.service.policies.ts` reduzindo significativamente a complexidade do arquivo principal `auth.service.ts`]