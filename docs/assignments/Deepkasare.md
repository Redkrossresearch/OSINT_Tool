# Assignment: Deepkasare

## Identity

- **Name:** Deep Kasare
- **GitHub:** Deepkasare
- **Team:** Team 5 (team-product)
- **Head Intern:** Ishauparkar13 (Ishauparkar13)
- **Role:** Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T5-008 | Entity Viewer | Entity view | T5-002, T3-014 | 2 | Layout + Entity API done | List renders | Entity list and detail views work | Ishauparkar13 | None |
| T5-009 | Graph View | Graph visualization | T5-002, T3-011 | 3 | Layout + Graph API done | Graph renders | Interactive graph visualization works | Ishauparkar13 | None |
| T5-010 | Timeline | Timeline view | T5-002, T3-013 | 2 | Layout + Timeline API done | Timeline renders | Investigation timeline renders correctly | Ishauparkar13 | None |
| T5-017 | E2E Tests | Quality gate | T5-002 through T5-016 | 3 | All UI done | Tests pass | End-to-end UI tests pass | Ishauparkar13 | Unblocks T5-018 |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T5-008 | T5-002 (Application Layout), T3-014 (Entity API) | Waiting for Ishauparkar13, parthvichare20 |
| T5-009 | T5-002 (Application Layout), T3-011 (Graph API) | Waiting for Ishauparkar13, parthvichare20 |
| T5-010 | T5-002 (Application Layout), T3-013 (Investigation Timeline) | Waiting for Ishauparkar13, parthvichare20 |
| T5-017 | T5-002 through T5-016 (all UI tasks) | Waiting for all team members |

## What I Can Work On While Waiting

- T5-016 backup (accessibility)
- Graph component design
- PR reviews for team-product

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T5-017 | T5-018 (Product Integration Tests) | team-product |

## What I Must Not Modify

- `packages/schemas/` — owned by team-core
- `services/core/` — owned by team-core
- `connectors/` — owned by team-connectors
- `services/intelligence/` — owned by team-intelligence
- `services/ai/` — owned by team-ai-verification

## Branch Naming

`feature/t5-008-entity-viewer`

## PR Target

`team/5-team-product`

## Who Reviews

1. Team Head Intern: Ishauparkar13
2. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/Deepkasare.md`
3. Read your task in `docs/tasks/team-5-*.md`
4. Read your team guide in `docs/teams/team-5-team-product.md`
5. Create your branch
6. Begin implementation
