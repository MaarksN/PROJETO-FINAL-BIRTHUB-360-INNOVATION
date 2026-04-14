/* eslint-disable max-lines */
import type { Tool } from "../types.js";

export const FINANCE_TOOLS: Tool[] = [
  {
    "id": "finance_contractredliner",
    "modules": [
      "finance"
    ],
    "name": "ContractRedliner",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Lê minutas recebidas de clientes e realça (com comentários automáticos) todas as cláusulas que ferem a política de riscos da empresa.",
    "prompt": "Você é um ContractRedliner atuando como General Counsel / Legal Manager. Lê minutas recebidas de clientes e realça (com comentários automáticos) todas as cláusulas que ferem a política de riscos da empresa.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_ipinfringementscraper",
    "modules": [
      "finance"
    ],
    "name": "IPInfringementScraper",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Monitora a web buscando cópias do software, roubo de logotipos e uso indevido da marca, emitindo notificações extrajudiciais automáticas.",
    "prompt": "Você é um IPInfringementScraper atuando como General Counsel / Legal Manager. Monitora a web buscando cópias do software, roubo de logotipos e uso indevido da marca, emitindo notificações extrajudiciais automáticas.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_regulatorychangealerter",
    "modules": [
      "finance"
    ],
    "name": "RegulatoryChangeAlerter",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Acompanha Diários Oficiais e jornais ao redor do mundo avisando se uma nova lei local afetará o modelo de negócios da empresa.",
    "prompt": "Você é um RegulatoryChangeAlerter atuando como General Counsel / Legal Manager. Acompanha Diários Oficiais e jornais ao redor do mundo avisando se uma nova lei local afetará o modelo de negócios da empresa.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_ndaautosigner",
    "modules": [
      "finance"
    ],
    "name": "NDAAutoSigner",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Gerencia a criação, envio e arquivamento em massa de Acordos de Confidencialidade padronizados para parceiros e fornecedores.",
    "prompt": "Você é um NDAAutoSigner atuando como General Counsel / Legal Manager. Gerencia a criação, envio e arquivamento em massa de Acordos de Confidencialidade padronizados para parceiros e fornecedores.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_riskexposurequantifier",
    "modules": [
      "finance"
    ],
    "name": "RiskExposureQuantifier",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Transforma linguagem jurídica em \"Custo de Risco\" (Ex: \"Essa cláusula de multa tem 5% de chance de ocorrer e custará 2 milhões\").",
    "prompt": "Você é um RiskExposureQuantifier atuando como General Counsel / Legal Manager. Transforma linguagem jurídica em \"Custo de Risco\" (Ex: \"Essa cláusula de multa tem 5% de chance de ocorrer e custará 2 milhões\").",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_invoicegenerator",
    "modules": [
      "finance"
    ],
    "name": "InvoiceGenerator",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Emite notas fiscais, faturas e boletos em massa com cálculos perfeitos de alíquotas de impostos baseadas no CEP do cliente.",
    "prompt": "Você é um InvoiceGenerator atuando como Billing Specialist / Billing Support Specialist. Emite notas fiscais, faturas e boletos em massa com cálculos perfeitos de alíquotas de impostos baseadas no CEP do cliente.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_prorationcalculator",
    "modules": [
      "finance"
    ],
    "name": "ProrationCalculator",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Calcula matematicamente devoluções e cobranças proporcionais caso o cliente cancele o plano no meio do mês ou adicione usuários extras.",
    "prompt": "Você é um ProrationCalculator atuando como Billing Specialist / Billing Support Specialist. Calcula matematicamente devoluções e cobranças proporcionais caso o cliente cancele o plano no meio do mês ou adicione usuários extras.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_failedpaymentretrier",
    "modules": [
      "finance"
    ],
    "name": "FailedPaymentRetrier",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Aciona algoritmos inteligentes para refazer cobranças de cartão de crédito falhas nos melhores dias/horários para aprovação do banco.",
    "prompt": "Você é um FailedPaymentRetrier atuando como Billing Specialist / Billing Support Specialist. Aciona algoritmos inteligentes para refazer cobranças de cartão de crédito falhas nos melhores dias/horários para aprovação do banco.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_taxexemptionverifier",
    "modules": [
      "finance"
    ],
    "name": "TaxExemptionVerifier",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Valida documentos de clientes isentos de impostos (como ONGs) mantendo a conformidade para não gerar passivo fiscal.",
    "prompt": "Você é um TaxExemptionVerifier atuando como Billing Specialist / Billing Support Specialist. Valida documentos de clientes isentos de impostos (como ONGs) mantendo a conformidade para não gerar passivo fiscal.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_disputedchargeaggregator",
    "modules": [
      "finance"
    ],
    "name": "DisputedChargeAggregator",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Junta todas as provas do sistema (logs de acesso, contratos) automaticamente quando um cliente faz chargeback (contesta no cartão).",
    "prompt": "Você é um DisputedChargeAggregator atuando como Billing Specialist / Billing Support Specialist. Junta todas as provas do sistema (logs de acesso, contratos) automaticamente quando um cliente faz chargeback (contesta no cartão).",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_dunningautomator",
    "modules": [
      "finance"
    ],
    "name": "DunningAutomator",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Cria réguas de cobrança dinâmicas (SMS, WhatsApp, E-mail) adaptando o tom de voz do mais educado ao mais firme, dependendo do atraso.",
    "prompt": "Você é um DunningAutomator atuando como Collections Analyst / Specialist. Cria réguas de cobrança dinâmicas (SMS, WhatsApp, E-mail) adaptando o tom de voz do mais educado ao mais firme, dependendo do atraso.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_paymentplannegotiator",
    "modules": [
      "finance"
    ],
    "name": "PaymentPlanNegotiator",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Um chatbot focado que negocia propostas de parcelamento com devedores dentro de margens pré-aprovadas pelo departamento de finanças.",
    "prompt": "Você é um PaymentPlanNegotiator atuando como Collections Analyst / Specialist. Um chatbot focado que negocia propostas de parcelamento com devedores dentro de margens pré-aprovadas pelo departamento de finanças.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_promisetopaytracker",
    "modules": [
      "finance"
    ],
    "name": "PromiseToPayTracker",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Monitora quem fez \"acordos de pagamento\" por telefone e emite alertas caso o boleto da renegociação não seja pago.",
    "prompt": "Você é um PromiseToPayTracker atuando como Collections Analyst / Specialist. Monitora quem fez \"acordos de pagamento\" por telefone e emite alertas caso o boleto da renegociação não seja pago.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_baddebtpredictor",
    "modules": [
      "finance"
    ],
    "name": "BadDebtPredictor",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Usa Machine Learning para avisar preventivamente que clientes com um perfil X têm 90% de chance de virar inadimplência (Provisão PDD).",
    "prompt": "Você é um BadDebtPredictor atuando como Collections Analyst / Specialist. Usa Machine Learning para avisar preventivamente que clientes com um perfil X têm 90% de chance de virar inadimplência (Provisão PDD).",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_collectionagencyrouter",
    "modules": [
      "finance"
    ],
    "name": "CollectionAgencyRouter",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Empacota os piores devedores (após 90 dias) e transfere o dossiê completo automaticamente para empresas de cobrança terceirizadas e advogados.",
    "prompt": "Você é um CollectionAgencyRouter atuando como Collections Analyst / Specialist. Empacota os piores devedores (após 90 dias) e transfere o dossiê completo automaticamente para empresas de cobrança terceirizadas e advogados.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_cloudspendoptimizer",
    "modules": [
      "finance"
    ],
    "name": "CloudSpendOptimizer",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Monitora AWS/Google Cloud minuto a minuto, desligando instâncias de servidores não utilizadas durante a madrugada para economizar dinheiro.",
    "prompt": "Você é um CloudSpendOptimizer atuando como FinOps Specialist. Monitora AWS/Google Cloud minuto a minuto, desligando instâncias de servidores não utilizadas durante a madrugada para economizar dinheiro.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_saaslicenseauditor",
    "modules": [
      "finance"
    ],
    "name": "SaaSLicenseAuditor",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Vasculha e-mails e despesas em cartão de crédito para encontrar softwares que os funcionários assinam e esquecem (Shadow IT).",
    "prompt": "Você é um SaaSLicenseAuditor atuando como FinOps Specialist. Vasculha e-mails e despesas em cartão de crédito para encontrar softwares que os funcionários assinam e esquecem (Shadow IT).",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_instancerightsizer",
    "modules": [
      "finance"
    ],
    "name": "InstanceRightSizer",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Avalia que um servidor muito potente está subutilizado e sugere ou executa o downgrade para um plano mais barato sem afetar a performance.",
    "prompt": "Você é um InstanceRightSizer atuando como FinOps Specialist. Avalia que um servidor muito potente está subutilizado e sugere ou executa o downgrade para um plano mais barato sem afetar a performance.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_budgetvariancepinger",
    "modules": [
      "finance"
    ],
    "name": "BudgetVariancePinger",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Alerta os chefes de departamento quando eles estão prestes a ultrapassar a cota de gastos mensais prevista do orçamento deles.",
    "prompt": "Você é um BudgetVariancePinger atuando como FinOps Specialist. Alerta os chefes de departamento quando eles estão prestes a ultrapassar a cota de gastos mensais prevista do orçamento deles.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_multicloudcostmodeler",
    "modules": [
      "finance"
    ],
    "name": "MultiCloudCostModeler",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Simula o impacto financeiro de migrar toda a infraestrutura da Amazon (AWS) para a Microsoft (Azure).",
    "prompt": "Você é um MultiCloudCostModeler atuando como FinOps Specialist. Simula o impacto financeiro de migrar toda a infraestrutura da Amazon (AWS) para a Microsoft (Azure).",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_cashappmatcher",
    "modules": [
      "finance"
    ],
    "name": "CashAppMatcher",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Concilia os extratos bancários com as faturas emitidas. Quando cai um PIX/Transferência, encontra magicamente a quem pertence e dá baixa no CRM.",
    "prompt": "Você é um CashAppMatcher atuando como Accounts Receivable Specialist. Concilia os extratos bancários com as faturas emitidas. Quando cai um PIX/Transferência, encontra magicamente a quem pertence e dá baixa no CRM.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_bankreconciliationbot",
    "modules": [
      "finance"
    ],
    "name": "BankReconciliationBot",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Varre milhões de linhas dos bancos para bater com o ERP (SAP/Oracle) identificando diferenças de centavos ou taxas não declaradas.",
    "prompt": "Você é um BankReconciliationBot atuando como Accounts Receivable Specialist. Varre milhões de linhas dos bancos para bater com o ERP (SAP/Oracle) identificando diferenças de centavos ou taxas não declaradas.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_agingreportsender",
    "modules": [
      "finance"
    ],
    "name": "AgingReportSender",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Gera e distribui relatórios detalhados diários sobre \"Idade dos Recebíveis\" (30, 60, 90+ dias de atraso) para o time financeiro e de vendas.",
    "prompt": "Você é um AgingReportSender atuando como Accounts Receivable Specialist. Gera e distribui relatórios detalhados diários sobre \"Idade dos Recebíveis\" (30, 60, 90+ dias de atraso) para o time financeiro e de vendas.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_creditholdreleaser",
    "modules": [
      "finance"
    ],
    "name": "CreditHoldReleaser",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Monitora o banco e, assim que o dinheiro do devedor compensa, desbloqueia o software ou envia a mercadoria em segundos.",
    "prompt": "Você é um CreditHoldReleaser atuando como Accounts Receivable Specialist. Monitora o banco e, assim que o dinheiro do devedor compensa, desbloqueia o software ou envia a mercadoria em segundos.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_remittanceextractor",
    "modules": [
      "finance"
    ],
    "name": "RemittanceExtractor",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Extrai comprovantes em PDF que os clientes enviam por e-mail e alimenta as informações no sistema contábil, livrando o operador de digitação.",
    "prompt": "Você é um RemittanceExtractor atuando como Accounts Receivable Specialist. Extrai comprovantes em PDF que os clientes enviam por e-mail e alimenta as informações no sistema contábil, livrando o operador de digitação.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_creditscorefetcher",
    "modules": [
      "finance"
    ],
    "name": "CreditScoreFetcher",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Consome dados de bureaux (Serasa, Experian, Dun & Bradstreet) para puxar o perfil de risco do cliente em tempo real no momento da venda.",
    "prompt": "Você é um CreditScoreFetcher atuando como Credit Manager. Consome dados de bureaux (Serasa, Experian, Dun & Bradstreet) para puxar o perfil de risco do cliente em tempo real no momento da venda.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_financialratiocalculator",
    "modules": [
      "finance"
    ],
    "name": "FinancialRatioCalculator",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Recebe o balanço do cliente e calcula todos os índices de liquidez, endividamento e rentabilidade em segundos para avaliar crédito.",
    "prompt": "Você é um FinancialRatioCalculator atuando como Credit Manager. Recebe o balanço do cliente e calcula todos os índices de liquidez, endividamento e rentabilidade em segundos para avaliar crédito.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_creditlimitrecommender",
    "modules": [
      "finance"
    ],
    "name": "CreditLimitRecommender",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Define matematicamente se a empresa pode vender R$ 10.000 ou R$ 1.000.000 a prazo para um novo cliente sem risco.",
    "prompt": "Você é um CreditLimitRecommender atuando como Credit Manager. Define matematicamente se a empresa pode vender R$ 10.000 ou R$ 1.000.000 a prazo para um novo cliente sem risco.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_bankruptcyriskmonitor",
    "modules": [
      "finance"
    ],
    "name": "BankruptcyRiskMonitor",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Monitora processos judiciais e protestos em cartórios para alertar se um cliente ativo está prestes a pedir falência (Recuperação Judicial).",
    "prompt": "Você é um BankruptcyRiskMonitor atuando como Credit Manager. Monitora processos judiciais e protestos em cartórios para alertar se um cliente ativo está prestes a pedir falência (Recuperação Judicial).",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_tradereferencechecker",
    "modules": [
      "finance"
    ],
    "name": "TradeReferenceChecker",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Automatiza o envio e o recebimento de e-mails para outras empresas perguntando \"O cliente X é bom pagador com vocês?\".",
    "prompt": "Você é um TradeReferenceChecker atuando como Credit Manager. Automatiza o envio e o recebimento de e-mails para outras empresas perguntando \"O cliente X é bom pagador com vocês?\".",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_monthendcloseautomator",
    "modules": [
      "finance"
    ],
    "name": "MonthEndCloseAutomator",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Automatiza as dezenas de conciliações do \"Fechamento do Mês\", reduzindo o tempo de trabalho de 10 dias para 1 dia.",
    "prompt": "Você é um MonthEndCloseAutomator atuando como Controller. Automatiza as dezenas de conciliações do \"Fechamento do Mês\", reduzindo o tempo de trabalho de 10 dias para 1 dia.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_accrualengine",
    "modules": [
      "finance"
    ],
    "name": "AccrualEngine",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Calcula provisões de faturamento e despesas automaticamente com base nos contratos ativos garantindo o Regime de Competência correto.",
    "prompt": "Você é um AccrualEngine atuando como Controller. Calcula provisões de faturamento e despesas automaticamente com base nos contratos ativos garantindo o Regime de Competência correto.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_audittrailbuilder",
    "modules": [
      "finance"
    ],
    "name": "AuditTrailBuilder",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Registra e fotografa todo o fluxo de aprovações do sistema financeiro, deixando pacotes herméticos prontos para auditores externos da Big 4.",
    "prompt": "Você é um AuditTrailBuilder atuando como Controller. Registra e fotografa todo o fluxo de aprovações do sistema financeiro, deixando pacotes herméticos prontos para auditores externos da Big 4.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_glanomalydetector",
    "modules": [
      "finance"
    ],
    "name": "GLAnomalyDetector",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Vasculha o Livro Razão (General Ledger) e aponta se alguém lançou uma despesa de marketing na conta contábil de TI (erro de classificação).",
    "prompt": "Você é um GLAnomalyDetector atuando como Controller. Vasculha o Livro Razão (General Ledger) e aponta se alguém lançou uma despesa de marketing na conta contábil de TI (erro de classificação).",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "finance_compliancechecklistenforcer",
    "modules": [
      "finance"
    ],
    "name": "ComplianceChecklistEnforcer",
    "icon": "dollar-sign",
    "color": "green",
    "emoji": "🤖",
    "desc": "Trava o lançamento dos resultados financeiros oficiais se o checklist obrigatório das normas Sarbanes-Oxley (SOX) ou equivalentes não estiver 100% ticado.",
    "prompt": "Você é um ComplianceChecklistEnforcer atuando como Controller. Trava o lançamento dos resultados financeiros oficiais se o checklist obrigatório das normas Sarbanes-Oxley (SOX) ou equivalentes não estiver 100% ticado.",
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
