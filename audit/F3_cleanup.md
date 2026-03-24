# F3 — HIGIENIZAÇÃO DO REPOSITÓRIO

## Escopo executado

- Fase executada: `F3 — Higienização do Repositório`
- Repositório-alvo: `https://github.com/MaarksN/PROJETO-FINAL-BIRTHUB-360-INNOVATION`
- Branch canônica: `main`
- Commit de referência: `0d21dc8215ef2857eae82ba5d32433ff58cfcdbd`
- Fonte de verdade desta fase: árvore rastreada no `HEAD` + artefatos de duplicação/documentação já versionados
- Estratégia aplicada nesta execução: classificar e propor tratamento (`REMOVER`, `CONSOLIDAR`, `REESTRUTURAR`, `MANTER`) sem apagar arquivos funcionais, porque o worktree local já está divergente e contém mudanças fora desta fase

## Evidências-base consultadas

- `git ls-tree -r -l HEAD`
- `docs/processes/documentation-source-of-truth.md`
- `artifacts/quality/jscpd/jscpd-report.json`
- `logs/ci-runs/20260322-205239_09c4a36.zip`
- `README.md`
- `audit/F1_inventory.md`
- `git status --porcelain`

## Classificação operacional

- `REMOVER`
  - arquivos temporários/versionados na raiz;
  - binários utilitários commitados;
  - logs zipados e bundles HTML gerados;
  - métricas congeladas de auditoria quando houver storage externo de evidência.
- `CONSOLIDAR`
  - superfícies canônicas vs legadas paralelas;
  - pares de diretórios de agentes com convenção duplicada;
  - documentação canônica vs superseded já mapeada como fonte de verdade;
  - relatórios gerados duplicados em JSON/HTML.
- `REESTRUTURAR`
  - mistura de artefatos operacionais, logs, auditorias e produto na raiz;
  - excesso de material instrucional em `.github/agents` sem índice operacional único para consumo humano;
  - árvore de legados ainda dentro dos workspaces ativos.
- `MANTER`
  - `apps/api`, `apps/web`, `apps/worker`, `packages/database`, `scripts/ci`, `infra/terraform`, `infra/monitoring` e `.github/workflows` como núcleo funcional/governança real do monorepo.

## Itens removíveis

| Caminho | Tipo | Motivo da remoção | Risco da remoção | Dependências relacionadas |
| --- | --- | --- | --- | --- |
| `.coverage` | Artefato transitório | Saída de cobertura não deve ser fonte de verdade versionada na raiz | Baixo | Nenhuma dependência funcional; só histórico de execução |
| `.lint_output.txt` | Artefato transitório | Log estático de lint gera ruído e envelhece rapidamente | Baixo | Nenhuma dependência funcional; pode ser externalizado |
| `.codex-write-probe.txt` | Arquivo temporário | Probe local sem função de produto | Baixo | Nenhuma |
| `tmp-codex-write-test.txt` | Arquivo temporário | Arquivo de teste ad hoc sem papel operacional real | Baixo | Nenhuma |
| `rg.exe` | Binário utilitário | Binário third-party commitado na raiz amplia peso morto e governança de supply chain | Médio | Pode ser usado por conveniências locais; validar setup antes de remover |
| `rg.cmd` | Wrapper utilitário | Só faz sentido acoplado ao binário commitado `rg.exe` | Médio | Depende da decisão sobre `rg.exe` |
| `logs/ci-runs/20260322-205239_09c4a36.zip` | Log arquivado | Log zipado versionado no repositório não deveria competir com código-fonte | Baixo | Preservar fora do Git se necessário para auditoria |
| `artifacts/quality/jscpd/html/` | Bundle HTML gerado | Relatório HTML pesado e regenerável (`3.170.973` bytes) | Baixo | Manter o JSON-fonte ou gerar on demand |
| `artifacts/f0-freeze-2026-03-22/metrics/` | Evidência gerada | Pacote congelado de métricas auditáveis (`253.265` bytes) pode sair do Git se houver storage de evidência dedicado | Baixo-Médio | Verificar se algum relatório de auditoria passa a depender desses caminhos fixos |

## Itens consolidáveis

