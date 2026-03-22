# Continuity Validation Plan

Este documento transforma os itens de continuidade operacional em um protocolo repetivel. O objetivo e permitir que qualquer owner tecnico execute e registre a validacao sem depender de memoria tacita.

## Validation scenarios

| Cenario | Entrada | Evidencia esperada | Status |
| --- | --- | --- | --- |
| Operar sistema usando apenas docs | `README.md`, `docs/f10/README.md`, runbooks | checklist preenchido e gaps reportados | Operationalized |
| Fazer deploy usando apenas runbook | `docs/runbooks/deploy-canonical-stack.md` | validacao em staging e log do workflow | Operationalized |
| Responder a incidente P1 com runbook | `docs/runbooks/p1-alert-response-matrix.md` | simulacao ou game day com tempo de resposta | Operationalized |
| Revisao por leitor novo | pacote F10 completo | comentarios registrados via issue | Operationalized |
| Link checker automatizado | `pnpm docs:links` | `artifacts/documentation/link-check-report.md` | Implemented |
| Feedback de engenharia | issue template `documentation-gap` | backlog priorizado e resposta do owner | Implemented |
| Confirmacao de ADR index | `docs/adrs/INDEX.md` | checklist F10 atualizado | Implemented |
| Sign-off dos owners | tabela abaixo | aprovacao assinada por dominio | Operationalized |

## Dry-run checklist

1. Clonar o repositorio.
2. Executar `pnpm install`.
3. Rodar `pnpm docs:verify`.
4. Seguir o onboarding tecnico ate o primeiro PR.
5. Executar um deploy em staging a partir do runbook.
6. Simular um alerta P1 e navegar pelos runbooks.
7. Registrar gaps usando o template de issue apropriado.

## Automated validation

```bash
pnpm docs:links
pnpm docs:dependency-graph
pnpm docs:health
```

O workflow de CI executa o mesmo conjunto via `pnpm docs:verify` e publica o dashboard tecnico como artefato da pipeline.

## Feedback collection

- Falha de navegacao, termo obscuro ou link quebrado: usar `.github/ISSUE_TEMPLATE/documentation-gap.yml`.
- Debt ou processo que precisa owner e prazo: usar `.github/ISSUE_TEMPLATE/tech-debt.yml`.
- Bug encontrado durante onboarding ou incidente: usar `.github/ISSUE_TEMPLATE/bug-report.yml`.

## ADR completeness review

- Index principal: `docs/adrs/INDEX.md`
- Anexo de decisoes complementares: `docs/architecture/decisions`
- Criterio de aceite: toda decisao estrutural citada em runbook, release ou processo precisa apontar para ADR ou RFC publicada.

## Sign-off register

| Dominio | Owner | Evidencia | Status |
| --- | --- | --- | --- |
| API core | API Core lead | validacao do onboarding e dos runbooks de deploy/rollback | Pending |
| Worker/runtime | Platform Runtime lead | simulacao de fila, DLQ e alertas P1 | Pending |
| Billing | Billing owner | revisao do fluxo Stripe e disaster recovery | Pending |
| Security/compliance | Security owner | revisao de incidente, breach e audit trail | Pending |
| Developer experience | DX owner | link checker, templates e debt dashboard | Pending |
