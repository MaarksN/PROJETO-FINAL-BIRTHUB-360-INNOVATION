# F0 — CONEXÃO, BASELINE E MAPEAMENTO INICIAL

## Escopo executado

- Fase executada: `F0 — Conexão, Baseline e Mapeamento Inicial`
- Repositório-alvo: `https://github.com/MaarksN/PROJETO-FINAL-BIRTHUB-360-INNOVATION`
- Branch canônica: `main`
- Commit baseline: `0d21dc8215ef2857eae82ba5d32433ff58cfcdbd`
- Confirmação remota: `git ls-remote origin HEAD` retornou o mesmo commit do `git rev-parse HEAD`
- Fonte de verdade desta baseline: objeto Git `HEAD` e arquivos canônicos versionados no repositório
- Observação operacional: o pack externo em `C:/Users/Marks/Desktop/birthhub_audit_pack/audit` foi usado apenas como guia de execução

## Evidências-base consultadas

- `README.md`
- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `docker-compose.yml`
- `docker-compose.prod.yml`
- `.env.example`
- `pytest.ini`
- `playwright.config.ts`
- `.github/workflows/*`
- `apps/web/package.json`
- `apps/api/package.json`
- `apps/worker/package.json`
- `packages/database/package.json`
- listagens de árvore via `git ls-tree --name-only HEAD`, `git ls-tree --name-only HEAD:apps`, `git ls-tree --name-only HEAD:packages` e `git ls-tree --name-only HEAD:agents`

## Resumo executivo inicial

O repositório analisado é um monorepo SaaS chamado `BirthHub 360`, descrito no `README.md` como o repositório canônico da plataforma. A organização baseia-se em `pnpm` workspaces e `turbo`, com superfícies oficiais declaradas para frontend (`apps/web`), API (`apps/api`), worker (`apps/worker`) e banco (`packages/database`).

A baseline do `HEAD` mostra um ecossistema híbrido Node/TypeScript/Python, com forte presença de documentação (`.md`), TypeScript (`.ts`, `.tsx`) e automação operacional em `scripts/`, `.github/workflows/` e Docker/Compose. O repositório também mantém superfícies legadas em quarentena (`apps/dashboard`, `apps/api-gateway`, `apps/agent-orchestrator`, `packages/db`), o que introduz sobreposição estrutural já na fase inicial.

Os principais sinais de maturidade observáveis em F0 são: divisão explícita entre stack canônica e legado no `README.md`, uso de workspaces, workflows CI/CD versionados, Dockerfiles para superfícies centrais e scripts de higiene/segurança. Os principais sinais de desorganização já visíveis são: artefatos e binários comprometidos no topo do repositório, coexistência de superfícies paralelas, diretórios operacionais fora do núcleo do produto na raiz e convenções de nomenclatura paralelas em parte da árvore de agentes.

## Estrutura macro do repositório

### Topo do repositório no `HEAD`

Itens de topo detectados:

` .codex-write-probe.txt`, `.coverage`, `.dockerignore`, `.env.example`, `.env.vps.example`, `.git-blame-ignore-revs`, `.gitattributes`, `.github`, `.gitignore`, `.gitleaks.toml`, `.husky`, `.lint_output.txt`, `.lintstagedrc.json`, `.nvmrc`, `.python-version`, `12 CICLOS`, `CHANGELOG.md`, `CONTRIBUTING.md`, `PROMPT_GERAL_PENDENCIAS.md`, `README.md`, `SECURITY.md`, `agents`, `apps`, `artifacts`, `ci-local.ps1`, `commitlint.config.cjs`, `docker-compose.prod.yml`, `docker-compose.yml`, `docs`, `eslint.config.mjs`, `fix_pkg.py`, `google`, `infra`, `logs`, `ops`, `package.json`, `packages`, `patch_eslint.py`, `playwright.config.ts`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `prettier.config.cjs`, `pytest.ini`, `requirements-test.txt`, `rg.cmd`, `rg.exe`, `scripts`, `tests`, `tmp-codex-write-test.txt`, `tsconfig.base.json`, `tsconfig.json`, `turbo.json`

### Aplicações em `apps/` no `HEAD` (8)

`agent-orchestrator`, `api-gateway`, `api`, `dashboard`, `voice-engine`, `web`, `webhook-receiver`, `worker`

Leitura estrutural inicial:

- superfícies canônicas explicitadas no `README.md`: `web`, `api`, `worker`;
- superfícies legadas explicitadas no `README.md`: `dashboard`, `api-gateway`, `agent-orchestrator`;
- superfícies adicionais presentes na árvore, mas não classificadas no resumo raiz: `voice-engine`, `webhook-receiver`.

### Pacotes em `packages/` no `HEAD` (22)

`agent-packs`, `agent-runtime`, `agents-core`, `agents-registry`, `agents`, `auth`, `billing`, `config`, `conversation-core`, `database`, `db`, `emails`, `integrations`, `llm-client`, `logger`, `queue`, `security`, `shared-types`, `shared`, `testing`, `utils`, `workflows-core`

