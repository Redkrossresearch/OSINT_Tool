# Assignment: Akash-Upade

## Identity

- **Name:** Akash Upade
- **GitHub:** Akash-Upade
- **Team:** Team 4 (team-ai-verification)
- **Head Intern:** sumeetmore334-rgb (sumeetmore334-rgb)
- **Role:** Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T4-006 | Structured AI Output | JSON parsing needed | T4-001 | 2 | T4-001 done | Parsing works | AI output parsed to typed objects | sumeetmore334-rgb | None |
| T4-007 | Investigation Planner | Planner agent | T4-001, T1-005 | 3 | T4-001 + T1-005 done | Produces valid tasks | Planner produces valid investigation task lists | sumeetmore334-rgb | Unblocks T4-018 |
| T4-008 | Evidence Analysis | Analysis agent | T4-001, T1-009 | 3 | T4-001 + T1-009 done | Insights extracted | Evidence analysis extracts meaningful insights | sumeetmore334-rgb | Unblocks T4-009, T4-018 |
| T4-009 | Correlation Engine | Pattern detection | T4-001, T4-008 | 3 | Analysis done | Correlations found | Cross-source correlations detected | sumeetmore334-rgb | Unblocks T4-018 |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T4-006 | T4-001 (Model Abstraction) | Waiting for sumeetmore334-rgb |
| T4-007 | T4-001 (Model Abstraction), T1-005 (Investigation Schema) | Waiting for sumeetmore334-rgb, ANDY15K |
| T4-008 | T4-001 (Model Abstraction), T1-009 (Evidence Schema) | Waiting for sumeetmore334-rgb, jadhavsarthak374-ai |
| T4-009 | T4-008 (Evidence Analysis) | Blocked until T4-008 done |

## What I Can Work On While Waiting

- T4-018 backup (evaluation tests)
- Agent prompt design
- PR reviews for team-ai-verification

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T4-007 | T4-018 (Evaluation Tests) | team-ai-verification |
| T4-008 | T4-009 (Correlation Engine) | team-ai-verification |
| T4-008 | T4-018 (Evaluation Tests) | team-ai-verification |
| T4-009 | T4-018 (Evaluation Tests) | team-ai-verification |

## What I Must Not Modify

- `packages/schemas/` — owned by team-core
- `services/core/` — owned by team-core
- `connectors/` — owned by team-connectors
- `services/intelligence/` — owned by team-intelligence
- `apps/web/` — owned by team-product

## Branch Naming

`feature/t4-006-structured-ai-output`

## PR Target

`team/4-team-ai-verification`

## Who Reviews

1. Team Head Intern: sumeetmore334-rgb
2. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/Akash-Upade.md`
3. Read your task in `docs/tasks/team-4-*.md`
4. Read your team guide in `docs/teams/team-4-team-ai-verification.md`
5. Create your branch
6. Begin implementation
