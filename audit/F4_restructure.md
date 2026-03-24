# F4 — REORGANIZAÇÃO ARQUITETURAL E ESTRUTURAL

## Estrutura Atual vs Ideal

### Situação Atual
O repositório abriga aplicações de níveis variados de maturidade e ciclo de vida dentro de diretórios "flat":
- `apps/` abriga o Core, o Legado e os Satélites indiscriminadamente.
- `packages/` tem duplicatas de banco (`database` vs `db`) e múltiplos pacotes de agentes.
- `agents/`, `.github/agents/`, `packages/agents/` poluem a raiz e os fluxos de trabalho do monorepo.
- `docs/` mistura runbooks, guides antigos, e artefatos de saída (outputs de IAs).

### Proposta de Árvore-alvo

A taxonomia deve separar fisicamente o que é core produtivo do que é legado ou experimental:

```text
/ (Monorepo Root)
├── apps/
│   ├── web/                     # Core: Frontend SaaS Canonico
│   ├── api/                     # Core: Backend API Canonico
│   ├── worker/                  # Core: Orquestrador assíncrono Canonico
│   ├── .legacy/                 # Pasta de quarentena
│   │   ├── dashboard/           # Legado em sunset
│   │   ├── api-gateway/         # Legado em sunset
│   │   └── agent-orchestrator/  # Legado em sunset
│   └── .satellites/             # Aplicações periféricas não-core
│       ├── voice-engine/
│       └── webhook-receiver/
├── packages/
│   ├── database/                # Core: Prisma ORM e Seeds
│   ├── agent-packs/             # Core: Manifestos Canônicos de Agentes
│   ├── shared/
│   ├── config/
│   └── .legacy/
│       └── db/                  # Legado em sunset
├── docs/                        # Apenas doc funcional e runbooks
├── audit/                       # Apenas evidências e checks de controle
├── infra/                       # IaC e Observabilidade
└── scripts/                     # Automações de CI/CD e governança
```

*(Obs: Os agentes soltos que hoje vivem em `agents/` e `.github/agents/` devem ser migrados para o formato `agent-packs/` se validados, ou removidos).*

## Mapa "Manter / Mover / Consolidar / Sunset / Remover"

| Item | Ação | Destino / Justificativa |
| --- | --- | --- |
| `apps/web` | **MANTER** | Core canônico. |
| `apps/api` | **MANTER** | Core canônico. |
| `apps/worker` | **MANTER** | Core canônico. |
| `packages/database` | **MANTER** | Core canônico. |
| `packages/agent-packs` | **MANTER** | Core canônico de agentes. |
| `apps/dashboard` | **SUNSET** | Mover para `apps/.legacy/dashboard` e planejar desligamento. |
| `apps/api-gateway` | **SUNSET** | Mover para `apps/.legacy/api-gateway` e planejar desligamento. |
| `apps/agent-orchestrator` | **SUNSET** | Mover para `apps/.legacy/agent-orchestrator` e planejar desligamento. |
| `packages/db` | **SUNSET** | Mover para `packages/.legacy/db` e planejar desligamento. |
| `apps/voice-engine` | **MOVER** | Mover para `apps/.satellites/voice-engine`. |
| `apps/webhook-receiver` | **MOVER** | Mover para `apps/.satellites/webhook-receiver`. |
| `.github/agents/*` | **REMOVER** | Prompts órfãos, não pertencem ao repo e quebram a pipeline. |
| `agents/*` | **CONSOLIDAR** | Analisar e os que valerem a pena migram para `packages/agent-packs/`. O resto é REMOVER. |
| `prompt_soberano*.html` | **REMOVER** | Lixo na raiz. |
| `docs/programs/*` e artefatos de ciclos | **MOVER** | Para diretório de `docs/.archive/` se for registro histórico. |

---

## RELATÓRIO F4

- **Estrutura atual vs ideal:** A estrutura atual é "flat" e esconde a dívida técnica misturando core e legado. A ideal introduz quarentenas `.legacy` e `.satellites`.
- **Problemas de arquitetura:** O core depende (ou finge não depender) do legado pois eles convivem no mesmo layer de acesso e pacotes compartilhados.
- **Ganhos esperados:** Claridade visual extrema. Onboarding mais rápido. Menos falso-positivos de testes em código morto. Ferramentas como o turborepo poderão focar e buildar estritamente o core.
- **Riscos de migração:** Mover pastas fisicamente pode quebrar imports relativos ou configurações estáticas de containers e workflows do GitHub se não houver um refactor acoplado.
- **Sequência sugerida de execução:**
  1. Configurar paths customizados (se necessário) no `tsconfig.json` raiz para suportar `.legacy` se mantidos no workspace.
  2. Mover arquivos transientes/removíveis para fora.
  3. Mover componentes de Satélites e Legado para suas pastas de quarentena.
  4. Ajustar workflows e dependências internas.
