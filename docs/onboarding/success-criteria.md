# Critérios de Sucesso do Onboarding

## Objetivo
Definir as metas quantitativas para considerar o fluxo de Onboarding um sucesso, segmentado pelos tipos de usuários (Personas) do BirthHub 360.

## Métricas Alvo (Completion Rate)

### 1. Persona: Gestor / Executivo (Non-Technical)
- **Perfil:** Dono de Agência, Diretor de Vendas. Busca automação de processos sem querer codificar ou entender embeddings.
- **Métrica Chave:** Taxa de conclusão do "Setup Expresso" (Uso de templates pré-construídos e upload de site URL).
- **Taxa de Completude Alvo:** **80%**. (O caminho deve ser extremamente fluido, à prova de erros).
- **TTA (Time-to-Aha) Alvo:** < 5 minutos.

### 2. Persona: Desenvolvedor / Integrador (Technical)
- **Perfil:** CTO da Agência, Engenheiro de Integrações. Quer controle sobre prompts complexos, Webhooks, RAG tunning.
- **Métrica Chave:** Taxa de configuração de Webhooks, testes de chamadas de ferramentas (Tool calling) no simulador avançado.
- **Taxa de Completude Alvo:** **65%**. (Taxa menor é aceitável pois a integração com sistemas legados da agência pode demandar horas e interrupções normais do trabalho).
- **TTA (Time-to-Aha) Alvo:** < 30 minutos (Considerando o tempo para ler a documentação da API).

### 3. Persona: Operador (Inside Sales / Atendimento)
- **Perfil:** Usuário final que interagirá com o painel gerado pela plataforma para intervir nas conversas da IA (Human Handoff).
- **Métrica Chave:** Taxa de login inicial a partir do convite do Gestor, e realização da primeira "intervenção humana" em um chat em andamento.
- **Taxa de Completude Alvo:** **90%**. (O painel deve ser tão simples quanto o WhatsApp Web).
- **TTA (Time-to-Aha) Alvo:** < 2 minutos.

## Acompanhamento Mensal
Estes critérios serão monitorados ativamente via Datadog RUM (Real User Monitoring) ou Mixpanel. Quedas nestas taxas de completude disparam alertas para a equipe de UX e Customer Success.
