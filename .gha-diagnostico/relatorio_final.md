# Relatório de diagnóstico do repositório

Repositório analisado: `C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION`

## 1. Workflows encontrados
- **Agent Packs Conformity** — `C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\.github\workflows\agents-conformity.yml`
  - Job: `validate-agent-packs`
    - Checkout
    - Setup pnpm
    - Setup Node
    - Install dependencies | run: `corepack pnpm install --frozen-lockfile`
    - Validate generated collection | run: `corepack pnpm --filter @birthub/agent-packs validate`
    - Test generated collection | run: `corepack pnpm --filter @birthub/agent-packs test`
    - Upload generated collection evidence
- **Cleanup Merged Branches** — `C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\.github\workflows\branch-cleanup.yml`
  - Job: `cleanup_branch`
    - Delete Branch
- **CD** — `C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\.github\workflows\cd.yml`
  - Job: `resolve-release-source`
    - Resolve immutable release source | run: `set -euo pipefail  event_name="${GITHUB_EVENT_NAME}" source_event="${event_name}"  if [[ "${event_name}" == "workflow_ru`
  - Job: `staging-preflight`
    - Checkout source from CI run
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Mask configured secrets | run: `set -euo pipefail for key in AUTH_MFA_ENCRYPTION_KEY DATABASE_URL JOB_HMAC_GLOBAL_SECRET REDIS_URL RENDER_STAGING_DEPLOY`
    - Validate required staging configuration | run: `set -euo pipefail  required_secrets=(   RENDER_STAGING_DEPLOY_HOOK_URL   DATABASE_URL   REDIS_URL   SESSION_SECRET   JOB`
    - Run staging preflight | run: `pnpm release:preflight:staging`
    - Upload staging preflight evidence
  - Job: `release-sbom`
    - Checkout immutable release source
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Generate CycloneDX SBOM | run: `pnpm release:sbom`
    - Materialize release bundle manifests | run: `set -euo pipefail pnpm release:materialize -- \   --tag=v1.0.0 \   --source-event="${{ needs.resolve-release-source.outp`
    - Upload SBOM artifact
    - Upload release manifests
  - Job: `production-preflight`
    - Checkout immutable release source
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Mask configured secrets | run: `set -euo pipefail for key in AUTH_MFA_ENCRYPTION_KEY DATABASE_URL JOB_HMAC_GLOBAL_SECRET REDIS_URL RENDER_PRODUCTION_DEP`
    - Validate required production configuration | run: `set -euo pipefail  required_secrets=(   RENDER_PRODUCTION_DEPLOY_HOOK_URL   DATABASE_URL   REDIS_URL   SESSION_SECRET   `
    - Run production preflight | run: `pnpm release:preflight:production`
    - Upload production preflight evidence
  - Job: `build-staging-images`
    - Checkout immutable release source
    - Authenticate to Google Cloud
    - Setup gcloud
    - Setup Docker Buildx
    - Compute image refs | run: `set -euo pipefail SHORT_SHA="${{ needs.resolve-release-source.outputs.source_sha }}" SHORT_SHA="${SHORT_SHA:0:12}" REGIS`
    - Configure Artifact Registry auth | run: `gcloud auth configure-docker "${{ vars.GCP_ARTIFACT_REGISTRY_REGION }}-docker.pkg.dev" --quiet`
    - Build and push API image | run: `docker build -f apps/api/Dockerfile -t "${{ steps.refs.outputs.api_image }}" . docker push "${{ steps.refs.outputs.api_i`
    - Build and push Web image | run: `docker build -f apps/web/Dockerfile -t "${{ steps.refs.outputs.web_image }}" . docker push "${{ steps.refs.outputs.web_i`
    - Build and push Worker image | run: `docker build -f apps/worker/Dockerfile -t "${{ steps.refs.outputs.worker_image }}" . docker push "${{ steps.refs.outputs`
  - Job: `deploy-staging`
    - Authenticate to Google Cloud
    - Setup gcloud
    - Deploy staging revisions | run: `set -euo pipefail REGION="${{ vars.CLOUD_RUN_REGION }}" mkdir -p artifacts/release : > artifacts/release/staging-rollout`
    - Upload staging rollout manifest
  - Job: `backup-health-gate`
    - Checkout immutable release source
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Run backup health gate | run: `pnpm ops:backup:health`
    - Upload backup health evidence
  - Job: `release-smoke-gate`
    - Checkout immutable release source
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Run release smoke gate | run: `pnpm release:smoke`
    - Upload smoke evidence
  - Job: `release-e2e-gate`
    - Checkout immutable release source
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Run release E2E gate | run: `pnpm test:e2e:release`
    - Upload E2E evidence
  - Job: `rollback-rehearsal-evidence-gate`
    - Checkout immutable release source
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Download production preflight evidence
    - Download smoke evidence
    - Download release manifests
    - Download release SBOM
    - Materialize rollback rehearsal evidence | run: `pnpm release:rollback:evidence:auto -- --target=production`
    - Upload rollback rehearsal evidence
  - Job: `dr-readiness-gate`
    - Checkout immutable release source
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Download rollback rehearsal evidence
    - Download smoke evidence
    - Rebuild backup and DR readiness evidence | run: `set -euo pipefail pnpm ops:backup:health pnpm ops:dr:record:auto -- --environment=production --owner=platform-ops --scen`
    - Upload disaster recovery readiness evidence
  - Job: `deploy-production`
    - Guard production deployment branch | run: `set -euo pipefail if [[ "${GITHUB_REF}" != "refs/heads/main" ]]; then   echo "::error title=Invalid branch::Production d`
    - Mask deploy hook | run: `set -euo pipefail if [[ -n "${RENDER_PRODUCTION_DEPLOY_HOOK_URL:-}" ]]; then   echo "::add-mask::${RENDER_PRODUCTION_DEP`
    - Trigger Render deploy hook (production) | run: `set -euo pipefail  if [[ -z "${RENDER_PRODUCTION_DEPLOY_HOOK_URL:-}" ]]; then   echo "::error title=Missing secret::REND`
    - Generate deploy manifest | run: `mkdir -p artifacts/release cat > artifacts/release/deploy-manifest.json <<EOF {   "status": "deployed",   "timestamp": "`
    - Upload deploy manifest
