# Painel BI — Guia de Implementação

## Objetivo
Monitorar cobertura de agentes por vertical/ciclo e conformidade F1–F5 em um único painel executivo.

## Fontes de dados
- .github/agents/MATRIZ_AGENTE_VERTICAL.csv
- .github/agents/bi/bi_agentes_por_vertical.csv
- .github/agents/bi/bi_agentes_por_ciclo.csv
- .github/agents/bi/bi_kpi_por_vertical.csv
- .github/agents/bi/bi_prioridade_recomendada.csv
- .github/agents/bi/bi_conformidade_severidade.csv
- .github/agents/bi/bi_conformidade_fases.csv

## Layout sugerido do dashboard
1. Cards KPI:
   - Total de agentes
   - Total de não conformidades
   - Vertical dominante
   - Ciclo dominante
2. Barras (horizontal): Agentes por vertical
3. Colunas: Agentes por ciclo
4. Tabela: KPI principal por vertical
5. Donut: Distribuição por prioridade recomendada
6. Barras empilhadas: Pass/Fail por fase F1–F5
7. Tabela de conformidade por severidade

## Métricas calculadas recomendadas
- % participação por vertical = Agents / TotalAgents
- % participação por ciclo = Agents / TotalAgents
- Taxa de conformidade por fase = Pass / (Pass + Fail)
- Índice global de conformidade = 1 - (TotalIssues / TotalAnalyzed)

## Filtros sugeridos
- Vertical
- Ciclo
- Prioridade recomendada
- Fase de conformidade
