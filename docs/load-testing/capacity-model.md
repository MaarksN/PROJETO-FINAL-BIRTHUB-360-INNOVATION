# Modelo de Capacidade: Previsão de Infra (BirthHub 360)

## Escalonamento de Tenants (B2B)
Este modelo projeta os custos e a arquitetura necessária com base no número de Tenants (Agências/Empresas clientes), assumindo uma média de 10 usuários ativos e 50 interações de agentes por dia por Tenant.

### Nível 1: 1k Tenants (Tração B2B)
- **Perfil:** ~50,000 interações de IA/dia. Tráfego previsível.
- **Infraestrutura Core (AWS):**
  - **ECS Fargate:** 2 a 4 containers API Gateway (1 vCPU, 2GB RAM); 2 a 4 Orchestrators (2 vCPU, 4GB RAM).
  - **Banco de Dados:** RDS PostgreSQL Multi-AZ (db.t4g.medium ou m6g.large).
  - **Cache:** ElastiCache Redis (cache.t4g.micro).
- **Gargalos Previstos:** Limitantes orçamentários com provedores de LLM.
- **Custos AWS Estimados:** ~$300 - $600/mês.

### Nível 2: 10k Tenants (Crescimento Acelerado)
- **Perfil:** ~500,000 interações de IA/dia. Picos de tráfego (Webhooks e Campanhas B2B).
- **Infraestrutura Core:**
  - **ECS Fargate:** Auto-scaling de 10 a 30 containers distribuídos. Uso de pacotes mais pesados pode justificar ECS em instâncias EC2 otimizadas.
  - **Banco de Dados:** RDS PostgreSQL (db.m6g.2xlarge ou db.r6g.xlarge). Necessidade OBRIGATÓRIA de PgBouncer / RDS Proxy e, no mínimo, 1 Read Replica.
  - **Filas:** SQS com múltiplas filas (Alta vs Baixa Prioridade) / Celery intensivo.
- **Gargalos Previstos:** Conexões ativas no banco, latência de filas assíncronas, limites rate de APIs externas (Stripe, OpenAI).
- **Custos AWS Estimados:** ~$2,500 - $5,000/mês.

### Nível 3: 100k Tenants (Escala Enterprise / SaaS Massivo)
- **Perfil:** ~5,000,000 interações de IA/dia. Arquitetura distribuída complexa.
- **Infraestrutura Core:**
  - **Migração:** Migração de Fargate puro para Kubernetes (Amazon EKS) para controle granular de bin-packing e custos de EC2 (Spot Instances para workers tolerantes a falha).
  - **Banco de Dados:** Sharding (particionamento do banco de dados por Tenant ID) ou adoção do Amazon Aurora Serverless V2.
  - **IA:** Modelos LLM dedicados hospedados internamente (vLLM em GPU EC2 instances) para reduzir o custo astronômico por token de APIs externas B2B.
- **Gargalos Previstos:** Complexidade operacional, custo de Data Transfer (Egress), gerenciamento de estado global (Multi-Region Active-Active).
- **Custos AWS Estimados:** > $20,000/mês.
