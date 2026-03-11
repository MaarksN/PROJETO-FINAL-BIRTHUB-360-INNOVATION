# Análise de Risco de Downgrade

Quando um cliente decide realizar o downgrade (por exemplo, de Scale para Growth), o sistema precisa tratar as discrepâncias de limites entre o plano antigo e o novo. Se não forem tratadas, o cliente usufruirá de serviços ou capacidade acima do plano reduzido, ou perderá dados de forma abrupta sem possibilidade de backup.

## Cenários de Risco

### 1. Limite de Usuários (Seats) Excedido
* **Descrição:** Cliente de um plano maior (até 25 usuários) faz downgrade para um plano menor (até 10 usuários), restando 15 usuários acima do limite.
* **Mitigação:**
    1. O downgrade não desativa usuários automaticamente.
    2. O acesso para os usuários excedentes é suspenso (status `over_limit_suspended`). O administrador precisa escolher manualmente quais usuários manter ativos. Se não o fizer em um prazo determinado (ex: 7 dias), a suspensão é aplicada por ondem de inatividade.

### 2. Franquia de IA / Interações Estourada
* **Descrição:** O downgrade de plano altera o limite de consumo de IA e automações para o mês seguinte, ou projeta o overage (uso extra) imediatamente.
* **Mitigação:**
    1. O downgrade e o novo limite de uso só entram em vigor no final do ciclo de cobrança (fatura) atual, a menos que o downgrade seja imediato (com pro-rata), caso em que o novo limite reduzido começa a vigorar.
    2. Se o cliente já consumiu acima da franquia do plano novo durante o mesmo mês do downgrade (em caso de downgrade imediato), o excesso é faturado na próxima fatura usando a taxa de *overage* aplicável. Recomenda-se aplicar downgrade apenas na renovação do ciclo (no fim do mês).

### 3. Retenção de Dados e Histórico
* **Descrição:** Um cliente que passa do plano Scale (36 meses) para Starter (3 meses) tem um histórico de dados anterior a 3 meses que não está mais acessível.
* **Mitigação:**
    1. Os dados mais antigos (além de 3 meses) não são deletados imediatamente por questões legais (LGPD/compliance), mas são arquivados ou bloqueados (*soft lock*) na interface.
    2. O cliente tem 30 dias de carência (Grace Period) para exportar os dados antigos. Após esse período, dados além da retenção do plano podem sofrer limpeza automatizada (purging).

### 4. Funcionalidades Perdidas
* **Descrição:** Relatórios avançados, agentes específicos (SDR, etc.), integrações complexas que existem apenas nos planos mais caros.
* **Mitigação:**
    1. A interface exibirá essas funcionalidades como "bloqueadas" ou "upgrade necessário". Automações que usam agentes desabilitados serão pausadas e um alerta será gerado no painel.

## Workflow Esperado do Downgrade

1. O cliente solicita o downgrade na interface.
2. O sistema verifica os conflitos (seats, features e storage).
3. O cliente visualiza a tela de confirmação detalhando:
   - Usuários que precisam ser suspensos.
   - Recursos que serão bloqueados (ex: Agente A, Integração B).
   - Dados que podem ser inacessíveis após 30 dias.
4. O cliente confirma e agenda o downgrade (efetivado no fim do ciclo atual, preferencialmente).