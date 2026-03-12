# ADR-024: Modelagem de Planos de Precificação

## Status
Aceito

## Contexto
O BirthHub360 é um ecossistema de Revenue Operations (RevOps) operado por agentes de IA especializados. Precisamos definir a estratégia de precificação para garantir sustentabilidade financeira, alinhamento com o valor entregue ao cliente e previsibilidade de receita, considerando os custos operacionais de infraestrutura de IA. Diferentes modelos foram analisados: flat rate, usage-based (pay-as-you-go) e híbrido.

## Decisão
Adotaremos um **Modelo de Precificação Híbrido** (Tiered Flat Rate + Overage Usage-Based).
- **Plataforma base (Flat Rate):** Assinatura mensal/anual recorrente que concede acesso ao ecossistema, número base de usuários (seats) e uma franquia de uso dos agentes de IA e recursos computacionais (ex: X interações/mês, Y chamadas de API).
- **Uso adicional (Usage-Based):** Cobrança variável pelo consumo que exceder a franquia do plano contratado, garantindo que custos altos de processamento de IA sejam repassados de forma justa.

## Consequências

### Positivas
- **Previsibilidade:** A assinatura base (flat rate) garante MRR previsível para o BirthHub360.
- **Proteção de Margem:** O componente de uso evita prejuízos em clientes com uso extremo (heavy users) da infraestrutura de IA.
- **Barreira de Entrada Baixa:** Clientes menores podem começar com planos de entrada previsíveis e crescer gradualmente.

### Negativas
- **Complexidade de Implementação:** Requer medição granular, precisa e em tempo real do uso (metering), exigindo infraestrutura robusta para billing (Stripe + sistema interno).
- **Atrito com o Cliente:** Clientes podem ter dificuldade inicial de entender a previsibilidade da fatura se o componente de uso variável for muito agressivo.

## Alternativas Consideradas
- **Apenas Flat Rate:** Rejeitado. Risco alto de margem negativa devido aos custos variáveis de inferência de IA (LLMs).
- **Apenas Usage-Based:** Rejeitado. Falta de previsibilidade de receita e maior atrito de vendas (clientes B2B preferem orçamentos previsíveis).