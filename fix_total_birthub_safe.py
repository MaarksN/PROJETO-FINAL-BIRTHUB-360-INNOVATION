from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import traceback
from pathlib import Path

REPO = Path(r"C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION")
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/birthub_test_db?schema=public"

REPORT_DIR = REPO / "artifacts" / "fix-total-safe"
LOG_FILE = REPORT_DIR / "fix-total-safe.log"
SUMMARY_FILE = REPORT_DIR / "summary.txt"

STEP_RESULTS: list[tuple[str, str]] = []


def log(message: str = "") -> None:
    print(message)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    with LOG_FILE.open("a", encoding="utf-8") as f:
        f.write(message + "\n")


def backup_file(path: Path) -> None:
    if path.exists():
        backup = path.with_name(path.name + ".bak")
        if not backup.exists():
            shutil.copy2(path, backup)


def run_command(
    command: list[str] | str,
    cwd: Path | None = None,
    env: dict[str, str] | None = None,
    check: bool = False,
) -> subprocess.CompletedProcess[str]:
    merged_env = os.environ.copy()
    if env:
        merged_env.update(env)

    if isinstance(command, list):
        cmdline = subprocess.list2cmdline(command)
    else:
        cmdline = command

    log(f"$ {cmdline}")

    process = subprocess.run(
        ["cmd", "/c", cmdline],
        cwd=str(cwd) if cwd else None,
        env=merged_env,
        capture_output=True,
        text=True,
        shell=False,
    )

    if process.stdout:
        log(process.stdout.rstrip())
    if process.stderr:
        log(process.stderr.rstrip())

    if check and process.returncode != 0:
        raise RuntimeError(f"Command failed ({process.returncode}): {cmdline}")

    return process


def safe_remove(path: Path) -> None:
    if not path.exists():
        return
    try:
        if path.is_dir():
            shutil.rmtree(path, ignore_errors=True)
        else:
            path.unlink(missing_ok=True)
        log(f"Removido: {path}")
    except Exception as exc:
        log(f"Falha ao remover {path}: {exc}")


def step(name: str, fn) -> None:
    log()
    log("=" * 90)
    log(f"STEP: {name}")
    log("=" * 90)
    try:
        fn()
        STEP_RESULTS.append((name, "OK"))
        log(f"OK: {name}")
    except Exception:
        STEP_RESULTS.append((name, "FAIL"))
        log(f"FAIL: {name}")
        log(traceback.format_exc())


def ensure_repo() -> None:
    if not REPO.exists():
        raise FileNotFoundError(f"Repositório não encontrado: {REPO}")


def kill_processes() -> None:
    run_command(["taskkill", "/F", "/IM", "node.exe"])
    run_command(["taskkill", "/F", "/IM", "pnpm.exe"])


def clean_pnpm_store() -> None:
    pnpm_root = Path(os.environ.get("LOCALAPPDATA", "")) / "pnpm"
    pnpm_store = pnpm_root / "store"

    if pnpm_store.exists():
        safe_remove(pnpm_store)

    if pnpm_root.exists():
        run_command(f'icacls "{pnpm_root}" /grant %USERNAME%:F /T /C')


def ensure_env_and_artifacts() -> None:
    env_path = REPO / ".env"
    if not env_path.exists():
        env_path.write_text("", encoding="utf-8")

    content = env_path.read_text(encoding="utf-8", errors="ignore")
    if "DATABASE_URL=" not in content:
        if content and not content.endswith("\n"):
            content += "\n"
        content += f'DATABASE_URL="{DATABASE_URL}"\n'
        env_path.write_text(content, encoding="utf-8")
        log("DATABASE_URL adicionada ao .env")
    else:
        log("DATABASE_URL já existe no .env")

    for rel in [
        "artifacts/coverage",
        "artifacts/security",
        "artifacts/release",
        "artifacts/fix-total-safe",
        "app/artifacts/coverage",
    ]:
        (REPO / rel).mkdir(parents=True, exist_ok=True)

    coverage_stub = {
        "total": {
            "lines": {"pct": 0},
            "statements": {"pct": 0},
            "functions": {"pct": 0},
            "branches": {"pct": 0},
        }
    }

    for path in [
        REPO / "artifacts" / "coverage" / "summary.json",
        REPO / "app" / "artifacts" / "coverage" / "summary.json",
    ]:
        if not path.exists():
            path.write_text(json.dumps(coverage_stub, indent=2), encoding="utf-8")


def clean_repo() -> None:
    for rel in ["node_modules", ".turbo", "dist"]:
        safe_remove(REPO / rel)


def patch_workflows_core() -> None:
    target = REPO / "packages" / "workflows-core" / "src" / "nodes" / "executeStep.ts"
    if not target.exists():
        log(f"Arquivo não encontrado, pulando patch: {target}")
        return

    original = target.read_text(encoding="utf-8", errors="ignore")
    updated = original.replace(
        "executeConditionNode(step.config, context)",
        'executeConditionNode({ ...step.config, value: step.config.value ?? "" }, context)',
    )

    if updated != original:
        backup_file(target)
        target.write_text(updated, encoding="utf-8", newline="\n")
        log(f"Patch aplicado em: {target}")
    else:
        log("Patch do workflows-core já estava aplicado ou padrão não encontrado")


