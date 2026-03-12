# ADR-005: Estratégia de Migrations

## Status
Aceito

## Decisão
As migrações de banco de dados devem ser aditivas (forward-only) sempre que possível para suportar zero-downtime deploys. O processo utiliza ferramentas como Prisma ou Flyway.

## Justificativa
Deploys sem downtime requerem que a versão N e N+1 da aplicação funcionem com o mesmo esquema de banco. Alterações destrutivas exigem múltiplos deploys (ex: adicionar coluna nova -> gravar dupla -> ler da nova -> remover velha).
