# Naming Conventions - BirthHub 360

O BirthHub 360 utiliza uma stack mista contendo TypeScript (frontend e infra de gateway) e Python (Agentes).
Para manter consistência cross-language e facilitar o onboarding, siga as diretrizes abaixo para nomenclatura de arquivos, pastas, variáveis e tipos em todo o repositório.

## Geral (Aplicável a todo o monorepo)

- **Pastas (Diretórios)**: Devem ser sempre `kebab-case`.
  - Exemplo correto: `api-gateway`, `sales-dashboard`, `ldr-agent`.
  - Motivo: Padronização na URL, repositório Linux e prevenção de erros em sistemas de arquivos sensíveis à caixa.

## TypeScript (Node.js / React)

### 1. Arquivos

- **Arquivos TypeScript/TSX**: Use `kebab-case` para componentes, utilitários, e hooks. O Next.js (`apps/dashboard/`) usa arquivos de rotas específicos (`page.tsx`, `layout.tsx`) seguindo a convenção de App Router da Vercel.
  - Exemplo correto: `user-profile.tsx`, `use-auth.ts`, `string-utils.ts`.

### 2. Variáveis, Constantes e Funções

- **Variáveis/Instâncias e Funções**: Use `camelCase`.
  - Exemplo correto: `let activeUsers`, `const calculateTotal()`.
- **Constantes Globais**: Valores fixos de configuração no topo do arquivo exportados e não modificáveis devem ser `UPPER_SNAKE_CASE`.
  - Exemplo correto: `const MAX_RETRY_ATTEMPTS = 3;`

### 3. Tipos e Classes (TypeScript)

- **Classes, Interfaces, Tipos e Enums**: Use `PascalCase`.
  - Exemplo correto: `interface UserData`, `type AuthResponse`, `class ApiClient`.
  - Evite o uso de prefixos como `I` ou `T` em interfaces e tipos (ex: `IUser` ou `TUser`). Simplesmente use o nome do domínio: `User`.

## Python (Agentes AI / FastAPI / LangGraph)

### 1. Arquivos e Módulos (Packages)

- **Módulos (.py) e Pacotes de Diretórios Python**: Use `snake_case`. (Não misturar com o `kebab-case` de pastas gerais de apps. Pastas internas de pacotes python devem ser importáveis, então `snake_case` é mandatório).
  - Exemplo correto: `agent_orchestrator.py`, `models/`, `utils/db_helpers.py`.

### 2. Variáveis e Funções (Python)

- **Variáveis e Funções**: De acordo com a PEP 8, devem ser em `snake_case`.
  - Exemplo correto: `active_users`, `def calculate_total():`.
- **Constantes**: Devem ser `UPPER_SNAKE_CASE`.
  - Exemplo correto: `MAX_RETRY_ATTEMPTS = 3`.

### 3. Classes (Python)

- **Classes**: Use `PascalCase`. (Pydantic models, schemas, FastAPI routers, serviços).
  - Exemplo correto: `class UserData(BaseModel):`, `class ApiClient:`.

## Resumo e Cheat Sheet

| Entidade                   | TypeScript / React | Python / FastAPI   | Exemplo prático                   |
| -------------------------- | ------------------ | ------------------ | --------------------------------- |
| Pasta de Projeto (Raiz)    | `kebab-case`       | `kebab-case`       | `apps/api-gateway`                |
| Arquivo de código base     | `kebab-case.ts`    | `snake_case.py`    | `auth-service.ts` / `auth_svc.py` |
| Variáveis de Instância     | `camelCase`        | `snake_case`       | `userCount` / `user_count`        |
| Métodos e Funções          | `camelCase()`      | `snake_case()`     | `getUser()` / `get_user()`        |
| Constantes de Configuração | `UPPER_SNAKE_CASE` | `UPPER_SNAKE_CASE` | `API_URL`                         |
| Classes e Tipos/Models     | `PascalCase`       | `PascalCase`       | `UserModel` / `AuthResponse`      |
