# F2 — RASTREABILIDADE

## Cruzamento e Rastreabilidade

Nesta fase foi avaliado o cruzamento de domínios dos agentes e a organização do código versus o runtime (ex. scripts no `package.json` vs diretórios reais).

### GAPs de Domínios em Agentes

Identificou-se uma grave fragmentação nos domínios de negócio definidos para os agentes. Múltiplos diretórios representam a mesma função de negócio ou têm nomenclatura mal definida, violando a rastreabilidade do sistema.

| Domínio/Diretório | Tipo de Problema | Ocorrências em código | Classificação | Ação Proposta |
|---|---|---|---|---|
| `pos_venda` | Duplicação de escopo | ~25 referências | PARCIAL | Consolidar |
| `pos-venda` | Duplicação de escopo | ~8 referências | ÓRFÃO | Remover em favor de `pos_venda` (padrão `snake_case`) |
| `pre_sales` | Mistura de idioma | ~15 referências | PARCIAL | Consolidar |
| `pre_vendas` | Mistura de idioma | ~7 referências | ÓRFÃO | Remover em favor de uma nomenclatura unificada |
| `analista` | Nome genérico | - | ÓRFÃO | Remover / Absorver funções em domínios reais (ex: SDR/LDR) |
| `gerente_comercial` | Nome genérico | - | ÓRFÃO | Remover |
| `coordenador_comercial` | Nome genérico | - | ÓRFÃO | Remover |
| `copywriter` | Nome genérico | - | ÓRFÃO | Remover ou migrar para `marketing` |
| `executivo_negocios` | Duplicação de escopo | - | ÓRFÃO | Remover em favor de `ae` (Account Executive) |
| `partners` e `parcerias` | Duplicação de escopo e idioma | - | GAP | Unificar em um único diretório (ex: `parcerias`) |
| `bdr` e `sdr` e `ldr` e `inside_sales` | Sobreposição de vendas | - | GAP | Avaliar consolidação ou manter com regras rígidas de separação |

### Rastreabilidade de Scripts e Runtime

Muitos scripts do `package.json` dependem da existência de workers em TypeScript para os agentes:

- O script `dev:pos-venda-worker` aponta para `tsx agents/pos_venda/worker.ts` no `package.json`. No entanto, existe a pasta `agents/pos-venda` sem utilidade.
- Muitos agentes Python não possuem `.ts` correspondentes, ou possuem arquivos soltos (`main.py`, `agent.py`) sem scripts de orquestração.

### Riscos Estruturais
- A rastreabilidade técnica dos agentes no repositório é extremamente baixa. Há dezenas de pastas atuando como "código morto" ou "agentes órfãos", com funções soltas e sem entrypoints claros ou testes E2E/integração acoplados a um pipeline (apesar do pytest rodar algumas rotinas como `test:agents:packages`).

## Conclusão da Fase
Muitos módulos de agentes não sobrevivem à rastreabilidade de runtime e contratos. Eles existem como "arquivos textos" (códigos soltos) sem ser de fato acoplados à arquitetura de produção do BirthHub 360. A ação proposta é a purga massiva e consolidação de domínios.