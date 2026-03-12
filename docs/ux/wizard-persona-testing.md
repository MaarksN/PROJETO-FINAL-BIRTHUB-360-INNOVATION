# Testes do Wizard de Onboarding por Personas

## Metodologia
Realizamos testes de usabilidade (Sessões guiadas e gravadas) com 3 personas principais (Técnico, Gestor, Executivo) no novo fluxo do Wizard de Configuração Inicial do BirthHub 360, focado em criar e testar o primeiro agente de IA.

---

### 1. Persona: O "Técnico" (Engenheiro/Desenvolvedor de Integrações)
- **Perfil:** Experiência com APIs, Webhooks, LLMs (OpenAI, LangChain).
- **Expectativa:** Acesso rápido às chaves de API, logs detalhados e controle fino de RAG (chunking, top_k).
- **Resultados:**
  - *Positivo:* Ignorou as explicações textuais (Tooltips). Foi direto para a seção "Advanced Settings" e conectou o sistema via webhook em menos de 10 minutos. Achou o simulador de chat útil para debugar os JSONs de resposta.
  - *Negativo/Fricção:* Frustrou-se com os limites artificiais de Prompt (Templates não permitiam editar o system prompt bruto facilmente nas telas iniciais). Queria ver o Payload HTTP bruto do Tool Calling, não apenas a resposta da IA na tela.
  - *Ação de UX:* Adicionar um "Modo Desenvolvedor" (Toggle Switch) no topo do painel que oculta o texto "friendly" e expõe as abas JSON/Logs em todas as telas de agentes.

### 2. Persona: O "Gestor" (Diretor de Vendas / Operações)
- **Perfil:** Foco em métricas, conversão de leads e eficiência da equipe. Entende o conceito de IA, mas não sabe programar.
- **Expectativa:** Ver o "ROAS" ou "ROI" da ferramenta rápido. Quer plugar o agente no site sem depender de TI.
- **Resultados:**
  - *Positivo:* Apoiou-se fortemente nos Templates pré-construídos por vertical de negócio ("Imobiliária", "SaaS B2B"). Fez o upload do PDF da empresa com facilidade.
  - *Negativo/Fricção:* Parou na tela de Integração do WhatsApp. As instruções da Meta (Cloud API) eram complexas demais e envolviam criar Apps no Facebook Developer.
  - *Ação de UX:* Remover a integração WhatsApp do fluxo "Obrigatório" do Wizard. Focar no Widget de Site HTML (copiar e colar código, que eles sabem repassar para a agência web) e no simulador interno para gerar o "Aha Moment" primeiro.

### 3. Persona: O "Executivo" (CEO / Dono da Agência)
- **Perfil:** Visão de alto nível. Pouco tempo. Busca inovação para vender mais caro aos próprios clientes (SaaS White-label).
- **Expectativa:** Um painel bonito ("Dashboard") para mostrar aos clientes.
- **Resultados:**
  - *Positivo:* Achou a interface clean e moderna. A aprovação visual ("Look and Feel") foi imediata.
  - *Negativo/Fricção:* No campo "Prompt do Agente", travou. Não soube o que escrever. Disse: "A IA não deveria ser inteligente o suficiente para saber como minha empresa funciona sem eu ensinar do zero?".
  - *Ação de UX:* Implementar o RAG Implícito (Extração automática). Quando o Executivo insere a URL do site da agência, um LLM background raspa o "Sobre Nós" e gera um Rascunho de Prompt automaticamente para o usuário apenas aprovar (One-Click Setup).
