# F1 — INVENTÁRIO FORENSE TOTAL

## Escopo executado

- Fase executada: `F1 — Inventário Forense Total`
- Repositório-alvo: `https://github.com/MaarksN/PROJETO-FINAL-BIRTHUB-360-INNOVATION`
- Branch canônica: `main`
- Commit de referência: `0d21dc8215ef2857eae82ba5d32433ff58cfcdbd`
- Fonte de verdade desta fase: árvore rastreada no objeto Git `HEAD`
- Total de arquivos rastreados no `HEAD`: `2467`
- Escopo metodológico: classificar ativos funcionais, artefatos instrucionais, infraestrutura, superfícies legadas e arquivos suspeitos sem usar o worktree local divergente como fonte de verdade estrutural

## Evidências-base consultadas

- `git ls-tree -r --name-only HEAD`
- `git ls-tree --name-only HEAD:apps`
- `git ls-tree --name-only HEAD:packages`
- `git ls-tree --name-only HEAD:agents`
- `README.md`
- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `.github/workflows/*`
- `apps/api/package.json`
- `apps/api/src/server.ts`
- `apps/web/package.json`
- `apps/worker/package.json`
- `apps/voice-engine/package.json`
- `apps/webhook-receiver/src/server.ts`
- `packages/database/package.json`
- `packages/database/README.md`
- `packages/agent-packs/package.json`
- `packages/agents-core/package.json`
- `packages/workflows-core/package.json`
- `packages/queue/package.json`
- `packages/security/package.json`
- `packages/auth/package.json`
- `packages/integrations/package.json`

## Inventário geral

