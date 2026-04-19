<#
.SYNOPSIS
  Corrige os 67 itens de multi-tenancy já embutidos no script, sem ler HTML.

.DESCRIPTION
  Script PowerShell único que invoca Python embutido e processa diretamente
  os 67 pontos já consolidados por arquivo + linha.
#>

[CmdletBinding()]
param(
    [string]$RepoPath = "C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION",
    [string]$OutputDir = "C:\Users\Marks\Desktop\20 DIVIDAS TECNICAS",
    [string]$TenantField = "organizationId",
    [string]$TenantExpr = "tenantContext.organizationId",
    [switch]$DryRun,
    [switch]$NoBackup,
    [switch]$RunValidation
)

$ErrorActionPreference = "Stop"

function Resolve-Python {
    foreach ($cmd in @("python","py")) {
        $found = Get-Command $cmd -ErrorAction SilentlyContinue
        if ($found) { return $cmd }
    }
    throw "Python não encontrado no PATH."
}

if (-not (Test-Path $RepoPath)) {
    throw "Repositório não encontrado: $RepoPath"
}

if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

$LogFile = Join-Path $OutputDir "execution-log.txt"
$PyFile = Join-Path $env:TEMP ("fix_multitenancy_embedded_" + [guid]::NewGuid().ToString() + ".py")
$ItemsFile = Join-Path $env:TEMP ("fix_multitenancy_embedded_" + [guid]::NewGuid().ToString() + ".json")

@'
[
  {
    "file": "apps/api/src/modules/agents/service.repository.ts",
    "line": 108,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/analytics/dashboard.service.ts",
    "line": 74,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/analytics/dashboard.service.ts",
    "line": 139,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/analytics/dashboard.service.ts",
    "line": 144,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/analytics/reporting.service.ts",
    "line": 11,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/analytics/reporting.service.ts",
    "line": 96,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/analytics/reporting.service.ts",
    "line": 138,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/analytics/reporting.service.ts",
    "line": 189,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/analytics/reporting.service.ts",
    "line": 216,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/auth/auth.service.credentials.ts",
    "line": 162,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/auth/auth.service.credentials.ts",
    "line": 176,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/auth/auth.service.credentials.ts",
    "line": 202,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/auth/auth.service.credentials.ts",
    "line": 227,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/auth/auth.service.credentials.ts",
    "line": 336,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/auth/auth.service.keys.ts",
    "line": 55,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/auth/auth.service.keys.ts",
    "line": 157,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/auth/auth.service.policies.ts",
    "line": 59,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/auth/auth.service.sessions.ts",
    "line": 40,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/auth/auth.service.sessions.ts",
    "line": 67,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/auth/auth.service.sessions.ts",
    "line": 262,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/auth/auth.service.sessions.ts",
    "line": 269,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/auth/auth.service.sessions.ts",
    "line": 365,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/auth/auth.service.ts",
    "line": 154,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/auth/auth.service.ts",
    "line": 164,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/billing/service.checkout.customer.ts",
    "line": 148,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/billing/service.checkout.ts",
    "line": 39,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/billing/service.checkout.ts",
    "line": 180,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/billing/service.checkout.ts",
    "line": 205,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/billing/service.checkout.ts",
    "line": 268,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/billing/service.snapshot.ts",
    "line": 173,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/budget/budget.service.ts",
    "line": 393,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/connectors/service.shared.ts",
    "line": 226,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/connectors/service.ts",
    "line": 25,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/conversations/service.ts",
    "line": 34,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/conversations/service.ts",
    "line": 112,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/dashboard/service.shared.ts",
    "line": 246,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/dashboard/service.shared.ts",
    "line": 262,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/feedback/service.ts",
    "line": 87,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/invites/service.ts",
    "line": 69,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/invites/service.ts",
    "line": 213,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/marketplace/marketplace-service.ts",
    "line": 147,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/outputs/output.service.ts",
    "line": 108,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/outputs/output.service.ts",
    "line": 135,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/outputs/output.service.ts",
    "line": 220,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/outputs/output.service.ts",
    "line": 228,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/packs/pack-installer.service.ts",
    "line": 135,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/privacy/retention.service.ts",
    "line": 99,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/privacy/retention.service.ts",
    "line": 102,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/privacy/retention.service.ts",
    "line": 120,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/privacy/retention.service.ts",
    "line": 123,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/privacy/retention.service.ts",
    "line": 135,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/privacy/retention.service.ts",
    "line": 138,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/privacy/retention.service.ts",
    "line": 159,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/privacy/service.ts",
    "line": 37,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/privacy/service.ts",
    "line": 246,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/search/service.ts",
    "line": 112,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/search/service.ts",
    "line": 141,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/search/service.ts",
    "line": 177,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/search/service.ts",
    "line": 196,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/webhooks/settings.service.ts",
    "line": 35,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/workflows/service.execution.ts",
    "line": 34,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/workflows/service.lifecycle.ts",
    "line": 34,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/workflows/service.lifecycle.ts",
    "line": 66,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/workflows/service.lifecycle.ts",
    "line": 320,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/workflows/service.shared.ts",
    "line": 82,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/workflows/service.shared.ts",
    "line": 122,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  },
  {
    "file": "apps/api/src/modules/workflows/service.shared.ts",
    "line": 160,
    "issue": "Query Prisma sem filtro explícito de tenant/organization/company no bloco analisado."
  }
]
'@ | Set-Content -Path $ItemsFile -Encoding UTF8

