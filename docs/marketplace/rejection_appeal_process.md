# Processo de Apelação de Reprovação de Packs

## 1. Objetivo e Princípios
O processo de revisão e curadoria do Marketplace Público do BirthHub360 é desenhado para ser rigoroso (em prol da segurança dos Tenants finais), mas reconhecemos que decisões de Trust & Safety (humanas ou automatizadas) podem, ocasionalmente, envolver falsos positivos, interpretações divergentes das políticas técnicas ou falta de contexto sobre um caso de uso específico inovador.

Este documento estabelece o **Processo Oficial de Apelação**, garantindo aos Tenants Criadores um mecanismo justo, transparente e rastreável para contestar a reprovação formal de seus Packs (Agentes, Prompts, Tools) ou decisões de "Aprovado com Ressalvas" (Amarelo) que considerem injustificadas.

*   **Direito de Defesa:** Todo Tenant tem o direito de apelar de uma decisão de revisão, desde que forneça novos argumentos ou evidências técnicas.
*   **Revisão Independente:** A apelação nunca será julgada pelo mesmo analista que emitiu a reprovação inicial.
*   **Decisão Final (C-Level/Lead):** Para evitar loops infinitos, o processo possui um ponto final de escalação definitiva.

## 2. Prazos e Condições para Apelar

1.  **Janela de Apelação:** O autor (Administrador do Tenant ou Desenvolvedor do Pack) tem o prazo estrito de **7 dias corridos** a partir da data de recebimento do e-mail oficial de Reprovação (Vermelho) ou do aviso de Ressalvas (Amarelo) para abrir um ticket de apelação no portal do desenvolvedor do BirthHub360.
2.  **Obrigação de Evidência (Ônus da Prova):** Uma apelação genérica ("Eu não concordo, aprovem meu pack") será automaticamente rejeitada pelo sistema de triagem (SLA de 2 horas).
    *   A apelação **deve obrigatoriamente** referenciar diretamente os pontos do feedback de rejeição.
    *   Deve incluir contra-argumentos técnicos (ex: provar que uma biblioteca sinalizada como insegura está, na verdade, configurada com as flags de mitigação corretas no código), ou esclarecimentos de negócio (ex: comprovar a posse dos direitos autorais questionados anexando um contrato).
    *   Links para repositórios (Github), documentações oficiais de APIs de terceiros ou relatórios de *pentest* independentes são encorajados.

## 3. O Fluxo de Apelação (Etapas)

### 3.1. Submissão (Nível 0)
*   **Ação do Autor:** O desenvolvedor preenche o formulário estruturado de apelação: "Qual regra você contesta?", "Por que a decisão inicial foi incorreta?", e anexa evidências (logs, prints, links).
*   **Ação do Sistema:** O pack em questão é congelado (não pode ser alterado durante a apelação) e recebe o status `APPEAL_PENDING`. O "Cooldown" padrão de 7 dias para ressubmissão (ver Política de Reprovação) é suspenso temporariamente.

### 3.2. Revisão por Pares (Peer Review - Nível 1) - SLA: 3 Dias Úteis
*   **Quem Decide:** Um Analista Senior de Trust & Safety *diferente* daquele que reprovou o pack inicialmente é designado para o caso. Ele trabalha em modo "cego" parcial (conhece o feedback original, mas foca na nova evidência).
*   **Análise:** O analista senior avalia se a reprovação inicial foi um erro de interpretação da política, um falso positivo das ferramentas de SAST/DAST, ou se a regra aplicada de fato não se ajusta ao contexto inovador do pack.
*   **Possíveis Desfechos:**
    *   **Apelação Deferida (Vitória do Autor):** O analista senior concorda que a reprovação foi injusta. O pack muda de `REJECTED` para `APPROVED` imediatamente (se não houver outras ressalvas) e o SLA de curadoria é restabelecido ou concluído.
    *   **Apelação Parcialmente Deferida:** A reprovação vermelha é revertida, mas convertida em um "Aprovado com Ressalvas" (Amarelo) mais brando, exigindo apenas ajustes menores antes da publicação.
    *   **Apelação Indeferida (Manutenção da Reprovação):** O analista senior concorda inteiramente com o colega que reprovou o pacote. A reprovação é mantida e a justificativa é enviada ao autor.

### 3.3. Escalação Executiva (A Instância Final - Nível 2) - SLA: 5 Dias Úteis
*   **Gatilho:** Se a apelação for indeferida no Nível 1, e o autor ainda discordar veementemente de forma justificada (não apenas insatisfeito, mas alegando que a política do BirthHub360 é tecnicamente falha ou anti-competitiva), ele pode solicitar a "Escalação Final".
*   **Quem Decide:** Um Comitê formado pelo Head de Segurança (CISO/Sec Lead) e o Product Manager do Marketplace.
*   **O Processo:** Esta é uma revisão de "Política e Produto", não apenas de código. O comitê avalia se a existência do pacote traz mais valor do que risco à plataforma, ou se as regras do checklist de revisão precisam ser atualizadas para acomodar esse novo paradigma de IA.
*   **O Desfecho:** A decisão deste comitê é **Irrevogável, Inapelável e Final**.
    *   Se negado, o pack permanece reprovado permanentemente (o autor terá que refazer a arquitetura do zero para se adequar).
    *   Se aprovado, o comitê força a aprovação ("Override"), e isso geralmente engatilha uma atualização da documentação pública das políticas do BirthHub360 para acomodar casos similares no futuro.

## 4. Abuso do Sistema de Apelação
Para evitar que desenvolvedores usem a apelação sistematicamente como forma de "burlar" revisores juniores ou forçar a equipe do BirthHub360 a reescrever seus códigos malfeitos:
*   Se um Tenant abrir 3 apelações consecutivas que forem indeferidas (classificadas como frívolas ou sem nova evidência técnica), ele perde o direito de usar a via de apelação para qualquer pack durante 90 dias.
*   A equipe de revisão não é consultoria técnica gratuita. O ônus da prova de que um código/prompt é seguro é sempre do Tenant criador, nunca do BirthHub360.
