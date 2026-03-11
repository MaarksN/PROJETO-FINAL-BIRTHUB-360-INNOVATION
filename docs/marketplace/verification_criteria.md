# Critérios de Verificação: O que o Badge 'Verificado BirthHub' Garante

## 1. Propósito do Badge
O badge "Verificado BirthHub" (selo de verificação) é concedido a Packs (agentes, ferramentas, workflows) publicados no Marketplace Público que passaram por um rigoroso processo de auditoria de segurança, privacidade e qualidade conduzido pela equipe interna do BirthHub360.

O objetivo do badge é fornecer aos Tenants (especialmente corporativos e Enterprise) um alto nível de confiança de que o pack é seguro para ser instalado e utilizado com dados sensíveis de seus próprios usuários finais, mitigando riscos de segurança e compliance.

## 2. O que o Badge Garante

A presença do badge "Verificado BirthHub" em um pack significa que o BirthHub360 atesta os seguintes pontos:

### 2.1. Segurança e Privacidade (Data Protection)
*   **Zero Exfiltração Oculta:** O código fonte das ferramentas customizadas do pack foi revisado manualmente (SAST avançado) e não contém mecanismos ocultos para enviar dados para servidores de terceiros não declarados.
*   **Transparência de Rede:** Todas as chamadas de rede (APIs externas) que o pack faz estão explicitamente documentadas e restritas aos domínios listados no manifesto aprovado.
*   **Princípio do Menor Privilégio:** O pack solicita e utiliza apenas as permissões e escopos estritamente necessários para realizar sua função principal. Não há acesso excessivo a APIs internas do BirthHub360.
*   **Tratamento de PII (LGPD):** Se o pack processa Dados Pessoais, ele o faz de maneira transparente, sem armazená-los indevidamente em logs próprios do criador ou transmiti-los para destinos não conformes.

### 2.2. Qualidade e Confiabilidade (Reliability)
*   **Ausência de Código Malicioso:** O pack está livre de malware, ransomware, cryptominers ou qualquer lógica destrutiva conhecida no momento da verificação.
*   **Desempenho Estável:** O pack foi testado sob carga simulada e não apresenta vazamentos de memória (memory leaks), loops infinitos (CPU spikes) ou consumo abusivo de tokens/recursos do sistema que poderiam degradar a performance de outros tenants.
*   **Tratamento de Erros Resiliente:** O pack lida adequadamente com falhas de APIs de terceiros (timeouts, erros 5xx) sem travar a aplicação ou expor stack traces sensíveis ao usuário final.

### 2.3. Transparência e Integridade do Prompt (Prompt Safety)
*   **Ausência de Prompt Injection Malicioso:** O System Prompt do pack foi auditado para garantir que não contém instruções ocultas (jailbreaks) projetadas para subverter os guardrails de segurança do LLM base (ex: forçar a geração de conteúdo de ódio, phishing ou bypassing de filtros).
*   **Alinhamento com a Descrição:** O comportamento real do agente/workflow corresponde fielmente à descrição e aos casos de uso anunciados na página do pack no Marketplace. Não há funcionalidades ocultas ou enganosas ("bait-and-switch").

## 3. O que o Badge NÃO Garante

É fundamental esclarecer as limitações da verificação para gerenciar as expectativas dos Tenants:

*   **Não garante perfeição do LLM:** O badge não impede alucinações ocasionais, imprecisões factuais ou respostas sub-ótimas inerentes ao uso de modelos de linguagem fundacionais.
*   **Não garante SLAs de APIs externas:** Se o pack depende de um serviço de terceiros (ex: API do Salesforce, OpenAI), o BirthHub360 não garante a disponibilidade (uptime) ou a latência desse serviço externo.
*   **Não é uma apólice de seguro contra vulnerabilidades Zero-Day:** A verificação atesta a segurança com base no conhecimento e nas ferramentas disponíveis no momento da auditoria. Novas vulnerabilidades descobertas nas bibliotecas subjacentes após a publicação não são cobertas retroativamente pelo selo original.
*   **Não garante adequação a regras de negócio específicas:** O pack é seguro e funcional no contexto geral, mas o Tenant instalador ainda deve avaliar se ele atende aos requisitos específicos de conformidade do *seu* setor (ex: HIPAA na saúde, PCI-DSS para cartões).

## 4. Processo de Obtenção e Manutenção

1.  **Auditoria Rigorosa:** Para obter o badge, o pack não passa apenas pela análise automatizada padrão (SLA 2h). Ele é submetido a uma fila de revisão aprofundada por engenheiros de segurança do BirthHub360 (SLA 5 dias úteis), que inclui análise estática manual, testes de penetração limitados na sandbox e revisão de código linha a linha.
2.  **Validade Versional:** O badge "Verificado" é atrelado a uma **versão específica** do pack (seu hash imutável/manifest as a code).
3.  **Perda do Badge na Atualização:** Se o Criador do pack enviar uma nova versão com alterações no código das ferramentas, nas dependências ou no System Prompt principal, a nova versão **perde** o badge "Verificado" temporariamente.
4.  **Re-verificação ("Fast-Track"):** Atualizações de packs já verificados entram em uma fila prioritária ("fast-track") para re-auditoria apenas do *diff* (diferença entre versões), visando restaurar o badge rapidamente.

## 5. Revogação do Badge
O BirthHub360 reserva-se o direito de revogar o badge "Verificado", suspender ou remover o pack imediatamente se, após a publicação, for descoberto:

*   Violação de qualquer critério de segurança (ex: exfiltração de dados descoberta via telemetria contínua).
*   Taxa de erro excessiva (>15%) ou impacto negativo na performance da plataforma reportada pelo monitoramento de SLO.
*   Alteração maliciosa do comportamento de APIs externas de terceiros das quais o pack depende.
*   Reclamações fundamentadas e consistentes de múltiplos Tenants sobre o comportamento do pack.
