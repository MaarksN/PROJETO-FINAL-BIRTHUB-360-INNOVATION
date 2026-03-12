# Risco Legal na Retenção de Dados de Inadimplentes

Quando uma empresa cancela seu contrato ou é suspensa permanentemente por inadimplência (falta de pagamento) no BirthHub360, geramos uma situação de "Lock-out" dos dados do cliente no CRM ou pipelines de venda gerenciados pelos nossos Agentes. Lidar incorretamente com esses dados acarreta riscos perante as leis de proteção de dados (como LGPD no Brasil ou GDPR na Europa).

## 1. O Risco do "Sequestro" de Dados (Data Hostage)
Se o BirthHub360 impedir *completamente* um cliente inadimplente de exportar seus dados primários (contatos, leads inseridos por ele), isso pode ser interpretado como "sequestro" de informações, contrariando o princípio da Portabilidade e do Livre Acesso (Art. 18 da LGPD).

**Mitigação Implementada:**
- **Direito de Exportação Restrito:** O painel continuará permitindo que o administrador da conta suspensa/cancelada realize login exclusivo para baixar um arquivo CSV/JSON dos dados que *ele* inseriu na plataforma (Contatos e Leads básicos), desde que a solicitação seja feita dentro de um prazo razoável (ex: até 30 ou 60 dias do cancelamento). Funcionalidades nativas dos planos pagos, enriquecimento de leads pelos nossos Agentes e fluxos criados no BirthHub360 não precisam ser exportáveis gratuitamente.

## 2. Retenção Indevida Após Suspensão
Reter PII (Informações Pessoais Identificáveis) indefinidamente após o término do vínculo contratual viola o princípio da Necessidade (Art. 6º, III, da LGPD). O cliente, mesmo devedor, tem o direito ao esquecimento e à exclusão dos seus dados (quando a finalidade do processamento encerra).

**Políticas Pós-Cancelamento:**
- O BirthHub360 deve iniciar o processo de exclusão (*Purging*) de dados comportamentais (logs, e-mails disparados, anotações de leads) das contas canceladas após um período seguro de carência (ex: 90 dias após a inadimplência terminal).

## 3. Retenção Legal Obrigatória (Obrigações Fiscais e Cobrança)
Mesmo que um cliente excluído exerça seu direito de apagar os dados da plataforma, certos registros não podem e não devem ser apagados. O Art. 16 da LGPD prevê exceções para "cumprimento de obrigação legal ou regulatória pelo controlador" e para "exercício regular de direitos em processo judicial, administrativo ou arbitral".

**Quais dados NÓS Reteremos (mesmo com exclusão do Tenant):**
- **Histórico de Faturas e Notas Fiscais:** Detalhes de pagamento (nome do cliente pagador, CNPJ, valores, e as invoices do Stripe/FocusNFe) serão armazenados pelos prazos legais exigidos pelo fisco (geralmente 5 a 10 anos dependendo da jurisdição fiscal).
- **Provas de Consentimento e Fraude:** Logs do momento em que o cliente aceitou os Termos de Serviço ou dados associados a disputas (*Chargebacks* e logs anti-fraude IP) são retidos como defesa contra processos futuros. Nenhuma IA tem acesso a esses arquivos após o encerramento da conta principal.