# Security Coverage Report

- generatedAt: 2026-03-23T02:16:12.650Z
- semgrep: completed-local
- dependency_scan: completed-local
- rbac_suite: completed-local
- zap_baseline: not-run-local

## Modules

| Module | Checks |
| --- | --- |
| auth | login/logout/session rotation + MFA challenge tests |
| rbac | role matrix on critical endpoints |
| api-keys | introspection + scoped auth guards |
| web | CSP report-only, origin checks, CSRF double-submit |
| worker | signed payload verification + tenant context checks |
