param(
  [string]$RepoRoot = ""
)

if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\.." )).Path
}

$agentsRoot = Join-Path $RepoRoot '.github\agents'
$files = Get-ChildItem -Path $agentsRoot -Recurse -Filter '*.agent.md' -File

function Upsert-Frontmatter {
  param(
    [string[]]$Lines,
    [string]$Cycle
  )

  $pairs = [ordered]@{
    'intelligence-level' = 'advanced'
    'orchestration-mode' = 'multi-agent-collaborative'
    'suggestion-engine' = 'proactive'
    'memory-mode' = 'contextual'
    'default-locale' = 'pt-BR'
    'supported-locales' = '[pt-BR, en-US, es-ES]'
    'language-switch' = 'enabled'
    'voice-command' = 'enabled'
    'voice-confirmation' = 'required-on-sensitive-actions'
    'autonomy-mode' = 'proactive'
    'interaction-mode' = 'consultative'
    'decision-policy' = 'evidence-first'
    'fallback_behavior' = 'ask-clarify-then-proceed'
    'collaboration_protocol' = 'planner->implementer->reviewer'
    'domain-context' = $Cycle
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
      $insert = [Math]::Min(10, $list.Count)
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

$orq = @"
- Orquestrar subagentes de forma ativa para resolver tarefas complexas ponta a ponta.
- Distribuir trabalho entre planner, implementer e reviewer com síntese final única.
- Escalar para fluxo multiagente quando detectar dependências cruzadas, risco alto ou ambiguidade relevante.
"@

$mem = @"
- Manter contexto de objetivos, decisões e pendências para evitar perda de continuidade.
- Reaproveitar padrões de solução já validados no domínio antes de propor alternativas novas.
- Atualizar premissas quando houver nova evidência, explicitando impacto na recomendação.
"@

$lang = @"
- Idioma padrão obrigatório: Português do Brasil (pt-BR).
- Permitir mudança de idioma sob demanda do usuário, preservando precisão técnica.
- Confirmar idioma ativo ao detectar mistura de idiomas ou instruções ambíguas.
"@

$voice = @"
- Aceitar entrada por voz via transcrição textual sem perda de contexto.
- Suportar comandos de voz de controle, como: resumir, detalhar, priorizar, próximo passo, mudar idioma.
- Para ações sensíveis, exigir confirmação explícita antes de executar após comando de voz.
"@

$sec = @"
- Nunca executar ação de alto risco sem confirmação explícita.
- Em caso de conflito entre velocidade e segurança, priorizar segurança e justificar trade-off.
- Se faltar contexto crítico para executar, interromper com perguntas objetivas e caminho recomendado.
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

  $frontLines = $front -split "`r?`n"
  $frontLines = Upsert-Frontmatter -Lines $frontLines -Cycle $cycle

  $body = Ensure-Section -Body $body -Heading 'Orquestração Inteligente' -Content $orq -BeforeHeading 'Critérios de Decisão'
  $body = Ensure-Section -Body $body -Heading 'Memória Operacional' -Content $mem -BeforeHeading 'Interatividade'
  $body = Ensure-Section -Body $body -Heading 'Idioma e Localização' -Content $lang -BeforeHeading 'Interatividade'
  $body = Ensure-Section -Body $body -Heading 'Comando de Voz' -Content $voice -BeforeHeading 'Saída Obrigatória'
  $body = Ensure-Section -Body $body -Heading 'Segurança de Execução' -Content $sec -BeforeHeading 'Saída Obrigatória'

  $newFront = ($frontLines -join "`r`n")
  $newRaw = $prefix + $newFront + $mid + $body

  if ($newRaw -ne $raw) {
    Set-Content -Path $file.FullName -Value $newRaw -Encoding UTF8
    $changed++
  }
}

Write-Output "Arquivos processados: $($files.Count)"
Write-Output "Arquivos alterados: $changed"
