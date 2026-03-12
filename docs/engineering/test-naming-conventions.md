# Convenção de Nomenclatura de Testes

Estrutura de `describe` e `it`:

```typescript
describe('ComponenteOuServico', () => {
  describe('métodoOuFuncao', () => {
    it('deve fazer [ação esperada] quando [condição/estado]', () => {
      // Setup
      // Action
      // Assert
    });
  });
});
```
Foque em expressar o comportamento esperado da perspectiva do usuário ou do cliente.
