# 1. RESUMO EXECUTIVO DO CICLO 0
- Scorecard por dimensão (0–10):
  - snapshot: 6
  - inventario: 8
  - tipagem: 0
  - build_runtime: 8
  - env: 3
  - testes: 8
  - deps: 7
- Total de achados por severidade: P0=1 P1=3 P2=0 P3=0
- Gatilhos de bloqueio ativados: Mais de 3 arquivos @ts-nocheck no core canônico

# 2. ESTADO GIT E SNAPSHOT
- Branch: main
- SHA: ea6180d52412dcab1f5399abafd24781800afb0b
- Dirty state: {"is_dirty":true,"modified":[],"untracked":[".ops/tools/generate_cycles.js"],"staged":[]}
- Último commit: MaarksN em 2026-04-18T10:51:12-03:00

# 3. INVENTÁRIO GLOBAL
- packageManager(root): pnpm@9.15.9
- executáveis: {"pnpm":"9.15.9","npm":"11.11.0"}
- lockfiles: pnpm-lock.yaml
- workspaces declarados: 23 | reais: 23
- contagem arquivos: {"ts":824,"tsx":135,"py":19,"tests":415,"configs":26,"dockerfiles":9,"workflows":12}

# 4. NÚCLEO CANÔNICO IDENTIFICADO
- apps/api: presente; evidência: apps/api/package.json
- apps/web: presente; evidência: apps/web/package.json
- apps/worker: presente; evidência: apps/worker/package.json
- packages/config: presente; evidência: packages/config/package.json
- packages/database: presente; evidência: packages/database/package.json
- packages/logger: presente; evidência: packages/logger/package.json

# 5. ÁREAS SUSPEITAS, LEGADO E RUÍDO
- packages/agents-core => SUSPEITO ATÉ PROVA (INCONCLUSIVO)
- packages/workflows-core => SUSPEITO ATÉ PROVA (INCONCLUSIVO)
- packages/testing => SUSPEITO ATÉ PROVA (INCONCLUSIVO)
- apps/legacy => LEGADO (QUARENTENA)
- apps/legacy/dashboard => LEGADO (QUARENTENA)
- audit => EVIDÊNCIA / DOCUMENTAÇÃO (SOBREVIVE)
- artifacts => EVIDÊNCIA / DOCUMENTAÇÃO (SOBREVIVE)
- docs => EVIDÊNCIA / DOCUMENTAÇÃO (SOBREVIVE)
- scripts => SATÉLITE ÚTIL (INVESTIGAR)
- tests => SATÉLITE ÚTIL (INVESTIGAR)
- infra => SATÉLITE ÚTIL (INVESTIGAR)
- releases => SATÉLITE ÚTIL (INVESTIGAR)
- ops => SATÉLITE ÚTIL (INVESTIGAR)
- .tools => SUSPEITO ATÉ PROVA (INVESTIGAR)
- .ops/quarantine/runtime-noise/root-files => RUÍDO OPERACIONAL (QUARENTENA)

# 6. VARIÁVEIS DE AMBIENTE E SEGREDOS
- arquivos .env* no disco: 17
- variáveis usadas não documentadas: 76
- variáveis documentadas não usadas: 83
- segredos reais commitados: [INCONCLUSIVO]
- segredos/credenciais potenciais detectados por heurística: 272

# 7. ESTADO DOS TESTES
- frameworks detectados: ["supertest","@playwright/test","c8","pytest"]
- arquivos de teste detectados: 415
- marcas skip/TODO: 29
- CI com continue-on-error em algum workflow: false

