# Checklist detalhado com 200 itens (execução + código + risco)

Data: 2026-04-04

> Estrutura de cada item: **Como fazer**, **Código de referência**, **Impacto**, **Possíveis erros e tratativas**.
> Legenda de status: <span style="color:#16a34a"><strong>🟢 Concluído</strong></span> | <span style="color:#ca8a04"><strong>🟡 Precisa de melhorias</strong></span> | <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>.

## Checklist 1-100 — Dívida técnica
### TD-001 — Reduzir acoplamento de rotas no bootstrap da API, separando composição por domínio.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Reduzir acoplamento de rotas no bootstrap da API, separando composição por domínio." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-002 — Padronizar contratos de erro Problem Details em 100% dos endpoints.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar contratos de erro Problem Details em 100% dos endpoints." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-003 — Unificar middlewares duplicados de contexto de tenant em uma única implementação.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Unificar middlewares duplicados de contexto de tenant em uma única implementação." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-004 — Criar camada de versionamento explícito de API para evitar breaking changes silenciosas.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar camada de versionamento explícito de API para evitar breaking changes silenciosas." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-005 — Adicionar limites de payload por rota com fallback observável.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar limites de payload por rota com fallback observável." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-006 — Eliminar lógica de regra de negócio dentro de controllers, movendo para services.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Eliminar lógica de regra de negócio dentro de controllers, movendo para services." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-007 — Padronizar serialização/deserialização de datas para UTC em toda API.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar serialização/deserialização de datas para UTC em toda API." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-008 — Adicionar validação de schema de resposta para endpoints críticos.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar validação de schema de resposta para endpoints críticos." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-009 — Reduzir número de dependências implícitas entre auth-routes e core-routes.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Reduzir número de dependências implícitas entre auth-routes e core-routes." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-010 — Criar contrato de idempotência para endpoints de escrita críticos.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar contrato de idempotência para endpoints de escrita críticos." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### TD-011 — Isolar orchestration engine em módulo puro para facilitar testes de regressão.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Isolar orchestration engine em módulo puro para facilitar testes de regressão." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-012 — Criar política unificada de retry/backoff por tipo de job.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar política unificada de retry/backoff por tipo de job." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-013 — Implementar dead-letter queue com motivo padronizado por falha.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar dead-letter queue com motivo padronizado por falha." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-014 — Adicionar controle de concorrência por tenant para evitar noisy neighbor.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar controle de concorrência por tenant para evitar noisy neighbor." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-015 — Instrumentar tempo de fila versus tempo de execução em todas as filas.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Instrumentar tempo de fila versus tempo de execução em todas as filas." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-016 — Eliminar duplicidade de validações entre worker.job-validation e process-job.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Eliminar duplicidade de validações entre worker.job-validation e process-job." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-017 — Criar timeout hard e soft por executor com cancelamento cooperativo.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar timeout hard e soft por executor com cancelamento cooperativo." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-018 — Centralizar mapeamento de erros transitórios versus permanentes.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Centralizar mapeamento de erros transitórios versus permanentes." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-019 — Adicionar guardrail para jobs órfãos e reprocessamento seguro.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar guardrail para jobs órfãos e reprocessamento seguro." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-020 — Definir contrato de prioridade de jobs (alta/média/baixa) com fairness.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Definir contrato de prioridade de jobs (alta/média/baixa) com fairness." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### TD-021 — Revisar índices compostos para consultas multi-tenant de alto volume.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Revisar índices compostos para consultas multi-tenant de alto volume." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-022 — Padronizar paginação cursor-based em repositórios sensíveis a escala.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar paginação cursor-based em repositórios sensíveis a escala." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-023 — Criar política de query budget por caso de uso e não só global.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar política de query budget por caso de uso e não só global." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-024 — Migrar operações críticas para transações com timeout explícito.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Migrar operações críticas para transações com timeout explícito." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-025 — Adicionar trilha de auditoria de mudanças de status em entidades-chave.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar trilha de auditoria de mudanças de status em entidades-chave." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-026 — Criar estratégia de arquivamento para tabelas com crescimento contínuo.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar estratégia de arquivamento para tabelas com crescimento contínuo." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-027 — Padronizar naming de migrations para rastreabilidade por domínio.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar naming de migrations para rastreabilidade por domínio." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-028 — Adicionar validação automática de isolamento tenant em novos repositórios.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar validação automática de isolamento tenant em novos repositórios." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-029 — Reduzir uso de consultas ad-hoc em favor de repositórios tipados.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Reduzir uso de consultas ad-hoc em favor de repositórios tipados." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-030 — Criar benchmark periódico de consultas top-N por latência.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar benchmark periódico de consultas top-N por latência." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Escrever migration em `packages/database/prisma/migrations`. 2) Ajustar repositório e índices. 3) Validar com teste de regressão e `db:validate:pr`.
- **Código de referência:**
```sql
CREATE INDEX CONCURRENTLY idx_tenant_status ON "WorkflowRun"("tenantId","status");
```
- **Impacto na ferramenta:** Melhora latência de consultas e reduz custo de CPU do banco.
- **Possíveis erros e tratativas:** Erro: lock em tabela grande. Tratativa: migration online/CONCURRENTLY + janela controlada.

