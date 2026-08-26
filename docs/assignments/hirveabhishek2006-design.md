# Assignment: hirveabhishek2006-design

## Identity

- **Name:** Abhishek Hirve
- **GitHub:** hirveabhishek2006-design
- **Team:** Team 3 (team-intelligence)
- **Head Intern:** hirveabhishek2006-design (hirveabhishek2006-design)
- **Role:** Head Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T3-001 | Entity Schema | Entity types needed | T1-003 | 2 | T1-003 done | All entity types defined | All entity schemas validate correctly | Ojas (ojas1216) | Unblocks T3-002, T3-003, T3-004, T3-006, T3-007, T3-008 |
| T3-002 | Entity Normalization | Canonicalization needed | T3-001 | 2 | T3-001 done | Normalization works | Entities normalized to canonical forms | Ojas (ojas1216) | None |
| T3-018 | Documentation | MVP needs docs | T3-017 | 1 | Tests pass | Intelligence documented | All intelligence APIs documented | Ojas (ojas1216) | None |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T3-001 | T1-003 (Shared Zod Schema Package) | Waiting for Dinesh-Kumar-Ved |
| T3-002 | T3-001 (Entity Schema) | Blocked until T3-001 done |
| T3-017 | T3-003 through T3-014 (all intelligence tasks) | Waiting for all team members |

## What I Can Work On While Waiting

- PR reviews for team-intelligence
- Team coordination across all teams
- Entity type refinements and design
- Review T1-003 schema package

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T3-001 | T3-002 (Entity Normalization) | team-intelligence |
| T3-001 | T3-003 (Entity Extraction) | team-intelligence |
| T3-001 | T3-004 (Entity Confidence) | team-intelligence |
| T3-001 | T3-005 (Entity Resolution) | team-intelligence |
| T3-001 | T3-006 (Relationship Schema) | team-intelligence |
| T3-001 | T3-007 (Relationship Extraction) | team-intelligence |
| T3-001 | T3-008 (Graph Schema) | team-intelligence |

## What I Must Not Modify

- `packages/schemas/` — owned by team-core
- `services/core/` — owned by team-core
- `connectors/` — owned by team-connectors
- `services/ai/` — owned by team-ai-verification
- `apps/web/` — owned by team-product

## Branch Naming

`feature/t3-001-entity-schema`

## PR Target

`team/3-team-intelligence`

## Who Reviews

1. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/hirveabhishek2006-design.md`
3. Read your task in `docs/tasks/team-3-*.md`
4. Read your team guide in `docs/teams/team-3-team-intelligence.md`
5. Create your branch
6. Begin implementation
