# F7 — ROADMAP DE FINALIZAÇÃO DA PLATAFORMA

## Diretrizes do Roadmap
Este roadmap visa a remediação sistemática dos problemas estruturais, de dívida técnica e de bloqueadores de produção levantados de F1 a F6. A priorização obedece a ordem de urgência operacional e independência lógica:
- R1: Controles e Bloqueadores de Produção.
- R2: Eliminação do Banco Legado.
- R3: Organização, Limpeza de Agentes e Estrutura Físíca.
- R4: Observabilidade e Tolerância a Falhas.
- R5: Estabilização de Integrações e CI/CD Final.

## Estrutura em Ondas (Waves)

### R1 — Produção e Gates (Bloqueadores de Go-Live)
- **Objetivo:** Garantir que deploys para produção não aconteçam de forma cega ou baseada em dependências não saudáveis.
- **Evidências Atacadas:** Falta de `production-preflight`, `Readiness` em `apps/web` e `apps/worker` limitados.
- **Entregas Obrigatórias:**
  - Liveness/Readiness expostos em `apps/web` e `apps/worker` checando Banco (e fila, se aplicável).
  - Configuração de mocks/`.env.staging` para viabilizar e barrar execuções em CD caso variáveis falhem.
  - Job `production-preflight` implementado no `.github/workflows/cd.yml`.
- **Complexidade:** Média (exige testes em workflows locais, mas código é pequeno).
- **Duração Estimada:** 1 semana.
- **Dependências:** Nenhuma, deve ser o primeiro passo.

### R2 — Dados e Consolidar Dívida Transacional
- **Objetivo:** Proteger a integridade de dados unificando a fonte de acesso.
- **Evidências Atacadas:** A duplicidade `packages/db` e `packages/database`.
- **Entregas Obrigatórias:**
  - Migração total de referências `packages/db` em todo o workspace (`apps/api`, `apps/worker`, `packages/*`).
  - Deleção física do pacote `packages/db` e update do `package.json` de todos os consumidores.
- **Complexidade:** Alta (exige atenção total aos imports e rodar suíte de testes do banco).
- **Duração Estimada:** 1-2 semanas.
- **Dependências:** Resolução e aprovação do Pull Request para evitar merge conflicts amplos.

### R3 — Governança, Taxonomia e Limpeza do Sistema de Agentes
- **Objetivo:** Higienizar o repositório, aplicar taxonomia canônica, separar satélites e definir a "família" real de Agentes de IA.
- **Evidências Atacadas:** Pastas `.github/agents`, `agents/`, arquivos soltos `.html` e diretórios legados na raiz do `apps/`.
- **Entregas Obrigatórias:**
  - Consolidar runtime viável em `packages/agent-packs/`.
  - Remover todas as pastas mortas `.github/agents` e lixos soltos da raiz.
  - Criar pastas `.legacy` e `.satellites` dentro de `apps/` e mover referências, garantindo que `apps/` principal seja lido imediatamente como o core.
- **Complexidade:** Alta (volume extenso de arquivos, potencial quebra de imports relativos).
- **Duração Estimada:** 2 semanas.
- **Dependências:** Nenhuma forte, mas ideal que seja feita após garantir que o banco core (R2) já está limpo.

### R4 — Observabilidade e Readiness de Escalabilidade
- **Objetivo:** Monitorar as coisas certas e preparar o worker para volumes assíncronos maiores.
- **Evidências Atacadas:** Regras apontadas para legados (`alert.rules.yml`).
- **Entregas Obrigatórias:**
  - Revisão de regras prometheus baseadas apenas em `apps/api` e `apps/worker`.
  - Implementar painéis/regras focadas em latência de API e tamanho de Fila/Dead Letters do orquestrador.
- **Complexidade:** Média.
- **Duração Estimada:** 1 semana.
- **Dependências:** R3 (saber exatamente o escopo do código).

### R5 — Retirada do Legado e Fechamento de Go-No-Go
- **Objetivo:** Ensaiar um release candidate real, rodando pipelines full, auditorias forenses de dependências, e atestar o desligamento de dependências de frontend do legado.
- **Evidências Atacadas:** Dependência do Dashboard e Gateway.
- **Entregas Obrigatórias:**
  - Testes E2E rodando suavemente contra `apps/api` (sem mocks imperativos caso integrado à infra local).
  - Execução limpa do script de Rollback Rehearsal.
  - Aprovação do Board Executivo com base em `pnpm monorepo:doctor` e coverage final.
- **Complexidade:** Média.
- **Duração Estimada:** 1 semana.
- **Dependências:** R1, R2, R3, R4.

---

## RELATÓRIO F7

- **Complexidade Total:** Alta (reestruturação física, mudança de imports globais no banco, purga de milhares de linhas mortas de agentes).
- **Tempo Estimado:** 6 a 7 semanas de trabalho focadas (dependendo do tamanho do time atuando simultaneamente nas frentes).
- **Ordem Obrigatória:** R1 (Bloqueadores Operacionais) deve iniciar e finalizar antes das mudanças estruturais, pois protegerá a estabilidade da submissão do código (CI/CD rodando firme). R2 tem precedência imediata. R3 e R4 podem rodar em paralelo se o time for dividido (um em IA/Ops, outro em Data/Core).
- **Itens Não Paralelizáveis:** A migração do `packages/db` e a movimentação estrutural de pastas em R3. Ambas mudam imports massivamente. Tentar fazê-las em paralelo causará inferno de git rebase/merge.
- **Riscos de Sequencing:** Retardar os controles do R1 para o final pode fazer com que uma quebra introduzida durante a purga em R3 passe silenciosa pela esteira.
