Item: [GAP-SEC-005 - Protecao SSRF em tool.http - confirmar cobertura de IPs internas] | Data: [2026-03-20T08:44:40-03:00]

Arquivos criados/alterados: [
- C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\agents-core\src\policy\engine.ts
- C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\agents-core\src\tools\httpTool.ts
- C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\agents-core\src\__tests__\http-tool-ssrf.test.ts
]

Typecheck: [zero erros (corepack pnpm --filter @birthub/agents-core build)] | Testes: [13 passando / 0 falhando]

Schema strict: [Confirmado sem Any nas alteracoes] | [SOURCE]: [Confirmado em todos]

Anti-drift: [Nenhum rascunho encontrado]

Resultado esperado atingido: [Sim - ranges obrigatorios cobertos (incluindo 169.254.169.254), testes confirmam rejeicao para IPs internos e aceite para URL publica valida]
