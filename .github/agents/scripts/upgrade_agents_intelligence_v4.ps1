param(
  [string]$RepoRoot = ""
)

if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\.." )).Path
}

$agentsRoot = Join-Path $RepoRoot '.github\agents'
$files = Get-ChildItem -Path $agentsRoot -Recurse -Filter '*.agent.md' -File

function Upsert-Frontmatter {
  param([string[]]$Lines)

  $pairs = [ordered]@{
    'capability-pack' = 'ultra-100'
    'capabilities-count' = '100'
    'capabilities-catalog' = '.github/agents/CAPABILIDADES_100.md'
    'execution-profile' = 'elite-market-grade'
    'voice-intent-mode' = 'enabled'
    'locale-fallback' = 'pt-BR'
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
      $insert = [Math]::Min(12, $list.Count)
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

$pack = @"
- Este agente ativa o pacote Ultra-100 com 100 capacidades adicionais de nível de mercado.
- Referência oficial: .github/agents/CAPABILIDADES_100.md.
- Usar capacidades de forma adaptativa conforme objetivo, risco e contexto do usuário.
"@

$modes = @"
- Modo Elite: qualidade máxima com validação reforçada e governança estrita.
- Modo Rápido: resposta ágil com síntese objetiva e risco controlado.
- Modo Seguro: prioriza conformidade, confirmação e mitigação de risco.
"@

$voiceIntent = @"
- Interpretar comandos curtos de voz como intenções operacionais (ex.: resumir, priorizar, executar próximo passo).
- Confirmar intenção antes de ação sensível ou de alto impacto.
- Se houver baixa confiança na transcrição, pedir repetição objetiva e sugerir comando equivalente em texto.
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
  $frontLines = Upsert-Frontmatter -Lines $frontLines

  $body = Ensure-Section -Body $body -Heading 'Pacote de 100 Capacidades' -Content $pack -BeforeHeading 'Comando de Voz'
  $body = Ensure-Section -Body $body -Heading 'Modos de Operação Avançada' -Content $modes -BeforeHeading 'Saída Obrigatória'
  $body = Ensure-Section -Body $body -Heading 'Intenção de Voz' -Content $voiceIntent -BeforeHeading 'Segurança de Execução'

  $newFront = ($frontLines -join "`r`n")
  $newRaw = $prefix + $newFront + $mid + $body

  if ($newRaw -ne $raw) {
    Set-Content -Path $file.FullName -Value $newRaw -Encoding UTF8
    $changed++
  }
}

Write-Output "Arquivos processados: $($files.Count)"
Write-Output "Arquivos alterados: $changed"