| Conjunto de arquivos | Categoria | Estratégia de consolidação | Benefício esperado |
| --- | --- | --- | --- |
| `apps/api` + `apps/api-gateway` | Superfícies de API | Concluir strangler/proxy e mover contratos remanescentes para a API canônica | Reduz duplicidade de rotas, auth e webhooks |
| `apps/worker` + `apps/agent-orchestrator` | Orquestração/workers | Unificar execução de jobs e fluxos na stack canônica | Diminui divergência entre worker produtivo e legado |
| `packages/database` + `packages/db` | Banco de dados | Finalizar cutover do schema legado para o canônico | Remove ambiguidade de import, migração e ownership |
| `agents/parcerias` + `agents/partners` | Domínio de agentes | Escolher uma convenção única por idioma | Melhora descoberta e manutenção |
| `agents/pos-venda` + `agents/pos_venda` | Domínio de agentes | Padronizar separador e nomenclatura | Elimina duplicidade semântica |
| `agents/pre_sales` + `agents/pre_vendas` | Domínio de agentes | Normalizar idioma e padrão de diretório | Simplifica tooling e governança |
| `docs/operations/f0-ownership-matrix.md` + `docs/F0/ownership.md` | Documentação de processo | Arquivar explicitamente o histórico e apontar sempre para o canônico | Reduz risco de consulta no documento errado |
| `docs/database/migration-rollback-plan.md` + `docs/runbooks/db-backup-restore.md` | Documentação de banco | Transformar o runbook antigo em apêndice ou redirecionamento explícito | Diminui ambiguidade operacional de rollback |
| `docs/cs/cs-tool-onboarding.md` + `docs/ux/cs_tool_onboarding.md` | Documentação de onboarding | Manter o canônico e marcar o histórico como archived/deprecated | Simplifica onboarding de CS |
| `docs/security/incident_response_runbook.md` + `docs/runbooks/critical-incidents.md` + `docs/runbooks/tenant-specific-incident-runbook.md` + `docs/policies/incident-communication-policy.md` | Resposta a incidente | Consolidar índice e hierarquia entre runbook principal, variantes e policy | Acelera resposta operacional e reduz divergência |
| `docs/adrs/*` + `docs/adr/*` | ADR/decisões arquiteturais | Encerrar alias histórico e centralizar novas ADRs em `docs/adrs/*` | Clarifica a pasta oficial de decisões |

## Lixo técnico detectado

| Item | Impacto negativo | Prioridade de tratamento |
| --- | --- | --- |
| Arquivos temporários e probes na raiz (`.coverage`, `.lint_output.txt`, `.codex-write-probe.txt`, `tmp-codex-write-test.txt`) | Poluem o topo do repositório e dificultam leitura do que é código/configuração real | Alta |
| Binários utilitários versionados (`rg.exe`, `rg.cmd`) | Aumentam peso do repositório e responsabilidade de atualização/segurança | Alta |
| Bundle HTML de JSCpd versionado (`artifacts/quality/jscpd/html/`) | Adiciona `3.170.973` bytes de artefato regenerável | Média-Alta |
| Freeze de métricas em `artifacts/f0-freeze-2026-03-22/metrics/` | Mantém saídas de auditoria dentro do repositório principal | Média |
| Log zipado em `logs/ci-runs/` | Mistura histórico operacional comprimido com código-fonte | Média |
| Superfícies legadas extensas ainda dentro dos workspaces ativos | Mantêm dívida estrutural alta e aumentam risco de desvio de fonte de verdade | Alta |
| Convenções duplicadas em `agents/` (`parcerias/partners`, `pos-venda/pos_venda`, `pre_sales/pre_vendas`) | Quebra padronização, busca e automação | Alta |
| Documentação canônica convivendo com superseded sem arquivamento explícito forte | Aumenta risco de execução por documento obsoleto | Média-Alta |

## Quantificação objetiva

- Peso morto óbvio e quantificado em candidatos materiais de remoção/externalização:
  - raiz e log zipado: `4.413.001` bytes
  - bundle HTML de JSCpd: `3.170.973` bytes
  - freeze de métricas F0: `253.265` bytes
- Total quantificado: `7.837.239` bytes de material não essencial ao runtime do produto
- Duplicação já medida no repositório por `artifacts/quality/jscpd/jscpd-report.json`:
  - `40` clones
  - `691` linhas duplicadas
  - `4,02%` de linhas duplicadas

## Riscos remanescentes após a limpeza proposta

- O worktree local já contém deleções e modificações fora desta fase; aplicar remoções agora sem reconciliação pode conflitar com trabalho em curso.
- Parte do “peso morto” ainda pode ser usada como evidência histórica por auditorias anteriores; externalização exige destino alternativo.
- A consolidação das superfícies legadas exige decisão arquitetural e rollout controlado, não apenas deleção mecânica.
- A documentação histórica já está referenciada pela política de source of truth; arquivar sem redirecionamento pode quebrar links internos.

## RELATÓRIO F3 — MODIFICAÇÕES REAIS

- Arquivos criados:
  - `/audit/F3_cleanup.md`
- Arquivos alterados:
  - `/audit/master_checklist.md`
- Arquivos removidos:
  - nenhum
- Itens marcados para remoção:
  - `.coverage`
  - `.lint_output.txt`
  - `.codex-write-probe.txt`
  - `tmp-codex-write-test.txt`
  - `rg.exe`
  - `rg.cmd`
  - `logs/ci-runs/20260322-205239_09c4a36.zip`
  - `artifacts/quality/jscpd/html/`
  - `artifacts/f0-freeze-2026-03-22/metrics/`
- Itens consolidados ou propostos para consolidação:
  - pares canônico/legado em `apps/` e `packages/`
  - pares de nomenclatura duplicada em `agents/`
  - documentos canônicos vs superseded mapeados em `docs/processes/documentation-source-of-truth.md`
  - `docs/adrs/*` vs `docs/adr/*`
- Peso morto estimado identificado:
  - `7.837.239` bytes quantificados em candidatos óbvios de remoção/externalização, sem contar o custo estrutural das superfícies legadas
- Riscos remanescentes após a limpeza:
  - worktree local divergente impede remoção automática segura nesta fase
  - parte dos artefatos ainda pode ser usada como evidência histórica
  - consolidações maiores dependem de decisão arquitetural antes da exclusão física
