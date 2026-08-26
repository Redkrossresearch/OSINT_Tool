# Assignment: anujmore2006-collab

## Identity

- **Name:** Anuj More
- **GitHub:** anujmore2006-collab
- **Team:** Team 4 (team-ai-verification)
- **Head Intern:** sumeetmore334-rgb (sumeetmore334-rgb)
- **Role:** Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T4-003 | Model Configuration | Config needed | T4-001 | 1 | T4-001 done | Config works | Model configuration loaded and validated | sumeetmore334-rgb | Unblocks T4-004, T4-017 |
| T4-004 | Model Fallback | No paid APIs | T4-001, T4-003 | 2 | Config done | Fallback works | Fallback chain activates when primary fails | sumeetmore334-rgb | None |
| T4-005 | Prompt System | Prompts needed | T4-001 | 2 | T4-001 done | Templates work | Prompt templates loaded and render correctly | sumeetmore334-rgb | Unblocks T4-017 |
| T4-017 | Evaluation Dataset | Evaluation needed | T4-003, T4-005 | 1 | Config + prompts done | Fixtures created | Evaluation fixtures cover all agent types | sumeetmore334-rgb | Unblocks T4-018 |
| T4-018 | Evaluation Tests | Quality gate | T4-007, T4-008, T4-009, T4-010, T4-017 | 3 | All agents done | Evaluation passes | All agents meet quality thresholds | sumeetmore334-rgb | Unblocks T4-019 |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T4-003 | T4-001 (Model Abstraction) | Waiting for sumeetmore334-rgb |
| T4-004 | T4-001, T4-003 | Waiting for sumeetmore334-rgb + own T4-003 |
| T4-005 | T4-001 (Model Abstraction) | Waiting for sumeetmore334-rgb |
| T4-017 | T4-003, T4-005 | Blocked until T4-003 and T4-005 done |
| T4-018 | T4-007, T4-008, T4-009, T4-010, T4-017 | Waiting for Akash-Upade, shraddhamahindrakar217-cloud + own T4-017 |

## What I Can Work On While Waiting

- T4-017 backup (evaluation dataset)
- Prompt template design
- PR reviews for team-ai-verification

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T4-004 | T4-003 (fallback chain integration) | team-ai-verification |
| T4-017 | T4-018 (Evaluation Tests) | team-ai-verification |
| T4-018 | T4-019 (Integration Tests) | team-ai-verification |

## What I Must Not Modify

- `packages/schemas/` — owned by team-core
- `services/core/` — owned by team-core
- `connectors/` — owned by team-connectors
- `services/intelligence/` — owned by team-intelligence
- `apps/web/` — owned by team-product

## Branch Naming

`feature/t4-003-model-configuration`

## PR Target

`team/4-team-ai-verification`

## Who Reviews

1. Team Head Intern: sumeetmore334-rgb
2. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/anujmore2006-collab.md`
3. Read your task in `docs/tasks/team-4-*.md`
4. Read your team guide in `docs/teams/team-4-team-ai-verification.md`
5. Create your branch
6. Begin implementation
