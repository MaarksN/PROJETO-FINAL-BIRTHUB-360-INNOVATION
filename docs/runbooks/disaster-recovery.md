# Disaster Recovery

## Escopo

Recuperação de desastre do core canônico com base em backup/restore e failover documentado.

## Referências

- `docs/runbooks/db-backup-restore.md`
- `docs/database/migration-rollback-plan.md`
- `scripts/ops/check-backup-health.ts`
- `scripts/ops/record-disaster-recovery-drill.ts`
- `scripts/ops/generate-disaster-recovery-report.ts`
- `artifacts/dr/readiness-report.json`
- `docs/evidence/disaster-recovery-report.md`

## Procedimento

1. Declarar incidente P0.
2. Congelar mudanças e tráfego mutável.
3. Validar backup íntegro mais recente.
4. Executar restore ou failover conforme o cenário aprovado.
5. Revalidar aplicação, banco, filas e observabilidade.
6. Registrar drill ou incidente com timestamp e owner.

## Materialização recomendada

Antes de declarar o rehearsal como concluído:

```bash
pnpm ops:backup:health
pnpm release:rollback:evidence -- --evidence=<ticket-ou-artifact>
pnpm ops:dr:record -- --environment=staging --scenario="backup restore rehearsal" --owner=platform-ops --backup-artifact=artifacts/backups/backup-health.json --rollback-evidence=artifacts/release/production-rollback-evidence.json --validation-artifact=artifacts/release/smoke-summary.json --started-at=<ISO> --restored-at=<ISO> --target-point=<ISO> --recovered-point=<ISO>
pnpm ops:dr:report
```
