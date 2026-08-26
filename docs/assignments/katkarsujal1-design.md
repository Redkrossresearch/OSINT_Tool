# Assignment: katkarsujal1-design

## Identity

- **Name:** Sujal Katkar
- **GitHub:** katkarsujal1-design
- **Team:** Team 3 (team-intelligence)
- **Head Intern:** hirveabhishek2006-design (hirveabhishek2006-design)
- **Role:** Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T3-003 | Entity Extraction | Core intelligence | T3-001, T1-008 | 3 | T3-001 + T1-008 done | Entities extracted with confidence | Entities extracted from observations with confidence scores | hirveabhishek2006-design | Unblocks T3-005, T3-017 |
| T3-004 | Entity Confidence | Scoring needed | T3-001 | 1 | T3-001 done | Confidence scores work | Confidence scores calculated correctly | hirveabhishek2006-design | Unblocks T3-005 |
| T3-015 | Resolution Tests | Quality gate | T3-005 | 1 | Resolution done | Edge cases covered | Edge cases in entity resolution covered | hirveabhishek2006-design | None |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T3-003 | T3-001 (Entity Schema), T1-008 (Observation Schema) | Waiting for hirveabhishek2006-design, Zrahul2024 |
| T3-004 | T3-001 (Entity Schema) | Waiting for hirveabhishek2006-design |
| T3-015 | T3-005 (Entity Resolution) | Waiting for raunaksin9890-gif |

## What I Can Work On While Waiting

- T3-015 backup (resolution tests)
- Entity fixtures and test data
- PR reviews for team-intelligence

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T3-003 | T3-005 (Entity Resolution) | team-intelligence |
| T3-004 | T3-005 (Entity Resolution) | team-intelligence |
| T3-003 | T3-017 (Integration Tests) | team-intelligence |

## What I Must Not Modify

- `packages/schemas/` — owned by team-core
- `services/core/` — owned by team-core
- `connectors/` — owned by team-connectors
- `services/ai/` — owned by team-ai-verification
- `apps/web/` — owned by team-product

## Branch Naming

`feature/t3-003-entity-extraction`

## PR Target

`team/3-team-intelligence`

## Who Reviews

1. Team Head Intern: hirveabhishek2006-design
2. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/katkarsujal1-design.md`
3. Read your task in `docs/tasks/team-3-*.md`
4. Read your team guide in `docs/teams/team-3-team-intelligence.md`
5. Create your branch
6. Begin implementation
