# F3 — HIGIENIZAÇÃO

## Peso Morto e Impacto Identificados

Com base nos tamanhos dos diretórios de agentes e do inventário (F0 e F1), ficou evidente a necessidade de purga e unificação de lixo na organização do código e serviços. Vários diretórios funcionam apenas como duplicatas conceituais ou códigos não terminados e órfãos.

### Lixo e Duplicações a Remover (Diretórios `REMOVER`)

Os seguintes componentes representam duplicação de funções ou têm escopo confuso/ambíguo na modelagem multi-agente e devem ser expurgados:

1. **`agents/pos-venda`** (`4.0K` - Apenas `main.py` isolado) -> **REMOVER** (Mantém-se o `agents/pos_venda`)
2. **`agents/pre_sales`** (`24K`) -> **REMOVER** (Conflita com `pre_vendas` e outras nomenclaturas como SDR/BDR).
3. **`agents/pre_vendas`** (`32K`) -> **REMOVER** (Pela mesma razão, deve-se unificar sob `sdr/bdr`).
4. **`agents/partners`** (`24K`) -> **REMOVER** (Em favor de `agents/parcerias`).
5. **Cargos Genéricos / Duplicados de Agentes** -> **REMOVER**:
   - `agents/analista`
   - `agents/coordenador_comercial`
   - `agents/executivo_negocios` (O escopo é o `agents/ae`)
   - `agents/gerente_comercial`
   - `agents/copywriter` (Pode ser absorvido pelo `marketing`)
   - `agents/inside_sales` (Conflito direto com BDR/SDR/AE)
   - `agents/account_manager` (Conflito direto com AE/KAM)

### Diretórios a Consolidar (Diretórios `CONSOLIDAR`)

- **`agents/bdr` e `agents/ldr`**: Consolidar domínios afins para que não se tenha escopos excessivamente fracionados. LDR e BDR poderiam atuar na mesma pipeline. Contudo, devido a existência de Workers implementados para LDR/SDR/AE (vistos em F1), a melhor escolha é basear o que sobreviverá pelo critério de maturidade do código.
- Consolidar `agents/parcerias` (mantê-lo, removendo partners).

### O Que Sobrevive (Diretórios `MANTER`)

Manter e estabilizar os diretórios que têm estrutura real, `worker.py` e `worker.ts`, demonstrando integração com as filas do sistema:

- **`agents/ae`** (Account Executive - 96K)
- **`agents/sdr`** (Sales Dev - 96K)
- **`agents/ldr`** (Lead Dev - 84K)
- **`agents/marketing`** (Marketing - 100K)
- **`agents/pos_venda`** (Pós Venda - 88K)
- **`agents/financeiro`** (Financeiro - 88K)
- **`agents/juridico`** (Jurídico - 80K)
- **`agents/shared`** (Código base compartilhado - 120K)

*Outros agentes menores podem ser absorvidos ou removidos totalmente se não representarem função crítica independente.*

## Impacto da Higienização

- **Redução de Lixo:** Corte de +15 diretórios supérfluos, erradicando conflitos e inconsistências de nomenclatura (idiomas e formatos de pasta).
- **Melhoria da Rastreabilidade:** Permite focar os pipelines e CI num subconjunto vital de 7-8 agentes principais, reduzindo a carga cognitiva e dívida técnica.