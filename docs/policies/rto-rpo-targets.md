# Metas de RTO e RPO (BirthHub 360)

## Objetivos (SLAs Internos de Recuperação)
1. **Dados Críticos (Banco de Dados Relacional - Tenants, Billing, Auth)**
   - **RPO (Recovery Point Objective):** < 1 hora (limite tolerado de perda de transações passadas). Implementado via AWS RDS Point-In-Time Recovery e transações sincronizadas (Multi-AZ).
   - **RTO (Recovery Time Objective):** < 4 horas (tempo máximo que o sistema pode ficar indisponível aguardando restore).

2. **Logs e Dados Analíticos (Eventos do Sistema, Auditorias)**
   - **RPO:** < 24 horas (eventos passados recentes que podem ser perdidos sem corromper transações principais, mas afetando auditorias temporárias).
   - **RTO:** < 8 horas (reconstrução do stack de logs pode ser postergada em relação ao banco core).

## Justificativa
Garante a operação sustentável e a confiabilidade de um SaaS para agências (Business-to-Business) onde dados dos clientes (tenants) e configurações dos agentes de IA são o ativo central.
