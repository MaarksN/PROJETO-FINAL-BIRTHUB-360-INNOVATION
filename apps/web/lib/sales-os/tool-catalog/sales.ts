/* eslint-disable max-lines */
import type { Tool } from "../types.js";

export const SALES_TOOLS: Tool[] = [
  {
    "id": "sales_deckcustomizer",
    "modules": [
      "sales"
    ],
    "name": "DeckCustomizer",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Cria uma apresentação de vendas (Pitch Deck) única para cada reunião, inserindo o logo do cliente, métricas do setor e dores mapeadas.",
    "prompt": "Você é um DeckCustomizer atuando como Account Executive (AE). Cria uma apresentação de vendas (Pitch Deck) única para cada reunião, inserindo o logo do cliente, métricas do setor e dores mapeadas.",
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
    "id": "sales_mutualactiontracker",
    "modules": [
      "sales"
    ],
    "name": "MutualActionTracker",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Gerencia o Plano de Ação Mútua (MAP) com o cliente, enviando lembretes automatizados de próximos passos e prazos.",
    "prompt": "Você é um MutualActionTracker atuando como Account Executive (AE). Gerencia o Plano de Ação Mútua (MAP) com o cliente, enviando lembretes automatizados de próximos passos e prazos.",
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
    "id": "sales_contractdrafter",
    "modules": [
      "sales"
    ],
    "name": "ContractDrafter",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Gera o rascunho do contrato em segundos, ajustando cláusulas comerciais baseadas no que foi combinado verbalmente na gravação da reunião.",
    "prompt": "Você é um ContractDrafter atuando como Account Executive (AE). Gera o rascunho do contrato em segundos, ajustando cláusulas comerciais baseadas no que foi combinado verbalmente na gravação da reunião.",
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
    "id": "sales_roicalculatorbuilder",
    "modules": [
      "sales"
    ],
    "name": "ROICalculatorBuilder",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Constrói um Business Case financeiro personalizado provando o retorno sobre o investimento (ROI) específico para o cenário do lead.",
    "prompt": "Você é um ROICalculatorBuilder atuando como Account Executive (AE). Constrói um Business Case financeiro personalizado provando o retorno sobre o investimento (ROI) específico para o cenário do lead.",
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
    "id": "sales_objectionflashcard",
    "modules": [
      "sales"
    ],
    "name": "ObjectionFlashcard",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Fornece argumentos rápidos na tela do AE sobre como justificar preço quando o cliente diz \"está muito caro\".",
    "prompt": "Você é um ObjectionFlashcard atuando como Account Executive (AE). Fornece argumentos rápidos na tela do AE sobre como justificar preço quando o cliente diz \"está muito caro\".",
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
    "id": "sales_orgnav",
    "modules": [
      "sales"
    ],
    "name": "OrgNav",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Mapeia a complexa teia política de empresas Fortune 500, indicando quem tem o poder de veto e quem assina o cheque.",
    "prompt": "Você é um OrgNav atuando como Enterprise Account Executive. Mapeia a complexa teia política de empresas Fortune 500, indicando quem tem o poder de veto e quem assina o cheque.",
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
    "id": "sales_rfpautoresponder",
    "modules": [
      "sales"
    ],
    "name": "RFPAutoResponder",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Preenche planilhas de RFP (Request for Proposal) e RFI de 300 páginas automaticamente buscando na base de conhecimento da empresa.",
    "prompt": "Você é um RFPAutoResponder atuando como Enterprise Account Executive. Preenche planilhas de RFP (Request for Proposal) e RFI de 300 páginas automaticamente buscando na base de conhecimento da empresa.",
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
    "id": "sales_execsummarygenerator",
    "modules": [
      "sales"
    ],
    "name": "ExecSummaryGenerator",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Escreve o \"Resumo Executivo\" perfeito focado puramente em impacto financeiro para ser enviado aos CFOs dos clientes.",
    "prompt": "Você é um ExecSummaryGenerator atuando como Enterprise Account Executive. Escreve o \"Resumo Executivo\" perfeito focado puramente em impacto financeiro para ser enviado aos CFOs dos clientes.",
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
    "id": "sales_multiyeardealmodeller",
    "modules": [
      "sales"
    ],
    "name": "MultiYearDealModeller",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Modela estruturas complexas de contratos de 3 a 5 anos com gatilhos de expansão de preço progressivos.",
    "prompt": "Você é um MultiYearDealModeller atuando como Enterprise Account Executive. Modela estruturas complexas de contratos de 3 a 5 anos com gatilhos de expansão de preço progressivos.",
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
    "id": "sales_procurementhacker",
    "modules": [
      "sales"
    ],
    "name": "ProcurementHacker",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Guia o AE através do labirinto do setor de Compras (Procurement) do cliente, prevendo que tipo de concessões eles vão exigir.",
    "prompt": "Você é um ProcurementHacker atuando como Enterprise Account Executive. Guia o AE através do labirinto do setor de Compras (Procurement) do cliente, prevendo que tipo de concessões eles vão exigir.",
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
    "id": "sales_fastquoter",
    "modules": [
      "sales"
    ],
    "name": "FastQuoter",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Gera orçamentos rápidos e precisos para ciclos de vendas curtos, aplicando promoções do dia automaticamente.",
    "prompt": "Você é um FastQuoter atuando como Inside Sales Representative. Gera orçamentos rápidos e precisos para ciclos de vendas curtos, aplicando promoções do dia automaticamente.",
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
    "id": "sales_demoscripter",
    "modules": [
      "sales"
    ],
    "name": "DemoScripter",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Cria roteiros curtos e impactantes de demonstração de produto de 15 minutos, focados apenas nos botões que importam para o lead.",
    "prompt": "Você é um DemoScripter atuando como Inside Sales Representative. Cria roteiros curtos e impactantes de demonstração de produto de 15 minutos, focados apenas nos botões que importam para o lead.",
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
    "id": "sales_ghostingpreventer",
    "modules": [
      "sales"
    ],
    "name": "GhostingPreventer",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Identifica leads que pararam de responder (ghosting) e aciona campanhas de reengajamento baseadas em urgência.",
    "prompt": "Você é um GhostingPreventer atuando como Inside Sales Representative. Identifica leads que pararam de responder (ghosting) e aciona campanhas de reengajamento baseadas em urgência.",
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
    "id": "sales_discountapprover",
    "modules": [
      "sales"
    ],
    "name": "DiscountApprover",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Analisa o perfil do cliente e autoriza descontos de até X% em tempo real sem precisar pedir para o gerente.",
    "prompt": "Você é um DiscountApprover atuando como Inside Sales Representative. Analisa o perfil do cliente e autoriza descontos de até X% em tempo real sem precisar pedir para o gerente.",
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
    "id": "sales_paymentlinksender",
    "modules": [
      "sales"
    ],
    "name": "PaymentLinkSender",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Cria links de pagamento integrados ao contrato e envia por WhatsApp/Email no momento exato do \"Sim\" verbal.",
    "prompt": "Você é um PaymentLinkSender atuando como Inside Sales Representative. Cria links de pagamento integrados ao contrato e envia por WhatsApp/Email no momento exato do \"Sim\" verbal.",
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
    "id": "sales_productfeedbacklooper",
    "modules": [
      "sales"
    ],
    "name": "ProductFeedbackLooper",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Traduz as rejeições de vendas em relatórios diretos para o time de Produto informando quais features faltam para vender mais.",
    "prompt": "Você é um ProductFeedbackLooper atuando como Founding Sales AE. Traduz as rejeições de vendas em relatórios diretos para o time de Produto informando quais features faltam para vender mais.",
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
    "id": "sales_icprefiner",
    "modules": [
      "sales"
    ],
    "name": "ICPRefiner",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Ajusta continuamente o Perfil de Cliente Ideal (ICP), aprendendo com quem está comprando os primeiros produtos da startup.",
    "prompt": "Você é um ICPRefiner atuando como Founding Sales AE. Ajusta continuamente o Perfil de Cliente Ideal (ICP), aprendendo com quem está comprando os primeiros produtos da startup.",
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
    "id": "sales_playbookcreator",
    "modules": [
      "sales"
    ],
    "name": "PlaybookCreator",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Documenta cada vitória e derrota em vendas para transformar o conhecimento empírico do fundador em um manual repetível.",
    "prompt": "Você é um PlaybookCreator atuando como Founding Sales AE. Documenta cada vitória e derrota em vendas para transformar o conhecimento empírico do fundador em um manual repetível.",
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
    "id": "sales_earlyadopternurturer",
    "modules": [
      "sales"
    ],
    "name": "EarlyAdopterNurturer",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Cria programas especiais e benefícios personalizados para seduzir os primeiros clientes arriscados a fecharem negócio.",
    "prompt": "Você é um EarlyAdopterNurturer atuando como Founding Sales AE. Cria programas especiais e benefícios personalizados para seduzir os primeiros clientes arriscados a fecharem negócio.",
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
    "id": "sales_pricingtester",
    "modules": [
      "sales"
    ],
    "name": "PricingTester",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Realiza testes A/B invisíveis em propostas de vendas para ajudar os fundadores a descobrir o teto de preço do mercado.",
    "prompt": "Você é um PricingTester atuando como Founding Sales AE. Realiza testes A/B invisíveis em propostas de vendas para ajudar os fundadores a descobrir o teto de preço do mercado.",
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
    "id": "sales_demosandboxer",
    "modules": [
      "sales"
    ],
    "name": "DemoSandboxer",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Provisiona ambientes de teste (Sandboxes) com dados fictícios ultra-realistas que imitam a realidade do cliente em minutos.",
    "prompt": "Você é um DemoSandboxer atuando como Sales Engineer (SE). Provisiona ambientes de teste (Sandboxes) com dados fictícios ultra-realistas que imitam a realidade do cliente em minutos.",
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
    "id": "sales_securityquestionnairefiller",
    "modules": [
      "sales"
    ],
    "name": "SecurityQuestionnaireFiller",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Responde questionários de segurança (InfoSec) complexos baseando-se em respostas históricas e certificações da empresa (SOC2, ISO).",
    "prompt": "Você é um SecurityQuestionnaireFiller atuando como Sales Engineer (SE). Responde questionários de segurança (InfoSec) complexos baseando-se em respostas históricas e certificações da empresa (SOC2, ISO).",
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
    "id": "sales_architecturediagrammer",
    "modules": [
      "sales"
    ],
    "name": "ArchitectureDiagrammer",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Ouve a conversa técnica com o cliente e gera automaticamente o diagrama arquitetural da integração via API.",
    "prompt": "Você é um ArchitectureDiagrammer atuando como Sales Engineer (SE). Ouve a conversa técnica com o cliente e gera automaticamente o diagrama arquitetural da integração via API.",
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
    "id": "sales_techobjectionresolver",
    "modules": [
      "sales"
    ],
    "name": "TechObjectionResolver",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Vasculha documentação de API, fóruns do GitHub e o Slack interno para responder perguntas técnicas complexas em tempo real na call.",
    "prompt": "Você é um TechObjectionResolver atuando como Sales Engineer (SE). Vasculha documentação de API, fóruns do GitHub e o Slack interno para responder perguntas técnicas complexas em tempo real na call.",
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
    "id": "sales_poctracker",
    "modules": [
      "sales"
    ],
    "name": "PoCTracker",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Monitora a Prova de Conceito (PoC) rodando no cliente, alertando o SE se o cliente não está logando ou usando as features-chave testadas.",
    "prompt": "Você é um PoCTracker atuando como Sales Engineer (SE). Monitora a Prova de Conceito (PoC) rodando no cliente, alertando o SE se o cliente não está logando ou usando as features-chave testadas.",
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
    "id": "sales_valuealigner",
    "modules": [
      "sales"
    ],
    "name": "ValueAligner",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Traduz as características técnicas do software diretamente para métricas de negócios que o board do cliente entende.",
    "prompt": "Você é um ValueAligner atuando como Solutions Consultant. Traduz as características técnicas do software diretamente para métricas de negócios que o board do cliente entende.",
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
    "id": "sales_usecasegenerator",
    "modules": [
      "sales"
    ],
    "name": "UseCaseGenerator",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Vasculha o banco de dados da empresa e constrói estudos de caso relevantes baseados no nicho exato do cliente atual.",
    "prompt": "Você é um UseCaseGenerator atuando como Solutions Consultant. Vasculha o banco de dados da empresa e constrói estudos de caso relevantes baseados no nicho exato do cliente atual.",
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
    "id": "sales_roiscenariomodeler",
    "modules": [
      "sales"
    ],
    "name": "ROIScenarioModeler",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Cria três cenários financeiros (Conservador, Realista, Otimista) para o cliente levar para aprovação interna.",
    "prompt": "Você é um ROIScenarioModeler atuando como Solutions Consultant. Cria três cenários financeiros (Conservador, Realista, Otimista) para o cliente levar para aprovação interna.",
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
    "id": "sales_techstackauditor",
    "modules": [
      "sales"
    ],
    "name": "TechStackAuditor",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Analisa a infraestrutura atual do cliente e identifica pontos de conflito ou redundância com o software que está sendo vendido.",
    "prompt": "Você é um TechStackAuditor atuando como Solutions Consultant. Analisa a infraestrutura atual do cliente e identifica pontos de conflito ou redundância com o software que está sendo vendido.",
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
    "id": "sales_executivedemocurator",
    "modules": [
      "sales"
    ],
    "name": "ExecutiveDemoCurator",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Adapta a demonstração padrão para um nível executivo, removendo jargões técnicos e focando em \"Visão e Futuro\".",
    "prompt": "Você é um ExecutiveDemoCurator atuando como Solutions Consultant. Adapta a demonstração padrão para um nível executivo, removendo jargões técnicos e focando em \"Visão e Futuro\".",
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
    "id": "sales_pipelineinspector",
    "modules": [
      "sales"
    ],
    "name": "PipelineInspector",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Audita o funil de vendas dos representantes, destacando negócios \"estagnados\" ou com datas de fechamento irreais.",
    "prompt": "Você é um PipelineInspector atuando como Gerente Comercial. Audita o funil de vendas dos representantes, destacando negócios \"estagnados\" ou com datas de fechamento irreais.",
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
    "id": "sales_oneononeprep",
    "modules": [
      "sales"
    ],
    "name": "OneOnOnePrep",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Prepara a pauta da reunião 1:1 com cada vendedor, destacando as métricas de performance e os 3 principais negócios para revisar.",
    "prompt": "Você é um OneOnOnePrep atuando como Gerente Comercial. Prepara a pauta da reunião 1:1 com cada vendedor, destacando as métricas de performance e os 3 principais negócios para revisar.",
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
    "id": "sales_dealatriskalerter",
    "modules": [
      "sales"
    ],
    "name": "DealAtRiskAlerter",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Cruza dados de sentimento de e-mail e tempo sem contato para avisar o gerente quais negócios importantes correm risco de perda.",
    "prompt": "Você é um DealAtRiskAlerter atuando como Gerente Comercial. Cruza dados de sentimento de e-mail e tempo sem contato para avisar o gerente quais negócios importantes correm risco de perda.",
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
    "id": "sales_winlossanalyzer",
    "modules": [
      "sales"
    ],
    "name": "WinLossAnalyzer",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Entrevista clientes perdidos via chat automatizado e consolida os motivos reais pelos quais a empresa está perdendo ou ganhando vendas.",
    "prompt": "Você é um WinLossAnalyzer atuando como Gerente Comercial. Entrevista clientes perdidos via chat automatizado e consolida os motivos reais pelos quais a empresa está perdendo ou ganhando vendas.",
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
    "id": "sales_discountleakguard",
    "modules": [
      "sales"
    ],
    "name": "DiscountLeakGuard",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Monitora a concessão de descontos do time e alerta se um vendedor específico está impactando as margens abusivamente.",
    "prompt": "Você é um DiscountLeakGuard atuando como Gerente Comercial. Monitora a concessão de descontos do time e alerta se um vendedor específico está impactando as margens abusivamente.",
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
    "id": "sales_marketexpansionmodeler",
    "modules": [
      "sales"
    ],
    "name": "MarketExpansionModeler",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Analisa dados geográficos e econômicos para recomendar quais novas cidades ou países o time deve atacar no próximo ano.",
    "prompt": "Você é um MarketExpansionModeler atuando como Diretor de Vendas. Analisa dados geográficos e econômicos para recomendar quais novas cidades ou países o time deve atacar no próximo ano.",
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
    "id": "sales_quotasetter",
    "modules": [
      "sales"
    ],
    "name": "QuotaSetter",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Distribui as cotas anuais de vendas baseadas no potencial de cada região, garantindo que a meta global da empresa seja atingida.",
    "prompt": "Você é um QuotaSetter atuando como Diretor de Vendas. Distribui as cotas anuais de vendas baseadas no potencial de cada região, garantindo que a meta global da empresa seja atingida.",
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
    "id": "sales_compplancalculator",
    "modules": [
      "sales"
    ],
    "name": "CompPlanCalculator",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Simula milhares de variações de planos de remuneração para encontrar o modelo que maximize lucro e retenha vendedores top-performers.",
    "prompt": "Você é um CompPlanCalculator atuando como Diretor de Vendas. Simula milhares de variações de planos de remuneração para encontrar o modelo que maximize lucro e retenha vendedores top-performers.",
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
    "id": "sales_leaderboardbroadcaster",
    "modules": [
      "sales"
    ],
    "name": "LeaderboardBroadcaster",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Gera relatórios semanais narrados para a empresa inteira, celebrando as vitórias e destacando os melhores vendedores.",
    "prompt": "Você é um LeaderboardBroadcaster atuando como Diretor de Vendas. Gera relatórios semanais narrados para a empresa inteira, celebrando as vitórias e destacando os melhores vendedores.",
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
    "id": "sales_strategicalliancescout",
    "modules": [
      "sales"
    ],
    "name": "StrategicAllianceScout",
    "icon": "crown",
    "color": "brand-gold",
    "emoji": "🤖",
    "desc": "Identifica e gera planos de negócios para estabelecer parcerias com grandes integradores ou consultorias.",
    "prompt": "Você é um StrategicAllianceScout atuando como Diretor de Vendas. Identifica e gera planos de negócios para estabelecer parcerias com grandes integradores ou consultorias.",
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
