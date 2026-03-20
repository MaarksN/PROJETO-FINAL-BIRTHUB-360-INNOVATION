param(
  [string]$RepoRoot = "",
  [switch]$FailOnIssues
)

if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\.." )).Path
}

$agentsRoot = Join-Path $RepoRoot '.github\agents'
$reportMd = Join-Path $agentsRoot 'RELATORIO_CONFORMIDADE_F1_F5.md'
$reportJson = Join-Path $agentsRoot 'RELATORIO_CONFORMIDADE_F1_F5.json'

$expected = @{
  'cycle-01' = 25; 'cycle-02' = 25; 'cycle-03' = 15; 'cycle-04' = 15; 'cycle-05' = 20;
  'cycle-06' = 20; 'cycle-07' = 22; 'cycle-08' = 22; 'cycle-09' = 35; 'cycle-10' = 31;
  'cycle-11' = 30; 'cycle-12' = 18; 'cycle-13' = 17; 'cycle-14' = 18; 'cycle-15' = 18
}

$issues = New-Object System.Collections.Generic.List[object]
$coverage = New-Object System.Collections.Generic.List[object]
$failsByFile = @{}

function Add-Issue {
  param(
    [string]$Severity,
    [string]$Cycle,
    [string]$File,
    [string]$Rule,
    [string]$Detail
  )

  $issues.Add([PSCustomObject]@{
    Severity = $Severity
    Cycle = $Cycle
    File = $File
    Rule = $Rule
    Detail = $Detail
  }) | Out-Null

  $key = "$Cycle/$File"
  if (-not $failsByFile.ContainsKey($key)) {
    $failsByFile[$key] = @{ F1 = $false; F2 = $false; F3 = $false; F4 = $false; F5 = $false }
  }
  if ($Rule -match '^F([1-5])\-') {
    $failsByFile[$key]["F$($Matches[1])"] = $true
  }
}

$cycleDirs = Get-ChildItem -Path $agentsRoot -Directory | Where-Object { $_.Name -match '^cycle-\d{2}$' } | Sort-Object Name
$totalAgentFiles = 0

foreach ($dir in $cycleDirs) {
  $cycle = $dir.Name
  $agentFiles = Get-ChildItem -Path $dir.FullName -Filter '*.agent.md' -File | Sort-Object Name
  $readmePath = Join-Path $dir.FullName 'README.md'
  $hasReadme = Test-Path $readmePath
  $expectedCount = if ($expected.ContainsKey($cycle)) { [int]$expected[$cycle] } else { $null }

  $coverage.Add([PSCustomObject]@{
    Cycle = $cycle
    Expected = $expectedCount
    Actual = $agentFiles.Count
    Readme = $hasReadme
  }) | Out-Null

  if ($null -ne $expectedCount -and $agentFiles.Count -ne $expectedCount) {
    Add-Issue -Severity 'High' -Cycle $cycle -File '(cycle)' -Rule 'F4-CountMismatch' -Detail "Esperado $expectedCount agentes, encontrado $($agentFiles.Count)."
  }

  if (-not $hasReadme) {
    Add-Issue -Severity 'High' -Cycle $cycle -File 'README.md' -Rule 'F5-MissingReadme' -Detail 'README.md ausente no ciclo.'
  }

  foreach ($file in $agentFiles) {
    $totalAgentFiles++
    $raw = Get-Content -Path $file.FullName -Raw -Encoding UTF8

    if (([regex]::Matches($raw, '(?m)^---\s*$')).Count -lt 2) {
      Add-Issue -Severity 'Critical' -Cycle $cycle -File $file.Name -Rule 'F4-InvalidFrontmatterDelimiters' -Detail 'Frontmatter YAML sem delimitadores completos.'
    }

    if ($raw -notmatch '(?m)^name:\s*".+"\s*$') {
      Add-Issue -Severity 'Critical' -Cycle $cycle -File $file.Name -Rule 'F2-MissingName' -Detail 'Campo name ausente ou fora do padrão.'
    }

    $descMatch = [regex]::Match($raw, '(?m)^description:\s*"([^"]+)"\s*$')
    if (-not $descMatch.Success) {
      Add-Issue -Severity 'Critical' -Cycle $cycle -File $file.Name -Rule 'F1-MissingDescription' -Detail 'Campo description ausente ou inválido.'
    } else {
      $desc = $descMatch.Groups[1].Value.Trim()
      if ($desc -notmatch '^Use when\b') {
        Add-Issue -Severity 'High' -Cycle $cycle -File $file.Name -Rule 'F1-DescriptionPrefix' -Detail 'description não inicia com "Use when".'
      }
    }

    $toolsMatch = [regex]::Match($raw, '(?m)^tools:\s*\[(.+)\]\s*$')
    if (-not $toolsMatch.Success) {
      Add-Issue -Severity 'Critical' -Cycle $cycle -File $file.Name -Rule 'F2-MissingTools' -Detail 'Campo tools ausente.'
    } else {
      $toolsRaw = $toolsMatch.Groups[1].Value
      if ($toolsRaw -notmatch '\bread\b' -or $toolsRaw -notmatch '\bsearch\b') {
        Add-Issue -Severity 'Medium' -Cycle $cycle -File $file.Name -Rule 'F2-ToolsUnexpected' -Detail 'tools não contém read e search.'
      }
    }

    if ($raw -notmatch '(?m)^user-invocable:\s*true\s*$') {
      Add-Issue -Severity 'Medium' -Cycle $cycle -File $file.Name -Rule 'F2-MissingUserInvocable' -Detail 'Campo user-invocable:true ausente.'
    }

    if ($raw -notmatch '(?m)^##\s+Escopo\s*$' -or $raw -notmatch '(?m)^##\s+Restrições\s*$' -or $raw -notmatch '(?m)^##\s+Saída Obrigatória\s*$') {
      Add-Issue -Severity 'High' -Cycle $cycle -File $file.Name -Rule 'F2-MissingSections' -Detail 'Seções Escopo/Restrições/Saída Obrigatória incompletas.'
    }

    if ($raw -notmatch '(?m)^1\.\s+' -or $raw -notmatch '(?m)^2\.\s+' -or $raw -notmatch '(?m)^3\.\s+') {
      Add-Issue -Severity 'Medium' -Cycle $cycle -File $file.Name -Rule 'F3-OutputNotNumbered' -Detail 'Saída Obrigatória sem itens 1,2,3 completos.'
    }

    if ($file.Name -notmatch '^[a-z0-9]+(?:-[a-z0-9]+)*\.agent\.md$') {
      Add-Issue -Severity 'Low' -Cycle $cycle -File $file.Name -Rule 'F4-FileNameKebabCase' -Detail 'Arquivo fora do padrão kebab-case lowercase.'
    }
  }
}

