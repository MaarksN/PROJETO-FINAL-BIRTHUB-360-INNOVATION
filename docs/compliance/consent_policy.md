# Política de Consentimento (Opt-In / Opt-Out)

## 1. Visão Geral (LGPD)
O BirthHub360 é uma plataforma B2B de Inteligência Artificial. Processamos dados pessoais principalmente sob a base legal de "Execução de Contrato" e "Legítimo Interesse" dos nossos clientes corporativos (Tenants).
No entanto, quando atuamos como Controladores (coletando e-mails para marketing, cookies não essenciais de visitantes, ou uso de *feedback* explícito de usuários para treinar classificadores internos), **devemos obter o consentimento livre, informado e inequívoco** (Art. 5º, XII, e Art. 8º da LGPD).

## 2. Casos que Requerem Consentimento Explícito

1.  **Marketing Direto / Newsletters:**
    *   **Ação:** Envio de e-mails sobre novos pacotes no Marketplace, atualizações de versão ou webinars do BirthHub360 para contatos que não são clientes pagantes ativos (Leads).
    *   **Como Coletar:** Checkbox vazio (desmarcado por padrão - `opt-in`) em formulários de landing pages ("Desejo receber novidades do BirthHub360"). A assinatura digital (timestamp e IP do clique) é registrada no banco de dados.
    *   **Proibido:** Pré-marcação de checkboxes (Opt-out disfarçado) ou atrelamento da assinatura do e-mail ao uso essencial da plataforma (Consentimento condicionado).

2.  **Cookies Não Essenciais (Analytics/Marketing):**
    *   **Ação:** Uso de ferramentas como Google Analytics, Meta Pixel ou Hotjar no portal público (`www.birthhub360.com`) ou no Marketplace deslogado. (Atenção: A interface interna logada dos Tenants usa rastreamento anônimo e restrito baseado no Legítimo Interesse de segurança).
    *   **Como Coletar:** Banner de Cookies granulado na primeira visita do usuário ("Aceitar Todos", "Rejeitar Todos", "Gerenciar Preferências").
    *   **Proibido:** Carregar os scripts de rastreamento *antes* do usuário clicar em "Aceitar" (Tracking "por inércia").

3.  **Melhoria Contínua / Coleta de Feedback de Output (Human-in-the-Loop):**
    *   **Ação:** Quando um Agente de IA gera uma resposta (ex: um resumo de contrato), a plataforma exibe botões "👍 Gostei" / "👎 Não Gostei" (RLHF).
    *   **Como Coletar:** Os botões são opcionais. Ao clicar, o usuário está consentindo que *aquela interação específica* (prompt + resposta) seja salva para auditoria de qualidade.
    *   **Proibido:** O BirthHub360 não pode forçar os Tenants a doarem seus dados para "treinar os modelos globais do BirthHub360" como condição de uso do serviço. O Opt-In de Data Sharing para melhorias de IA deve ser uma opção corporativa separada, desligada por padrão (Zero Data Retention).

## 3. Gestão e Revogação do Consentimento (Opt-Out)

A LGPD (Art. 8º, § 5º) exige que o consentimento possa ser revogado a qualquer momento mediante manifestação expressa do titular, por procedimento gratuito e facilitado.

### 3.1. Facilidade de Revogação
1.  **E-mails Marketing:** Todo e-mail enviado pelo sistema de automação de marketing do BirthHub360 (ex: SendGrid/Mailchimp) *deve obrigatoriamente* conter um link funcional, no rodapé, de "Descadastre-se" (Unsubscribe). O clique neste link processa a remoção imediata da lista sem necessidade de login.
2.  **Cookies:** O portal deve manter um pequeno botão flutuante ("Gerenciar Privacidade") para que o usuário possa reabrir o painel de cookies a qualquer momento e mudar a opção de "Aceito" para "Rejeito".
3.  **Feedback de IA:** Um usuário do Tenant pode solicitar ao seu administrador que exclua as interações de "👍 / 👎" do histórico da conta, caso se arrependa.

### 3.2. Prova do Consentimento (Registro de Auditoria)
O Controlador (BirthHub360) tem o ônus da prova de que obteve o consentimento de forma legal (Art. 8º, § 2º).
*   **O que o BirthHub360 armazena:** Tabela `consent_logs` com os campos `user_id/email`, `consent_type` (ex: "MARKETING", "COOKIES_ANALYTICS"), `timestamp_granted`, `timestamp_revoked` (se houver), `ip_address`, e a versão exata do "Termo de Privacidade" que estava na tela quando ele clicou no botão de aceito.
*   **Uso:** Em caso de auditoria da ANPD (Autoridade Nacional de Proteção de Dados), este banco de dados imutável servirá como evidência de conformidade da empresa frente a reclamações de *Spam*.
