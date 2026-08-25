# Team Workflow

## Daily Process

### Standup (async or 5-min sync)
Each team lead reports:
- What was completed yesterday
- What is planned today
- Any blockers

### Development Flow
1. Pick up a task from your team's task list
2. Create a feature branch
3. Implement with AI assistance (follow AI Coding Rules)
4. Write tests
5. Run local checks (`pnpm lint && pnpm typecheck && pnpm test`)
6. Push and open PR
7. Self-review your PR
8. Request team lead review
9. Address feedback
10. Merge to team integration branch

## PR Review Process

### Team Lead Review
- Review all PRs within your team
- Check: correctness, tests, code quality, scope adherence
- Approve or request changes
- Never approve without reading the code

### Technical Architect Review
- Review cross-team changes
- Review architecture changes
- Review schema changes
- Final approval for main branch

## Communication

| Channel | Purpose |
|---|---|
| GitHub Issues | Task tracking, bugs |
| GitHub PRs | Code review |
| Team docs (docs/teams/) | Team-specific documentation |
| Task docs (docs/tasks/) | Task definitions |

## Escalation

1. Blocker? Tell your team lead
2. Cross-team dependency? Team leads coordinate
3. Architecture question? Technical architect decides
4. Scope question? Check MVP_SCOPE.md, then ask architect
5. AI not working? Check docs/AI_MODEL_STRATEGY.md, then ask architect

## Quality Standards

- Every change has tests
- Every change has documentation
- No secrets in code
- No paid AI APIs
- Small, focused PRs
- Clean commit history
- All CI checks pass

## Integration Schedule

| Week | Integration |
|---|---|
| Week 1 (Aug 25-31) | Schemas, contracts, monorepo |
| Week 2 (Sep 1-7) | Core services, connectors begin |
| Week 3 (Sep 8-14) | Connectors, entities, AI, frontend |
| Week 4 (Sep 15-19) | Integration, QA, demo, release |
