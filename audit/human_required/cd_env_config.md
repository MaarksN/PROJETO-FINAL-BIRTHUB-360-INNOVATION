# Configuração de Ambiente de CD Necessária

O deploy para staging falhou por erro de configuração de ambiente ou secrets ausentes. O dono do repositório deve configurar as seguintes chaves no ambiente `staging` do repositório (Secrets e Variables).

### Secrets Ausentes ou Inválidos (Environment: staging)
- `RENDER_STAGING_DEPLOY_HOOK_URL`
- `DATABASE_URL`
- `REDIS_URL`
- `SESSION_SECRET`
- `JOB_HMAC_GLOBAL_SECRET`
- `AUTH_MFA_ENCRYPTION_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SENTRY_DSN`

### Variables Ausentes ou Inválidas (Environment: staging)
- `API_CORS_ORIGINS`
- `WEB_BASE_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SENTRY_DSN`
- `NEXT_PUBLIC_CSP_REPORT_ONLY` (deve ser `false`)
- `REQUIRE_SECURE_COOKIES` (deve ser `true`)
- `STRIPE_SUCCESS_URL`
- `STRIPE_CANCEL_URL`

Após a configuração, a pipeline de CD deverá passar para o ambiente de staging.
