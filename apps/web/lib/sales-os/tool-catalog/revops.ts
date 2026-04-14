/* eslint-disable max-lines */
import type { Tool } from "../types.js";

export const REVOPS_TOOLS: Tool[] = [
  {
    "id": "revops_funnelleakdetector",
    "modules": [
      "revops"
    ],
    "name": "FunnelLeakDetector",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Analisa as taxas de conversão de Marketing -> Vendas -> CS e aponta onde está havendo a maior perda de dinheiro da empresa.",
    "prompt": "Você é um FunnelLeakDetector atuando como RevOps Manager. Analisa as taxas de conversão de Marketing -> Vendas -> CS e aponta onde está havendo a maior perda de dinheiro da empresa.",
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
    "id": "revops_datasilobridger",
    "modules": [
      "revops"
    ],
    "name": "DataSiloBridger",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Sincroniza dados automaticamente garantindo que Vendas, Marketing e Finanças estejam olhando para a mesma receita.",
    "prompt": "Você é um DataSiloBridger atuando como RevOps Manager. Sincroniza dados automaticamente garantindo que Vendas, Marketing e Finanças estejam olhando para a mesma receita.",
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
    "id": "revops_toolroianalyzer",
    "modules": [
      "revops"
    ],
    "name": "ToolROIAnalyzer",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Audita o uso de licenças de software pelas equipes; se um vendedor não usa o LinkedIn Premium há 30 dias, cancela a licença.",
    "prompt": "Você é um ToolROIAnalyzer atuando como RevOps Manager. Audita o uso de licenças de software pelas equipes; se um vendedor não usa o LinkedIn Premium há 30 dias, cancela a licença.",
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
    "id": "revops_gtmalignmentscorer",
    "modules": [
      "revops"
    ],
    "name": "GTMAlignmentScorer",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Mede a coerência entre o que o marketing promete e o que o produto entrega, sinalizando desalinhamentos de comunicação.",
    "prompt": "Você é um GTMAlignmentScorer atuando como RevOps Manager. Mede a coerência entre o que o marketing promete e o que o produto entrega, sinalizando desalinhamentos de comunicação.",
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
    "id": "revops_processbottleneckalerter",
    "modules": [
      "revops"
    ],
    "name": "ProcessBottleneckAlerter",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Mapeia o ciclo de vendas completo e avisa: \"O setor jurídico está demorando 4 dias a mais que o normal para aprovar contratos\".",
    "prompt": "Você é um ProcessBottleneckAlerter atuando como RevOps Manager. Mapeia o ciclo de vendas completo e avisa: \"O setor jurídico está demorando 4 dias a mais que o normal para aprovar contratos\".",
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
    "id": "revops_crmcleanser",
    "modules": [
      "revops"
    ],
    "name": "CRMCleanser",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Apaga dados inúteis do Salesforce/HubSpot, formata nomes de empresas e preenche campos vazios buscando informações na web.",
    "prompt": "Você é um CRMCleanser atuando como Sales Operations Analyst. Apaga dados inúteis do Salesforce/HubSpot, formata nomes de empresas e preenche campos vazios buscando informações na web.",
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
    "id": "revops_territorybalancer",
    "modules": [
      "revops"
    ],
    "name": "TerritoryBalancer",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Reajusta as carteiras de clientes caso um vendedor saia de licença ou peça demissão, transferindo oportunidades de forma justa.",
    "prompt": "Você é um TerritoryBalancer atuando como Sales Operations Analyst. Reajusta as carteiras de clientes caso um vendedor saia de licença ou peça demissão, transferindo oportunidades de forma justa.",
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
    "id": "revops_quotaattainmenttracker",
    "modules": [
      "revops"
    ],
    "name": "QuotaAttainmentTracker",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Atualiza os dashboards diários que mostram o percentual de atingimento de metas e comissionamento esperado de cada representante.",
    "prompt": "Você é um QuotaAttainmentTracker atuando como Sales Operations Analyst. Atualiza os dashboards diários que mostram o percentual de atingimento de metas e comissionamento esperado de cada representante.",
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
    "id": "revops_validationruleenforcer",
    "modules": [
      "revops"
    ],
    "name": "ValidationRuleEnforcer",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Trava o CRM impedindo que um vendedor mude uma oportunidade para \"Ganho\" se o CNPJ do cliente não foi preenchido.",
    "prompt": "Você é um ValidationRuleEnforcer atuando como Sales Operations Analyst. Trava o CRM impedindo que um vendedor mude uma oportunidade para \"Ganho\" se o CNPJ do cliente não foi preenchido.",
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
    "id": "revops_duplicatemerger",
    "modules": [
      "revops"
    ],
    "name": "DuplicateMerger",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Analisa diariamente contas e contatos similares e os funde (Merge), preservando os dados mais recentes e confiáveis.",
    "prompt": "Você é um DuplicateMerger atuando como Sales Operations Analyst. Analisa diariamente contas e contatos similares e os funde (Merge), preservando os dados mais recentes e confiáveis.",
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
    "id": "revops_microlearningcreator",
    "modules": [
      "revops"
    ],
    "name": "MicroLearningCreator",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Pega a gravação de 1 hora sobre um novo produto e a transforma em 5 vídeos interativos de 3 minutos para treinamento da equipe.",
    "prompt": "Você é um MicroLearningCreator atuando como Sales Enablement Manager. Pega a gravação de 1 hora sobre um novo produto e a transforma em 5 vídeos interativos de 3 minutos para treinamento da equipe.",
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
    "id": "revops_voicepitchgrader",
    "modules": [
      "revops"
    ],
    "name": "VoicePitchGrader",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Analisa a gravação de áudio de simulações de vendas (Roleplays) e dá uma nota de 0 a 100 com base no tom, empatia e roteiro.",
    "prompt": "Você é um VoicePitchGrader atuando como Sales Enablement Manager. Analisa a gravação de áudio de simulações de vendas (Roleplays) e dá uma nota de 0 a 100 com base no tom, empatia e roteiro.",
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
    "id": "revops_playbookupdater",
    "modules": [
      "revops"
    ],
    "name": "PlaybookUpdater",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Mantém todos os materiais de treinamento atualizados magicamente sempre que uma nova tela é adicionada ao produto.",
    "prompt": "Você é um PlaybookUpdater atuando como Sales Enablement Manager. Mantém todos os materiais de treinamento atualizados magicamente sempre que uma nova tela é adicionada ao produto.",
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
    "id": "revops_competitorintelbroadcaster",
    "modules": [
      "revops"
    ],
    "name": "CompetitorIntelBroadcaster",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Cria alertas semanais rápidos (Pílulas de Inteligência) para Vendas via Slack sobre as falhas recém-descobertas nos concorrentes.",
    "prompt": "Você é um CompetitorIntelBroadcaster atuando como Sales Enablement Manager. Cria alertas semanais rápidos (Pílulas de Inteligência) para Vendas via Slack sobre as falhas recém-descobertas nos concorrentes.",
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
    "id": "revops_onboardingramptracker",
    "modules": [
      "revops"
    ],
    "name": "OnboardingRampTracker",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Monitora o progresso de vendedores novatos, prevendo em quantos dias eles estarão prontos para vender sozinhos (Ramp-up).",
    "prompt": "Você é um OnboardingRampTracker atuando como Sales Enablement Manager. Monitora o progresso de vendedores novatos, prevendo em quantos dias eles estarão prontos para vender sozinhos (Ramp-up).",
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
    "id": "revops_margincalculator",
    "modules": [
      "revops"
    ],
    "name": "MarginCalculator",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Roda modelos financeiros instantâneos validando se um contrato com 30% de desconto e 60 dias de prazo de pagamento ainda dá lucro.",
    "prompt": "Você é um MarginCalculator atuando como Deal Desk Analyst. Roda modelos financeiros instantâneos validando se um contrato com 30% de desconto e 60 dias de prazo de pagamento ainda dá lucro.",
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
    "id": "revops_nonstandardflag",
    "modules": [
      "revops"
    ],
    "name": "NonStandardFlag",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Lê propostas comerciais e bloqueia solicitações que contenham SLAs malucos ou cláusulas de multa não padronizadas pela empresa.",
    "prompt": "Você é um NonStandardFlag atuando como Deal Desk Analyst. Lê propostas comerciais e bloqueia solicitações que contenham SLAs malucos ou cláusulas de multa não padronizadas pela empresa.",
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
    "id": "revops_discountwaterfallmodeler",
    "modules": [
      "revops"
    ],
    "name": "DiscountWaterfallModeler",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Mostra ao vendedor como o desconto concedido afeta diretamente sua comissão para desencorajar baixas de preço desnecessárias.",
    "prompt": "Você é um DiscountWaterfallModeler atuando como Deal Desk Analyst. Mostra ao vendedor como o desconto concedido afeta diretamente sua comissão para desencorajar baixas de preço desnecessárias.",
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
    "id": "revops_legalclausematcher",
    "modules": [
      "revops"
    ],
    "name": "LegalClauseMatcher",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Encontra contratos do passado com negociações parecidas para usar como precedente em cláusulas comerciais difíceis.",
    "prompt": "Você é um LegalClauseMatcher atuando como Deal Desk Analyst. Encontra contratos do passado com negociações parecidas para usar como precedente em cláusulas comerciais difíceis.",
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
    "id": "revops_approvalworkflowrouter",
    "modules": [
      "revops"
    ],
    "name": "ApprovalWorkflowRouter",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Encaminha automaticamente a aprovação do negócio para o VP de Vendas, depois Diretor Jurídico, depois CFO, acompanhando as assinaturas.",
    "prompt": "Você é um ApprovalWorkflowRouter atuando como Deal Desk Analyst. Encaminha automaticamente a aprovação do negócio para o VP de Vendas, depois Diretor Jurídico, depois CFO, acompanhando as assinaturas.",
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
    "id": "revops_apiintegrationbuilder",
    "modules": [
      "revops"
    ],
    "name": "APIIntegrationBuilder",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Escreve o código conectando as ferramentas exclusivas da empresa aos CRMs do mercado em horas, em vez de semanas.",
    "prompt": "Você é um APIIntegrationBuilder atuando como GTM Engineer (Go-To-Market Engineer). Escreve o código conectando as ferramentas exclusivas da empresa aos CRMs do mercado em horas, em vez de semanas.",
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
    "id": "revops_leadscoringmodeler",
    "modules": [
      "revops"
    ],
    "name": "LeadScoringModeler",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Aplica modelos de Machine Learning robustos para dar notas aos leads com base em milhares de variáveis ocultas.",
    "prompt": "Você é um LeadScoringModeler atuando como GTM Engineer (Go-To-Market Engineer). Aplica modelos de Machine Learning robustos para dar notas aos leads com base em milhares de variáveis ocultas.",
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
    "id": "revops_webhookmonitor",
    "modules": [
      "revops"
    ],
    "name": "WebhookMonitor",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Fica de olho em todas as automações sistêmicas (Zapier, Make) e repara falhas antes que os e-mails parem de ser enviados.",
    "prompt": "Você é um WebhookMonitor atuando como GTM Engineer (Go-To-Market Engineer). Fica de olho em todas as automações sistêmicas (Zapier, Make) e repara falhas antes que os e-mails parem de ser enviados.",
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
    "id": "revops_customcrmuibuilder",
    "modules": [
      "revops"
    ],
    "name": "CustomCRMUIBuilder",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Desenha telas e painéis customizados no CRM, escondendo campos inúteis e simplificando a visão dos vendedores e CSMs.",
    "prompt": "Você é um CustomCRMUIBuilder atuando como GTM Engineer (Go-To-Market Engineer). Desenha telas e painéis customizados no CRM, escondendo campos inúteis e simplificando a visão dos vendedores e CSMs.",
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
    "id": "revops_dataenrichmentautomator",
    "modules": [
      "revops"
    ],
    "name": "DataEnrichmentAutomator",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Conecta o sistema interno a APIs externas (Receita Federal, Clearbit) para enriquecer cada cadastro novo perfeitamente.",
    "prompt": "Você é um DataEnrichmentAutomator atuando como GTM Engineer (Go-To-Market Engineer). Conecta o sistema interno a APIs externas (Receita Federal, Clearbit) para enriquecer cada cadastro novo perfeitamente.",
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
    "id": "revops_cohortanalyzer",
    "modules": [
      "revops"
    ],
    "name": "CohortAnalyzer",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Separa os clientes por data de compra e mostra padrões: \"Clientes comprados na Black Friday de 2024 têm taxa de cancelamento maior\".",
    "prompt": "Você é um CohortAnalyzer atuando como Revenue Operations Analyst. Separa os clientes por data de compra e mostra padrões: \"Clientes comprados na Black Friday de 2024 têm taxa de cancelamento maior\".",
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
    "id": "revops_forecastingmodeler",
    "modules": [
      "revops"
    ],
    "name": "ForecastingModeler",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Fornece previsões matemáticas estatísticas do faturamento do trimestre cruzando dados contra a intuição humana dos gerentes.",
    "prompt": "Você é um ForecastingModeler atuando como Revenue Operations Analyst. Fornece previsões matemáticas estatísticas do faturamento do trimestre cruzando dados contra a intuição humana dos gerentes.",
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
    "id": "revops_pricediscountimpact",
    "modules": [
      "revops"
    ],
    "name": "PriceDiscountImpact",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Calcula quanto a empresa deixou na mesa (perdeu) anualmente pela concessão excessiva de descontos nas vendas de fim de mês.",
    "prompt": "Você é um PriceDiscountImpact atuando como Revenue Operations Analyst. Calcula quanto a empresa deixou na mesa (perdeu) anualmente pela concessão excessiva de descontos nas vendas de fim de mês.",
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
    "id": "revops_channelattritionpredictor",
    "modules": [
      "revops"
    ],
    "name": "ChannelAttritionPredictor",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Analisa qual canal de origem (Inbound, Outbound, Parceiros) traz os clientes que duram mais tempo e os que saem mais rápido.",
    "prompt": "Você é um ChannelAttritionPredictor atuando como Revenue Operations Analyst. Analisa qual canal de origem (Inbound, Outbound, Parceiros) traz os clientes que duram mais tempo e os que saem mais rápido.",
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
    "id": "revops_acvgrowthtracker",
    "modules": [
      "revops"
    ],
    "name": "ACVGrowthTracker",
    "icon": "activity",
    "color": "orange",
    "emoji": "🤖",
    "desc": "Monitora as variações no Valor de Contrato Anual (ACV), analisando se a empresa está conseguindo subir o ticket médio dos novos clientes.",
    "prompt": "Você é um ACVGrowthTracker atuando como Revenue Operations Analyst. Monitora as variações no Valor de Contrato Anual (ACV), analisando se a empresa está conseguindo subir o ticket médio dos novos clientes.",
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
