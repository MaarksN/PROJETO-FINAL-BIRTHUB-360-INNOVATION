#!/usr/bin/env python3
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

try:
    import yaml
except Exception:
    yaml = None

ERROR_PATTERNS = [
    re.compile(r"\berror\b", re.IGNORECASE),
    re.compile(r"\bfailed\b", re.IGNORECASE),
    re.compile(r"\bexception\b", re.IGNORECASE),
    re.compile(r"traceback", re.IGNORECASE),
    re.compile(r"cannot find module", re.IGNORECASE),
    re.compile(r"module not found", re.IGNORECASE),
    re.compile(r"is not recognized as an internal or external command", re.IGNORECASE),
    re.compile(r"command not found", re.IGNORECASE),
    re.compile(r"npm ERR!", re.IGNORECASE),
    re.compile(r"pnpm .*?ERR", re.IGNORECASE),
    re.compile(r"yarn .*?error", re.IGNORECASE),
    re.compile(r"TypeError:", re.IGNORECASE),
    re.compile(r"ReferenceError:", re.IGNORECASE),
    re.compile(r"SyntaxError:", re.IGNORECASE),
    re.compile(r"AssertionError", re.IGNORECASE),
    re.compile(r"Process completed with exit code", re.IGNORECASE),
]

COMMON_COMMANDS = [
    ["npm", "run", "lint"],
    ["npm", "run", "test", "--", "--runInBand"],
    ["npm", "run", "build"],
    ["pnpm", "lint"],
    ["pnpm", "test"],
    ["pnpm", "build"],
    ["yarn", "lint"],
    ["yarn", "test"],
    ["yarn", "build"],
    ["python", "-m", "pytest"],
    ["pytest"],
]


def run_command(cmd: List[str], cwd: Path, timeout: int = 1200) -> Dict[str, Any]:
    try:
        proc = subprocess.run(
            cmd,
            cwd=str(cwd),
            capture_output=True,
            text=True,
            timeout=timeout,
            shell=False,
        )
        return {
            "cmd": cmd,
            "returncode": proc.returncode,
            "stdout": proc.stdout,
            "stderr": proc.stderr,
        }
    except FileNotFoundError:
        return {
            "cmd": cmd,
            "returncode": 127,
            "stdout": "",
            "stderr": f"Command not found: {cmd[0]}",
        }
    except subprocess.TimeoutExpired as e:
        return {
            "cmd": cmd,
            "returncode": 124,
            "stdout": e.stdout or "",
            "stderr": (e.stderr or "") + "\nTimed out",
        }
    except Exception as e:
        return {
            "cmd": cmd,
            "returncode": 1,
            "stdout": "",
            "stderr": f"Unexpected exception: {e}",
        }


