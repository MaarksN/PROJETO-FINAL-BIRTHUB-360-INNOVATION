# F5 — DÍVIDA TÉCNICA

## Tabela Consolidada de Dívida Técnica

| ID | Categoria | Descrição | Evidência | Impacto Técnico | Impacto de Negócio | Severidade | Score | Ação Corretiva Sugerida |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TD-01 | Arquitetura | Estrutura plana mistura core, legado e projetos satélites/órfãos. | `apps/` abriga `api`, `web`, mas também `api-gateway`, `agent-orchestrator`, `voice-engine`. | Quebra de encapsulamento, aumento de builds globais (turborepo), dificuldade em rastrear o que é efetivamente parte do pacote de deploy de produção. | Alto risco de vazamento de bugs ou falhas de deploy devido a código depreciado afetar o core no CI/CD. | Crítico | 90 | Implementar a estrutura de quarentena mapeada na fase F4, isolando legados e satélites, ou removê-los ativamente. |
| TD-02 | Organização | Proliferação descontrolada e fragmentada de agentes com diretórios duplicados. | Múltiplas pastas raízes (`agents/`, `.github/agents/`, `packages/agents/`, `packages/agent-packs/`) com nomenclatura em inglês e português. | Confusão em tempo de runtime, orquestração opaca, lógica de fallback ou routing impossível de ser mantida sem gambiarras. | Custos altos de desenvolvimento para criar novos agentes ou integrar IA. Modelos baseados em prompts desestruturados. | Crítico | 85 | Consolidar os manifestos ativos apenas em `packages/agent-packs/` sob um esquema rigoroso de contrato, apagando o resto. |
| TD-03 | Dados | Múltiplos pacotes de infraestrutura de banco de dados no monorepo. | Existência de `packages/database` e `packages/db`. | Riscos de importação cruzada de instâncias prisma separadas (erro de pooler), conflitos de migration e dual sources of truth. | Perda de integridade relacional ou interrupções caso dois runtimes apontem para o BD com conexões/pools distintas. | Crítico | 85 | Realizar um plano de cutover garantindo que todos os imports apontem para `packages/database`, deprecando e removendo `packages/db`. |
| TD-04 | DevOps | Dependência do CI/CD de preflights de staging/produção e uso intenso de variáveis mockadas ou não verificáveis sem chaves ativas. | O CD em `.github/workflows/cd.yml` aparenta ter gargalos na verificação de variáveis se não existirem mocks consistentes. (Histórico aponta problemas em `scripts/release/preflight-env.ts`). | CI/CD falho que não garante a prontidão efetiva de um ambiente sem simulação completa de variáveis secretas. | Risco de um deploy entrar na rede como "Sucesso" no pipeline, mas quebrar as integrações reais em ambiente produtivo. | Alto | 75 | Estabelecer uso claro e versionado de mocks seguros (`.env.*.mock`) e obrigar gates de preflight e release em staging/prod no Github Actions. |
| TD-05 | Observabilidade | Possibilidade do core atual ainda delegar responsabilidades não documentadas para o `api-gateway` e afins. | Histórico do projeto e coexistência dos pacotes apontam que health checks e rotas de gateway ainda existem. | Carga invisível de tráfego, dificuldade de rastrear métricas se o tráfego passa por camadas duplicadas. | Diagnóstico de incidentes lentos (alto MTTR) por causa de roteamentos não claros ou acoplados ao legado. | Alto | 70 | Padronizar logs e definir endpoints de health liveness/readiness de todas as aplicações do core. |

---

## RELATÓRIO F5

- **Top Riscos:** Mistura arquitetural core/legado, proliferação não-governada de agentes IA e dependência difusa no pacote de banco de dados duplo.
- **Itens Críticos:** TD-01, TD-02, TD-03.
- **Clusters de Dívida:** A dívida primária concentra-se na falta de higienização histórica e segregação estrita no nível de pastas/workspace. Não é uma dívida apenas de código, mas estrutural e de workflow (DevOps/CI).
- **Dívida que bloqueia go-live:** TD-01 e TD-03 precisam de resolução mínima (quarentena ou prova de desacoplamento) para garantir que um deploy do Core (`api`, `web`, `worker`, `database`) ocorra confiavelmente.
- **Dívida que bloqueia escala:** TD-02 impede uma evolução sustentável dos serviços de IA.
- **Dívida que aumenta custo de manutenção:** A estrutura misturada exige que desenvolvedores processem muito ruído antes de saber o que devem alterar ou testar.