- **CI** — `C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\.github\workflows\ci.yml`
  - Job: `branch-name`
  - Job: `commit-messages`
  - Job: `lockfile-integrity`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Enforce agent surface freeze | run: `node scripts/ci/check-agent-surface-freeze.mjs`
    - Enforce legacy DB surface freeze | run: `node scripts/ci/check-legacy-db-surface-freeze.mjs`
    - Enforce legacy runtime surface freeze | run: `node scripts/ci/check-legacy-runtime-surface-freeze.mjs`
    - Enforce active product capability alignment | run: `pnpm ci:active-product-capabilities`
    - Enforce default e2e surface freeze | run: `pnpm ci:default-e2e-surface-freeze`
    - Enforce web inline style freeze | run: `node scripts/ci/check-web-inline-style-freeze.mjs`
    - Enforce lockfile governance | run: `pnpm ci:lockfile`
  - Job: `lockfile-corruption-simulation`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Corrupt lockfile fixture | run: `set -euo pipefail cp pnpm-lock.yaml pnpm-lock.yaml.bak printf '\n__corrupted_lockfile_marker: [\n' >> pnpm-lock.yaml `
    - Assert frozen install fails on corrupted lockfile | run: `set +e pnpm install --frozen-lockfile > lockfile-corruption.log 2>&1 status=$? set -e  if [[ "${status}" -eq 0 ]]; then `
    - Restore lockfile | run: `mv pnpm-lock.yaml.bak pnpm-lock.yaml`
  - Job: `inline-credentials`
  - Job: `documentation-links`
  - Job: `repo-hygiene`
  - Job: `gitleaks`
    - Checkout
    - Run Gitleaks
  - Job: `security-guardrails`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Generate Prisma client | run: `pnpm db:generate`
    - Enforce security guardrails | run: `pnpm ci:security-guardrails`
  - Job: `platform`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Cache Turbo
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Generate Prisma client | run: `pnpm db:generate`
    - Bootstrap CI database | run: `pnpm db:bootstrap:ci`
    - Build | run: `pnpm ci:task build`
    - Typecheck | run: `pnpm ci:task typecheck`
    - Lint | run: `pnpm ci:task lint`
    - Test | run: `pnpm ci:task test`
    - Test isolation | run: `pnpm ci:task test:isolation`
  - Job: `satellites`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Setup Python
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Install Python test dependencies | run: `python -m pip install --upgrade pip python -m pip install -r requirements-test.txt -r apps/webhook-receiver/requirements`
    - Run satellites lane | run: `pnpm ci:task satellites`
  - Job: `workflow-suite`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Setup Python
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Generate Prisma client | run: `pnpm db:generate`
    - Bootstrap CI database | run: `pnpm db:bootstrap:ci`
    - Run workflow suite | run: `pnpm ci:task workflow-suite`
  - Job: `integration-db`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Generate Prisma client | run: `pnpm db:generate`
    - Run integration lane with real database | run: `pnpm test:integration`
  - Job: `coverage-quality`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Setup Python
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Install Python coverage dependencies | run: `python -m pip install --upgrade pip python -m pip install -r requirements-test.txt -r apps/webhook-receiver/requirements`
    - Generate Prisma client | run: `pnpm db:generate`
    - Bootstrap coverage database | run: `pnpm db:bootstrap:ci`
    - Enforce TypeScript coverage baseline | run: `pnpm coverage:check`
    - Enforce Python coverage baseline | run: `pnpm test:python:coverage`
    - Detect dead code | run: `pnpm quality:dead-code`
    - Upload coverage evidence
  - Job: `mutation-testing`
  - Job: `pack-tests`
  - Job: `governance-gates`
  - Job: `e2e-release`
  - Job: `ci`
    - Done | run: `echo "All required checks passed."`