def read_text(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""


def extract_error_lines(text: str, max_lines: int = 80) -> List[str]:
    lines = text.splitlines()
    matches = []
    for idx, line in enumerate(lines):
        if any(p.search(line) for p in ERROR_PATTERNS):
            start = max(0, idx - 2)
            end = min(len(lines), idx + 3)
            block = "\n".join(lines[start:end])
            matches.append(block)
    unique = []
    seen = set()
    for item in matches:
        key = item.strip()
        if key and key not in seen:
            seen.add(key)
            unique.append(item)
    return unique[:max_lines]


def detect_package_manager(repo: Path) -> str:
    if (repo / "pnpm-lock.yaml").exists():
        return "pnpm"
    if (repo / "yarn.lock").exists():
        return "yarn"
    if (repo / "package-lock.json").exists() or (repo / "package.json").exists():
        return "npm"
    return "unknown"


def infer_local_commands(repo: Path) -> List[List[str]]:
    package_manager = detect_package_manager(repo)
    package_json = repo / "package.json"
    cmds: List[List[str]] = []

    if package_json.exists():
        try:
            data = json.loads(read_text(package_json))
            scripts = set((data.get("scripts") or {}).keys())
        except Exception:
            scripts = set()

        if package_manager in {"npm", "pnpm", "yarn"}:
            for script_name in ["lint", "typecheck", "test", "test:ci", "build", "check", "e2e"]:
                if script_name in scripts:
                    if package_manager == "npm":
                        cmds.append(["npm", "run", script_name])
                    else:
                        cmds.append([package_manager, script_name])

    if (repo / "pyproject.toml").exists() or (repo / "pytest.ini").exists():
        cmds.append([sys.executable, "-m", "pytest"])

    if not cmds:
        cmds.extend(COMMON_COMMANDS)

    deduped = []
    seen = set()
    for cmd in cmds:
        key = tuple(cmd)
        if key not in seen:
            seen.add(key)
            deduped.append(cmd)
    return deduped


def load_workflows(repo: Path) -> List[Dict[str, Any]]:
    workflows_dir = repo / ".github" / "workflows"
    workflows = []
    if not workflows_dir.exists() or yaml is None:
        return workflows
    for file in list(workflows_dir.glob("*.yml")) + list(workflows_dir.glob("*.yaml")):
        try:
            data = yaml.safe_load(read_text(file)) or {}
        except Exception as e:
            workflows.append({"file": str(file), "parse_error": str(e), "jobs": []})
            continue
        jobs = []
        for job_name, job_data in (data.get("jobs") or {}).items():
            steps = []
            for step in job_data.get("steps", []) or []:
                steps.append(
                    {
                        "name": step.get("name"),
                        "uses": step.get("uses"),
                        "run": step.get("run"),
                        "shell": step.get("shell"),
                    }
                )
            jobs.append({"job_name": job_name, "steps": steps})
        workflows.append({"file": str(file), "name": data.get("name"), "jobs": jobs})
    return workflows


def extract_commands_from_workflows(workflows: List[Dict[str, Any]]) -> List[str]:
    commands = []
    for wf in workflows:
        for job in wf.get("jobs", []):
            for step in job.get("steps", []):
                run_block = step.get("run")
                if isinstance(run_block, str) and run_block.strip():
                    commands.append(run_block.strip())
    return commands


def maybe_fetch_github_logs(repo: Path, output_dir: Path, max_runs: int, verbose: bool) -> Dict[str, Any]:
    gh_path = shutil.which("gh")
    result: Dict[str, Any] = {
        "enabled": False,
        "logs": [],
        "errors": [],
        "note": "gh CLI não encontrado ou não autenticado.",
    }
    if not gh_path:
        return result

    auth = run_command([gh_path, "auth", "status"], cwd=repo, timeout=60)
    if auth["returncode"] != 0:
        result["note"] = "gh CLI encontrado, mas não autenticado. Rode: gh auth login"
        return result

    list_runs = run_command(
        [gh_path, "run", "list", "--limit", str(max_runs), "--json", "databaseId,workflowName,conclusion,status,headBranch,displayTitle"],
        cwd=repo,
        timeout=120,
    )
    if list_runs["returncode"] != 0:
        result["note"] = list_runs["stderr"] or "Falha ao listar runs do GitHub Actions."
        return result

    try:
        runs = json.loads(list_runs["stdout"] or "[]")
    except Exception as e:
        result["note"] = f"Não foi possível interpretar gh run list: {e}"
        return result

    logs_dir = output_dir / "gha_logs"
    logs_dir.mkdir(parents=True, exist_ok=True)
    result["enabled"] = True
    result["note"] = "Logs obtidos com gh CLI."

    for run in runs:
        if run.get("conclusion") not in {"failure", "cancelled", "timed_out", None} and run.get("status") != "completed":
            continue
        run_id = str(run.get("databaseId"))
        zip_file = logs_dir / f"run_{run_id}.zip"
        target_dir = logs_dir / f"run_{run_id}"
        target_dir.mkdir(exist_ok=True)

        download = run_command([gh_path, "run", "download", run_id, "--dir", str(target_dir)], cwd=repo, timeout=240)
        entry = {
            "run_id": run_id,
            "workflow": run.get("workflowName"),
            "title": run.get("displayTitle"),
            "status": run.get("status"),
            "conclusion": run.get("conclusion"),
            "download_returncode": download["returncode"],
            "download_stderr": download["stderr"],
            "download_dir": str(target_dir),
            "error_snippets": [],
        }

        if download["returncode"] == 0:
            for path in target_dir.rglob("*.txt"):
                content = read_text(path)
                snippets = extract_error_lines(content, max_lines=25)
                if snippets:
                    entry["error_snippets"].append({"file": str(path), "snippets": snippets})
                    for snippet in snippets:
                        result["errors"].append({
                            "run_id": run_id,
                            "workflow": run.get("workflowName"),
                            "file": str(path),
                            "snippet": snippet,
                        })
        result["logs"].append(entry)
        if verbose:
            print(f"[gh] processado run {run_id}: {run.get('workflowName')}")

    return result


def analyze_local_commands(repo: Path, verbose: bool) -> List[Dict[str, Any]]:
    commands = infer_local_commands(repo)
    results = []
    for cmd in commands:
        if verbose:
            print(f"[local] executando: {' '.join(cmd)}")
        res = run_command(cmd, cwd=repo)
        res["error_snippets"] = extract_error_lines((res.get("stdout") or "") + "\n" + (res.get("stderr") or ""), max_lines=20)
        results.append(res)
    return results


def scan_repo_files(repo: Path) -> Dict[str, Any]:
    suspects = []
    interesting_files = []
    patterns = [
        ".github/workflows",
        "package.json",
        "pyproject.toml",
        "requirements.txt",
        "Dockerfile",
        "next.config",
        "tsconfig",
        "prisma",
    ]
    for root, _, files in os.walk(repo):
        root_path = Path(root)
        root_str = str(root_path).replace("\\", "/")
        if any(skip in root_str for skip in ["node_modules", ".git", ".next", "dist", "build", "coverage"]):
            continue
        for file in files:
            p = root_path / file
            rel = p.relative_to(repo)
            rel_str = str(rel).replace("\\", "/")
            if any(token in rel_str for token in patterns):
                interesting_files.append(rel_str)
            if file.endswith((".log", ".txt")):
                content = read_text(p)
                snippets = extract_error_lines(content, max_lines=5)
                if snippets:
                    suspects.append({"file": rel_str, "snippets": snippets})
    return {"interesting_files": sorted(set(interesting_files)), "suspect_logs": suspects}


def build_markdown_report(data: Dict[str, Any]) -> str:
    lines: List[str] = []
    lines.append("# Relatório de diagnóstico do repositório")
    lines.append("")
    lines.append(f"Repositório analisado: `{data['repo']}`")
    lines.append("")

    lines.append("## 1. Workflows encontrados")
    for wf in data.get("workflows", []):
        lines.append(f"- **{wf.get('name') or Path(wf.get('file', '')).name}** — `{wf.get('file')}`")
        for job in wf.get("jobs", []):
            lines.append(f"  - Job: `{job.get('job_name')}`")
            for step in job.get("steps", []):
                step_desc = step.get("name") or step.get("uses") or "step sem nome"
                if step.get("run"):
                    step_desc += f" | run: `{step.get('run')[:120].replace(chr(10), ' ')}`"
                lines.append(f"    - {step_desc}")
    lines.append("")

    lines.append("## 2. Comandos locais executados")
    for item in data.get("local_command_results", []):
        cmd = " ".join(item.get("cmd", []))
        lines.append(f"- `{cmd}` => exit code **{item.get('returncode')}**")
        for snip in item.get("error_snippets", [])[:5]:
            lines.append("```text")
            lines.append(snip[:3000])
            lines.append("```")
    lines.append("")

    gh = data.get("github_logs", {})
    lines.append("## 3. GitHub Actions")
    lines.append(f"- Coleta de logs habilitada: **{gh.get('enabled')}**")
    lines.append(f"- Observação: {gh.get('note')}\n")
    for err in gh.get("errors", [])[:30]:
        lines.append(f"### Run {err.get('run_id')} — {err.get('workflow')}")
        lines.append(f"Arquivo: `{err.get('file')}`")
        lines.append("```text")
        lines.append(err.get("snippet", "")[:3500])
        lines.append("```")
    lines.append("")

    repo_scan = data.get("repo_scan", {})
    lines.append("## 4. Arquivos relevantes detectados")
    for f in repo_scan.get("interesting_files", [])[:200]:
        lines.append(f"- `{f}`")
    lines.append("")

    lines.append("## 5. Suspeitas encontradas em logs locais")
    for s in repo_scan.get("suspect_logs", [])[:20]:
        lines.append(f"- `{s.get('file')}`")
        for snip in s.get("snippets", [])[:3]:
            lines.append("```text")
            lines.append(snip[:2000])
            lines.append("```")
    lines.append("")

    lines.append("## 6. Próximos passos")
    lines.append("- Compare os erros de `relatorio_final.md` com os jobs do GitHub Actions.")
    lines.append("- Rode novamente o script após cada correção para validar regressões.")
    lines.append("- Se o `gh` estiver autenticado, o cruzamento com erros reais da Actions fica muito mais preciso.")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Diagnóstico local + GitHub Actions para repositórios")
    parser.add_argument("--repo", required=True, help="Caminho do repositório")
    parser.add_argument("--output", required=True, help="Diretório de saída")
    parser.add_argument("--max-runs", type=int, default=5, help="Número máximo de runs para baixar do GHA")
    parser.add_argument("--skip-github-logs", action="store_true", help="Não tenta baixar logs do GitHub Actions")
    parser.add_argument("--verbose", action="store_true", help="Modo verboso")
    args = parser.parse_args()

    repo = Path(args.repo).resolve()
    output = Path(args.output).resolve()
    output.mkdir(parents=True, exist_ok=True)

    if not repo.exists():
        print(f"Repositório não encontrado: {repo}", file=sys.stderr)
        return 1

    if yaml is None:
        print("Aviso: pyyaml não está disponível. A leitura dos workflows será limitada.")

    workflows = load_workflows(repo)
    workflow_commands = extract_commands_from_workflows(workflows)
    local_results = analyze_local_commands(repo, args.verbose)
    repo_scan = scan_repo_files(repo)
    gh_logs = {"enabled": False, "logs": [], "errors": [], "note": "Coleta pulada pelo usuário."}

    if not args.skip_github_logs:
        gh_logs = maybe_fetch_github_logs(repo, output, args.max_runs, args.verbose)

    result = {
        "repo": str(repo),
        "workflows": workflows,
        "workflow_commands": workflow_commands,
        "local_command_results": local_results,
        "repo_scan": repo_scan,
        "github_logs": gh_logs,
    }

    json_path = output / "resultado.json"
    json_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

    md_path = output / "relatorio_final.md"
    md_path.write_text(build_markdown_report(result), encoding="utf-8")

    print(f"Relatório salvo em: {md_path}")
    print(f"JSON salvo em: {json_path}")

    failing = [r for r in local_results if r.get("returncode") != 0]
    if failing:
        print(f"Comandos locais com falha: {len(failing)}")
        for item in failing:
            print(f"- {' '.join(item.get('cmd', []))} => {item.get('returncode')}")
    else:
        print("Nenhum comando local inferido falhou.")

    if gh_logs.get("errors"):
        print(f"Erros detectados nos logs do GitHub Actions: {len(gh_logs['errors'])}")
    else:
        print(f"Sem erros extraídos dos logs do GitHub Actions. Observação: {gh_logs.get('note')}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