$severityOrder = @('Critical','High','Medium','Low')
$severityCounts = foreach ($s in $severityOrder) {
  [PSCustomObject]@{ Severity = $s; Count = ($issues | Where-Object Severity -eq $s).Count }
}

$fPhase = @('F1','F2','F3','F4','F5')
$phaseFails = @{}
foreach ($f in $fPhase) { $phaseFails[$f] = @($issues | Where-Object Rule -like "$f-*").Count }

$phasePass = @{}
foreach ($f in $fPhase) { $phasePass[$f] = [Math]::Max(0, $totalAgentFiles - $phaseFails[$f]) }

$coverageMd = ($coverage | Sort-Object Cycle | ForEach-Object {
  "| $($_.Cycle) | $($_.Expected) | $($_.Actual) | $($_.Readme) |"
}) -join "`n"

$sevMd = ($severityCounts | ForEach-Object {
  "| $($_.Severity) | $($_.Count) |"
}) -join "`n"

$phaseMd = ($fPhase | ForEach-Object {
  "| $_ | $($phasePass[$_]) | $($phaseFails[$_]) |"
}) -join "`n"

$detailRows = if ($issues.Count -eq 0) {
  "| - | - | - | - | Nenhuma não conformidade encontrada. |"
} else {
  ($issues |
    Sort-Object @{Expression={ [array]::IndexOf($severityOrder, $_.Severity) }}, Cycle, File |
    ForEach-Object { "| $($_.Severity) | $($_.Cycle) | $($_.File) | $($_.Rule) | $($_.Detail -replace '\|','/') |" }) -join "`n"
}

$report = @"
# Relatório Automático de Conformidade F1–F5

- Data: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
- Escopo: .github/agents/cycle-01 até .github/agents/cycle-15
- Total de arquivos .agent.md analisados: $totalAgentFiles
- Total de não conformidades: $($issues.Count)

## Critérios F1–F5 aplicados
- **F1 Descoberta**: description obrigatório e iniciando com Use when.
- **F2 Contrato**: name, tools, user-invocable:true, seções Escopo, Restrições, Saída Obrigatória.
- **F3 Prompting**: presença de saída numerada 1., 2., 3.
- **F4 Implementação**: frontmatter válido, contagem esperada por ciclo e padrão de nome de arquivo.
- **F5 Validação cruzada**: README.md por ciclo.

## Cobertura por ciclo
| Ciclo | Esperado | Encontrado | README |
|---|---:|---:|:---:|
$coverageMd

## Não conformidades por severidade
| Severidade | Qtde |
|---|---:|
$sevMd

## Resultado por fase (arquivos em conformidade)
| Fase | Passou | Falhou |
|---|---:|---:|
$phaseMd

## Achados detalhados por severidade
| Severidade | Ciclo | Arquivo | Regra | Detalhe |
|---|---|---|---|---|
$detailRows
"@

$report | Set-Content -Path $reportMd -Encoding UTF8
if ($issues.Count -eq 0) {
  '[]' | Set-Content -Path $reportJson -Encoding UTF8
} else {
  ($issues | ConvertTo-Json -Depth 8) | Set-Content -Path $reportJson -Encoding UTF8
}

Write-Output "Relatório gerado em: $reportMd"
Write-Output "JSON gerado em: $reportJson"
Write-Output "Total analisado: $totalAgentFiles | Não conformidades: $($issues.Count)"
$severityCounts | Format-Table -AutoSize

if ($FailOnIssues -and $issues.Count -gt 0) {
  exit 1
}

exit 0
