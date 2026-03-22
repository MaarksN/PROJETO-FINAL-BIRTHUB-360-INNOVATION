<<<<<<< Updated upstream
# Contribuição para o BirthHub360

## Padrões de Workspace
Este monorepo usa `pnpm`. Todos os pacotes internos `@birthub/*` devem ser referenciados usando `workspace:*` nos arquivos `package.json`. Isso previne inconsistências de versão no CI e no registry local.

## Dependências
Sempre adicione novas dependências com `pnpm add <dep> --filter <package>`. Antes de submeter seu Pull Request, execute `pnpm dedupe` para garantir integridade do lockfile e ausência de cópias duplicadas, e faça o commit do `pnpm-lock.yaml`. Requer aprovação de tech lead e validação de licenças no CI.

## Padrão de Naming
Siga estritamente:
- Pacotes, diretórios do front e monorepo geral: `kebab-case`.
- Módulos e diretórios Python backend em `agents/`: `snake_case`.
=======
# Contributing

Este repositório segue a baseline F9 de higiene estrutural. Toda mudança deve preservar naming, rastreabilidade de documentação e guardrails de CI.

## Branches

Use um dos prefixos abaixo para branches humanas:

- `feat/`
- `fix/`
- `refactor/`
- `chore/`
- `release/`
- `hotfix/`

Branches automatizados `codex/`, `jules/` e `dependabot/` continuam permitidos para integrações e agentes.

## Commits

Use Conventional Commits:

```text
feat(api): add workflow pause endpoint
fix(worker): prevent duplicate queue scheduling
docs(repo): refresh contribution guide
```

Commits fora do padrão só podem existir temporariamente em `.github/commit-message-allowlist.txt`.

## Naming

- Diretórios internos em `agents/` usam `snake_case`.
- Identificadores públicos, filas, slugs e manifests usam `kebab-case`.
- Arquivos TypeScript de camada usam `*.service.ts`, `*.controller.ts`, `*.repository.ts` e `*.types.ts`.
- `agents/pos-venda/main.py` é um shim legado somente leitura. Novas mudanças devem ir para `agents/pos_venda/`.
- Novos ADRs devem ser publicados em `docs/adrs/`.

A regra completa está em [docs/standards/repository-naming.md](docs/standards/repository-naming.md).

## Documentação

Toda mudança relevante deve apontar para uma fonte de verdade canônica e, quando necessário, registrar documentos históricos/superseded em [docs/processes/documentation-source-of-truth.md](docs/processes/documentation-source-of-truth.md).

Use o template padrão em [docs/templates/documentation-template.md](docs/templates/documentation-template.md).

## Dependências e changelog

- Novas dependências externas exigem registro em [docs/processes/dependency-approval-register.md](docs/processes/dependency-approval-register.md).
- Mudanças de manifesto de pacotes internos exigem atualização em [docs/release/internal-packages-changelog.md](docs/release/internal-packages-changelog.md).
- Dependências internas devem usar `workspace:*`.

## Artifacts

- `artifacts/` guarda apenas evidências auditáveis e saídas formais de release/compliance.
- Logs de runtime, dumps, `.env`, temporários e saídas locais não devem ser versionados.
- Limpeza automatizada roda via `pnpm artifacts:clean`.

Política completa: [artifacts/README.md](artifacts/README.md).

## Checklist mínimo local

```bash
pnpm artifacts:clean
pnpm branch:check
pnpm commits:check
pnpm hygiene:check
pnpm docs:check-links
pnpm monorepo:doctor
```
>>>>>>> Stashed changes
