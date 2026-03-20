<!-- [SOURCE] CD-001 -->
# CD-001 — Dependência de configuração externa para staging deploy

## Contexto validado por Codex (2026-03-20)
- Workflow de CD existe em `.github/workflows/cd.yml`.
- O preflight de staging falha quando variáveis/secrets não estão presentes (`corepack pnpm release:preflight:staging`).
- Nesta máquina não há `gh` CLI disponível, então não foi possível abrir logs remotos de execução do GitHub Actions para identificar o run específico que falhou.

## Evidência técnica local
Comando executado:
- `corepack pnpm release:preflight:staging`

Falhas de configuração obrigatória detectadas (amostra):
- Secrets esperados: `DATABASE_URL`, `REDIS_URL`, `SESSION_SECRET`, `JOB_HMAC_GLOBAL_SECRET`, `AUTH_MFA_ENCRYPTION_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SENTRY_DSN`.
- Vars esperadas: `API_CORS_ORIGINS`, `WEB_BASE_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_CSP_REPORT_ONLY`, `REQUIRE_SECURE_COOKIES`.

## Ação humana requerida
1. Confirmar no Environment `staging` do GitHub Actions se todos os secrets/vars exigidos pelo `cd.yml` estão configurados.
2. Disponibilizar o link/id do run de CD que falhou para correlação de causa raiz.
3. Reexecutar o workflow `CD` após ajuste para validação final do Codex.