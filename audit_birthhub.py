import os
import re
import json
import subprocess
from pathlib import Path

ROOT = Path.cwd()

if not (ROOT / "package.json").exists():
    print("ERRO: Execute dentro do repositorio")
    exit()

DESKTOP = Path(os.path.join(os.environ["USERPROFILE"], "Desktop"))
OUTPUT = DESKTOP / "BirthHub_Audit"
OUTPUT.mkdir(parents=True, exist_ok=True)

errors = []
tech_debt = []
improvements = []

def run(cmd):
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout + result.stderr
    except Exception as e:
        return str(e)

def scan():
    for path in ROOT.rglob("*.ts"):
        try:
            content = path.read_text(errors="ignore")

            if "/src/" in content:
                tech_debt.append(f"{path} -> import de src")

            if "console.log" in content:
                tech_debt.append(f"{path} -> console.log")

            if "API_KEY" in content or "SECRET" in content:
                tech_debt.append(f"{path} -> possible secret")
        except:
            pass

def packages():
    for pkg in ROOT.glob("packages/*"):
        pj = pkg / "package.json"
        if pj.exists():
            data = json.loads(pj.read_text())
            if "exports" not in data:
                tech_debt.append(f"{pkg} -> sem exports")
            if data.get("type") != "module":
                tech_debt.append(f"{pkg} -> nao ESM")

def checks():
    build = run("pnpm build")
    if "error" in build.lower():
        errors.append("build falhou")

    typecheck = run("pnpm ci:task typecheck")
    if "error" in typecheck.lower():
        errors.append("typecheck falhou")

    tests = run("pnpm test")
    if "fail" in tests.lower():
        errors.append("testes falharam")

    (OUTPUT / "errors.log").write_text(build + typecheck + tests)

def score():
    s = 100
    s -= len(errors) * 10
    s -= len(tech_debt)
    return max(s, 0)

def html(score):
    content = f"""
    <html><body style='background:#0f172a;color:white;font-family:Arial;padding:20px'>
    <h1>BirthHub Audit</h1>
    <h2>Score: {score}/100</h2>
    <h3>Erros</h3><pre>{chr(10).join(errors)}</pre>
    <h3>Dividas</h3><pre>{chr(10).join(tech_debt)}</pre>
    <h3>Melhorias</h3>
    <pre>
- Observabilidade (OpenTelemetry)
- Circuit breaker
- Testes E2E
- Metricas SaaS
    </pre>
    </body></html>
    """
    (OUTPUT / "report.html").write_text(content, encoding="utf-8")

print("Rodando auditoria...")

scan()
packages()
checks()

s = score()
html(s)

(OUTPUT / "report.json").write_text(json.dumps({
    "errors": errors,
    "tech_debt": tech_debt,
    "score": s
}, indent=2))

print("Finalizado")
print(f"Score: {s}")
print(f"Relatorio em: {OUTPUT}")