| Caminho | Tipo | Subtipo | Papel no sistema | Criticidade |
| --- | --- | --- | --- | --- |
| `package.json` | Código funcional | Manifesto raiz | Orquestra build, lint, teste, release e governança do monorepo | Alta |
| `pnpm-workspace.yaml` | Infraestrutura | Configuração de workspace | Define os workspaces `apps/*`, `packages/*` e `agents/*` | Alta |
| `turbo.json` | Infraestrutura | Grafo de tarefas | Coordena pipelines locais de build, teste e lint | Alta |
| `README.md` | Documentação | README raiz | Declara stack canônica e superfícies legadas em quarentena | Alta |
| `apps/api/package.json` | Código funcional | Manifesto de aplicação | Configura a API canônica baseada em Node/TypeScript | Alta |
| `apps/api/src/server.ts` | Código funcional | Entrypoint API | Inicializa o servidor principal da API canônica | Alta |
| `apps/api/src/modules/auth/index.ts` | Código funcional | Módulo API | Agrega funcionalidades de autenticação/autorização da API | Alta |
| `apps/api/src/modules/workflows/index.ts` | Código funcional | Módulo API | Expõe a camada de workflows no serviço canônico | Alta |
| `apps/web/package.json` | Código funcional | Manifesto de aplicação | Configura o frontend canônico em Next.js | Alta |
| `apps/web/Dockerfile` | Infraestrutura | Container de aplicação | Empacota o frontend canônico para deploy | Alta |
| `apps/worker/package.json` | Código funcional | Manifesto de aplicação | Configura o worker canônico de filas e jobs | Alta |
| `apps/worker/src/index.ts` | Código funcional | Entrypoint worker | Faz bootstrap do worker canônico | Alta |
| `apps/worker/src/worker.ts` | Código funcional | Runtime worker | Processa jobs e integra com runtime compartilhado | Alta |
| `apps/voice-engine/package.json` | Código funcional | Manifesto de aplicação | Define o serviço de voz com Twilio, Deepgram e Redis | Média |
| `apps/voice-engine/src/server.ts` | Código funcional | Entrypoint de serviço | Inicializa o serviço auxiliar de voz | Média |
| `apps/webhook-receiver/main.py` | Código funcional | Runtime canônico | Mantém o runtime efetivo do webhook receiver em Python | Média |
| `apps/webhook-receiver/src/server.ts` | Código funcional | Stub legado | Mantido apenas como referência de migração; o comentário do arquivo aponta o runtime Python como canônico | Baixa |
| `apps/api-gateway/package.json` | Código funcional | Manifesto legado | Mantém a superfície legada `api-gateway` em quarentena | Alta |
| `apps/api-gateway/src/server.ts` | Código funcional | Entrypoint legado | Entrypoint da API legada paralela à API canônica | Alta |
| `apps/agent-orchestrator/main.py` | Código funcional | Orquestrador legado | Runtime Python legado do orquestrador de agentes | Alta |
| `apps/agent-orchestrator/worker.ts` | Código funcional | Worker legado | Worker TypeScript legado do orquestrador | Alta |
| `apps/dashboard/package.json` | Código funcional | Manifesto legado | Mantém o dashboard legado em quarentena | Alta |
| `packages/database/package.json` | Código funcional | Manifesto de pacote | Define o pacote de banco canônico | Alta |
| `packages/database/prisma/schema.prisma` | Código funcional | Schema Prisma | Fonte canônica de schema do banco | Alta |
| `packages/database/scripts/post-migration-checklist.ts` | Script | Checklist operacional | Executa verificação pós-migração do banco canônico | Alta |
| `packages/db/prisma/schema.prisma` | Código funcional | Schema Prisma legado | Mantém a superfície de banco legada em paralelo ao pacote canônico | Alta |
| `packages/queue/src/index.ts` | Código funcional | Biblioteca de filas | Abstrai filas e workers com BullMQ/Redis | Alta |
| `packages/integrations/src/index.ts` | Código funcional | Biblioteca de integrações | Concentra conectores externos como HubSpot, Pipedrive, Resend e Stripe | Alta |
| `packages/auth/index.ts` | Código funcional | Biblioteca compartilhada | Fornece primitives de autenticação com `jose` | Alta |
| `packages/security/index.ts` | Código funcional | Biblioteca compartilhada | Centraliza utilidades de segurança/sanitização | Alta |
| `packages/workflows-core/src/index.ts` | Código funcional | Biblioteca compartilhada | Núcleo compartilhado de workflows | Alta |
| `packages/agents-core/src/index.ts` | Código funcional | Biblioteca compartilhada | Runtime base, tipos, ferramentas e execução de agentes | Alta |
| `packages/agent-packs/package.json` | Código funcional | Pacote de conteúdo | Empacota, valida e testa packs de agentes/prompts | Média |
| `agents/README.md` | Documentação | Catálogo de agentes | Documenta a camada de agentes de negócio | Média |
| `agents/ldr/main.py` | Código funcional | Agente Python | Runtime Python do agente LDR | Média |
| `agents/ldr/worker.ts` | Código funcional | Worker de agente | Worker TypeScript do agente LDR | Média |
| `agents/financeiro/main.py` | Código funcional | Agente Python | Runtime Python do agente financeiro | Média |
| `scripts/ci/full.mjs` | Script | Orquestrador CI | Consolida execuções de pipelines por tarefa e full run | Alta |
| `scripts/ci/monorepo-doctor.mjs` | Script | Diagnóstico | Produz diagnóstico estrutural do monorepo | Média |
| `scripts/security/scan-inline-credentials.mjs` | Script | Segurança | Escaneia credenciais inline no repositório | Alta |
| `.github/workflows/ci.yml` | Infraestrutura | Pipeline CI | Executa validações contínuas do repositório | Alta |
| `.github/workflows/cd.yml` | Infraestrutura | Pipeline CD | Orquestra entrega contínua | Alta |
| `.github/workflows/security-scan.yml` | Infraestrutura | Pipeline de segurança | Executa varreduras de segurança no GitHub Actions | Alta |
| `docker-compose.yml` | Infraestrutura | Compose local | Sobe dependências e stack local | Média |
| `docker-compose.prod.yml` | Infraestrutura | Compose produção | Define composição de ambiente produtivo | Alta |
| `infra/terraform/main.tf` | Infraestrutura | IaC | Provisiona infraestrutura via Terraform | Alta |
| `infra/monitoring/prometheus.yml` | Infraestrutura | Observabilidade | Configura coleta de métricas Prometheus | Média |
| `ops/vps/Caddyfile` | Infraestrutura | Edge/proxy | Configura reverso/proxy para operação em VPS | Média |
| `docs/roadmap.md` | Artefato instrucional | Roadmap | Direciona evolução do produto/plataforma | Média |
| `docs/runbooks/db-migrations.md` | Documentação | Runbook | Define procedimento de migrações de banco | Alta |
| `docs/evidence/prompt-v2-full-phases.md` | Artefato instrucional | Auditoria/prompt | Orienta execução faseada e geração de evidências | Média |
| `PROMPT_GERAL_PENDENCIAS.md` | Artefato instrucional | Prompt raiz | Consolida pendências e direcionamento executivo/manual | Média |
| `.github/prompts/criar-agente.prompt.md` | Artefato instrucional | Prompt | Guia criação de agentes | Média |
| `.github/skills/create-agent/references/checklist-validacao.md` | Artefato instrucional | Checklist | Lista de validação para criação de agentes | Média |
| `.github/agents/cycle-01/audit-bot.agent.md` | Artefato instrucional | Manifesto de agente IA | Define comportamento de um agente de ciclo | Média |
| `.github/agents/cycle-13/compliance-checklist-enforcer.agent.md` | Artefato instrucional | Manifesto de agente IA | Define agente de compliance/checklist | Média |
| `12 CICLOS/F0.html` | Artefato instrucional | Fase HTML | Exporta uma fase de execução/auditoria em HTML | Baixa |
| `12 CICLOS/F1.html` | Artefato instrucional | Fase HTML | Exporta a fase F1 em HTML | Baixa |
| `artifacts/doctor/monorepo-doctor-report.md` | Artefato gerado | Diagnóstico versionado | Evidência material de análise do monorepo | Média |
| `artifacts/quality/jscpd/jscpd-report.json` | Artefato gerado | Relatório de duplicação | Evidência gerada de duplicidade estrutural | Média |
| `logs/ci-runs/20260322-205239_09c4a36.zip` | Arquivo temporário ou suspeito | Log arquivado | Log zipado de execução CI versionado no repositório | Média |
| `google/genai/__init__.py` | Código auxiliar | Namespace fornecedor | Namespace mínimo ligado a integração auxiliar `google/genai` | Baixa |
| `.coverage` | Arquivo temporário ou suspeito | Cobertura versionada | Artefato transitório de cobertura comprometido no topo do repositório | Média |
| `.lint_output.txt` | Arquivo temporário ou suspeito | Saída de lint | Output de lint versionado no topo do repositório | Média |
| `.codex-write-probe.txt` | Arquivo temporário ou suspeito | Probe local | Vestígio de escrita/probe comprometido no topo do repositório | Baixa |
| `tmp-codex-write-test.txt` | Arquivo temporário ou suspeito | Arquivo temporário | Arquivo de teste temporário versionado no topo do repositório | Baixa |
| `rg.exe` | Arquivo temporário ou suspeito | Binário utilitário | Binário do ripgrep comprometido na raiz | Média |
| `rg.cmd` | Arquivo temporário ou suspeito | Wrapper utilitário | Wrapper do ripgrep comprometido na raiz | Baixa |

