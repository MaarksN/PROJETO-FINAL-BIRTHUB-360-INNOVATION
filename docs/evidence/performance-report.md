# Performance Report

- Generated at: 2026-03-22T14:47:53.507Z
- Acceptance target: p99 <= 500ms for critical API paths

## Collected Artifacts

- K6 load test: pending (artifacts\performance\k6\cycle-08-stress-summary.txt)
- Worker overload summary: pending (artifacts\performance\worker-overload.json)
- Database baseline: pending (artifacts\performance\database-baseline.json)

## Execution Sources

- Load test runner: scripts/load-tests/stress.js
- Worker overload runner: scripts/load-tests/worker-overload.ts
- Database baseline source: apps/api/test/performance.test.ts

## Notes

- Chaos, resilience and soak lanes are environment-backed and should publish into artifacts/performance during release candidate validation.
- This report intentionally stays file-backed so each RC can attach raw evidence alongside the markdown summary.
