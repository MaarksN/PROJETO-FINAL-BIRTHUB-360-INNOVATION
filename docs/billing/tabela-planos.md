# Tabela de Planos: Features e Limites

Esta tabela define a estrutura de preços do BirthHub360, mapeando planos, features, limites e a justificativa de negócios para cada escolha.

| Plano | Preço Base (Mensal) | Usuários (Seats) | Franquia IA / Automações (Mensal) | Retenção de Dados | Features Inclusas | Suporte | Overage (Uso Excedente) | Justificativa de Negócio |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Starter** | $49 | Até 3 | 500 interações | 3 meses | CRM Base, Dashboard Simples | Email (SLA 48h) | $0.10/interação extra | Atrair pequenos negócios (SMB) com barreira de entrada baixa. O limite restrito de IA (500 interações) controla os custos operacionais de inferência. |
| **Growth** | $149 | Até 10 | 2.500 interações | 12 meses | CRM + Automações Intermediárias, Agente SDR e Marketing Básico | Email + Chat (SLA 24h) | $0.08/interação extra | Foco no *sweet spot* de empresas em crescimento. Oferece volume considerável de uso dos agentes de IA, estimulando adoção e percepção de valor, com uma margem de segurança. |
| **Scale** | $399 | Até 25 | 10.000 interações | 36 meses | Ecossistema Completo, Analytics Avançado, Todos Agentes | Prioritário (SLA 8h) + Gerente de Conta | $0.05/interação extra | Capturar o maior LTV (Lifetime Value) de empresas mid-market. O preço base compensa a infraestrutura pesada. Retenção de dados estendida ajuda em machine learning. |
| **Enterprise** | Sob Consulta | Ilimitado | Customizado | Ilimitado | Tudo + SSO, SLA Garantido, On-Premise/VPC | Dedicado 24/7 | Customizado | Atender clientes corporativos com exigências rigorosas de compliance e escala. Foco na negociação direta e contratos de longo prazo (ARR alto). |

## Regras e Notas
- A mudança de plano ou adição de usuários reflete no faturamento de forma *pro rata*.
- O consumo variável (overage) será acompanhado e alertado para os administradores antes do final do ciclo.
- A métrica de "interações" engloba: prompts enviados para IA, automações ativadas, integrações via API, e processamento de chamadas/emails.