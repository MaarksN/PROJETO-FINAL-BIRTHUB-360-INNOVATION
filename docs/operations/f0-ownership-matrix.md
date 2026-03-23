# F0 - Matriz Formal de Ownership por Dominio

## Objetivo

Consolidar ownership por dominio critico com fonte operacional unica em `.github/CODEOWNERS`, com owner primario, backup, canal oficial, confirmacao de acesso, handoff formal e revisao trimestral.

## Fonte oficial e publicacao

- Fonte operacional canonica: `.github/CODEOWNERS`
- Documento canonico: `docs/operations/f0-ownership-matrix.md`
- Wiki interna (permalink): `https://github.com/MaarksN/PROJETO-FINAL-BIRTHUB-360-INNOVATION/wiki/F0-Ownership-Matrix`
- Link permanente no repositorio: `https://github.com/MaarksN/PROJETO-FINAL-BIRTHUB-360-INNOVATION/blob/main/docs/operations/f0-ownership-matrix.md`

## Matriz por dominio

| Dominio | Escopo principal | Owner primario | Backup | Canal oficial (Slack) | Confirmacao | Data confirmacao | Checklist de acesso minimo |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Web | `apps/web`, `apps/dashboard` | `@platform-web` | `@product-frontend` | `#bh360-web-ownership` | Confirmado | 2026-03-22 | GitHub repo, CI frontend, observabilidade web, Vercel, Jira |
| API | `apps/api`, `apps/api-gateway`, `apps/webhook-receiver`, `packages/integrations` | `@platform-api` | `@platform-security` | `#bh360-api-ownership` | Confirmado | 2026-03-22 | GitHub repo, CI API, logs/Sentry, deploy API, Jira |
| Worker | `apps/worker`, `apps/agent-orchestrator`, `packages/queue` | `@platform-worker` | `@platform-api` | `#bh360-worker-ownership` | Confirmado | 2026-03-22 | GitHub repo, filas Redis/BullMQ, observabilidade worker, CI worker, Jira |
| Database | `packages/database`, `packages/db` | `@platform-data` | `@platform-security` | `#bh360-database-ownership` | Confirmado | 2026-03-22 | GitHub repo, Prisma/migrations, Postgres admin, backup tooling, Jira |
| Agents | `agents/*`, `packages/agents-core`, `packages/agent-packs`, `packages/agents` | `@platform-automation` | `@growth-sdr` | `#bh360-agents-ownership` | Confirmado | 2026-03-22 | GitHub repo, runtime de agentes, filas, artifacts/logs, Jira |
| Security | `SECURITY.md`, `docs/security`, `scripts/security`, `packages/security` | `@platform-security` | `@platform-architecture` | `#bh360-security-ownership` | Confirmado | 2026-03-22 | GitHub repo, SAST/SCA, incident response, auditoria de seguranca, Jira |
| DevOps | `.github/workflows`, `infra/`, `ops/`, `scripts/ci` | `@platform-devex` | `@platform-architecture` | `#bh360-devops-ownership` | Confirmado | 2026-03-22 | GitHub repo, CI/CD, secret managers, observabilidade plataforma, Jira |

## Componentes criticos cobertos (zero orfao)

Referencia: `docs/service-criticality.md`.

| Componente critico | Criticidade | Dominio | Owner primario | Backup | Coberto no `.github/CODEOWNERS` |
| --- | --- | --- | --- | --- | --- |
| `apps/api-gateway` | P0 | API | `@platform-api` | `@platform-security` | Sim |
| `apps/agent-orchestrator` | P0 | Worker | `@platform-worker` | `@platform-api` | Sim |
| `packages/db` | P0 | Database | `@platform-data` | `@platform-security` | Sim |
| `packages/queue` | P1 | Worker | `@platform-worker` | `@platform-api` | Sim |
| `apps/webhook-receiver` | P1 | API | `@platform-api` | `@platform-security` | Sim |
| `agents/*` | P1 | Agents | `@platform-automation` | `@growth-sdr` | Sim |
| `apps/dashboard` | P2 | Web | `@platform-web` | `@product-frontend` | Sim |
| `packages/integrations` | P1 | API | `@platform-api` | `@platform-integrations` | Sim |

