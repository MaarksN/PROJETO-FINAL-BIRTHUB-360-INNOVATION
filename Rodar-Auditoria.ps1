# ╔══════════════════════════════════════════════════════════════╗
# ║   Rodar-Auditoria.ps1 — BirthHub360 Tech Debt Audit v2      ║
# ║   Executa auditoria_saas.py e abre o relatório HTML          ║
# ╚══════════════════════════════════════════════════════════════╝

$PythonScript  = ".\auditoria_saas.py"
$TargetRepo    = "C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION"
$OutputHTML    = ".\relatorio_birthhub360.html"
$StartTime     = Get-Date

function Write-Header {
    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════════════╗" -ForegroundColor DarkCyan
    Write-Host "  ║  BIRTHHUB360 — AUDITORIA DE DÍVIDA TÉCNICA v2   ║" -ForegroundColor Cyan
    Write-Host "  ╚══════════════════════════════════════════════════╝" -ForegroundColor DarkCyan
    Write-Host ""
}

function Write-Step($msg, $color = "Yellow") {
    Write-Host "  [→] $msg" -ForegroundColor $color
}

function Write-OK($msg) {
    Write-Host "  [✓] $msg" -ForegroundColor Green
}

function Write-Fail($msg) {
    Write-Host "  [✗] $msg" -ForegroundColor Red
}

# ─── HEADER ───────────────────────────────────────────────────────────────────
Write-Header

# ─── 1. Verificar repositório ─────────────────────────────────────────────────
Write-Step "Verificando repositório..."
if (-Not (Test-Path $TargetRepo)) {
    Write-Fail "Repositório não encontrado: $TargetRepo"
    Write-Host "  Verifique o caminho em DIRETORIO_ALVO dentro de auditoria_saas.py" -ForegroundColor DarkYellow
    exit 1
}
Write-OK "Repositório localizado: $TargetRepo"

# ─── 2. Verificar Python ──────────────────────────────────────────────────────
Write-Step "Verificando Python..."
try {
    $pyVer = & python --version 2>&1
    if ($LASTEXITCODE -ne 0) { throw }
    Write-OK "Python detectado: $pyVer"
} catch {
    Write-Fail "Python não encontrado no PATH. Instale em https://python.org"
    exit 1
}

# ─── 3. Verificar script de auditoria ────────────────────────────────────────
Write-Step "Verificando script..."
if (-Not (Test-Path $PythonScript)) {
    Write-Fail "Script não encontrado: $PythonScript"
    Write-Host "  Verifique se auditoria_saas.py está na mesma pasta que este .ps1" -ForegroundColor DarkYellow
    exit 1
}
Write-OK "Script de auditoria localizado."

# ─── 4. Executar ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Step "Iniciando análise do codebase..."
Write-Host "  (isso pode levar alguns segundos dependendo do tamanho do repositório)" -ForegroundColor DarkGray
Write-Host ""

$exitCode = 0
try {
    python $PythonScript
    $exitCode = $LASTEXITCODE
} catch {
    Write-Fail "Erro ao executar o script Python: $_"
    exit 1
}

if ($exitCode -ne 0) {
    Write-Fail "O script Python terminou com erro (código $exitCode)."
    exit $exitCode
}

# ─── 5. Tempo total ───────────────────────────────────────────────────────────
$elapsed = [math]::Round(((Get-Date) - $StartTime).TotalSeconds, 1)
Write-Host ""
Write-Host "  ════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-OK "Auditoria finalizada em ${elapsed}s"

# ─── 6. Abrir relatório ───────────────────────────────────────────────────────
if (Test-Path $OutputHTML) {
    Write-OK "Abrindo relatório HTML no navegador padrão..."
    Start-Process $OutputHTML
} else {
    Write-Host "  [!] Relatório HTML não gerado. Verifique erros acima." -ForegroundColor DarkYellow
}

Write-Host "  ════════════════════════════════════════════════════" -ForegroundColor DarkCyan
Write-Host ""
