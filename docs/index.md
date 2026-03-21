# Documentação Central BirthHub360

Bem-vindo à página índice do BirthHub360. Este documento atua como a **Fonte de Verdade Única (Single Source of Truth)** do repositório, resolvendo inconsistências de documentos passados.

## 1. Padrões de Código e Arquitetura
- [Naming Conventions & Monorepo](standards/naming-conventions.md)
- [Política de Artefatos](standards/artifacts-policy.md)

## 2. Playbooks e Runbooks (Engenharia de Dados e Backend)
- [Disaster Recovery e Backups](runbooks/db-dr-backup.md)
- [Padrões de Migrations de Banco](runbooks/db-migrations.md)
- [Monitoramento de Performance e Tuning (PgBouncer, Vacuum)](runbooks/db-performance.md)
- [Rollout de Autenticação e Multitenant](runbooks/auth-tenant-rollout-canary.md)

## 3. Deploy e Releases
- [Staging Checklist e Preflight](runbooks/cd-staging-checklist.md)
- [Relatórios de Falha em Staging](runbooks/cd-staging-failure-report.md)

## 4. Operações e Resposta a Incidentes
- [Incidentes Críticos](runbooks/critical-incidents.md)
- [Investigação de Queries Lentas](runbooks/slow-query-investigation.md)
- [Triagem de Taxa de Falhas Elevada](runbooks/high-fail-rate-triage.md)
- [Playbook Operacional para Agentes Comerciais](runbooks/playbook-operacional-agentes-comerciais.md)
- [Incidentes Específicos de Tenant](runbooks/tenant-specific-incident-runbook.md)

## 5. Legado e Histórico
Toda documentação histórica divergente destes guias principais deve ser arquivada no repositório (ex: pastas de `audit/` e `archives/`) mas não deve ser usada como material de referência diária de operações ou desenvolvimento.
