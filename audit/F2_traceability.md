# F2 — RASTREABILIDADE INSTRUCIONAL

## Objetivo
Cruzar o que foi prometido nos artefatos instrucionais (README, docs, workflows) com o que realmente existe no código e repositório.

## Matriz "Promessa vs Realidade"

| Promessa Documental / Operacional | Onde Prometido | Realidade Encontrada | Status | Observação |
| --- | --- | --- | --- | --- |
| "Apenas apps/web, apps/api, apps/worker, packages/database são o core" | `README.md` | `apps/dashboard` e `apps/api-gateway` e `packages/db` continuam no repositório. | ⚠️ PARCIAL | O código não foi fisicamente removido, apesar da promessa documental os tratar como "em quarentena". O repositório ainda não está purgado. |
| "Agentes de IA" | Vários docs e histórico | Existem pastas `agents/`, `.github/agents/`, `packages/agents/`, `packages/agent-packs/`. Apenas os `agent-packs` têm manifestos e integrações claras de carregamento. | 🔀 DESVIO | A pasta `.github/agents/` aparenta ser um acúmulo de prompts sem runtime. A pasta `agents/` contém código duplicado e nomenclaturas mistas. |
| Pipeline automatizada CI/CD rigorosa | `README.md` / `CONTRIBUTING.md` | `.github/workflows/cd.yml` e `ci.yml` existem, mas scripts de release usam fallback ou são preflight stubs (ex: `preflight-env.ts` precisa de mock ou falha). | ⚠️ PARCIAL | A esteira existe, mas depende de variáveis de staging/prod que estão mockadas ou em falta no ambiente atual. |
| Serviços como "voice-engine" ou "webhook-receiver" são satélites. | Catalog / Arquitetura | Eles estão dentro da pasta `apps/` no mesmo nível hierárquico das aplicações core. | 🔀 DESVIO | A estrutura não reflete o isolamento. O monorepo os trata no mesmo nível do `apps/api`. |
| Prompt Soberano e scripts na raiz | Histórico / Artefatos | Arquivos soltos como `prompt_soberano_v13.html` e scripts Python isolados (`fix_pkg.py`). | 👻 ÓRFÃO | Não pertencem a fluxos automatizados do `package.json` ou workflows estruturados. |

## Detalhamento

### Promessas Cumpridas (✅ APTO)
- O monorepo é de fato gerido pelo turborepo e pnpm com scripts root robustos.
- Os linting rules, prettier e git hooks (Husky) estão ativos e configurados.

### Promessas Parcialmente Cumpridas (⚠️ PARCIAL)
- A separação de core vs legado é declarativa no README, não é uma separação arquitetural estrita (tudo mora em `apps/` ou `packages/`).

### Implementações Divergentes (🔀 DESVIO)
- O volume esmagador de definições de agentes e duplicatas (em 4 pastas diferentes) contradiz a governança limpa de um monorepo SaaS.

### Código sem lastro (👻 ÓRFÃO)
- `apps/voice-engine` não tem entrada ativa nos workflows principais e aparenta ser experimental abandonado ou mal integrado.
- Múltiplos arquivos soltos na raiz.

---

## RELATÓRIO F2

**Quantidade por categoria identificada (Amostra crítica):**
- ✅ APTO: 2
- ⚠️ PARCIAL: 2
- ❌ GAP: 0 (No core pipeline)
- 🔀 DESVIO: 2
- 👻 ÓRFÃO: 2

**Principais gaps:**
- A pipeline de CD depende de segredos de preflight para `staging`/`prod` que não são resolvíveis nativamente sem intervenção ou mocks, bloqueando um true go-live automatizado.

**Principais desvios:**
- A enorme massa de código em `.github/agents/` que não passa de texto sem um runtime engine atrelado ao core atual.

**Principais órfãos:**
- `prompt_soberano_v13.html` solto na raiz.
- `apps/voice-engine` flutuando no repositório sem lastro forte no runtime da API canônica.

**Riscos estruturais do desalinhamento:**
- A presença de código legado (`packages/db`, `apps/api-gateway`) lado a lado com o core confunde novas contribuições e vaza no linting/testes.
- A taxonomia documental é uma máscara; a arquitetura física (as pastas) não acompanha a segregação imposta pelos documentos.
