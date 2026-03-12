# Template de Resposta a Solicitação de Titular (DSAR - LGPD Art. 18)

## 1. Objetivo
Este documento serve como modelo (Template) para a equipe de Privacidade / DPO do BirthHub360 responder formalmente às solicitações de Data Subject Access Request (DSAR) exercidas pelos Titulares de Dados Pessoais, garantindo a conformidade com o Artigo 18 da Lei Geral de Proteção de Dados (LGPD).

## 2. Processamento da Solicitação (Regras de Triagem)

O BirthHub360 atua na maioria dos casos como **Operador** dos dados. Quando um titular (ex: cliente do nosso Tenant) solicita acesso ou exclusão, o procedimento correto, pela LGPD, é:
1.  **Identificar o Controlador:** Confirmar se o e-mail ou CPF pertence a um Tenant direto nosso ou se está no banco de dados de um dos nossos clientes corporativos.
2.  **Encaminhar (Se Operador):** Se somos apenas o Operador do fluxo de IA, devemos informar o titular que a solicitação deve ser feita à empresa (Controlador) com a qual ele se relacionou originalmente.
3.  **Responder (Se Controlador):** Se o titular for o próprio administrador do Tenant, um desenvolvedor parceiro ou alguém que assina a newsletter do BirthHub360, nós processamos o pedido. O prazo máximo legal é de **15 dias corridos** para respostas completas (Art. 19, II).

## 3. Templates de E-mail

### 3.1. Confirmação de Recebimento (Imediato - D+0)
**Assunto:** Recebemos sua Solicitação de Direitos de Titular (LGPD) - Protocolo #[NUMERO_TICKET]

> Prezado(a) [Nome do Titular],
>
> Confirmamos o recebimento da sua solicitação referente ao exercício dos seus direitos previstos na Lei Geral de Proteção de Dados (LGPD - Lei 13.709/18).
> Seu pedido foi registrado sob o protocolo **#[NUMERO_TICKET]**.
>
> Nossa equipe de Privacidade analisará a sua solicitação. Caso precisemos confirmar sua identidade por motivos de segurança (para evitar que terceiros acessem seus dados de forma fraudulenta), entraremos em contato.
>
> O prazo legal para resposta completa é de até 15 dias.
>
> Atenciosamente,
> Encarregado pelo Tratamento de Dados (DPO) - BirthHub360
> [e-mail dpo@birthhub360.com]

### 3.2. Resposta: Nascimento como Controlador (Confirmação e Acesso - D+15)
**Assunto:** Resposta à sua Solicitação de Dados - Protocolo #[NUMERO_TICKET]

> Prezado(a) [Nome do Titular],
>
> Em resposta à sua solicitação, informamos que o BirthHub360 **realiza o tratamento** de seus dados pessoais.
>
> **Origem e Finalidade:** Coletamos seus dados (Nome e E-mail) quando você se cadastrou em nossa plataforma como Administrador do Tenant [Nome da Empresa]. Utilizamos esses dados exclusivamente para gerenciar sua conta, emitir faturamento e garantir a segurança do seu acesso (Base legal: Execução de Contrato).
>
> Em anexo (ou através do link seguro abaixo, válido por 48 horas), você encontrará um relatório completo (.CSV/.JSON) contendo a cópia de todos os seus dados pessoais armazenados em nossos sistemas de controle.
>
> Compartilhamos seus dados apenas com a [Stripe] (para processamento de pagamentos) e a [AWS] (para hospedagem segura em nuvem). Nós não vendemos seus dados para terceiros.
>
> Caso deseje a exclusão, correção ou tenha qualquer outra dúvida, por favor, responda a este e-mail.
>
> Atenciosamente,
> DPO - BirthHub360

### 3.3. Resposta: BirthHub360 atua apenas como Operador (Encaminhamento)
**Assunto:** Informação sobre sua Solicitação de Dados - Protocolo #[NUMERO_TICKET]

> Prezado(a) [Nome do Titular],
>
> Recebemos seu pedido de [Exclusão / Acesso] aos seus dados pessoais.
>
> Após analisarmos nossos sistemas, identificamos que o e-mail/CPF informado não possui relação direta como cliente do BirthHub360 (Controlador). No entanto, verificamos que os dados podem estar sendo processados em nome de um dos nossos clientes empresariais (Tenants), que utilizam nossa infraestrutura de Inteligência Artificial.
>
> De acordo com o Art. 18 da LGPD, os direitos do titular devem ser exercidos perante o **Controlador** dos dados (a empresa para a qual você forneceu seus dados originalmente). O BirthHub360, como mero Operador tecnológico, não possui autoridade legal para excluir de forma autônoma os relatórios médicos, contratos ou logs inseridos pelos nossos clientes corporativos.
>
> **O que você deve fazer:** Solicitamos que você direcione este pedido diretamente à empresa (Controlador) com a qual você mantém relacionamento. Assim que recebermos a instrução legal deles, nossa plataforma possui ferramentas automatizadas para que eles (os Controladores) purguem todos os seus rastros de nossa nuvem instantaneamente.
>
> Atenciosamente,
> DPO - BirthHub360

### 3.4. Resposta: Pedido de Exclusão Atendido (Direito ao Esquecimento)
**Assunto:** Conclusão do seu Pedido de Exclusão de Dados - Protocolo #[NUMERO_TICKET]

> Prezado(a) [Nome do Titular],
>
> Informamos que seu pedido de exclusão de dados pessoais foi processado com sucesso.
>
> Sua conta de usuário no BirthHub360 foi permanentemente anonimizada/excluída, juntamente com todas as chaves de API associadas. Seu e-mail foi removido de nossas listas de comunicação.
>
> **Nota de Exceção (Art. 16, I da LGPD):** Mantivemos arquivadas, de forma isolada e segura, as informações estritamente necessárias aos registros de pagamento/faturamento (NF-e) gerados enquanto sua conta esteve ativa, para cumprimento de obrigações legais perante a Receita Federal, pelo prazo prescricional de 5 anos.
>
> Agradecemos o tempo que esteve conosco.
>
> Atenciosamente,
> DPO - BirthHub360
