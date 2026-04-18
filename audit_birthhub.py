import os
import re
import json
import subprocess
from pathlib import Path
from datetime import datetime

# =========================
# DESKTOP PATH (WINDOWS)
# =========================
DESKTOP = Path(os.path.join(os.environ["USERPROFILE"], "Desktop"))
OUTPUT = DESKTOP / "BirthHub_Audit"
OUTPUT.mkdir(parents=True, exist_ok=True)

ROOT = Path.cwd()

errors = []
warnings = []
tech_debt = []
improvements = []
metrics = {
    "packages": 0,
    "errors": 0,
    "warnings": 0
}

# =========================
# UTIL
# =========================
def run(cmd):
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout + result.stderr
    except Exception as e:
        return str(e)

# =========================
# SCAN FILES
# =========================
def scan_files():
    for path in ROOT.rglob("*.ts"):
        content = path.read_text(errors="ignore")

        if re.search(r'from\s+[\'"].*[^\.js][\'"]', content):
            warnings.append(f"{path} → import sem .js")

        if "/src/" in content:
            tech_debt.append(f"{path} → import direto de src")

        if "console.log" in content:
            warnings.append(f"{path} → console.log detectado")

        if re.search(r'(API_KEY|SECRET|TOKEN|PASSWORD)', content):
            tech_debt.append(f"{path} → possível secret hardcoded")

# =========================
# PACKAGE ANALYSIS
# =========================
def analyze_packages():
    for pkg in ROOT.glob("packages/*"):
        if (pkg / "package.json").exists():
            metrics["packages"] += 1
            pj = json.loads((pkg / "package.json").read_text())

            if "exports" not in pj:
                tech_debt.append(f"{pkg} → sem exports")

            if pj.get("type") != "module":
                tech_debt.append(f"{pkg} → não é ESM")

# =========================
# BUILD CHECK
# =========================
def run_checks():
    print("Rodando build...")
    build = run("pnpm build")

    print("Rodando typecheck...")
    typecheck = run("pnpm ci:task typecheck")

    print("Rodando testes...")
    tests = run("pnpm test")

    if "error" in build.lower():
        errors.append("Build falhou")

    if "error" in typecheck.lower():
        errors.append("Typecheck falhou")

    if "fail" in tests.lower():
        errors.append("Testes falharam")

    (OUTPUT / "errors.log").write_text(build + "\n" + typecheck + "\n" + tests)

# =========================
# INTELIGÊNCIA
# =========================
def intelligence():
    if len(tech_debt) > 50:
        improvements.append("Alto acoplamento entre pacotes")

    if metrics["packages"] > 10:
        improvements.append("Padronizar exports em todos os pacotes")

    improvements.extend([
        "Implementar observabilidade (OpenTelemetry)",
        "Adicionar circuit breaker",
        "Adicionar testes E2E reais",
        "Adicionar métricas SaaS (MRR, churn, LTV)"
    ])

# =========================
# SCORE
# =========================
def calculate_score():
    score = 100
    score -= len(errors) * 10
    score -= len(tech_debt)
    return max(score, 0)

# =========================
# HTML REPORT
# =========================
def generate_html(score):
    html = f"""
    <html>
    <head>
    <title>BirthHub Audit</title>
    <style>
    body {{
        background:#0f172a;
        color:white;
        font-family:Arial;
        padding:20px;
    }}
    .card {{
        background:#1e293b;
        padding:20px;
        margin-bottom:20px;
        border-radius:12px;
    }}
    </style>
    </head>
    <body>

    <h1>🚀 BirthHub Audit Report</h1>

    <div class="card">
        <h2>Score: {score}/100</h2>
    </div>

    <div class="card">
        <h2>❌ Erros</h2>
        <pre>{chr(10).join(errors)}</pre>
    </div>

    <div class="card">
        <h2>⚠️ Dívidas Técnicas</h2>
        <pre>{chr(10).join(tech_debt)}</pre>
    </div>

    <div class="card">
        <h2>💡 Melhorias</h2>
        <pre>{chr(10).join(improvements)}</pre>
    </div>

    </body>
    </html>
    """

    (OUTPUT / "report.html").write_text(html, encoding="utf-8")

# =========================
# MAIN
# =========================
def main():
    print("INICIANDO AUDITORIA...\n")

    scan_files()
    analyze_packages()
    run_checks()
    intelligence()

    score = calculate_score()

    generate_html(score)

    (OUTPUT / "report.json").write_text(json.dumps({
        "errors": errors,
        "tech_debt": tech_debt,
        "improvements": improvements,
        "score": score
    }, indent=2))

    print("\nFINALIZADO")
    print(f"📊 Score: {score}/100")
    print(f"📁 Relatório salvo em: {OUTPUT}")

if __name__ == "__main__":
    main()