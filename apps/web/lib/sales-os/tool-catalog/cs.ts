/* eslint-disable max-lines */
import type { Tool } from "../types.js";

export const CS_TOOLS: Tool[] = [
  {
    "id": "cs_qbrdeckbuilder",
    "modules": [
      "cs"
    ],
    "name": "QBRDeckBuilder",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Rascunha a apresentação da \"Revisão Executiva de Negócios\" (QBR) com as métricas de uso e valor entregue ao cliente no trimestre.",
    "prompt": "Você é um QBRDeckBuilder atuando como Customer Success Manager (CSM). Rascunha a apresentação da \"Revisão Executiva de Negócios\" (QBR) com as métricas de uso e valor entregue ao cliente no trimestre.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_healthscoretrigger",
    "modules": [
      "cs"
    ],
    "name": "HealthScoreTrigger",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Envia um alerta ao CSM quando a \"Saúde do Cliente\" fica amarela, instruindo exatamente qual a ação corretiva a tomar.",
    "prompt": "Você é um HealthScoreTrigger atuando como Customer Success Manager (CSM). Envia um alerta ao CSM quando a \"Saúde do Cliente\" fica amarela, instruindo exatamente qual a ação corretiva a tomar.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_upsellprompt",
    "modules": [
      "cs"
    ],
    "name": "UpsellPrompt",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Detecta quando o cliente atingiu o limite de licenças e sugere o e-mail exato para oferecer o upgrade para o plano superior.",
    "prompt": "Você é um UpsellPrompt atuando como Customer Success Manager (CSM). Detecta quando o cliente atingiu o limite de licenças e sugere o e-mail exato para oferecer o upgrade para o plano superior.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_bestpracticerecommender",
    "modules": [
      "cs"
    ],
    "name": "BestPracticeRecommender",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Cruza dados de empresas similares e envia relatórios automatizados ao cliente sugerindo como usar a plataforma melhor.",
    "prompt": "Você é um BestPracticeRecommender atuando como Customer Success Manager (CSM). Cruza dados de empresas similares e envia relatórios automatizados ao cliente sugerindo como usar a plataforma melhor.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_executivesponsortracker",
    "modules": [
      "cs"
    ],
    "name": "ExecutiveSponsorTracker",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Monitora o LinkedIn do decisor do cliente. Se ele trocar de emprego, aciona o CSM para construir relacionamento com o sucessor.",
    "prompt": "Você é um ExecutiveSponsorTracker atuando como Customer Success Manager (CSM). Monitora o LinkedIn do decisor do cliente. Se ele trocar de emprego, aciona o CSM para construir relacionamento com o sucessor.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_projectplantracker",
    "modules": [
      "cs"
    ],
    "name": "ProjectPlanTracker",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Atualiza o gráfico de Gantt da implementação automaticamente com base nos e-mails e tarefas concluídas pelo cliente.",
    "prompt": "Você é um ProjectPlanTracker atuando como Implementation Specialist. Atualiza o gráfico de Gantt da implementação automaticamente com base nos e-mails e tarefas concluídas pelo cliente.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_apikeyconfigurator",
    "modules": [
      "cs"
    ],
    "name": "APIKeyConfigurator",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Guia o desenvolvedor do cliente através de um chatbot para configurar integrações, testar chaves API e validar payloads sem envolver humanos.",
    "prompt": "Você é um APIKeyConfigurator atuando como Implementation Specialist. Guia o desenvolvedor do cliente através de um chatbot para configurar integrações, testar chaves API e validar payloads sem envolver humanos.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_datamigrationvalidator",
    "modules": [
      "cs"
    ],
    "name": "DataMigrationValidator",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Audita o banco de dados que o cliente importou (Planilhas/CSVs) apontando erros, células vazias e corrigindo a formatação.",
    "prompt": "Você é um DataMigrationValidator atuando como Implementation Specialist. Audita o banco de dados que o cliente importou (Planilhas/CSVs) apontando erros, células vazias e corrigindo a formatação.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_milestonechaser",
    "modules": [
      "cs"
    ],
    "name": "MilestoneChaser",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Envia lembretes educados e automatizados para o cliente quando ele está atrasando a entrega de materiais necessários para a implantação.",
    "prompt": "Você é um MilestoneChaser atuando como Implementation Specialist. Envia lembretes educados e automatizados para o cliente quando ele está atrasando a entrega de materiais necessários para a implantação.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_delayescalator",
    "modules": [
      "cs"
    ],
    "name": "DelayEscalator",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Percebe quando um projeto está travado há mais de 15 dias e aciona o gerente de implementações para intervenção executiva.",
    "prompt": "Você é um DelayEscalator atuando como Implementation Specialist. Percebe quando um projeto está travado há mais de 15 dias e aciona o gerente de implementações para intervenção executiva.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_welcomesequencer",
    "modules": [
      "cs"
    ],
    "name": "WelcomeSequencer",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Adapta a sequência de boas-vindas dependendo da senioridade do usuário (um CEO recebe conteúdo de ROI, um analista recebe tutoriais práticos).",
    "prompt": "Você é um WelcomeSequencer atuando como Onboarding Manager. Adapta a sequência de boas-vindas dependendo da senioridade do usuário (um CEO recebe conteúdo de ROI, um analista recebe tutoriais práticos).",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_ahamomenttracker",
    "modules": [
      "cs"
    ],
    "name": "AhaMomentTracker",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Identifica o momento exato em que o cliente obtém o primeiro valor da ferramenta e dispara uma mensagem de celebração/gamificação.",
    "prompt": "Você é um AhaMomentTracker atuando como Onboarding Manager. Identifica o momento exato em que o cliente obtém o primeiro valor da ferramenta e dispara uma mensagem de celebração/gamificação.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_trainingvideorecommender",
    "modules": [
      "cs"
    ],
    "name": "TrainingVideoRecommender",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Observa onde o usuário clica e empaca no software, abrindo pop-ups com vídeos curtos exatamente sobre aquela funcionalidade.",
    "prompt": "Você é um TrainingVideoRecommender atuando como Onboarding Manager. Observa onde o usuário clica e empaca no software, abrindo pop-ups com vídeos curtos exatamente sobre aquela funcionalidade.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_faqautoresponder",
    "modules": [
      "cs"
    ],
    "name": "FAQAutoResponder",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Responde dúvidas repetitivas enviadas por e-mail nos primeiros 30 dias usando o manual de implantação.",
    "prompt": "Você é um FAQAutoResponder atuando como Onboarding Manager. Responde dúvidas repetitivas enviadas por e-mail nos primeiros 30 dias usando o manual de implantação.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_adoptionmetricanalyzer",
    "modules": [
      "cs"
    ],
    "name": "AdoptionMetricAnalyzer",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Compara a velocidade de adoção do cliente atual com a média histórica dos clientes bem-sucedidos para prever sucesso.",
    "prompt": "Você é um AdoptionMetricAnalyzer atuando como Onboarding Manager. Compara a velocidade de adoção do cliente atual com a média histórica dos clientes bem-sucedidos para prever sucesso.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_ticketclassifier",
    "modules": [
      "cs"
    ],
    "name": "TicketClassifier",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Lê o ticket de suporte, entende a urgência e o categoriza perfeitamente, enviando para o departamento ou nível de suporte correto.",
    "prompt": "Você é um TicketClassifier atuando como Customer Support Specialist (L1, L2, L3). Lê o ticket de suporte, entende a urgência e o categoriza perfeitamente, enviando para o departamento ou nível de suporte correto.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_semanticsearchkb",
    "modules": [
      "cs"
    ],
    "name": "SemanticSearchKB",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Transforma a busca da base de conhecimento; ao invés de buscar palavras, entende o problema do cliente e traz a solução em um parágrafo.",
    "prompt": "Você é um SemanticSearchKB atuando como Customer Support Specialist (L1, L2, L3). Transforma a busca da base de conhecimento; ao invés de buscar palavras, entende o problema do cliente e traz a solução em um parágrafo.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_l1autoresolver",
    "modules": [
      "cs"
    ],
    "name": "L1AutoResolver",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Resolve sozinho 80% das chamadas comuns (reset de senha, dúvidas de faturamento, onde clicar) comunicando-se de forma humanizada.",
    "prompt": "Você é um L1AutoResolver atuando como Customer Support Specialist (L1, L2, L3). Resolve sozinho 80% das chamadas comuns (reset de senha, dúvidas de faturamento, onde clicar) comunicando-se de forma humanizada.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_l3bugreplicator",
    "modules": [
      "cs"
    ],
    "name": "L3BugReplicator",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Traduz o relato vago do cliente (\"deu erro\") em uma série de passos de reprodução, logs do sistema e linhas de código prováveis para o engenheiro.",
    "prompt": "Você é um L3BugReplicator atuando como Customer Support Specialist (L1, L2, L3). Traduz o relato vago do cliente (\"deu erro\") em uma série de passos de reprodução, logs do sistema e linhas de código prováveis para o engenheiro.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_angrycustomerescalator",
    "modules": [
      "cs"
    ],
    "name": "AngryCustomerEscalator",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Percebe linguagem agressiva, CAIXA ALTA ou histórico de frustração no chat e roteia instantaneamente para um humano sênior.",
    "prompt": "Você é um AngryCustomerEscalator atuando como Customer Support Specialist (L1, L2, L3). Percebe linguagem agressiva, CAIXA ALTA ou histórico de frustração no chat e roteia instantaneamente para um humano sênior.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_slamonitor",
    "modules": [
      "cs"
    ],
    "name": "SLAMonitor",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Fiscaliza os Acordos de Nível de Serviço. Se um ticket técnico está prestes a violar o tempo de resposta, cria alertas vermelhos.",
    "prompt": "Você é um SLAMonitor atuando como Technical Account Manager (TAM). Fiscaliza os Acordos de Nível de Serviço. Se um ticket técnico está prestes a violar o tempo de resposta, cria alertas vermelhos.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_patchupdatealerter",
    "modules": [
      "cs"
    ],
    "name": "PatchUpdateAlerter",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Avisa o cliente proativamente sobre atualizações e correções de segurança (patches), analisando se a atualização vai quebrar o código deles.",
    "prompt": "Você é um PatchUpdateAlerter atuando como Technical Account Manager (TAM). Avisa o cliente proativamente sobre atualizações e correções de segurança (patches), analisando se a atualização vai quebrar o código deles.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_scalabilitypredictor",
    "modules": [
      "cs"
    ],
    "name": "ScalabilityPredictor",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Monitora a infraestrutura do cliente e prevê quando eles vão precisar comprar mais servidores ou banda antes que o sistema deles caia.",
    "prompt": "Você é um ScalabilityPredictor atuando como Technical Account Manager (TAM). Monitora a infraestrutura do cliente e prevê quando eles vão precisar comprar mais servidores ou banda antes que o sistema deles caia.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_customscriptgenerator",
    "modules": [
      "cs"
    ],
    "name": "CustomScriptGenerator",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Escreve scripts curtos (Python/Bash) para ajudar o cliente a automatizar rotinas internas ligadas ao produto.",
    "prompt": "Você é um CustomScriptGenerator atuando como Technical Account Manager (TAM). Escreve scripts curtos (Python/Bash) para ajudar o cliente a automatizar rotinas internas ligadas ao produto.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_outagecommunicator",
    "modules": [
      "cs"
    ],
    "name": "OutageCommunicator",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Durante quedas de servidor (Downtime), gera atualizações técnicas em tempo real para acalmar as equipes de TI dos clientes.",
    "prompt": "Você é um OutageCommunicator atuando como Technical Account Manager (TAM). Durante quedas de servidor (Downtime), gera atualizações técnicas em tempo real para acalmar as equipes de TI dos clientes.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_renewalcontractgenerator",
    "modules": [
      "cs"
    ],
    "name": "RenewalContractGenerator",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Cria o contrato de renovação com o reajuste de inflação ou aumento de preço programado pronto para assinatura digital.",
    "prompt": "Você é um RenewalContractGenerator atuando como Account Manager (AM). Cria o contrato de renovação com o reajuste de inflação ou aumento de preço programado pronto para assinatura digital.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_crosssellmapper",
    "modules": [
      "cs"
    ],
    "name": "CrossSellMapper",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Analisa o uso da conta e sugere produtos complementares do portfólio da empresa que se encaixam perfeitamente na dor atual.",
    "prompt": "Você é um CrossSellMapper atuando como Account Manager (AM). Analisa o uso da conta e sugere produtos complementares do portfólio da empresa que se encaixam perfeitamente na dor atual.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_relationshipmatrixbuilder",
    "modules": [
      "cs"
    ],
    "name": "RelationshipMatrixBuilder",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Mapeia quem são os defensores, detratores e desconhecidos dentro da conta do cliente, orientando quem o AM deve chamar para almoçar.",
    "prompt": "Você é um RelationshipMatrixBuilder atuando como Account Manager (AM). Mapeia quem são os defensores, detratores e desconhecidos dentro da conta do cliente, orientando quem o AM deve chamar para almoçar.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_pricingtierrecommender",
    "modules": [
      "cs"
    ],
    "name": "PricingTierRecommender",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Simula o impacto financeiro para o cliente de mudar de um plano mensal para anual, criando a proposta financeira irresistível.",
    "prompt": "Você é um PricingTierRecommender atuando como Account Manager (AM). Simula o impacto financeiro para o cliente de mudar de um plano mensal para anual, criando a proposta financeira irresistível.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_whitespaceanalyzer",
    "modules": [
      "cs"
    ],
    "name": "WhiteSpaceAnalyzer",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Mostra quais divisões, subsidiárias ou filiais do cliente atual ainda não usam o produto, criando o plano de expansão.",
    "prompt": "Você é um WhiteSpaceAnalyzer atuando como Account Manager (AM). Mostra quais divisões, subsidiárias ou filiais do cliente atual ainda não usam o produto, criando o plano de expansão.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_csatnpsaggregator",
    "modules": [
      "cs"
    ],
    "name": "CSATNPSAggregator",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Compila todas as notas de NPS (Net Promoter Score) e CSAT do trimestre e gera análises de texto sobre por que a nota subiu ou desceu.",
    "prompt": "Você é um CSATNPSAggregator atuando como Customer Operations Specialist. Compila todas as notas de NPS (Net Promoter Score) e CSAT do trimestre e gera análises de texto sobre por que a nota subiu ou desceu.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_ticketbackloganalyzer",
    "modules": [
      "cs"
    ],
    "name": "TicketBacklogAnalyzer",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Monitora a fila de tickets de suporte identificando gargalos na equipe e sugerindo pausas e redistribuição de turnos.",
    "prompt": "Você é um TicketBacklogAnalyzer atuando como Customer Operations Specialist. Monitora a fila de tickets de suporte identificando gargalos na equipe e sugerindo pausas e redistribuição de turnos.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_kbgapidentifier",
    "modules": [
      "cs"
    ],
    "name": "KBGapIdentifier",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Analisa as perguntas dos clientes para identificar o que NÃO está na documentação e cria os rascunhos dos novos artigos de ajuda.",
    "prompt": "Você é um KBGapIdentifier atuando como Customer Operations Specialist. Analisa as perguntas dos clientes para identificar o que NÃO está na documentação e cria os rascunhos dos novos artigos de ajuda.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_shiftscheduler",
    "modules": [
      "cs"
    ],
    "name": "ShiftScheduler",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Organiza a escala de plantão da equipe de suporte global (Follow the sun) para garantir cobertura 24/7 sem estourar o banco de horas.",
    "prompt": "Você é um ShiftScheduler atuando como Customer Operations Specialist. Organiza a escala de plantão da equipe de suporte global (Follow the sun) para garantir cobertura 24/7 sem estourar o banco de horas.",
    "fields": [
      {
        "id": "context",
        "label": "Contexto / Dados",
        "type": "textarea",
        "placeholder": "Insira os dados ou contexto para análise..."
      }
    ]
  },
  {
    "id": "cs_refundprocessor",
    "modules": [
      "cs"
    ],
    "name": "RefundProcessor",
    "icon": "life-buoy",
    "color": "sky",
    "emoji": "🤖",
    "desc": "Audita pedidos de reembolso baseados na política da empresa e aprova ou nega transações sem intervenção humana.",
    "prompt": "Você é um RefundProcessor atuando como Customer Operations Specialist. Audita pedidos de reembolso baseados na política da empresa e aprova ou nega transações sem intervenção humana.",
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