Leitura estrutural inicial:

- `packages/database` aparece como banco canônico;
- `packages/db` permanece presente como superfície legada/paralela;
- existe fragmentação funcional em múltiplos pacotes de suporte (`auth`, `logger`, `queue`, `security`, `testing`, `utils`, `workflows-core`), compatível com monorepo modular;
- a presença simultânea de `database` e `db` já sinaliza sobreposição nominal/estrutural.

### Diretórios em `agents/` no `HEAD` (32)

`README.md`, `__init__.py`, `account_manager`, `ae`, `analista`, `bdr`, `closer`, `conftest.py`, `coordenador_comercial`, `copywriter`, `enablement`, `executivo_negocios`, `field`, `financeiro`, `gerente_comercial`, `inside_sales`, `juridico`, `kam`, `ldr`, `marketing`, `parcerias`, `partners`, `pos-venda`, `pos_venda`, `pre_sales`, `pre_vendas`, `revops`, `runtime`, `sales_ops`, `sdr`, `shared`, `social`

Leitura estrutural inicial:

- a árvore de agentes mistura módulos Python (`__init__.py`, `conftest.py`, `requirements.txt`) com workers TypeScript em alguns domínios;
- há sinais de convenções paralelas ou possíveis duplicidades por idioma/separador: `parcerias`/`partners`, `pos-venda`/`pos_venda`, `pre_sales`/`pre_vendas`.

## Tecnologias detectadas

### Linguagens predominantes

Contagem inicial por extensão no `HEAD`:

| Extensão | Contagem |
| --- | ---: |
| `.md` | 764 |
| `.ts` | 710 |
| `.py` | 233 |
| `.json` | 165 |
| `.html` | 162 |
| `.tsx` | 120 |
| `.mjs` | 52 |
| `.mdx` | 40 |
| `.txt` | 35 |
| `.sql` | 24 |

Leitura técnica:

- o repositório é fortemente documentado;
- TypeScript é a linguagem de implementação predominante nas superfícies Node;
- Python está presente de forma material, especialmente na camada de agentes e testes;
- SQL aparece via migrações e scripts de banco.

### Frameworks, runtimes e bibliotecas principais

| Camada | Evidência | Tecnologias detectadas |
| --- | --- | --- |
| Monorepo | `package.json`, `pnpm-workspace.yaml`, `turbo.json` | `pnpm@9.1.0`, workspaces, `turbo@2.8.16`, `typescript@5.9.3` |
| Frontend canônico | `apps/web/package.json` | `next@16.1.6`, `react@19.2.4`, `react-dom@19.2.4`, `react-hook-form`, `zustand`, `@sentry/nextjs` |
| API canônica | `apps/api/package.json` | `express@5.2.1`, `zod`, `swagger-ui-express`, `bullmq`, `ioredis`, `stripe`, `@opentelemetry/*`, `@sentry/node` |
| Worker canônico | `apps/worker/package.json` | `bullmq`, `ioredis`, `@aws-sdk/client-s3`, `zod` |
| Banco canônico | `packages/database/package.json` | `prisma@6.19.2`, `@prisma/client`, migrações SQL e seed via `tsx` |
| Testes e qualidade | `package.json`, `pytest.ini`, `playwright.config.ts` | Node test runner, `pytest`, `playwright@1.58.2`, `eslint@10.0.3`, `prettier@3.8.1`, `husky@9.1.7` |
| Build e scripts | `package.json` | `tsx`, `tsc`, scripts CI locais, scripts de segurança, cobertura, release e operações |

### Ferramentas de build, lint, test e deploy

- Build: `pnpm build`, `pnpm build:core`, `turbo run build`, `tsc`, `next build`
- Lint/format: `pnpm lint`, `eslint`, `prettier`, `lint-staged`, `husky`
- Testes: `pnpm test`, `node --test`, `pytest`, `playwright test`
- Banco: `prisma generate`, `prisma migrate`, seeds e checks de migração
- Deploy/entrega: `docker-compose.yml`, `docker-compose.prod.yml`, `Dockerfile` em `apps/api`, `apps/web` e `apps/worker`, workflows GitHub para CI/CD e segurança

### Arquivos-chave confirmados

Presentes no `HEAD`:

- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `docker-compose.yml`
- `docker-compose.prod.yml`
- `.env.example`
- `README.md`
- `.github/workflows/ci.yml`
- `.github/workflows/cd.yml`
- `.github/workflows/security-scan.yml`
- `playwright.config.ts`
- `pytest.ini`
- `apps/api/Dockerfile`
- `apps/web/Dockerfile`
- `apps/worker/Dockerfile`

## Sinais iniciais de organização, duplicação e artefatos desnecessários

### Sinais iniciais de organização

