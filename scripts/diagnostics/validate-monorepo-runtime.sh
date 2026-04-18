#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "[info] Monorepo runtime validation started at $(date -u +%Y-%m-%dT%H:%M:%SZ)"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "[error] pnpm not found in PATH"
  exit 1
fi

echo "[info] node=$(node -v) pnpm=$(pnpm -v)"

# Etapa 1 — ambiente limpo
python - <<'PY'
import os
import shutil

for path in ["node_modules", "dist", ".turbo"]:
    if os.path.exists(path):
        shutil.rmtree(path)

for dirpath, dirnames, _ in os.walk('.'):
    if 'node_modules' in dirnames:
        shutil.rmtree(os.path.join(dirpath, 'node_modules'))
        dirnames.remove('node_modules')

print('[ok] cleanup_done')
PY

pnpm store prune

# Etapa 2 — install real
pnpm install

# Etapa 3 — Prisma hard check
pnpm --filter @birthub/database prisma generate

# Etapa 4 — Build full real
pnpm -r build

# Etapa 5 — Typecheck global
pnpm typecheck

# Etapa 6 — Testes reais
pnpm test

echo "[ok] INSTALL: OK"
echo "[ok] BUILD: OK"
echo "[ok] TYPECHECK: OK"
echo "[ok] TESTS: OK"
echo "[ok] RUNTIME: VALIDADO"
echo "[ok] MONOREPO: PRODUCAO READY"
