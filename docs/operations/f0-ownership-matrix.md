# F0 — Matriz de Ownership Técnico

## Objetivo

Formalizar ownership por domínio para o congelamento inicial do repositório, com owner primário, backup, canal operacional, escopo, protocolo de handoff e rotina de revisão.

## Matriz por domínio

| Domínio | Escopo | Owner primário | Backup | Canal oficial | Acessos mínimos exigidos | Revisão trimestral |
| --- | --- | --- | --- | --- | --- | --- |
| Web | `apps/web`, DX frontend, app-router, UI shell | Platform Frontend (`@product-frontend`) | Platform Architecture (`@platform-architecture`) | `#bh360-web-ownership` | GitHub repo, Vercel/CI, observabilidade web | 2026-06-22 |
| API | `apps/api`, contratos HTTP, auth, RBAC, billing API | Platform API (`@platform-api`) | Platform Architecture (`@platform-architecture`) | `#bh360-api-ownership` | GitHub repo, Railway/Fly deploy, Sentry, logs | 2026-06-22 |
| Worker | `apps/worker`, filas, jobs, workflows | Platform Automation (`@platform-automation`) | Platform API (`@platform-api`) | `#bh360-worker-ownership` | GitHub repo, Redis queues, observabilidade worker | 2026-06-22 |
| Database | `packages/database`, Prisma, migrações, retenção | Platform Data (`@platform-data`) | Platform Architecture (`@platform-architecture`) | `#bh360-database-ownership` | GitHub repo, Prisma, Postgres admin read, backups | 2026-06-22 |
| Agents | `agents/*`, `packages/agents-*`, runtimes e contratos | Platform Automation (`@platform-automation`) | Growth SDR Systems (`@growth-sdr`) | `#bh360-agents-ownership` | GitHub repo, filas, storage de prompts e logs | 2026-06-22 |
| Security | guardrails, scans, políticas, exception handling | Platform Architecture (`@platform-architecture`) | Platform API (`@platform-api`) | `#bh360-security-ownership` | GitHub repo, SAST/SCA, auditoria, incidentes | 2026-06-22 |
| DevOps | CI/CD, gates, releases, branch protection | Platform Architecture (`@platform-architecture`) | Platform Automation (`@platform-automation`) | `#bh360-devops-ownership` | GitHub repo, CI, environments, secret managers | 2026-06-22 |

## Regras obrigatórias

1. Nenhum componente crítico pode operar sem owner e backup nomeados.
2. O canal oficial do domínio é o ponto padrão para incidentes, handoffs e aprovações técnicas.
3. O owner precisa manter acesso funcional ao repositório, pipelines, observabilidade e ferramenta primária do domínio.
4. Mudanças de owner exigem handoff documentado, checkpoint e aceite do novo responsável.

## Protocolo de handoff

1. Abrir ticket de transição com escopo, ativos, riscos e pendências.
2. Registrar status de backlog, alertas abertos, debt crítico e runbooks do domínio.
3. Validar acessos do novo owner antes da transferência de responsabilidade.
4. Executar sessão síncrona de handoff com owner antigo, novo owner e backup.
5. Publicar aceite final no canal oficial e atualizar esta matriz/versionamento.

## Critério de confirmação de acesso

Um owner é considerado confirmado apenas quando possui acesso operacional aos seguintes itens do seu domínio:

- repositório e revisão de código;
- pipeline de CI/CD aplicável;
- observabilidade/logs;
- ferramenta crítica de operação do domínio;
- documentação e runbooks vinculados.

## Aprovação formal

| Domínio | Owner | Status | Data |
| --- | --- | --- | --- |
| Web | `@product-frontend` | Aprovado | 2026-03-22 |
| API | `@platform-api` | Aprovado | 2026-03-22 |
| Worker | `@platform-automation` | Aprovado | 2026-03-22 |
| Database | `@platform-data` | Aprovado | 2026-03-22 |
| Agents | `@platform-automation` | Aprovado | 2026-03-22 |
| Security | `@platform-architecture` | Aprovado | 2026-03-22 |
| DevOps | `@platform-architecture` | Aprovado | 2026-03-22 |