## Distribuição por domínio

Distribuição disjunta por prefixo principal do `HEAD`:

| Domínio | Quantidade de arquivos | Risco percebido | Observações |
| --- | ---: | --- | --- |
| `packages/` | 646 | Alto | Maior concentração técnica do repositório; inclui núcleo compartilhado, banco canônico e superfície legada `packages/db` |
| `apps/` | 579 | Alto | Concentra superfícies canônicas e legadas em paralelo; hotspots em `apps/api`, `apps/dashboard` e `apps/api-gateway` |
| `.github/` | 409 | Alto | Mistura pipelines CI/CD, prompts, skills e 334 manifests `.agent.md`; densidade instrucional elevada |
| `docs/` | 339 | Médio-Alto | Alta densidade documental; inclui 12 runbooks, evidências, políticas e roadmap |
| `agents/` | 268 | Alto | Camada híbrida Python/TypeScript com convenções de nome paralelas e múltiplos domínios de negócio |
| `scripts/` | 92 | Médio-Alto | Scripts de CI, segurança, bootstrap, release, diagnóstico e testes |
| `artifacts/` | 42 | Médio | Reúne saídas geradas e evidências versionadas; útil para auditoria, mas adiciona ruído operacional |
| `<root>` | 38 | Alto | Concentra manifests críticos e também arquivos suspeitos como `.coverage`, `rg.exe` e probes temporários |
| `infra/` | 17 | Médio-Alto | IaC, monitoramento e templates de infraestrutura |
| `tests/` | 16 | Médio | Testes integrados e E2E fora das apps/pacotes |
| `12 CICLOS/` | 12 | Médio | Exportações HTML de fases/ciclos; material instrucional paralelo ao código |
| `ops/` | 4 | Médio | Governança operacional, agenda e configuração VPS |
| `logs/` | 2 | Médio | Logs de CI versionados no repositório |
| `google/` | 1 | Baixo | Namespace isolado com baixa densidade e papel ainda restrito |

