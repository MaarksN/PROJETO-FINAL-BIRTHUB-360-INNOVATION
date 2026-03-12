# Risco de Bypass de RLS

- **Superusers/Migrations:** O papel `postgres` e usuários do Prisma/Flyway ignoram RLS por padrão.
- **Mitigação:** A conexão de pooler da API NÃO DEVE usar o superuser. Deve usar um role sem `BYPASSRLS`. Superuser é estritamente limitado às pipelines de CI de migração.
