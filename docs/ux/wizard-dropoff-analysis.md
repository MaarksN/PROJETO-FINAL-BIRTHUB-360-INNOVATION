# Análise de UX: Pontos de Abandono no Wizard (Drop-off)

## Objetivo
Analisar funis de conversão (ex: Mixpanel/Amplitude) do Wizard de Setup do BirthHub 360 e mapear as causas de abandono.

## Hipóteses de Abandono por Etapa

### Etapa 1: "Qual sua área de atuação?" (Drop-off: 5%)
- **Baixo atrito.** A maioria dos usuários que se cadastram passam por aqui. O drop-off mínimo geralmente são e-mails temporários ou curiosos sem intenção real.

### Etapa 2: Upload da Base de Conhecimento RAG (Drop-off: 18%)
- **Problema:** A tela exige que o usuário tenha um PDF (Apresentação Comercial/FAQ) ou insira a URL do site.
- **Hipótese:** Muitos usuários estão testando a plataforma no celular ou em computadores sem os arquivos da empresa à mão. Outros ficam receosos de subir dados confidenciais (Falta de Trust/Confiança).
- **Mitigação UX:** Tornar esta etapa *Opcional* (com um botão "Pular por enquanto"). Adicionar um badge de "Seus dados estão seguros e não treinarão modelos públicos" na tela de upload (Compliance LGPD).

### Etapa 3: Integrações - Conectar CRM / WhatsApp (Drop-off: 40% - GARGALO CRÍTICO)
- **Problema:** Esta tela aparece antes do "Aha Moment" (ver o Agente funcionar). Pede para o usuário logar no HubSpot ou pegar chaves no Twilio/Meta.
- **Hipótese:** O esforço cognitivo exigido (Token OAuth, Permissões) é desproporcional ao valor percebido até o momento. O usuário pensa "Dá muito trabalho, faço isso depois" e fecha a aba.
- **Mitigação UX:** **Mover esta etapa para fora do Wizard.** O Wizard deve focar APENAS na criação e simulação interna do Agente. As integrações devem ser "Up-sells" de UX dentro do Dashboard ("Seu agente está pronto! Que tal conectá-lo ao seu CRM agora?").

### Etapa 4: Simulação de Chat Final (Drop-off: 10%)
- **Problema:** O Agente às vezes responde de forma genérica ou "alucina" se a Base de Conhecimento for fraca, decepcionando o usuário.
- **Mitigação UX:** Adicionar sugestões clicáveis ("Tente perguntar: Quais os planos da empresa?") baseadas nos próprios dados que o usuário subiu, para induzir um teste bem-sucedido e guiar a simulação para o caminho feliz.
