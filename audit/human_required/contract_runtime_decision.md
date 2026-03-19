Decisão requerida:
O codebase não possui runtime de carregamento de
contract.yaml em AgentRuntime. O critério de
revalidação do Codex exigia o evento
boardprep.contract.loaded com details.source === "file",
mas não há event bus nem loader implementado.

Opções:
A) Implementar ContractLoader em agents-core:
   método que lê contract.yaml do pacote do agente
   e emite evento via EventEmitter nativo do Node.
   Escopo: novo arquivo em packages/agents-core.

B) Aceitar contract.yaml como artefato documental
   apenas, sem enforcement de runtime neste ciclo.
   O critério de revalidação seria ajustado para
   verificar apenas presença e conteúdo do arquivo.

Impacto da decisão:
Opção A expande o escopo do ciclo atual para incluir
infraestrutura de runtime não declarada no artefato
instrucional original.
Opção B mantém o escopo original e posterga o runtime
para um ciclo de infraestrutura dedicado.