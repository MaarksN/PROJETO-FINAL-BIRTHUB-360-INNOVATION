## Resumo

Descreva objetivamente o que mudou, qual risco foi tratado e qual evidência de validação acompanha o PR.

## Justificativa formal

Preencha esta seção somente se o PR ultrapassar 500 linhas alteradas ou concentrar mudanças estruturalmente acopladas. Explique o motivo do lote, o plano de revisão e o rollback.

## Linked issue(s)

- Closes #

## What was updated

- [ ] Documentation
- [ ] Backend (API / services)
- [ ] Frontend (dashboard / UI)
- [ ] Infra / CI
- [ ] Tests

## Checklist de Qualidade de Pull Request

- [ ] ADR ou documentação de arquitetura associada atualizada (se aplicável).
- [ ] Assegurou que o CI passa (pnpm test, pnpm lint, types).
- [ ] Código novo ou refatorado conta com cobertura de testes condizente.
- [ ] Se houve mudança de banco, as migrações Prisma estão versionadas corretamente.
- [ ] O `.env.example` foi atualizado para cobrir eventuais novas variáveis.

## Evidência de testes

Insira um output local de pnpm test demonstrando a estabilidade da bateria:

```text
Insira o log truncado de sucesso...
```
