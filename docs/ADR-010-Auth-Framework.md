# ADR-010: Auth.js vs Supabase Auth

## Status
Accepted

## Context
We need to decide on an authentication framework. The decision involves choosing between Auth.js (formerly NextAuth.js) and Supabase Auth. The key criteria for our decision are:
- **Controle (Control):** How much control we have over the underlying data models and session management.
- **Custo (Cost):** The financial implications of scaling the solution.
- **Vendor Lock-in:** The ease with which we could migrate away from the solution in the future if needed.
- **Manutenção (Maintenance):** The operational burden of keeping the authentication system running securely and smoothly.

## Decision
We will use **Auth.js** (formerly NextAuth.js) as our primary authentication framework.

## Rationale
1. **Controle (Control):** Auth.js allows us to connect to our own database (via adapters), giving us complete control over the user and session tables. We can customize the schema exactly to our needs without being constrained by a third-party's data model.
2. **Custo (Cost):** Auth.js is open-source and free. The only cost is the infrastructure we use to host our application and database, which scales predictably. Supabase Auth has a free tier but costs can increase non-linearly as MAUs (Monthly Active Users) grow.
3. **Vendor Lock-in:** Auth.js is provider and database agnostic. If we decide to switch databases or identity providers later, the migration is straightforward. Supabase Auth tightly couples our authentication to the Supabase ecosystem.
4. **Manutenção (Maintenance):** While Auth.js requires us to maintain the database infrastructure (which we are already doing for the rest of the application), it eliminates the need to manage a separate third-party service specifically for authentication. The community support for Auth.js is also very strong, ensuring timely security patches and updates.

## Consequences
- We will need to set up and configure the database adapters for Auth.js.
- We have full responsibility for securing the user and session data within our own database.
- We have the flexibility to implement custom authentication flows more easily in the future.