- **Dependabot Security Auto-Merge** — `C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\.github\workflows\dependabot-auto-merge.yml`
  - Job: `auto-merge`
    - Fetch Dependabot metadata
    - Enable auto-merge for security patches | run: `gh pr merge --auto --squash "$PR_URL"`
- **Docker Image CI** — `C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\.github\workflows\docker-image.yml`
  - Job: `build`
    - actions/checkout@v4
    - Build the Docker image | run: `docker build . --file Dockerfile --tag my-image-name:$(date +%s)`
- **F4 Script Compliance** — `C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\.github\workflows\f4-script-compliance.yml`
  - Job: `workspace-compliance`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Run workspace audit | run: `pnpm workspace:audit`
    - Upload compliance artifacts
- **Materialize Doc-Only Controls** — `C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\.github\workflows\materialize-doc-only.yml`
  - Job: `materialize-doc-only`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Run technical materialization controls | run: `pnpm audit:materialize:all`
    - Upload materialization report
- **Release Rehearsal** — `C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\.github\workflows\release-rehearsal.yml`
  - Job: `cycle0-rehearsal`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Run recurring release rehearsal | run: `pnpm release:verify:cycle0`
    - Rebuild backup and DR readiness evidence | run: `set -euo pipefail pnpm ops:backup:health pnpm ops:dr:record:auto -- --environment=production --owner=platform-ops --scen`
    - Upload rehearsal artifacts
- **Repository Health** — `C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\.github\workflows\repository-health.yml`
  - Job: `repository-health`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Clean stale untracked artifacts | run: `pnpm artifacts:clean -- --apply`
    - Generate repository health report | run: `pnpm monorepo:doctor`
    - Upload doctor artifacts
- **Reusable Node Check** — `C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\.github\workflows\reusable-node-check.yml`
  - Job: `run`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Install Playwright browsers | run: `pnpm exec playwright install --with-deps chromium`
    - Prisma diagnostics | run: `node -e "const pkg=require('./packages/database/package.json'); console.log('prisma(dev):', pkg.devDependencies?.prisma `
    - Run command | run: `case "$WORKFLOW_COMMAND" in   "pnpm branch:check")     pnpm branch:check     ;;   "pnpm ci:commitlint")     pnpm ci:comm`