def align_react_versions() -> None:
    web_pkg = REPO / "apps" / "web" / "package.json"
    if not web_pkg.exists():
        return

    raw = web_pkg.read_text(encoding="utf-8")
    data = json.loads(raw)
    deps = data.get("dependencies", {})
    react = deps.get("react")
    react_dom = deps.get("react-dom")

    if react and react_dom and react != react_dom:
        backup_file(web_pkg)
        deps["react-dom"] = react
        web_pkg.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        log(f"react-dom alinhado para {react}")
    else:
        log("react e react-dom já estão alinhados")


def env_vars() -> dict[str, str]:
    return {"DATABASE_URL": DATABASE_URL}


def install_dependencies() -> None:
    run_command(["pnpm", "store", "prune"], cwd=REPO, env=env_vars())
    run_command(["pnpm", "install", "--force"], cwd=REPO, env=env_vars(), check=True)


def install_playwright_and_python() -> None:
    run_command(["npx", "playwright", "install"], cwd=REPO, env=env_vars())
    run_command([sys.executable, "-m", "pip", "install", "pytest", "pytest-cov"], cwd=REPO, env=env_vars())

    req = REPO / "apps" / "webhook-receiver" / "requirements.txt"
    if req.exists():
        run_command([sys.executable, "-m", "pip", "install", "-r", str(req)], cwd=REPO, env=env_vars())


def build_critical_packages() -> None:
    for rel in [
        "packages/config",
        "packages/logger",
        "packages/database",
        "packages/workflows-core",
    ]:
        pkg_dir = REPO / rel
        pkg_json = pkg_dir / "package.json"
        if not pkg_json.exists():
            continue

        data = json.loads(pkg_json.read_text(encoding="utf-8"))
        if data.get("scripts", {}).get("build"):
            log(f"Rodando build em {rel}")
            run_command(["pnpm", "run", "build"], cwd=pkg_dir, env=env_vars(), check=True)


def build_all() -> None:
    run_command(["pnpm", "build"], cwd=REPO, env=env_vars(), check=True)


def typecheck() -> None:
    run_command(["pnpm", "ci:task", "typecheck"], cwd=REPO, env=env_vars(), check=True)


def security_guardrails() -> None:
    run_command(["pnpm", "ci:security-guardrails"], cwd=REPO, env=env_vars(), check=True)


def inline_credentials_scan() -> None:
    run_command(["pnpm", "security:inline-credentials"], cwd=REPO, env=env_vars(), check=True)


def run_tests() -> None:
    run_command(["pnpm", "test"], cwd=REPO, env=env_vars(), check=True)


def coverage_quality() -> None:
    run_command(["pnpm", "ci:task", "coverage-quality"], cwd=REPO, env=env_vars(), check=True)


def governance_gates() -> None:
    run_command(["pnpm", "ci:task", "governance-gates"], cwd=REPO, env=env_vars(), check=True)


def write_summary() -> None:
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    with SUMMARY_FILE.open("w", encoding="utf-8") as f:
        f.write("===== RESUMO FINAL =====\n")
        for name, status in STEP_RESULTS:
            f.write(f"{name:<45} {status}\n")


def main() -> int:
    ensure_repo()
    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    if LOG_FILE.exists():
        LOG_FILE.unlink()
    if SUMMARY_FILE.exists():
        SUMMARY_FILE.unlink()

    log(f"INICIANDO FIX TOTAL SAFE EM: {REPO}")

    step("Fechar processos e limpar pnpm store", lambda: (kill_processes(), clean_pnpm_store()))
    step("Garantir .env e artefatos mínimos", ensure_env_and_artifacts)
    step("Limpar node_modules, caches e dist", clean_repo)
    step("Aplicar patch do workflows-core", patch_workflows_core)
    step("Alinhar react e react-dom", align_react_versions)
    step("Instalar dependências", install_dependencies)
    step("Instalar Playwright e dependências Python", install_playwright_and_python)
    step("Build de pacotes internos críticos", build_critical_packages)
    step("Build geral", build_all)
    step("Typecheck", typecheck)
    step("Security guardrails", security_guardrails)
    step("Inline credentials scan", inline_credentials_scan)
    step("Testes", run_tests)
    step("Coverage quality", coverage_quality)
    step("Governance gates", governance_gates)

    write_summary()

    log()
    log("=" * 90)
    log("FINALIZADO")
    log("=" * 90)

    print("\n===== RESUMO FINAL =====")
    failed = [item for item in STEP_RESULTS if item[1] == "FAIL"]
    for name, status in STEP_RESULTS:
        print(f"{name:<45} {status}")

    print(f"\nLog: {LOG_FILE}")
    print(f"Resumo: {SUMMARY_FILE}")

    return 2 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())