# ADR 023: Workflow Template Versioning and Upgrades

## Status
Accepted

## Context
BirthHub360 provides a Marketplace where workflow templates are published. Tenants install these templates and often customize them. When a template publisher releases a new version (e.g., fixing a bug in an agent prompt, or adding a new best-practice step), we need a strategy for how that update is distributed to tenants who have already installed and modified the previous version. If we force an auto-update, we risk overwriting the tenant's customizations and breaking their production business processes.

## Decision
We will adopt an **Immutable Versioning with Manual Migration** strategy.

1.  **Immutable Templates**: Once a template version (e.g., `v1.2.0`) is published, it is immutable. Changes require publishing a new version (`v1.3.0`).
2.  **Detached Instantiation**: When a tenant installs a template, the system creates a standalone `WorkflowDefinition` in their tenant space. This definition contains a metadata tag linking it back to the original `TemplateID` and `TemplateVersion`, but it is structurally detached.
3.  **No Auto-Updates**: The platform will **never** automatically update a tenant's active workflow definition when a new template version is released.
4.  **Update Notifications**:
    *   The UI will display a badge (e.g., "Update Available: v1.3.0") next to workflows that were derived from an outdated template.
    *   Tenant Admins will receive an email notification detailing the changelog of the new version.
5.  **Manual "Side-by-Side" Upgrade Path**:
    *   If a tenant chooses to upgrade, the UI will *not* attempt to merge the new template changes into their existing customized workflow (as Git-style semantic merging of DAGs is highly error-prone).
    *   Instead, the system will install the *new* template as a completely separate, disabled workflow.
    *   The tenant is responsible for manually copying their custom logic over to the new workflow, testing it, and then switching the active trigger from the old version to the new version.

## Consequences
*   **Pros**:
    *   **Zero Risk of Breakage**: We mathematically guarantee that a marketplace update will never break a running customer workflow.
    *   **Predictability**: Tenants have complete control over when and how their business processes change.
*   **Cons**:
    *   **High Friction Upgrades**: Tenants with heavy customizations will find it tedious to migrate to new template versions.
    *   **Version Fragmentation**: We will likely see many tenants running severely outdated (but functioning) versions of templates.

## Alternatives Considered
*   **Git-Style Diff/Merge UI**: Attempting to show a visual diff of the workflow graph and allowing the user to "Accept" or "Reject" node changes. *Rejected* due to the extreme complexity of building and maintaining a visual DAG diffing tool, and the high risk of a user misunderstanding the merge and breaking data flow.