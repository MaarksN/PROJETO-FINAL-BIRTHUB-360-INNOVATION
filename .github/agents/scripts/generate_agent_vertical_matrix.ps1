param(
  [string]$RepoRoot = ""
)

if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\.." )).Path
}

$agentsRoot = Join-Path $RepoRoot '.github\agents'
$outFile = Join-Path $agentsRoot 'MATRIZ_AGENTE_VERTICAL.md'

$verticalMap = @{
  'SaaS B2B' = @{ Priority = 'crescimento eficiente e retenção'; KPI = 'NRR, churn, CAC payback' }
  'Fintech' = @{ Priority = 'risco-compliance e escala segura'; KPI = 'default rate, fraude, aprovação segura' }
  'E-commerce' = @{ Priority = 'conversão com margem'; KPI = 'conversão, ticket médio, margem' }
  'Health/Healthtech' = @{ Priority = 'segurança clínica e conformidade'; KPI = 'adesão, desfecho, SLA clínico' }
  'Edtech' = @{ Priority = 'aprendizagem e retenção'; KPI = 'ativação, retenção, conclusão' }
  'Logistics/Supply Chain' = @{ Priority = 'eficiência operacional e previsibilidade'; KPI = 'OTIF, lead time, custo por rota' }
  'Manufacturing/Indústria' = @{ Priority = 'estabilidade e produtividade'; KPI = 'OEE, downtime, refugo' }
  'Real Estate/Proptech' = @{ Priority = 'previsibilidade comercial e carteira'; KPI = 'ocupação, vacância, ciclo de fechamento' }
  'Legal/Compliance Services' = @{ Priority = 'segurança jurídica e rastreabilidade'; KPI = 'não conformidade, tempo de revisão' }
  'Public Sector' = @{ Priority = 'impacto público com conformidade'; KPI = 'SLA, aderência regulatória, eficiência orçamentária' }
  'Media/Content' = @{ Priority = 'crescimento de audiência rentável'; KPI = 'retenção de audiência, RPM, alcance qualificado' }
  'Hospitality/Travel' = @{ Priority = 'experiência com eficiência'; KPI = 'ocupação, RevPAR, NPS' }
}

function Parse-Frontmatter {
  param([string]$Raw)

  $m = [regex]::Match($Raw, '^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  if (-not $m.Success) { return @{} }

  $front = $m.Groups[2].Value
  $dict = @{}
  foreach ($line in ($front -split "`r?`n")) {
    if ($line -match '^([A-Za-z0-9\-]+):\s*(.*)$') {
      $key = $Matches[1].Trim()
      $value = $Matches[2].Trim().Trim('"')
      $dict[$key] = $value
    }
  }
  return $dict
}

$files = Get-ChildItem -Path $agentsRoot -Recurse -Filter '*.agent.md' -File
$rows = New-Object System.Collections.Generic.List[object]

foreach ($f in $files) {
  $raw = Get-Content -Path $f.FullName -Raw -Encoding UTF8
  $fm = Parse-Frontmatter -Raw $raw

  $name = if ($fm.ContainsKey('name')) { $fm['name'] -replace '\s+Agent$','' } else { $f.BaseName -replace '\.agent$','' }

  $cycle = ''
  if ($fm.ContainsKey('domain-context')) { $cycle = $fm['domain-context'] }
  if ([string]::IsNullOrWhiteSpace($cycle)) {
    $cm = [regex]::Match($f.FullName, 'cycle-\d{2}', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($cm.Success) { $cycle = $cm.Value.ToLower() } else { $cycle = 'core' }
  }

  $vertical = if ($fm.ContainsKey('default-vertical')) { $fm['default-vertical'] } else { 'SaaS B2B' }
  if ([string]::IsNullOrWhiteSpace($vertical)) { $vertical = 'SaaS B2B' }

  $priority = 'impacto de negócio com segurança'
  $kpi = 'impacto, risco, velocidade'
  if ($verticalMap.ContainsKey($vertical)) {
    $priority = $verticalMap[$vertical].Priority
    $kpi = $verticalMap[$vertical].KPI
  }

  $relPath = $f.FullName.Replace($RepoRoot + '\', '').Replace('\','/')

  $rows.Add([PSCustomObject]@{
    Agent = $name
    Cycle = $cycle
    Vertical = $vertical
    Priority = $priority
    KPI = $kpi
    File = $relPath
  }) | Out-Null
}

$rows = $rows | Sort-Object Cycle, Agent

$byVertical = $rows | Group-Object Vertical | Sort-Object Name
$byCycle = $rows | Group-Object Cycle | Sort-Object Name

$verticalTable = ($byVertical | ForEach-Object {
  "| $($_.Name) | $($_.Count) |"
}) -join "`n"

$cycleTable = ($byCycle | ForEach-Object {
  "| $($_.Name) | $($_.Count) |"
}) -join "`n"

$detailTable = ($rows | ForEach-Object {
  "| $($_.Agent.Replace('|','/')) | $($_.Cycle) | $($_.Vertical.Replace('|','/')) | $($_.Priority.Replace('|','/')) | $($_.KPI.Replace('|','/')) | $($_.File) |"
}) -join "`n"

$content = @"
# Matriz Agente x Vertical

- Gerado em: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
- Fonte: agentes em `.github/agents/cycle-*` e frontmatter `default-vertical`
- Total de agentes mapeados: $($rows.Count)

## Distribuição por vertical
| Vertical | Qtde de agentes |
|---|---:|
$verticalTable

## Distribuição por ciclo
| Ciclo | Qtde de agentes |
|---|---:|
$cycleTable

## Matriz detalhada
| Agente | Ciclo | Vertical padrão | Prioridade recomendada | KPI principal sugerido | Arquivo |
|---|---|---|---|---|---|
$detailTable
"@

$content | Set-Content -Path $outFile -Encoding UTF8
Write-Output "Matriz gerada em: $outFile"
Write-Output "Total de linhas: $($rows.Count)"
