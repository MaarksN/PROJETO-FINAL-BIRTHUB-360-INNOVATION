# Critérios de Escalonamento Horizontal (Auto-Scaling)

## Objetivo
Definir *quando* e *como* a infraestrutura (especialmente AWS ECS) deve adicionar novos containers (Scale Out) para lidar com o tráfego e removê-los (Scale In) para economizar custos.

## Thresholds por Serviço

1. **API Gateway (Node.js/Express ou similar)**
   - **Métrica Primária:** CPU Utilization.
   - **Scale Out (Aumentar):** `CPU > 60%` sustentado por 1 minuto.
   - **Scale In (Reduzir):** `CPU < 30%` sustentado por 5 minutos.
   - **Justificativa:** Node.js é single-threaded para execução. Se a CPU passar de 60-70%, a latência do Event Loop aumenta drasticamente. Escalar cedo é vital.

2. **Agent Orchestrator / Workers (Python)**
   - **Métrica Primária:** Fila SQS (Approximate Number of Messages Visible) ou CPU.
   - **Scale Out:** `Mensagens na Fila > 50` por container (ou CPU > 65%).
   - **Scale In:** Fila vazia ou CPU < 25% por 10 minutos.
   - **Justificativa:** Tarefas de IA são demoradas. Basear o escalonamento apenas em CPU pode ser enganoso se as tarefas estiverem esperando I/O (Rede do LLM). O tamanho da fila de tarefas é o melhor indicador do acúmulo de trabalho pendente.

3. **Frontend Dashboard (Next.js / SSR)**
   - **Métrica Primária:** Request Count per Target (ALB).
   - **Scale Out:** `> 1000 requests/minuto` por container ativo.
   - **Scale In:** `< 300 requests/minuto` por container.
   - **Justificativa:** Renderização SSR consome CPU moderada, mas gargala em tráfego concorrente extremo se o cache não estiver ativo.

4. **Banco de Dados (RDS PostgreSQL)**
   - **Métrica Primária:** Armazenamento (Storage Auto-scaling).
   - O escalonamento de *Compute* (Instância T3 para M5) requer downtime (Scale Up vertical), portanto não é automático. Apenas réplicas de leitura (Read Replicas) podem ser adicionadas horizontalmente se `Read IOPS > 80%`.

## Prevenção de Flapping
Para evitar que o sistema fique criando e destruindo containers repetidamente a cada segundo (Thrashing/Flapping), o *Scale In* sempre tem um *cooldown period* maior (ex: 5 a 10 minutos) que o *Scale Out* (rápido, 1 minuto).
