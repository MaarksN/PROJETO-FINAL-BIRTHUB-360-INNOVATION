# Análise de Risco de Migration em Produção

## Riscos e Mitigações
- **Locks Prolongados:** Operações que alteram o tipo de coluna em tabelas muito grandes podem bloquear a tabela (Exclusive Lock). Mitigação: Criar nova coluna, copiar dados, e renomear posteriormente.
- **Timeouts:** Migrações que demoram mais que o timeout da aplicação/CI falham pela metade. Mitigação: Quebrar a migração em lotes assíncronos (background migrations) para tabelas massivas.
