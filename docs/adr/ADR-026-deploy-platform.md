# ADR-026: Plataforma de deploy — Railway vs Fly vs ECS vs K8s

## Status
Proposto

## Contexto
Precisamos escolher uma plataforma de deploy para a infraestrutura do BirthHub 360, capaz de rodar os agentes e serviços backend. As opções consideradas são Railway, Fly.io, AWS ECS e Kubernetes (K8s).

## Decisão
A plataforma escolhida é **AWS ECS**.

## Justificativa
1. **Curva de aprendizado e Gerenciamento:** K8s adiciona uma grande complexidade operacional e overhead de manutenção. Fly.io e Railway são ótimos para projetos menores, mas não oferecem o nível de controle, integração de segurança e conformidade (compliance) necessários para uma plataforma SaaS empresarial como o BirthHub 360.
2. **Escalabilidade e Confiabilidade:** ECS oferece escalabilidade robusta, integração nativa com o ecossistema AWS (RDS, ElastiCache, Secrets Manager, WAF, CloudWatch) que já pode ser adotado ou planejado na arquitetura.
3. **Custos:** O custo do ECS com Fargate permite um controle granular pagando pelo uso exato dos recursos, sem necessidade de gerenciar o underlying cluster como no EC2 ou a control plane paga como no EKS (K8s).

## Consequências
- Foco em templates de CloudFormation/Terraform para deploy no ECS.
- Dependência do ecossistema da AWS.
