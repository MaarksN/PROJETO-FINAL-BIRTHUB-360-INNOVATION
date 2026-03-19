<!-- [SOURCE] Validacao tecnica CODEX - Ciclo 1 BoardPrep AI -->
# Ciclo 1 - BoardPrep AI - Reprovacao Codex (F2/F3 Jules)

## Veredito
- Resultado: `REPROVADO_COM_MOTIVO`
- Escopo validado: `contract.yaml` + `system_prompt.md` do Jules.

## Evidencias objetivas

- O runtime padrao do agente passou a consumir o contrato do pacote Jules (`boardprep.contract.loaded.details.source=package_file`).
- O `contract.yaml` nao define `required_tools` de forma estruturada e testavel.
- `failure_behavior` e `fallback` estao em texto livre, sem forma canonica de decisao para testes automatizados.
- `output_schema.data_tables.items` esta como `object` sem estrutura, introduzindo ambiguidade na validacao de fronteira.
- O contrato nao explicita criterios de aceite verificaveis.
- O `system_prompt.md` cobre guardrails base, mas nao define criterios objetivos de aprovacao/reprovacao por cenario.

## Correcoes requeridas para revalidacao

1. Estruturar `failure_behavior` e `fallback` em campos testaveis e nao ambiguos.
2. Declarar `required_tools` de forma explicita e verificavel.
3. Especificar shape de `data_tables.items` no `output_schema`.
4. Adicionar criterios de aceite com condicoes mensuraveis no contrato e no prompt.
5. Reenviar para Codex com tag `[AGUARDA VALIDACAO CODEX]`.
