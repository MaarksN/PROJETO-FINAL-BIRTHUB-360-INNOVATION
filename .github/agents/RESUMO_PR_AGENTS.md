# Resumo de PR — Governança de Agentes

## Título sugerido
Padroniza catálogo de agentes (ciclos 01–15) e automatiza conformidade F1–F5

## Resumo executivo
- Estrutura de agentes consolidada em 15 ciclos.
- Política de slug formalizada.
- Validação automática F1–F5 implementada e integrada ao CI.
- Estado atual de conformidade: 0 não conformidades.

## Escopo técnico
- Catálogo de agentes por ciclo: `.github/agents/cycle-01` até `.github/agents/cycle-15`.
- Política de nomeação: `.github/agents/SLUG_POLICY.md`.
- Validador automático: `.github/agents/scripts/validate_f1_f5.ps1`.
- Workflow de prevenção em CI: `.github/workflows/agents-conformity.yml`.
- Relatórios de conformidade:
  - `.github/agents/RELATORIO_CONFORMIDADE_F1_F5.md`
  - `.github/agents/RELATORIO_CONFORMIDADE_F1_F5.json`

## Resultado da auditoria
- Total analisado: 331 arquivos `.agent.md`.
- Severidade: Critical 0, High 0, Medium 0, Low 0.
- Fases: F1 100%, F2 100%, F3 100%, F4 100%, F5 100%.

## Impacto
- Reforça governança e padronização do catálogo.
- Reduz risco de regressão com bloqueio automático no CI.
- Facilita auditoria e manutenção contínua dos agentes.

## Checklist de merge
- [ ] Workflow de conformidade executado com sucesso no PR.
- [ ] Relatórios anexados como artifact do workflow.
- [ ] Sem mudanças fora do escopo `.github/agents` e `.github/workflows/agents-conformity.yml`.
- [ ] Aprovação de revisão técnica.

## Mensagem de commit sugerida
chore(agents): padroniza ciclos 01-15 e ativa validação automática F1-F5
