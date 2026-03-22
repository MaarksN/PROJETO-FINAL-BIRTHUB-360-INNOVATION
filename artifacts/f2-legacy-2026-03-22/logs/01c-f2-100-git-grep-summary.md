# F2-100 — Varredura `@birthub/db`

Data (UTC): 2026-03-22
Comando: git grep -n '@birthub/db' -- .
Total de ocorrências: 9
Ocorrências em runtime/código: 6
Ocorrências em documentação: 3
Ocorrências em metadata de pacote: 0

## Runtime/Código

- 12 CICLOS/F2.html:725:                    <div class="task-text">Executar git grep '@birthub/db' em todo o repositório e registrar achados</div>
- 12 CICLOS/F2.html:757:                    <div class="task-text">Executar verificação final: git grep '@birthub/db' deve retornar zero resultados</div>
- audit/auditoria_forense_repositorio.html:1939:                        <td>Executar git grep '@birthub/db' em todo o repositório e registrar achados</td>
- audit/auditoria_forense_repositorio.html:1975:                        <td>Executar verificação final: git grep '@birthub/db' deve retornar zero resultados</td>
- scripts/ci/monorepo-doctor.mjs:115:const legacyImportRule = workspaceContract.importRules.find((rule) => rule.packageName === '@birthub/db');
- scripts/ci/monorepo-doctor.mjs:118:  return c.includes('@birthub/db')?[f]:[];

## Documentação

- audit_forensic_report.md:619:- **F2-100**: Executar git grep '@birthub/db' em todo o repositório e registrar achados
- audit_forensic_report.md:620:- **F2-104**: Executar verificação final: git grep '@birthub/db' deve retornar zero resultados
- docs/evidence/db-package-fix.md:3:O monorepo BirthHub estava apresentando falhas de importação nos testes de integração do `api-gateway` e em outros locais com a mensagem `"The requested module '@birthub/db' does not provide an export named 'prisma'"`. A causa raiz era que o pacote `@birthub/db` não tinha uma estrutura válida de ESM/NodeNext, nem compilação de fato para que os importadores pudessem consumir adequadamente a exportação nominal do Prisma.

## Metadata de pacote

Nenhum resultado.
