# Análise de Isolamento de Runtime (Runtime Isolation)

No contexto do BirthHub360, "Isolamento de Runtime" refere-se às garantias arquiteturais que impedem a execução de um agente pertencente ao Tenant A de interferir, direta ou indiretamente, na execução de um agente do Tenant B. Como o sistema utiliza infraestrutura híbrida (filas compartilhadas para planos Free/Standard - ver ADR-015), o isolamento em nível de software é a principal linha de defesa contra vazamento de dados, exaustão de recursos ("noisy neighbor") e exploração de vulnerabilidades.

Esta análise descreve os vetores de quebra de isolamento e os controles de mitigação adotados.

## 1. O Problema Fundamental: Workers Compartilhados

No modelo de filas compartilhadas, o mesmo processo *Worker* (ex: um pod Kubernetes rodando Python) processa sucessivamente jobs de múltiplos tenants.

*   **Tempo T0:** O Worker pega o job J1 do Tenant A (Processar Fatura).
*   **Tempo T1:** O Worker finaliza J1 e pega o job J2 do Tenant B (Analisar Sentimento de E-mail).

A questão crítica é: "Quanta informação e quanto estado do J1 (Tenant A) sobrevivem no Worker durante a execução de J2 (Tenant B)?"

## 2. Vetores de Quebra de Isolamento e Seus Riscos

Abaixo estão os cenários onde a má arquitetura de software quebra o isolamento:

### A. Vazamento de Variáveis Globais (Memory Leaks em Aplicação)
*   **O Vetor:** Um agente ou ferramenta do Tenant A armazena dados em uma variável global do Python (ex: `_CACHED_RESULTS`, instâncias de classes Singleton, `sys.modules`) ou usa bibliotecas subjacentes não thread-safe/stateful (ex: session requests reaproveitada com headers errados).
*   **A Quebra:** Quando o Worker começa a processar J2 (Tenant B), ele lê a variável global e acidentalmente inclui dados do Tenant A no prompt do LLM ou em uma resposta da API.
*   **Resultado:** Exfiltração de PII (Vazamento de Dados) cross-tenant.
*   **Mitigação:**
    *   **Proibição Estrita de Estado Global:** O Agent Core proíbe o uso de variáveis globais para estado de execução. Todo o estado do LangGraph deve estar contido estritamente no objeto `State` passado de nó em nó.
    *   **Injeção de Dependência de Curto Ciclo:** Clientes de banco de dados, chaves de API externas e sessões HTTP são instanciados *por execução de job*, usando a configuração do manifesto e injetados na Tool no momento da invocação. No final do job, essas instâncias são destruídas/descartadas (Garbage Collected).
    *   **Reinício Periódico de Workers (Worker Recycling):** O processo do Worker morre e é substituído (ex: via `max_tasks_per_child` no Celery) após processar N jobs. Isso garante que a memória seja expurgada no nível do SO.

### B. Interferência de Performance ("Noisy Neighbor")
*   **O Vetor:** O agente do Tenant A executa um loop infinito ou um processamento intensivo de CPU que trava a thread principal do Worker (ex: Regex Catastrophic Backtracking) ou exaure todo o limite de memória do Pod.
*   **A Quebra:** Se o Worker for single-threaded (ou usar um GIL no Python mal configurado) ou o Pod for morto (OOM), o job do Tenant B que estava em outra thread ou aguardando na fila local sofre timeout ou cai.
*   **Resultado:** Indisponibilidade ou alta latência para o Tenant B devido ao uso abusivo do Tenant A.
*   **Mitigação:**
    *   **Fair Queuing:** Conforme o ADR-015, o dispatcher não entregará 100% dos workers para um único tenant se houver jobs de outros na fila.
    *   **Limites Estruturados (Timeouts):** O tempo máximo de execução por job (ex: 5 minutos) é imposto rigorosamente no nível da thread do processo ou via corrotinas (asyncio.wait_for). Se um job exceder o tempo, ele é cancelado forçosamente, liberando o recurso.
    *   **Limites de Memória por Processo:** O framework (ou o orquestrador do K8s) monitora a alocação de RAM (RSS) da thread. Se o limite for excedido, o job é morto (OOM) antes que o processo principal caia e perca o job de B.

### C. Confused Deputy via Policy Engine
*   **O Vetor:** A Tool usa uma "Master Key" ou Role de serviço (ex: IAM Role da EC2) para acessar o banco de dados multitenant. A Tool usa o `tenant_id` fornecido no payload do job para filtrar os dados.
*   **A Quebra:** Se o payload do job (construído pelo LLM) puder ser forjado para injetar o `tenant_id` de B enquanto o job é do A (SSRF/SQLi na camada da ferramenta).
*   **Resultado:** Escalada de privilégios horizontal. O agente A lê os dados do banco do Tenant B.
*   **Mitigação:**
    *   **Row-Level Security (RLS) no Banco de Dados:** O `tenant_id` **NÃO** deve ser um parâmetro controlável pelo LLM. O `tenant_id` é injetado pelo orquestrador no contexto da Tool (em um header seguro ou variável ThreadLocal isolada por contexto asyncio) e a Role do DB aplica a política de acesso (RLS) invisivelmente na query. A Tool não pode "pedir" dados de outro tenant, mesmo que quisesse.

### D. Compartilhamento de Cache e Filas Subjacentes
*   **O Vetor:** Uso do Redis/Memcached sem namespace, onde o Tenant A salva uma chave "user_123" e o Tenant B tenta buscar a chave "user_123".
*   **A Quebra:** Colisão de dados no cache, resultando em leitura cruzada.
*   **Mitigação:**
    *   O Agent Core injeta automaticamente um prefixo de namespace (ex: `tenantA:user_123`) em todas as operações de K-V Store (Redis), invisível para o código da Tool.

## 3. Sandboxing Avançado (Planos Enterprise)

Se o nível de isolamento garantido por software (descrito acima) não for suficiente para os requisitos de conformidade de um cliente (ex: SOC2 Type II rígido ou regulamentação bancária):
*   A plataforma implementará as **Filas Dedicadas (ADR-015)**: O cliente Enterprise roda em Pods Kubernetes fisicamente separados em *nodes* designados apenas para aquele tenant (Single-Tenant Workers), com VPC peering se necessário.

## 4. Conclusão

O isolamento em runtimes de filas compartilhadas depende da total **ausência de estado global persistente** (Stateless Workers) e da **imposição de limites não negociáveis** (Timeouts e Memória). Além disso, a segurança em profundidade exige que a separação de dados (Tenant Id) nunca seja passada como parâmetro variável, mas injetada como contexto imutável na camada de acesso a dados (RLS).