### TD-031 — Padronizar convenção de nomes de métricas entre API, Web e Worker.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar convenção de nomes de métricas entre API, Web e Worker." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-032 — Adicionar SLO formal para disponibilidade, latência e erro por serviço.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar SLO formal para disponibilidade, latência e erro por serviço." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-033 — Criar dashboards por jornada crítica (login, execução, billing, convite).
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar dashboards por jornada crítica (login, execução, billing, convite)." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-034 — Garantir correlação de trace-id fim a fim entre web, api e worker.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Garantir correlação de trace-id fim a fim entre web, api e worker." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-035 — Instrumentar eventos de negócio com cardinalidade controlada.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Instrumentar eventos de negócio com cardinalidade controlada." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-036 — Adicionar alertas por budget de erro semanal e não só threshold absoluto.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar alertas por budget de erro semanal e não só threshold absoluto." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-037 — Criar runbook mínimo por alerta P1/P2 integrado ao monitoramento.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar runbook mínimo por alerta P1/P2 integrado ao monitoramento." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-038 — Padronizar nível de severidade de logs estruturados.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar nível de severidade de logs estruturados." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-039 — Adicionar healthchecks dependentes por componente externo.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar healthchecks dependentes por componente externo." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-040 — Implementar relatório diário automático de incidentes e quase-incidentes.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar relatório diário automático de incidentes e quase-incidentes." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### TD-041 — Completar matriz de autorização por papel e recurso em rotas protegidas.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Completar matriz de autorização por papel e recurso em rotas protegidas." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-042 — Adicionar rotação automática de chaves para criptografia de dados sensíveis.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar rotação automática de chaves para criptografia de dados sensíveis." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-043 — Padronizar política de rate limit por risco de endpoint.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar política de rate limit por risco de endpoint." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-044 — Criar trilha de auditoria para ações administrativas críticas.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar trilha de auditoria para ações administrativas críticas." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-045 — Adicionar detecção de anomalia para tentativas de login e convite.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar detecção de anomalia para tentativas de login e convite." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-046 — Implementar validação de origem e CORS baseada em ambiente.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar validação de origem e CORS baseada em ambiente." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-047 — Reforçar sanitização server-side para entradas ricas em texto.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Reforçar sanitização server-side para entradas ricas em texto." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-048 — Criar varredura contínua de segredos em commits e variáveis de ambiente.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar varredura contínua de segredos em commits e variáveis de ambiente." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-049 — Adicionar evidência automatizada de consentimento e preferências de cookie.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar evidência automatizada de consentimento e preferências de cookie." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-050 — Padronizar hardening headers de segurança em todas respostas web/api.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar hardening headers de segurança em todas respostas web/api." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### TD-051 — Reduzir acoplamento entre componentes de dashboard e APIs internas.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Reduzir acoplamento entre componentes de dashboard e APIs internas." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-052 — Criar biblioteca de estados de carregamento, vazio e erro reutilizável.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar biblioteca de estados de carregamento, vazio e erro reutilizável." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-053 — Padronizar tratamento de sessão expirada com recuperação graciosa.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar tratamento de sessão expirada com recuperação graciosa." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-054 — Reduzir hidratação desnecessária em páginas de alto tráfego.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Reduzir hidratação desnecessária em páginas de alto tráfego." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-055 — Implementar orçamento de performance para rota inicial e dashboard.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar orçamento de performance para rota inicial e dashboard." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-056 — Adicionar acessibilidade AA em formulários e navegação por teclado.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar acessibilidade AA em formulários e navegação por teclado." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-057 — Padronizar telemetria de cliques e conversão por feature flag.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar telemetria de cliques e conversão por feature flag." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-058 — Criar fallback offline básico para assets essenciais do PWA.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar fallback offline básico para assets essenciais do PWA." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-059 — Uniformizar validação de formulários entre client e server.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Uniformizar validação de formulários entre client e server." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-060 — Adicionar proteção anti-duplo clique em ações de escrita.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar proteção anti-duplo clique em ações de escrita." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### TD-061 — Criar contrato único de erro para provedores externos.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar contrato único de erro para provedores externos." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-062 — Implementar circuit breaker por integração crítica.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar circuit breaker por integração crítica." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-063 — Adicionar replay seguro para webhooks recebidos com deduplicação.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar replay seguro para webhooks recebidos com deduplicação." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-064 — Padronizar assinatura e validação de payloads webhook.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar assinatura e validação de payloads webhook." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-065 — Criar tabela de mapeamento de campos versionada por conector.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar tabela de mapeamento de campos versionada por conector." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-066 — Adicionar monitor de SLA por provedor externo.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar monitor de SLA por provedor externo." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-067 — Implementar sandbox de testes para conectores sem impactar produção.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar sandbox de testes para conectores sem impactar produção." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-068 — Padronizar estratégia de paginação e sincronização incremental.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar estratégia de paginação e sincronização incremental." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-069 — Criar verificação automática de drift de contratos externos.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar verificação automática de drift de contratos externos." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-070 — Adicionar fallback de degradação funcional quando provedor estiver indisponível.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar fallback de degradação funcional quando provedor estiver indisponível." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### TD-071 — Aumentar cobertura de testes de integração para fluxos cross-service.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Aumentar cobertura de testes de integração para fluxos cross-service." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-072 — Padronizar fixtures e factories para reduzir flaky tests.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar fixtures e factories para reduzir flaky tests." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-073 — Criar suíte de contract testing entre web-bff-api-worker.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar suíte de contract testing entre web-bff-api-worker." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-074 — Adicionar testes de carga mínimos em pipeline noturno.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar testes de carga mínimos em pipeline noturno." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-075 — Reduzir tempo de feedback da pipeline com paralelismo otimizado.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Reduzir tempo de feedback da pipeline com paralelismo otimizado." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-076 — Criar smoke suite de release focada em caminhos de receita.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar smoke suite de release focada em caminhos de receita." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-077 — Adicionar validação de migração de banco em ambiente efêmero por PR.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar validação de migração de banco em ambiente efêmero por PR." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-078 — Padronizar tags de testes (unit/integration/slow) com enforcement.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar tags de testes (unit/integration/slow) com enforcement." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-079 — Criar métrica de confiabilidade de testes por pacote.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar métrica de confiabilidade de testes por pacote." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-080 — Automatizar triagem de falhas recorrentes com classificação de causa.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Automatizar triagem de falhas recorrentes com classificação de causa." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar cenário de teste com fixture determinística. 2) Executar na pipeline por tag (`unit`/`integration`). 3) Publicar evidência no relatório.
- **Código de referência:**
```bash
corepack pnpm test:tag:integration
```
- **Impacto na ferramenta:** Reduz regressões e acelera release com confiança.
- **Possíveis erros e tratativas:** Erro: teste flaky. Tratativa: remover dependência de tempo real e rede externa.

