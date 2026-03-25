#!/usr/bin/env bash
set -euo pipefail

pnpm install --frozen-lockfile
pnpm lint:core
pnpm test:core
pytest tests/integration
