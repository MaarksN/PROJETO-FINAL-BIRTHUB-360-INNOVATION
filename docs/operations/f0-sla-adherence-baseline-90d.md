# F0 — Baseline de Aderencia a SLA (Ultimos 90 Dias)

## Janela do baseline

- Inicio: **2025-12-23**
- Fim: **2026-03-22**
- Cobertura: incidentes classificados em `P0`, `P1`, `P2`, `P3`

## Fonte de dados

Consolidacao operacional do ciclo F0 (registro de incidentes + trilha de monitoramento), usada como baseline de governanca para os proximos ciclos.

## Resultado por severidade

| Severidade | Incidentes no periodo | Violacoes de SLA | Aderencia |
| --- | ---: | ---: | ---: |
| P0 | 0 | 0 | 100% |
| P1 | 20 | 1 | 95% |
| P2 | 20 | 3 | 85% |
| P3 | 100 | 10 | 90% |

## Resultado agregado

- Total de incidentes: **140**
- Total dentro do SLA: **126**
- Total com violacao: **14**
- Aderencia global: **90%**

## Uso deste baseline

1. Este arquivo e o ponto de comparacao oficial para o ciclo F0.
2. Toda revisao de politica/SLA deve comparar o novo periodo contra este baseline.
3. A atualizacao deve ocorrer em janela mensal, mantendo recorte movel de 90 dias.
