# Contribuição para o BirthHub360

## Padrões de Workspace
Este monorepo usa `pnpm`. Todos os pacotes internos `@birthub/*` devem ser referenciados usando `workspace:*` nos arquivos `package.json`. Isso previne inconsistências de versão no CI e no registry local.

## Dependências
Sempre adicione novas dependências com `pnpm add <dep> --filter <package>`. Antes de submeter seu Pull Request, execute `pnpm dedupe` para garantir integridade do lockfile e ausência de cópias duplicadas, e faça o commit do `pnpm-lock.yaml`. Requer aprovação de tech lead e validação de licenças no CI.

## Padrão de Naming
Siga estritamente:
- Pacotes, diretórios do front e monorepo geral: `kebab-case`.
- Módulos e diretórios Python backend em `agents/`: `snake_case`.