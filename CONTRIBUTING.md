# Contributing to RedKross OSINT Investigation Platform

## Getting Started

1. Read `README.md` for project overview
2. Read `DEVELOPMENT.md` for environment setup
3. Read `ARCHITECTURE.md` for system design
4. Read `MVP_SCOPE.md` for current scope
5. Read your team's documentation in `docs/teams/`
6. Pick up your assigned task from `docs/tasks/`

## Branch Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/t1-descriptive-name
   ```
2. Make changes in small, focused commits
3. Push to your feature branch
4. Open a Pull Request targeting your team's integration branch
5. Wait for team lead review
6. After team lead approval, PR to `main`

## Branch Naming

| Prefix | Team |
|---|---|
| `feature/t1-*` | Team 1 — Core + Evidence |
| `feature/t2-*` | Team 2 — Connectors |
| `feature/t3-*` | Team 3 — Intelligence + Graph |
| `feature/t4-*` | Team 4 — AI + Verification |
| `feature/t5-*` | Team 5 — Product + Reporting |
| `fix/*` | Bug fixes |
| `docs/*` | Documentation |
| `chore/*` | Maintenance |

## Commit Messages

```
<type>(<scope>): <description>

Types: feat, fix, docs, test, refactor, chore, ci
Scope: team/area affected
Description: imperative mood, lowercase, no period
```

## Code Style

- TypeScript strict mode
- ESLint + Prettier (enforced in CI)
- No comments unless asked
- Follow existing patterns

## Pull Request Requirements

- [ ] Branch is up-to-date with `main`
- [ ] All CI checks pass
- [ ] Tests written for new functionality
- [ ] No secrets or API keys committed
- [ ] Documentation updated if behavior changed
- [ ] PR description explains what and why
- [ ] Small, focused changes

## Code Review

- Team leads review all PRs
- At least 1 approval required
- Address all review comments
- Never merge your own PR

## Prohibited

- Direct push to `main`
- Force push to shared branches
- Committing secrets
- Disabling CI
- Removing tests
- Changing architecture without approval
- Using paid AI APIs
