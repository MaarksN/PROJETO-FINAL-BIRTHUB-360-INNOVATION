# Risco de Query Injection em Filtros/Paginação

O sistema utiliza Prisma ORM que parametriza automaticamente os inputs (`$1`, `$2`), eliminando SQL Injection tradicional. O risco primário reside no **NoSQL/Prisma Injection**, onde payloads aninhados via JSON podem forçar subqueries não intencionais se espalhados desprotegidos.
- **Mitigação:** Todo input de DTO (Data Transfer Object) em APIs passa por parse estrito via Zod, não permitindo chaves desconhecidas ou objetos de filtro não tipados nos controladores.
