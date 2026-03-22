## Resumo

Descreva objetivamente o que mudou, qual risco foi tratado e qual evidência de validação acompanha o PR.

## Justificativa formal

Preencha esta seção somente se o PR ultrapassar 500 linhas alteradas ou concentrar mudanças estruturalmente acopladas. Explique o motivo do lote, o plano de revisão e o rollback.

## Checklist de Qualidade de Pull Request

- [ ] ADR ou documentação de arquitetura associada atualizada (se aplicável).
- [ ] Testes unitários/E2E escritos e passando.
- [ ] Limites de complexidade e tamanho de arquivo respeitados.
- [ ] Dependências validadas e pacotes monorepo usando `workspace:*`.
- [ ] Sem exports ou imports mortos.
- [ ] Naming conventions respeitadas (kebab-case no front, snake_case no backend).
- [ ] Segurança aprovada e sem credenciais inline expostas.
- [ ] Se `pnpm-lock.yaml` mudou, houve revisão de security e platform.
- [ ] Workspaces alterados mantem `lint`, `typecheck`, `test` e `build`, ou `N/A` aprovado no relatorio F4.
