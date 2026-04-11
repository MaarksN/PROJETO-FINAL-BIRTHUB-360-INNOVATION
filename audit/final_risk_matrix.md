# MATRIZ DE RISCOS — BirthHub 360

**Data:** 2026-04-11
**Auditor:** Antigravity (Forensic Staff+ Auditor)

---

## Legenda

| Cor | Nível | Definição |
|-----|-------|-----------|
| 🔴 | CRÍTICO | Impede produção. Risco de falha sistêmica ou perda de dados. |
| 🟠 | ALTO | Risco significativo. Pode causar incidentes em produção. |
| 🟡 | MÉDIO | Débito técnico que gera fricção operacional. |
| 🔵 | BAIXO | Melhoria desejável sem impacto direto em produção. |

---

## RISCOS CRÍTICOS 🔴

| ID | Risco | Probabilidade | Impacto | Localização | Ciclo |
|----|-------|--------------|---------|-------------|-------|
| R-001 | Type safety inexistente por `@ts-nocheck` — erros de tipo silenciosos em runtime | CERTA | CATASTRÓFICO | 200+ files em apps/ e packages/ | 1-7 |
| R-002 | Voice Engine vendido como funcional mas é mock — risco legal | CERTA | CATASTRÓFICO | `apps/voice-engine/src/server.ts` | 2 |
| R-003 | Refresh tokens perdidos em restart — todos os utilizadores deslogados | ALTA | GRAVE | `packages/auth/index.ts:21` | 1 |
| R-004 | Refresh tokens não sincronizados entre instâncias — auth fails em multi-instance | ALTA | GRAVE | `packages/auth/index.ts:21` | 1 |
| R-005 | Memory leak no refresh store — Map cresce indefinidamente | MÉDIA | GRAVE | `packages/auth/index.ts:21` | 1 |

---

## RISCOS ALTOS 🟠

| ID | Risco | Probabilidade | Impacto | Localização | Ciclo |
|----|-------|--------------|---------|-------------|-------|
| R-006 | Sem release evidence — rollback não verificável | ALTA | MODERADO | `releases/evidence/` | 7 |
| R-007 | Agent policies perdidas em restart | ALTA | MODERADO | `packages/agents-core/policy/` | 5 |
| R-008 | Cookies de sessão sem Secure flag — interceptação possível | MÉDIA | GRAVE | `apps/web/lib/auth-client.ts` | 4 |
| R-009 | Sem circuit breaker em integrações — cascading failures | MÉDIA | MODERADO | `packages/integrations/` | 3 |
| R-010 | Usage metering não gera cobrança — revenue leakage | ALTA | MODERADO | API billing module | 6 |

---

## RISCOS MÉDIOS 🟡

| ID | Risco | Probabilidade | Impacto | Localização | Ciclo |
|----|-------|--------------|---------|-------------|-------|
| R-011 | Import path relativo quebra em refactor | MÉDIA | BAIXO | `apps/web/lib/auth-client.ts:5` | 4 |
| R-012 | Legacy localStorage pode confundir lógica de sessão | BAIXA | BAIXO | `apps/web/lib/session-context.ts` | 4 |
| R-013 | Elasticsearch dev sem auth — data leak em ambiente compartilhado | BAIXA | MODERADO | `docker-compose.yml` | 1 |
| R-014 | Dead billing package confunde desenvolvedores | MÉDIA | BAIXO | `packages/billing/` | 6 |
| R-015 | Typecheck CI job é teatro de segurança | CERTA | MODERADO | CI pipeline | 7 |
| R-016 | Default tenant ID "default-tenant" hardcoded no worker | MÉDIA | MODERADO | `apps/worker/src/worker.ts:152` | 1 |
| R-017 | Barge-in logic no voice engine é boolean manual | ALTA | BAIXO | `voice-engine/server.ts:134` | 2 |

---

## RISCOS BAIXOS 🔵

| ID | Risco | Probabilidade | Impacto | Localização | Ciclo |
|----|-------|--------------|---------|-------------|-------|
| R-018 | opossum dependency unused — dependency bloat | BAIXA | MÍNIMO | `package.json` | 3 |
| R-019 | CHANGELOG.md files são placeholders genéricos | BAIXA | MÍNIMO | apps/*/CHANGELOG.md | 0 |
| R-020 | Python test deps não pinned | MÉDIA | MÍNIMO | `requirements-test.txt` | 7 |

---

## MAPA VISUAL DE RISCO

```
              Impacto
              █████████████████████████████████████
              █                                   █
    ALTO      █   R-001  R-002                    █
              █   R-003  R-004  R-005             █
              █                                   █
              █-----------+-----------+-----------█
              █   R-008      R-006  R-007         █
    MODERADO  █   R-009      R-010                █
              █   R-015      R-016                █
              █-----------+-----------+-----------█
              █   R-011  R-012  R-014             █
    BAIXO     █   R-017  R-018  R-019  R-020      █
              █                                   █
              █████████████████████████████████████
                BAIXA     MÉDIA     ALTA     CERTA
                          Probabilidade
```

---

## CONCENTRAÇÃO POR CICLO

| Ciclo | 🔴 | 🟠 | 🟡 | 🔵 | Total |
|-------|-----|-----|-----|-----|-------|
| Fase 0 | 0 | 0 | 1 | 1 | 2 |
| Fase 1 | 3 | 0 | 1 | 0 | 4 |
| Ciclo 2 | 1 | 0 | 1 | 0 | 2 |
| Ciclo 3 | 0 | 1 | 0 | 1 | 2 |
| Ciclo 4 | 0 | 1 | 2 | 0 | 3 |
| Ciclo 5 | 0 | 1 | 0 | 0 | 1 |
| Ciclo 6 | 0 | 1 | 1 | 0 | 2 |
| Ciclo 7 | 1 | 1 | 1 | 1 | 4 |
| **Total** | **5** | **5** | **7** | **3** | **20** |

O ciclo de maior risco concentrado é **Fase 1 + Ciclo 2** devido ao combo auth in-memory + voice engine mock. O risco R-001 (`@ts-nocheck`) é transversal a TODOS os ciclos.
