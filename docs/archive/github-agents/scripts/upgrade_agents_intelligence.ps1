param(
  [string]$RepoRoot = ""
)

if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\.." )).Path
}

$agentsRoot = Join-Path $RepoRoot '.github\agents'
$files = Get-ChildItem -Path $agentsRoot -Recurse -Filter '*.agent.md' -File

function Normalize-ToolsLine {
  param([string]$Line)

  $m = [regex]::Match($Line, '^tools:\s*\[(.*)\]\s*$', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if (-not $m.Success) { return $Line }

  $raw = $m.Groups[1].Value
  $items = @()
  foreach ($part in ($raw -split ',')) {
    $token = $part.Trim().Trim("'").Trim('"')
    if (-not [string]::IsNullOrWhiteSpace($token)) { $items += $token }
  }

  foreach ($needed in @('read','search','agent')) {
    if ($items -notcontains $needed) { $items += $needed }
  }

  $ordered = @()
  foreach ($pref in @('read','search','edit','execute','todo','agent')) {
    if ($items -contains $pref) { $ordered += $pref }
  }
  foreach ($other in $items) {
    if ($ordered -notcontains $other) { $ordered += $other }
  }

  return ('tools: [' + (($ordered | ForEach-Object { $_ }) -join ', ') + ']')
}

function Merge-AgentsLine {
  param([string]$Existing)

  $base = @('planner','implementer','reviewer')

  if ([string]::IsNullOrWhiteSpace($Existing)) {
    return ('agents: [' + ($base -join ', ') + ']')
  }

  $m = [regex]::Match($Existing, '^agents:\s*\[(.*)\]\s*$', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if (-not $m.Success) {
    return ('agents: [' + ($base -join ', ') + ']')
  }

  $raw = $m.Groups[1].Value
  $items = @()
  foreach ($part in ($raw -split ',')) {
    $token = $part.Trim().Trim("'").Trim('"')
    if (-not [string]::IsNullOrWhiteSpace($token)) { $items += $token }
  }

  foreach ($a in $base) {
    if ($items -notcontains $a) { $items += $a }
  }

  return ('agents: [' + (($items | Select-Object -Unique) -join ', ') + ']')
}

$autonomia = @"
## Autonomia e Proatividade
- Antecipe próximos passos e proponha ações práticas sem depender de instruções linha a linha.
- Quando houver ambiguidade crítica, formule até 3 perguntas objetivas antes de decidir.
- Sugira melhorias, riscos e alternativas com prioridade e impacto esperado.
"@

$colab = @"
## Colaboração entre Agentes
- Quando a tarefa exigir outra especialidade, delegue para agentes complementares de forma explícita.
- Use planner para decompor estratégia, implementer para execução e reviewer para conformidade.
- Traga de volta um resumo consolidado com decisão recomendada e próximos passos.
"@

$inter = @"
## Interatividade
- Responda de forma consultiva, orientada a decisão e com linguagem clara.
- Ofereça opções de caminho (rápido, seguro, otimizado) com trade-offs.
- Sempre encerrar com recomendação objetiva e ação seguinte sugerida.
"@

$changed = 0
foreach ($file in $files) {
  $raw = Get-Content -Path $file.FullName -Raw -Encoding UTF8
  $m = [regex]::Match($raw, '^(---\r?\n)([\s\S]*?)(\r?\n---\r?\n)([\s\S]*)$')
  if (-not $m.Success) { continue }

  $prefix = $m.Groups[1].Value
  $front = $m.Groups[2].Value
  $mid = $m.Groups[3].Value
  $body = $m.Groups[4].Value

  $frontLines = $front -split "`r?`n"

  $hasTools = $false
  $hasAgents = $false
  for ($i = 0; $i -lt $frontLines.Count; $i++) {
    if ($frontLines[$i] -match '^tools:\s*\[.*\]\s*$') {
      $frontLines[$i] = Normalize-ToolsLine -Line $frontLines[$i]
      $hasTools = $true
    }
    if ($frontLines[$i] -match '^agents:\s*\[.*\]\s*$') {
      $frontLines[$i] = Merge-AgentsLine -Existing $frontLines[$i]
      $hasAgents = $true
    }
  }

  if (-not $hasTools) {
    $frontLines += 'tools: [read, search, agent]'
  }

  if (-not $hasAgents) {
    $insertIndex = 0
    for ($i = 0; $i -lt $frontLines.Count; $i++) {
      if ($frontLines[$i] -match '^tools:\s*\[.*\]\s*$') { $insertIndex = $i + 1; break }
    }
    $list = [System.Collections.Generic.List[string]]::new()
    $list.AddRange([string[]]$frontLines)
    $list.Insert($insertIndex, 'agents: [planner, implementer, reviewer]')
    $frontLines = $list.ToArray()
  }

  if ($body -notmatch '(?m)^##\s+Autonomia e Proatividade\s*$') {
    if ($body -match '(?m)^##\s+Saída Obrigatória\s*$') {
      $body = [regex]::Replace($body, '(?m)^##\s+Saída Obrigatória\s*$', ($autonomia + "`r`n" + $colab + "`r`n" + $inter + "`r`n## Saída Obrigatória"), 1)
    } else {
      $body = $body.TrimEnd() + "`r`n`r`n" + $autonomia + "`r`n" + $colab + "`r`n" + $inter + "`r`n"
    }
  } else {
    if ($body -notmatch '(?m)^##\s+Colaboração entre Agentes\s*$') {
      $body = $body.TrimEnd() + "`r`n`r`n" + $colab + "`r`n"
    }
    if ($body -notmatch '(?m)^##\s+Interatividade\s*$') {
      $body = $body.TrimEnd() + "`r`n`r`n" + $inter + "`r`n"
    }
  }

  $newFront = ($frontLines -join "`r`n")
  $newRaw = $prefix + $newFront + $mid + $body

  if ($newRaw -ne $raw) {
    Set-Content -Path $file.FullName -Value $newRaw -Encoding UTF8
    $changed++
  }
}

Write-Output "Arquivos processados: $($files.Count)"
Write-Output "Arquivos alterados: $changed"
