# Ciclo F0-F1 - Rastreabilidade e Bloqueadores Canonicos

## Objetivo do ciclo
Fechar os bloqueadores confirmados com evidencia real no repositório e materializar a rastreabilidade pedida pelo backlog indice.

## Itens do relatório atacados
- [x] TD-002
- [x] TD-003
- [x] TD-008
- [x] TD-005 validado com evidência
- [x] TD-001 a TD-008 classificados com status e risco residual

## Rastreabilidade
| Item | Fase | Evidência no código | Status | Risco residual |
| --- | --- | --- | --- | --- |
| TD-001 domínio inexistente | Fase 1 | `packages/database/prisma/schema.prisma` sem `Patient`, `PregnancyRecord`, `Appointment`, `ClinicalNote` e `NeonatalRecord` | aberto | O produto segue sem núcleo materno-infantil persistido |
| TD-002 home do dashboard ausente | Fase 1 / Fase 4 | `apps/web/app/(dashboard)/dashboard/page.tsx`, `apps/web/lib/dashboard.ts`, `apps/web/components/layout/Navbar.tsx` | resolvido | Métricas administrativas ainda dependem de perfil com acesso ao backend de dashboard |
| TD-003 workflow list ausente | Fase 1 / Fase 4 | `apps/web/app/(dashboard)/workflows/page.tsx`, `apps/web/lib/workflows.ts`, `apps/api/src/modules/workflows/router.ts` | resolvido | Criação de workflow ainda depende do editor ou API; não existe wizard de criação |
| TD-004 i18n / PT-BR inexistente | Fase 1 | `apps/web/app/layout.tsx` e formatações `pt-BR`, mas sem infraestrutura real de i18n | aberto | Strings continuam hardcoded e sem alternância de locale |
| TD-005 integração falsa em CI | Fase 1 / Fase 5 | `.github/workflows/ci.yml` com `postgres`, `redis`, `pnpm db:bootstrap:ci` e lane `platform` | resolvido | A qualidade ainda depende de manutenção das seeds e das suítes integradas |
| TD-006 CSP em report-only | Fase 1 / Fase 3 | `apps/web/next.config.mjs`, `packages/config/src/web.config.ts` | mitigado | Produção exige enforcement, mas o frontend ainda usa muito estilo inline para endurecimento total |
| TD-007 legado no repositório | Fase 1 | `apps/legacy/dashboard/*` ainda presente | aberto | Continua existindo superfície paralela que pode gerar ambiguidade arquitetural |
| TD-008 consentimento LGPD sem auditoria | Fase 1 / Fase 3 | `packages/database/src/repositories/engagement.ts`, `apps/web/components/cookie-consent-banner.tsx`, `apps/web/app/(dashboard)/profile/notifications/page.tsx` | resolvido | O consentimento cobre analytics; revogação e taxonomia regulatória mais ampla seguem dependentes da Fase 3 |

## Leitura do estado atual
- O monorepo ja tinha backend real para dashboard, workflows, notificacoes e privacidade, mas faltavam duas entradas canonicas de UI: `/dashboard` e `/workflows`.
- A trilha de consentimento existia com persistencia em `user_preferences`, porem sem auditoria formal.
- O CI ja executa banco e Redis reais em GitHub Actions.
- O dominio materno-infantil continua ausente do banco, da API e da UI.
- O repositório ainda carrega `apps/legacy/dashboard`, entao a limpeza de legado nao pode ser considerada concluida.

## Decisões arquiteturais
- Eleger `/dashboard` como landing canonica para a area autenticada, sem competir com a home publica em `/`.
- Eleger `/workflows` como inventário canonico de fluxos, reaproveitando a API real ja publicada em `/api/v1/workflows`.
- Auditar mudancas de consentimento no repositório de preferencias para garantir cobertura em qualquer chamada futura, nao apenas na rota atual.
- Manter o status geral em `RED`, porque TD-001, TD-004 e TD-007 continuam abertos e TD-006 ainda exige endurecimento adicional.

## Plano executável
- passo 1: criar home do dashboard usando os endpoints administrativos ja existentes
- passo 2: criar workflow list usando a listagem real de workflows
- passo 3: ajustar navegacao e fluxo pos-login para as rotas canonicas
- passo 4: adicionar auditoria de consentimento LGPD
- passo 5: registrar rastreabilidade do ciclo com status e risco residual

## Arquivos impactados
- criar:
  - `apps/web/lib/dashboard.ts`
  - `apps/web/app/(dashboard)/dashboard/page.tsx`
  - `apps/web/app/(dashboard)/dashboard/loading.tsx`
  - `apps/web/app/(dashboard)/workflows/page.tsx`
  - `apps/web/app/(dashboard)/workflows/loading.tsx`
  - `apps/web/tests/dashboard-data.test.ts`
  - `apps/web/tests/workflows-list.test.ts`
  - `docs/execution/CICLO_F0_F1_RASTREABILIDADE_2026-04-07.md`
- alterar:
  - `apps/web/lib/workflows.ts`
  - `apps/web/components/layout/Navbar.tsx`
  - `apps/web/components/login-form.tsx`
  - `packages/database/src/repositories/engagement.ts`
  - `packages/database/test/engagement.test.ts`
- remover:
  - nenhum

## Checklist de implementação
- [ ] migrations
- [ ] rotas de API novas
- [ ] serviços novos
- [x] validações
- [x] UI
- [x] loading/error/empty
- [x] testes
- [x] docs

## Validação
### Local
- [x] validação local concluída

### CI
- [ ] validação em CI concluída

### Staging
- [ ] validação em staging concluída

## Status
- [x] RED
- [ ] BLUE
- [ ] YELLOW
- [ ] GREEN

## Prompt
Você está executando um ciclo arquitetural do plano BirthHub 360.
Ataque apenas os itens listados neste ciclo.
Entregue:
A. Leitura do estado atual
B. Decisões arquiteturais
C. Plano executável do ciclo atual
D. Implementação
E. Validação
F. Status
