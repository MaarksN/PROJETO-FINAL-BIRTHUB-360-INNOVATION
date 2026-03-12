# Critérios de Aceite para Novo Template

## Como a equipe do BirthHub 360 decide lançar um Template Público?

Para que um novo Agente ou Fluxo apareça na galeria de "Templates Disponíveis" do SaaS, ele deve passar pelos seguintes critérios do PM:

1. **Dor Comum (Tamanho do Mercado):** O template atinge pelo menos 50% de um segmento específico (ex: Clínicas de Estética, Contabilidade, E-commerces). Templates excessivamente de nicho (ex: "Criador de Legendas para Cães de Raça Específica") devem ficar para a comunidade/marketplace.
2. **Tempo de Configuração:** Pode ser adaptado com no máximo 5 inputs textuais e 1 arquivo PDF em menos de 10 minutos por um leigo.
3. **Zero Ferramentas Complexas Exigidas:** O template não deve *exigir* (como bloqueio) a conexão com uma API paga externa (ex: Zapier ou Salesforce) para gerar o valor central. A integração deve ser opcional.
4. **Prompt à Prova de Falhas (Prompt Engineering QA):** O prompt interno ("System Instructions") deve ter instruções estritas de Guardrails ("Nunca invente preços", "Nunca fale sobre concorrentes") já embutidos. O usuário B2B não deveria ter que codificar defesas de injeção.
5. **Teste de Conversão (Dogfooding):** A própria equipe de vendas do BirthHub deve usar o template em uma landing page falsa ou real e gerar 3 leads válidos antes do lançamento.