- **Security Scan** — `C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\.github\workflows\security-scan.yml`
  - Job: `semgrep`
    - Checkout
    - Run Semgrep
  - Job: `dependency-audit`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Audit dependencies | run: `pnpm audit --audit-level=high`
  - Job: `python-security`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Setup Python
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Install Python dependencies | run: `set -euo pipefail python -m pip install --upgrade pip python -m pip install -r requirements-test.txt bandit pip-audit "s`
    - Enforce Python workflow hard-fail policy | run: `python scripts/ci/check-python-workflow-hard-fail.py`
    - Run Bandit | run: `python -m bandit -q -r agents apps/webhook-receiver -x "*/tests/*" -lll`
    - Run pip-audit | run: `python -m pip_audit -r requirements-test.txt --ignore-vuln CVE-2026-4539`
    - Run Safety | run: `python -m safety check --full-report -r requirements-test.txt`
  - Job: `rbac-suite`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Generate Prisma client | run: `pnpm db:generate`
    - Run RBAC tests | run: `pnpm test:rbac`
  - Job: `zap-baseline`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Build canonical web target | run: `pnpm --filter @birthub/web build`
    - Start canonical web target | run: `set -euo pipefail mkdir -p artifacts/security/zap pnpm --filter @birthub/web start > artifacts/security/zap/web-server.l`
    - Wait for canonical web target | run: `set -euo pipefail target_url="http://127.0.0.1:3001/login" for attempt in {1..60}; do   if curl --silent --show-error --`
    - ZAP baseline scan | run: `set -euo pipefail mkdir -p artifacts/security/zap docker run --rm --network host \   -v "${PWD}/artifacts/security/zap:/`
    - Stop canonical web target | run: `set -euo pipefail if [[ -f artifacts/security/zap/web-server.pid ]]; then   pid="$(cat artifacts/security/zap/web-server`
    - Upload ZAP artifacts
  - Job: `security-report`
    - Checkout
    - Setup pnpm
    - Setup Node.js
    - Install dependencies | run: `pnpm install --frozen-lockfile`
    - Verify auth guards | run: `pnpm security:guards`
    - Generate security report | run: `pnpm security:report`
    - Upload security report

## 2. Comandos locais executados
- `pnpm lint` => exit code **127**
```text

Command not found: pnpm
```
- `pnpm typecheck` => exit code **127**
```text

Command not found: pnpm
```
- `pnpm test` => exit code **127**
```text

Command not found: pnpm
```
- `pnpm build` => exit code **127**
```text

Command not found: pnpm
```
- `C:\Users\Marks\AppData\Local\Python\pythoncore-3.14-64\python.exe -m pytest` => exit code **2**
```text

=================================== ERRORS ====================================
__ ERROR collecting tests/integration/test_agents_expanded_tools_realism.py ___
ImportError while importing test module 'C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\tests\integration\test_agents_expanded_tools_realism.py'.
Hint: make sure your test modules/packages have valid Python names.
```
```text
ImportError while importing test module 'C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\tests\integration\test_agents_expanded_tools_realism.py'.
Hint: make sure your test modules/packages have valid Python names.
Traceback:
tests\integration\test_agents_expanded_tools_realism.py:5: in <module>
    from agents.account_manager.tools import quantify_churn_exposure
```
```text
    from agents.account_manager.tools import quantify_churn_exposure
E   ModuleNotFoundError: No module named 'agents'
______ ERROR collecting tests/integration/test_internal_service_auth.py _______
ImportError while importing test module 'C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\tests\integration\test_internal_service_auth.py'.
Hint: make sure your test modules/packages have valid Python names.
```
```text
ImportError while importing test module 'C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\tests\integration\test_internal_service_auth.py'.
Hint: make sure your test modules/packages have valid Python names.
Traceback:
tests\integration\test_internal_service_auth.py:9: in <module>
    from agents.ae.main import app as ae_app
```
```text
    from agents.ae.main import app as ae_app
E   ModuleNotFoundError: No module named 'agents'
_ ERROR collecting tests/integration/test_internal_service_auth_additional_agents.py _
ImportError while importing test module 'C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\tests\integration\test_internal_service_auth_additional_agents.py'.
Hint: make sure your test modules/packages have valid Python names.
```

## 3. GitHub Actions
- Coleta de logs habilitada: **False**
- Observação: gh CLI encontrado, mas não autenticado. Rode: gh auth login


