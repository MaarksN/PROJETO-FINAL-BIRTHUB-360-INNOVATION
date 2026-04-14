/* eslint-disable max-lines */
import type { Tool } from "../types.js";

export const DATA_TOOLS: Tool[] = [
  {
    "id": "data_requirementsgatherer",
    "modules": [
      "data"
    ],
    "name": "RequirementsGatherer",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Conduz entrevistas por chat com stakeholders de várias áreas para mapear necessidades de negócio e converte isso em Documentos de Requisitos.",
    "prompt": "Você é um RequirementsGatherer atuando como Business Analyst. Conduz entrevistas por chat com stakeholders de várias áreas para mapear necessidades de negócio e converte isso em Documentos de Requisitos.",
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
    "id": "data_processflowmapper",
    "modules": [
      "data"
    ],
    "name": "ProcessFlowMapper",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Transforma descrições em texto de um processo (ex: \"como a nota fiscal é emitida\") em diagramas de fluxo BPMN perfeitos.",
    "prompt": "Você é um ProcessFlowMapper atuando como Business Analyst. Transforma descrições em texto de um processo (ex: \"como a nota fiscal é emitida\") em diagramas de fluxo BPMN perfeitos.",
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
    "id": "data_userstorywriter",
    "modules": [
      "data"
    ],
    "name": "UserStoryWriter",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Converte os requisitos de negócio no formato Ágil (\"Como um usuário, eu quero...\") para entregar mastigado para o time de software.",
    "prompt": "Você é um UserStoryWriter atuando como Business Analyst. Converte os requisitos de negócio no formato Ágil (\"Como um usuário, eu quero...\") para entregar mastigado para o time de software.",
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
    "id": "data_stakeholderupdateautomator",
    "modules": [
      "data"
    ],
    "name": "StakeholderUpdateAutomator",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Pega dados técnicos de desenvolvimento e traduz em atualizações de status gerenciais semanais.",
    "prompt": "Você é um StakeholderUpdateAutomator atuando como Business Analyst. Pega dados técnicos de desenvolvimento e traduz em atualizações de status gerenciais semanais.",
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
    "id": "data_scopecreepdetector",
    "modules": [
      "data"
    ],
    "name": "ScopeCreepDetector",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Alerta o gerente de projeto se novas requisições começam a surgir, indicando que o projeto vai estourar prazo e custo.",
    "prompt": "Você é um ScopeCreepDetector atuando como Business Analyst. Alerta o gerente de projeto se novas requisições começam a surgir, indicando que o projeto vai estourar prazo e custo.",
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
    "id": "data_sqlquerygenerator",
    "modules": [
      "data"
    ],
    "name": "SQLQueryGenerator",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Escreve queries SQL complexas (com JOINs e Window Functions) apenas com comandos de linguagem natural (\"mostre os clientes mais rentáveis do sul\").",
    "prompt": "Você é um SQLQueryGenerator atuando como Data Analyst. Escreve queries SQL complexas (com JOINs e Window Functions) apenas com comandos de linguagem natural (\"mostre os clientes mais rentáveis do sul\").",
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
    "id": "data_anomalydetector",
    "modules": [
      "data"
    ],
    "name": "AnomalyDetector",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Roda silenciosamente 24/7 sobre os bancos de dados da empresa e apita se perceber algo estranho, como queda brusca de acessos no site.",
    "prompt": "Você é um AnomalyDetector atuando como Data Analyst. Roda silenciosamente 24/7 sobre os bancos de dados da empresa e apita se perceber algo estranho, como queda brusca de acessos no site.",
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
    "id": "data_dashboardautofreshener",
    "modules": [
      "data"
    ],
    "name": "DashboardAutoFreshener",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Mantém gráficos no Tableau/Metabase em perfeito funcionamento, refazendo os links de dados se uma coluna for renomeada.",
    "prompt": "Você é um DashboardAutoFreshener atuando como Data Analyst. Mantém gráficos no Tableau/Metabase em perfeito funcionamento, refazendo os links de dados se uma coluna for renomeada.",
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
    "id": "data_datacleaningbot",
    "modules": [
      "data"
    ],
    "name": "DataCleaningBot",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Substitui \"NULLs\", arruma datas invertidas (MM/DD/YY para DD/MM/YY) e elimina discrepâncias brutas sem intervenção humana.",
    "prompt": "Você é um DataCleaningBot atuando como Data Analyst. Substitui \"NULLs\", arruma datas invertidas (MM/DD/YY para DD/MM/YY) e elimina discrepâncias brutas sem intervenção humana.",
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
    "id": "data_statsignificancetester",
    "modules": [
      "data"
    ],
    "name": "StatSignificanceTester",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Informa com selos de confiabilidade matemática se o crescimento de uma métrica foi uma vitória real ou apenas sorte ao acaso.",
    "prompt": "Você é um StatSignificanceTester atuando como Data Analyst. Informa com selos de confiabilidade matemática se o crescimento de uma métrica foi uma vitória real ou apenas sorte ao acaso.",
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
    "id": "data_arrbridgebuilder",
    "modules": [
      "data"
    ],
    "name": "ARRBridgeBuilder",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Constrói o gráfico em \"cascata\" (Waterfall) que mostra de onde veio cada centavo ganho ou perdido entre Janeiro e Dezembro.",
    "prompt": "Você é um ARRBridgeBuilder atuando como Revenue Analyst. Constrói o gráfico em \"cascata\" (Waterfall) que mostra de onde veio cada centavo ganho ou perdido entre Janeiro e Dezembro.",
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
    "id": "data_netretentionmodeler",
    "modules": [
      "data"
    ],
    "name": "NetRetentionModeler",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Rastreia detalhadamente o NRR da empresa, isolando os cancelamentos brutos da expansão de contas (Upsell).",
    "prompt": "Você é um NetRetentionModeler atuando como Revenue Analyst. Rastreia detalhadamente o NRR da empresa, isolando os cancelamentos brutos da expansão de contas (Upsell).",
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
    "id": "data_churncohortisolator",
    "modules": [
      "data"
    ],
    "name": "ChurnCohortIsolator",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Separa grupos de cancelamento para encontrar o \"culpado\": foi um mês específico de vendas ruins? Foi um vendedor? Foi um update do software?",
    "prompt": "Você é um ChurnCohortIsolator atuando como Revenue Analyst. Separa grupos de cancelamento para encontrar o \"culpado\": foi um mês específico de vendas ruins? Foi um vendedor? Foi um update do software?",
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
    "id": "data_pricingelasticitytester",
    "modules": [
      "data"
    ],
    "name": "PricingElasticityTester",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Roda modelos econométricos prevendo quantos clientes a empresa perderia se aumentasse os preços em 5%, 10% e 15%.",
    "prompt": "Você é um PricingElasticityTester atuando como Revenue Analyst. Roda modelos econométricos prevendo quantos clientes a empresa perderia se aumentasse os preços em 5%, 10% e 15%.",
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
    "id": "data_pipelinevelocitytracker",
    "modules": [
      "data"
    ],
    "name": "PipelineVelocityTracker",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Monitora a velocidade com que o dinheiro se move no funil. \"Um lead demora 45 dias da primeira ligação ao contrato assinado\".",
    "prompt": "Você é um PipelineVelocityTracker atuando como Revenue Analyst. Monitora a velocidade com que o dinheiro se move no funil. \"Um lead demora 45 dias da primeira ligação ao contrato assinado\".",
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
    "id": "data_journeydropofflocator",
    "modules": [
      "data"
    ],
    "name": "JourneyDropOffLocator",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Mostra onde exatamente os usuários desistem de uma tela. (Ex: \"30% saem da página no formulário de CEP\").",
    "prompt": "Você é um JourneyDropOffLocator atuando como Product Analyst. Mostra onde exatamente os usuários desistem de uma tela. (Ex: \"30% saem da página no formulário de CEP\").",
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
    "id": "data_featureheatmapper",
    "modules": [
      "data"
    ],
    "name": "FeatureHeatmapper",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Grava onde os usuários estão clicando na tela e cruza com a utilidade das funcionalidades para sugerir melhorias de UX/UI.",
    "prompt": "Você é um FeatureHeatmapper atuando como Product Analyst. Grava onde os usuários estão clicando na tela e cruza com a utilidade das funcionalidades para sugerir melhorias de UX/UI.",
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
    "id": "data_abtestsynthesizer",
    "modules": [
      "data"
    ],
    "name": "ABTestSynthesizer",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Compila resultados complexos de testes de produto A/B/C/D em uma recomendação final clara para o CPO decidir.",
    "prompt": "Você é um ABTestSynthesizer atuando como Product Analyst. Compila resultados complexos de testes de produto A/B/C/D em uma recomendação final clara para o CPO decidir.",
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
    "id": "data_stickinesstracker",
    "modules": [
      "data"
    ],
    "name": "StickinessTracker",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Monitora o DAU/MAU (Usuários Diários vs. Mensais) identificando se o produto virou um hábito ou está sendo esquecido.",
    "prompt": "Você é um StickinessTracker atuando como Product Analyst. Monitora o DAU/MAU (Usuários Diários vs. Mensais) identificando se o produto virou um hábito ou está sendo esquecido.",
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
    "id": "data_sessionreplaysummarizer",
    "modules": [
      "data"
    ],
    "name": "SessionReplaySummarizer",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Ao invés do humano assistir 100 horas de gravação de tela, resume os padrões de comportamento frustrantes dos usuários em texto.",
    "prompt": "Você é um SessionReplaySummarizer atuando como Product Analyst. Ao invés do humano assistir 100 horas de gravação de tela, resume os padrões de comportamento frustrantes dos usuários em texto.",
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
    "id": "data_marketshareestimator",
    "modules": [
      "data"
    ],
    "name": "MarketShareEstimator",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Cruza dados públicos, tráfego da web e declarações fiscais para estimar com boa precisão a fatia de mercado de todos os concorrentes.",
    "prompt": "Você é um MarketShareEstimator atuando como Business Data Analyst. Cruza dados públicos, tráfego da web e declarações fiscais para estimar com boa precisão a fatia de mercado de todos os concorrentes.",
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
    "id": "data_macrofactortracker",
    "modules": [
      "data"
    ],
    "name": "MacroFactorTracker",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Importa e analisa juros, inflação e desemprego, prevendo como essas variáveis vão afetar o faturamento da empresa no próximo semestre.",
    "prompt": "Você é um MacroFactorTracker atuando como Business Data Analyst. Importa e analisa juros, inflação e desemprego, prevendo como essas variáveis vão afetar o faturamento da empresa no próximo semestre.",
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
    "id": "data_competitorfinancialscraper",
    "modules": [
      "data"
    ],
    "name": "CompetitorFinancialScraper",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Lê documentos financeiros de concorrentes de capital aberto e destrincha as margens de lucro deles comparadas com a sua empresa.",
    "prompt": "Você é um CompetitorFinancialScraper atuando como Business Data Analyst. Lê documentos financeiros de concorrentes de capital aberto e destrincha as margens de lucro deles comparadas com a sua empresa.",
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
    "id": "data_strategickpiaggregator",
    "modules": [
      "data"
    ],
    "name": "StrategicKPIAggregator",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Une KPIs de RH, Vendas e Produção em uma única métrica (A \"Estrela do Norte\" ou North Star Metric) para a diretoria.",
    "prompt": "Você é um StrategicKPIAggregator atuando como Business Data Analyst. Une KPIs de RH, Vendas e Produção em uma única métrica (A \"Estrela do Norte\" ou North Star Metric) para a diretoria.",
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
    "id": "data_geospatialexpansionmapper",
    "modules": [
      "data"
    ],
    "name": "GeospatialExpansionMapper",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Cruza dados demográficos e de logística para indicar, em um mapa interativo, onde abrir a próxima fábrica ou filial.",
    "prompt": "Você é um GeospatialExpansionMapper atuando como Business Data Analyst. Cruza dados demográficos e de logística para indicar, em um mapa interativo, onde abrir a próxima fábrica ou filial.",
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
    "id": "data_attributionmodeler",
    "modules": [
      "data"
    ],
    "name": "AttributionModeler",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Divide o crédito de uma venda complexa com precisão matemática (ex: 20% pro e-mail, 40% pro webinar, 40% pro LinkedIn).",
    "prompt": "Você é um AttributionModeler atuando como Marketing Data Analyst. Divide o crédito de uma venda complexa com precisão matemática (ex: 20% pro e-mail, 40% pro webinar, 40% pro LinkedIn).",
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
    "id": "data_mediamixoptimizer",
    "modules": [
      "data"
    ],
    "name": "MediaMixOptimizer",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Modela cenários matemáticos para dizer se a empresa ganha mais investindo 100 mil no GoogleAds ou 100 mil em patrocínio de eventos.",
    "prompt": "Você é um MediaMixOptimizer atuando como Marketing Data Analyst. Modela cenários matemáticos para dizer se a empresa ganha mais investindo 100 mil no GoogleAds ou 100 mil em patrocínio de eventos.",
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
    "id": "data_campaigndecaypredictor",
    "modules": [
      "data"
    ],
    "name": "CampaignDecayPredictor",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Prevê exatamente quando uma campanha publicitária de sucesso vai começar a \"cansar\" e parar de dar lucro.",
    "prompt": "Você é um CampaignDecayPredictor atuando como Marketing Data Analyst. Prevê exatamente quando uma campanha publicitária de sucesso vai começar a \"cansar\" e parar de dar lucro.",
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
    "id": "data_audiencesegmentdiscoverer",
    "modules": [
      "data"
    ],
    "name": "AudienceSegmentDiscoverer",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Usa clusterização não-supervisionada para descobrir que clientes com o comportamento A, B e C compram mais rápido, criando uma nova persona.",
    "prompt": "Você é um AudienceSegmentDiscoverer atuando como Marketing Data Analyst. Usa clusterização não-supervisionada para descobrir que clientes com o comportamento A, B e C compram mais rápido, criando uma nova persona.",
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
    "id": "data_ltvbychannelcalculator",
    "modules": [
      "data"
    ],
    "name": "LTVbyChannelCalculator",
    "icon": "bar-chart",
    "color": "cyan",
    "emoji": "🤖",
    "desc": "Aponta que o CAC do Google pode ser mais alto, mas os clientes que vêm de lá gastam 3x mais durante a vida (Lifetime Value).",
    "prompt": "Você é um LTVbyChannelCalculator atuando como Marketing Data Analyst. Aponta que o CAC do Google pode ser mais alto, mas os clientes que vêm de lá gastam 3x mais durante a vida (Lifetime Value).",
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
