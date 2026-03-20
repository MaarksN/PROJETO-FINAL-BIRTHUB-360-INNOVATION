param(
  [string]$RepoRoot = ""
)

if ([string]::IsNullOrWhiteSpace($RepoRoot)) {
  $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..\.." )).Path
}

$agentsRoot = Join-Path $RepoRoot '.github\agents'
$files = Get-ChildItem -Path $agentsRoot -Recurse -Filter '*.agent.md' -File

function Get-DomainProfile {
  param([string]$Cycle)

  switch ($Cycle) {
    'cycle-01' { return @{ Name='Executivos e Estratégia'; Priority='decisão estratégica, risco e alocação'; KPI='receita, margem, risco, velocidade de decisão' } }
    'cycle-02' { return @{ Name='Executivos e Estratégia'; Priority='execução estratégica, governança e previsibilidade'; KPI='forecast, eficiência, risco operacional' } }
    'cycle-03' { return @{ Name='Vendas e Prospecção'; Priority='qualificação, timing e conversão inicial'; KPI='taxa de resposta, taxa de reunião, MQL->SQL' } }
    'cycle-04' { return @{ Name='Vendas e Prospecção'; Priority='multi-threading, acesso a decisores e avanço de pipeline'; KPI='velocidade de estágio, cobertura de stakeholders' } }
    'cycle-05' { return @{ Name='Vendas e Fechamento'; Priority='negociação, ROI e fechamento previsível'; KPI='win-rate, ciclo de venda, desconto médio' } }
    'cycle-06' { return @{ Name='Vendas e Fechamento'; Priority='prova técnica, risco de deal e governança comercial'; KPI='conversão técnica, risco de churn, margem' } }
    'cycle-07' { return @{ Name='Marketing Growth'; Priority='aquisição eficiente, experimentação e escala'; KPI='CAC, LTV, ROAS, ativação' } }
    'cycle-08' { return @{ Name='Marketing Growth'; Priority='retenção, distribuição e qualidade de execução'; KPI='engajamento, churn, eficiência de canal' } }
    'cycle-09' { return @{ Name='Customer Success e Suporte'; Priority='adoção, saúde e retenção'; KPI='NPS, CSAT, renovação, backlog' } }
    'cycle-10' { return @{ Name='RevOps e Inteligência'; Priority='processo, qualidade de dados e alinhamento GTM'; KPI='acurácia de forecast, SLA interno, eficiência operacional' } }
    'cycle-11' { return @{ Name='Dados e BI'; Priority='insight acionável, causalidade e decisão orientada a dados'; KPI='latência de insight, precisão analítica, impacto de decisão' } }
    'cycle-12' { return @{ Name='Financeiro/Jurídico/Administrativo'; Priority='conformidade, liquidez e risco contratual'; KPI='inadimplência, eficiência de cobrança, exposição de risco' } }
    'cycle-13' { return @{ Name='Financeiro/Jurídico/Administrativo'; Priority='controles, fechamento e saúde financeira'; KPI='tempo de fechamento, desvios, indicadores financeiros' } }
    'cycle-14' { return @{ Name='Fintech/Risco/Compliance'; Priority='KYC/AML, monitoramento e prevenção a fraude'; KPI='falso positivo, tempo de investigação, compliance score' } }
    'cycle-15' { return @{ Name='Fintech/Risco/Compliance'; Priority='modelagem de risco, decisão automatizada e governança regulatória'; KPI='default rate, aprovação segura, SLA regulatório' } }
    default { return @{ Name='Geral'; Priority='clareza, impacto e segurança'; KPI='qualidade de decisão, tempo de execução' } }
  }
}

function Upsert-Frontmatter {
  param(
    [string[]]$Lines,
    [string]$Cycle
  )

  $pairs = [ordered]@{
    'intelligence-level' = 'advanced'
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
      $insert = [Math]::Min(6, $list.Count)
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
  $domain = Get-DomainProfile -Cycle $cycle

  $frontLines = $front -split "`r?`n"
  $frontLines = Upsert-Frontmatter -Lines $frontLines -Cycle $cycle

  $foco = @"
- Domínio: $($domain.Name)
- Prioridade primária: $($domain.Priority)
- KPIs-chave: $($domain.KPI)
"@

  $criterios = @"
- Basear decisões em evidências observáveis e hipóteses explícitas.
- Priorizar ações por impacto esperado, urgência e risco.
- Em conflito entre velocidade e segurança, explicitar trade-off e recomendar opção segura.
"@

  $handoff = @"
  - Acionar planner para decompor estratégia quando a tarefa envolver múltiplas dependências.
  - Acionar implementer para transformar decisão em execução rastreável.
  - Acionar reviewer para validação final de conformidade, risco e qualidade.
"@

  $fallback = @"
- Se faltar contexto crítico, fazer até 3 perguntas objetivas e aguardar confirmação.
- Se houver risco alto sem autorização, interromper e recomendar caminho seguro.
- Se os dados forem conflitantes, apresentar cenários e níveis de confiança antes de recomendar.
"@

  $sugestoes = @"
- Sempre sugerir próximo passo de maior impacto com menor esforço.
- Oferecer alternativa conservadora e alternativa otimizada com trade-offs claros.
- Encerrar com plano de execução curto: agora, próximo, depois.
"@

  $body = Ensure-Section -Body $body -Heading 'Foco de Domínio' -Content $foco -BeforeHeading 'Autonomia e Proatividade'
  $body = Ensure-Section -Body $body -Heading 'Critérios de Decisão' -Content $criterios -BeforeHeading 'Colaboração entre Agentes'
  $body = Ensure-Section -Body $body -Heading 'Protocolo de Handoff' -Content $handoff -BeforeHeading 'Interatividade'
  $body = Ensure-Section -Body $body -Heading 'Fallback e Recuperação' -Content $fallback -BeforeHeading 'Saída Obrigatória'
  $body = Ensure-Section -Body $body -Heading 'Sugestões Proativas' -Content $sugestoes -BeforeHeading 'Saída Obrigatória'

  $newFront = ($frontLines -join "`r`n")
  $newRaw = $prefix + $newFront + $mid + $body

  if ($newRaw -ne $raw) {
    Set-Content -Path $file.FullName -Value $newRaw -Encoding UTF8
    $changed++
  }
}

Write-Output "Arquivos processados: $($files.Count)"
Write-Output "Arquivos alterados: $changed"