## 4. Arquivos relevantes detectados
- `.ops/inventory/tsconfig-map.json`
- `.tools/corepack-home/v1/pnpm/9.1.0/package.json`
- `apps/api/Dockerfile`
- `apps/api/package.json`
- `apps/api/src/common/cache/prisma-cache-invalidation.ts`
- `apps/api/src/common/cache/prisma-cache-invalidation.ts.bak`
- `apps/api/src/lib/prisma-json.ts`
- `apps/api/src/lib/prisma-json.ts.bak`
- `apps/api/src/lib/prisma-runtime.ts`
- `apps/api/src/lib/prisma-runtime.ts.bak`
- `apps/api/tests/prisma-cache-invalidation.test.d.ts`
- `apps/api/tests/prisma-cache-invalidation.test.js`
- `apps/api/tests/prisma-cache-invalidation.test.js.bak`
- `apps/api/tests/prisma-cache-invalidation.test.ts`
- `apps/api/tests/prisma-cache-invalidation.test.ts.bak`
- `apps/api/tests/prisma-runtime-test-helpers.d.ts`
- `apps/api/tests/prisma-runtime-test-helpers.js`
- `apps/api/tests/prisma-runtime-test-helpers.ts`
- `apps/api/tsconfig.json`
- `apps/api/tsconfig.json.bak`
- `apps/voice-engine/package.json`
- `apps/voice-engine/tsconfig.json`
- `apps/web/Dockerfile`
- `apps/web/next.config.mjs`
- `apps/web/next.config.mjs.bak`
- `apps/web/package.json`
- `apps/web/package.json.bak`
- `apps/web/tsconfig.json`
- `apps/webhook-receiver/requirements.txt`
- `apps/worker/Dockerfile`
- `apps/worker/package.json`
- `apps/worker/tsconfig.json`
- `artifacts/audit/files_analysis/_root/package.json.md`
- `artifacts/audit/files_analysis/_root/tsconfig.base.json.md`
- `artifacts/audit/files_analysis/_root/tsconfig.json.md`
- `artifacts/audit/files_analysis/agents/ae/package.json.md`
- `artifacts/audit/files_analysis/agents/ae/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/analista/package.json.md`
- `artifacts/audit/files_analysis/agents/analista/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/bdr/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/closer/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/copywriter/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/enablement/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/field/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/financeiro/package.json.md`
- `artifacts/audit/files_analysis/agents/financeiro/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/juridico/package.json.md`
- `artifacts/audit/files_analysis/agents/juridico/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/kam/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/ldr/package.json.md`
- `artifacts/audit/files_analysis/agents/ldr/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/ldr/tsconfig.json.md`
- `artifacts/audit/files_analysis/agents/marketing/package.json.md`
- `artifacts/audit/files_analysis/agents/marketing/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/partners/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/pos_venda/package.json.md`
- `artifacts/audit/files_analysis/agents/pos_venda/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/pre_sales/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/sales_ops/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/sdr/package.json.md`
- `artifacts/audit/files_analysis/agents/sdr/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/shared/pyproject.toml.md`
- `artifacts/audit/files_analysis/agents/shared/requirements.txt.md`
- `artifacts/audit/files_analysis/agents/social/requirements.txt.md`
- `artifacts/audit/files_analysis/apps/api/Dockerfile.md`
- `artifacts/audit/files_analysis/apps/api/package.json.md`
- `artifacts/audit/files_analysis/apps/api/src/common/cache/prisma-cache-invalidation.ts.md`
- `artifacts/audit/files_analysis/apps/api/src/lib/prisma-json.ts.md`
- `artifacts/audit/files_analysis/apps/api/tsconfig.json.md`
- `artifacts/audit/files_analysis/apps/voice-engine/package.json.md`
- `artifacts/audit/files_analysis/apps/voice-engine/tsconfig.json.md`
- `artifacts/audit/files_analysis/apps/web/Dockerfile.md`
- `artifacts/audit/files_analysis/apps/web/next.config.mjs.md`
- `artifacts/audit/files_analysis/apps/web/package.json.md`
- `artifacts/audit/files_analysis/apps/web/tsconfig.json.md`
- `artifacts/audit/files_analysis/apps/webhook-receiver/requirements.txt.md`
- `artifacts/audit/files_analysis/apps/worker/Dockerfile.md`
- `artifacts/audit/files_analysis/apps/worker/package.json.md`
- `artifacts/audit/files_analysis/apps/worker/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/agent-packs/package.json.md`
- `artifacts/audit/files_analysis/packages/agent-packs/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/agent-runtime/package.json.md`
- `artifacts/audit/files_analysis/packages/agent-runtime/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/agents-core/package.json.md`
- `artifacts/audit/files_analysis/packages/agents-core/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/agents-registry/package.json.md`
- `artifacts/audit/files_analysis/packages/agents-registry/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/auth/package.json.md`
- `artifacts/audit/files_analysis/packages/auth/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/config/package.json.md`
- `artifacts/audit/files_analysis/packages/config/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/conversation-core/package.json.md`
- `artifacts/audit/files_analysis/packages/conversation-core/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/database/package.json.md`
- `artifacts/audit/files_analysis/packages/database/prisma/migration-registry.json.md`
- `artifacts/audit/files_analysis/packages/database/prisma/migrations/20260313000100_cycle1_foundation/migration.sql.md`
- `artifacts/audit/files_analysis/packages/database/prisma/migrations/20260313000200_cycle2_multitenancy/migration.sql.md`
- `artifacts/audit/files_analysis/packages/database/prisma/migrations/20260313000200_cycle3_security_foundation/migration.sql.md`
- `artifacts/audit/files_analysis/packages/database/prisma/migrations/20260313000300_cycle6_workflows_orchestration/migration.sql.md`
- `artifacts/audit/files_analysis/packages/database/prisma/migrations/20260313000300_cycle7_billing_foundation/migration.sql.md`
- `artifacts/audit/files_analysis/packages/database/prisma/migrations/20260313000400_cycle9_engagement/migration.sql.md`
- `artifacts/audit/files_analysis/packages/database/prisma/migrations/20260315000100_cycle7_billing_credits_exports/migration.sql.md`
- `artifacts/audit/files_analysis/packages/database/prisma/migrations/20260315000200_cycle8_durable_budget_outputs/migration.sql.md`
- `artifacts/audit/files_analysis/packages/database/prisma/migrations/20260316000100_cycle10_connectors_handoffs/migration.sql.md`
- `artifacts/audit/files_analysis/packages/database/prisma/migrations/20260317000100_cycle11_billing_webhook_audit/migration.sql.md`
- `artifacts/audit/files_analysis/packages/database/prisma/migrations/20260322000100_cycle8_data_resilience_controls/migration.sql.md`
- `artifacts/audit/files_analysis/packages/database/prisma/migrations/migration_lock.toml.md`
- `artifacts/audit/files_analysis/packages/database/prisma/schema.prisma.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seed.ts.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seed/data.ts.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seed/helpers.ts.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seed/tenant.ts.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seed/types.ts.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seed/workflows.ts.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seeds/profiles.ts.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seeds/seed-agents.ts.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seeds/seed-billing.ts.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seeds/seed-support.ts.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seeds/seed-tenants.ts.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seeds/seed-users.ts.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seeds/seed-workflows.ts.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seeds/shared-foundation.ts.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seeds/shared-ops.ts.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seeds/shared-runtime.ts.md`
- `artifacts/audit/files_analysis/packages/database/prisma/seeds/shared.ts.md`
- `artifacts/audit/files_analysis/packages/database/scripts/lib/prisma-schema.ts.md`
- `artifacts/audit/files_analysis/packages/database/src/errors/prisma-query-timeout.error.ts.md`
- `artifacts/audit/files_analysis/packages/database/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/emails/package.json.md`
- `artifacts/audit/files_analysis/packages/emails/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/integrations/package.json.md`
- `artifacts/audit/files_analysis/packages/integrations/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/llm-client/package.json.md`
- `artifacts/audit/files_analysis/packages/llm-client/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/logger/package.json.md`
- `artifacts/audit/files_analysis/packages/logger/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/queue/package.json.md`
- `artifacts/audit/files_analysis/packages/queue/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/security/package.json.md`
- `artifacts/audit/files_analysis/packages/security/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/shared-types/package.json.md`
- `artifacts/audit/files_analysis/packages/shared-types/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/shared/package.json.md`
- `artifacts/audit/files_analysis/packages/shared/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/testing/package.json.md`
- `artifacts/audit/files_analysis/packages/testing/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/utils/package.json.md`
- `artifacts/audit/files_analysis/packages/utils/tsconfig.json.md`
- `artifacts/audit/files_analysis/packages/workflows-core/package.json.md`
- `artifacts/audit/files_analysis/packages/workflows-core/tsconfig.json.md`
- `audit/autofix/snapshots/packages/queue/package.json`
- `audit/autofix/snapshots/packages/utils/package.json`
- `package.json`
- `packages/agent-packs/package.json`
- `packages/agent-packs/tsconfig.json`
- `packages/agent-runtime/package.json`
- `packages/agent-runtime/tsconfig.json`
- `packages/agent-runtime/tsconfig.tsbuildinfo`
- `packages/agents-core/package.json`
- `packages/agents-core/tsconfig.json`
- `packages/agents-core/tsconfig.tsbuildinfo`
- `packages/agents-registry/package.json`
- `packages/agents-registry/tsconfig.json`
- `packages/agents-registry/tsconfig.tsbuildinfo`
- `packages/auth/package.json`
- `packages/auth/tsconfig.json`
- `packages/auth/tsconfig.tsbuildinfo`
- `packages/config/package.json`
- `packages/config/tsconfig.json`
- `packages/config/tsconfig.tsbuildinfo`
- `packages/conversation-core/package.json`
- `packages/conversation-core/tsconfig.json`
- `packages/conversation-core/tsconfig.tsbuildinfo`
- `packages/database/package.json`
- `packages/database/prisma.config.ts`
- `packages/database/prisma/migration-registry.json`
- `packages/database/prisma/migrations/20260313000100_cycle1_foundation/migration.sql`
- `packages/database/prisma/migrations/20260313000200_cycle2_multitenancy/migration.sql`
- `packages/database/prisma/migrations/20260313000200_cycle3_security_foundation/migration.sql`
- `packages/database/prisma/migrations/20260313000300_cycle6_workflows_orchestration/migration.sql`
- `packages/database/prisma/migrations/20260313000300_cycle7_billing_foundation/migration.sql`
- `packages/database/prisma/migrations/20260313000400_cycle9_engagement/migration.sql`
- `packages/database/prisma/migrations/20260315000100_cycle7_billing_credits_exports/migration.sql`
- `packages/database/prisma/migrations/20260315000200_cycle8_durable_budget_outputs/migration.sql`
- `packages/database/prisma/migrations/20260316000100_cycle10_connectors_handoffs/migration.sql`
- `packages/database/prisma/migrations/20260317000100_cycle11_billing_webhook_audit/migration.sql`
- `packages/database/prisma/migrations/20260322000100_cycle8_data_resilience_controls/migration.sql`
- `packages/database/prisma/migrations/20260331000100_cycle12_rls_policy_alignment/migration.sql`
- `packages/database/prisma/migrations/20260402000100_cycle12_ci_schema_alignment/migration.sql`
- `packages/database/prisma/migrations/20260407000300_phase1_lgpd_user_preferences/migration.sql`
- `packages/database/prisma/migrations/20260408000100_phase1_user_preference_locale/migration.sql`
- `packages/database/prisma/migrations/20260410000100_phase1_workflow_revision_rls/migration.sql`
- `packages/database/prisma/migrations/migration_lock.toml`
- `packages/database/prisma/schema.prisma`
- `packages/database/prisma/seed.ts`
- `packages/database/prisma/seed.ts.bak`
- `packages/database/prisma/seed/data.ts`
- `packages/database/prisma/seed/data.ts.bak`
- `packages/database/prisma/seed/helpers.ts`
- `packages/database/prisma/seed/helpers.ts.bak`

