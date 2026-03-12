# Processo de Revisão de SLO

## Objetivo
Os SLOs não são imutáveis. Se o negócio muda, ou a infraestrutura amadurece (mudança para Multi-Region, ou contratação de SLA corporativo com OpenAI), os SLOs devem refletir isso.

## Frequência e Responsabilidades
- **Frequência:** Semestral (A cada 6 meses, junto com o planejamento do roadmap B2B).
- **Participantes:** CTO, Liderança de Produto (PM), Engenharia de Confiabilidade (SRE) e Suporte/CS (Customer Success).

## Como Ajustar Metas
1. **Análise de Dados Históricos:** O serviço de agentes operou em 99.8% nos últimos 6 meses. O cliente B2B reclamou (Churn/Tickets)?
2. **Ajuste para Cima (Aperto):** Se operamos em 99.99% com facilidade, a infra sobra. Podemos aumentar o SLO oficial para 99.95% para criar diferencial competitivo (SLA Contratual).
3. **Ajuste para Baixo (Relaxamento):** Se o SLO aspiracional de 99.99% gerou 5 freezes trimestrais sem impacto real no cliente (CS não viu reclamação de downtime), o SLO é muito rígido e deve cair para 99.9%.

## Formalização
Após a reunião, o arquivo `slo-targets.md` é atualizado via Pull Request, revisado pelas partes, e os dashboards de monitoramento são recalibrados com as novas "linhas vermelhas" (Thresholds).
