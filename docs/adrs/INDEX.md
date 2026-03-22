# ADR Index

Indice central dos ADRs e memorandos decisorios ativos no repositorio.

## Canonical ADRs em `docs/adrs`

- `003-observability-strategy.md`
- `004-configuration-strategy.md`
- `005-migrations-strategy.md`
- `ADR-001-monorepo-tooling.md`
- `ADR-002-cicd-strategy.md`
- `ADR-003-observability.md`
- `ADR-004-env-management.md`
- `ADR-005-cors-headers.md`
- `ADR-006-database-orm.md`
- `ADR-007-error-handling.md`
- `ADR-007-multi-tenancy-strategy.md`
- `ADR-008-rls-as-second-layer.md`
- `ADR-008-testing-strategy.md`
- `ADR-009-legacy-migration-strategy.md`
- `ADR-010-auth-provider.md`
- `ADR-011-session-storage.md`
- `ADR-012-authorization-model.md`
- `ADR-013-agent-manifest-design.md`
- `ADR-013-mfa-strategy.md`
- `ADR-014-agent-engine.md`
- `ADR-014-agent-versioning.md`
- `ADR-015-sandbox-external-tools.md`
- `ADR-017-tools-framework.md`
- `ADR-018-policy-engine.md`
- `ADR-025-billing-baseado-em-uso.md`
- `ADR-028_Feedback_Prompt_Cycle.md`
- `ADR-028-user-feedback-loop.md`
- `ADR-030-breaking-changes-policy.md`
- `ADR-031-monorepo-source-of-truth.md`
- `ADR-032-agent-runtime-standardization.md`
- `ADR-033-billing-canonical-schema-cutover.md`

## Architecture decision appendix em `docs/architecture/decisions`

- `020-skill-templates-design.md`
- `021-connectors-pattern.md`

## Como usar este indice

- Arquitetura, release, runbooks e politicas devem linkar para a decisao correspondente quando houver trade-off estrutural.
- Se uma mudanca nao couber em ADR completo, ela deve aparecer primeiro em RFC e depois ser promovida para ADR quando virar regra de longo prazo.
- O fechamento do F10 exige que qualquer decisao citada nos docs operacionais tenha referencia neste indice ou no anexo de arquitetura.
