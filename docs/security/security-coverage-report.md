# Security Coverage Report

- generatedAt: 2026-04-18T05:24:36.797Z
- overall_status: pass
- dast_target_strategy: local-web-login-route
- dast_target_url: `http://127.0.0.1:3001/login`

## Checks

| Check | Status | Artifact | Description |
| --- | --- | --- | --- |
| semgrep | success | `artifacts/security/semgrep-head.json` | Semgrep baseline for TypeScript and Express surfaces. |
| dependency audit | success | - | High-severity npm audit gate. |
| python security | success | - | Bandit, pip-audit and Safety lane for Python surfaces. |
| RBAC suite | success | - | RBAC regression suite on critical API endpoints. |
| ZAP baseline | success | `artifacts/security/zap` | OWASP ZAP baseline against the canonical local web login route. |

## Modules

| Module | Checks |
| --- | --- |
| auth | login/logout/session rotation + MFA challenge tests |
| rbac | role matrix on critical endpoints |
| api-keys | introspection + scoped auth guards |
| web | CSP report-only, origin checks, CSRF double-submit |
| worker | signed payload verification + tenant context checks |
