# [SOURCE] BirthHub360_Higiene_Estrutural

# Política de Gestão de Artefatos (`artifacts/`)

A pasta `artifacts/` deve conter apenas arquivos essenciais rastreados gerados durante processos formais e ciclos de remediação que precisam de escrutínio histórico.

## Categorização

### 1. Obrigatórios (Versionados)
*   **Security Snapshots**: Relatórios de segurança e auditorias geradas (e.g., `security/`).
*   **Release baselines**: Snapshots estáticos de fases que representam a conclusão de uma baseline (e.g., `f0-baseline-2026-03-20/`).
*   **Decisões e Snapshots**: Backups congelados de componentes bloqueados ou não rastreados que sofreram decisões humanas (e.g., `untracked_agents_snapshot/`).
*   **Doctor logs**: Relatórios estruturais para análise posterior do repositório.

### 2. Opcionais/Proibidos (Ignorados pelo Git)
*   Não submeter `.log`, dumps de banco de dados (`.dump`, `.sql`), ou qualquer arquivo derivado transitório e sem necessidade de auditoria a longo prazo.

## Retenção
Por padrão, artefatos antigos (mais de 90 dias) e irrelevantes para o ciclo de compliance ou auditoria presente devem ser alvo de limpeza automatizada no CI para evitar poluição do `.git` history.
