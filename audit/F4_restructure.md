# F4 — REORGANIZACAO ARQUITETURAL E ESTRUTURAL

## Escopo executado

- Fase executada: `F4 — Reorganizacao Arquitetural e Estrutural`
- Repositorio-alvo: `https://github.com/MaarksN/PROJETO-FINAL-BIRTHUB-360-INNOVATION`
- Branch canonica: `main`
- Commit de referencia: `0d21dc8215ef2857eae82ba5d32433ff58cfcdbd`
- Natureza desta execucao: proposta estrutural documental; nenhuma movimentacao fisica de codigo foi aplicada
- Fonte de verdade desta fase:
  - `README.md`
  - `docs/f10/architecture.md`
  - `docs/release/2026-03-20-go-live-runbook.md`
  - `docs/migration/legacy-api-gateway-strangler.md`
  - `git ls-tree -d --name-only HEAD`
  - `audit/F1_inventory.md`
  - `audit/F2_traceability.md`
  - `audit/F3_cleanup.md`
- Contexto adicional nao-canonico:
  - o staged diff atual remove grandes porcoes de `apps/api-gateway`, `apps/agent-orchestrator`, `apps/dashboard` e `packages/db`;
  - esse estado foi usado apenas como sinal de convergencia e risco operacional, nunca como baseline principal das conclusoes.

## Estrutura atual vs ideal

| Area atual | Problema estrutural | Estrutura recomendada | Impacto esperado |
| --- | --- | --- | --- |
| Raiz do monorepo (`.github`, `12 CICLOS`, `agents`, `apps`, `artifacts`, `audit`, `docs`, `google`, `infra`, `logs`, `ops`, `packages`, `scripts`, `tests`) | Produto, operacao, programas internos, evidencias geradas e artefatos de auditoria convivem no mesmo nivel de navegacao | Manter na raiz apenas lanes permanentes de produto/governanca (`apps`, `packages`, `docs`, `infra`, `scripts`, `.github`, `tests`, `audit`) e mover `12 CICLOS` para um eixo documental; externalizar logs e artefatos gerados | Reduz ruido visual, facilita onboarding e separa claramente codigo-fonte de evidencia gerada |
| `apps/web`, `apps/api`, `apps/worker` convivendo com `apps/dashboard`, `apps/api-gateway` e `apps/agent-orchestrator` no mesmo lane primario | A fronteira entre core canonico e legado fica implicita, embora o `README.md` e `docs/f10/architecture.md` ja publiquem uma taxonomia clara | Preservar `apps/web`, `apps/api` e `apps/worker` como lane primaria e mover superficies legadas para um eixo explicito de quarentena (`apps/legacy/*`) ou trilha equivalente | Diminui erro de onboarding, reduz extensao acidental do legado e deixa o caminho critico do produto evidente |
| `apps/api` e `apps/api-gateway` | A API oficial e a camada de compatibilidade ainda compartilham o mesmo plano de navegacao, apesar de `docs/migration/legacy-api-gateway-strangler.md` declarar o gateway como `frozen` e `proxy mode` | `apps/api` como edge oficial; `apps/api-gateway` realocado para `apps/legacy/api-gateway` ate o sunset completo | Reduz divergencia de auth, tenant policy, webhooks e publicacao de endpoints |
| `apps/worker` e `apps/agent-orchestrator` | Execucao assincrona e fluxos de negocio continuam fragmentados entre worker canonico e orquestrador legado | `apps/worker` mantido como lane canonica unica de jobs, filas e execucao; `apps/agent-orchestrator` movido para `apps/legacy/agent-orchestrator` ate retirada | Melhora previsibilidade operacional e reduz duplicidade de ownership para automacao |
| `packages/database` e `packages/db` | Existem duas superficies de banco de dados publicadas ao mesmo tempo, apesar de o canon apontar apenas `packages/database` | Consolidar toda a governanca, schema e cliente em `packages/database`; tratar `packages/db` como legado isolado para migracao final e retirada | Elimina drift de schema/import e clarifica a fonte de verdade de dados |
| `apps/voice-engine`, `apps/webhook-receiver` e `google/genai` fora da taxonomia principal publicada | Servicos satelite e namespaces auxiliares existem, mas nao aparecem com a mesma clareza de classificacao do core e do legado de transicao | Criar uma classificacao documental explicita para satelites/experimentais (`apps/satellites/*` ou equivalente) e enquadrar `google/genai` por ownership/papel tecnico | Reduz risco de orfandade, ownership difuso e deploy acidental sem governanca |
| `docs/`, `ops/` e `12 CICLOS/` | O source of truth documental existe, mas artefatos operacionais e programaticos ainda estao espalhados fora de um indice unico | Centralizar documentacao viva em `docs/`, manter `ops/` para ativos operacionais e mover programas/ciclos para uma subarvore documental indexada | Diminui ambiguidade entre norma, runbook, historico e programa interno |
| `artifacts/`, `logs/`, `.coverage`, `.lint_output.txt` e bundles gerados versionados | Evidencia transitoria compete com codigo-fonte e aumenta peso estrutural do repositorio | Externalizar artefatos regeneraveis para storage de CI/auditoria e manter no Git apenas o que for fonte de verdade permanente | Reduz peso morto, ruido de diff e custo de manutencao do repositorio |