### TD-081 — Reduzir complexidade de scripts de CI centralizando utilitários comuns.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Reduzir complexidade de scripts de CI centralizando utilitários comuns." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-082 — Padronizar convenção de boundaries entre pacotes do monorepo.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar convenção de boundaries entre pacotes do monorepo." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-083 — Criar score de acoplamento entre módulos para guiar refactor.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar score de acoplamento entre módulos para guiar refactor." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-084 — Adicionar validação automática de APIs internas não utilizadas.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar validação automática de APIs internas não utilizadas." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-085 — Definir política de depreciação com janela e comunicação automática.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Definir política de depreciação com janela e comunicação automática." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-086 — Padronizar templates de PR técnico com impacto operacional.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar templates de PR técnico com impacto operacional." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-087 — Criar check de compatibilidade Node/pnpm pré-execução local.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar check de compatibilidade Node/pnpm pré-execução local." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-088 — Adicionar blueprint de criação de novo serviço/pacote.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar blueprint de criação de novo serviço/pacote." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-089 — Automatizar geração de changelog por domínio.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Automatizar geração de changelog por domínio." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-090 — Criar baseline de tempo de build/test por pacote para otimização contínua.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar baseline de tempo de build/test por pacote para otimização contínua." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Simplificar script com utilitário compartilhado em `scripts/ci`. 2) Documentar uso no package script. 3) Adicionar validação automática no CI.
- **Código de referência:**
```json
{ "scripts": { "ci:core": "node scripts/ci/full.mjs task core" } }
```
- **Impacto na ferramenta:** Diminui tempo operacional do time e falhas humanas de processo.
- **Possíveis erros e tratativas:** Erro: quebra de pipeline legada. Tratativa: manter compatibilidade por alias temporário.

