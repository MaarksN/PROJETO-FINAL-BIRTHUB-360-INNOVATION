# Análise de Erros de Configuração e Prevenção via UX

## Erros Frequentes na Plataforma B2B BirthHub 360

1. **Configuração Incorreta de Webhooks (Integrações Externas)**
   - **O Erro:** Usuários técnicos erram a URL do endpoint, esquecem o `https://` ou não passam o token de autorização no Header.
   - **Prevenção UX:**
     - Validação inline em tempo real (Regex no input de URL).
     - Botão "Testar Conexão" ao lado do campo. Ao clicar, o sistema dispara um payload de Ping (JSON) e mostra a resposta (HTTP 200 OK em verde, ou HTTP 401 Unauthorized em vermelho com a mensagem do servidor remoto formatada de forma amigável).

2. **Loop de Agentes (Tokens Esgotados)**
   - **O Erro:** Um usuário configura dois Agentes que respondem um ao outro infinitamente via webhook (Bot x Bot), exaurindo os créditos do plano no primeiro dia (Billing Shock).
   - **Prevenção UX/Backend:**
     - **Backend:** Identificar metadados circulares (ex: header `X-BirthHub-Agent: true`) e interromper loops via Rate Limiting ou detecção de padrão.
     - **UX:** No painel de configuração de Triggers, se o usuário selecionar "Quando receber webhook" e a URL for interna, exibir um Warning Visual (Triângulo Amarelo) alertando sobre o risco de loops lógicos. Se a conta esgotar créditos subitamente, enviar e-mail de "Alerta de Uso Anômalo" em vez de um bloqueio seco.

3. **Prompt Conflitante ("Esquizofrenia de IA")**
   - **O Erro:** O Gestor usa um Template de "SDR de Vendas Agressivo" e, em seguida, insere manualmente no campo de Prompt Adicional: "Nunca tente vender nada, apenas tire dúvidas educadamente". A IA não sabe se vende ou se apenas ajuda.
   - **Prevenção UX:**
     - Implementar um "LLM Evaluator" rápido no frontend. Quando o usuário clica em "Salvar Agente", uma chamada leve (ex: GPT-3.5-Turbo ou Claude Haiku) analisa o prompt final combinado e exibe um "Aviso de Qualidade: Seu prompt contém instruções contraditórias. Recomendamos remover a regra X se você usou o template Y."

4. **Esquecer de 'Ligar' (Ativar) o Agente**
   - **O Erro:** Usuário configura tudo, coloca o Widget no site, mas esquece o toggle principal (Draft -> Active). Os clientes não recebem respostas.
   - **Prevenção UX:**
     - Ao sair do simulador bem-sucedido, exibir um Modal de Celebração ("Funciona perfeitamente! Deseja ativá-lo publicamente agora?").
     - No Dashboard inicial, destacar Agentes em "Draft" com um ponto laranja indicando que exigem atenção.