## Estrutura-alvo documental proposta

`apps/worker` foi preservado no singular, em linha com o canon ja publicado. A proposta abaixo adapta a estrutura-alvo ao repositorio real, sem copiar a arvore generica do template externo:

```text
/
|-- apps/
|   |-- api/
|   |-- web/
|   |-- worker/
|   |-- legacy/
|   |   |-- api-gateway/
|   |   |-- agent-orchestrator/
|   |   `-- dashboard/
|   `-- satellites/
|       |-- voice-engine/
|       `-- webhook-receiver/
|-- packages/
|   |-- database/
|   `-- ...shared packages
|-- agents/
|-- docs/
|   |-- architecture/
|   |-- migration/
|   |-- operations/
|   |-- release/
|   |-- standards/
|   |-- adrs/
|   |-- archive/
|   `-- programs/12-ciclos/
|-- infra/
|-- ops/
|-- scripts/
|-- tests/
|-- audit/
`-- generated-outside-git/
    |-- artifacts/
    `-- logs/
```

## Movimentacoes recomendadas

| Categoria | Item atual | Novo local sugerido | Motivo | Risco |
| --- | --- | --- | --- | --- |
| Consolidacao do core canonico | `apps/api-gateway` | `apps/legacy/api-gateway/` durante o sunset; remocao ao final do strangler | Deixar explicito que o gateway nao e mais edge primario e limitar sua expansao a compatibilidade controlada | Medio: consumidores remanescentes ainda podem existir e precisam de plano de corte |
| Consolidacao do core canonico | `apps/agent-orchestrator` | `apps/legacy/agent-orchestrator/` durante o sunset; remocao apos cutover de fluxos | Separar runtime legado do worker canonico e evitar falsa equivalencia entre lanes | Medio-Alto: fluxos residuais podem depender da superficie Python |
| Consolidacao do core canonico | `apps/dashboard` | `apps/legacy/dashboard/` ate paridade final em `apps/web` ou retirada | Tornar a UX oficial inequivoca e evitar dupla referencia de frontend interno | Medio: operadores remanescentes podem ainda usar a superficie antiga |
| Sunset/retirada de legados | `packages/db` | `packages/legacy/db/` enquanto houver migracao; depois remocao fisica | Encerrar a duplicidade de schema/cliente e reforcar `packages/database` como unica fonte de verdade | Alto: qualquer consumidor nao migrado quebra se a retirada for prematura |
| Classificacao de satelites | `apps/voice-engine` | `apps/satellites/voice-engine/` ou marcacao documental equivalente | O servico existe, mas esta fora da taxonomia canonica/legada principal; precisa de enquadramento claro | Medio: classificacao incorreta pode afetar ownership e pipeline |
| Classificacao de satelites | `apps/webhook-receiver` | `apps/satellites/webhook-receiver/` ou promocao explicita ao core se entrar no caminho critico | O runbook o coloca fora do criterio de pronto; a estrutura deve refletir isso | Medio: promover ou isolar o servico exige decisao de produto/operacao |
| Externalizacao de artefatos gerados | `artifacts/quality/jscpd/html/`, `logs/ci-runs/*.zip`, `.coverage`, `.lint_output.txt` | Storage de CI/auditoria e geracao sob demanda | Sao evidencias regeneraveis e nao deveriam competir com codigo-fonte | Baixo-Medio: parte das trilhas de auditoria precisa de novo destino oficial |
| Reorganizacao documental | `12 CICLOS/` | `docs/programs/12-ciclos/` | O conteudo e relevante, mas hoje fica fora do indice documental canonico | Baixo: exige ajuste de links e indices |
| Reorganizacao documental | Documentos superseded e aliases como `docs/F0/*`, pares de onboarding e ADRs duplicados | `docs/archive/` com redirecionamento explicito para o canonico | Reduz ambiguidade de navegacao e reforca source of truth | Baixo: links internos antigos precisam continuar resolvendo corretamente |
| Reorganizacao documental/tecnica | `google/genai/` | `packages/integrations/google-genai/` ou documentacao explicita de papel/ownership | Namespace isolado sem enquadramento claro dificulta manutencao e rastreabilidade | Medio: mover o namespace exige validar imports e consumers |

## Limitacoes e riscos da reestruturacao

- O worktree local continua divergente e ja contem um cutover staged grande fora desta fase; por isso a F4 foi executada apenas como desenho estrutural.
- As movimentacoes recomendadas acima nao devem ser aplicadas mecanicamente sem reconciliar consumidores remanescentes, pipelines e ownership.
- O staged diff atual aponta para a mesma direcao desta proposta, mas ainda nao pode ser tomado como estado oficial do repositorio.
- A classificacao final de `apps/voice-engine`, `apps/webhook-receiver` e `google/genai` depende de decisao explicita de ownership/governanca, nao apenas de rearranjo fisico.

## Sintese da fase

- A estrutura canonica ja foi publicada, mas ainda nao esta refletida de forma suficientemente explicita na topologia do repositorio.
- O principal ganho estrutural esperado e tornar visivel a separacao entre core canonico, legado em sunset, satelites fora de escopo e artefatos gerados.
- A proposta mais importante desta fase nao e mover pastas imediatamente, e sim fixar uma taxonomia operacional coerente com `README.md`, `docs/f10/architecture.md` e `docs/release/2026-03-20-go-live-runbook.md`.

## RELATORIO F4 — MODIFICACOES REAIS

- Arquivos criados:
  - `/audit/F4_restructure.md`
- Arquivos alterados:
  - `/audit/master_checklist.md`
- Arquivos removidos:
  - nenhum
- Decisoes estruturais tomadas:
  - o core canonico deve permanecer explicitamente centrado em `apps/web`, `apps/api`, `apps/worker` e `packages/database`
  - o legado deve sair do lane primario de navegacao e permanecer em quarentena estrutural/documental ate o sunset
  - artefatos gerados e logs devem sair do fluxo de codigo-fonte sempre que houver storage alternativo
- Riscos remanescentes:
  - worktree local divergente impede movimentacao fisica segura nesta rodada
  - consumidores residuais do legado ainda precisam de reconciliacao antes de qualquer move/delete definitivo
  - satelites e namespaces auxiliares ainda exigem classificacao formal de ownership
- Observacao obrigatoria:
  - `Nenhum arquivo funcional do produto foi modificado nesta fase; apenas artefatos de auditoria foram produzidos.`
