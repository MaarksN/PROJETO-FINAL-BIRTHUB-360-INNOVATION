# F5 — DÍVIDA TÉCNICA

## Top Riscos Técnicos

Esta seção condensa a dívida técnica atual do `BIRTHUB 360`, cobrindo as seguintes categorias primárias identificadas no ecossistema atual:

### 1. Dívida Arquitetural (Grau de Risco: Crítico)
- **Monolito de Agentes Não Escalonáveis:** Dezenas de agentes (Python) vivem na pasta `/agents` sem um runtime unificado. Alguns agentes possuem scripts em `worker.ts` enquanto a lógica core está em `agent.py`. Essa miscelânea de linguagens dentro da mesma unidade funcional é um pesadelo de manutenção. O `package.json` refere-se a workers em Typescript (`tsx agents/ldr/worker.ts`), ignorando completamente o ciclo de vida Python no ecossistema node.
- **Acoplamento a Pacotes Fragmentados:** Pacotes como `agent-runtime`, `agent-packs`, `agents-core` e `agents-registry` concorrem pelo escopo da orquestração de agentes.

### 2. Dívida de Código (Grau de Risco: Alto)
- **Código Morto/Ausência de Cobertura:** Grande parte do diretório de `/agents` não sobrevive a nenhuma rastreabilidade funcional e é puramente descartável (ver F3). Muitos módulos Python não contêm suites de testes E2E correspondentes (ou se há, estão defasados). A varredura revelou a existência de cerca de 39 ocorrências do termo `hack` na base de código, sugerindo contornos imperfeitos ou adaptações provisórias.
- **Falta de Padronização:** O projeto quebra convenções, nomeando pastas de Python com `kebab-case` (`pos-venda`) em vez do padrão obrigatório `snake_case` exigido pelas regras de governança e ferramentas de linting (`pytest`, autodiscover do Python).

### 3. Dívida DevOps / CI / CD (Grau de Risco: Crítico)
- **Dependências Fantasmas no Sandbox:** A complexidade da esteira de automação CI (`scripts/ci/*`) assume um nível de isolamento ideal. No ambiente de CI ou em validações, os pacotes Python falharão a não ser que os módulos (`pytest`, `httpx`, `langgraph`) sejam instalados num interpretador nativo do repositório (ex: `pyenv`).
- Os timeouts do CI (`timeout-minutes: 15` para dezenas de packages e agents massivos) correm sério risco de causar ociosidade e pipeline stalling dada a carga enorme de pacotes (muitos deles não essenciais/não core).
- O monorepo possui referências circulares ou *workspaces* complexos demais para o Next.js gerenciar facilmente sem forçar `transpilePackages` e `export` flags.

### 4. Dívida de Segurança e Dados (Grau de Risco: Médio-Alto)
- A presença de arquivos de cache, log e artefatos pode poluir os pipelines e expor dados não desejados caso sejam empacotados num Dockerfile sem `dockerignore` rigoroso. (Embora exista um `.gitleaks.toml` cobrindo secret-scanning).
- O uso de referências inseguras a DB/infra em `.env.example` requer um expurgo das credenciais default não *mockadas* durante o Trivy scan, o que já foi detectado como falha cíclica anterior.

## Sumário e Prioridades
A prioridade máxima é remover as unidades redundantes, migrar/padronizar agentes em uma estrutura enxuta (`snake_case`) e reestruturar o runner Python x TypeScript.