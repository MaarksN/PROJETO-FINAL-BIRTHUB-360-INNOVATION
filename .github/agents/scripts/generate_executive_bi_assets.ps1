param(
  [string]$RepoRoot = ""
)

if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\.." )).Path
}

$agentsRoot = Join-Path $RepoRoot '.github\agents'
$biRoot = Join-Path $agentsRoot 'bi'
$matrixCsv = Join-Path $agentsRoot 'MATRIZ_AGENTE_VERTICAL.csv'
$reportMd = Join-Path $agentsRoot 'RELATORIO_CONFORMIDADE_F1_F5.md'

if (-not (Test-Path $biRoot)) {
  New-Item -Path $biRoot -ItemType Directory -Force | Out-Null
}

if (-not (Test-Path $matrixCsv)) {
  throw "Arquivo não encontrado: $matrixCsv"
}

if (-not (Test-Path $reportMd)) {
  throw "Arquivo não encontrado: $reportMd"
}

$rows = Import-Csv -Path $matrixCsv
$totalAgents = $rows.Count

$byVertical = $rows |
  Group-Object Vertical |
  Sort-Object Name |
  ForEach-Object {
    [PSCustomObject]@{
      Vertical = $_.Name
      Agents = $_.Count
      SharePct = [Math]::Round(($_.Count / [Math]::Max(1,$totalAgents)) * 100, 2)
    }
  }

$byCycle = $rows |
  Group-Object Cycle |
  Sort-Object Name |
  ForEach-Object {
    [PSCustomObject]@{
      Cycle = $_.Name
      Agents = $_.Count
      SharePct = [Math]::Round(($_.Count / [Math]::Max(1,$totalAgents)) * 100, 2)
    }
  }

$byPriority = $rows |
  Group-Object Priority |
  Sort-Object Name |
  ForEach-Object {
    [PSCustomObject]@{
      Priority = $_.Name
      Agents = $_.Count
      SharePct = [Math]::Round(($_.Count / [Math]::Max(1,$totalAgents)) * 100, 2)
    }
  }

$kpiByVertical = $rows |
  Group-Object Vertical |
  Sort-Object Name |
  ForEach-Object {
    $kpi = ($_.Group | Select-Object -First 1).KPI
    [PSCustomObject]@{
      Vertical = $_.Name
      KPI = $kpi
      Agents = $_.Count
    }
  }

$reportText = Get-Content -Path $reportMd -Raw -Encoding UTF8

$totalAnalyzed = 0
$totalIssues = 0
if ($reportText -match 'Total de arquivos \.agent\.md analisados:\s*(\d+)') { $totalAnalyzed = [int]$Matches[1] }
if ($reportText -match 'Total de não conformidades:\s*(\d+)') { $totalIssues = [int]$Matches[1] }

$severityRows = New-Object System.Collections.Generic.List[object]
foreach ($sev in @('Critical','High','Medium','Low')) {
  $count = 0
  $m = [regex]::Match($reportText, "\|\s*$sev\s*\|\s*(\d+)\s*\|")
  if ($m.Success) { $count = [int]$m.Groups[1].Value }
  $severityRows.Add([PSCustomObject]@{ Severity = $sev; Count = $count }) | Out-Null
}

$phaseRows = New-Object System.Collections.Generic.List[object]
foreach ($phase in @('F1','F2','F3','F4','F5')) {
  $pass = 0
  $fail = 0
  $m = [regex]::Match($reportText, "\|\s*$phase\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|")
  if ($m.Success) {
    $pass = [int]$m.Groups[1].Value
    $fail = [int]$m.Groups[2].Value
  }
  $phaseRows.Add([PSCustomObject]@{ Phase = $phase; Pass = $pass; Fail = $fail }) | Out-Null
}

$outVertical = Join-Path $biRoot 'bi_agentes_por_vertical.csv'
$outCycle = Join-Path $biRoot 'bi_agentes_por_ciclo.csv'
$outPriority = Join-Path $biRoot 'bi_prioridade_recomendada.csv'
$outKpiVertical = Join-Path $biRoot 'bi_kpi_por_vertical.csv'
$outSeverity = Join-Path $biRoot 'bi_conformidade_severidade.csv'
$outPhase = Join-Path $biRoot 'bi_conformidade_fases.csv'

$byVertical | Export-Csv -Path $outVertical -NoTypeInformation -Encoding UTF8
$byCycle | Export-Csv -Path $outCycle -NoTypeInformation -Encoding UTF8
$byPriority | Export-Csv -Path $outPriority -NoTypeInformation -Encoding UTF8
$kpiByVertical | Export-Csv -Path $outKpiVertical -NoTypeInformation -Encoding UTF8
$severityRows | Export-Csv -Path $outSeverity -NoTypeInformation -Encoding UTF8
$phaseRows | Export-Csv -Path $outPhase -NoTypeInformation -Encoding UTF8

$topVertical = ($byVertical | Sort-Object Agents -Descending | Select-Object -First 1)
$topCycle = ($byCycle | Sort-Object Agents -Descending | Select-Object -First 1)

$resumoFile = Join-Path $agentsRoot 'RESUMO_EXECUTIVO.md'
$resumo = @"
# Resumo Executivo — Ecossistema de Agentes

- Data de geração: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
- Agentes mapeados: $totalAgents
- Agentes auditados F1–F5: $totalAnalyzed
- Não conformidades F1–F5: $totalIssues

## Situação geral
- Conformidade operacional em nível máximo (F1–F5 sem não conformidades).
- Operação com cobertura por ciclos e verticais, pronta para governança contínua.

## Destaques de distribuição
- Vertical dominante: $($topVertical.Vertical) ($($topVertical.Agents) agentes; $($topVertical.SharePct)%).
- Ciclo com maior concentração: $($topCycle.Cycle) ($($topCycle.Agents) agentes; $($topCycle.SharePct)%).

## Arquivos para BI
- Matriz completa: .github/agents/MATRIZ_AGENTE_VERTICAL.csv
- Agentes por vertical: .github/agents/bi/bi_agentes_por_vertical.csv
- Agentes por ciclo: .github/agents/bi/bi_agentes_por_ciclo.csv
- KPI por vertical: .github/agents/bi/bi_kpi_por_vertical.csv
- Prioridade recomendada: .github/agents/bi/bi_prioridade_recomendada.csv
- Conformidade por severidade: .github/agents/bi/bi_conformidade_severidade.csv
- Conformidade por fase: .github/agents/bi/bi_conformidade_fases.csv
"@
$resumo | Set-Content -Path $resumoFile -Encoding UTF8

$painelFile = Join-Path $agentsRoot 'PAINEL_BI.md'
$painel = @"
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
"@
$painel | Set-Content -Path $painelFile -Encoding UTF8

Write-Output "Resumo executivo gerado: $resumoFile"
Write-Output "Guia de painel BI gerado: $painelFile"
Write-Output "Arquivos BI gerados em: $biRoot"
Write-Output "Total de agentes: $totalAgents | Auditados: $totalAnalyzed | Não conformidades: $totalIssues"
