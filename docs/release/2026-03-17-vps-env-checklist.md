# VPS Env Checklist - 2026-03-17

## Uso rapido

1. Gere um arquivo base:
   - `node scripts/ops/generate-vps-env.mjs --output .env.vps --app-domain app.seudominio.com --api-domain api.seudominio.com --caddy-email voce@seudominio.com`
2. Edite `.env.vps`.
3. Preencha os valores reais restantes.
4. Rode o preflight:
   - `pnpm ops:vps:preflight`

## O que o script ja preenche

- `APP_DOMAIN`
- `API_DOMAIN`
- `CADDY_EMAIL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`
- `WEB_BASE_URL`
- `API_CORS_ORIGINS`
- `EMAIL_FROM_ADDRESS`
- `NEXTAUTH_SECRET`
- `SESSION_SECRET`
- `AUTH_MFA_ENCRYPTION_KEY`
- `JOB_HMAC_GLOBAL_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_SUCCESS_URL`
- `STRIPE_CANCEL_URL`
- `STRIPE_PORTAL_RETURN_URL`

## O que voce precisa trocar por valor real

### Obrigatorio para deploy real

- `REQUIRE_SECURE_COOKIES=true`
- `NEXT_PUBLIC_CSP_REPORT_ONLY=false`
- `DATABASE_URL`
  - origem: provedor PostgreSQL
  - regra: precisa terminar com `sslmode=require` ou equivalente mais forte
- `DIRECT_DATABASE_URL`
  - origem: mesmo provedor PostgreSQL
  - regra: usar a conexao direta de migracao, tambem com `sslmode=require`
- `REDIS_URL`
  - origem: provedor Redis
  - regra: `rediss://...` ou `?tls=true`
- `STRIPE_SECRET_KEY`
  - origem: Stripe Dashboard > Developers > API keys
- `STRIPE_WEBHOOK_SECRET`
  - origem: Stripe Dashboard > Developers > Webhooks

- `NEXT_PUBLIC_SENTRY_DSN`
  - origem: Sentry do frontend
- `SENTRY_DSN`
  - origem: Sentry do backend/worker

### Recomendado antes de abrir trafego real

- `SENTRY_AUTH_TOKEN`
  - origem: token de upload de sourcemaps
- `OTEL_EXPORTER_OTLP_ENDPOINT`
  - origem: collector de observabilidade, se existir
- `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_POSTHOG_KEY`

## Regras de consistencia

- `NEXT_PUBLIC_APP_URL` e `API_CORS_ORIGINS` devem apontar para o mesmo dominio publico do frontend.
- `NEXT_PUBLIC_API_URL` deve apontar para o dominio HTTPS publico da API.
- `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL` e `STRIPE_PORTAL_RETURN_URL` devem usar o mesmo dominio do app.
- `DATABASE_URL` e `DIRECT_DATABASE_URL` nao devem apontar para banco local no modo producao.
- `REDIS_URL` nao deve apontar para `redis://localhost` em producao.

## Gate final

Antes do deploy, estes comandos precisam ficar verdes:

```bash
pnpm release:preflight:production -- --env-file=.env.vps
pnpm release:smoke
pnpm test:e2e:release
```

Nota:
Se voce ainda nao tiver Sentry, o preflight de producao continuara vermelho ate configurar `NEXT_PUBLIC_SENTRY_DSN` e `SENTRY_DSN`.
