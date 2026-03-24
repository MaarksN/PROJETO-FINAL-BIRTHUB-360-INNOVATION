# F6 — GAPS DE PRODUÇÃO

## Avaliação de Prontidão

Esta etapa elenca falhas ou barreiras identificadas para um go-live ou release consistente.

### 1. GAPs de Deploy (Build e Imagens)
- O monorepo possui múltiplos `Dockerfile` (em `apps/api`, `apps/web`, e `apps/worker`), e há arquivos em `scripts/release/`. A infraestrutura de CI/CD não abrange o lado Python ou integra agentes de maneira clara.
- O worker Node consegue carregar os módulos, mas não há um container dedicado ou script óbvio para as imagens de agentes em Python. Há o comando `agents:industrialize:github`, porém seu contrato/runtime de prod não está unificado ao backend Node.

### 2. GAPs de Preflight e Saúde do Ambiente
- Há scripts robustos para pré-validação do banco de dados (`test:db:baseline`, `db:validate:pr`) e preflight de releases (`release:preflight:production`). Contudo, o ambiente exige variáveis de ambiente corretas e isoladas (`.env.vps`) que precisam ser orquestradas no `docker-compose.prod.yml`.
- Caso credenciais `sk_test_` e outras chaves vazem da infraestrutura e sejam detectadas pelas regras de Trivy no CI, elas abortarão o processo de push caso não adicionem o sufixo `_mock`.

### 3. GAPs em Testes E2E (End-to-End)
- O painel/aplicativo web e o dashboard legado têm dependência alta de chamadas gRPC/REST a serviços não triviais (a não ser que rode em modo estático com proxy ativo).
- Não há orquestração clara que permita E2E *cross-agente*. Ou seja, testes que instanciam `ldr`, alimentam-no, passam por `sdr` e depois por `ae`. Cada módulo de agente tem seu próprio diretório de testes (`agents/ldr/tests`, `agents/ae/tests`), indicando forte fragmentação e provável ausência de testes E2E reais de ponta-a-ponta para os fluxos essenciais.

### 4. GAPs de Rollback
- Scripts como `release:migrate` existem e efetuam tarefas de Prisma. Mas, para um sistema em que o banco central armazena a memória e logs dos múltiplos agentes de conversação (via SQLite, PostgreSQL ou similar usando LangGraph/SVIX), estratégias de rollback na tabela de estado de agentes não estão documentadas e representam risco se corromperem dados correntes de workflows longos.

## Conclusão de Bloqueadores para Go-Live
- **Bloqueador Primário:** A falta de empacotamento do runtime Python de agentes. Sem expurgo da duplicação massiva listada na Fase F3, não é viável garantir estabilidade para uma esteira de produção que orquestra tudo.
- É mandatório efetuar a purga, centralizar os módulos Python viáveis, padronizar o orquestrador worker em Node para acionar chamadas unificadas aos agentes Python, e ajustar/estressar os scripts de preflight (`preflight:core`).