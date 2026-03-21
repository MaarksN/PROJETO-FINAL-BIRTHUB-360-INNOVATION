# Database Performance & Integrity Runbook

Este runbook define as políticas para monitoramento e ajuste de performance do banco de dados (S05).

## 1. Monitoramento de Queries Lentas
- Relatórios de `EXPLAIN ANALYZE` devem ser coletados regularmente.
- Focar nas 20 queries de maior impacto ("Top 20 Slowest Queries").
- Todo PR envolvendo read intensivo (como painéis LDR/Dashboard) deve conter uma estimativa do custo.

## 2. Configurações de Connection Pooling e Timeouts
- **PgBouncer**: Recomenda-se o uso do PgBouncer em modo `transaction` em frente à conexão Prisma para aliviar o max_connections.
- **Timeouts**:
  - `statement_timeout` para transações OLTP deve ser menor ou igual a `1000ms` (1 segundo).
  - Queries de relatórios analíticos: Máximo de `30s`. (Configurados por role/usuário específico ou na string de conexão).

## 3. Manutenção Contínua
- **Autovacuum**: Para tabelas de alta rotatividade (ex: `webhook_deliveries`, `audit_logs`, `agent_events`), o threshold do autovacuum deve ser mais agressivo para evitar bloat (`autovacuum_vacuum_scale_factor = 0.05`).
- **Particionamento**: Quando aplicável, habilitar o particionamento de logs por data/mês no PostgreSQL (ex: tabela pai `audit_logs` particionada).
- **Índices Não Utilizados**: Auditorias mensais devem rodar `pg_stat_user_indexes` para achar índices com scan = 0. O overhead de escrita não compensa o read nulo.
- **Integridade Referencial**: Ferramentas semanais devem rodar para alertar sobre `FOREIGN KEYs` que carecem de índices no lado referenciado (Evitando _FK penalties_ no delete).
