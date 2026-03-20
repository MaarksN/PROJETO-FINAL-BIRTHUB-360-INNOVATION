<!-- [SOURCE] Consolidação automática de status item a item -->
# Relatório Item a Item — Checklist Universal

**Data:** 2026-03-20
**Escopo:** Parte 1 (31 itens de remediação) + Parte 2 (conformidade estrutural F1–F5 dos ciclos)

## Resumo Executivo
- **Concluído:** 24
- **Parcial:** 4
- **Bloqueado:** 3

> Critério de status:
> - **Concluído**: há evidência técnica de aceite no `audit/pending_review` e/ou verificação atual do código.
> - **Parcial**: há entrega/evidência parcial, mas depende de ambiente externo, decisão humana, ou falta validação fim-a-fim.
> - **Bloqueado**: pendência técnica relevante sem fechamento no estado atual.

## Parte 1 — Remediação Forense (31 itens)

| ID | Status | Evidência principal | Próximo passo |
|---|---|---|---|
| CD-001 | Parcial | `audit/pending_review/CD-001_codex.md` + `audit/human_required/cd_env_config.md` | Validar secrets/vars no environment `staging` e reexecutar CD no GitHub Actions |
| CI-MAP-001 | Concluído | `audit/pending_review/CI-MAP-001_codex.md` | Manter atualização contínua do mapa CI |
| CI-TS-001 | Bloqueado | `audit/UNDECLARED_OBSERVATIONS.md` (queue com `exactOptionalPropertyTypes` pendente) | Abrir entrega dedicada com correção de tipagem no pacote `queue` |
| CI-TS-002 | Parcial | Sem artefato codex dedicado; sem comprovação fim-a-fim atual | Executar validação específica de module resolution em `@birthub/db` e registrar evidência |
| CI-TS-003 | Bloqueado | `audit/UNDECLARED_OBSERVATIONS.md` (falha estrutural no `llm-client`) | Ajustar exports/barrel e revalidar build/typecheck |
| CI-TS-004 | Concluído | `audit/pending_review/CI-TS-004_codex.md` + observação resolvida em `audit/UNDECLARED_OBSERVATIONS.md` | Monitorar regressão no próximo ciclo |
| S-001 | Concluído | `audit/pending_review/S-001_codex.md` | Manter teste de não-elevação no pipeline |
| S-002 | Concluído | `audit/pending_review/S-002_codex.md` | Manter varredura periódica anti-`eval` |
| S-003 | Concluído | `audit/pending_review/S-003_codex.md` | Aguardar decisão humana registrada em `audit/human_required/vindi_job_decision.md` (não bloqueante do ciclo atual) |
| GAP-SEC-001 | Concluído | `audit/pending_review/GAP-SEC-001_codex.md` | Preservar teste de entropia/tamanho de sessão |
| GAP-SEC-002 | Concluído | `audit/pending_review/GAP-SEC-002_codex.md` | Expandir cobertura RBAC por rota conforme evolução do MVP |
| GAP-SEC-003 | Concluído | `audit/pending_review/GAP-SEC-003_codex.md` | Manter teste de não reuso de MFA |
| GAP-SEC-004 | Bloqueado | `audit/pending_review/GAP-SEC-004_codex.md` | Executar backlog de `audit/pending_review/GAP-SEC-004_itens.md` com testes por item |
| GAP-SEC-005 | Concluído | `audit/pending_review/GAP-SEC-005_codex.md` + SSRF em `packages/agents-core/src/policy/engine.ts` | Manter suíte SSRF no CI |
| GAP-001 | Concluído | `audit/pending_review/GAP-001_codex.md` | Reexecutar regressão ampla do dashboard quando baseline TS estiver estável |
| GAP-002 | Concluído | `audit/pending_review/GAP-002_codex.md` | Reexecutar regressão ampla do dashboard quando baseline TS estiver estável |
| GAP-DASH-003 | Concluído | `audit/pending_review/GAP-DASH-003_codex.md` | Rodar E2E completo de paridade em janela de release |
| GAP-003 | Concluído | `audit/pending_review/GAP-003_codex.md` | Estender padrão estrito para novos agentes sistêmicos |
| GAP-004 | Concluído | `audit/pending_review/GAP-004_codex.md` + validação atual 43/43 manifests com `required_tools` | Manter validação de schema no parser |
| GAP-005 | Concluído | `audit/pending_review/GAP-005_codex.md` + scan atual `INLINE_CREDENTIAL_FINDINGS=0` | Agendar varredura periódica automatizada |
| M-001 | Concluído | `audit/pending_review/M-001_codex.md` | Garantir reutilização do runtime compartilhado |
| M-002 | Concluído | `audit/pending_review/M-002_codex.md` + validação atual 43/43 manifests com `fallback_behavior` | Validar novos packs no mesmo contrato |
| M-003 | Parcial | `audit/pending_review/M-003_codex.md` + `audit/human_required/M003_bkb_integration.md` | Definir componente oficial de injeção BKB runtime + teste de integração |
| D-001 | Concluído | `audit/pending_review/D-001_codex.md` | Manter revisão de tom em novos prompts |
| D-002 | Concluído | `audit/pending_review/D-002_codex.md` | Manter guardrail anti-alucinação em prompts novos |
| GOV-001 | Concluído | `audit/pending_review/GOV-001_codex.md` | Continuar atualização do log em cada validação |
| GOV-002 | Concluído | `audit/pending_review/GOV-002_codex.md` | Manter 1 artefato por item em `pending_review` |
| GOV-003 | Parcial | `audit/pending_review/GOV-003_codex.md` + bloqueios em `audit/human_required/GOV-003_open_blockers.md` | Encerrar bloqueios humanos ativos (CD-001, GAP-SEC-004, M-003) |
| GOV-004 | Concluído | `audit/pending_review/GOV-004_codex.md` | Manter tabela padronizada no arquivo de observações |
| GOV-005 | Concluído | `audit/pending_review/GOV-005_codex.md` | Manter auditoria de `[SOURCE]` por ciclo |
| GOV-006 | Concluído | `audit/pending_review/GOV-006_codex.md` + `packages/agents/REGISTRY.md` | Atualizar registry a cada aprovação F5 |

## Parte 2 — Agentes (Ciclos 1–15)

- **Status estrutural F1–F5:** **Concluído**
- Evidência: `.github/agents/RELATORIO_CONFORMIDADE_F1_F5.md`
- Resultado: **331/331 arquivos `.agent.md` conformes** e **0 não conformidades**.

### Observação de consistência de base
- O checklist HTML cita 332 agentes, mas a validação automatizada oficial contabiliza 331 arquivos `.agent.md` no escopo de ciclos.
- Recomendação: reconciliar inventário para evitar divergência de KPI no dashboard.

## Prioridade de fechamento (ordem sugerida)
1. **CD-001** (infra externa de staging/CD)
2. **GAP-SEC-004** (execução do backlog de sessão com testes)
3. **M-003** (injeção BKB em runtime com evidência técnica)
4. **CI-TS-001** (tipagem estrita no queue)
5. **CI-TS-003** (exports/build do llm-client)
6. **CI-TS-002** (prova fim-a-fim em @birthub/db)