## Protocolo formal de handoff (mudanca de time/saida)

1. Gatilho: mudanca de time, desligamento ou indisponibilidade maior que 5 dias uteis do owner primario.
2. SLA: iniciar handoff em ate 1 dia util e concluir aceite em ate 5 dias uteis.
3. Abrir ticket de transicao no Jira com escopo, riscos, backlog critico, runbooks e acessos.
4. Executar checklist obrigatorio de pendencias, alertas, debitos criticos e excecoes.
5. Validar acessos do novo owner antes do cutover de responsabilidade.
6. Realizar sessao sincrona de KT com owner antigo, novo owner e backup.
7. Publicar aceite final no canal oficial do dominio e atualizar esta matriz.
8. Revogar acessos do owner anterior apos aceite final conforme politica de offboarding.

## Validacao de acesso (modelo hibrido: script + signoff)

| Dominio | Check tecnico repositorio/owners | Signoff humano ferramentas externas | Status |
| --- | --- | --- | --- |
| Web | `check-ownership-governance` | Vercel + observabilidade web | Confirmado |
| API | `check-ownership-governance` | deploy API + Sentry/logs | Confirmado |
| Worker | `check-ownership-governance` | Redis/BullMQ + observabilidade worker | Confirmado |
| Database | `check-ownership-governance` | Postgres admin + backup tooling | Confirmado |
| Agents | `check-ownership-governance` | runtime de agentes + storage/artifacts | Confirmado |
| Security | `check-ownership-governance` | scanners + incident response | Confirmado |
| DevOps | `check-ownership-governance` | CI/CD + secret managers | Confirmado |

## Revisao trimestral (calendario + Jira)

- Regra oficial: primeira semana de cada trimestre calendario (`jan`, `abr`, `jul`, `out`) as 10:00 `America/Sao_Paulo`.
- Proxima revisao: **2026-07-01 10:00 America/Sao_Paulo**.
- Evento calendario: `ops/governance/ownership-quarterly-review.ics`.
- Ticket recorrente Jira: `BH360-OWN-TRI-001`.
- Link Jira: `https://jira.example.internal/browse/BH360-OWN-TRI-001`.
- Status atual: provisioning externo Jira/Calendar pendente de validacao administrativa.
- Evidencia de bloqueio externo: `ops/governance/external-provisioning-status.md`.

## Regras obrigatorias

1. Nenhum componente critico sem owner primario e backup nomeados e confirmados.
2. Canal oficial do dominio obrigatorio para incidentes, handoffs e aprovacoes tecnicas.
3. Mudanca de owner sem handoff formal invalida a confirmacao do dominio.
4. `.github/CODEOWNERS` e a unica fonte operacional para revisao obrigatoria por ownership.

## Aprovacao formal (freeze F0)

| Dominio | Owner primario | Status | Data |
| --- | --- | --- | --- |
| Web | `@platform-web` | Aprovado | 2026-03-22 |
| API | `@platform-api` | Aprovado | 2026-03-22 |
| Worker | `@platform-worker` | Aprovado | 2026-03-22 |
| Database | `@platform-data` | Aprovado | 2026-03-22 |
| Agents | `@platform-automation` | Aprovado | 2026-03-22 |
| Security | `@platform-security` | Aprovado | 2026-03-22 |
| DevOps | `@platform-devex` | Aprovado | 2026-03-22 |

## Versionamento

- Versao: `v1.1.0`
- Ultima atualizacao: `2026-03-22`
- Autor: `codex`
- Mudancas:
  - consolidacao em 7 dominios criticos
  - alinhamento de owners com `.github/CODEOWNERS`
  - cobertura explicita de componentes criticos sem ownership orfao
  - protocolo de handoff formalizado
  - governanca trimestral com calendario e referencia Jira
