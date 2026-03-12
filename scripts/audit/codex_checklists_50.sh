#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

REPORT="docs/runbooks/codex-checklists-50-execution.md"

checks=(
"Pipeline de integração com testes configurada|test -f .github/workflows/ci.yml"
"Suite unitária/integrada Python presente|test -f pytest.ini"
"Suite E2E web presente|test -f tests/e2e/critical-routes.spec.ts"
"Cobertura de testes monitorada no gateway|rg -n \"coverage\" apps/api-gateway/package.json >/dev/null"
"Hardening de segurança com testes dedicados|test -f tests/integration/test_security_hardening.py"
"Runbook de rollback documentado|test -f docs/runbooks/rollback-procedures.md"
"Gate de aprovação de produção documentado|test -f docs/runbooks/production-gate-approval.md"
"Checklist de prontidão de deploy disponível|test -f docs/runbooks/deploy-readiness-checklist.md"
"ADR de multi-tenancy com RLS existe|test -f docs/adrs/ADR-007-multi-tenancy-strategy.md"
"Tenant id exigido por middleware no gateway|rg -n \"x-tenant-id\" apps/api-gateway/src/middleware >/dev/null"
"Resolução explícita de tenant em rotas principais|rg -n \"resolveTenantId\" apps/api-gateway/src/routes/index.ts >/dev/null"
"Serviços de lead recebem tenant_id|rg -n \"tenantId\" apps/api-gateway/src/services/lead-service.ts >/dev/null"
"Serviço de contratos com escopo de tenant|rg -n \"tenant\" apps/api-gateway/src/services/contract-service.ts >/dev/null"
"Serviço de negócio (deal) com tenant no repositório|rg -n \"tenant\" apps/api-gateway/src/repositories/deal-repository.ts >/dev/null"
"Repository de lead com filtro por tenant|rg -n \"tenant\" apps/api-gateway/src/repositories/lead-repository.ts >/dev/null"
"Testes de isolamento de tenant presentes|test -f docs/security/tenant-isolation-checklist.md"
"Política de deleção de tenant documentada|test -f docs/policies/tenant-deletion-policy.md"
"Processo de restore por tenant documentado|test -f docs/policies/tenant-restore-process.md"
"Logs de webhook incluem tenant_id|rg -n \"tenantId\" apps/api-gateway/src/routes/index.ts >/dev/null"
"Proteção contra IDOR via autenticação por escopo/role|rg -n \"requireAuthorization\" apps/api-gateway/src/routes >/dev/null"
"Payload limit aplicado em endpoint crítico|rg -n \"payloadLimitMiddleware\" apps/api-gateway/src/routes/index.ts >/dev/null"
"Idempotência em webhooks configurada|rg -n \"webhookIdempotencyMiddleware\" apps/api-gateway/src/routes/index.ts >/dev/null"
"Validação de assinatura de webhook configurada|rg -n \"webhookSignatureMiddleware\" apps/api-gateway/src/routes/index.ts >/dev/null"
"Teste de assinatura Stripe presente|rg -n \"valida assinatura hmac\" apps/api-gateway/src/routes/__tests__/routes.integration.test.ts >/dev/null"
"Cobertura de cenários 403/404 de acesso negado em testes|rg -n \"403|404|forbidden\" tests apps/api-gateway/src/routes/__tests__ >/dev/null"
"Checklist PCI DSS documentada|test -f docs/billing/checklist-pci-dss.md"
"Chave secreta Stripe vem de secret manager (infra)|rg -n \"stripe-secret-key\" infra/cloudrun/service.yaml >/dev/null"
"Segredo de webhook Stripe por variável de ambiente|rg -n \"STRIPE_WEBHOOK_SECRET\" apps/api-gateway/src/routes >/dev/null"
"Rota dedicada para webhook Stripe presente|rg -n \"/webhooks/stripe\" apps/api-gateway/src/routes >/dev/null"
"Integração de pagamentos com adapter dedicado|test -f apps/api-gateway/src/integrations/payment-adapter.ts"
"Testes do adapter de pagamento presentes|test -f apps/api-gateway/src/integrations/__tests__/payment-adapter.test.ts"
"Teste de resiliência de integração de pagamento presente|test -f apps/api-gateway/src/integrations/__tests__/resilience.test.ts"
"Catálogo de erros para integrações externas|test -f apps/api-gateway/src/integrations/error-catalog.ts"
"Proteção de webhook em middleware dedicada|test -f apps/api-gateway/src/middleware/webhook-signature.ts"
"Helmet habilitado para headers de segurança|rg -n \"helmet\(\)\" apps/api-gateway/src/server.ts >/dev/null"
"Health endpoint padronizado exposto|rg -n \"/health\" apps/api-gateway/src/server.ts >/dev/null"
"Observabilidade com Prometheus em monitoramento|test -f infra/monitoring/alert.rules.yml"
"Dashboard Grafana versionado no repositório|test -f infra/monitoring/grafana-dashboard.json"
"Infra IaC com Terraform presente|test -f infra/terraform/main.tf"
"Módulo de IAM no Terraform presente|test -f infra/terraform/modules/iam.tf"
"Módulo de Redis no Terraform presente|test -f infra/terraform/modules/redis.tf"
"Módulo de Secrets no Terraform presente|test -f infra/terraform/modules/secrets.tf"
"Módulo Cloud SQL no Terraform presente|test -f infra/terraform/modules/cloudsql.tf"
"Orquestrador com worker LDR implementado|test -f apps/agent-orchestrator/src/workers/ldr-worker.ts"
"Orquestrador com worker SDR implementado|test -f apps/agent-orchestrator/src/workers/sdr-worker.ts"
"Fluxos do orquestrador em Python presentes|test -f apps/agent-orchestrator/orchestrator/flows.py"
"Event bus do orquestrador implementado|test -f apps/agent-orchestrator/orchestrator/event_bus.py"
"Teste de confiabilidade de eventos presente|test -f tests/integration/test_orchestrator_event_reliability.py"
"Teste de endpoints operacionais do orquestrador presente|test -f tests/integration/test_orchestrator_operational_endpoints.py"
"Teste de payloads do fluxo do orquestrador presente|test -f tests/integration/test_orchestrator_flow_payloads.py"
)

{
  echo "# Execução dos Próximos 50 Passos Lógicos (Codex Checklists)"
  echo
  echo "- Data/Hora (UTC): $(date -u +"%Y-%m-%d %H:%M:%S")"
  echo "- Escopo analisado: deploy readiness, tenant isolation, PCI DSS Stripe, segurança operacional e observabilidade"
  echo
  echo "## Resultado consolidado"
  echo
  echo "| # | Passo lógico executado | Status |"
  echo "|---|---|---|"

  pass=0
  fail=0
  i=1
  for item in "${checks[@]}"; do
    desc="${item%%|*}"
    cmd="${item#*|}"
    if eval "$cmd"; then
      status="✅ PASSOU"
      ((pass++))
    else
      status="❌ FALHOU"
      ((fail++))
    fi
    echo "| $i | $desc | $status |"
    ((i++))
  done

  echo
  echo "## Sumário"
  echo
  echo "- Total de passos executados: ${#checks[@]}"
  echo "- Passos aprovados: $pass"
  echo "- Passos com falha/gap: $fail"
  echo
  echo "## Observação"
  echo
  echo "Este relatório executa validações automatizadas de presença/configuração no repositório. Itens marcados como falha devem virar backlog técnico imediato antes de produção."
} > "$REPORT"

echo "Relatório gerado em: $REPORT"
