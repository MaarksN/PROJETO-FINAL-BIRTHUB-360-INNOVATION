# Security Gap & Hardening Report - Cycle 2

## Scope
- `packages/security`

## Actions Taken
- Removed all `@ts-nocheck` directives.
- Mitigated ReDoS (Regular Expression Denial of Service) vulnerabilities by switching capturing groups to non-capturing groups in the `SecretScanner` regexes (e.g. `(?:RSA|EC|OPENSSH)`).
- Fixed floating promise errors in `security.test.ts` to ensure assertions actually await execution.

## Validation
- `pnpm --filter @birthub/security run typecheck`: **PASS**
- `pnpm --filter @birthub/security run lint`: **PASS**
- `pnpm --filter @birthub/security run test`: **PASS** (5/5 tests pass).

## Structural vs Functional Status
- **Functional:** Basic string sanitization, content security policy compilation, and naive regex-based secret scanning.
- **Structural Gaps:** Missing robust token validation (e.g., JWT asymmetric signature verification routines), missing strict RBAC guards decoupled from the database, and lack of PII masking logic for logging interfaces.

## Recommended Objective Backlog
1. Implement asymmetric JWT validation guards independent of database lookup.
2. Introduce a dedicated `PIIMasker` stream transform for `@birthub/logger` to obscure CPF/CNPJ/Credit Card automatically.
3. Migrate `SecretScanner` from naive regex to entropy-based detection or integrate a robust upstream tool (like TruffleHog wrappers).
