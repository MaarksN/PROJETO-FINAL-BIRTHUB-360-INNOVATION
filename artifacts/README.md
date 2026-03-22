<<<<<<< Updated upstream
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
=======
# Artifacts Policy

A pasta `artifacts/` guarda apenas evidências formais, relatórios estruturais e snapshots auditáveis.

## Categorias versionadas

- `doctor/`: relatórios de saúde estrutural do monorepo
- `release/`: saídas formais de preflight, smoke, scorecard e migração
- `security/`: evidências de segurança e scans
- `privacy/`: relatórios de verificação de privacidade
- `workflows/`: evidências aprovadas de workflow
- `f*-*/`: baselines e evidências congeladas por fase
- `untracked_agents_snapshot/`: snapshots históricos necessários para auditoria

## Não versionar

- logs transitórios
- dumps de banco
- `.env`
- arquivos temporários (`.tmp`, `.bak`, `.swp`)
- saídas locais de runtime

## Retenção

- arquivos não rastreados com mais de 90 dias podem ser removidos por `pnpm artifacts:clean -- --apply`
- snapshots históricos mantidos em Git devem continuar acompanhados por contexto de auditoria/release
>>>>>>> Stashed changes
