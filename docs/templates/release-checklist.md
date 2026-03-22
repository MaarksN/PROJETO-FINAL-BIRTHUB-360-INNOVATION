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

## After deployment

- [ ] Verificar health endpoints e SLIs
- [ ] Confirmar logs, traces e alertas estaveis
- [ ] Registrar evidencias no changelog tecnico
- [ ] Se necessario, seguir `docs/runbooks/rollback-canonical-stack.md`