## 5. Suspeitas encontradas em logs locais
- `.ops/snapshots/repo-tree.txt`
```text
                - csrf.d.ts
                - csrf.js
                - error-handler.d.ts
                - error-handler.js
                - origin-check.d.ts
```
```text
                - csrf.js
                - error-handler.d.ts
                - error-handler.js
                - origin-check.d.ts
                - origin-check.js
```
```text
                  - index.d.ts
                  - index.js
                  - limit-exceeded.error.d.ts
                  - limit-exceeded.error.js
                  - limit-exceeded.error.js.bak
```
- `artifacts/database/f8/performance-report.txt`
```text


Raw query failed. Code: `42P01`. Message: `relation "pg_stat_statements" does not exist`
Unused indexes detected: 190.
```
- `artifacts/fix-total/fix-total.log`
```text
================================================================================
FAIL: Aplicar auto-fix TS comum e patch do workflows-core
System.Management.Automation.MethodInvocationException: Exception calling "Replace" with "3" argument(s): "Value cannot be null.
Parameter name: input" ---> System.ArgumentNullException: Value cannot be null.
Parameter name: input
```
```text
   at System.Text.RegularExpressions.Regex.Replace(String input, String pattern, String replacement)
   at CallSite.Target(Closure , CallSite , Type , Object , String , String )
   --- End of inner exception stack trace ---
   at System.Management.Automation.ExceptionHandlingOps.CheckActionPreference(FunctionContext funcContext, Exception exception)
   at System.Management.Automation.Interpreter.ActionCallInstruction`2.Run(InterpretedFrame frame)
