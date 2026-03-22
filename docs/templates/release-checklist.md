# Release Checklist

## Before deployment

- [ ] PR aprovado e sem findings bloqueantes
- [ ] `pnpm monorepo:doctor`
- [ ] `pnpm docs:verify`
- [ ] `pnpm release:scorecard`
- [ ] Migrations revisadas e plano de rollback descrito
- [ ] Variaveis e segredos validados para o alvo

## Deployment

- [ ] Follow `docs/runbooks/deploy-canonical-stack.md`
- [ ] Comunicar inicio da janela de release
- [ ] Validar preflight do ambiente
- [ ] Executar smoke checks pos-deploy
