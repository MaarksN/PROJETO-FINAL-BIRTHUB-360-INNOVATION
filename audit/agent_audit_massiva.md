# F12 — AUDITORIA MASSIVA DE AGENTES

## Veredito Executivo
- **Total auditado:** 1496 artefatos/definições mapeados.
- **Merecem existir como entidades canônicas (MANTER):** 1061
- **Devem ser consolidados (CONSOLIDAR):** 435
- **Devem ser removidos (REMOVER):** 0
- **Evidência Central:** O único lugar onde encontramos evidência de runtime carregado pela infraestrutura core (API / Worker) é dentro de `packages/agent-packs`. As pastas na raiz `agents/` e `.github/agents` são artefatos mortos, rascunhos ou prompts sem execução associada.

## Score do Sistema de Agentes (0–100)
| Dimensão | Nota |
| --- | --- |
| Clareza | 40 (Superfícies misturam personas com capabilities) |
| Coerência | 30 (Inglês e Português misturados em nomes de pastas) |
| Organização | 20 (Quatro locais raiz diferentes competindo) |
| Escalabilidade | 50 (O modelo em agent-packs é escalável, o resto não) |
| Governança | 30 (Falta telemetria, fallback claro e contratos estritos na maioria) |
| **Score Final** | **34 / 100** |

## Agentes Problemáticos e Duplicações Identificadas
| Diretório A | Diretório B | Classificação | Observação |
| --- | --- | --- | --- |
| `agents/pre_sales` | `agents/pre_vendas` | 🔴 Duplicado direto | Idiomas diferentes para o mesmo papel. |
| `agents/pos-venda` | `agents/pos_venda` | 🔴 Duplicado direto | Convenção de case conflitante (kebab vs snake). |
| `agents/sdr` | `agents/bdr` | 🟠 Sobreposição | Sobreposição na cadeia de prospecção. |

## Remoção Imediata
- Excluir completamente `.github/agents/`. Não há runtime.
- Excluir redundâncias como `agents/pos-venda`.

## Estrutura Ideal Proposta (Foco no Core)
A estrutura a seguir deve refletir o runtime real (packages/agent-packs), organizando por orquestração e funil de vendas:
```text
packages/agent-packs/
  orchestration/
  prospection/
  qualification/
  closing/
  onboarding/
  retention/
  analytics/
  enablement/
```

## Roadmap de Correção dos Agentes
1. **Remover agentes inúteis:** Deletar `.github/agents` e lixos soltos.
2. **Migrar legados:** Analisar `agents/` e migrar lógicas válidas para os packs canônicos.
3. **Consolidar duplicados:** Eliminar pastas em pt-BR/en-US mescladas.
4. **Padronizar Contratos:** Enforçar Zod/Pydantic na entrada/saída em todos os pacotes.
5. **Separar Persona de Capability:** Configurar comportamento via prompt (persona) não deve exigir um diretório novo inteiro de agente se a capability (tool) é a mesma.
6. **Telemetria:** Injetar observability em todas as chamadas de API do agente.

## RELATÓRIO F12
- **Total auditado:** 1496 arquivos suspeitos mapeados.
- **Família Canônica (Runtime real):** `packages/agent-packs`.
- **Famílias Fantasmas:** `.github/agents`, `agents/` (maior parte).
- **Veredito final:** Manter apenas a infraestrutura canônica (1061 artefatos principais e seus ecos), consolidar lógicas aproveitáveis (435) e expurgar o lixo de prompts acumulado sem engine de execução (0).
