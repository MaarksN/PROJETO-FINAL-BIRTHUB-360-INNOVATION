# Risco de Adulteração de Audit Log

Se um admin invadir o banco ou um sistema se comprometer, ele poderia limpar logs para esconder rastros.
- **Mitigação (Hash Encadeado):** Para cada registro de auditoria crítico de PHI, injetamos um hash derivado da chave secreta da linha anterior (`prev_hash`). Qualquer edição forçada ou deleção no meio da tabela do DB quebrará a corrente e será flagrada.
