# SLA de CI

- **Tempo Máximo Aceitável:** 10 minutos para PRs.
- **Plano de Mitigação:** Se o pipeline ultrapassar 10 minutos, devemos investir em:
  1. Melhor cacheamento do Turborepo/Docker.
  2. Divisão de testes em matriz (sharding).
  3. Remoção de dependências pesadas no ambiente de CI.
