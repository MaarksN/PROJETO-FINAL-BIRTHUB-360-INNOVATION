# Checklist detalhado com 200 itens (execução + código + risco)

Data: 2026-04-04

> Estrutura de cada item: **Como fazer**, **Código de referência**, **Impacto**, **Possíveis erros e tratativas**.

## Checklist 1-100 — Dívida técnica
### TD-001 — Reduzir acoplamento de rotas no bootstrap da API, separando composição por domínio.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-002 — Padronizar contratos de erro Problem Details em 100% dos endpoints.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-003 — Unificar middlewares duplicados de contexto de tenant em uma única implementação.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-004 — Criar camada de versionamento explícito de API para evitar breaking changes silenciosas.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-005 — Adicionar limites de payload por rota com fallback observável.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-006 — Eliminar lógica de regra de negócio dentro de controllers, movendo para services.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-007 — Padronizar serialização/deserialização de datas para UTC em toda API.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-008 — Adicionar validação de schema de resposta para endpoints críticos.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-009 — Reduzir número de dependências implícitas entre auth-routes e core-routes.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-010 — Criar contrato de idempotência para endpoints de escrita críticos.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-011 — Isolar orchestration engine em módulo puro para facilitar testes de regressão.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-012 — Criar política unificada de retry/backoff por tipo de job.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-013 — Implementar dead-letter queue com motivo padronizado por falha.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-014 — Adicionar controle de concorrência por tenant para evitar noisy neighbor.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-015 — Instrumentar tempo de fila versus tempo de execução em todas as filas.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-016 — Eliminar duplicidade de validações entre worker.job-validation e process-job.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-017 — Criar timeout hard e soft por executor com cancelamento cooperativo.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-018 — Centralizar mapeamento de erros transitórios versus permanentes.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-019 — Adicionar guardrail para jobs órfãos e reprocessamento seguro.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-020 — Definir contrato de prioridade de jobs (alta/média/baixa) com fairness.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-021 — Revisar índices compostos para consultas multi-tenant de alto volume.
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-022 — Padronizar paginação cursor-based em repositórios sensíveis a escala.
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-023 — Criar política de query budget por caso de uso e não só global.
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-024 — Migrar operações críticas para transações com timeout explícito.
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-025 — Adicionar trilha de auditoria de mudanças de status em entidades-chave.
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-026 — Criar estratégia de arquivamento para tabelas com crescimento contínuo.
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-027 — Padronizar naming de migrations para rastreabilidade por domínio.
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-028 — Adicionar validação automática de isolamento tenant em novos repositórios.
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-029 — Reduzir uso de consultas ad-hoc em favor de repositórios tipados.
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-030 — Criar benchmark periódico de consultas top-N por latência.
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-031 — Padronizar convenção de nomes de métricas entre API, Web e Worker.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-032 — Adicionar SLO formal para disponibilidade, latência e erro por serviço.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-033 — Criar dashboards por jornada crítica (login, execução, billing, convite).
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-034 — Garantir correlação de trace-id fim a fim entre web, api e worker.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-035 — Instrumentar eventos de negócio com cardinalidade controlada.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-036 — Adicionar alertas por budget de erro semanal e não só threshold absoluto.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-037 — Criar runbook mínimo por alerta P1/P2 integrado ao monitoramento.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-038 — Padronizar nível de severidade de logs estruturados.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-039 — Adicionar healthchecks dependentes por componente externo.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-040 — Implementar relatório diário automático de incidentes e quase-incidentes.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-041 — Completar matriz de autorização por papel e recurso em rotas protegidas.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-042 — Adicionar rotação automática de chaves para criptografia de dados sensíveis.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-043 — Padronizar política de rate limit por risco de endpoint.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-044 — Criar trilha de auditoria para ações administrativas críticas.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-045 — Adicionar detecção de anomalia para tentativas de login e convite.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-046 — Implementar validação de origem e CORS baseada em ambiente.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-047 — Reforçar sanitização server-side para entradas ricas em texto.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-048 — Criar varredura contínua de segredos em commits e variáveis de ambiente.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-049 — Adicionar evidência automatizada de consentimento e preferências de cookie.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-050 — Padronizar hardening headers de segurança em todas respostas web/api.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-051 — Reduzir acoplamento entre componentes de dashboard e APIs internas.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-052 — Criar biblioteca de estados de carregamento, vazio e erro reutilizável.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-053 — Padronizar tratamento de sessão expirada com recuperação graciosa.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-054 — Reduzir hidratação desnecessária em páginas de alto tráfego.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-055 — Implementar orçamento de performance para rota inicial e dashboard.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-056 — Adicionar acessibilidade AA em formulários e navegação por teclado.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-057 — Padronizar telemetria de cliques e conversão por feature flag.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-058 — Criar fallback offline básico para assets essenciais do PWA.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-059 — Uniformizar validação de formulários entre client e server.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-060 — Adicionar proteção anti-duplo clique em ações de escrita.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-061 — Criar contrato único de erro para provedores externos.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-062 — Implementar circuit breaker por integração crítica.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-063 — Adicionar replay seguro para webhooks recebidos com deduplicação.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-064 — Padronizar assinatura e validação de payloads webhook.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-065 — Criar tabela de mapeamento de campos versionada por conector.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-066 — Adicionar monitor de SLA por provedor externo.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-067 — Implementar sandbox de testes para conectores sem impactar produção.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-068 — Padronizar estratégia de paginação e sincronização incremental.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-069 — Criar verificação automática de drift de contratos externos.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-070 — Adicionar fallback de degradação funcional quando provedor estiver indisponível.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-071 — Aumentar cobertura de testes de integração para fluxos cross-service.
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-072 — Padronizar fixtures e factories para reduzir flaky tests.
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-073 — Criar suíte de contract testing entre web-bff-api-worker.
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-074 — Adicionar testes de carga mínimos em pipeline noturno.
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-075 — Reduzir tempo de feedback da pipeline com paralelismo otimizado.
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-076 — Criar smoke suite de release focada em caminhos de receita.
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-077 — Adicionar validação de migração de banco em ambiente efêmero por PR.
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-078 — Padronizar tags de testes (unit/integration/slow) com enforcement.
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-079 — Criar métrica de confiabilidade de testes por pacote.
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-080 — Automatizar triagem de falhas recorrentes com classificação de causa.
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-081 — Reduzir complexidade de scripts de CI centralizando utilitários comuns.
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-082 — Padronizar convenção de boundaries entre pacotes do monorepo.
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-083 — Criar score de acoplamento entre módulos para guiar refactor.
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-084 — Adicionar validação automática de APIs internas não utilizadas.
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-085 — Definir política de depreciação com janela e comunicação automática.
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-086 — Padronizar templates de PR técnico com impacto operacional.
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-087 — Criar check de compatibilidade Node/pnpm pré-execução local.
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-088 — Adicionar blueprint de criação de novo serviço/pacote.
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-089 — Automatizar geração de changelog por domínio.
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-090 — Criar baseline de tempo de build/test por pacote para otimização contínua.
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-091 — Padronizar cálculo de quota entre API e Worker para evitar divergência.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-092 — Criar reconciliação diária de billing com trilha de inconsistências.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-093 — Adicionar idempotência nas rotinas de exportação financeira.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-094 — Criar fallback operacional para falha na emissão de cobrança.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-095 — Implementar travas de consistência em aceitação de convites.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-096 — Padronizar estados de workflow com transições auditáveis.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-097 — Criar monitor de abandono de onboarding com causa técnica.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-098 — Adicionar proteção contra execução duplicada de workflow.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-099 — Criar mecanismo de reprocessamento manual assistido para suporte.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-100 — Padronizar KPIs de saúde de plataforma com threshold operacional.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

