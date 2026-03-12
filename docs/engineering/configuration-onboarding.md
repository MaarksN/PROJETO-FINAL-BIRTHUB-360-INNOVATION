# Onboarding de Configuração Local

Para configurar o ambiente local:
1. Copie o arquivo `.env.example` para `.env` na raiz do monorepo.
2. Solicite acesso ao vault de desenvolvimento (ex: Bitwarden, AWS Secrets em conta de Dev) ao administrador.
3. Preencha as chaves ausentes no `.env`.
4. Execute `pnpm install` e `pnpm dev`.
