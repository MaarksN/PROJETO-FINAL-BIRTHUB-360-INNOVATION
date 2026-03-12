# Análise de Risco de Supply Chain

## Dependências Críticas
- **Node.js / npm:** Next.js, Express, Stripe. Risco mitigado via lockfiles (`pnpm-lock.yaml`) e auditorias diárias.
- **Python / PyPI:** LangGraph, LangChain, dependências de IA. Risco mitigado através da fixação de hashes em `requirements.txt` ou uso de Poetry/Pipenv no futuro.

As vulnerabilidades encontradas em scanners de CI (Snyk/Dependabot) bloqueiam o merge se tiverem CVSS > 7.0 (Alto/Crítico).
