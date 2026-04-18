# CICLO 1 — LIMPEZA CIRÚRGICA, ISOLAMENTO E SANITIZAÇÃO DO RUNTIME

## T1.0 — Preparação de Estrutura Operacional
- Estruturas validadas/criadas: `.ops/quarantine`, `.ops/evidence/cycle1`, `.ops/logs`.

## Gate de entrada
- OK .ops/snapshots/snapshot.json
- OK .ops/analysis/core-vs-noise-matrix.json
- OK .ops/analysis/build-runtime-map.json
- OK .ops/inventory/scripts-map.json

## T1.1 — Quarentena de ruído fora do core
- APROVADO: `very_final.js` -> `.ops/quarantine/runtime-noise/root-files/very_final.js` | refs_runtime=0
- APROVADO: `very_final.mjs` -> `.ops/quarantine/runtime-noise/root-files/very_final.mjs` | refs_runtime=0
- APROVADO: `very_final2.mjs` -> `.ops/quarantine/runtime-noise/root-files/very_final2.mjs` | refs_runtime=0
- APROVADO: `fix_final.ts` -> `.ops/quarantine/runtime-noise/root-files/fix_final.ts` | refs_runtime=0
- APROVADO: `fix_final.mjs` -> `.ops/quarantine/runtime-noise/root-files/fix_final.mjs` | refs_runtime=0
- APROVADO: `fix_file.js` -> `.ops/quarantine/runtime-noise/root-files/fix_file.js` | refs_runtime=0
- APROVADO: `use_any.js` -> `.ops/quarantine/runtime-noise/root-files/use_any.js` | refs_runtime=0
- APROVADO: `make_factory_properly_finally.mjs` -> `.ops/quarantine/runtime-noise/root-files/make_factory_properly_finally.mjs` | refs_runtime=0
- APROVADO: `fix-turbopack-root-only.py` -> `.ops/quarantine/runtime-noise/root-files/fix-turbopack-root-only.py` | refs_runtime=0
- APROVADO: `auditoria birthub 360.html` -> `.ops/quarantine/runtime-noise/root-files/auditoria birthub 360.html` | refs_runtime=0

## T1.2 — Rollback obrigatório
- Script reversível criado em `.ops/quarantine/rollback-cycle1.sh`.
- Manifesto de rastreabilidade criado em `.ops/quarantine/manifest.cycle1.json`.

## T1.3 — Verificações pós-movimento
- Core canônico não foi movido nem alterado (apps/api, apps/web, apps/worker, packages/config, packages/database, packages/logger).
- Não houve alteração funcional de API/domínio.

## Veredito do Ciclo 1 (parcial)
- Status: `APTO COM RESTRIÇÕES` (isolação de ruído aplicada; demais hardenings dependem de fases subsequentes).
