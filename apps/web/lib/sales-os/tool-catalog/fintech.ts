/* eslint-disable max-lines */
import type { Tool } from "../types.js";

export const FINTECH_TOOLS: Tool[] = [
  {
    "id": "fintech_policymappingbot",
    "modules": [
      "fintech"
    ],
    "name": "PolicyMappingBot",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Varre os milhares de artigos das normas do Banco Central ou CVM e cruza com os processos da Fintech para ver se há furos na operação.",
    "prompt": "Você é um PolicyMappingBot atuando como Compliance Analyst. Varre os milhares de artigos das normas do Banco Central ou CVM e cruza com os processos da Fintech para ver se há furos na operação.",
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
    "id": "fintech_regulatorytrainingtracker",
    "modules": [
      "fintech"
    ],
    "name": "RegulatoryTrainingTracker",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Cria, distribui e fiscaliza os treinamentos obrigatórios anuais sobre Ética e Lavagem de Dinheiro, garantindo 100% de adesão.",
    "prompt": "Você é um RegulatoryTrainingTracker atuando como Compliance Analyst. Cria, distribui e fiscaliza os treinamentos obrigatórios anuais sobre Ética e Lavagem de Dinheiro, garantindo 100% de adesão.",
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
    "id": "fintech_sanctionsscreener",
    "modules": [
      "fintech"
    ],
    "name": "SanctionsScreener",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Passa todos os milhares de clientes pela base de sanções internacionais (OFAC, ONU) em milissegundos a cada nova atualização de listas.",
    "prompt": "Você é um SanctionsScreener atuando como Compliance Analyst. Passa todos os milhares de clientes pela base de sanções internacionais (OFAC, ONU) em milissegundos a cada nova atualização de listas.",
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
    "id": "fintech_commssurveillancebot",
    "modules": [
      "fintech"
    ],
    "name": "CommsSurveillanceBot",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Escuta e lê todas as ligações e chats dos assessores de investimento da Fintech garantindo que ninguém prometa \"retorno garantido\" ou faça insider trading.",
    "prompt": "Você é um CommsSurveillanceBot atuando como Compliance Analyst. Escuta e lê todas as ligações e chats dos assessores de investimento da Fintech garantindo que ninguém prometa \"retorno garantido\" ou faça insider trading.",
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
    "id": "fintech_auditprepengine",
    "modules": [
      "fintech"
    ],
    "name": "AuditPrepEngine",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Gera painéis dinâmicos e exportações perfeitas para a auditoria regulatória e fiscalizações surpresas do regulador financeiro.",
    "prompt": "Você é um AuditPrepEngine atuando como Compliance Analyst. Gera painéis dinâmicos e exportações perfeitas para a auditoria regulatória e fiscalizações surpresas do regulador financeiro.",
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
    "id": "fintech_sardrafter",
    "modules": [
      "fintech"
    ],
    "name": "SARDrafter",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Puxa todo o histórico suspeito de um usuário, cruza contas, IPs e transações e redige sozinho o rascunho do Relatório de Atividade Suspeita (COAF).",
    "prompt": "Você é um SARDrafter atuando como AML Specialist (Anti-Money Laundering). Puxa todo o histórico suspeito de um usuário, cruza contas, IPs e transações e redige sozinho o rascunho do Relatório de Atividade Suspeita (COAF).",
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
    "id": "fintech_transactionlinkanalyzer",
    "modules": [
      "fintech"
    ],
    "name": "TransactionLinkAnalyzer",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Mapeia gráficamente teias complexas em formato de aranha, evidenciando como o dinheiro foi transferido entre dezenas de laranjas e contas de passagem (Smurfing).",
    "prompt": "Você é um TransactionLinkAnalyzer atuando como AML Specialist (Anti-Money Laundering). Mapeia gráficamente teias complexas em formato de aranha, evidenciando como o dinheiro foi transferido entre dezenas de laranjas e contas de passagem (Smurfing).",
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
    "id": "fintech_moneymuledetector",
    "modules": [
      "fintech"
    ],
    "name": "MoneyMuleDetector",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Identifica padrões comportamentais como depósitos picados, picos repentinos em contas inativas ou retiradas em caixas eletrônicos atípicos (Mulas de dinheiro).",
    "prompt": "Você é um MoneyMuleDetector atuando como AML Specialist (Anti-Money Laundering). Identifica padrões comportamentais como depósitos picados, picos repentinos em contas inativas ou retiradas em caixas eletrônicos atípicos (Mulas de dinheiro).",
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
    "id": "fintech_highriskjurisdictionpinger",
    "modules": [
      "fintech"
    ],
    "name": "HighRiskJurisdictionPinger",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Trava ou cria fricção de aprovação extra em qualquer transferência cujo IP de origem ou banco de destino pertença a países de alto risco.",
    "prompt": "Você é um HighRiskJurisdictionPinger atuando como AML Specialist (Anti-Money Laundering). Trava ou cria fricção de aprovação extra em qualquer transferência cujo IP de origem ou banco de destino pertença a países de alto risco.",
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
    "id": "fintech_cryptotracingbot",
    "modules": [
      "fintech"
    ],
    "name": "CryptoTracingBot",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Segue transações de carteiras em Blockchain pública saltando por mixers para tentar associar saques a identidades conhecidas no mundo real.",
    "prompt": "Você é um CryptoTracingBot atuando como AML Specialist (Anti-Money Laundering). Segue transações de carteiras em Blockchain pública saltando por mixers para tentar associar saques a identidades conhecidas no mundo real.",
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
    "id": "fintech_idverificationmatcher",
    "modules": [
      "fintech"
    ],
    "name": "IDVerificationMatcher",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Verifica o documento de identidade em milissegundos sob iluminações diversas, detectando se a foto foi adulterada no Photoshop, trocada a foto, ou é uma cópia de tela.",
    "prompt": "Você é um IDVerificationMatcher atuando como KYC Specialist (Know Your Customer). Verifica o documento de identidade em milissegundos sob iluminações diversas, detectando se a foto foi adulterada no Photoshop, trocada a foto, ou é uma cópia de tela.",
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
    "id": "fintech_livenesscheckanalyzer",
    "modules": [
      "fintech"
    ],
    "name": "LivenessCheckAnalyzer",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Lê pequenos movimentos faciais nos vídeos de segurança para validar se é um ser humano respirando ou um Deepfake em vídeo e máscara de silicone.",
    "prompt": "Você é um LivenessCheckAnalyzer atuando como KYC Specialist (Know Your Customer). Lê pequenos movimentos faciais nos vídeos de segurança para validar se é um ser humano respirando ou um Deepfake em vídeo e máscara de silicone.",
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
    "id": "fintech_ubomapper",
    "modules": [
      "fintech"
    ],
    "name": "UBOMapper",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Constrói rapidamente a árvore societária inteira de um CNPJ até chegar no \"Beneficiário Final\" pessoa física, vasculhando juntas comerciais automaticamente.",
    "prompt": "Você é um UBOMapper atuando como KYC Specialist (Know Your Customer). Constrói rapidamente a árvore societária inteira de um CNPJ até chegar no \"Beneficiário Final\" pessoa física, vasculhando juntas comerciais automaticamente.",
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
    "id": "fintech_addressproofvalidator",
    "modules": [
      "fintech"
    ],
    "name": "AddressProofValidator",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Audita o comprovante de endereço validando com os dados emitidos pelas concessionárias de energia ou telefone para ver se não foi editado no PDF.",
    "prompt": "Você é um AddressProofValidator atuando como KYC Specialist (Know Your Customer). Audita o comprovante de endereço validando com os dados emitidos pelas concessionárias de energia ou telefone para ver se não foi editado no PDF.",
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
    "id": "fintech_pepscreener",
    "modules": [
      "fintech"
    ],
    "name": "PEPScreener",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Avalia ligações políticas (Parentes e Pessoas Politicamente Expostas) e classifica o risco antes de abrir a conta.",
    "prompt": "Você é um PEPScreener atuando como KYC Specialist (Know Your Customer). Avalia ligações políticas (Parentes e Pessoas Politicamente Expostas) e classifica o risco antes de abrir a conta.",
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
    "id": "fintech_accounttakeoveralerter_ato",
    "modules": [
      "fintech"
    ],
    "name": "AccountTakeoverAlerter (ATO)",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Cruza velocidade de digitação de senha, localizações geográficas impossíveis (São Paulo e Japão em 1h) e bloqueia a conta em tempo real.",
    "prompt": "Você é um AccountTakeoverAlerter (ATO) atuando como Fraud Analyst. Cruza velocidade de digitação de senha, localizações geográficas impossíveis (São Paulo e Japão em 1h) e bloqueia a conta em tempo real.",
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
    "id": "fintech_chargebackdisputeautomator",
    "modules": [
      "fintech"
    ],
    "name": "ChargebackDisputeAutomator",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Em e-commerces/fintechs, quando há denúncia de fraude, coleta as evidências de rastreio de entrega e login, contestando o chargeback na bandeira do cartão.",
    "prompt": "Você é um ChargebackDisputeAutomator atuando como Fraud Analyst. Em e-commerces/fintechs, quando há denúncia de fraude, coleta as evidências de rastreio de entrega e login, contestando o chargeback na bandeira do cartão.",
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
    "id": "fintech_velocityruleengine",
    "modules": [
      "fintech"
    ],
    "name": "VelocityRuleEngine",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Cria regras matemáticas dinâmicas de velocidade transacional: se um cartão passar 5 vezes no mesmo minuto em valores baixos testando validade, trava as próximas.",
    "prompt": "Você é um VelocityRuleEngine atuando como Fraud Analyst. Cria regras matemáticas dinâmicas de velocidade transacional: se um cartão passar 5 vezes no mesmo minuto em valores baixos testando validade, trava as próximas.",
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
    "id": "fintech_syntheticidentitydetector",
    "modules": [
      "fintech"
    ],
    "name": "SyntheticIdentityDetector",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Cruza bases de nascimentos e de óbitos para evitar que fraudadores criem crediários fantasma com dados sintéticos (\"CPF Frankestein\").",
    "prompt": "Você é um SyntheticIdentityDetector atuando como Fraud Analyst. Cruza bases de nascimentos e de óbitos para evitar que fraudadores criem crediários fantasma com dados sintéticos (\"CPF Frankestein\").",
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
    "id": "fintech_devicefingerprintmatcher",
    "modules": [
      "fintech"
    ],
    "name": "DeviceFingerprintMatcher",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Identifica exatamente a \"impressão digital\" da placa mãe e do celular. Se o mesmo celular abrir 20 contas em 1 hora para pegar bônus de indicação, bane o aparelho.",
    "prompt": "Você é um DeviceFingerprintMatcher atuando como Fraud Analyst. Identifica exatamente a \"impressão digital\" da placa mãe e do celular. Se o mesmo celular abrir 20 contas em 1 hora para pegar bônus de indicação, bane o aparelho.",
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
    "id": "fintech_altdatascorer",
    "modules": [
      "fintech"
    ],
    "name": "AltDataScorer",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Para \"desbancarizados\", analisa o consumo de crédito de telefone pré-pago, histórico de contas de luz e redes sociais para atribuir um score de crédito.",
    "prompt": "Você é um AltDataScorer atuando como Credit Risk Underwriter. Para \"desbancarizados\", analisa o consumo de crédito de telefone pré-pago, histórico de contas de luz e redes sociais para atribuir um score de crédito.",
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
    "id": "fintech_cashflowpredictor_open_banking",
    "modules": [
      "fintech"
    ],
    "name": "CashFlowPredictor (Open Banking)",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Lê de imediato o histórico bancário (com autorização Open Finance), classifica despesas supérfluas e afere a real capacidade de pagamento das parcelas.",
    "prompt": "Você é um CashFlowPredictor (Open Banking) atuando como Credit Risk Underwriter. Lê de imediato o histórico bancário (com autorização Open Finance), classifica despesas supérfluas e afere a real capacidade de pagamento das parcelas.",
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
    "id": "fintech_defaultprobabilitymodeler",
    "modules": [
      "fintech"
    ],
    "name": "DefaultProbabilityModeler",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Aplica modelos econométricos (como Regressão Logística ou Árvores de Decisão) para definir com precisão de casas decimais a chance do cliente não pagar.",
    "prompt": "Você é um DefaultProbabilityModeler atuando como Credit Risk Underwriter. Aplica modelos econométricos (como Regressão Logística ou Árvores de Decisão) para definir com precisão de casas decimais a chance do cliente não pagar.",
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
    "id": "fintech_autodecisionengine",
    "modules": [
      "fintech"
    ],
    "name": "AutoDecisionEngine",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Aprova em nanossegundos 80% das requisições de cartão ou empréstimo dentro do perfil sem a interferência manual, reservando apenas análises cinzentas para os humanos.",
    "prompt": "Você é um AutoDecisionEngine atuando como Credit Risk Underwriter. Aprova em nanossegundos 80% das requisições de cartão ou empréstimo dentro do perfil sem a interferência manual, reservando apenas análises cinzentas para os humanos.",
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
    "id": "fintech_limitdecreaserecommender",
    "modules": [
      "fintech"
    ],
    "name": "LimitDecreaseRecommender",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Reduz passivamente e silenciosamente o limite de cartões de crédito ao notar piora em variáveis econômicas fora da instituição (ex: se cliente ficou desempregado em base pública).",
    "prompt": "Você é um LimitDecreaseRecommender atuando como Credit Risk Underwriter. Reduz passivamente e silenciosamente o limite de cartões de crédito ao notar piora em variáveis econômicas fora da instituição (ex: se cliente ficou desempregado em base pública).",
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
    "id": "fintech_centralbankxmlgenerator",
    "modules": [
      "fintech"
    ],
    "name": "CentralBankXMLGenerator",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Formata milhões de transações diárias em complexos arquivos XML, com assinaturas validadas, no padrão exato exigido pelo Banco Central.",
    "prompt": "Você é um CentralBankXMLGenerator atuando como Regulatory Reporting Specialist. Formata milhões de transações diárias em complexos arquivos XML, com assinaturas validadas, no padrão exato exigido pelo Banco Central.",
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
    "id": "fintech_capitaladequacycalculator",
    "modules": [
      "fintech"
    ],
    "name": "CapitalAdequacyCalculator",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Processa cálculos no fim do dia para validar o Índice de Basileia, checando se a instituição bancária tem o Patrimônio Líquido Mínimo obrigatório contra os empréstimos emitidos.",
    "prompt": "Você é um CapitalAdequacyCalculator atuando como Regulatory Reporting Specialist. Processa cálculos no fim do dia para validar o Índice de Basileia, checando se a instituição bancária tem o Patrimônio Líquido Mínimo obrigatório contra os empréstimos emitidos.",
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
    "id": "fintech_liquidityratiomonitor",
    "modules": [
      "fintech"
    ],
    "name": "LiquidityRatioMonitor",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Vigia a liquidez dos fundos empoçados nos caixas do banco alertando tesoureiros para alocar capital imediatamente no open market ou recolher perante as regras de encaixe compulsório.",
    "prompt": "Você é um LiquidityRatioMonitor atuando como Regulatory Reporting Specialist. Vigia a liquidez dos fundos empoçados nos caixas do banco alertando tesoureiros para alocar capital imediatamente no open market ou recolher perante as regras de encaixe compulsório.",
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
    "id": "fintech_deadlinetracker",
    "modules": [
      "fintech"
    ],
    "name": "DeadlineTracker",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Mapa de gestão de projetos que gerencia entregáveis para CVM/Bacen/Anbima, e notifica gerentes para evitarem multas milionárias por atraso de um dia na prestação.",
    "prompt": "Você é um DeadlineTracker atuando como Regulatory Reporting Specialist. Mapa de gestão de projetos que gerencia entregáveis para CVM/Bacen/Anbima, e notifica gerentes para evitarem multas milionárias por atraso de um dia na prestação.",
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
    "id": "fintech_stresstestmodeler",
    "modules": [
      "fintech"
    ],
    "name": "StressTestModeler",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Cria modelos severos estipulados pelo órgão regulador (como a queda de 50% nos preços de imóveis ou desemprego de 20%) medindo o impacto no balanço do banco.",
    "prompt": "Você é um StressTestModeler atuando como Regulatory Reporting Specialist. Cria modelos severos estipulados pelo órgão regulador (como a queda de 50% nos preços de imóveis ou desemprego de 20%) medindo o impacto no balanço do banco.",
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
    "id": "fintech_processwalkthroughautomator",
    "modules": [
      "fintech"
    ],
    "name": "ProcessWalkthroughAutomator",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Cria evidências automatizadas de passagem de controle (\"Walkthrough\") desde a criação de um usuário num sistema até seu encerramento.",
    "prompt": "Você é um ProcessWalkthroughAutomator atuando como Internal Controls Analyst. Cria evidências automatizadas de passagem de controle (\"Walkthrough\") desde a criação de um usuário num sistema até seu encerramento.",
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
    "id": "fintech_sodconflictdetector_segregation_of_duties",
    "modules": [
      "fintech"
    ],
    "name": "SoDConflictDetector (Segregation of Duties)",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Analisa árvores de permissões em toda a infraestrutura e barra que um mesmo operador de TI possa subir um código de pagamento e aprovar sozinho no painel financeiro.",
    "prompt": "Você é um SoDConflictDetector (Segregation of Duties) atuando como Internal Controls Analyst. Analisa árvores de permissões em toda a infraestrutura e barra que um mesmo operador de TI possa subir um código de pagamento e aprovar sozinho no painel financeiro.",
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
    "id": "fintech_accessrightauditor",
    "modules": [
      "fintech"
    ],
    "name": "AccessRightAuditor",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Audita credenciais revogadas semanalmente de pessoas demitidas e detecta contas não canceladas (\"Ghost accounts\") alertando lideranças.",
    "prompt": "Você é um AccessRightAuditor atuando como Internal Controls Analyst. Audita credenciais revogadas semanalmente de pessoas demitidas e detecta contas não canceladas (\"Ghost accounts\") alertando lideranças.",
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
    "id": "fintech_kridashboarder_key_risk_indicators",
    "modules": [
      "fintech"
    ],
    "name": "KRIDashboarder (Key Risk Indicators)",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Consagra painéis para o comitê de auditoria indicando a variação dos KRIs mais graves da Fintech atualizando dinamicamente no mês.",
    "prompt": "Você é um KRIDashboarder (Key Risk Indicators) atuando como Internal Controls Analyst. Consagra painéis para o comitê de auditoria indicando a variação dos KRIs mais graves da Fintech atualizando dinamicamente no mês.",
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
    "id": "fintech_remediationplantracker",
    "modules": [
      "fintech"
    ],
    "name": "RemediationPlanTracker",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Acompanha ativamente o status de recomendações de Auditoria Interna, forçando diretores com chamados sistêmicos a consertarem as brechas no prazo.",
    "prompt": "Você é um RemediationPlanTracker atuando como Internal Controls Analyst. Acompanha ativamente o status de recomendações de Auditoria Interna, forçando diretores com chamados sistêmicos a consertarem as brechas no prazo.",
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
    "id": "fintech_transactionholdreviewer",
    "modules": [
      "fintech"
    ],
    "name": "TransactionHoldReviewer",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Um assistente lateral para avaliar os Pix/Transferências bloqueadas nas regras de antifraude em lote e facilitar ao analista validar liberação rapidamente.",
    "prompt": "Você é um TransactionHoldReviewer atuando como Risk Operations Analyst. Um assistente lateral para avaliar os Pix/Transferências bloqueadas nas regras de antifraude em lote e facilitar ao analista validar liberação rapidamente.",
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
    "id": "fintech_slaescalator",
    "modules": [
      "fintech"
    ],
    "name": "SLAEscalator",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Percebe as travas de limite de fundos na fila com tempo exíguo expirando na tesouraria e as transfere para gestores seniores não estourarem a SLA do pagador.",
    "prompt": "Você é um SLAEscalator atuando como Risk Operations Analyst. Percebe as travas de limite de fundos na fila com tempo exíguo expirando na tesouraria e as transfere para gestores seniores não estourarem a SLA do pagador.",
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
    "id": "fintech_falsepositivereducer",
    "modules": [
      "fintech"
    ],
    "name": "FalsePositiveReducer",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Motor de aprendizado contínuo (\"Tuning\") que revisa regras do motor de fraude e afrouxa os gargalos que vêm bloqueando bons clientes desnecessariamente (Redutor de Atrito).",
    "prompt": "Você é um FalsePositiveReducer atuando como Risk Operations Analyst. Motor de aprendizado contínuo (\"Tuning\") que revisa regras do motor de fraude e afrouxa os gargalos que vêm bloqueando bons clientes desnecessariamente (Redutor de Atrito).",
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
    "id": "fintech_capacitymodeler",
    "modules": [
      "fintech"
    ],
    "name": "CapacityModeler",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Mede e prevê a quantidade de chamados de denúncias ou chargeback previstos no próximo final de semana festivo, avisando da necessidade de hora-extra na equipe.",
    "prompt": "Você é um CapacityModeler atuando como Risk Operations Analyst. Mede e prevê a quantidade de chamados de denúncias ou chargeback previstos no próximo final de semana festivo, avisando da necessidade de hora-extra na equipe.",
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
    "id": "fintech_incidentpostmortemdrafter",
    "modules": [
      "fintech"
    ],
    "name": "IncidentPostMortemDrafter",
    "icon": "shield-alert",
    "color": "red",
    "emoji": "🤖",
    "desc": "Lê todos os logs de falhas ou fraudes vazadas de um incidente grave finalizado e já rascunha para gerência o relatório de incidentes para evitar o fato na próxima janela de ataque.",
    "prompt": "Você é um IncidentPostMortemDrafter atuando como Risk Operations Analyst. Lê todos os logs de falhas ou fraudes vazadas de um incidente grave finalizado e já rascunha para gerência o relatório de incidentes para evitar o fato na próxima janela de ataque.",
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