```
```text
   at CallSite.Target(Closure , CallSite , Type , Object , String , String )
   --- End of inner exception stack trace ---
   at System.Management.Automation.ExceptionHandlingOps.CheckActionPreference(FunctionContext funcContext, Exception exception)
   at System.Management.Automation.Interpreter.ActionCallInstruction`2.Run(InterpretedFrame frame)
   at System.Management.Automation.Interpreter.EnterTryCatchFinallyInstruction.Run(InterpretedFrame frame)
```
- `artifacts/fix-total-py/fix-total.log`
```text
Atualizado: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\llm-client\src\index.ts
Atualizado: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\integrations\src\clients\fiscal.ts
Atualizado: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\emails\templates\critical-error.tsx
Atualizado: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\emails\templates\org-invite.tsx
Atualizado: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\emails\templates\templates.test.ts
```
```text
Atualizado: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\database\test\base.repo.test.ts
Atualizado: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\database\test\client.test.ts
Atualizado: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\database\test\cross-tenant-access.error.test.ts
Atualizado: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\database\test\database-availability.test.ts
Atualizado: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\database\test\database-availability.ts
```
```text
Atualizado: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\database\test\engagement.test.support.ts
Atualizado: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\database\test\engagement.test.ts
Atualizado: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\database\test\exceeded-quota.error.test.ts
Atualizado: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\database\test\index.test.ts
Atualizado: C:\Users\Marks\Documents\GitHub\PROJETO-FINAL-BIRTHUB-360-INNOVATION\packages\database\test\maternal-domain.rls.test.ts
```
- `artifacts/fix-total-safe/fix-total-safe.log`
```text
. postinstall: Scope: 3 of 24 workspace projects
. postinstall: packages/config build$ tsc -p tsconfig.json
. postinstall: packages/config build: src/api.config.test.ts(1,1): error TS2578: Unused '@ts-expect-error' directive.
. postinstall: packages/config build: src/api.config.test.ts(6,30): error TS2307: Cannot find module './api.config' or its corresponding type declarations.
. postinstall: packages/config build: src/api.config.test.ts(7,36): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './shared.js'?
```
```text
. postinstall: packages/config build$ tsc -p tsconfig.json
. postinstall: packages/config build: src/api.config.test.ts(1,1): error TS2578: Unused '@ts-expect-error' directive.
. postinstall: packages/config build: src/api.config.test.ts(6,30): error TS2307: Cannot find module './api.config' or its corresponding type declarations.
. postinstall: packages/config build: src/api.config.test.ts(7,36): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './shared.js'?
. postinstall: packages/config build: src/api.config.test.ts(35,26): error TS2339: Property 'message' does not exist on type 'unknown'.
```
```text
. postinstall: packages/config build: src/api.config.test.ts(1,1): error TS2578: Unused '@ts-expect-error' directive.
. postinstall: packages/config build: src/api.config.test.ts(6,30): error TS2307: Cannot find module './api.config' or its corresponding type declarations.
. postinstall: packages/config build: src/api.config.test.ts(7,36): error TS2835: Relative import paths need explicit file extensions in ECMAScript imports when '--moduleResolution' is 'node16' or 'nodenext'. Did you mean './shared.js'?
. postinstall: packages/config build: src/api.config.test.ts(35,26): error TS2339: Property 'message' does not exist on type 'unknown'.
. postinstall: packages/config build: src/api.config.test.ts(36,26): error TS2339: Property 'message' does not exist on type 'unknown'.
```
- `artifacts/release/cycle0-flow-summary.txt`
```text
cycle0_flow_status=failed
failed_step=pnpm build
log_file=logs/releases/cycle0-flow-2026-04-18T05-24-47Z.log
```

## 6. Próximos passos
- Compare os erros de `relatorio_final.md` com os jobs do GitHub Actions.
- Rode novamente o script após cada correção para validar regressões.
- Se o `gh` estiver autenticado, o cruzamento com erros reais da Actions fica muito mais preciso.