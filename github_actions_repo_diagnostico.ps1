param(
    [string]$RepoPath = "C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION",
    [string]$PythonExe = "python",
    [int]$MaxWorkflowRuns = 5,
    [switch]$SkipGitHubLogs,
    [switch]$VerboseMode
)

$ErrorActionPreference = "Stop"

function Write-Section {
    param([string]$Title)
    Write-Host "`n==== $Title ====" -ForegroundColor Cyan
}

function Test-CommandExists {
    param([string]$CommandName)
    return [bool](Get-Command $CommandName -ErrorAction SilentlyContinue)
}

try {
    Write-Section "Validando caminho do repositório"
    if (-not (Test-Path -LiteralPath $RepoPath)) {
        throw "Repositório não encontrado em: $RepoPath"
    }

    $RepoPath = (Resolve-Path -LiteralPath $RepoPath).Path
    Write-Host "Repositório: $RepoPath" -ForegroundColor Green

    Write-Section "Validando Python"
    if (-not (Test-CommandExists $PythonExe)) {
        throw "Python não encontrado no PATH. Informe -PythonExe com o executável correto."
    }

    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $AnalyzerPath = Join-Path $ScriptDir "github_actions_repo_diagnostico.py"

    if (-not (Test-Path -LiteralPath $AnalyzerPath)) {
        throw "Arquivo Python não encontrado ao lado do script PowerShell: $AnalyzerPath"
    }

    $OutputDir = Join-Path $RepoPath ".gha-diagnostico"
    if (-not (Test-Path -LiteralPath $OutputDir)) {
        New-Item -ItemType Directory -Path $OutputDir | Out-Null
    }

    Write-Section "Preparando ambiente Python"
    try {
        & $PythonExe -m pip install --disable-pip-version-check pyyaml | Out-Host
    }
    catch {
        Write-Warning "Não consegui instalar/verificar pyyaml automaticamente. O script vai tentar rodar assim mesmo."
    }

    $argsList = @(
        $AnalyzerPath,
        "--repo", $RepoPath,
        "--output", $OutputDir,
        "--max-runs", $MaxWorkflowRuns
    )

    if ($SkipGitHubLogs) {
        $argsList += "--skip-github-logs"
    }
    if ($VerboseMode) {
        $argsList += "--verbose"
    }

    Write-Section "Executando diagnóstico"
    Write-Host "$PythonExe $($argsList -join ' ')" -ForegroundColor DarkGray
    & $PythonExe @argsList

    if ($LASTEXITCODE -ne 0) {
        throw "O analisador Python retornou código $LASTEXITCODE"
    }

    Write-Section "Arquivos gerados"
    Get-ChildItem -LiteralPath $OutputDir | Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize

    Write-Host "`nDiagnóstico concluído. Veja especialmente:" -ForegroundColor Green
    Write-Host "- $OutputDir\relatorio_final.md"
    Write-Host "- $OutputDir\resultado.json"
    Write-Host "- $OutputDir\gha_logs\ (se o GitHub CLI estiver autenticado)"
}
catch {
    Write-Error $_.Exception.Message
    exit 1
}
