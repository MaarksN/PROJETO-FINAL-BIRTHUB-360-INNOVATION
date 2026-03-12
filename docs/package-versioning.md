# Internal Package Versioning Policy

## Contexto

O monorepo do **BirthHub 360** é composto por aplicações finais (Next.js, FastAPI), microserviços (Agentes), e pacotes internos (TypeScript libs e Python utilities) que são compartilhados entre eles, localizados na pasta raiz `packages/`.
O gerenciamento correto do versionamento semântico de pacotes internos é crítico para garantir a confiabilidade na hora do build e do deploy das APIs e UIs.

## Modelos e Regras Definidas

Para nossa arquitetura atual baseada em `pnpm workspaces` (Node/TypeScript) e `Turborepo`, adotaremos a política de **Lockstep Versioning (Versioning em Bloco / Fixo)** para os pacotes TypeScript e agentes do ecossistema.

### Por que Lockstep Versioning?

Em vez de versionarmos o pacote `@birthub/ui` para `1.2.0` e o pacote `@birthub/db` para `3.0.1` de forma independente, todos os pacotes e aplicações terão o mesmo número de versão do projeto principal (ex: `v1.2.0`). Isso tem a grande vantagem de simplicidade e segurança, já que o código de produção sempre usa os pacotes locais do workspace daquele mesmo commit (sempre na mesma versão). Qualquer release para Cloud Run será associada a essa mesma versão global.

### Fluxo de Trabalho (Bumping)

1. **Pnpm Workspaces `workspace:*` Protocol:**
   Nenhum projeto consumindo um pacote local em `package.json` deve fixar a versão com números absolutos ou carets `^`. Eles devem usar `workspace:*`.
   Exemplo no `apps/dashboard/package.json`:

   ```json
   {
     "dependencies": {
       "@birthub/shared-ui": "workspace:*",
       "@birthub/logger": "workspace:*"
     }
   }
   ```

   Isso instrui o `pnpm` a sempre linkar para a última versão presente no monorepo local durante o desenvolvimento, sem tentar puxar do registro NPM remoto. O Turborepo entende esse link.

2. **Semantic Release para Bump de Versões Globais:**
   Como adotamos o [Conventional Commits](./CONTRIBUTING.md), a versão global do projeto será bumpada automaticamente pelo bot de CI/CD (ex: `semantic-release` ou `changesets`) toda vez que houver merge na branch `main`.
   Um commit de "chore(release): vX.Y.Z" será criado.

### Ferramentas Permitidas e Proibidas

- **Permitido:** Alterar as implementações e configurações em `packages/`.
- **Proibido:** Fazer publish manual de pacotes no npm (ex: `npm publish`). Todo pacote dentro de `packages/` é estritamente **privado** (`"private": true` no package.json deles) e só é consumido dentro das aplicações de backend/frontend via pipelines de build que empacotam e "bundlam" essas dependências no artefato final.

## Consequências

Com a dependência resolvida sempre via `workspace:*` (o local), temos total confiança de que as interfaces de banco de dados ou tipos compartilhados (GraphQL, Prisma, Pydantic/FastAPI) consumidos pelo `api-gateway` são exatamente as que estão sendo atualizadas naquele commit e PR. Não corremos o risco de pacotes desatualizados ou dependência-fantasma em deploy.
