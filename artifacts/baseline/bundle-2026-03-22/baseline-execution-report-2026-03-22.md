# Baseline Execution Report (2026-03-22)

Escopo solicitado:
- Core Web Vitals (LCP, FID, CLS)
- Latência API (P50/P95/P99)
- Inventário GCP com custo mensal atual
- Configuração de banco (pool, índices, vacuums)
- DORA baseline (deployment frequency, lead time, MTTR, CFR)
- Fluxos críticos com pontos de falha
- Versões de dependências críticas
- Snapshot Terraform/infra

## 1) Core Web Vitals

Status: **coletado e arquivado**  
Arquivo: `web-vitals-baseline.json`

Resumo (mediana, rotas `/` e `/pricing`, 3 execuções por rota):
- LCP: **312 ms**
- FID: **0.5 ms**
- CLS: **0.0000**

Observação:
- FID medido por `PerformanceObserver` (`first-input`) com interação sintética em browser headless.

## 2) API Latency Baseline

Status: **coletado e arquivado**  
Arquivo: `api-latency-baseline.json`

Resumo (250 requests, concorrência 25, endpoint `/health`):
- P50: **156.856 ms**
- P95: **209.797 ms**
- P99: **215.996 ms**
- Média: **144.993 ms**

## 3) Inventário GCP + Custo Mensal Atual

Status: **coletado e arquivado**  
Arquivo: `gcp-inventory-and-cost-baseline.json`

Resumo:
- Projeto: `birthub360`
- Billing do projeto: **desabilitado**
- Custo mensal faturável atual: **USD 0** (alta confiança)
- Serviços habilitados: **38**
- Buckets listados: **0**
- Pub/Sub topics listados: **0**

Observação:
- APIs administrativas de Cloud Run/Cloud SQL/Redis retornaram `SERVICE_DISABLED` no projeto.

## 4) Banco de Dados (Pools, Índices, Vacuums)

Status: **coletado e arquivado**  
Arquivos: `database-baseline.json`, `database-performance-report.json`

Configuração atual (código canônico em `packages/database/src/client.ts`):
- Timeout de query: **5000 ms**
- Limite default de conexões (pool): **10**
- Threshold de slow query: **750 ms**

Baseline dinâmico:
- Query baseline (10k registros, tenant único): **36.7055 ms** (PASS `< 100 ms`)
- Índices não utilizados detectados: **184**
- `pg_stat_statements`: **não disponível** no banco local

Vacuum/autovacuum (tabelas high-write auditadas):
- `agent_budget_events`, `audit_logs`, `billing_events`, `crm_sync_events`, `webhook_deliveries`
- Todas com:
  - `autovacuum_vacuum_scale_factor=0.02`
  - `autovacuum_analyze_scale_factor=0.01`
  - `autovacuum_vacuum_threshold=50`
  - `autovacuum_analyze_threshold=50`

## 5) DORA Metrics Baseline (90 dias)

Status: **coletado e arquivado** (proxy operacional via GitHub Actions CD)  
Arquivo: `dora-baseline-90d.json`

Fonte:
- Workflow: `.github/workflows/cd.yml`
- `workflow_id=244938760`
- Janela: últimos 90 dias

Resultado:
- Deployment frequency: **0.0/dia** (**0.0/semana**)
- Lead time (mediana): **n/d** (sem deploy sucesso na janela)
- MTTR (mediana): **n/d** (sem recuperação por deploy sucesso na janela)
- CFR: **100%** (46 falhas / 46 tentativas consideradas)

Observação:
- Métricas derivadas de sucesso/falha de runs de CD em `main`; não foi usada base externa de incidentes.

## 6) Fluxos Críticos e Pontos de Falha

Status: **mapeado e arquivado**  
Arquivo: `critical-flows-failure-points.md`

Resumo:
- Fluxos críticos mapeados: **5**
- Pontos de falha agregados: **31**
- Maior concentração:
  - Workflow async: **8**
  - Billing webhook: **7**

## 7) Versões de Dependências Críticas

Status: **coletado e arquivado**  
Arquivos: `critical-dependency-versions.json`, `critical-dependency-versions.txt`

Resumo:
- Node runtime: `v24.14.0`
- Python runtime: `3.12.10`
- pnpm runtime: `9.1.0`
- Prisma CLI/client: `6.19.2`
- Next: `16.1.6`
- React/React DOM: `19.2.4`
- Express: `^5.2.1`
- TypeScript: `^5.9.3`
- Playwright: `^1.58.2`

## 8) Snapshot Terraform (Estado Atual)

Status: **snapshot criado e arquivado**  
Pasta: `terraform-snapshot/`

Conteúdo:
- Cópia completa de `infra/terraform` (incluindo módulos)
- ZIP do snapshot (`terraform-source.zip`)
- Metadata com hash SHA-256 de cada arquivo (`terraform-snapshot-metadata.json`)

Observação importante:
- Binário `terraform` não está instalado no host atual.
- Não foi possível executar `terraform state pull`.
- Não existem arquivos `.tfstate` locais dentro de `infra/terraform`.

