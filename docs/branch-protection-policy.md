# Branch Protection Policy

No repositório do **BirthHub 360**, adotamos políticas de proteção na branch principal (`main` ou `master`) para salvaguardar a operação dos 8 agentes de RevOps em produção. Configurações de repositório (ex: GitHub ou GitLab) devem forçar ativamente as seguintes regras.

## Aprovação de Pull Requests (PRs)

1. **Aprovação Obrigatória por Pares (Reviewers):**
   - É necessário pelo menos **1 (uma) aprovação** de review no PR antes do merge.
   - O autor do PR _não_ pode auto-aprovar (auto-merge é restrito e desabilitado por padrão).
   - "Stale reviews" devem ser descartadas (Dismiss stale pull request approvals) sempre que novos commits forem enviados para o PR; um novo review será exigido sobre o código corrigido.

2. **CODEOWNERS:**
   - Para partes críticas do sistema (ex: `apps/api-gateway/`, `contracts/`, arquivos `.github/workflows/`), usamos o arquivo `CODEOWNERS` na raiz do repositório para adicionar compulsoriamente membros sêniors e/ou líderes técnicos específicos no PR.
   - O merge na branch não ocorrerá sem o `Approve` do usuário listado no grupo correspondente do `CODEOWNERS`.

## Status Checks (Integração Contínua - CI)

- **Testes Obrigatórios:** A branch principal requer que os "Status Checks" terminem com sucesso (`Success`) antes de permitir o merge.
- **Gates do ADR-002:** O CI/CD implementa todos os validadores documentados no [ADR-002: Merge Gates](./adr/002-merge-gates.md).
- Isso inclui: compilação (tsc), eslint/ruff linting (zero-warnings), cobertura e execução de suites `test:agents` e `test:e2e`. Se qualquer um destes sub-processos falhar, a branch-protection impede o merge.
- **Manter PR atualizado com `main`:** É obrigatório configurar a proteção para exigir que a branch do pull request esteja sincronizada com a última versão da branch principal antes do merge (`Require branches to be up to date before merging`).

## Resolução de Conflitos e Force Pushes

- O histórico da branch principal (`main`) é estritamente **Linear**. (Commits Rebase and Merge ou Squash and Merge).
- **Proibido Force Push (`git push -f`)** na branch protegida `main`. Qualquer ajuste no histórico que foi para produção requer um novo PR (`revert`, `fix`).
- **Proibido Deletion:** Não é permitido apagar a branch protegida `main`.
