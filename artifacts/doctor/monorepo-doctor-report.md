# Monorepo Doctor Report

Generated at: 2026-03-17T15:31:13.708Z
Scope: canonical go-live gate = apps/web + apps/api + apps/worker + packages/database

## Critical findings
- none

## Warnings
- Legacy quarantine still active for @birthub/db in: apps/dashboard/src/components/kanban-board.tsx, apps/dashboard/src/lib/data.ts
- Potential duplicate directories in agents (posvenda): pos-venda, pos_venda