### TD-091 — Padronizar cálculo de quota entre API e Worker para evitar divergência.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar cálculo de quota entre API e Worker para evitar divergência." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-092 — Criar reconciliação diária de billing com trilha de inconsistências.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar reconciliação diária de billing com trilha de inconsistências." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-093 — Adicionar idempotência nas rotinas de exportação financeira.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar idempotência nas rotinas de exportação financeira." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-094 — Criar fallback operacional para falha na emissão de cobrança.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar fallback operacional para falha na emissão de cobrança." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-095 — Implementar travas de consistência em aceitação de convites.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar travas de consistência em aceitação de convites." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-096 — Padronizar estados de workflow com transições auditáveis.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar estados de workflow com transições auditáveis." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-097 — Criar monitor de abandono de onboarding com causa técnica.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar monitor de abandono de onboarding com causa técnica." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-098 — Adicionar proteção contra execução duplicada de workflow.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar proteção contra execução duplicada de workflow." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-099 — Criar mecanismo de reprocessamento manual assistido para suporte.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar mecanismo de reprocessamento manual assistido para suporte." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### TD-100 — Padronizar KPIs de saúde de plataforma com threshold operacional.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Padronizar KPIs de saúde de plataforma com threshold operacional." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

## Checklist 101-200 — Novas implementações
### NI-001 — Implementar onboarding guiado em 5 passos com progresso salvo.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar onboarding guiado em 5 passos com progresso salvo." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-002 — Adicionar trial automático com conversão para plano pago no app.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar trial automático com conversão para plano pago no app." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-003 — Criar paywall contextual por recurso premium.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar paywall contextual por recurso premium." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-004 — Implementar fluxo self-service de upgrade/downgrade de plano.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar fluxo self-service de upgrade/downgrade de plano." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-005 — Adicionar gestão de método de pagamento no painel.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar gestão de método de pagamento no painel." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-006 — Criar centro de faturamento com histórico e invoices.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar centro de faturamento com histórico e invoices." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-007 — Implementar recuperação de churn com ofertas in-app.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar recuperação de churn com ofertas in-app." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-008 — Adicionar cupom promocional com validade e limite de uso.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar cupom promocional com validade e limite de uso." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-009 — Criar tela de limites de uso e consumo em tempo real.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar tela de limites de uso e consumo em tempo real." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-010 — Implementar e-mails transacionais de cobrança e renovação.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar e-mails transacionais de cobrança e renovação." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-011 — Implementar marketplace interno de agentes com filtros por caso de uso.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar marketplace interno de agentes com filtros por caso de uso." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-012 — Adicionar execução em lote de agentes por lista de tarefas.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar execução em lote de agentes por lista de tarefas." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-013 — Criar biblioteca de prompts versionados por equipe.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar biblioteca de prompts versionados por equipe." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-014 — Implementar comparação A/B de resposta entre modelos.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar comparação A/B de resposta entre modelos." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-015 — Adicionar memória de contexto por conta e por usuário.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar memória de contexto por conta e por usuário." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-016 — Criar painel de custo por execução de agente.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar painel de custo por execução de agente." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-017 — Implementar aprovação humana opcional antes de ação sensível.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar aprovação humana opcional antes de ação sensível." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-018 — Adicionar trilha de explicabilidade de decisões do agente.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar trilha de explicabilidade de decisões do agente." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-019 — Criar templates de workflow com agentes prontos por vertical.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar templates de workflow com agentes prontos por vertical." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-020 — Implementar fallback automático para modelo secundário.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar fallback automático para modelo secundário." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-021 — Implementar espaços de trabalho multi-time com permissões granulares.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar espaços de trabalho multi-time com permissões granulares." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-022 — Adicionar comentários em execuções e artefatos.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar comentários em execuções e artefatos." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-023 — Criar menções e notificações por evento relevante.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar menções e notificações por evento relevante." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-024 — Implementar compartilhamento seguro de relatórios por link expirável.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar compartilhamento seguro de relatórios por link expirável." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-025 — Adicionar trilha de atividade por usuário e por time.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar trilha de atividade por usuário e por time." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-026 — Criar aprovação em duas etapas para ações críticas.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar aprovação em duas etapas para ações críticas." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-027 — Implementar delegação temporária de acesso.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar delegação temporária de acesso." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-028 — Adicionar calendário de tarefas e automações recorrentes.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar calendário de tarefas e automações recorrentes." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-029 — Criar biblioteca de playbooks internos por equipe.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar biblioteca de playbooks internos por equipe." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-030 — Implementar exportação colaborativa para PDF e planilha.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar exportação colaborativa para PDF e planilha." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-031 — Implementar painel executivo com MRR, churn, ativação e retenção.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar painel executivo com MRR, churn, ativação e retenção." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-032 — Adicionar funil de onboarding com quedas por etapa.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar funil de onboarding com quedas por etapa." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-033 — Criar coorte de uso por plano e segmento.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar coorte de uso por plano e segmento." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-034 — Implementar previsão de consumo de quota por tenant.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar previsão de consumo de quota por tenant." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-035 — Adicionar alerta proativo de risco de churn.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar alerta proativo de risco de churn." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-036 — Criar score de saúde do cliente com ações recomendadas.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar score de saúde do cliente com ações recomendadas." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-037 — Implementar analytics de performance por agente/workflow.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar analytics de performance por agente/workflow." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-038 — Adicionar benchmark interno entre equipes e unidades.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar benchmark interno entre equipes e unidades." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-039 — Criar relatórios agendados enviados por e-mail.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar relatórios agendados enviados por e-mail." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-040 — Implementar API de métricas para BI externo.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar API de métricas para BI externo." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir métrica, unidade e labels. 2) Instrumentar no ponto de entrada e saída. 3) Criar dashboard + alerta com runbook.
- **Código de referência:**
```ts
metrics.counter('job_fail_total').inc({ job: 'billingExport', reason: 'timeout' });
```
- **Impacto na ferramenta:** Diminui MTTR e permite agir antes de incidente virar P1.
- **Possíveis erros e tratativas:** Erro: alta cardinalidade de label. Tratativa: usar enums curtos e limitar valores dinâmicos.

