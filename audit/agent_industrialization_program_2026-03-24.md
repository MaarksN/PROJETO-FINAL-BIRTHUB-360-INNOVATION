# Programa de Industrializacao de Agentes - 2026-03-24

## Decisao
Se a diretriz for **manter e elevar** todos os agentes, entao o repositorio precisa parar de tratar `.github/agents` como produto e passar a trata-lo como **fonte de origem** para geracao canonica.

O objetivo deixa de ser "ter 334 prompts" e passa a ser:
- ter 334 **agentes operacionalizados**
- com **manifest canônico**
- com **policy engine**
- com **tool adapters**
- com **pipeline de execucao**
- com **evidencia de uso**
- com **teste e telemetria**

## Regra de Ouro
Nenhum agente existe de verdade enquanto nao tiver os 7 artefatos abaixo:
1. `source prompt`
2. `manifest.json`
3. `tool adapter map`
4. `policy profile`
5. `worker binding`
6. `test evidence`
7. `runtime telemetry`

## Modelo Canonico
### Fonte
- `.github/agents/**/*.agent.md`
- `packages/agents/**/*`

### Compilacao
- `scripts/generate-official-collection.ts`
- novo passo de compilacao para converter fontes em manifests canonicos

### Destino
- `packages/agent-packs/corporate-v1/<agent-id>/manifest.json`
- `docs/agent-packs/<agent-id>.mdx`

### Runtime
- `apps/api/src/modules/marketplace/marketplace-service.ts`
- `apps/worker/src/agents/runtime.shared.ts`
- `packages/agents-core`

## Contrato Obrigatorio por Agente
Cada agente precisa ter:
- `agent.id`
- `agent.name`
- `agent.description`
- `agent.prompt`
- `tags.domain`
- `tags.persona`
- `tags.use-case`
- `skills[]` com `inputSchema` e `outputSchema`
- `tools[]` com `inputSchema`, `outputSchema` e `timeoutMs`
- `policies[]` com `actions`, `effect`, `id`, `name`
- `output format` explicitamente definido
- `guardrails`
- `fallback behavior`
- `approval rule` quando houver acao sensivel

## Evidencia de Uso Obrigatoria
Um agente so passa a existir no catalogo operacional se tiver:
- smoke test passando
- busca no marketplace retornando o agente
- execucao dry-run valida
- binding no worker
- log de runtime identificavel por `agent_id`
- documento de evidencias gerado

Evidencias minimas:
- `packages/agent-packs/test/*`
- `docs/agent-packs/*`
- `docs/evidence/agents-runtime.md`
- logs/telemetria por `agent_id`

## Integracao Obrigatoria
### Tool adapters
Cada agente precisa declarar ferramentas reais ou mockadas de forma rastreavel:
- crm
- calendar
- storage
- email
- http
- slack
- db read/write

Se a ferramenta for especifica de dominio, ela precisa ter:
- nome canônico
- schema de entrada
- schema de saida
- politica permitida
- timeout
- metrica de falha

### Policy engine
Toda execucao precisa passar por policy:
- `tool:execute`
- `memory:read`
- `memory:write`
- `approval:request`
- `audit:write`
- acoes especificas do dominio

### Pipeline de execucao
Cada agente precisa ser:
- carregavel via catalogo
- executavel no worker
- observavel por logs
- testavel via dry-run
- recuperavel via fallback

## O que muda no repositorio
### 1. `.github/agents` vira source, nao runtime
- manter apenas como entrada da fabrica
- parar de vende-los como agentes prontos

### 2. `packages/agent-packs` vira unica superficie canonica
- todo agente operacional vai parar aqui
- um agente sem pack nao entra em producao

### 3. `packages/agents` vira laboratorio tipado
- usar como fonte de contratos, schemas e few-shots
- promover para `agent-packs` so quando houver runtime e evidencia

### 4. `agents/*` vira trilha de migracao
- cada agente legado deve mapear para um pack canonico
- quando o pack estiver pronto, o legado sai

## Gates de Qualidade Extrema
Um agente falha no gate se:
- nao tiver manifest
- nao tiver skill schema
- nao tiver tool schema
- nao tiver policy
- nao tiver output estruturado
- nao tiver smoke test
- nao tiver docs geradas
- nao tiver evidencias de runtime
- nao tiver owner claro
- nao tiver rationale de uso

## Ordem de Execucao Recomendada
1. Expandir a fabrica canônica de 43 para 334 agentes.
   - basear em `scripts/generate-official-collection.ts`
   - usar `.github/agents` e `packages/agents` como entrada
2. Criar um mapeamento `source -> canonical pack`.
   - um slug de origem, um `agent_id` canônico
3. Gerar manifests, docs e smoke tests em lote.
4. Criar binding no worker por categoria.
   - prospection
   - qualification
   - closing
   - onboarding
   - retention
   - analytics
   - orchestration
5. Adicionar verificador de readiness.
   - coverage de manifest
   - coverage de docs
   - coverage de dry-run
   - coverage de runtime binding
6. So depois disso discutir remocao ou consolidacao por performance real.

## Criterio de Pronto
Um agente esta pronto quando:
- aparece no marketplace
- roda no worker
- passa no smoke test
- tem policy aplicada
- tem ferramenta mapeada
- produz output estruturado
- gera evidencia de execucao
- tem dono operacional

## Posicao Arquitetural
Se voce quer manter os 334, eu concordo com a ambicao.

Mas tecnicamente isso exige:
- **fabrica**
- **padrao**
- **gate**
- **telemetria**

Sem isso, voce nao tem 334 agentes.
Voce tem 334 arquivos.
