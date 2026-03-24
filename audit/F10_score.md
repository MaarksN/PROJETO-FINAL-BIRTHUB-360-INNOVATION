# F10 — SCORE

## Pontuação Técnica do Repositório (Pré-Higienização)

Com base nas observações do código e configuração da plataforma (F0 a F9), a auditoria gera o seguinte score objetivo (de 0 a 100).

### 1. Organização Estrutural (Peso 25%): 40/100
- **Motivo:** A existência de diretórios como `pos-venda` vs `pos_venda`, bem como subpastas de agentes genéricas (`copywriter`, `analista`) denotam total ausência de linting estrutural anterior, gerando "lixo de modelagem".
- **Ação:** Cortar metade do diretório de agentes.

### 2. Dívida de Código (Peso 25%): 55/100
- **Motivo:** O backend e web Core em Node/TypeScript (`apps/web`, `apps/api`) parecem ter boa base estrutural graças ao tooling (eslint, prettier, husky), mas os agentes Python representam um buraco negro de código sem coverage ou testes acoplados ao ciclo E2E primário. O uso de Node Workers misturados com módulos Python nas pastas dos agentes viola a separação de linguagens e papéis.

### 3. CI/CD & Automação (Peso 25%): 75/100
- **Motivo:** Existem pipelines ricas no GitHub Actions e scripts robustos em `scripts/ci/*`. No entanto, eles podem falhar ou demorar demais por conta do excesso de peso morto e conflitos de ambiente virtual (Python no sandbox). Timeouts de 15 minutos em builds longos e excesso de lixo reduzem a efetividade.
- **Ação:** Otimizar e aplicar limites após exclusões.

### 4. Segurança & Infra (Peso 25%): 60/100
- **Motivo:** O projeto inclui configurações para Trivy, Secret Scanning, mas falha no rigor local (chaves como `sk_test_` sem mock em arquivos de exemplo que ativam falsos positivos). A modelagem de DB possui checks adequados (Prisma seeds com tenantId em sua maioria), mas necessita ser à prova de falhas com os testes da nova modelagem de agentes.

## Score Final do Ecossistema: 57 / 100
**Classificação Geral:** Dívida Alta. O ecossistema está sobrecarregado por experimentação e "cargos genéricos" simulados como agentes sem utilidade para a produção.

## Nota Mínima Esperada Pós-Higienização: 85+ / 100
Isso se dará se e somente se as remoções descritas na fase C1/R0 e padronizações propostas forem executadas sumariamente e todos os testes core passarem (F9 Checklist).