- `README.md` separa explicitamente stack canônica e superfícies legadas em quarentena.
- O repositório possui workspaces bem definidos em `apps/*`, `packages/*` e `agents/*`.
- Há automação significativa para higiene, segurança, documentação, cobertura, billing, release e operações.
- Existem `Dockerfile`s específicos para as superfícies canônicas principais.
- O diretório `.github/workflows/` contém 10 workflows versionados: `agents-conformity`, `branch-cleanup`, `cd`, `ci`, `dependabot-auto-merge`, `f4-script-compliance`, `materialize-doc-only`, `repository-health`, `reusable-node-check`, `security-scan`.

### Sinais iniciais de desorganização

- O topo do repositório contém artefatos versionados que não são configuração principal nem código funcional: `.coverage`, `.lint_output.txt`, `.codex-write-probe.txt`, `tmp-codex-write-test.txt`.
- Há binários utilitários versionados na raiz (`rg.exe`, `rg.cmd`), o que aumenta ruído estrutural e merece validação em fases posteriores.
- O topo também mistura diretórios operacionais/documentais fora do núcleo do produto (`12 CICLOS`, `artifacts`, `logs`, `google`, `infra`, `ops`) com o código principal.
- A árvore `apps/` contém superfícies presentes no `HEAD` mas ausentes fisicamente no worktree local por causa de deleções staged, o que indica divergência operacional relevante entre baseline canônica e ambiente local.

### Sinais iniciais de duplicação ou paralelismo estrutural

- Pares canônico/legado explícitos: `apps/api` vs `apps/api-gateway`, `apps/web` vs `apps/dashboard`, `apps/worker` vs `apps/agent-orchestrator`, `packages/database` vs `packages/db`.
- Pares nominais paralelos em `agents/`: `parcerias` vs `partners`, `pos-venda` vs `pos_venda`, `pre_sales` vs `pre_vendas`.
- O `README.md` classifica parte do legado, mas `apps/voice-engine` e `apps/webhook-receiver` aparecem na árvore sem o mesmo enquadramento de canônico/quarentena na seção principal, sugerindo cobertura incompleta da taxonomia de superfícies.

### Artefatos desnecessários já visíveis

- `.coverage`
- `.lint_output.txt`
- `.codex-write-probe.txt`
- `tmp-codex-write-test.txt`
- `rg.exe`
- `rg.cmd`

Nesta fase, a classificação é apenas observacional. A decisão de remoção fica para fases posteriores com justificativa e análise de risco.

## Hipóteses proibidas / limitações

- Esta baseline não usa o worktree local como fonte de verdade estrutural, porque a árvore local está divergente do `HEAD`.
- Não foi assumido que superfícies legadas estejam ativas em produção; apenas foi registrada sua presença no `HEAD`.
- Não foi assumido que artefatos versionados possam ser removidos sem impacto; apenas foi registrada sua visibilidade já em F0.
- Não foram executados builds, linters ou rotinas que pudessem reescrever arquivos versionados do produto nesta fase.
- A divergência local foi registrada como risco operacional separado: `262` mudanças rastreadas no índice (`256` deleções, `6` modificações) e `1` item não rastreado.

## Primeira avaliação de organização do repositório (0–100)

**Nota inicial: 64/100**

Justificativa objetiva:

- pontos fortes: README raiz com taxonomia inicial, monorepo com workspaces, scripts operacionais amplos, workflows GitHub versionados, Dockerfiles para superfícies centrais e separação explícita entre stack canônica e legado;
- pontos fracos: artefatos e binários versionados na raiz, coexistência de superfícies paralelas, taxonomia incompleta para algumas apps presentes no `HEAD`, mistura de diretórios operacionais com código no topo e convenções nominais paralelas na árvore de agentes;
- conclusão F0: há estrutura suficiente para auditoria disciplinada, mas a higiene do repositório e a racionalização das superfícies exigem investigação profunda nas próximas fases.

## RELATÓRIO F0 — MODIFICAÇÕES REAIS

- Arquivos criados:
  - `/audit/F0_baseline.md`
  - `/audit/master_checklist.md`
- Arquivos alterados:
  - nenhum arquivo funcional do produto foi alterado
- Arquivos removidos:
  - nenhum
- Artefatos de auditoria gerados:
  - `/audit/F0_baseline.md`
  - `/audit/master_checklist.md`
- Decisões tomadas nesta fase:
  - usar o pack externo somente como guia de execução;
  - ancorar a baseline exclusivamente no commit `0d21dc8215ef2857eae82ba5d32433ff58cfcdbd`;
  - registrar o worktree local divergente apenas como risco operacional;
  - arredondar o progresso geral para `8%` após a conclusão da F0.
- Riscos remanescentes:
  - divergência relevante entre o `HEAD` canônico e o worktree local;
  - coexistência de superfícies canônicas e legadas/paralelas;
  - presença de artefatos e binários versionados na raiz;
  - possíveis duplicidades nominais em `agents/` a serem validadas em fases posteriores.
- Observação obrigatória:
  - `Nenhum arquivo funcional do produto foi modificado nesta fase; apenas artefatos de auditoria foram produzidos.`
