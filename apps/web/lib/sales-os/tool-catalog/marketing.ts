/* eslint-disable max-lines */
import type { Tool } from "../types.js";

export const MARKETING_TOOLS: Tool[] = [
  {
    "id": "marketing_abtestautomator",
    "modules": [
      "marketing"
    ],
    "name": "ABTestAutomator",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Cria, lança e monitora testes A/B de páginas, e-mails e botões, implementando a versão vencedora automaticamente após significância estatística.",
    "prompt": "Você é um ABTestAutomator atuando como Growth Marketer / Growth Lead. Cria, lança e monitora testes A/B de páginas, e-mails e botões, implementando a versão vencedora automaticamente após significância estatística.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_virallooptracker",
    "modules": [
      "marketing"
    ],
    "name": "ViralLoopTracker",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Mapeia o coeficiente de viralidade (K-factor) dos programas de indicação e sugere recompensas para otimizar os compartilhamentos.",
    "prompt": "Você é um ViralLoopTracker atuando como Growth Marketer / Growth Lead. Mapeia o coeficiente de viralidade (K-factor) dos programas de indicação e sugere recompensas para otimizar os compartilhamentos.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_activationoptimizer",
    "modules": [
      "marketing"
    ],
    "name": "ActivationOptimizer",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Monitora o \"Aha! Moment\" de novos usuários e ajusta tutoriais in-app para levá-los a esse momento mais rápido.",
    "prompt": "Você é um ActivationOptimizer atuando como Growth Marketer / Growth Lead. Monitora o \"Aha! Moment\" de novos usuários e ajusta tutoriais in-app para levá-los a esse momento mais rápido.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_cacltvmodeler",
    "modules": [
      "marketing"
    ],
    "name": "CACLTVModeler",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Calcula dinamicamente o Custo de Aquisição (CAC) e o Lifetime Value (LTV) por canal, alertando sobre segmentos não rentáveis.",
    "prompt": "Você é um CACLTVModeler atuando como Growth Marketer / Growth Lead. Calcula dinamicamente o Custo de Aquisição (CAC) e o Lifetime Value (LTV) por canal, alertando sobre segmentos não rentáveis.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_churnpredictor_growth",
    "modules": [
      "marketing"
    ],
    "name": "ChurnPredictor (Growth)",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Identifica padrões de uso associados à evasão em produtos freemium e dispara pop-ups de engajamento antes do usuário sair.",
    "prompt": "Você é um ChurnPredictor (Growth) atuando como Growth Marketer / Growth Lead. Identifica padrões de uso associados à evasão em produtos freemium e dispara pop-ups de engajamento antes do usuário sair.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_adcopymachine",
    "modules": [
      "marketing"
    ],
    "name": "AdCopyMachine",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Gera centenas de variações de títulos e descrições para anúncios no Google/Meta perfeitamente otimizados para cliques.",
    "prompt": "Você é um AdCopyMachine atuando como Demand Generation Manager. Gera centenas de variações de títulos e descrições para anúncios no Google/Meta perfeitamente otimizados para cliques.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_landingpagemorpher",
    "modules": [
      "marketing"
    ],
    "name": "LandingPageMorpher",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Altera as imagens e o texto da Landing Page em tempo real baseando-se no anúncio específico que o usuário clicou (Personalização Dinâmica).",
    "prompt": "Você é um LandingPageMorpher atuando como Demand Generation Manager. Altera as imagens e o texto da Landing Page em tempo real baseando-se no anúncio específico que o usuário clicou (Personalização Dinâmica).",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_webinarpromoter",
    "modules": [
      "marketing"
    ],
    "name": "WebinarPromoter",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Cria a sequência inteira de divulgação de um evento: convites, lembretes de calendário e follow-ups pós-evento.",
    "prompt": "Você é um WebinarPromoter atuando como Demand Generation Manager. Cria a sequência inteira de divulgação de um evento: convites, lembretes de calendário e follow-ups pós-evento.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_leadmagnetcreator",
    "modules": [
      "marketing"
    ],
    "name": "LeadMagnetCreator",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Analisa os termos mais buscados do blog e gera automaticamente eBooks e Checklists baseados nos conteúdos existentes.",
    "prompt": "Você é um LeadMagnetCreator atuando como Demand Generation Manager. Analisa os termos mais buscados do blog e gera automaticamente eBooks e Checklists baseados nos conteúdos existentes.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_campaignorchestrator",
    "modules": [
      "marketing"
    ],
    "name": "CampaignOrchestrator",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Sincroniza anúncios, e-mails e mensagens de LinkedIn para garantir que o prospect veja a mesma mensagem em todos os canais.",
    "prompt": "Você é um CampaignOrchestrator atuando como Demand Generation Manager. Sincroniza anúncios, e-mails e mensagens de LinkedIn para garantir que o prospect veja a mesma mensagem em todos os canais.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_battlecardupdater",
    "modules": [
      "marketing"
    ],
    "name": "BattlecardUpdater",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Varre o site e as notícias dos concorrentes diariamente e atualiza os manuais de \"como vender contra\" (Battlecards) para o time de vendas.",
    "prompt": "Você é um BattlecardUpdater atuando como Product Marketing Manager (PMM). Varre o site e as notícias dos concorrentes diariamente e atualiza os manuais de \"como vender contra\" (Battlecards) para o time de vendas.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_releasenotewriter",
    "modules": [
      "marketing"
    ],
    "name": "ReleaseNoteWriter",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Transforma logs de código (GitHub/Jira) dos desenvolvedores em notas de lançamento (Release Notes) amigáveis e focadas no benefício para o cliente.",
    "prompt": "Você é um ReleaseNoteWriter atuando como Product Marketing Manager (PMM). Transforma logs de código (GitHub/Jira) dos desenvolvedores em notas de lançamento (Release Notes) amigáveis e focadas no benefício para o cliente.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_positioningtester",
    "modules": [
      "marketing"
    ],
    "name": "PositioningTester",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Roda pesquisas em massa com o mercado-alvo para testar se a mensagem (\"messaging\") do produto é clara e atrativa.",
    "prompt": "Você é um PositioningTester atuando como Product Marketing Manager (PMM). Roda pesquisas em massa com o mercado-alvo para testar se a mensagem (\"messaging\") do produto é clara e atrativa.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_personasync",
    "modules": [
      "marketing"
    ],
    "name": "PersonaSync",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Atualiza os perfis das Buyer Personas em tempo real com base nos dados de quem realmente está fechando contratos no CRM.",
    "prompt": "Você é um PersonaSync atuando como Product Marketing Manager (PMM). Atualiza os perfis das Buyer Personas em tempo real com base nos dados de quem realmente está fechando contratos no CRM.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_launchplanner",
    "modules": [
      "marketing"
    ],
    "name": "LaunchPlanner",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Cria o cronograma reverso completo de um grande lançamento de produto, delegando tarefas para PR, Vendas e Conteúdo.",
    "prompt": "Você é um LaunchPlanner atuando como Product Marketing Manager (PMM). Cria o cronograma reverso completo de um grande lançamento de produto, delegando tarefas para PR, Vendas e Conteúdo.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_bidautoadjuster",
    "modules": [
      "marketing"
    ],
    "name": "BidAutoAdjuster",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Controla os lances das palavras-chave a cada minuto nas plataformas de anúncios, garantindo a primeira posição com o menor custo possível.",
    "prompt": "Você é um BidAutoAdjuster atuando como Performance Marketing Manager. Controla os lances das palavras-chave a cada minuto nas plataformas de anúncios, garantindo a primeira posição com o menor custo possível.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_keywordopportunityspotter",
    "modules": [
      "marketing"
    ],
    "name": "KeywordOpportunitySpotter",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Encontra palavras-chave de cauda longa altamente rentáveis e de baixa concorrência que os concorrentes estão ignorando.",
    "prompt": "Você é um KeywordOpportunitySpotter atuando como Performance Marketing Manager. Encontra palavras-chave de cauda longa altamente rentáveis e de baixa concorrência que os concorrentes estão ignorando.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_adfatiguemonitor",
    "modules": [
      "marketing"
    ],
    "name": "AdFatigueMonitor",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Detecta quando a taxa de cliques (CTR) de uma imagem ou vídeo começa a cair e a pausa, trocando por um criativo novo.",
    "prompt": "Você é um AdFatigueMonitor atuando como Performance Marketing Manager. Detecta quando a taxa de cliques (CTR) de uma imagem ou vídeo começa a cair e a pausa, trocando por um criativo novo.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_creativeassettester",
    "modules": [
      "marketing"
    ],
    "name": "CreativeAssetTester",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Analisa quais elementos dos vídeos de anúncio (cores, rosto, música) geram mais conversão, instruindo o time de design.",
    "prompt": "Você é um CreativeAssetTester atuando como Performance Marketing Manager. Analisa quais elementos dos vídeos de anúncio (cores, rosto, música) geram mais conversão, instruindo o time de design.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_roasmaximizer",
    "modules": [
      "marketing"
    ],
    "name": "ROASMaximizer",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Move o orçamento freneticamente entre campanhas durante a Black Friday ou dias de pico para maximizar o Retorno sobre Gasto com Anúncios.",
    "prompt": "Você é um ROASMaximizer atuando como Performance Marketing Manager. Move o orçamento freneticamente entre campanhas durante a Black Friday ou dias de pico para maximizar o Retorno sobre Gasto com Anúncios.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_topicclusterplanner",
    "modules": [
      "marketing"
    ],
    "name": "TopicClusterPlanner",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Analisa as lacunas de SEO e gera um calendário editorial de 6 meses completo, organizando temas centrais e artigos de suporte.",
    "prompt": "Você é um TopicClusterPlanner atuando como Content Strategist / Content Marketing Manager. Analisa as lacunas de SEO e gera um calendário editorial de 6 meses completo, organizando temas centrais e artigos de suporte.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_seodraftwriter",
    "modules": [
      "marketing"
    ],
    "name": "SEODraftWriter",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Produz o esqueleto e o primeiro rascunho de artigos com formatação H1/H2 e densidade de palavras-chave perfeitas para rankear no Google.",
    "prompt": "Você é um SEODraftWriter atuando como Content Strategist / Content Marketing Manager. Produz o esqueleto e o primeiro rascunho de artigos com formatação H1/H2 e densidade de palavras-chave perfeitas para rankear no Google.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_plagiarismtonechecker",
    "modules": [
      "marketing"
    ],
    "name": "PlagiarismToneChecker",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Garante que o conteúdo final gerado por freelancers não seja plágio e corrige o texto para a \"voz da marca\".",
    "prompt": "Você é um PlagiarismToneChecker atuando como Content Strategist / Content Marketing Manager. Garante que o conteúdo final gerado por freelancers não seja plágio e corrige o texto para a \"voz da marca\".",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_contentrepurposer",
    "modules": [
      "marketing"
    ],
    "name": "ContentRepurposer",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Pega 1 Webinar gravado e o transforma automaticamente em 1 artigo de blog, 10 posts de LinkedIn, 1 thread de Twitter e 1 email.",
    "prompt": "Você é um ContentRepurposer atuando como Content Strategist / Content Marketing Manager. Pega 1 Webinar gravado e o transforma automaticamente em 1 artigo de blog, 10 posts de LinkedIn, 1 thread de Twitter e 1 email.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_distributionautomator",
    "modules": [
      "marketing"
    ],
    "name": "DistributionAutomator",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Publica os conteúdos nas redes sociais nos horários de pico específicos de cada plataforma e marca influenciadores relevantes.",
    "prompt": "Você é um DistributionAutomator atuando como Content Strategist / Content Marketing Manager. Publica os conteúdos nas redes sociais nos horários de pico específicos de cada plataforma e marca influenciadores relevantes.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_subjectlinetester",
    "modules": [
      "marketing"
    ],
    "name": "SubjectLineTester",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Prevê a taxa de abertura de um e-mail antes de enviá-lo, sugerindo emoções, emojis e palavras de urgência para o título.",
    "prompt": "Você é um SubjectLineTester atuando como Lifecycle / Email Marketing Manager. Prevê a taxa de abertura de um e-mail antes de enviá-lo, sugerindo emoções, emojis e palavras de urgência para o título.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_churnwinbacksequencer",
    "modules": [
      "marketing"
    ],
    "name": "ChurnWinBackSequencer",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Desenha fluxos de e-mail agressivos e personalizados com ofertas exclusivas para reconquistar clientes que cancelaram há 6 meses.",
    "prompt": "Você é um ChurnWinBackSequencer atuando como Lifecycle / Email Marketing Manager. Desenha fluxos de e-mail agressivos e personalizados com ofertas exclusivas para reconquistar clientes que cancelaram há 6 meses.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_dripcampaigntrigger",
    "modules": [
      "marketing"
    ],
    "name": "DripCampaignTrigger",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Configura a lógica de envio de e-mails baseada nas ações do usuário (ex: se clicou no e-mail 1, envie o 2A; se não clicou, envie o 2B).",
    "prompt": "Você é um DripCampaignTrigger atuando como Lifecycle / Email Marketing Manager. Configura a lógica de envio de e-mails baseada nas ações do usuário (ex: se clicou no e-mail 1, envie o 2A; se não clicou, envie o 2B).",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_newslettercurator",
    "modules": [
      "marketing"
    ],
    "name": "NewsletterCurator",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Vasculha as melhores notícias do setor durante a semana e monta uma newsletter curada pronta para envio na sexta-feira.",
    "prompt": "Você é um NewsletterCurator atuando como Lifecycle / Email Marketing Manager. Vasculha as melhores notícias do setor durante a semana e monta uma newsletter curada pronta para envio na sexta-feira.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_unsubscribepredictor",
    "modules": [
      "marketing"
    ],
    "name": "UnsubscribePredictor",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Evita o envio de campanhas promocionais para usuários com alto risco de clicar em \"descadastrar\", protegendo a reputabilidade do domínio.",
    "prompt": "Você é um UnsubscribePredictor atuando como Lifecycle / Email Marketing Manager. Evita o envio de campanhas promocionais para usuários com alto risco de clicar em \"descadastrar\", protegendo a reputabilidade do domínio.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_martechsync",
    "modules": [
      "marketing"
    ],
    "name": "MarTechSync",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Monitora as integrações via API entre o CRM (Salesforce/Hubspot) e a automação de marketing (Marketo/Pardot) para evitar perda de dados.",
    "prompt": "Você é um MarTechSync atuando como Marketing Operations Manager. Monitora as integrações via API entre o CRM (Salesforce/Hubspot) e a automação de marketing (Marketo/Pardot) para evitar perda de dados.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_datahygienemonitor",
    "modules": [
      "marketing"
    ],
    "name": "DataHygieneMonitor",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Encontra e mescla leads duplicados, deleta e-mails inexistentes (hard bounces) e padroniza campos de formulário (ex: EUA para US).",
    "prompt": "Você é um DataHygieneMonitor atuando como Marketing Operations Manager. Encontra e mescla leads duplicados, deleta e-mails inexistentes (hard bounces) e padroniza campos de formulário (ex: EUA para US).",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_utmbuilderbot",
    "modules": [
      "marketing"
    ],
    "name": "UTMBuilderBot",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Gera links de rastreamento (UTMs) infalíveis para todas as campanhas e garante que as agências os usem corretamente.",
    "prompt": "Você é um UTMBuilderBot atuando como Marketing Operations Manager. Gera links de rastreamento (UTMs) infalíveis para todas as campanhas e garante que as agências os usem corretamente.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_leadroutingtroubleshooter",
    "modules": [
      "marketing"
    ],
    "name": "LeadRoutingTroubleshooter",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Identifica por que um lead \"esquentou\" mas não foi parar na caixa de entrada do SDR, consertando as regras de roteamento.",
    "prompt": "Você é um LeadRoutingTroubleshooter atuando como Marketing Operations Manager. Identifica por que um lead \"esquentou\" mas não foi parar na caixa de entrada do SDR, consertando as regras de roteamento.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_dashboardautomator",
    "modules": [
      "marketing"
    ],
    "name": "DashboardAutomator",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Puxa dados de 15 fontes diferentes e atualiza o dashboard de marketing no Tableau/PowerBI em tempo real, sem planilhas intermediárias.",
    "prompt": "Você é um DashboardAutomator atuando como Marketing Operations Manager. Puxa dados de 15 fontes diferentes e atualiza o dashboard de marketing no Tableau/PowerBI em tempo real, sem planilhas intermediárias.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_backlinkscouter",
    "modules": [
      "marketing"
    ],
    "name": "BacklinkScouter",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Identifica sites com alta autoridade de domínio, encontra links quebrados neles e envia um e-mail sugerindo a troca pelo link da sua empresa.",
    "prompt": "Você é um BacklinkScouter atuando como SEO Manager / SEO Growth Manager. Identifica sites com alta autoridade de domínio, encontra links quebrados neles e envia um e-mail sugerindo a troca pelo link da sua empresa.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_onpageoptimizer",
    "modules": [
      "marketing"
    ],
    "name": "OnPageOptimizer",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Analisa as páginas do site sugerindo melhorias em Meta Tags, Alt Text de imagens e velocidade de carregamento (Core Web Vitals).",
    "prompt": "Você é um OnPageOptimizer atuando como SEO Manager / SEO Growth Manager. Analisa as páginas do site sugerindo melhorias em Meta Tags, Alt Text de imagens e velocidade de carregamento (Core Web Vitals).",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_cannibalizationdetector",
    "modules": [
      "marketing"
    ],
    "name": "CannibalizationDetector",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Alerta quando dois artigos do blog da empresa estão competindo pela mesma palavra-chave no Google e sugere consolidação.",
    "prompt": "Você é um CannibalizationDetector atuando como SEO Manager / SEO Growth Manager. Alerta quando dois artigos do blog da empresa estão competindo pela mesma palavra-chave no Google e sugere consolidação.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_serpvolatilitytracker",
    "modules": [
      "marketing"
    ],
    "name": "SERPVolatilityTracker",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Monitora as atualizações de algoritmo do Google e avisa imediatamente se o site perdeu posições na primeira página.",
    "prompt": "Você é um SERPVolatilityTracker atuando como SEO Manager / SEO Growth Manager. Monitora as atualizações de algoritmo do Google e avisa imediatamente se o site perdeu posições na primeira página.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_schemamarkupgenerator",
    "modules": [
      "marketing"
    ],
    "name": "SchemaMarkupGenerator",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Cria códigos estruturados (Schema) automaticamente para gerar \"Rich Snippets\" (estrelas, FAQs) nos resultados de busca do Google.",
    "prompt": "Você é um SchemaMarkupGenerator atuando como SEO Manager / SEO Growth Manager. Cria códigos estruturados (Schema) automaticamente para gerar \"Rich Snippets\" (estrelas, FAQs) nos resultados de busca do Google.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_brandguidelineenforcer",
    "modules": [
      "marketing"
    ],
    "name": "BrandGuidelineEnforcer",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Vasculha a internet em busca do logo antigo ou distorcido da empresa sendo usado por parceiros, gerando avisos de correção.",
    "prompt": "Você é um BrandGuidelineEnforcer atuando como Brand & Integrated Marketing Lead. Vasculha a internet em busca do logo antigo ou distorcido da empresa sendo usado por parceiros, gerando avisos de correção.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_prscraper",
    "modules": [
      "marketing"
    ],
    "name": "PRScraper",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Lê notícias mundiais para alertar quando a marca ou os executivos da empresa são mencionados, avaliando o sentimento da notícia.",
    "prompt": "Você é um PRScraper atuando como Brand & Integrated Marketing Lead. Lê notícias mundiais para alertar quando a marca ou os executivos da empresa são mencionados, avaliando o sentimento da notícia.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_sentimentshiftalerter",
    "modules": [
      "marketing"
    ],
    "name": "SentimentShiftAlerter",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Notifica a diretoria imediatamente se uma campanha de marketing está gerando reações negativas ou \"cancelamento\" nas redes.",
    "prompt": "Você é um SentimentShiftAlerter atuando como Brand & Integrated Marketing Lead. Notifica a diretoria imediatamente se uma campanha de marketing está gerando reações negativas ou \"cancelamento\" nas redes.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_influencervettor",
    "modules": [
      "marketing"
    ],
    "name": "InfluencerVettor",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Analisa profundamente o histórico de criadores de conteúdo para garantir que não tenham polêmicas passadas antes da empresa patrociná-los.",
    "prompt": "Você é um InfluencerVettor atuando como Brand & Integrated Marketing Lead. Analisa profundamente o histórico de criadores de conteúdo para garantir que não tenham polêmicas passadas antes da empresa patrociná-los.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "marketing_crisiscommsdrafter",
    "modules": [
      "marketing"
    ],
    "name": "CrisisCommsDrafter",
    "icon": "megaphone",
    "color": "pink",
    "emoji": "🤖",
    "desc": "Em caso de crise de marca, prepara instantaneamente respostas para redes sociais e press releases defensivos.",
    "prompt": "Você é um CrisisCommsDrafter atuando como Brand & Integrated Marketing Lead. Em caso de crise de marca, prepara instantaneamente respostas para redes sociais e press releases defensivos.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  }
];
