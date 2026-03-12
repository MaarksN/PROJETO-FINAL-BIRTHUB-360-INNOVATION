# Runbook: Investigação de Query Lenta

Se disparar o alerta de P95 > SLA:
1. Ir ao painel de APM e isolar o Trace ID.
2. Extrair a query do log lento (`pg_stat_statements`).
3. Obter o plano localmente usando `EXPLAIN ANALYZE`.
4. Identificar falta de índice, estatísticas do PG defasadas (necessidade de `VACUUM ANALYZE`), ou problema N+1.
5. Desenvolver e testar migration de índice; aplicar via hotfix se for bloqueante.
