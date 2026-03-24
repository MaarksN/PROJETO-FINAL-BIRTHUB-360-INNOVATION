# F6 — GAPS DE PRODUÇÃO

## Foco do Core Analisado
A avaliação baseou-se estritamente na capacidade de enviar o core abaixo para produção sem bloqueadores materiais de governança e resiliência:
- `apps/web`
- `apps/api`
- `apps/worker`
- `packages/database`

*(Nota: O Legado e os Satélites identificados em F4 foram excluídos do gate mandatório, a não ser que demonstrem dependência cruzada não documentada. A análise foca em gaps estruturais de CI/CD, Observabilidade e Prontidão de Ambiente).*

## Tabela Consolidada de Gaps de Produção

| Gap | Risco / Descrição | Impacto Técnico | Classificação | Remediação Imediata |
| --- | --- | --- | --- | --- |
| Gate de Produção Inconsistente no CD | A ausência de validação estrita das chaves via preflight automatizado e robusto falha em garantir a estabilidade do build de produção final sem intervenção. O runner no GitHub depende de secrets reais injetadas no ato sem "dry-runs" eficientes de segurança final. | Deploys podem falhar no ar devido à ausência de variáveis vitais não checadas antes da troca do pointer/routing. | Crítico (Bloqueador) | Garantir que o job `production-preflight` falhe e barre o workflow de `cd.yml` em ausência de secrets simuláveis (`.env.*.mock`). |
| Readiness Probes e Health Checks desalinhados | Embora a API tenha endpoints (`/health`), `apps/web` e `apps/worker` precisam de Liveness/Readiness autônomos documentados e expostos, e conectados ao orquestrador (Docker Compose/K8s). A checagem de banco no worker precisa ser garantida para evitar loopings falhos. | Ferramentas de auto-scaling e balanceamento falharão em perceber se um worker está travado (deadlock) ou sem conectividade com a base de dados. | Crítico (Bloqueador) | Desenvolver e padronizar sondas `/health/liveness` e `/health/readiness` em todas as aplicações core, conectadas à dependência do `packages/database`. |
| Rollback Rehearsal não documentado via automação | Não há scripts automatizados claros de regressão de versão no pipeline do repo (`scripts/release/rollback-rehearsal.ts` existe no plano, mas não implementado/validado fisicamente na esteira). | Recuperação lenta e baseada em intervenção manual em caso de corrupção ou deploy falho crítico. | Alto (Risco de Operação) | Implementar script ou job de fallback na pipeline, provando o funcionamento da reversão da imagem ou do deploy. |
| Incoerência de Banco Core vs Legado | O core transacional está definido como `packages/database`, mas a presença ativa de `packages/db` cria ambiguidade e falha pontual de CI em processos que cruzam dependências. | Riscos severos de transações cruzarem poolers ou perderem rastreabilidade em produção se importados equivocadamente na API/Worker. | Alto (Risco de Go-Live) | Substituir todos os consumos legados para `packages/database` antes de ir à produção. |
| Observabilidade baseada no Legado | Configurações atuais de monitoramento em `infra/monitoring` não refletem de forma purificada as aplicações novas do core. | On-call será acionado pelas razões erradas. A war room observará painéis que não medem a performance transacional do core (ex: `api` e `worker`). | Médio (Alerta P0 incorreto) | Atualizar as `alert.rules.yml` focando em `apps/api` (5xx rate) e `apps/worker` (saturalção de fila). |

---

## RELATÓRIO F6

- **Gaps Críticos:** Falha de automação segura no gate de produção (preflight de variáveis) e health probes desalinhadas nos serviços assíncronos e de frontend.
- **Risco de Deploy:** Alto se operado no estado atual sem um ensaio real de rollback automático.
- **Bloqueadores Objetivos de Go-Live:** O preflight estrito na pipeline do GitHub Actions para a camada produtiva. Sem a verificação prévia de health das variáveis e do ambiente (`.env.production` ou equivalentes no runner), o deploy cego constitui violação de resiliência. Outro bloqueador é o uso residual de `packages/db`.
- **Controles de produção já presentes:** A presença de ferramentas modernas de linters, commitlint, e uma esteira inicial via Turborepo garantem a integridade do pacote, mas não necessariamente da orquestração em tempo de execução final.
- **Recomendações Imediatas de Remediação:** Ajuste rápido de rotas de Health/Liveness nos 3 apps core, implementação de um job preflight bloqueante simulado para staging/prod, e a aposentadoria final do pacote de BD legado no código funcional da API e Worker.
