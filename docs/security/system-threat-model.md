# Modelo de Ameaça do Sistema (Threat Model)

## Superfície de Ataque
- Endpoints de API públicos (Autenticação, Webhooks do Stripe).
- Marketplace de Agentes (upload de packs maliciosos).
- Interface de Usuário (XSS).

## Ativos Críticos
- Dados Pessoais (PII) dos usuários e clientes.
- Chaves de faturamento do Stripe.
- Dados de saúde transacionados pelos agentes.

## Vetores e Mitigações
- **Vetor:** Execução maliciosa em Agentes Python.
- **Mitigação:** Executar agentes em sandboxes isoladas, sem acesso irrestrito à rede. Assinatura de manifestos de packs.