## Artefatos de orientação para IA

| Caminho | Tipo (prompt/checklist/auditoria/roadmap) | Finalidade | Relevância para execução futura |
| --- | --- | --- | --- |
| `PROMPT_GERAL_PENDENCIAS.md` | prompt | Direcionar backlog e pendências gerais | Alta |
| `.github/prompts/criar-agente.prompt.md` | prompt | Padronizar criação de novos agentes | Alta |
| `.github/prompts/revisar-agente.prompt.md` | prompt | Guiar revisão de agentes existentes | Alta |
| `.github/skills/create-agent/references/checklist-validacao.md` | checklist | Validar agentes antes de adoção | Alta |
| `docs/evidence/prompt-v2-full-phases.md` | auditoria | Registrar a versão faseada de prompt/evidência | Média-Alta |
| `docs/roadmap.md` | roadmap | Organizar prioridades de evolução | Média-Alta |
| `12 CICLOS/F0.html` | auditoria | Exportar a fase F0 em HTML | Média |
| `12 CICLOS/F1.html` | auditoria | Exportar a fase F1 em HTML | Média |
| `.github/agents/cycle-01/README.md` | roadmap | Indexar e contextualizar o ciclo 01 de agentes | Média |
| `.github/agents/cycle-01/audit-bot.agent.md` | prompt | Definir um agente orientado a auditoria | Média |
| `.github/agents/cycle-02/playbook-generator.agent.md` | prompt | Definir agente gerador de playbooks | Média |
| `.github/agents/cycle-10/mapeia.agent.md` | prompt | Definir agente de mapeamento/diagnóstico | Média |
| `.github/agents/cycle-13/compliance-checklist-enforcer.agent.md` | checklist | Definir agente de enforcement de checklist/compliance | Média |
| `packages/agent-packs/corporate-v1/prompts/README.md` | prompt | Documentar prompts empacotados para agent packs | Média |

Observação quantitativa:

- `.github/agents/` contém `374` arquivos rastreados;
- desse conjunto, `334` são manifests `.agent.md`;
- `.github/prompts/` contém `2` prompts rastreados;
- `.github/skills/` contém `4` arquivos rastreados;
- a camada instrucional/orientativa é material e não deve ser confundida com runtime funcional.

