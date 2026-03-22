# F11 Residual Risk Register - 2026-03-22

| ID | Residual risk | Severity | Owner | Target date | Current evidence |
| --- | --- | --- | --- | --- | --- |
| F11-R1 | PRR, on-call, monitoring, status page and incident drill remain documented but not revalidated live in this session. | High | SRE / Security | 2026-03-31 | `docs/release/2026-03-20-go-live-runbook.md`, `docs/runbooks/critical-incidents.md` |
| F11-R2 | Final signatures from Security Owner, domain owners and leadership are still absent from this workspace. | High | Engineering Leadership | 2026-03-31 | `docs/release/gate_signatures_audit.md` |
| F11-R3 | Branch/remoto CI execution of the reconciled gates still needs explicit PR evidence for this closure package. | Medium | Platform Engineering | 2026-03-31 | `.github/workflows/ci.yml`, `.github/workflows/materialize-doc-only.yml` |
