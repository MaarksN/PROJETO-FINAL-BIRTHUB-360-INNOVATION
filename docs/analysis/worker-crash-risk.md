# Análise de Risco: Worker Crash Durante Execução

No ecossistema BirthHub360, os agentes são instanciados por *workers* assíncronos que processam filas de mensagens. Um "worker crash" ocorre quando o processo (daemon, contêiner Docker, ou pod Kubernetes) morre inesperadamente no meio do processamento de um job.

Esta análise detalha os cenários, os estados resultantes e os mecanismos de compensação e reprocessamento obrigatórios.

## 1. Cenários de Crash (Causas Comuns)

1.  **OOM Killed (Out of Memory):** O modelo consumiu mais memória do que o limite do pod (ex: uma tool retornou 50MB de dados que tentaram ser passados em um contexto).
2.  **Segfault / Falha na Biblioteca (C Exts):** Falha grave em bibliotecas subjacentes (ex: driver de banco, libssl, grpc).
3.  **Desligamento Forçado (Eviction/Preemption):** O nó do Kubernetes (EC2 Spot) foi preemptado pela nuvem (AWS), forçando um `SIGKILL` sem dar tempo ao graceful shutdown.
4.  **Hardware Failure:** A máquina física ou VM subjacente falhou de forma catastrófica (kernel panic, falha de rede fatal).
5.  **Exaustão do Tempo de Execução do Processo Global:** Um timeout global da plataforma encerra forçosamente a thread (Hard Timeout).

## 2. Risco do Estado Intermediário (Inconsistência)

O maior risco de um crash não é o erro em si, mas a possibilidade de o job ficar "preso" em um estado indefinido ou gerar efeitos colaterais parciais (Incomplete Execution / Zombie States).

**Cenário de Perigo: Pagamento Processado, Notificação Perdida**
*   **Step 1:** O agente chama a Tool `charge_credit_card`. A cobrança é feita e o banco de dados do provedor externo registra o pagamento.
*   **Step 2:** A resposta volta ao worker ("$100 cobrados").
*   *-- CRASH DO WORKER (OOM Killed ao processar a resposta volumosa) --*
*   **Step 3:** O banco de dados do BirthHub360 nunca recebeu o update de que o ticket está `PAID` e o cliente não recebe o e-mail.
*   **Resultado:** Cobrança fantasma; inconsistência de estado entre o BirthHub360 e o gateway financeiro.

## 3. Mitigações e Compensação (Idempotência e Checkpoints)

Para lidar com os riscos descritos, o Agent Core implementa as seguintes regras operacionais:

### A. Persistência de Estado Contínua (Checkpointing)
A memória do agente (o "State" no LangGraph, ou o histórico de mensagens LLM) deve ser persistida *a cada nó do grafo* ou a cada chamada de tool completada.
*   Se o processo morrer entre o passo 3 e 4, a plataforma saberá exatamente em que estado ele parou. O reprocessamento não começará do passo 1, mas recuperará o estado (checkpointer) do passo 3 e prosseguirá (Resumable Execution).

### B. Idempotência Rigorosa nas Tools de Escrita (Write Tools)
As ferramentas que possuem a capacidade `write` ou `execute` (que geram mutações externas) **DEVEM** ser idempotentes usando "Idempotency Keys".
*   Se o job falhar na rede logo após o Gateway enviar o sinal de cobrança (mas antes de o worker receber a confirmação), um retry passará a mesma "Idempotency Key". O Gateway reconhecerá a chave e não cobrará novamente, apenas retornando o resultado anterior.

### C. Confirmação de Mensagem (Ack) Atrasada
O worker que consome o job da fila não deve confirmar (Ack) a mensagem assim que a pega (At-Most-Once delivery).
*   A mensagem só é confirmada (Acked) quando o job é concluído com **Sucesso** ou **Falha Terminal** (Erro Lógico sem retry, ex: "Cartão Recusado").
*   Se o worker sofre crash (e a conexão TCP cai), o message broker (ex: RabbitMQ/SQS) percebe a perda de conexão e devolve a mensagem para a fila (At-Least-Once delivery).
*   *Nota Crítica:* Isso força o reprocessamento. Por isso as Tools (item B) devem ser idempotentes.

## 4. Política de Reprocessamento (Retries após Crash)

Quando um job volta para a fila após um crash "invisível" (ex: perda de heartbeat do worker):
1.  O orquestrador detecta que o Job foi "re-entregue" (Delivery Count > 1).
2.  O orquestrador busca o último Checkpoint persistido no banco de dados.
3.  O agente é reconstituído a partir desse estado e retoma a execução.
4.  Se o crash foi sistemático (ex: um loop infinito ou OOM devido ao próprio input do usuário), o reprocessamento falhará repetidamente até atingir o limite máximo de retries da plataforma (Max Delivery = 3, por exemplo), caindo numa Dead Letter Queue (DLQ).

## Conclusão

Crash de workers é uma ocorrência esperada em sistemas distribuídos de larga escala (Design for Failure). O Agent Core do BirthHub360 delega a responsabilidade de resiliência ao uso combinado de **Checkpoints em tempo real** (para resuming), **At-Least-Once Delivery** (para tolerância a perda de nós) e **Idempotência estrita em Tools de Escrita** (para evitar efeitos colaterais duplicados).
