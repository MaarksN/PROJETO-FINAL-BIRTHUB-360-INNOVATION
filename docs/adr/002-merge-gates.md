# ADR-002: Gates Bloqueadores de Merge no BirthHub 360

## Status

Accepted

## Context

O BirthHub 360 opera 8 agentes autônomos de RevOps que compartilham estado num monorepo (Typescript/Python). Devido à complexidade do LangGraph, chamadas de API externas, e manipulação de informações críticas de clientes (LDR, Financeiro), é imperativo que nenhum código defeituoso chegue a produção. Precisamos estabelecer com clareza quais etapas no CI (Continuous Integration) são consideradas "Gates" inegociáveis. Se um PR falhar num Gate, o botão de "Merge" no GitHub deve permanecer desabilitado.

## Gates Bloqueadores e Justificativas

### 1. Zero Warnings no Lint (ESLint + Ruff)

- **Gate**: O linter de TS/Node e de Python (`ruff`) deve retornar erro se houver qualquer warning. Tipos `any` e variáveis não utilizadas quebram a pipeline.
- **Justificativa**: Evita a "Warning Fatigue". Warnings silenciosos frequentemente escondem bugs em produção, especialmente em refatorações de agentes de IA baseados em prompts e dicionários de dados.

### 2. Testes de Agentes e E2E Passando (Pytest + Playwright)

- **Gate**: 100% dos testes unitários/integração (`pnpm test:agents` e `pnpm test:e2e`) devem ser aprovados.
- **Justificativa**: Regressões não são toleradas, especialmente em contratos de entrada e saída (schemas JSON/Pydantic) dos agentes que se comunicam via `Agent Orchestrator`.

### 3. Cobertura de Código Mínima (Coverage)

- **Gate**: `pytest-cov` e Jest/Istanbul devem reportar cobertura mínima combinada de 80% nos serviços essenciais (agentes críticos e api-gateway).
- **Justificativa**: Prevenir o acúmulo de débito técnico em áreas novas e garantir que os edge cases de prompts estejam descritos nos testes.

### 4. Code Review (Aprovação de Pares)

- **Gate**: Mínimo de 1 aprovação (Approve) formal na plataforma de versionamento. Para mudanças no `api-gateway` ou `contracts/`, o CODEOWNERS exige o lead de infraestrutura.
- **Justificativa**: Todo código que gera impacto financeiro ou legal (assinaturas, integrações Stripe/Clicksign) necessita de validação cruzada humana (Agentes CODEX e JULES exigem validações cruzadas neste ciclo 1).

### 5. Type-Check e Build sem Erros (TypeScript `tsc` e `pnpm build`)

- **Gate**: O Turborepo build precisa ser completado para todas as aplicações sem gerar artefatos corrompidos.
- **Justificativa**: Como a stack usa pnpm workspaces com "Lockstep Versioning", o build de uma dependência na pasta `packages/` não pode quebrar as apps de Next.js ou o pacote de shared-types.

## Consequences

- O time de desenvolvimento precisará ter as rotinas de `pre-commit` hook (lefthook ou husky) ativas localmente para evitar subidas de código destinadas a falhar nas Gates.
- A duração do PR desde a abertura até o merge pode ser maior no curto prazo, mas os incidentes pós-deploy deverão cair drasticamente.
- Exceções a essas regras não existirão na ferramenta. Para bypassar a pipeline, será necessária intervenção de administrador com justificativa documentada (post-mortem).
