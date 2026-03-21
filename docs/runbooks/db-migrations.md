# Database Migrations Runbook

Este runbook documenta os procedimentos obrigatórios para planejamento, execução e rollback de migrations no banco de dados do BirthHub360, visando Zero Downtime.

## 1. Padrões de Migration (Zero Downtime)
- **Expand-Contract Pattern**: Para alterar colunas usadas (ex: renomear), utilize 3 passos:
  1. Expand (adicionar nova coluna, sync data)
  2. Migrate (app usa nova coluna)
  3. Contract (remover coluna antiga)
- **Atomic Commits**: Migrations devem usar transações sempre que possível para rollback automático em caso de falha parcial.
- **Batching**: Para tabelas grandes (>1M linhas), migrations de dados devem usar chunks (ex: iterar sobre ranges de PKs) para evitar locks prolongados.

## 2. Processo de Aprovação e Lock
- O fluxo exige a revisão formal de um DBA ou Lead de Banco de Dados (`reviewed-by-dba` required on PRs que tocam em `prisma/schema.prisma`).
- Durante o deploy, um mecanismo de lock distribuído (via Prisma/Tabelas próprias) deve garantir que apenas um worker aplique migrations por vez, evitando concorrência destrutiva.

## 3. Ambientes e SLA
- Toda migration deve ser testada primariamente no ambiente de `staging` usando dados representativos (>10% do volume de prod, anonimizados).
- **SLA**: Migrations que potencialmente causam tablescan em prod devem ser agendadas para a janela de manutenção oficial (Domingos de 02:00 às 04:00 BRT).
- Ferramentas de drift detect devem rodar no CI para comparar o schema atual de produção com o `prisma/schema.prisma` mais recente, alertando preventivamente.

## 4. Rollback Plan
- Todo PR que contém migrações destrutivas deve documentar explicitamente o rollback.
- Deve-se testar ativamente o rollback em staging (`prisma migrate resolve --rolled-back ...`) antes da aplicação em produção.
