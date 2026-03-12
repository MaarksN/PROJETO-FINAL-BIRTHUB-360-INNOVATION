# Plano de Rollback de Migração (RTO 15 min)

As ferramentas Flyway/Prisma devem ser revertidas se falharem no deploy (ex: travamento e queda de banco transacional).
- RTO < 15 Minutos exige reversão na aplicação do Code e do DB.
- Os scripts de migration terão sempre as contrapartes `down` explícitas prontas para remover alterações. Alternativamente, o Point-in-Time Recovery (PITR) do RDS AWS será disparado na exata hora da tentativa da migração malsucedida se o esquema for impossível de reverter logicamente de forma veloz e segura.
