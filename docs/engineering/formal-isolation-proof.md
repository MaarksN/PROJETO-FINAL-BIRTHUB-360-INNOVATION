# Prova Formal de Isolamento

Um script Playwright E2E e testes de Integração rodam em todo CI:
O script cria Tenant A e B, gera dados no Tenant A, e tenta listar, ler, editar ou deletar via token do Tenant B utilizando IDs manipulados na URL.
**Cenários testados:** 15.
O resultado é documentado nos test reports e deve manter sucesso em 100% das asserções para habilitar merges.
