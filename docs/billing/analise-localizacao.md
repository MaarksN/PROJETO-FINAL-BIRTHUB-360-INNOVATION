# Análise de Localização e Tributação de Pagamentos

O modelo de negócios do BirthHub360 é focado globalmente (SaaS), o que exige planejamento cuidadoso de faturamento, precificação local, moedas, compliance fiscal e LGPD.

## 1. Moedas e Preços Localizados
Para não dependermos puramente do câmbio volátil (que afeta vendas B2B se o dólar disparar num dia para clientes internacionais ou brasileiros com cartões locais), a precificação deve ser estática por região:

| Região   | Moeda Padrão | Impostos    | Exibição do Checkout |
|----------|--------------|-------------|----------------------|
| **Brasil**   | BRL (R$)     | Tributado via Nota Fiscal (ISS/PIS/COFINS incluídos na base) | Tabela local, sem flutuação do Dólar |
| **EUA**      | USD ($)      | Sales Tax (por estado via Stripe Tax)  | Tabela base (Dólar) |
| **Global**   | USD ($)      | Isenções (ou VAT) via Stripe Tax       | Tabela base convertida na transação (ou USD direto) |

- **Detecção:** O IP e o país da conta do usuário (`workspace.country`) determinam a moeda apresentada no checkout e o formato (ex: `1,000.00` vs `1.000,00`).

## 2. Emissão de Notas Fiscais (Invoicing & Tax Compliance)
Como operamos com serviços e licenciamento de software (SaaS):
- **Brasil:** Obrigatória a emissão de NFS-e (Nota Fiscal de Serviço Eletrônica) para cada transação faturada no mês. Integrar o webhook do Stripe (`invoice.payment_succeeded`) com um emissor como NFe.io, FocusNFe ou eNotas.
- **Internacional:** É gerada uma *Invoice* (Recibo Comercial) nativo do Stripe, contendo informações fiscais configuradas na conta Stripe (Tax ID da empresa operadora) e cobrando *VAT* ou *Sales Tax* apropriado se a empresa ultrapassar os limites (*nexus*) do país.

## 3. Conformidade com a LGPD e GDPR (Dados Financeiros)
O faturamento envolve a coleta de dados PII (Personally Identifiable Information) adicionais, como endereço, CPF/CNPJ, e e-mail do gestor financeiro:

- **Retenção de Dados:** Ao contrário de dados comportamentais do SaaS (que podem ser apagados pelo usuário em um downgrade), **dados de faturamento** devem ser retidos pelo prazo legal estipulado pelo fisco (geralmente 5 anos no Brasil, ou aplicável no domicílio da empresa emissora) mesmo se o cliente solicitar o *direito ao esquecimento* ou cancelar a conta. Esses dados ficam protegidos no Stripe e não são repassados ao motor de IA em hipótese alguma.
- **Consentimento:** A tela de faturamento precisa ter o "Opt-in" dos Termos de Faturamento e Privacidade, deixando explícito que dados transacionais serão compartilhados com o processador (Stripe) e os órgãos fiscais governamentais responsáveis pela tributação local (ex: Receita Federal, SEFAZ municipal).
- **Acesso Limitado:** Somente os agentes financeiros (como o `Agente Financeiro`) têm autorização ou ferramentas que extraem métricas (ex: MMR) usando hashes pseudônimos (IDs de conta), nunca expondo os cartões ou CPFs.