## Checklist 101-200 — Novas implementações
### NI-001 — Implementar onboarding guiado em 5 passos com progresso salvo.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-002 — Adicionar trial automático com conversão para plano pago no app.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-003 — Criar paywall contextual por recurso premium.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-004 — Implementar fluxo self-service de upgrade/downgrade de plano.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-005 — Adicionar gestão de método de pagamento no painel.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-006 — Criar centro de faturamento com histórico e invoices.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-007 — Implementar recuperação de churn com ofertas in-app.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-008 — Adicionar cupom promocional com validade e limite de uso.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-009 — Criar tela de limites de uso e consumo em tempo real.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-010 — Implementar e-mails transacionais de cobrança e renovação.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-011 — Implementar marketplace interno de agentes com filtros por caso de uso.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-012 — Adicionar execução em lote de agentes por lista de tarefas.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-013 — Criar biblioteca de prompts versionados por equipe.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-014 — Implementar comparação A/B de resposta entre modelos.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-015 — Adicionar memória de contexto por conta e por usuário.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-016 — Criar painel de custo por execução de agente.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-017 — Implementar aprovação humana opcional antes de ação sensível.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-018 — Adicionar trilha de explicabilidade de decisões do agente.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-019 — Criar templates de workflow com agentes prontos por vertical.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-020 — Implementar fallback automático para modelo secundário.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-021 — Implementar espaços de trabalho multi-time com permissões granulares.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-022 — Adicionar comentários em execuções e artefatos.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-023 — Criar menções e notificações por evento relevante.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-024 — Implementar compartilhamento seguro de relatórios por link expirável.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-025 — Adicionar trilha de atividade por usuário e por time.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-026 — Criar aprovação em duas etapas para ações críticas.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-027 — Implementar delegação temporária de acesso.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-028 — Adicionar calendário de tarefas e automações recorrentes.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-029 — Criar biblioteca de playbooks internos por equipe.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-030 — Implementar exportação colaborativa para PDF e planilha.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-031 — Implementar painel executivo com MRR, churn, ativação e retenção.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-032 — Adicionar funil de onboarding com quedas por etapa.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-033 — Criar coorte de uso por plano e segmento.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-034 — Implementar previsão de consumo de quota por tenant.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-035 — Adicionar alerta proativo de risco de churn.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-036 — Criar score de saúde do cliente com ações recomendadas.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-037 — Implementar analytics de performance por agente/workflow.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-038 — Adicionar benchmark interno entre equipes e unidades.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-039 — Criar relatórios agendados enviados por e-mail.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-040 — Implementar API de métricas para BI externo.
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-041 — Implementar conector nativo com Salesforce.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-042 — Adicionar conector nativo com HubSpot avançado (sync bidirecional).
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-043 — Criar integração com Slack para alertas e aprovações.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-044 — Implementar integração com Microsoft Teams.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-045 — Adicionar webhooks outbound configuráveis por evento.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-046 — Criar integração com Google Sheets para import/export.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-047 — Implementar integração com Stripe para billing avançado.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-048 — Adicionar integração com Zendesk para suporte contextual.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-049 — Criar catálogo de conectores com health status.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-050 — Implementar SDK público para integrações customizadas.
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-051 — Implementar autoscaling orientado por profundidade de fila.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-052 — Adicionar fila prioritária para clientes enterprise.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-053 — Criar limite dinâmico por tenant conforme plano contratado.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-054 — Implementar replicação de leitura para consultas analíticas.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-055 — Adicionar cache distribuído para endpoints de alto volume.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-056 — Criar modo degradado para manter operações essenciais.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-057 — Implementar failover automatizado entre regiões.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-058 — Adicionar chaos drills contínuos em serviços críticos.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-059 — Criar painel de capacidade e previsão de saturação.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-060 — Implementar proteção de picos com buffer de ingestão.
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-061 — Implementar SSO SAML/OIDC para clientes corporativos.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-062 — Adicionar MFA obrigatório por política de tenant.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-063 — Criar gestão de sessões ativas com revogação imediata.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-064 — Implementar data residency por região de cliente.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-065 — Adicionar trilha de auditoria exportável para compliance.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-066 — Criar painel de postura de segurança por conta.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-067 — Implementar DLP básico para dados sensíveis em prompts.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-068 — Adicionar retenção configurável de dados por tenant.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-069 — Criar mascaramento dinâmico para campos sensíveis na UI.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-070 — Implementar consentimento granular por finalidade de uso.
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-071 — Implementar dashboard mobile-first para gestores.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-072 — Adicionar command palette global com atalhos.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-073 — Criar onboarding contextual por tooltips progressivos.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-074 — Implementar central de notificações unificada.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-075 — Adicionar tema escuro e preferências de acessibilidade.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-076 — Criar assistente in-app para dúvidas frequentes.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-077 — Implementar busca global semântica por conteúdo.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-078 — Adicionar autosave com histórico de versões.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-079 — Criar modo foco para execução assistida de workflows.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-080 — Implementar personalização de widgets do dashboard.
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-081 — Implementar portal de parceiros com gestão de contas vinculadas.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-082 — Adicionar modelo de revenda e comissionamento.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-083 — Criar API keys com escopo e expiração configurável.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-084 — Implementar sandbox para desenvolvedores terceiros.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-085 — Adicionar documentação interativa de API com try-it.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-086 — Criar programa de templates publicados por parceiros.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-087 — Implementar webhook signing com rotação de segredo.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-088 — Adicionar painel de uso da API por aplicação.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-089 — Criar fluxo de aprovação de apps de terceiros.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-090 — Implementar faturamento separado por conta parceira.
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-091 — Implementar central de status da plataforma pública.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-092 — Adicionar chat de suporte com contexto técnico automático.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-093 — Criar base de conhecimento contextual por tela.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-094 — Implementar coleta de NPS e CES dentro do produto.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-095 — Adicionar roteamento inteligente de tickets por criticidade.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-096 — Criar playbooks de suporte para incidentes de billing.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-097 — Implementar diagnóstico automático de conta para suporte L1.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-098 — Adicionar reexecução guiada de fluxos com falha.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-099 — Criar painel de SLA de atendimento por segmento.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-100 — Implementar relatórios semanais de adoção para customer success.
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.
