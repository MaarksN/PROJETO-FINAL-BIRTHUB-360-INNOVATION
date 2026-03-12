# Análise de Planos de Execução (Queries Críticas)

- Queries de paginação (`SELECT ... LIMIT x OFFSET y`) devem garantir índices adequados para `ORDER BY`. Se `OFFSET` crescer muito, migrar para `Cursor-Based`.
- O banco rodará periodicamente `EXPLAIN ANALYZE` automático capturado no Datadog para endpoints core. Falhas de "Seq Scan" em tabelas massivas (>100k rows) violam esta policy e disparam alertas.
