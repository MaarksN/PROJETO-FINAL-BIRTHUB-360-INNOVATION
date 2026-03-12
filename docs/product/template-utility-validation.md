# Validação de Utilidade de Templates (Templates Reais)

## Como Evitar o Efeito "Hello World"
Templates de Agentes genéricos como "Seja um Assistente Útil" criam a síndrome da página em branco, onde o Gestor B2B precisa perder horas refinando o comportamento e a base de conhecimento. A Plataforma BirthHub 360 deve oferecer templates hyper-nichados.

## Template: Agente Imobiliário (SDR de Lançamento)
- **Caso de Uso (Empresa Fictícia):** *Construtora XYZ Lançamentos.* O lead entra no site ou clica num anúncio de Facebook Ads do "Edifício Bella Vista". Ele não quer baixar e ler um PDF longo, ele quer saber o valor e a planta. O corretor humano demora 4 horas para responder.
- **Utilidade Real do Agente:** Em vez de pedir e-mail e mandar o PDF, o Agente responde instantaneamente: "Oi! Sou a assistente da XYZ. O Bella Vista tem unidades de 2 e 3 quartos. Está buscando algo para morar ou investir?".
- **Teste de "Plug & Play" (Validação):** O Template vem pré-configurado com as "Tools":
   1. Buscar Planta por Quartos (API fictícia de CRM).
   2. Agendar Visita Decorado (Calendly).
   3. Transferir para Corretor se o Lead falar "Financiamento" ou "Visita".
- **Por que este template foi aprovado no catálogo:** Cobre um funil de vendas complexo que afeta 10.000 corretoras, resolvendo a latência (dor B2B real).

## Template: Suporte SaaS Nível 1 (Triagem)
- **Caso de Uso:** *TechFin ERP.* O usuário de um software B2B está travado numa tela com a mensagem "Erro 54 - NFS-e não autorizada".
- **Utilidade Real do Agente:** Entender a mensagem, buscar no manual da TechFin (Base de Conhecimento RAG), explicar como arrumar o certificado A1. Se falhar, abrir o Ticket com a tag correta ("Fiscal - Urgente") via Zendesk.
