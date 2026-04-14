/* eslint-disable max-lines */
import type { Tool } from "../types.js";

export const EXEC_TOOLS: Tool[] = [
  {
    "id": "exec_boardprep_ai",
    "modules": [
      "exec"
    ],
    "name": "BoardPrep AI",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Analisa os resultados da empresa e cria automaticamente apresentações, relatórios e narrativas para reuniões de conselho (Board of Directors).",
    "prompt": "Você é um BoardPrep AI atuando como CEO (Chief Executive Officer). Analisa os resultados da empresa e cria automaticamente apresentações, relatórios e narrativas para reuniões de conselho (Board of Directors).",
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
    "id": "exec_marketsentinel",
    "modules": [
      "exec"
    ],
    "name": "MarketSentinel",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Monitora movimentos macroeconômicos, fusões e aquisições (M&A) e notícias de concorrentes para sugerir pivotagens estratégicas em tempo real.",
    "prompt": "Você é um MarketSentinel atuando como CEO (Chief Executive Officer). Monitora movimentos macroeconômicos, fusões e aquisições (M&A) e notícias de concorrentes para sugerir pivotagens estratégicas em tempo real.",
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
    "id": "exec_culturepulse",
    "modules": [
      "exec"
    ],
    "name": "CulturePulse",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Analisa comunicações internas (Slack/Teams) de forma anônima para medir o moral da empresa e prever riscos de turnover de talentos-chave.",
    "prompt": "Você é um CulturePulse atuando como CEO (Chief Executive Officer). Analisa comunicações internas (Slack/Teams) de forma anônima para medir o moral da empresa e prever riscos de turnover de talentos-chave.",
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
    "id": "exec_crisisnavigator",
    "modules": [
      "exec"
    ],
    "name": "CrisisNavigator",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Em caso de crises (PR, vazamento de dados), gera planos de contingência instantâneos, rascunhos de comunicados de imprensa e roteiros de respostas.",
    "prompt": "Você é um CrisisNavigator atuando como CEO (Chief Executive Officer). Em caso de crises (PR, vazamento de dados), gera planos de contingência instantâneos, rascunhos de comunicados de imprensa e roteiros de respostas.",
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
    "id": "exec_capitalallocator",
    "modules": [
      "exec"
    ],
    "name": "CapitalAllocator",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Simula cenários de alocação de capital e ROI a longo prazo para ajudar na decisão de onde investir recursos financeiros.",
    "prompt": "Você é um CapitalAllocator atuando como CEO (Chief Executive Officer). Simula cenários de alocação de capital e ROI a longo prazo para ajudar na decisão de onde investir recursos financeiros.",
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
    "id": "exec_pipelineoracle",
    "modules": [
      "exec"
    ],
    "name": "PipelineOracle",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Previsão preditiva avançada que cruza dados históricos para estimar o fechamento de receita com 99% de precisão.",
    "prompt": "Você é um PipelineOracle atuando como CRO (Chief Revenue Officer). Previsão preditiva avançada que cruza dados históricos para estimar o fechamento de receita com 99% de precisão.",
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
    "id": "exec_churndeflector",
    "modules": [
      "exec"
    ],
    "name": "ChurnDeflector",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Identifica sinais precoces de cancelamento em toda a base de clientes e aciona gatilhos de retenção automáticos.",
    "prompt": "Você é um ChurnDeflector atuando como CRO (Chief Revenue Officer). Identifica sinais precoces de cancelamento em toda a base de clientes e aciona gatilhos de retenção automáticos.",
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
    "id": "exec_pricingoptimizer",
    "modules": [
      "exec"
    ],
    "name": "PricingOptimizer",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Analisa a elasticidade de preço, custos e concorrência para sugerir ajustes dinâmicos nas tabelas de preços e maximizar a margem.",
    "prompt": "Você é um PricingOptimizer atuando como CRO (Chief Revenue Officer). Analisa a elasticidade de preço, custos e concorrência para sugerir ajustes dinâmicos nas tabelas de preços e maximizar a margem.",
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
    "id": "exec_expansionmapper",
    "modules": [
      "exec"
    ],
    "name": "ExpansionMapper",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Varre a base de clientes atual para encontrar oportunidades ocultas de cross-sell e up-sell, criando o pitch perfeito para cada uma.",
    "prompt": "Você é um ExpansionMapper atuando como CRO (Chief Revenue Officer). Varre a base de clientes atual para encontrar oportunidades ocultas de cross-sell e up-sell, criando o pitch perfeito para cada uma.",
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
    "id": "exec_quotaarchitect",
    "modules": [
      "exec"
    ],
    "name": "QuotaArchitect",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Desenha e simula modelos complexos de comissionamento e metas de vendas para garantir a motivação do time e a saúde financeira.",
    "prompt": "Você é um QuotaArchitect atuando como CRO (Chief Revenue Officer). Desenha e simula modelos complexos de comissionamento e metas de vendas para garantir a motivação do time e a saúde financeira.",
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
    "id": "exec_brandguardian",
    "modules": [
      "exec"
    ],
    "name": "BrandGuardian",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Monitora todas as campanhas, textos e imagens gerados pela empresa para garantir 100% de aderência ao tom de voz e manual da marca.",
    "prompt": "Você é um BrandGuardian atuando como CMO (Chief Marketing Officer). Monitora todas as campanhas, textos e imagens gerados pela empresa para garantir 100% de aderência ao tom de voz e manual da marca.",
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
    "id": "exec_trendcatcher",
    "modules": [
      "exec"
    ],
    "name": "TrendCatcher",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Analisa bilhões de pontos de dados sociais para identificar tendências emergentes antes que viralizem, sugerindo campanhas proativas.",
    "prompt": "Você é um TrendCatcher atuando como CMO (Chief Marketing Officer). Analisa bilhões de pontos de dados sociais para identificar tendências emergentes antes que viralizem, sugerindo campanhas proativas.",
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
    "id": "exec_budgetfluid",
    "modules": [
      "exec"
    ],
    "name": "BudgetFluid",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Agente autônomo que realoca o orçamento de marketing entre canais (Meta, Google, LinkedIn) em tempo real, focado no menor CAC.",
    "prompt": "Você é um BudgetFluid atuando como CMO (Chief Marketing Officer). Agente autônomo que realoca o orçamento de marketing entre canais (Meta, Google, LinkedIn) em tempo real, focado no menor CAC.",
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
    "id": "exec_narrativeweaver",
    "modules": [
      "exec"
    ],
    "name": "NarrativeWeaver",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Cria a visão de longo prazo de campanhas e posicionamento de produto, gerando os pilares de comunicação anuais.",
    "prompt": "Você é um NarrativeWeaver atuando como CMO (Chief Marketing Officer). Cria a visão de longo prazo de campanhas e posicionamento de produto, gerando os pilares de comunicação anuais.",
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
    "id": "exec_competitorx_ray",
    "modules": [
      "exec"
    ],
    "name": "CompetitorX-Ray",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Faz engenharia reversa das estratégias de marketing dos concorrentes, estimando os orçamentos e táticas deles.",
    "prompt": "Você é um CompetitorX-Ray atuando como CMO (Chief Marketing Officer). Faz engenharia reversa das estratégias de marketing dos concorrentes, estimando os orçamentos e táticas deles.",
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
    "id": "exec_cashflowclairvoyant",
    "modules": [
      "exec"
    ],
    "name": "CashFlowClairvoyant",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Previsão diária e em tempo real do fluxo de caixa, cruzando contas a pagar, a receber, sazonalidade e risco de inadimplência.",
    "prompt": "Você é um CashFlowClairvoyant atuando como CFO (Chief Financial Officer). Previsão diária e em tempo real do fluxo de caixa, cruzando contas a pagar, a receber, sazonalidade e risco de inadimplência.",
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
    "id": "exec_auditbot",
    "modules": [
      "exec"
    ],
    "name": "AuditBot",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Varre continuamente 100% das transações financeiras em busca de anomalias, fraudes, ou desvios de compliance antes das auditorias oficiais.",
    "prompt": "Você é um AuditBot atuando como CFO (Chief Financial Officer). Varre continuamente 100% das transações financeiras em busca de anomalias, fraudes, ou desvios de compliance antes das auditorias oficiais.",
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
    "id": "exec_taxoptimizer",
    "modules": [
      "exec"
    ],
    "name": "TaxOptimizer",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Analisa as leis tributárias globais e sugere rotas e estruturas corporativas para minimização legal de impostos.",
    "prompt": "Você é um TaxOptimizer atuando como CFO (Chief Financial Officer). Analisa as leis tributárias globais e sugere rotas e estruturas corporativas para minimização legal de impostos.",
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
    "id": "exec_captablemanager",
    "modules": [
      "exec"
    ],
    "name": "CapTableManager",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Simula rodadas de investimento, diluição de fundadores e funcionários, e modela cenários de valuation para captações.",
    "prompt": "Você é um CapTableManager atuando como CFO (Chief Financial Officer). Simula rodadas de investimento, diluição de fundadores e funcionários, e modela cenários de valuation para captações.",
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
    "id": "exec_spendcontroller",
    "modules": [
      "exec"
    ],
    "name": "SpendController",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Aprova ou bloqueia despesas da empresa automaticamente com base em políticas orçamentárias pré-estabelecidas e ROI esperado.",
    "prompt": "Você é um SpendController atuando como CFO (Chief Financial Officer). Aprova ou bloqueia despesas da empresa automaticamente com base em políticas orçamentárias pré-estabelecidas e ROI esperado.",
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
    "id": "exec_sentimentaggregator",
    "modules": [
      "exec"
    ],
    "name": "SentimentAggregator",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Lê todas as interações de suporte, e-mails e redes sociais para criar um mapa de calor em tempo real do sentimento do cliente.",
    "prompt": "Você é um SentimentAggregator atuando como CCO (Chief Customer Officer). Lê todas as interações de suporte, e-mails e redes sociais para criar um mapa de calor em tempo real do sentimento do cliente.",
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
    "id": "exec_journeyarchitect",
    "modules": [
      "exec"
    ],
    "name": "JourneyArchitect",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Desenha e ajusta automaticamente a jornada do cliente, sugerindo novos pontos de contato baseados em onde os clientes mais engajam.",
    "prompt": "Você é um JourneyArchitect atuando como CCO (Chief Customer Officer). Desenha e ajusta automaticamente a jornada do cliente, sugerindo novos pontos de contato baseados em onde os clientes mais engajam.",
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
    "id": "exec_vipconcierge",
    "modules": [
      "exec"
    ],
    "name": "VIPConcierge",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Um agente dedicado 24/7 a monitorar e resolver preventivamente qualquer pequeno atrito com as contas Enterprise de maior valor.",
    "prompt": "Você é um VIPConcierge atuando como CCO (Chief Customer Officer). Um agente dedicado 24/7 a monitorar e resolver preventivamente qualquer pequeno atrito com as contas Enterprise de maior valor.",
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
    "id": "exec_advocacyfinder",
    "modules": [
      "exec"
    ],
    "name": "AdvocacyFinder",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Identifica os clientes mais felizes e engajados e automatiza convites para cases de sucesso, reviews no G2/Capterra e indicações.",
    "prompt": "Você é um AdvocacyFinder atuando como CCO (Chief Customer Officer). Identifica os clientes mais felizes e engajados e automatiza convites para cases de sucesso, reviews no G2/Capterra e indicações.",
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
    "id": "exec_escalationpredictor",
    "modules": [
      "exec"
    ],
    "name": "EscalationPredictor",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Prevê quais tickets de suporte ou reclamações têm chance de virar problemas públicos severos e alerta a diretoria.",
    "prompt": "Você é um EscalationPredictor atuando como CCO (Chief Customer Officer). Prevê quais tickets de suporte ou reclamações têm chance de virar problemas públicos severos e alerta a diretoria.",
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
    "id": "exec_nota",
    "modules": [
      "exec"
    ],
    "name": "(Nota",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Dividido para cobrir Produto e Pessoas)",
    "prompt": "Você é um (Nota atuando como CPO (Chief Product Officer / Chief People Officer). Dividido para cobrir Produto e Pessoas)",
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
    "id": "exec_featureroi_produto",
    "modules": [
      "exec"
    ],
    "name": "FeatureROI (Produto)",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Calcula o custo de desenvolvimento versus a receita/retenção gerada por cada funcionalidade do produto.",
    "prompt": "Você é um FeatureROI (Produto) atuando como CPO (Chief Product Officer / Chief People Officer). Calcula o custo de desenvolvimento versus a receita/retenção gerada por cada funcionalidade do produto.",
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
    "id": "exec_roadmapauto_prioritizer_produto",
    "modules": [
      "exec"
    ],
    "name": "RoadmapAuto-Prioritizer (Produto)",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Reorganiza o backlog de desenvolvimento automaticamente com base no feedback de clientes, bugs críticos e metas de receita.",
    "prompt": "Você é um RoadmapAuto-Prioritizer (Produto) atuando como CPO (Chief Product Officer / Chief People Officer). Reorganiza o backlog de desenvolvimento automaticamente com base no feedback de clientes, bugs críticos e metas de receita.",
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
    "id": "exec_talentscout_pessoas",
    "modules": [
      "exec"
    ],
    "name": "TalentScout (Pessoas)",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Busca passivamente na internet os melhores talentos para vagas abertas e inicia um engajamento hiper-personalizado.",
    "prompt": "Você é um TalentScout (Pessoas) atuando como CPO (Chief Product Officer / Chief People Officer). Busca passivamente na internet os melhores talentos para vagas abertas e inicia um engajamento hiper-personalizado.",
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
    "id": "exec_skillgapanalyzer_pessoas",
    "modules": [
      "exec"
    ],
    "name": "SkillGapAnalyzer (Pessoas)",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Mapeia as habilidades atuais da equipe e prevê quais skills serão necessárias em 2 anos, criando planos de treinamento.",
    "prompt": "Você é um SkillGapAnalyzer (Pessoas) atuando como CPO (Chief Product Officer / Chief People Officer). Mapeia as habilidades atuais da equipe e prevê quais skills serão necessárias em 2 anos, criando planos de treinamento.",
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
    "id": "exec_compensationbenchmarker_pessoas",
    "modules": [
      "exec"
    ],
    "name": "CompensationBenchmarker (Pessoas)",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Analisa salários do mercado em tempo real para alertar quando um talento interno corre risco de sair por defasagem salarial.",
    "prompt": "Você é um CompensationBenchmarker (Pessoas) atuando como CPO (Chief Product Officer / Chief People Officer). Analisa salários do mercado em tempo real para alertar quando um talento interno corre risco de sair por defasagem salarial.",
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
    "id": "exec_bottleneckdetector",
    "modules": [
      "exec"
    ],
    "name": "BottleneckDetector",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Mapeia todos os processos operacionais da empresa e aponta exatamente onde estão os atrasos e desperdícios de tempo.",
    "prompt": "Você é um BottleneckDetector atuando como COO (Chief Operating Officer). Mapeia todos os processos operacionais da empresa e aponta exatamente onde estão os atrasos e desperdícios de tempo.",
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
    "id": "exec_vendornegotiator",
    "modules": [
      "exec"
    ],
    "name": "VendorNegotiator",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Agente que negocia automaticamente renovações de contratos de software e fornecedores buscando os melhores descontos.",
    "prompt": "Você é um VendorNegotiator atuando como COO (Chief Operating Officer). Agente que negocia automaticamente renovações de contratos de software e fornecedores buscando os melhores descontos.",
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
    "id": "exec_supplychainsync",
    "modules": [
      "exec"
    ],
    "name": "SupplyChainSync",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Previsão autônoma de necessidades logísticas e de suprimentos, emitindo pedidos de compra antes que falte estoque ou infraestrutura.",
    "prompt": "Você é um SupplyChainSync atuando como COO (Chief Operating Officer). Previsão autônoma de necessidades logísticas e de suprimentos, emitindo pedidos de compra antes que falte estoque ou infraestrutura.",
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
    "id": "exec_complianceenforcer",
    "modules": [
      "exec"
    ],
    "name": "ComplianceEnforcer",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Garante que todas as operações diárias sigam as normas ISO, LGPD, GDPR, auditando processos em tempo real.",
    "prompt": "Você é um ComplianceEnforcer atuando como COO (Chief Operating Officer). Garante que todas as operações diárias sigam as normas ISO, LGPD, GDPR, auditando processos em tempo real.",
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
    "id": "exec_resourcebalancer",
    "modules": [
      "exec"
    ],
    "name": "ResourceBalancer",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Realoca equipes e infraestrutura computacional dinamicamente para projetos que estão atrasados ou com alta demanda.",
    "prompt": "Você é um ResourceBalancer atuando como COO (Chief Operating Officer). Realoca equipes e infraestrutura computacional dinamicamente para projetos que estão atrasados ou com alta demanda.",
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
    "id": "exec_territorymapper",
    "modules": [
      "exec"
    ],
    "name": "TerritoryMapper",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Desenha territórios de vendas perfeitamente equilibrados usando dados geoespaciais e potencial de receita.",
    "prompt": "Você é um TerritoryMapper atuando como VP de Vendas. Desenha territórios de vendas perfeitamente equilibrados usando dados geoespaciais e potencial de receita.",
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
    "id": "exec_repcoach_ai",
    "modules": [
      "exec"
    ],
    "name": "RepCoach AI",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Ouve as ligações da equipe de vendas em tempo real e fornece dicas sussurradas no ouvido do vendedor (ou via chat) sobre como lidar com objeções.",
    "prompt": "Você é um RepCoach AI atuando como VP de Vendas. Ouve as ligações da equipe de vendas em tempo real e fornece dicas sussurradas no ouvido do vendedor (ou via chat) sobre como lidar com objeções.",
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
    "id": "exec_forecastrollup",
    "modules": [
      "exec"
    ],
    "name": "ForecastRollup",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Consolida as previsões de todos os gerentes, eliminando o \"sandbagging\" (esconder jogo) ou otimismo exagerado dos vendedores.",
    "prompt": "Você é um ForecastRollup atuando como VP de Vendas. Consolida as previsões de todos os gerentes, eliminando o \"sandbagging\" (esconder jogo) ou otimismo exagerado dos vendedores.",
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
    "id": "exec_dealdeskautopilot",
    "modules": [
      "exec"
    ],
    "name": "DealDeskAutopilot",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Aprova ou rejeita solicitações de descontos complexos instantaneamente, visando proteger a margem mínima aceitável.",
    "prompt": "Você é um DealDeskAutopilot atuando como VP de Vendas. Aprova ou rejeita solicitações de descontos complexos instantaneamente, visando proteger a margem mínima aceitável.",
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
    "id": "exec_strategicpartnerscout",
    "modules": [
      "exec"
    ],
    "name": "StrategicPartnerScout",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Identifica empresas não-concorrentes para parcerias de co-marketing e vendas, gerando a abordagem inicial para o VP.",
    "prompt": "Você é um StrategicPartnerScout atuando como VP de Vendas. Identifica empresas não-concorrentes para parcerias de co-marketing e vendas, gerando a abordagem inicial para o VP.",
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
    "id": "exec_channelmixer",
    "modules": [
      "exec"
    ],
    "name": "ChannelMixer",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Define a alocação macro de orçamento de marketing anualmente e ajusta trimestralmente com base na mudança de comportamento do consumidor.",
    "prompt": "Você é um ChannelMixer atuando como VP de Marketing. Define a alocação macro de orçamento de marketing anualmente e ajusta trimestralmente com base na mudança de comportamento do consumidor.",
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
    "id": "exec_agencyauditor",
    "modules": [
      "exec"
    ],
    "name": "AgencyAuditor",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Avalia automaticamente as entregas, métricas e faturamento de agências de marketing terceirizadas para garantir o ROI.",
    "prompt": "Você é um AgencyAuditor atuando como VP de Marketing. Avalia automaticamente as entregas, métricas e faturamento de agências de marketing terceirizadas para garantir o ROI.",
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
    "id": "exec_globalbrandlocalizer",
    "modules": [
      "exec"
    ],
    "name": "GlobalBrandLocalizer",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Adapta automaticamente campanhas globais para contextos, culturas e gírias locais em dezenas de países.",
    "prompt": "Você é um GlobalBrandLocalizer atuando como VP de Marketing. Adapta automaticamente campanhas globais para contextos, culturas e gírias locais em dezenas de países.",
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
    "id": "exec_marketingtecharchitect",
    "modules": [
      "exec"
    ],
    "name": "MarketingTechArchitect",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Monitora o stack de ferramentas de marketing e sugere consolidações ou novas tecnologias para otimizar operações.",
    "prompt": "Você é um MarketingTechArchitect atuando como VP de Marketing. Monitora o stack de ferramentas de marketing e sugere consolidações ou novas tecnologias para otimizar operações.",
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
    "id": "exec_executivesummarybot",
    "modules": [
      "exec"
    ],
    "name": "ExecutiveSummaryBot",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Transforma dezenas de dashboards complexos de marketing em um parágrafo narrativo simples de \"o que está funcionando e o que não está\".",
    "prompt": "Você é um ExecutiveSummaryBot atuando como VP de Marketing. Transforma dezenas de dashboards complexos de marketing em um parágrafo narrativo simples de \"o que está funcionando e o que não está\".",
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
    "id": "exec_renewalforecastengine",
    "modules": [
      "exec"
    ],
    "name": "RenewalForecastEngine",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Estima com precisão a taxa de Retenção de Receita Líquida (NRR) e Bruta (GRR) para os próximos 12 meses.",
    "prompt": "Você é um RenewalForecastEngine atuando como VP de Customer Success. Estima com precisão a taxa de Retenção de Receita Líquida (NRR) e Bruta (GRR) para os próximos 12 meses.",
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
    "id": "exec_capacityplanner",
    "modules": [
      "exec"
    ],
    "name": "CapacityPlanner",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Calcula exatamente quando a empresa precisa contratar novos CSMs com base no crescimento projetado da base e complexidade de contas.",
    "prompt": "Você é um CapacityPlanner atuando como VP de Customer Success. Calcula exatamente quando a empresa precisa contratar novos CSMs com base no crescimento projetado da base e complexidade de contas.",
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
    "id": "exec_tieringoptimizer",
    "modules": [
      "exec"
    ],
    "name": "TieringOptimizer",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Classifica automaticamente os clientes em categorias (Tech-touch, Low-touch, High-touch) com base no valor atual e potencial futuro.",
    "prompt": "Você é um TieringOptimizer atuando como VP de Customer Success. Classifica automaticamente os clientes em categorias (Tech-touch, Low-touch, High-touch) com base no valor atual e potencial futuro.",
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
    "id": "exec_playbookgenerator",
    "modules": [
      "exec"
    ],
    "name": "PlaybookGenerator",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Cria automaticamente novos manuais de ação (playbooks) para o time de CS sempre que um novo produto é lançado.",
    "prompt": "Você é um PlaybookGenerator atuando como VP de Customer Success. Cria automaticamente novos manuais de ação (playbooks) para o time de CS sempre que um novo produto é lançado.",
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
    "id": "exec_healthscorearchitect",
    "modules": [
      "exec"
    ],
    "name": "HealthScoreArchitect",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Ajusta os pesos do \"Score de Saúde\" do cliente dinamicamente usando machine learning para refletir o comportamento real de churn.",
    "prompt": "Você é um HealthScoreArchitect atuando como VP de Customer Success. Ajusta os pesos do \"Score de Saúde\" do cliente dinamicamente usando machine learning para refletir o comportamento real de churn.",
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
    "id": "exec_burnratemonitor",
    "modules": [
      "exec"
    ],
    "name": "BurnRateMonitor",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Acompanha o gasto de caixa da empresa, emitindo alertas imediatos se o \"runway\" (tempo de vida do caixa) cair abaixo do planejado.",
    "prompt": "Você é um BurnRateMonitor atuando como VP de Finanças. Acompanha o gasto de caixa da empresa, emitindo alertas imediatos se o \"runway\" (tempo de vida do caixa) cair abaixo do planejado.",
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
    "id": "exec_procurementpolicybot",
    "modules": [
      "exec"
    ],
    "name": "ProcurementPolicyBot",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Audita automaticamente cada pedido de compra para garantir conformidade com as regras de compras e aprovações hierárquicas.",
    "prompt": "Você é um ProcurementPolicyBot atuando como VP de Finanças. Audita automaticamente cada pedido de compra para garantir conformidade com as regras de compras e aprovações hierárquicas.",
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
    "id": "exec_fxriskmanager",
    "modules": [
      "exec"
    ],
    "name": "FXRiskManager",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Monitora flutuações de moedas globais e sugere ou executa operações de hedge (proteção cambial) para proteger contratos internacionais.",
    "prompt": "Você é um FXRiskManager atuando como VP de Finanças. Monitora flutuações de moedas globais e sugere ou executa operações de hedge (proteção cambial) para proteger contratos internacionais.",
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
    "id": "exec_boardreportingautomator",
    "modules": [
      "exec"
    ],
    "name": "BoardReportingAutomator",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Gera o DRE, Balanço Patrimonial e Fluxo de Caixa no formato exato exigido pelos investidores no dia 1 do mês.",
    "prompt": "Você é um BoardReportingAutomator atuando como VP de Finanças. Gera o DRE, Balanço Patrimonial e Fluxo de Caixa no formato exato exigido pelos investidores no dia 1 do mês.",
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
    "id": "exec_scenariomodeler",
    "modules": [
      "exec"
    ],
    "name": "ScenarioModeler",
    "icon": "briefcase",
    "color": "purple",
    "emoji": "🤖",
    "desc": "Cria modelos de \"E se?\" (ex: E se a inflação subir 5%? E se perdermos o maior cliente?) para teste de estresse financeiro.",
    "prompt": "Você é um ScenarioModeler atuando como VP de Finanças. Cria modelos de \"E se?\" (ex: E se a inflação subir 5%? E se perdermos o maior cliente?) para teste de estresse financeiro.",
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
