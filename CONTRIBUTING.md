# Guia de Contribuição - BirthHub 360

Bem-vindo(a) ao repositório BirthHub 360! Agradecemos o interesse em contribuir.
Para manter a consistência e qualidade do nosso ecossistema RevOps (TypeScript + Python), estabelecemos as diretrizes a seguir.

## Branches e Pull Requests

1. **Naming Conventions de Branch**: `tipo/escopo-descricao`. Ex: `feat/marketing-agent-integration`, `fix/api-gateway-cors`.
2. **Revisões (PRs)**: Todo código que afete produção deve ser revisado por pelo menos 1 membro da equipe antes de ser aprovado.
3. **Pequenas Mudanças**: Faça commits frequentes, mas evite PRs com muitas mudanças desconexas. Se possível, mantenha os PRs pequenos e focados.
4. **Pipeline**: O CI (GitHub Actions) deve rodar e passar verde em todos os commits. (Linter, Testes Unitários, Integração e Build).

## Padrão de Commits (Conventional Commits)

Nós adotamos a especificação [Conventional Commits](https://www.conventionalcommits.org/). Isso facilita o rastreamento, a automação de changelogs e a determinação do versionamento semântico (SemVer).

O formato básico do commit deve ser:

```
<tipo>[escopo opcional]: <descrição>

[corpo opcional do commit]

[rodapé opcional (ex: Referência à issue)]
```

### Tipos de Commit Permitidos

- `feat`: Nova funcionalidade adicionada ao código.
- `fix`: Correção de um bug ou comportamento incorreto.
- `docs`: Mudanças exclusivas em documentação (README, docstrings, etc).
- `style`: Mudanças de formatação ou estilo de código (espaços, ponto-e-vírgula, indentação) sem alterar a lógica.
- `refactor`: Mudanças no código que não adicionam funcionalidade e não corrigem bugs (ex: limpeza, renomeação de variáveis).
- `perf`: Mudanças voltadas para a melhora de performance.
- `test`: Adição de testes faltantes ou correção em testes existentes.
- `build`: Mudanças que afetam o sistema de build, dependências ou gerenciador de pacotes (ex: pnpm, poetry, docker).
- `ci`: Mudanças na configuração ou nos scripts de integração contínua (ex: GitHub Actions, Travis).
- `chore`: Atualizações de tarefas de manutenção, pacotes que não modificam arquivos de src ou de testes.
- `revert`: Reversão de um commit anterior.

### Exemplo de Commit

```
feat(ae-agent): adiciona suporte para negociação via whatsapp API

Implementa a função de negociação com leads utilizando a API oficial do WhatsApp Business.

Closes #123
```

## Testes e Cobertura

Sempre adicione testes para novas funcionalidades. Se você está resolvendo um bug, adicione um teste que quebre sem o seu fix para evitar regressões futuras. Nosso CI exige um mínimo de **80% de cobertura de código** nos agentes críticos.

1. **Node.js**: Use `pnpm test` (Playwright / Jest)
2. **Python**: Use `pnpm test:agents` e `pnpm test:coverage` (Pytest)

Obrigado por contribuir e manter nosso código limpo!