$Py = @'
from pathlib import Path
import re, json, shutil
from collections import defaultdict
from datetime import datetime

REPO_PATH = Path(r"__REPO_PATH__")
OUTPUT_DIR = Path(r"__OUTPUT_DIR__")
ITEMS_FILE = Path(r"__ITEMS_FILE__")
TENANT_FIELD = "__TENANT_FIELD__"
TENANT_EXPR = "__TENANT_EXPR__"
DRY_RUN = "__DRY_RUN__" == "1"
NO_BACKUP = "__NO_BACKUP__" == "1"

LOG_FILE = OUTPUT_DIR / "execution-log.txt"
REPORT_FILE = OUTPUT_DIR / "multitenancy_patch_report.json"
SUMMARY_FILE = OUTPUT_DIR / "multitenancy_patch_summary.md"
BACKUP_DIR = OUTPUT_DIR / "backups-multitenancy"

PRISMA_METHODS = ("findMany","findFirst","findUnique","findUniqueOrThrow","count","updateMany","deleteMany","aggregate","groupBy","upsert","update","delete")

def log(msg):
    stamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{stamp}] {msg}"
    print(line)
    with LOG_FILE.open("a", encoding="utf-8") as f:
        f.write(line + "\\n")

def read_text(path):
    return path.read_text(encoding="utf-8", errors="ignore")

def write_text(path, content):
    path.write_text(content, encoding="utf-8", newline="")

def line_index(lines, line_no):
    return max(0, min(len(lines)-1, line_no-1))

def expand_call(lines, start_idx):
    tail = "".join(lines[start_idx:])
    depth = 0
    seen = False
    consumed = 0
    for ch in tail:
        consumed += 1
        if ch == "(":
            depth += 1
            seen = True
        elif ch == ")":
            depth -= 1
            if seen and depth == 0:
                break
    if consumed <= 0:
        return None
    text = tail[:consumed]
    end_idx = start_idx + text.count("\\n")
    return {"start_idx": start_idx, "end_idx": min(end_idx, len(lines)-1), "text": text}

def find_call(lines, target_line):
    idx = line_index(lines, target_line)
    pat = re.compile(r"prisma\\.[A-Za-z0-9_]+\\.(%s)\\s*\\(" % "|".join(PRISMA_METHODS))
    for i in range(idx, max(-1, idx-50), -1):
        if pat.search(lines[i]):
            return expand_call(lines, i)
    for i in range(idx, min(len(lines), idx+80)):
        if pat.search(lines[i]):
            return expand_call(lines, i)
    return None

def has_tenant(call_text):
    pats = [
        rf"\\b{re.escape(TENANT_FIELD)}\\s*:",
        r"\\btenantId\\s*:",
        r"\\borganizationId\\s*:",
        r"\\bcompanyId\\s*:",
        r"\\bworkspaceId\\s*:",
        r"\\baccountId\\s*:",
    ]
    return any(re.search(p, call_text) for p in pats)

def patch_call(call_text):
    if has_tenant(call_text):
        return call_text, False, "já possui filtro"

    m = re.search(r"where\\s*:\\s*\\{", call_text)
    if m:
        pos = m.end()
        return call_text[:pos] + f"\\n      {TENANT_FIELD}: {TENANT_EXPR}," + call_text[pos:], True, "tenant inserido em where"

    m = re.search(r"(\\(\\s*\\{)", call_text)
    if m:
        pos = m.end()
        return call_text[:pos] + f"\\n    where: { {TENANT_FIELD}: {TENANT_EXPR} }," + call_text[pos:], True, "where criado"

    return call_text, False, "não foi possível localizar args"

