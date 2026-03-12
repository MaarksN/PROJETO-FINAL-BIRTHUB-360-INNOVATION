# Checklist de Compliance e Segurança (Integração Stripe)

O BirthHub360 utiliza o **Stripe Elements / Checkout** para coletar dados de pagamento. Isso minimiza nossa carga regulatória em relação ao **PCI DSS (Payment Card Industry Data Security Standard)**, transferindo a maior parte das obrigações de infraestrutura de dados para o Stripe. No entanto, para qualificar para o SAQ A (Self-Assessment Questionnaire A), ainda precisamos cumprir determinados requisitos rigorosos.

Este checklist deve ser validado pelos responsáveis de infraestrutura e segurança da informação a cada deploy de mudanças nas telas de faturamento (Billing UI).

## 1. Tratamento de Dados de Cartão (Proibição Total)
O servidor e o banco de dados do BirthHub360 **NUNCA** devem manipular números reais de cartões de crédito.

- [ ] **Integração Exclusiva:** Apenas elementos do Stripe (`stripe.js`, `Elements` ou redirecionamento para `Checkout`) coletam o número do cartão (PAN), data de expiração ou CVC.
- [ ] **Ausência de Campos Nativos:** Nenhum `<input type="text">` criado pela aplicação armazena, intercepta ou transmite PAN, CVV, nem mesmo para validadores frontend.
- [ ] **Tokenização:** O back-end recebe apenas o `PaymentMethod ID` (ex: `pm_1Hh...`) ou o `Customer ID` (ex: `cus_xyz...`) para referenciar métodos de pagamento.
- [ ] **Auditoria de Logs:** Garantir que bibliotecas de log do backend (Winston, Pino, etc.) ou do frontend (Sentry) não capturam ou vazam, por engano, dados confidenciais do payload que vai para a API do Stripe (como senhas ou CVC).

## 2. Segurança da Página de Faturamento (Hosting)
Como a página de Checkout será hospedada em nosso domínio e injeta o iframe do Stripe (SAQ A-EP ou SAQ A dependendo da implementação), a segurança de toda a página é vital.

- [ ] **HTTPS e TLS 1.2+:** A página onde os elementos do Stripe são exibidos deve ser estritamente servida via HTTPS usando criptografia forte (TLS 1.2 mínimo exigido pelo Stripe).
- [ ] **HSTS (HTTP Strict Transport Security):** A política HSTS deve estar ativada nos cabeçalhos HTTP do servidor web.
- [ ] **Proteção contra Cross-Site Scripting (XSS):** Implementar um Content Security Policy (CSP) forte, autorizando explicitamente os scripts do Stripe: `script-src 'self' https://js.stripe.com; frame-src 'self' https://js.stripe.com https://hooks.stripe.com;`.

## 3. Gestão de Contas e Acessos
A dashboard do Stripe e o controle de chaves da API exigem proteção extra.

- [ ] **Separação de Chaves:** As chaves de Teste (`pk_test_...`, `sk_test_...`) e de Produção (`pk_live_...`, `sk_live_...`) nunca devem ser trocadas ou comitadas em código (`.env.example` sem valores e varreduras de repositório configuradas).
- [ ] **Autenticação em Duas Etapas (2FA):** Todos os usuários (desenvolvedores, financeiro e suporte) com acesso ao painel do Stripe do BirthHub360 devem ter MFA habilitado.
- [ ] **Segregação de Funções (RBAC):** Restringir quem pode emitir reembolsos, visualizar relatórios completos ou exportar faturamento via papéis granulares na dashboard do Stripe.

## 4. Atualização e Resposta a Incidentes

- [ ] **Política de Patching:** O servidor web, o framework (Next.js/React) e as dependências (via dependabot) devem ser atualizados regularmente para mitigar vulnerabilidades que possam comprometer a sessão do navegador onde o `stripe.js` roda.
- [ ] **Monitoramento Contínuo:** Configurar alertas (Cloud Logging/Sentry) caso ocorram anomalias nas taxas de erro de cartões, recusas atípicas ou suspeita de "Carding" (ataques onde fraudadores testam cartões roubados em série numa mesma conta).
