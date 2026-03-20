<!-- [SOURCE] GAP-SEC-004 -->
# Pending Review — GAP-SEC-004
**Data:** 2026-03-20
**Executor:** Codex

## Arquivos criados / modificados
| Arquivo | Ação | [SOURCE] presente |
|---------|------|-------------------|
| C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\apps\api\src\modules\auth\auth.service.ts | Timeout idle/absoluto e limite concorrente de sessões por papel | ✅ |
| C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\apps\api\src\modules\auth\cookies.ts | Atributos de cookie com `path`/`domain` explícitos | ✅ |
| C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\config\src\api.config.ts | Configuração de `API_AUTH_IDLE_TIMEOUT_MINUTES` e `API_AUTH_COOKIE_DOMAIN` | ✅ |
| C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\apps\api\tests\auth.test.ts | Testes de idle timeout e concorrência de sessões | ✅ |
| C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\apps\api\tests\test-config.ts | Atualização de config de teste para novos campos de segurança | ✅ |
| C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\audit\human_required\GAP-SEC-004_backlog_missing.md | Bloqueio encerrado após execução do backlog | ✅ |

## Testes executados
| Teste | Comando | Resultado |
|-------|---------|-----------|
| Typecheck da API | `corepack pnpm --filter @birthub/api typecheck` | PASS |
| Suíte completa da API | `corepack pnpm --filter @birthub/api test` | PASS |

## Resultado esperado atingido?
[x] Sim — evidência: controles de sessão implementados e validados por testes automatizados.
[ ] Parcial — gap: ...
[ ] Não — motivo: ...