def backup(path):
    if NO_BACKUP:
        return None
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    rel = path.relative_to(REPO_PATH)
    dest = BACKUP_DIR / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, dest)
    return dest

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    items = json.loads(read_text(ITEMS_FILE))
    by_file = defaultdict(list)
    for item in items:
        by_file[item["file"]].append(item)

    report = {
        "timestamp": datetime.now().isoformat(),
        "repo_path": str(REPO_PATH),
        "tenant_field": TENANT_FIELD,
        "tenant_expr": TENANT_EXPR,
        "dry_run": DRY_RUN,
        "total_items": len(items),
        "files": []
    }

    total_patches = 0
    total_files = 0

    log("=" * 80)
    log("INÍCIO: correção consolidada dos 67 itens")
    log(f"Repo: {REPO_PATH}")
    log(f"TenantField: {TENANT_FIELD}")
    log(f"TenantExpr: {TENANT_EXPR}")
    log(f"DryRun: {DRY_RUN}")
    log("=" * 80)

    for rel_file, file_items in sorted(by_file.items()):
        abs_file = REPO_PATH / rel_file
        frep = {"file": rel_file, "exists": abs_file.exists(), "changed": False, "items": []}

        if not abs_file.exists():
            log(f"AUSENTE: {rel_file}")
            for item in file_items:
                frep["items"].append({"line": item["line"], "status": "arquivo não encontrado"})
            report["files"].append(frep)
            continue

        original = read_text(abs_file)
        working = original
        changed = False
        backed_up = False

        for item in sorted(file_items, key=lambda x: x["line"]):
            lines = working.splitlines(keepends=True)
            call = find_call(lines, item["line"])
            if not call:
                status = "query Prisma não localizada"
                log(f"SKIP {rel_file}:{item['line']} -> {status}")
                frep["items"].append({"line": item["line"], "status": status})
                continue

            new_text, did_change, reason = patch_call(call["text"])
            if did_change:
                if not backed_up and not DRY_RUN:
                    backup(abs_file)
                    backed_up = True
                rebuilt = "".join(lines[:call["start_idx"]]) + new_text + "".join(lines[call["end_idx"]+1:])
                working = rebuilt
                changed = True
                total_patches += 1
                status = f"corrigido ({reason})"
                log(f"PATCH {rel_file}:{item['line']} -> {status}")
            else:
                status = f"sem alteração ({reason})"
                log(f"NOOP  {rel_file}:{item['line']} -> {status}")

            frep["items"].append({"line": item["line"], "status": status})

        if changed:
            frep["changed"] = True
            total_files += 1
            if not DRY_RUN:
                write_text(abs_file, working)

        report["files"].append(frep)

    REPORT_FILE.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    changed_files = [f for f in report["files"] if f["changed"]]
    summary = []
    summary.append("# Resumo da execução")
    summary.append("")
    summary.append(f"- Itens consolidados: **{report['total_items']}**")
    summary.append(f"- Arquivos alterados: **{len(changed_files)}**")
    summary.append(f"- Patches aplicados: **{total_patches}**")
    summary.append(f"- DryRun: **{DRY_RUN}**")
    summary.append("")
    summary.append("## Arquivos alterados")
    for f in changed_files:
        summary.append(f"- `{f['file']}`")
    SUMMARY_FILE.write_text("\\n".join(summary), encoding="utf-8")

    log("=" * 80)
    log(f"FIM: arquivos alterados={len(changed_files)} | patches={total_patches}")
    log(f"Report: {REPORT_FILE}")
    log(f"Summary: {SUMMARY_FILE}")
    log("=" * 80)

if __name__ == "__main__":
    main()
'@

$Py = $Py.Replace("__REPO_PATH__", ($RepoPath -replace "\\","\\"))
$Py = $Py.Replace("__OUTPUT_DIR__", ($OutputDir -replace "\\","\\"))
$Py = $Py.Replace("__ITEMS_FILE__", ($ItemsFile -replace "\\","\\"))
$Py = $Py.Replace("__TENANT_FIELD__", $TenantField)
$Py = $Py.Replace("__TENANT_EXPR__", $TenantExpr)
$Py = $Py.Replace("__DRY_RUN__", $(if ($DryRun) { "1" } else { "0" }))
$Py = $Py.Replace("__NO_BACKUP__", $(if ($NoBackup) { "1" } else { "0" }))

Set-Content -Path $PyFile -Value $Py -Encoding UTF8

$pythonCmd = Resolve-Python

try {
    & $pythonCmd $PyFile
    if ($LASTEXITCODE -ne 0) {
        throw "Python retornou código $LASTEXITCODE"
    }

    if ($RunValidation -and -not $DryRun) {
        Push-Location $RepoPath
        try {
            "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Executando npm run lint" | Tee-Object -FilePath $LogFile -Append
            cmd /c "npm run lint" | Tee-Object -FilePath $LogFile -Append
            "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Executando npm test" | Tee-Object -FilePath $LogFile -Append
            cmd /c "npm test" | Tee-Object -FilePath $LogFile -Append
        }
        finally {
            Pop-Location
        }
    }
}
finally {
    if (Test-Path $PyFile) { Remove-Item $PyFile -Force -ErrorAction SilentlyContinue }
    if (Test-Path $ItemsFile) { Remove-Item $ItemsFile -Force -ErrorAction SilentlyContinue }
}

Write-Host ""
Write-Host "Concluído."
Write-Host "Saídas:"
Write-Host " - $LogFile"
Write-Host " - $(Join-Path $OutputDir 'multitenancy_patch_report.json')"
Write-Host " - $(Join-Path $OutputDir 'multitenancy_patch_summary.md')"
Write-Host " - $(Join-Path $OutputDir 'backups-multitenancy')"
