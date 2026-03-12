# Policy de Upgrade Forçado e Degradação

Quando a quota (armazenamento, execuções de agentes) atinge 90%, notificação automática é disparada ao owner.
Ao alcançar 100% no modelo Flat-Rate Estrito (Starter), a aplicação degrada as requisições em background e responde `429 Too Many Requests` informando limite mensal atingido. Nenhuma cobrança fantasma.
No modelo Overage (Pro), o limite contínua fluindo livre, mas a fatura anexa o valor unitário e avisa a cada marco ultrapassado (R$100, R$500).
