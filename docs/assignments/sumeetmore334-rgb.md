# Assignment: sumeetmore334-rgb

## Identity

- **Name:** Sumeet More
- **GitHub:** sumeetmore334-rgb
- **Team:** Team 4 (team-ai-verification)
- **Head Intern:** sumeetmore334-rgb (sumeetmore334-rgb)
- **Role:** Head Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T4-001 | Model Abstraction | AI foundation | T1-003 | 2 | T1-003 done | Interface defined | Provider-agnostic interface compiles | Ojas (ojas1216) | Unblocks T4-002 through T4-016 |
| T4-002 | Ollama Provider | Local AI needed | T4-001 | 2 | T4-001 done | Ollama works | Ollama provider connects and generates text | Ojas (ojas1216) | None |
| T4-016 | AI Safety Controls | Bounding rules | T4-001 | 2 | T4-001 done | Limits enforced | Token limits, timeout, and cost controls work | Ojas (ojas1216) | None |
| T4-020 | Documentation | MVP needs docs | T4-019 | 1 | Tests pass | AI documented | All AI APIs documented | Ojas (ojas1216) | None |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T4-001 | T1-003 (Shared Zod Schema Package) | Waiting for Dinesh-Kumar-Ved |
| T4-002 | T4-001 (Model Abstraction) | Blocked until T4-001 done |
| T4-016 | T4-001 (Model Abstraction) | Blocked until T4-001 done |
| T4-019 | T4-018 (Evaluation Tests) | Waiting for Akash-Upade |
| T4-020 | T4-019 (Integration Tests) | Blocked until T4-019 done |

## What I Can Work On While Waiting

- PR reviews for team-ai-verification
- Team coordination across all teams
- Prompt review and design
- Review T1-003 schema package

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T4-001 | T4-002 (Ollama Provider) | team-ai-verification |
| T4-001 | T4-003 (Model Configuration) | team-ai-verification |
| T4-001 | T4-004 (Model Fallback) | team-ai-verification |
| T4-001 | T4-005 (Prompt System) | team-ai-verification |
| T4-001 | T4-006 (Structured AI Output) | team-ai-verification |
| T4-001 | T4-007 (Investigation Planner) | team-ai-verification |
| T4-001 | T4-008 (Evidence Analysis) | team-ai-verification |
| T4-001 | T4-009 (Correlation Engine) | team-ai-verification |
| T4-001 | T4-010 (Contradiction Detection) | team-ai-verification |

## What I Must Not Modify

- `packages/schemas/` — owned by team-core
- `services/core/` — owned by team-core
- `connectors/` — owned by team-connectors
- `services/intelligence/` — owned by team-intelligence
- `apps/web/` — owned by team-product

## Branch Naming

`feature/t4-001-model-abstraction`

## PR Target

`team/4-team-ai-verification`

## Who Reviews

1. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/sumeetmore334-rgb.md`
3. Read your task in `docs/tasks/team-4-*.md`
4. Read your team guide in `docs/teams/team-4-team-ai-verification.md`
5. Create your branch
6. Begin implementation
