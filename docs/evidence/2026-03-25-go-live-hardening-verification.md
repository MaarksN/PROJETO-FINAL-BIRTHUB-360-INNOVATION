# Evidências de hardening — 2026-03-25

Este registro consolida as validações executadas para sair de "deploy por confiança" e manter release orientado a evidência.

## 1) Preflight staging/production (executado)

Comandos executados:

```bash
corepack pnpm release:preflight:staging -- --env-file=ops/env/.env.staging.sealed.example
corepack pnpm release:preflight:production -- --env-file=ops/env/.env.production.sealed.example
```

Resultado:

- `ok: true` em staging.
- `ok: true` em production.
- Escopos `api`, `web` e `worker` sem chaves faltantes.
- Artefatos atualizados em `artifacts/release/*preflight-summary.*`.

## 2) Gates obrigatórios do lane de produção

Validação de configuração em `.github/workflows/cd.yml`:

- `production-preflight` presente e obrigatório.
- `deploy-production` depende de:
  - `production-preflight`
  - `release-smoke-gate`
  - `release-e2e-gate`
  - `rollback-rehearsal-evidence-gate`
- Upload de evidências habilitado por gate.

## 3) Simulação de indisponibilidade de dependência obrigatória

Comandos executados:

```bash
corepack pnpm --filter @birthub/config build
corepack pnpm --filter @birthub/web test -- tests/health.required-dependency.test.ts
corepack pnpm --filter @birthub/worker test -- test/readiness.required-dependency.test.ts
```

Resultado:

- Web: teste passou validando `503` e status `degraded` quando API obrigatória está indisponível.
- Worker: teste passou validando status `degraded` quando Redis obrigatório está indisponível.

## 4) Inventário legado no caminho crítico

Varredura com `git grep` (fora de `docs/**`) confirma:

- Sem consumidores runtime críticos de `@birthub/db` fora da camada de compatibilidade/policies.
- Sem runtime ativo de `apps/api-gateway` e `apps/agent-orchestrator` no `HEAD` atual.
- `apps/dashboard` permanece classificado como legacy/quarentena.

## 5) Governança e fronteiras

Ajustes de alinhamento aplicados:

- `docs/slo.md` reescrito para core canônico (`api`, `web`, `worker`, `database`).
- `docs/operations/f0-sla-severity-policy.md` removendo critérios de severidade ancorados em `api-gateway`.
- `docs/taxonomy.md` alinhado ao catálogo canônico (`packages/agent-packs` como satélite).
- `scripts/bootstrap-dev-test.sh` atualizado para fluxo core (sem `api-gateway`).
- `scripts/testing/run-shard.mjs` removendo shards/pacotes legados do caminho padrão.

## 6) Higiene de repositório (peso morto explícito)

Arquivos temporários versionados removidos da raiz:

- `agents_lint.txt`
- `lint_audit.txt`
- `lint_audit_after.txt`
- `logger_lint.txt`
- `web_lint.txt`
- `worker_lint.txt`
- `workflows_lint.txt`