### NI-041 — Implementar conector nativo com Salesforce.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar conector nativo com Salesforce." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-042 — Adicionar conector nativo com HubSpot avançado (sync bidirecional).
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar conector nativo com HubSpot avançado (sync bidirecional)." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-043 — Criar integração com Slack para alertas e aprovações.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar integração com Slack para alertas e aprovações." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-044 — Implementar integração com Microsoft Teams.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar integração com Microsoft Teams." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-045 — Adicionar webhooks outbound configuráveis por evento.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar webhooks outbound configuráveis por evento." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-046 — Criar integração com Google Sheets para import/export.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar integração com Google Sheets para import/export." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-047 — Implementar integração com Stripe para billing avançado.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar integração com Stripe para billing avançado." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-048 — Adicionar integração com Zendesk para suporte contextual.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar integração com Zendesk para suporte contextual." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-049 — Criar catálogo de conectores com health status.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar catálogo de conectores com health status." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-050 — Implementar SDK público para integrações customizadas.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar SDK público para integrações customizadas." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Definir contrato de integração e idempotência. 2) Implementar assinatura/validação de payload. 3) Criar monitor de SLA e replay seguro.
- **Código de referência:**
```ts
const sig = createHmac('sha256', secret).update(rawBody).digest('hex');
```
- **Impacto na ferramenta:** Eleva confiabilidade de sync externo e reduz perda de eventos.
- **Possíveis erros e tratativas:** Erro: duplicidade de evento. Tratativa: chave idempotente + tabela de deduplicação.

