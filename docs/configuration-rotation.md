# Processo de Rotação de Configuração (Zero Downtime)

Mudar uma variável de ambiente ou segredo crítico (Secrets Vault) num ambiente de produção ativo não pode resultar em quedas de request (HTTP 5xx) ou parada na fila de jobs do BullMQ. O BirthHub 360 exige a prática de **Blue/Green Deployment na Camada de Configuração**.

## Cenários de Rotação

1. **Comprometimento (Spill)**: Quando uma credencial vazou ou há suspeita, a substituição é tratada como incidente (Urgência) e ocorre em regime de força tarefa.
2. **Rotação Periódica / Rotina Administrativa**: Por compliance, chaves mestras e senhas de banco devem expirar após X meses e ser trocadas voluntariamente pelas partes da engenharia de SRE.

## O Desafio

Diferentes ferramentas tratam a re-leitura de configs de formas distintas. Uma aplicação Node.js / Python que lê as variáveis no boot só atualizará seus valores de configuração internos após um `restart` forçado do servidor. Modificar o Vault e apagar o container correndo pode jogar conexões ativas do cliente fora, ou processar webhooks com falhas enquanto as instâncias sobem e caem sem orquestração.

## Passo a Passo da Rotação sem Downtime (The Overlap Method)

O método principal é manter temporariamente DUAS chaves válidas na origem, subir o código novo com a chave nova, e então derrubar a chave velha.

### 1. Preparação (Novo Valor de Secret)

- **Não apague a chave atual.** Crie uma nova versão do Segredo (ex: `OPENAI_API_KEY_V2`) ou gere um novo password no Banco de Dados.
- Se a integração suporta Multi-Active Keys (como a Stripe, que aceita chaves Rolled/Secondary), gere a Chave Secundária.

### 2. Atualização do Secret Store do lane canônico

- Atualize a `Chave V2` no cofre corporativo e/ou no GitHub Environment Secret correspondente.
- Propague a nova variável para o serviço canônico no Render sem remover imediatamente a credencial anterior.

### 3. Deploy Gradual ("Rolling Update")

- Dispare o workflow `CD` ou o deploy controlado aprovado do serviço no Render.
- A nova revisão sobe consumindo a versão atualizada dos segredos sem invalidar automaticamente a revisão anterior.
- **Sobreposição controlada**: o tráfego novo passa para a revisão atualizada, enquanto a revisão anterior permanece disponível para rollback imediato caso a autenticação falhe.

### 4. Teste e Monitoramento de Aceitação (O "Soak Time")

- As novas instâncias começam a responder chamadas API ou a processar a Fila usando a Chave V2.
- O engenheiro On-Call acompanha o painel de **Metrics & Logs**. Monitora-se a taxa de erros HTTP `401`/`403` e alertas críticos do Alertmanager/PagerDuty.
- **Grace Period (Período de Tolerância):** Aguarde um mínimo de 1 a 2 horas (ou alguns dias em casos não urgentes) para se certificar de que nenhum job longo retido em Fila tente autenticar usando credenciais armazenadas estaticamente na memória velha.

### 5. Revogação e Expurgo

- Uma vez confirmada a estabilidade com a Chave V2, entre no provedor original (Stripe, OpenAI, Supabase) e **Delete/Revogue a Chave V1**.
- O evento deve ser registrado no Audit Trail operacional. O processo é considerado concluído somente após a revisão nova permanecer estável e a revisão anterior ficar dispensável.

## Feature Flags Estáticas (Category A)

Para alternância de comportamento rápido (Ligar ou Desligar uma UI, Trocar prompt de um agente) que não envolvam senhas, deve-se usar o serviço de _Feature Toggles_. O gateway irá re-avaliar o valor em tempo de execução para cada request via middleware sem precisar sequer realizar "Rolling Updates" em instâncias em execução.
