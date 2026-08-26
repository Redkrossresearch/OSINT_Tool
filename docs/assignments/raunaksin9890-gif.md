# Assignment: raunaksin9890-gif

## Identity

- **Name:** Raunak Sinha
- **GitHub:** raunaksin9890-gif
- **Team:** Team 3 (team-intelligence)
- **Head Intern:** hirveabhishek2006-design (hirveabhishek2006-design)
- **Role:** Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T3-005 | Entity Resolution | Same-entity detection | T3-003, T3-004 | 3 | Extraction + confidence done | Resolution works | Same entities detected across sources | hirveabhishek2006-design | Unblocks T3-015, T3-017 |
| T3-006 | Relationship Schema | Relationship types needed | T3-001 | 1 | T3-001 done | Types defined | Relationship schema validates correctly | hirveabhishek2006-design | Unblocks T3-007, T3-008 |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T3-005 | T3-003 (Entity Extraction), T3-004 (Entity Confidence) | Waiting for katkarsujal1-design |
| T3-006 | T3-001 (Entity Schema) | Waiting for hirveabhishek2006-design |

## What I Can Work On While Waiting

- T3-015 backup (resolution tests)
- Resolution algorithm design
- PR reviews for team-intelligence

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T3-005 | T3-015 (Resolution Tests) | team-intelligence |
| T3-005 | T3-017 (Integration Tests) | team-intelligence |
| T3-006 | T3-007 (Relationship Extraction) | team-intelligence |
| T3-006 | T3-008 (Graph Schema) | team-intelligence |

## What I Must Not Modify

- `packages/schemas/` — owned by team-core
- `services/core/` — owned by team-core
- `connectors/` — owned by team-connectors
- `services/ai/` — owned by team-ai-verification
- `apps/web/` — owned by team-product

## Branch Naming

`feature/t3-005-entity-resolution`

## PR Target

`team/3-team-intelligence`

## Who Reviews

1. Team Head Intern: hirveabhishek2006-design
2. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/raunaksin9890-gif.md`
3. Read your task in `docs/tasks/team-3-*.md`
4. Read your team guide in `docs/teams/team-3-team-intelligence.md`
5. Create your branch
6. Begin implementation