### NI-051 — Implementar autoscaling orientado por profundidade de fila.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar autoscaling orientado por profundidade de fila." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-052 — Adicionar fila prioritária para clientes enterprise.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar fila prioritária para clientes enterprise." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-053 — Criar limite dinâmico por tenant conforme plano contratado.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar limite dinâmico por tenant conforme plano contratado." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-054 — Implementar replicação de leitura para consultas analíticas.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar replicação de leitura para consultas analíticas." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-055 — Adicionar cache distribuído para endpoints de alto volume.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar cache distribuído para endpoints de alto volume." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-056 — Criar modo degradado para manter operações essenciais.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar modo degradado para manter operações essenciais." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-057 — Implementar failover automatizado entre regiões.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar failover automatizado entre regiões." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-058 — Adicionar chaos drills contínuos em serviços críticos.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar chaos drills contínuos em serviços críticos." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-059 — Criar painel de capacidade e previsão de saturação.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar painel de capacidade e previsão de saturação." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-060 — Implementar proteção de picos com buffer de ingestão.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar proteção de picos com buffer de ingestão." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Mapear job no `workerFactory`. 2) Definir timeout, retry e DLQ no executor. 3) Cobrir com teste unitário + integração de fila.
- **Código de referência:**
```ts
await queue.add('job-name', payload, { attempts: 5, backoff: { type: 'exponential', delay: 2000 } });
```
- **Impacto na ferramenta:** Aumenta throughput com previsibilidade e evita filas travadas.
- **Possíveis erros e tratativas:** Erro: reprocessamento infinito. Tratativa: limite de tentativas + dead-letter queue + alerta.

### NI-061 — Implementar SSO SAML/OIDC para clientes corporativos.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar SSO SAML/OIDC para clientes corporativos." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-062 — Adicionar MFA obrigatório por política de tenant.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar MFA obrigatório por política de tenant." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-063 — Criar gestão de sessões ativas com revogação imediata.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar gestão de sessões ativas com revogação imediata." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-064 — Implementar data residency por região de cliente.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar data residency por região de cliente." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-065 — Adicionar trilha de auditoria exportável para compliance.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar trilha de auditoria exportável para compliance." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-066 — Criar painel de postura de segurança por conta.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar painel de postura de segurança por conta." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-067 — Implementar DLP básico para dados sensíveis em prompts.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar DLP básico para dados sensíveis em prompts." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-068 — Adicionar retenção configurável de dados por tenant.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar retenção configurável de dados por tenant." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-069 — Criar mascaramento dinâmico para campos sensíveis na UI.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar mascaramento dinâmico para campos sensíveis na UI." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-070 — Implementar consentimento granular por finalidade de uso.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar consentimento granular por finalidade de uso." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Classificar risco do endpoint. 2) Aplicar controle (authz, rate-limit, sanitização, CSRF/CORS). 3) Adicionar teste negativo de segurança.
- **Código de referência:**
```ts
if (!rbac.can(user.role, 'billing:write')) throw forbidden();
```
- **Impacto na ferramenta:** Reduz exposição de dados e risco de abuso/fraude.
- **Possíveis erros e tratativas:** Erro: falso bloqueio de usuário legítimo. Tratativa: modo monitor + rollout progressivo.

### NI-071 — Implementar dashboard mobile-first para gestores.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar dashboard mobile-first para gestores." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-072 — Adicionar command palette global com atalhos.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar command palette global com atalhos." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-073 — Criar onboarding contextual por tooltips progressivos.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar onboarding contextual por tooltips progressivos." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-074 — Implementar central de notificações unificada.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar central de notificações unificada." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-075 — Adicionar tema escuro e preferências de acessibilidade.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar tema escuro e preferências de acessibilidade." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-076 — Criar assistente in-app para dúvidas frequentes.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar assistente in-app para dúvidas frequentes." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-077 — Implementar busca global semântica por conteúdo.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar busca global semântica por conteúdo." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-078 — Adicionar autosave com histórico de versões.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar autosave com histórico de versões." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-079 — Criar modo foco para execução assistida de workflows.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar modo foco para execução assistida de workflows." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-080 — Implementar personalização de widgets do dashboard.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar personalização de widgets do dashboard." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Ajustar componente em `apps/web/components` com estado loading/erro/vazio. 2) Integrar com API resiliente. 3) Medir web vitals após deploy.
- **Código de referência:**
```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorState retry={refetch} />;
```
- **Impacto na ferramenta:** Aumenta conversão e reduz abandono por falha de UX.
- **Possíveis erros e tratativas:** Erro: regressão visual. Tratativa: snapshot test + revisão em ambiente preview.

