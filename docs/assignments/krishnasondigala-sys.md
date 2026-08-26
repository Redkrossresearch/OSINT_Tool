# Assignment: krishnasondigala-sys

## Identity

- **Name:** Krishna SonDigala
- **GitHub:** krishnasondigala-sys
- **Team:** Team 5 (team-product)
- **Head Intern:** Ishauparkar13 (Ishauparkar13)
- **Role:** Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T5-011 | Findings View | Findings display | T5-002, T4-011 | 2 | Layout + Verification done | Findings displayed | Findings list and detail views work | Ishauparkar13 | Unblocks T5-012 |
| T5-012 | Verification View | Review workflow | T5-011, T4-013 | 2 | Findings + Human-review done | Review actions work | Verify/reject actions work | Ishauparkar13 | None |
| T5-013 | Report Generation | Report capability | T5-002, T1-018, T3-014, T4-011 | 3 | All deps done | Reports generated | Reports generated from investigation data | Ishauparkar13 | Unblocks T5-014 |
| T5-014 | Report Export | Export needed | T5-013 | 1 | Reports done | Export works | PDF/HTML export works | Ishauparkar13 | None |
| T5-018 | Product Integration Tests | Quality gate | T5-017 | 2 | E2E tests pass | Integration works | Product integration tests pass | Ishauparkar13 | Unblocks T5-019 |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T5-011 | T5-002 (Application Layout), T4-011 (Verification Engine) | Waiting for Ishauparkar13, shraddhamahindrakar217-cloud |
| T5-012 | T5-011 (Findings View), T4-013 (Human-Review State) | Waiting for own T5-011 + shraddhamahindrakar217-cloud |
| T5-013 | T5-002, T1-018, T3-014, T4-011 | Waiting for Ishauparkar13, jadhavsarthak374-ai, parthvichare20, shraddhamahindrakar217-cloud |
| T5-014 | T5-013 (Report Generation) | Blocked until T5-013 done |
| T5-018 | T5-017 (E2E Tests) | Waiting for Deepkasare |

## What I Can Work On While Waiting

- T5-018 backup (product integration tests)
- Report templates
- PR reviews for team-product

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T5-013 | T5-014 (Report Export) | team-product |
| T5-018 | T5-019 (Documentation) | team-product |

## What I Must Not Modify

- `packages/schemas/` — owned by team-core
- `services/core/` — owned by team-core
- `connectors/` — owned by team-connectors
- `services/intelligence/` — owned by team-intelligence
- `services/ai/` — owned by team-ai-verification

## Branch Naming

`feature/t5-011-findings-view`

## PR Target

`team/5-team-product`

## Who Reviews

1. Team Head Intern: Ishauparkar13
2. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/krishnasondigala-sys.md`
3. Read your task in `docs/tasks/team-5-*.md`
4. Read your team guide in `docs/teams/team-5-team-product.md`
5. Create your branch
6. Begin implementation
