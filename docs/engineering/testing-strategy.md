# Estratégia de Testes

Seguimos o padrão da Pirâmide de Testes:
- **Testes Unitários:** Base. Regras de negócio, cálculos, parsers, ferramentas LangGraph isoladas. Cobertura alvo: > 80%.
- **Testes de Integração:** Interação entre Banco, API e Agentes. Foco nos endpoints cruciais. Cobertura alvo: > 60%.
- **Testes E2E (Playwright):** Fluxos críticos de usuário (Login, Publicação no Marketplace, Assinatura de plano). Menor volume, maior valor.
