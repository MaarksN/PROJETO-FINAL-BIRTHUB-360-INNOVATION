# Zero Warning Policy

## O que é?

No repositório do **BirthHub 360**, praticamos a cultura "Zero Warning" (Zero Alertas).
A presença constante de alertas (sejam em bibliotecas Python, compilador TypeScript, linters como ESLint/Ruff/Flake8, ou logs do CI/CD) leva ao fenômeno de **Warning Fatigue**.
Eventualmente, um alerta crítico (ex: _DeprecationWarning_ que quebra o código ou uma falha de segurança iminente) se mistura no meio de dezenas de alertas triviais, passando despercebido e resultando em incidentes de produção silenciosos e falhas na integração de agentes.

## Regras e Critérios de Aceite

1. **Pipeline de Integração Contínua (CI):** O processo de CI é programado para falhar não apenas quando os testes reprovam, mas também caso existam warnings ou não conformidades reportadas por nossas ferramentas de lint. (`--max-warnings=0` e strict mode nos agentes TypeScript/Python).
2. **Sem Ignorar Regras Globais:** A supressão de uma regra de linting em escopo global (ex: adicionar a regra em `eslint-ignore` ou arquivo `ruff.toml`) deve ser evitada a todo custo e discutida como um ADR. Se o projeto decidir desativar globalmente, o time inteiro deve assinar.
3. **Código TS:** Variáveis não utilizadas e Tipos `any` causam falha imediata na compilação em escopo local e pipeline, sem exceções.

## Lista de Exceções Justificadas

Embora a regra seja a supressão total e tratamento de todos os warnings, algumas exceções técnicas e muito específicas são admitidas:

### 1. Warnings Emitidos por Pacotes Legados de Terceiros (Open Source)

Algumas libs e pacotes instalados por nossa stack (como sub-dependências do `LangGraph` ou `FastAPI`) podem imprimir alertas de descontinuação de API nativa (ex: `Pydantic V1 vs V2`) que dependem de commits dos próprios autores e nós não temos controle. Nesses casos, a supressão explícita com o modulo de warnings em Python (`warnings.filterwarnings`) é permitida de forma isolada, documentando o bug e linkando a issue do repositório upstream.

### 2. Mocking em Testes (Pytest e Jest)

Para injetar dependências ou criar _mocks_ em testes complexos, às vezes o linter vai reportar re-atribuições não naturais ou variáveis não utilizadas intencionalmente (fixtures de Pytest). Podem ser aplicadas tags `// eslint-disable-next-line` ou `# noqa` na linha exata e em nenhum outro lugar para manter o teste rodando. É obrigatório haver um comentário acima explicando a real utilidade da linha de supressão no teste.

### 3. Códigos Gerados Automaticamente (Prisma/GraphQL)

Nenhum arquivo auto-gerado será sujeito ao rigor do linter ou do compilador `strict`. Scripts de geração de rotas OpenAPI, clients do Prisma, e afins recebem flag `/* eslint-disable */` nos cabeçalhos automáticos.
