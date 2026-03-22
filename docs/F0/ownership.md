# Matriz de Ownership Técnico

| Domínio | Componentes Principais | Owner Primário | Owner Backup | Canal Oficial (Slack) |
|---|---|---|---|---|
| **Web** | apps/web, apps/dashboard | Frontend Team (João) | Frontend Team (Maria) | #dev-web |
| **API** | apps/api, apps/api-gateway | Backend Team (Carlos) | Backend Team (Ana) | #dev-api |
| **Worker** | apps/worker | Backend Team (Ana) | Backend Team (Carlos) | #dev-worker |
| **Database** | packages/database, packages/db | Data Team (Pedro) | Backend Team (Carlos) | #dev-db |
| **Agents** | packages/agents, apps/worker | AI Team (Lucas) | AI Team (Julia) | #dev-agents |
| **Security** | packages/auth, CI/CD sec checks | SecOps Team (Roberto) | SecOps Team (Fernanda) | #secops |
| **DevOps** | infra/, ops/, CI/CD | DevOps Team (Fernanda) | DevOps Team (Roberto) | #devops |

## Protocolo de Handoff
Em caso de mudança de time ou saída da empresa:
1. O owner atual deve documentar o estado atual dos sistemas em seu domínio.
2. Uma reunião de passagem de bastão (KT - Knowledge Transfer) deve ser realizada com o novo owner e o backup.
3. Acessos a repositórios e ferramentas devem ser transferidos pelo time de DevOps em até 48h.
4. A matriz de ownership deve ser atualizada e comunicada no canal #engineering-all.

## Revisão Trimestral
A matriz de ownership será revisada e confirmada na primeira semana de cada trimestre pelo Engineering Manager.

## Validação de Acessos
[x] Confirmado que todos os owners possuem acesso de 'Maintainer' ou 'Admin' nos respectivos repositórios e ferramentas (GCP, Vercel, etc.).
