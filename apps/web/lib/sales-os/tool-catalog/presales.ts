/* eslint-disable max-lines */
import type { Tool } from "../types.js";

export const PRESALES_TOOLS: Tool[] = [
  {
    "id": "presales_inboundscorer",
    "modules": [
      "presales"
    ],
    "name": "InboundScorer",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Avalia leads que chegam pelo site em segundos e roteia os mais quentes direto para o telefone, ignorando curiosos.",
    "prompt": "Você é um InboundScorer atuando como SDR (Sales Development Representative). Avalia leads que chegam pelo site em segundos e roteia os mais quentes direto para o telefone, ignorando curiosos.",
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
    "id": "presales_objectioncrusher",
    "modules": [
      "presales"
    ],
    "name": "ObjectionCrusher",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Sugere respostas perfeitas (em texto ou voz) em tempo real enquanto o SDR tenta agendar a reunião com um lead difícil.",
    "prompt": "Você é um ObjectionCrusher atuando como SDR (Sales Development Representative). Sugere respostas perfeitas (em texto ou voz) em tempo real enquanto o SDR tenta agendar a reunião com um lead difícil.",
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
    "id": "presales_personalizationengine",
    "modules": [
      "presales"
    ],
    "name": "PersonalizationEngine",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Varre as redes sociais do lead e gera e-mails de prospecção altamente personalizados focados nos interesses e dores recentes dele.",
    "prompt": "Você é um PersonalizationEngine atuando como SDR (Sales Development Representative). Varre as redes sociais do lead e gera e-mails de prospecção altamente personalizados focados nos interesses e dores recentes dele.",
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
    "id": "presales_followupghost",
    "modules": [
      "presales"
    ],
    "name": "FollowUpGhost",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Mantém cadências de acompanhamento infinitas e humanizadas até que o lead responda, parando automaticamente em respostas positivas/negativas.",
    "prompt": "Você é um FollowUpGhost atuando como SDR (Sales Development Representative). Mantém cadências de acompanhamento infinitas e humanizadas até que o lead responda, parando automaticamente em respostas positivas/negativas.",
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
    "id": "presales_calendarsniper",
    "modules": [
      "presales"
    ],
    "name": "CalendarSniper",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Negocia horários de reunião com o lead via e-mail e envia o convite de calendário sem a intervenção do SDR.",
    "prompt": "Você é um CalendarSniper atuando como SDR (Sales Development Representative). Negocia horários de reunião com o lead via e-mail e envia o convite de calendário sem a intervenção do SDR.",
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
    "id": "presales_targetscraper",
    "modules": [
      "presales"
    ],
    "name": "TargetScraper",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Varre diretórios corporativos e LinkedIn para encontrar os tomadores de decisão exatos dentro de contas-alvo específicas (Outbound puro).",
    "prompt": "Você é um TargetScraper atuando como BDR (Business Development Representative). Varre diretórios corporativos e LinkedIn para encontrar os tomadores de decisão exatos dentro de contas-alvo específicas (Outbound puro).",
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
    "id": "presales_coldcallscripter",
    "modules": [
      "presales"
    ],
    "name": "ColdCallScripter",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Gera roteiros de ligação fria dinâmicos que mudam na tela do BDR dependendo das respostas do prospect.",
    "prompt": "Você é um ColdCallScripter atuando como BDR (Business Development Representative). Gera roteiros de ligação fria dinâmicos que mudam na tela do BDR dependendo das respostas do prospect.",
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
    "id": "presales_triggereventwatcher",
    "modules": [
      "presales"
    ],
    "name": "TriggerEventWatcher",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Alerta o BDR imediatamente se uma conta-alvo recebe investimento, contrata um novo executivo ou lança um produto.",
    "prompt": "Você é um TriggerEventWatcher atuando como BDR (Business Development Representative). Alerta o BDR imediatamente se uma conta-alvo recebe investimento, contrata um novo executivo ou lança um produto.",
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
    "id": "presales_accountmapper",
    "modules": [
      "presales"
    ],
    "name": "AccountMapper",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Cria o organograma de empresas-alvo grandes, identificando quem são os influenciadores, bloqueadores e compradores.",
    "prompt": "Você é um AccountMapper atuando como BDR (Business Development Representative). Cria o organograma de empresas-alvo grandes, identificando quem são os influenciadores, bloqueadores e compradores.",
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
    "id": "presales_voicemaildropper",
    "modules": [
      "presales"
    ],
    "name": "VoicemailDropper",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Deixa mensagens de voz perfeitamente sintetizadas com o tom de voz do BDR caso a ligação caia na caixa postal.",
    "prompt": "Você é um VoicemailDropper atuando como BDR (Business Development Representative). Deixa mensagens de voz perfeitamente sintetizadas com o tom de voz do BDR caso a ligação caia na caixa postal.",
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
    "id": "presales_datacleaner",
    "modules": [
      "presales"
    ],
    "name": "DataCleaner",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Corrige automaticamente nomes com erros de digitação, atualiza cargos desatualizados e formata números de telefone no CRM.",
    "prompt": "Você é um DataCleaner atuando como LDR (Lead Development Representative). Corrige automaticamente nomes com erros de digitação, atualiza cargos desatualizados e formata números de telefone no CRM.",
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
    "id": "presales_intentdecoder",
    "modules": [
      "presales"
    ],
    "name": "IntentDecoder",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Lê sinais de intenção de compra de provedores de dados terceirizados (ex: Bombora) e alerta quais empresas estão pesquisando sobre seu setor.",
    "prompt": "Você é um IntentDecoder atuando como LDR (Lead Development Representative). Lê sinais de intenção de compra de provedores de dados terceirizados (ex: Bombora) e alerta quais empresas estão pesquisando sobre seu setor.",
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
    "id": "presales_webinarnurturer",
    "modules": [
      "presales"
    ],
    "name": "WebinarNurturer",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Entra em contato automaticamente com quem participou de um evento, enviando materiais extras e qualificando-os.",
    "prompt": "Você é um WebinarNurturer atuando como LDR (Lead Development Representative). Entra em contato automaticamente com quem participou de um evento, enviando materiais extras e qualificando-os.",
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
    "id": "presales_enrichmentbot",
    "modules": [
      "presales"
    ],
    "name": "EnrichmentBot",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Pega um simples endereço de e-mail e enriquece o CRM com o tamanho da empresa, faturamento estimado, stack de tecnologia e localização.",
    "prompt": "Você é um EnrichmentBot atuando como LDR (Lead Development Representative). Pega um simples endereço de e-mail e enriquece o CRM com o tamanho da empresa, faturamento estimado, stack de tecnologia e localização.",
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
    "id": "presales_routingtrafficcop",
    "modules": [
      "presales"
    ],
    "name": "RoutingTrafficCop",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Garante que leads de campanhas de marketing não sejam distribuídos para o SDR errado com base em território, fuso horário ou especialização.",
    "prompt": "Você é um RoutingTrafficCop atuando como LDR (Lead Development Representative). Garante que leads de campanhas de marketing não sejam distribuídos para o SDR errado com base em território, fuso horário ou especialização.",
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
    "id": "presales_multithreader",
    "modules": [
      "presales"
    ],
    "name": "MultiThreader",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Inicia conversas simultâneas e correlacionadas com vários executivos da mesma conta para cercar a empresa (Account-Based Marketing/Sales).",
    "prompt": "Você é um MultiThreader atuando como ADR (Account Development Representative). Inicia conversas simultâneas e correlacionadas com vários executivos da mesma conta para cercar a empresa (Account-Based Marketing/Sales).",
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
    "id": "presales_annualreportanalyzer",
    "modules": [
      "presales"
    ],
    "name": "AnnualReportAnalyzer",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Lê relatórios anuais (10-K) de grandes empresas abertas e extrai quais são as iniciativas estratégicas para o ADR usar no pitch.",
    "prompt": "Você é um AnnualReportAnalyzer atuando como ADR (Account Development Representative). Lê relatórios anuais (10-K) de grandes empresas abertas e extrai quais são as iniciativas estratégicas para o ADR usar no pitch.",
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
    "id": "presales_competitordisplacement",
    "modules": [
      "presales"
    ],
    "name": "CompetitorDisplacement",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Identifica quando uma conta-alvo está usando o software concorrente e cujo contrato está prestes a expirar.",
    "prompt": "Você é um CompetitorDisplacement atuando como ADR (Account Development Representative). Identifica quando uma conta-alvo está usando o software concorrente e cujo contrato está prestes a expirar.",
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
    "id": "presales_gatekeeperbypass",
    "modules": [
      "presales"
    ],
    "name": "GatekeeperBypass",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Analisa os melhores horários e canais para desviar de assistentes e secretárias, chegando direto ao tomador de decisão.",
    "prompt": "Você é um GatekeeperBypass atuando como ADR (Account Development Representative). Analisa os melhores horários e canais para desviar de assistentes e secretárias, chegando direto ao tomador de decisão.",
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
    "id": "presales_stakeholderpersonagenerator",
    "modules": [
      "presales"
    ],
    "name": "StakeholderPersonaGenerator",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Cria perfis psicológicos dos executivos-alvo para orientar o ADR sobre que tipo de argumento usar com cada um.",
    "prompt": "Você é um StakeholderPersonaGenerator atuando como ADR (Account Development Representative). Cria perfis psicológicos dos executivos-alvo para orientar o ADR sobre que tipo de argumento usar com cada um.",
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
    "id": "presales_nicheexplorer",
    "modules": [
      "presales"
    ],
    "name": "NicheExplorer",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Encontra micro-segmentos de mercado inexplorados e gera listas de prospecção altamente nichadas.",
    "prompt": "Você é um NicheExplorer atuando como MDR (Market Development Representative). Encontra micro-segmentos de mercado inexplorados e gera listas de prospecção altamente nichadas.",
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
    "id": "presales_partnerecosystemscout",
    "modules": [
      "presales"
    ],
    "name": "PartnerEcosystemScout",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Identifica leads que usam ferramentas parceiras da sua empresa para focar em abordagens do tipo \"Melhor Juntos\" (Better Together).",
    "prompt": "Você é um PartnerEcosystemScout atuando como MDR (Market Development Representative). Identifica leads que usam ferramentas parceiras da sua empresa para focar em abordagens do tipo \"Melhor Juntos\" (Better Together).",
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
    "id": "presales_contenttolead",
    "modules": [
      "presales"
    ],
    "name": "ContentToLead",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Associa o último eBook ou Whitepaper que o lead baixou à dor de mercado exata dele, gerando o roteiro de ligação.",
    "prompt": "Você é um ContentToLead atuando como MDR (Market Development Representative). Associa o último eBook ou Whitepaper que o lead baixou à dor de mercado exata dele, gerando o roteiro de ligação.",
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
    "id": "presales_eventqualifier",
    "modules": [
      "presales"
    ],
    "name": "EventQualifier",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Escaneia crachás (digitalmente) ou listas de inscritos em eventos da indústria e qualifica instantaneamente quem deve ser abordado.",
    "prompt": "Você é um EventQualifier atuando como MDR (Market Development Representative). Escaneia crachás (digitalmente) ou listas de inscritos em eventos da indústria e qualifica instantaneamente quem deve ser abordado.",
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
    "id": "presales_verticaltranslator",
    "modules": [
      "presales"
    ],
    "name": "VerticalTranslator",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Adapta a linguagem do MDR automaticamente. Se ele fala com uma clínica, usa termos médicos; se fala com uma fábrica, usa jargões industriais.",
    "prompt": "Você é um VerticalTranslator atuando como MDR (Market Development Representative). Adapta a linguagem do MDR automaticamente. Se ele fala com uma clínica, usa termos médicos; se fala com uma fábrica, usa jargões industriais.",
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
    "id": "presales_activityanalyzer",
    "modules": [
      "presales"
    ],
    "name": "ActivityAnalyzer",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Monitora o volume de ligações e e-mails de toda a equipe, alertando se algum representante está abaixo da métrica.",
    "prompt": "Você é um ActivityAnalyzer atuando como Sales Development Team Lead. Monitora o volume de ligações e e-mails de toda a equipe, alertando se algum representante está abaixo da métrica.",
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
    "id": "presales_transcriptcoach",
    "modules": [
      "presales"
    ],
    "name": "TranscriptCoach",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Lê as transcrições de 100% das chamadas e destaca as falhas de roteiro e oportunidades de treinamento para cada liderado.",
    "prompt": "Você é um TranscriptCoach atuando como Sales Development Team Lead. Lê as transcrições de 100% das chamadas e destaca as falhas de roteiro e oportunidades de treinamento para cada liderado.",
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
    "id": "presales_gamificationmaster",
    "modules": [
      "presales"
    ],
    "name": "GamificationMaster",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Cria e gerencia competições de vendas dinâmicas (SPIFFs) baseadas nos KPIs que mais precisam melhorar na semana.",
    "prompt": "Você é um GamificationMaster atuando como Sales Development Team Lead. Cria e gerencia competições de vendas dinâmicas (SPIFFs) baseadas nos KPIs que mais precisam melhorar na semana.",
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
    "id": "presales_rampupassistant",
    "modules": [
      "presales"
    ],
    "name": "RampUpAssistant",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Auxilia novos SDRs nos primeiros 30 dias, criando testes e simulações com clientes virtuais baseados em IA.",
    "prompt": "Você é um RampUpAssistant atuando como Sales Development Team Lead. Auxilia novos SDRs nos primeiros 30 dias, criando testes e simulações com clientes virtuais baseados em IA.",
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
    "id": "presales_conversionforecaster",
    "modules": [
      "presales"
    ],
    "name": "ConversionForecaster",
    "icon": "target",
    "color": "emerald",
    "emoji": "🤖",
    "desc": "Prevê quantas reuniões a equipe vai agendar na semana baseando-se na taxa de abertura de e-mails de hoje.",
    "prompt": "Você é um ConversionForecaster atuando como Sales Development Team Lead. Prevê quantas reuniões a equipe vai agendar na semana baseando-se na taxa de abertura de e-mails de hoje.",
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
