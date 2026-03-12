# Análise de Risco de Trial Abuse (Abuso de Período de Testes)

Oferecer um Trial de 14 dias com acesso a agentes de IA (LLMs) representa um custo direto de infraestrutura para o BirthHub360 (OpenAI/Anthropic tokens, processamento, envio de emails). O "Trial Abuse" ocorre quando usuários mal-intencionados exploram essa gratuidade repetidas vezes, gerando prejuízo financeiro sem qualquer intenção de conversão.

## 1. O Risco: Múltiplos Tenants para Trial Infinito
A forma mais comum de abuso em plataformas SaaS B2B sem validação de pagamento antecipada (No-Credit-Card-Required) é a criação sucessiva de novos Workspaces/Tenants.

**Cenário de Ataque:**
Um usuário cria uma conta com `empresa1@email.com`, esgota a franquia de IA de 2.500 interações do plano Growth (concedido no Trial) em 13 dias para limpar e enriquecer uma base de milhares de leads. No dia 14, ele abandona a conta. Imediatamente, cria uma nova conta com `empresa2@email.com`, faz upload do resto da sua base de leads e repete o processo.

**Impacto Financeiro:**
Se o custo médio por 2.500 interações de IA for de $15, um único usuário fazendo isso 4 vezes no mês gera $60 de prejuízo puro, além do ruído nas métricas de Marketing (falsos signups).

## 2. Indicadores de Abuso (Red Flags)
Sistemas de monitoramento (via logs ou SQL views) devem alertar a equipe de operações ao detectarem os seguintes padrões em contas Trial recém-criadas:

- **Domínios Descartáveis:** Inscrições usando provedores de email temporários (`@10minutemail.com`, `@yopmail.com`) ou provedores gratuitos genéricos (`@gmail.com`) em alto volume, em vez de domínios corporativos.
- **Padrões de Nomes/Emails Similares:** Contas sequenciais como `joao.vendas1@empresa.com`, `joao.vendas2@empresa.com`.
- **IP / Fingerprinting Repetido:** Múltiplos tenants (Workspaces) criados a partir do mesmo endereço IP, Device ID ou *User-Agent* num curto espaço de tempo.
- **Uso Extremo e Imediato (Spike):** Uma conta que atinge 90% do limite do Trial nas primeiras 4 horas após a criação.

## 3. Estratégias de Mitigação e Prevenção

Para combater o abuso sem prejudicar a conversão de leads legítimos, o BirthHub360 implementará as seguintes defesas em camadas:

### Nível 1: Restrições de Limite (Hard Caps no Trial)
- O plano Trial **não deve espelhar exatamente os limites da conta Growth pagante**. A cota de interações de IA durante os 14 dias deve ser severamente reduzida (ex: máximo de 250 a 500 interações totais).
- Se o lead legítimo quiser testar com mais volume ("homologação pesada"), ele deve solicitar uma extensão e passar por qualificação comercial manual (via SDR).

### Nível 2: Validação de E-mail Corporativo e Captcha
- Restringir a criação de contas automatizadas implementando reCAPTCHA v3 na página de Sign Up.
- **Opcional:** Bloquear ou exigir verificação adicional (SMS/Phone) para signups com emails genéricos (Gmail, Hotmail). Domínios corporativos válidos passam direto.

### Nível 3: Deduplicação de Tenants (Device/IP Blocking)
- Implementar rate-limiting e regras antifraude no API Gateway (ou Cloudflare) para impedir a criação de mais de 2 contas Trial do mesmo IP ou sub-rede em 30 dias.
- Se detectado um cruzamento de dados (ex: mesmo cartão de crédito inserido, mas recusado, ou domínios da empresa idênticos em tenants diferentes), o sistema deve suspender automaticamente as novas instâncias e exigir contato com o suporte.

### Nível 4: "Credit Card Required" (Apenas se o abuso persistir)
- Se as perdas por Trial Abuse atingirem um threshold (limite) financeiro inaceitável, a empresa mudará temporariamente para o modelo **Credit Card Required for Trial**. O usuário deve inserir o cartão via Stripe para iniciar os 14 dias. O Stripe validará o cartão e seu histórico de risco (Stripe Radar). Isso reduz o volume de leads do Topo de Funil (ToFu), mas elimina virtualmente contas falsas.