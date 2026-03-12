# Checklist de Revisão de Migration

Antes de aprovar um PR com migrações:
1. [ ] A migração evita `DROP TABLE` ou `DROP COLUMN` destrutivos?
2. [ ] Se adiciona índices em tabelas grandes, utiliza `CONCURRENTLY` (PostgreSQL)?
3. [ ] A alteração possui tempo de bloqueio (lock) analisado para não derrubar produção?
4. [ ] O nome das tabelas/colunas segue a convenção do projeto?