## Áreas de maior densidade e risco

- `packages/` (`646` arquivos) é a maior área técnica e concentra bibliotecas compartilhadas críticas, `packages/database` canônico e `packages/db` legado.
- `apps/` (`579` arquivos) reúne a superfície produtiva central e também o legado em quarentena, elevando o risco de sobreposição arquitetural.
- `.github/` (`409` arquivos) tem peso incomum para uma área de configuração, puxado por manifests de agentes, prompts e skills; isso aumenta a dependência de artefatos instrucionais.
- `docs/` (`339` arquivos) e `artifacts/` (`42` arquivos) mostram forte presença de material explicativo e gerado, útil para auditoria, mas com potencial de ruído e duplicação de fonte de verdade.
- `agents/` (`268` arquivos) mantém runtime híbrido Python/TypeScript e nomenclaturas paralelas (`parcerias`/`partners`, `pos-venda`/`pos_venda`, `pre_sales`/`pre_vendas`), o que aumenta o custo de manutenção e rastreabilidade.

## Inconsistências relevantes encontradas

- Superfícies canônicas e legadas coexistem na mesma árvore: `apps/api` vs `apps/api-gateway`, `apps/web` vs `apps/dashboard`, `apps/worker` vs `apps/agent-orchestrator`, `packages/database` vs `packages/db`.
- `apps/webhook-receiver` mantém runtime canônico em Python (`main.py`) e um stub legado em TypeScript (`src/server.ts`) explicitamente preservado só como referência de migração.
- O topo do repositório contém arquivos temporários/suspeitos e binários utilitários versionados: `.coverage`, `.lint_output.txt`, `.codex-write-probe.txt`, `tmp-codex-write-test.txt`, `rg.exe`, `rg.cmd`.
- Há logs e relatórios gerados versionados em `artifacts/` e `logs/`, o que mistura evidência operacional com código-fonte rastreado.
- A densidade de artefatos instrucionais para IA é alta: `334` manifests `.agent.md` em `.github/agents/`, além de prompts, checklists e exportações HTML em `12 CICLOS/`.
- O domínio `google/` tem apenas um arquivo (`google/genai/__init__.py`), sugerindo integração isolada com baixa materialidade estrutural e rastreabilidade ainda limitada.

## RELATÓRIO F1 — MODIFICAÇÕES REAIS

- Arquivos criados:
  - `/audit/F1_inventory.md`
- Arquivos alterados:
  - `/audit/master_checklist.md`
- Arquivos removidos:
  - nenhum
- Inventários gerados:
  - inventário por categoria
  - distribuição por domínio
  - inventário de artefatos de orientação para IA
- Decisões de classificação tomadas:
  - usar o `HEAD` canônico como única fonte de verdade estrutural da fase;
  - classificar `.github/agents/`, `.github/prompts/`, `.github/skills/`, `PROMPT_GERAL_PENDENCIAS.md` e `12 CICLOS/` como artefatos instrucionais, não como runtime funcional;
  - classificar `apps/webhook-receiver/src/server.ts` como stub legado com base no comentário interno do arquivo;
  - classificar `artifacts/` e `logs/` como evidência/saída gerada versionada, distinta do código funcional;
  - manter `packages/db`, `apps/dashboard`, `apps/api-gateway` e `apps/agent-orchestrator` como superfícies legadas paralelas, não como stack canônica.
- Áreas do repositório ainda ambíguas:
  - papel operacional atual de `apps/voice-engine` no stack suportado;
  - grau de uso efetivo de `google/genai/__init__.py`;
  - se `12 CICLOS/` é fonte ativa de execução ou apenas exportação paralela de material instrucional.
- Observação obrigatória se aplicável:
  - `Nenhum arquivo funcional do produto foi modificado nesta fase; apenas artefatos de auditoria foram produzidos.`
