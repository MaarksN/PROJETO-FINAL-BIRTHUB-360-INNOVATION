param(
  [string]$RepoRoot = ""
)

if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\.." )).Path
}

$agentsRoot = Join-Path $RepoRoot '.github\agents'
$files = Get-ChildItem -Path $agentsRoot -Recurse -Filter '*.agent.md' -File

function DefaultVerticalByCycle {
  param([string]$Cycle)

  switch ($Cycle) {
    'cycle-01' { 'SaaS B2B' }
    'cycle-02' { 'SaaS B2B' }
    'cycle-03' { 'SaaS B2B' }
    'cycle-04' { 'SaaS B2B' }
    'cycle-05' { 'SaaS B2B' }
    'cycle-06' { 'SaaS B2B' }
    'cycle-07' { 'Media/Content' }
    'cycle-08' { 'Media/Content' }
    'cycle-09' { 'SaaS B2B' }
    'cycle-10' { 'Logistics/Supply Chain' }
    'cycle-11' { 'SaaS B2B' }
    'cycle-12' { 'Legal/Compliance Services' }
    'cycle-13' { 'Legal/Compliance Services' }
    'cycle-14' { 'Fintech' }
    'cycle-15' { 'Fintech' }
    default { 'SaaS B2B' }
  }
}

function Upsert-Frontmatter {
  param(
    [string[]]$Lines,
    [string]$DefaultVertical
  )

  $pairs = [ordered]@{
    'vertical-persona-pack' = 'enabled'
    'vertical-persona-catalog' = '.github/agents/VERTICAL_PERSONAS.md'
    'default-vertical' = $DefaultVertical
    'vertical-switch' = 'enabled'
    'vertical-kpi-mode' = 'adaptive'
  }

  $list = [System.Collections.Generic.List[string]]::new()
  $list.AddRange([string[]]$Lines)

  foreach ($k in $pairs.Keys) {
    $pattern = '^' + [regex]::Escape($k) + ':\s*.*$'
    $found = $false
    for ($i=0; $i -lt $list.Count; $i++) {
      if ($list[$i] -match $pattern) {
        $list[$i] = "${k}: $($pairs[$k])"
        $found = $true
        break
      }
    }
    if (-not $found) {
      $insert = [Math]::Min(16, $list.Count)
      $list.Insert($insert, "${k}: $($pairs[$k])")
    }
  }

  return $list.ToArray()
}

function Ensure-Section {
  param(
    [string]$Body,
    [string]$Heading,
    [string]$Content,
    [string]$BeforeHeading
  )

  if ($Body -match ('(?m)^##\s+' + [regex]::Escape($Heading) + '\s*$')) {
    return $Body
  }

  $block = "## $Heading`r`n$Content`r`n"

  if (-not [string]::IsNullOrWhiteSpace($BeforeHeading) -and $Body -match ('(?m)^##\s+' + [regex]::Escape($BeforeHeading) + '\s*$')) {
    return [regex]::Replace($Body, ('(?m)^##\s+' + [regex]::Escape($BeforeHeading) + '\s*$'), ($block + "## $BeforeHeading"), 1)
  }

  return ($Body.TrimEnd() + "`r`n`r`n" + $block)
}

$verticalSel = @"
- Selecionar vertical ativo com base no contexto do usuário e no objetivo da tarefa.
- Se vertical não informado, assumir vertical padrão e solicitar confirmação curta.
- Se houver conflito de sinais, apresentar 2 hipóteses e pedir escolha objetiva.
"@

$verticalPlan = @"
- Ajustar linguagem, KPI principal e critério de decisão ao vertical selecionado.
- Priorizar recomendações que maximizem impacto no KPI dominante do vertical.
- Encerrar com decisão recomendada + KPI de validação + próximo experimento.
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

  $cycleMatch = [regex]::Match($file.FullName, 'cycle-\d{2}', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  $cycle = if ($cycleMatch.Success) { $cycleMatch.Value.ToLower() } else { 'core' }
  $defVertical = DefaultVerticalByCycle -Cycle $cycle

  $frontLines = $front -split "`r?`n"
  $frontLines = Upsert-Frontmatter -Lines $frontLines -DefaultVertical $defVertical

  $body = Ensure-Section -Body $body -Heading 'Seleção de Vertical' -Content $verticalSel -BeforeHeading 'Idioma e Localização'
  $body = Ensure-Section -Body $body -Heading 'Planejamento por Vertical' -Content $verticalPlan -BeforeHeading 'Saída Obrigatória'

  $newFront = ($frontLines -join "`r`n")
  $newRaw = $prefix + $newFront + $mid + $body

  if ($newRaw -ne $raw) {
    Set-Content -Path $file.FullName -Value $newRaw -Encoding UTF8
    $changed++
  }
}

Write-Output "Arquivos processados: $($files.Count)"
Write-Output "Arquivos alterados: $changed"
