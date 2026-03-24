# F12 — AUDITORIA MASSIVA DE AGENTES

## Mapeamento e Classificação Estrita (Sobrevivência)

A varredura massiva listou os domínios mapeados em `/agents`. A regra estipulada é severa: **se não tem estrutura real de runtime (orquestração robusta, integração com CRM/DB e workers explícitos), é expurgado.**

Módulos com menos de 7 arquivos frequentemente são stubs (esqueletos `agent.py`, `main.py`, `tools.py` e `tests`), enquanto módulos complexos (`ae`, `sdr`, `ldr`, `financeiro`, `juridico`, `marketing`, `pos_venda`) contêm cadência de engenharia (`cadence_engine.py`), esquemas SQL (`schemas.sql`), sincronização CRM (`crm_sync.py`), requirements, packages.json e arquivos `.ts` do worker, comprovando integração no monorepo e no runtime distribuído.

### TABELA MESTRE

| Agente (Dir) | Arquivos | Domínio Identificado | Orquestração (Worker/CRM) | Classificação Final | Ação |
|---|---|---|---|---|---|
| `account_manager` | 3 | Account Management | Falso/Nulo | **REMOVER** | Lixo estrutural |
| `ae` | 16 | Account Executive | Completo (Worker, DB, CRM) | **MANTER** | Core Vendas |
| `analista` | 12 | Genérico | Falso (Cargo sem Domínio) | **REMOVER** | Lixo Estrutural |
| `bdr` | 6 | Sales | Parcial (Conflito com SDR/LDR) | **REMOVER** | Absorver no SDR/LDR |
| `closer` | 7 | Sales | Parcial (Conflito com AE) | **REMOVER** | Absorver no AE |
| `coordenador_comercial`| 3 | Genérico | Falso/Nulo | **REMOVER** | Lixo estrutural |
| `copywriter` | 6 | Marketing/Genérico | Parcial | **REMOVER** | Absorver no Marketing |
| `enablement` | 6 | Operações/Treinamento| Parcial | **REMOVER** | Lixo estrutural |
| `executivo_negocios` | 3 | Sales | Falso (Clone pt-br de AE) | **REMOVER** | Duplicação |
| `field` | 6 | Sales Field | Parcial | **REMOVER** | Lixo estrutural |
| `financeiro` | 13 | Operações Financeiras | Completo (Worker, DB) | **MANTER** | Core Operações |
| `gerente_comercial` | 3 | Genérico | Falso/Nulo | **REMOVER** | Lixo estrutural |
| `inside_sales` | 3 | Sales | Falso/Nulo | **REMOVER** | Duplicação (SDR/LDR) |
| `juridico` | 13 | Operações Jurídicas | Completo (Worker, DB) | **MANTER** | Core Operações |
| `kam` | 6 | Key Account | Parcial | **REMOVER** | Duplicação (AE) |
| `ldr` | 14 | Lead Development | Completo (Worker, DB, CRM) | **MANTER** | Core Vendas |
| `marketing` | 15 | Marketing/Mídia | Completo (Worker, DB) | **MANTER** | Core Growth |
| `parcerias` | 3 | Operações Parcerias | Falso/Nulo | **REMOVER** | Lixo estrutural |
| `partners` | 6 | Operações Parcerias | Parcial (Clone en de parcerias) | **REMOVER** | Lixo estrutural |
| `pos-venda` | 1 | N/A (Apenas main.py) | Quebrado (`kebab-case`) | **REMOVER** | Lixo estrutural |
| `pos_venda` | 14 | Pós Venda / CS | Completo (Worker, DB, CRM) | **MANTER** | Core CS |
| `pre_sales` | 6 | Pré-vendas | Parcial (Conflito SDR) | **REMOVER** | Lixo estrutural |
| `pre_vendas` | 3 | Pré-vendas | Falso (Conflito SDR) | **REMOVER** | Lixo estrutural |
| `revops` | 3 | Operações Receita | Falso/Nulo | **REMOVER** | Lixo estrutural |
| `runtime` | 6 | Core de Inferência | Utilitário Antigo | **REMOVER/CONSOLIDAR** | Lixo / Absorver em `shared` |
| `sales_ops` | 7 | Operações Vendas | Parcial | **REMOVER** | Lixo estrutural |
| `sdr` | 17 | Sales Development | Completo (Worker, DB, CRM) | **MANTER** | Core Vendas |
| `shared` | 19 | Core Python Agents | Orquestração gRPC/DB | **MANTER** | Core Infra Python |
| `social` | 6 | Mídia Social | Parcial | **REMOVER** | Absorver no Marketing |


### Resumo da Racionalização

- **Total Avaliado:** 29 Diretórios de Agentes e Módulos.
- **Sobreviventes (Úteis/Integrados):** 8 Diretórios (`ae`, `sdr`, `ldr`, `financeiro`, `juridico`, `marketing`, `pos_venda`, `shared`).
- **Sentenciados à Remoção:** 21 Diretórios (~72% de corte).

### Conclusão e Próximo Passo
A arquitetura de agentes será estritamente enxuta e suportada pelos 8 sobreviventes que possuem *contract maturity* (workers reais, definições `.sql` consistentes, e ligações CRM/DB). Todos os outros diretórios são pesos mortos ou simulações inócuas e devem ser expurgados da árvore no `Ciclo 1` do Roadmap.