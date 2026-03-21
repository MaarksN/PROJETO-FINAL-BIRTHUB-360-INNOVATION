# Disaster Recovery & Backups Runbook

Este runbook aborda as exigências da Seção S06: Backup, Recuperação e Staging do BirthHub360.

## 1. Backups e Point-In-Time Recovery (PITR)
- **RTO (Recovery Time Objective)**: 1 Hora (máximo tolerado).
- **RPO (Recovery Point Objective)**: 5 Minutos.
- **Implementação**:
  - PostgreSQL Continuous Archiving de WAL via `pgBackRest` ou `WAL-G` para S3/Blob.
  - Snapshot completo diário às 03:00 UTC.

## 2. Testes Regulares de DR
- Semestralmente, a equipe de infraestrutura deve conduzir um "Disaster Recovery Drill" (Drill Semestral)
- Simular um cenário como a corrupção do nó primário, instanciando do zero usando PITR do WAL para a hora exata antes do incidente falso.
- O tempo real de execução deve ser registrado no `validation_log.md` ou documentação equivalente.

## 3. Ambientes de Staging Seguros
- **LGPD/Anonimização**: A atualização de staging baseada em produção deve sempre rodar pipelines de sanitização automática (obscurifying de `email`, `name`, `passwordHash`, chaves, etc.) usando bibliotecas de mask ou PII tools.
- Scripts automatizados devem criar essa cópia toda segunda-feira ou a cada release candidata para viabilizar os testes de load/migration reais.