# 8. SAÚDE DAS DEPENDÊNCIAS
- lockfile presente: true
- múltiplos lockfiles: false
- dependências com versões divergentes: 3
- dependencies com ferramentas dev: 1
- runtime em devDependencies: 3
- refs patch/file/link/portal/*/latest: 0
- sincronia lockfile vs package.json: [INCONCLUSIVO]

# 9. SUPRESSÕES DE TIPAGEM CRÍTICAS
| arquivo | tipo | severidade | contexto |
|---|---|---|---|
| apps/api/src/lib/prisma-json.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/agents/metrics.service.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/agents/queue.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/agents/router.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/agents/service.config.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/agents/service.execution.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/agents/service.policy.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/agents/service.repository.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/agents/service.snapshot.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/agents/service.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/agents/service.types.ts:1 | ts-nocheck | CRITICAL | contract |
| apps/api/src/modules/analytics/analytics.types.ts:1 | ts-nocheck | CRITICAL | contract |
| apps/api/src/modules/analytics/analytics.utils.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/analytics/dashboard.service.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/analytics/reporting.service.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/analytics/schemas.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/analytics/service.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/analytics/usage.service.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/auth/auth.service.credentials.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/auth/auth.service.keys.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/auth/auth.service.policies.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/auth/auth.service.sessions.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/auth/auth.service.shared.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/auth/auth.service.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/auth/cookies.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/auth/crypto.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/auth/mfa.service.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/billing/limit-exceeded.error.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/billing/plan.utils.ts:1 | ts-nocheck | CRITICAL | domain |
| apps/api/src/modules/billing/service.checkout.ts:1 | ts-nocheck | CRITICAL | domain |

# 10. INCOERÊNCIAS BUILD / START / EXPORT / DIST
| pacote | dimensão | declarado | real | incoerência |
|---|---|---|---|---|
| @birthub/api | runtime | node dist/apps/api/src/server.js | docker=CMD ["pnpm", "start"] ci=null | nenhuma |
| @birthub/web | runtime | next start -p 3001 | docker=CMD ["node", "server.js"] ci=.github/workflows/ci.yml: node scripts/ci/check-web-inline-style-freeze.mjs | nenhuma |
| @birthub/worker | runtime | node dist/apps/worker/src/index.js | docker=CMD ["pnpm", "start"] ci=null | nenhuma |
| @birthub/config | runtime | null | docker=null ci=.github/workflows/cd.yml: gcloud auth configure-docker "${{ vars.GCP_ARTIFACT_REGISTRY_REGION }}-docker.pkg.dev" --quiet | nenhuma |
| @birthub/database | runtime | null | docker=null ci=null | nenhuma |
| @birthub/logger | runtime | null | docker=null ci=null | nenhuma |

# 11. MATRIZ PRELIMINAR DE SOBREVIVÊNCIA
- SOBREVIVE: 9
- QUARENTENA: 3
- INVESTIGAR: 6
- INCONCLUSIVO: 3

# 12. RISCOS P0 / P1 ENCONTRADOS
1. [P0] Árvore Git não está limpa; há 1 entrada(s) no status e pelo menos um conflito operacional em [INCONCLUSIVO].
2. [P1] 76 variável(is) usadas no código não estão documentadas em arquivos .env* rastreados.
3. [P1] Há 272 ocorrência(s) heurísticas de segredo/credencial; autenticidade real segue [INCONCLUSIVO].
4. [P1] 543 supressão(ões) críticas de tipagem foram localizadas.

# 13. PRONTIDÃO PARA ENTRAR NO CICLO 1
- Pré-requisitos cumpridos: snapshot, inventário, mapas e matrizes foram regenerados no estado atual.
- Pendências: Mais de 3 arquivos @ts-nocheck no core canônico

# 14. VEREDITO EXECUTIVO
## VEREDITO EXECUTIVO

**Status:** [NÃO APTO PARA AVANÇAR]

**Scorecard:**
| Dimensão | Score (0–10) | Observação |
|---|:---:|---|
| Snapshot / Git | 6 | Árvore Git suja; snapshot continua rastreável. |
| Inventário | 8 | Inventário regenerado a partir de arquivos rastreados, sem contaminar com node_modules. |
| Tipagem | 0 | 543 supressões críticas localizadas. |
| Build / Runtime | 8 | 0 incoerência(s) identificada(s) no core. |
| Env / Segredos | 3 | 272 ocorrência(s) heurísticas; segredo real segue não provado. |
| Testes | 8 | 161 arquivo(s) de teste no core canônico. |
| Dependências | 7 | Lockfile presente; sincronia não provada automaticamente. |
| **TOTAL** | 5.7 | média simples |

**Gatilhos de bloqueio ativados:** [Mais de 3 arquivos @ts-nocheck no core canônico]

**Justificativa:**
1. O snapshot anterior estava defasado e não descrevia o HEAD atual. 2. O estado agora foi recalculado sobre o commit ea6180d52412dcab1f5399abafd24781800afb0b. 3. Persistem riscos objetivos de tipagem, coerência operacional e governança Git. 4. Segredo real commitado não foi provado; o que existe são sinais fortes, mas ainda heurísticos. 5. Avançar sem tratar ou aceitar esses pontos mantém o repositório sob restrição técnica.

**Condições para avançar ao Ciclo 1:**
1. Resolver o estado Git conflitado/sujo e congelar um novo baseline limpo.
2. Tratar ou aceitar formalmente os gatilhos de bloqueio remanescentes.

