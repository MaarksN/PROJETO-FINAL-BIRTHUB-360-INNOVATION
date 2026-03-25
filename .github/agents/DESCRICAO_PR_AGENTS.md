# PR Description (copy-paste)

## What
Este PR consolida a governança do catálogo de agentes e formaliza a validação automática de conformidade F1–F5.

- Padronização do catálogo de agentes por ciclos (`cycle-01` a `cycle-15`).
- Upgrade global de inteligência dos agentes com comportamento mais autônomo e interativo.
- Habilitação de colaboração entre agentes via `agent` tool e whitelist de subagentes.
- Definição de política de naming/slug para arquivos de agentes.
- Implementação de validador automático F1–F5.
- Inclusão de workflow de CI para prevenir regressões de conformidade.
- Geração de relatório consolidado de conformidade.

## Why
Precisamos garantir consistência estrutural e auditabilidade contínua dos agentes, evitando deriva de padrão e regressões em mudanças futuras.

## How
- Upgrade em massa dos agentes:
  - `.github/agents/scripts/upgrade_agents_intelligence.ps1`
  - Inclusão de `tools: [read, search, agent]` (ou preservando ferramentas existentes + `agent`)
  - Inclusão de `agents: [planner, implementer, reviewer]`
  - Inclusão de blocos: `Autonomia e Proatividade`, `Colaboração entre Agentes`, `Interatividade`
- Política de slug/documentação:
  - `.github/agents/SLUG_POLICY.md`
- Validador de conformidade:
  - `.github/agents/scripts/validate_f1_f5.ps1`
- Workflow de CI:
  - `.github/workflows/agents-conformity.yml`
- Relatórios de auditoria:
  - `.github/agents/RELATORIO_CONFORMIDADE_F1_F5.md`
  - `.github/agents/RELATORIO_CONFORMIDADE_F1_F5.json`

## Validation
Executado validador F1–F5 no repositório completo de agentes:

- Escopo: `cycle-01` até `cycle-15`
- Total analisado: 331 arquivos `.agent.md`
- Resultado por severidade:
  - Critical: 0
  - High: 0
  - Medium: 0
  - Low: 0
- Resultado por fase:
  - F1: 100%
  - F2: 100%
  - F3: 100%
  - F4: 100%
  - F5: 100%

## Risk
Baixo a moderado.

- Mudanças focadas em governança/validação e padronização de estrutura/comportamento dos agentes.
- Sem alteração funcional de runtime da aplicação principal.

## Rollback
- Reverter este PR integralmente.
- Se necessário, desabilitar temporariamente o workflow `.github/workflows/agents-conformity.yml` até ajuste fino.

## Checklist
- [ ] Workflow de conformidade executou com sucesso no PR
- [ ] Artifact do relatório foi anexado
- [ ] Revisão técnica aprovada
- [ ] Escopo limitado a governança de agentes/CI

## Suggested commit title
`feat(agents): upgrade global de inteligência e colaboração com F1-F5 no CI`
