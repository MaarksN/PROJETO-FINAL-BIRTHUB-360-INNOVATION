## Resumo

Descreva objetivamente o que mudou, qual risco foi tratado e qual evidência de validação acompanha o PR.

## Justificativa formal

Preencha esta seção somente se o PR ultrapassar 500 linhas alteradas ou concentrar mudanças estruturalmente acopladas. Explique o motivo do lote, o plano de revisão e o rollback.

## Checklist de Qualidade

- [ ] Nome da branch segue a política (`feat/`, `fix/`, `refactor/`, `chore/`, `release/`, `hotfix/`)
- [ ] Commits seguem Conventional Commits ou estão explicitamente allowlistados
- [ ] Naming rules permanecem intactas (`snake_case` em `agents/`, `*.service.ts`, `*.controller.ts`, `*.repository.ts`, `*.types.ts`)
- [ ] ADR ou documentação de arquitetura foi atualizada quando aplicável
- [ ] Fonte de verdade documental foi revisada ou atualizada
- [ ] Dependências externas novas foram registradas em `docs/processes/dependency-approval-register.md`
- [ ] Mudanças de manifesto atualizaram `docs/release/internal-packages-changelog.md`
- [ ] Não foram versionados dumps, `.env` ou artefatos transitórios
- [ ] Se `pnpm-lock.yaml` mudou, houve revisão de security e platform
- [ ] Workspaces alterados mantêm `lint`, `typecheck`, `test` e `build`, ou `N/A` aprovado no relatório F4
- [ ] Impacto de rollback foi documentado

## O que foi atualizado

- [ ] Documentação
- [ ] Backend
- [ ] Frontend
- [ ] Infra / CI
- [ ] Testes

## Validação

```bash
pnpm artifacts:clean
pnpm branch:check
pnpm commits:check
pnpm hygiene:check
pnpm docs:check-links
pnpm monorepo:doctor
```

## Breaking changes

- [ ] Não há breaking changes
- [ ] Há breaking changes descritas abaixo

## Deployment notes

Inclua migrations, variáveis de ambiente, rollout e rollback quando necessário.
