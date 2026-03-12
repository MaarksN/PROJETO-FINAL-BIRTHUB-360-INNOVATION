# Política de Packs Não Assinados por Plano de Assinatura

## 1. Contexto e Objetivo
Para manter um ecossistema seguro no BirthHub360, todos os Packs (agentes, ferramentas e workflows) distribuídos via Marketplace Público devem ser assinados digitalmente pela Autoridade Certificadora (CA) central do BirthHub360.
No entanto, os Tenants podem criar seus próprios packs *internos* para uso privado (ex: integração com sistemas legados próprios). Esses packs internos frequentemente não passam pelo processo de curadoria e assinatura pública do BirthHub360.

Esta política define como o Agente Orquestrador do Tenant (o software que executa os packs) lida com a tentativa de instalação e execução de **packs não assinados**, variando as restrições de acordo com o plano de assinatura do Tenant (Free, Pro, Enterprise). O objetivo é equilibrar a mitigação de risco de segurança (malware, exfiltração) com a flexibilidade necessária para desenvolvimento corporativo.

## 2. Política por Plano

A verificação de assinatura digital (Digital Signature Verification) ocorre em dois momentos críticos:
1.  **Momento da Instalação/Importação:** Quando o administrador do Tenant tenta adicionar um pack ao seu ambiente.
2.  **Momento da Execução (Runtime):** Imediatamente antes do Orquestrador carregar o código/prompt do pack na memória.

As regras de comportamento (Enforcement Mode) são as seguintes:

### 2.1. Plano Free (Modo "Strict Enforcement" - Bloqueio)
*   **Perfil de Risco:** Alta suscetibilidade a ataques de engenharia social, usuários com menor maturidade técnica em segurança da informação, e ambientes não monitorados por equipes de SecOps dedicadas.
*   **Política:** O Orquestrador do BirthHub360 opera no modo `strict`.
*   **Comportamento:**
    *   **Bloqueio Total:** É **terminantemente proibido** instalar ou executar qualquer pack que não contenha uma assinatura digital válida e emitida pelo BirthHub360.
    *   **Feedback ao Usuário:** A interface de administração exibirá um erro vermelho bloqueante: *"Falha de Segurança: Este pack não é assinado pelo BirthHub360 e não pode ser instalado no plano Free. Para proteção do seu ambiente, apenas pacotes verificados do Marketplace são permitidos."*
    *   **Desenvolvimento Local:** Tenants Free não podem criar e testar ferramentas customizadas (Python/Node) localmente sem submetê-las à verificação e assinatura pública.

### 2.2. Plano Pro (Modo "Warn/Audit" - Alerta)
*   **Perfil de Risco:** Organizações em crescimento, com times técnicos que necessitam criar automações internas, mas que ainda não possuem um SOC (Security Operations Center) completo para auditar todo o código customizado.
*   **Política:** O Orquestrador opera no modo `warn`.
*   **Comportamento:**
    *   **Permitido com Alerta Crítico:** A instalação de packs não assinados (ex: importação manual de um arquivo ZIP contendo um agente interno) é permitida, mas o administrador deve explicitamente consentir e contornar um aviso de segurança severo (similar ao *UAC do Windows* ou gatekeeper do macOS).
    *   **Experiência (UX):** Um modal de confirmação em tela cheia aparece: *"AVISO DE SEGURANÇA: Você está prestes a instalar código não assinado. O BirthHub360 NÃO verificou este pack contra códigos maliciosos ou vazamento de dados. Você assume total responsabilidade pela execução deste pacote."* O administrador deve digitar a palavra "CONFIRMAR" para prosseguir.
    *   **Marcador Visual:** Packs não assinados instalados terão uma tarja amarela/laranja permanente ("Não Verificado/Interno") na listagem do painel do Tenant.

### 2.3. Plano Enterprise (Modo "Custom Enforcement" - Customizado)
*   **Perfil de Risco:** Grandes corporações com requisitos rígidos de conformidade (Compliance, LGPD/GDPR), equipes dedicadas de CISO/SecOps, e necessidades complexas de CI/CD para automações de IA internas (desenvolvimento de ferramentas proprietárias massivas).
*   **Política:** O administrador global do Tenant (SecOps) possui controle granular sobre a política de verificação de assinatura (via painel de governança ou API).
*   **Comportamento Customizável:**
    *   O Tenant pode optar por replicar o modo `strict` (Bloquear todos) ou o modo `warn` (Alertar).
    *   **BYOK (Bring Your Own Key) / Custom CA:** (Recurso Exclusivo) O Tenant Enterprise pode fazer upload de sua própria chave pública (CA Interna Corporativa) para o BirthHub360.
    *   **Aprovação Dupla (Dual Trust):** O Orquestrador passa a aceitar packs que possuam **ou** a assinatura do BirthHub360 (para packs públicos do Marketplace) **ou** a assinatura da CA Interna do Tenant (para ferramentas e agentes proprietários desenvolvidos in-house).
    *   **Bloqueio Silencioso ("Silent Block"):** Se um desenvolvedor do Tenant tentar rodar um script/ferramenta não assinada por nenhuma das duas entidades confiáveis, a execução falha silenciosamente e gera um alerta no SIEM corporativo via webhook (sem alertar o usuário final), indicando uma possível violação de política de CI/CD ("Shadow IT").

## 3. Gestão e Monitoramento de Tentativas (Telemetria)
Independentemente do plano, o Agente Orquestrador loga toda e qualquer tentativa de (1) verificação criptográfica falha, (2) instalação de pacotes não assinados e (3) rejeição de pacotes. Essa telemetria é enviada de forma anônima para a nuvem do BirthHub360 para detecção precoce de anomalias (ex: um surto de pacotes maliciosos tentando burlar a verificação em contas Free) e para os logs de auditoria dos Tenants Pro/Enterprise.
