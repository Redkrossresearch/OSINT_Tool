# Git Branching Strategy

---

## Branch Types

### `main`

The canonical stable integration branch.

- Always deployable
- Only merged to via PR from team branches
- Never pushed to directly
- Protected by convention (GitHub Free does not support branch protection for private repos)

---

### Team Integration Branches

```
team/1-core
team/2-connectors
team/3-intelligence
team/4-ai-verification
team/5-product
```

Each team has one integration branch. This is where team leads merge approved PRs.

- Created from `main`
- Updated regularly
- Merged to `main` by technical architect

---

### Feature Branches

```
feature/t1-004-case-schema
feature/t2-007-dns-rdap-connector
feature/t3-005-entity-resolution
feature/t4-002-ollama-provider
feature/t5-003-dashboard
```

Individual developer branches for specific tasks.

- Created from team branch
- Merged to team branch via PR
- Deleted after merge

---

## Branch Naming Convention

```
feature/t{TEAM}-{TASK}-{short-description}
```

Examples:
- `feature/t1-004-case-schema`
- `feature/t2-007-dns-rdap-connector`
- `feature/t3-005-entity-resolution`
- `feature/t4-002-ollama-provider`
- `feature/t5-003-dashboard`

---

## Workflow

### For Interns

```
main (stable)
  ↑
team/3-intelligence (team integration)
  ↑
feature/t3-005-entity-resolution (your work)
```

1. Start from team branch
2. Create feature branch
3. Implement
4. Test
5. PR to team branch
6. Team lead reviews
7. Merge to team branch

### For Team Leads

```
main (stable)
  ↑
team/3-intelligence (merge approved PRs)
```

1. Review PRs from team members
2. Approve and merge to team branch
3. Coordinate with other team leads
4. Technical architect merges to main

### For Technical Architect

```
main (stable)
  ↑
team/1-core
team/2-connectors
team/3-intelligence
team/4-ai-verification
team/5-product
```

1. Review team branches
2. Ensure cross-team compatibility
3. Merge to main
4. Tag releases

---

## Commit Convention

Use conventional commits:

```
type(scope): description

Types:
  feat     — new feature
  fix      — bug fix
  docs     — documentation
  test     — tests
  refactor — code improvement
  chore    — maintenance
  security — security fix

Scopes:
  core         — services/core
  evidence     — services/evidence
  schemas      — packages/schemas
  connectors   — connectors/
  intelligence — services/intelligence
  graph        — services/graph
  entities     — packages/entities
  ai           — services/ai
  verification — services/verification
  web          — apps/web
  reporting    — services/reporting
  team-1       — Team 1 general
  team-2       — Team 2 general
  team-3       — Team 3 general
  team-4       — Team 4 general
  team-5       — Team 5 general

Examples:
  feat(core): add investigation schema
  fix(connectors): handle DNS timeout
  docs(team-3): update entity extraction guide
  test(graph): add traversal tests
  refactor(ai): simplify prompt manager
```

---

## Merging Rules

### Intern → Team Branch
- Requires PR
- Requires team lead approval
- Squash merge preferred

### Team Branch → Main
- Requires PR
- Requires technical architect approval
- Merge commit (preserve history)

### What Never Happens
- Intern → Main (never)
- AI agent → Main (never)
- Direct push to main (never)
- Force push to main (never)

---

## Hotfixes

For critical production fixes:

1. Create `hotfix/description` from `main`
2. Fix the issue
3. PR to `main`
4. Technical architect reviews and merges
5. Cherry-pick to affected team branches

---

## Rollback

If a merge to `main` causes issues:

1. Revert the merge commit
2. Push the revert to `main`
3. Notify affected teams
4. Fix the issue in the team branch
5. Re-merge through the normal process

---

## Branch Cleanup

- Delete feature branches after merge
- Keep team branches clean
- Never delete `main` or team branches
