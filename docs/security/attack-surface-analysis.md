# Análise de Superfície de Ataque: Evolução

## Ciclo 1 vs Ciclo 8

A arquitetura e as funcionalidades do BirthHub 360 evoluíram significativamente, o que inevitavelmente expandiu a superfície de ataque.

### O Que Mudou (Ciclo 1: MVP Monolítico)
- **Infra:** Banco de dados simples, backend monolítico, frontend básico.
- **Autenticação:** Login simples por e-mail e senha.
- **Funcionalidades:** Agentes básicos com ferramentas limitadas, apenas interações de chat de texto.

### A Superfície de Ataque Atual (Ciclo 8: B2B Multi-Tenant, Microserviços, Múltiplos Agentes)
A complexidade adicionou novos vetores que precisam de defesas em profundidade:
1. **Multi-Tenancy (Isolamento de Dados):** O risco de vazamento de dados de uma agência para outra (IDOR) é muito maior agora, exigindo Row-Level Security e validações estritas em cada endpoint da API.
2. **Integrações de Terceiros (Webhooks e APIs):** A integração com Stripe (Billing), CRMs e canais sociais introduz o risco de payloads não confiáveis (SSRF, injeção) ou falhas na validação de origem (Spoofing).
3. **Complexidade dos Agentes (Tool Calling):** Os agentes (Pre-vendas, Financeiro) agora têm permissões para ler e escrever dados, ou interagir com o ambiente (tools). Uma injeção de prompt bem-sucedida pode levar à execução de comandos maliciosos ou manipulação indevida de faturamento.
4. **Infraestrutura Desacoplada (Filas e Filas):** Mensagens entre o API Gateway e o Orchestrator via filas (RabbitMQ/SQS) precisam de autenticação, sob risco de injeção de mensagens forjadas (Message Tampering).

## Conclusão
A superfície cresceu de um risco focado em acessos web padrão para ameaças complexas envolvendo LLMs e integrações B2B. O foco de segurança deslocou-se do WAF/Firewall (básico) para a validação estrita de lógica de negócio (RBAC) e segurança de modelos de IA.
