# AI Coding Rules — RedKross OSINT Investigation Platform

Every intern using OpenCode (or any AI coding assistant) on this project must follow these rules.

---

## Pre-Modification Checklist

Before modifying ANY file, the AI assistant must:

1. **Inspect the repository** — understand the current state
2. **Read README.md** — project overview
3. **Read DEVELOPMENT.md** — development setup and workflow
4. **Read ARCHITECTURE.md** — system architecture
5. **Read MVP_SCOPE.md** — what is and isn't in scope
6. **Read TEAM_WORKFLOW.md** — team processes
7. **Read your team's documentation** — `docs/teams/team-N-*.md`
8. **Read the assigned task** — specific task file in `docs/tasks/`
9. **Inspect related interfaces** — understand contracts
10. **Understand dependencies** — what other code depends on this

---

## Modification Rules

### You MAY modify:
- Files within your team's owned directories
- Files specifically assigned in your task
- Test files related to your changes
- Documentation related to your changes

### You MUST NOT:
- Modify another team's implementation without written authorization
- Redesign global architecture
- Push directly to `main`
- Force push to any branch
- Disable CI checks
- Remove tests to make tests pass
- Commit secrets, API keys, passwords, or tokens
- Introduce undocumented dependencies
- Rewrite unrelated files
- Change database architecture without approval
- Change public interfaces (API contracts) without approval
- Install large dependencies (>50MB) without justification and approval
- Use paid AI APIs automatically
- Merge your own PRs

### You MUST ALWAYS:
- Write tests for new functionality
- Run existing tests before submitting
- Handle errors explicitly
- Update documentation when behavior changes
- Preserve existing interfaces
- Keep changes small and focused
- Explain assumptions in PR description
- Report uncertainty to your team lead
- Create clean, descriptive commits
- Open a pull request (never push to main)
- Allow human review before merging

---

## Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `ci`

Examples:
```
feat(evidence): add SHA-256 hashing for evidence objects
fix(connectors): handle timeout in DNS connector
docs(tasks): add T1-003 evidence schema task
test(intelligence): add entity resolution unit tests
```

---

## Task Discipline

### Bad (Too Broad)
> "Build the entire OSINT platform"

### Good (Focused)
> "Implement T2-003: DNS connector according to the connector contract in packages/schemas/connector.ts"

### AI Assistant Must:
1. Read the specific task file
2. Inspect only relevant code
3. Implement exactly what the task requires
4. Write tests for the implementation
5. Run tests
6. Summarize what was done
7. NOT expand scope beyond the task

---

## Team Boundaries

| Team | Owned Directories |
|---|---|
| Team 1 — Core + Evidence | `services/core/`, `services/evidence/`, `packages/schemas/` |
| Team 2 — Connectors | `connectors/`, `services/connectors/` |
| Team 3 — Intelligence + Graph | `services/intelligence/`, `services/graph/`, `packages/entities/` |
| Team 4 — AI + Verification | `services/ai/`, `services/verification/` |
| Team 5 — Product + Reporting | `apps/web/`, `services/reporting/` |

**Rule:** Read broadly, write narrowly, merge centrally.

---

## Quality Gates

Before opening a PR, verify:

- [ ] Code compiles / builds without errors
- [ ] All existing tests pass
- [ ] New tests are written for new functionality
- [ ] Linter passes with no errors
- [ ] Type checker passes with no errors
- [ ] No hardcoded secrets or API keys
- [ ] No `console.log` with sensitive data
- [ ] Documentation updated if behavior changed
- [ ] Commit messages follow format
- [ ] Changes are limited to team-owned files
