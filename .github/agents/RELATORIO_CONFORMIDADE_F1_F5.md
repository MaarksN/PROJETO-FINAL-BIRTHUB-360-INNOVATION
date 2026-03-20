# Relatório Automático de Conformidade F1–F5

- Data: 2026-03-20
- Escopo: `.github/agents/cycle-01` até `.github/agents/cycle-15`
- Total de arquivos `.agent.md` analisados: 331
- Total de não conformidades: 45

## Critérios F1–F5 aplicados
- **F1 Descoberta**: `description` obrigatório e iniciando com `Use when`.
- **F2 Contrato**: `name`, `tools`, `user-invocable:true`, seções `Escopo`, `Restrições`, `Saída Obrigatória`.
- **F3 Prompting**: presença de saída numerada `1.`, `2.`, `3.`.
- **F4 Implementação**: frontmatter válido, contagem esperada por ciclo, consistência de slug do arquivo com `name`.
- **F5 Validação cruzada**: presença de `README.md` por ciclo.

## Cobertura por ciclo
| Ciclo | Esperado | Encontrado | README |
|---|---:|---:|:---:|
| cycle-01 | 25 | 25 | True |
| cycle-02 | 25 | 25 | True |
| cycle-03 | 15 | 15 | True |
| cycle-04 | 15 | 15 | True |
| cycle-05 | 20 | 20 | True |
| cycle-06 | 20 | 20 | True |
| cycle-07 | 22 | 22 | True |
| cycle-08 | 22 | 22 | True |
| cycle-09 | 35 | 35 | True |
| cycle-10 | 31 | 31 | True |
| cycle-11 | 30 | 30 | True |
| cycle-12 | 18 | 18 | True |
| cycle-13 | 17 | 17 | True |
| cycle-14 | 18 | 18 | True |
| cycle-15 | 18 | 18 | True |

## Não conformidades por severidade
| Severidade | Qtde |
|---|---:|
| Critical | 0 |
| High | 0 |
| Medium | 0 |
| Low | 45 |

## Resultado por fase (arquivos em conformidade)
| Fase | Passou | Falhou |
|---|---:|---:|
| F1 | 331 | 0 |
| F2 | 331 | 0 |
| F3 | 331 | 0 |
| F4 | 286 | 45 |
| F5 | 331 | 0 |

## Achados por severidade

### Low (45)
- Regra única observada: `F4-SlugMismatch` (diferença entre slug do arquivo e slug derivado de `name` em casos com siglas/acrônimos).
- Distribuição por ciclo:

| Ciclo | Qtde |
|---|---:|
| cycle-01 | 5 |
| cycle-02 | 1 |
| cycle-05 | 3 |
| cycle-06 | 2 |
| cycle-07 | 4 |
| cycle-08 | 3 |
| cycle-09 | 6 |
| cycle-10 | 6 |
| cycle-11 | 5 |
| cycle-12 | 3 |
| cycle-13 | 1 |
| cycle-14 | 4 |
| cycle-15 | 2 |

## Conclusão
- Não há não conformidades **Critical**, **High** ou **Medium**.
- Os ciclos estão completos em quantidade e com README presente.
- As 45 não conformidades **Low** são padronizações de slug e não bloqueiam uso funcional dos agentes.

## Anexo técnico
- Detalhamento completo dos 45 achados: `RELATORIO_CONFORMIDADE_F1_F5.json`