### NI-081 — Implementar portal de parceiros com gestão de contas vinculadas.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar portal de parceiros com gestão de contas vinculadas." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-082 — Adicionar modelo de revenda e comissionamento.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar modelo de revenda e comissionamento." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-083 — Criar API keys com escopo e expiração configurável.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar API keys com escopo e expiração configurável." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-084 — Implementar sandbox para desenvolvedores terceiros.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar sandbox para desenvolvedores terceiros." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-085 — Adicionar documentação interativa de API com try-it.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar documentação interativa de API com try-it." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-086 — Criar programa de templates publicados por parceiros.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar programa de templates publicados por parceiros." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-087 — Implementar webhook signing com rotação de segredo.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar webhook signing com rotação de segredo." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-088 — Adicionar painel de uso da API por aplicação.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar painel de uso da API por aplicação." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-089 — Criar fluxo de aprovação de apps de terceiros.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar fluxo de aprovação de apps de terceiros." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-090 — Implementar faturamento separado por conta parceira.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar faturamento separado por conta parceira." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Criar ticket técnico com contrato de entrada/saída. 2) Implementar em `apps/api/src` usando schema validation (zod) e testes de integração. 3) Publicar métrica em `metrics.ts` e feature flag para rollout.
- **Código de referência:**
```ts
const body = schema.parse(req.body);
return res.status(200).json({ ok: true, data: body });
```
- **Impacto na ferramenta:** Reduz incidentes em produção e acelera diagnóstico de erro no BFF/API.
- **Possíveis erros e tratativas:** Erro: breaking change de contrato. Tratativa: versionar rota (`/v1`, `/v2`) + teste de compatibilidade.

### NI-091 — Implementar central de status da plataforma pública.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar central de status da plataforma pública." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-092 — Adicionar chat de suporte com contexto técnico automático.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar chat de suporte com contexto técnico automático." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-093 — Criar base de conhecimento contextual por tela.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar base de conhecimento contextual por tela." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-094 — Implementar coleta de NPS e CES dentro do produto.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar coleta de NPS e CES dentro do produto." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-095 — Adicionar roteamento inteligente de tickets por criticidade.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar roteamento inteligente de tickets por criticidade." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-096 — Criar playbooks de suporte para incidentes de billing.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar playbooks de suporte para incidentes de billing." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-097 — Implementar diagnóstico automático de conta para suporte L1.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar diagnóstico automático de conta para suporte L1." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-098 — Adicionar reexecução guiada de fluxos com falha.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Adicionar reexecução guiada de fluxos com falha." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-099 — Criar painel de SLA de atendimento por segmento.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Criar painel de SLA de atendimento por segmento." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.

### NI-100 — Implementar relatórios semanais de adoção para customer success.
- **Status atual:** <span style="color:#dc2626"><strong>🔴 Não iniciado</strong></span>
- **Prompt de execução (copiar e usar):** `Você é um engenheiro sênior da plataforma BirthHub 360. Implemente o item "Implementar relatórios semanais de adoção para customer success." em produção com qualidade enterprise. Entregue: (1) plano técnico passo a passo, (2) mudanças de código por arquivo, (3) migrations/configs necessárias, (4) testes unitários e integração, (5) métricas/alertas, (6) riscos e rollback, (7) critérios de aceite objetivos. Use TypeScript, padrões do monorepo e rollout com feature flag.`
- **Como fazer:** 1) Desenhar fluxo de produto e estados de negócio. 2) Implementar API + worker + UI com feature flag. 3) Monitorar KPI (ativação/receita/churn).
- **Código de referência:**
```ts
if (plan === 'trial' && usage > quota) return { action: 'show_paywall' };
```
- **Impacto na ferramenta:** Impacta diretamente receita, retenção e experiência do cliente.
- **Possíveis erros e tratativas:** Erro: inconsistência de estado entre serviços. Tratativa: evento de domínio + reconciliação diária.
