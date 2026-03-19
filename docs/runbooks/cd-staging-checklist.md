# Checklist Operacional de CD - Staging

Este documento detalha os requisitos e procedimentos para garantir o funcionamento correto do deploy contínuo (CD) no ambiente de Staging.

## 1. Configuração de Variáveis de Ambiente (Environment Variables)

Para o job `staging-preflight` ser executado com sucesso e os testes pré-deploy passarem, as seguintes **Variables** devem estar configuradas no Environment `staging` dentro do GitHub Repository Settings:

- [ ] `API_CORS_ORIGINS`
- [ ] `WEB_BASE_URL`
- [ ] `NEXT_PUBLIC_API_URL`
- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `NEXT_PUBLIC_SENTRY_DSN`
- [ ] `NEXT_PUBLIC_CSP_REPORT_ONLY` (deve ser `false`)
- [ ] `REQUIRE_SECURE_COOKIES` (deve ser `true`)
- [ ] `STRIPE_SUCCESS_URL`
- [ ] `STRIPE_CANCEL_URL`

## 2. Configuração de Segredos (Secrets)

Para o ambiente funcionar e o deploy ser acionado, os seguintes **Secrets** devem estar configurados no Environment `staging`:

- [ ] `RENDER_STAGING_DEPLOY_HOOK_URL` (URL válida começando com http/https)
- [ ] `DATABASE_URL`
- [ ] `REDIS_URL`
- [ ] `SESSION_SECRET`
- [ ] `JOB_HMAC_GLOBAL_SECRET`
- [ ] `AUTH_MFA_ENCRYPTION_KEY`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `SENTRY_DSN`

## 3. Configurações de Protection Rules

- [ ] O Environment `staging` não deve exigir "required reviewers", permitindo que a branch `main` ative o deploy automaticamente.
- [ ] O Environment `production` deve possuir a regra de "required reviewers" ativa, já que o deploy de produção é via gatilho manual (`workflow_dispatch`).

## 4. Guia de Troubleshooting

Se o workflow de CD falhar, verifique a causa de acordo com as seguintes falhas históricas conhecidas:

### Erro: "The job was not started because your account is locked due to a billing issue."
*   **Diagnóstico:** Ocorre antes do início de qualquer job/step (por exemplo, os primeiros runs de `CD`).
*   **Correção:** Isto não é um problema de código, mas sim de limite financeiro na conta GitHub Actions associada à organização/usuário. O administrador da conta precisará regularizar o pagamento no GitHub para destravar a esteira.

### Erro: "Process completed with exit code 1" no step de Deploy
*   **Diagnóstico:** Falha ao invocar a `RENDER_STAGING_DEPLOY_HOOK_URL`.
*   **Correção:** Verifique se o secret de staging `RENDER_STAGING_DEPLOY_HOOK_URL` está configurado corretamente. O script `deploy-staging` agora avalia ativamente o valor e alertará explicitamente se ele estiver vazio ou tiver formato malformado. Certifique-se também de que o serviço no Render está responsivo (um erro 400 ou superior causará o aborto via cURL `--fail`).

### Falha no Staging Preflight (pnpm release:preflight:staging)
*   **Diagnóstico:** O preflight script no passo de build em staging detectou erros ou falta de variáveis cruciais listadas nas matrizes acima.
*   **Correção:** Examine o log do step correspondente. Ele identificará com clareza quais variáveis/secrets estão faltando e interromperá a esteira de CD. As configure apropriadamente nos repositórios e retome as operações.
