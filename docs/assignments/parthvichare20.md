# Assignment: parthvichare20

## Identity

- **Name:** Parth Vichare
- **GitHub:** parthvichare20
- **Team:** Team 3 (team-intelligence)
- **Head Intern:** hirveabhishek2006-design (hirveabhishek2006-design)
- **Role:** Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T3-009 | Graph Storage | Graph CRUD needed | T3-008 | 3 | Graph schema done | CRUD works | All graph CRUD operations work correctly | hirveabhishek2006-design | Unblocks T3-010, T3-013, T3-014 |
| T3-010 | Graph Queries | Traversal needed | T3-009 | 3 | Storage done | Queries work | Graph traversal and path queries return correct results | hirveabhishek2006-design | Unblocks T3-011, T3-016, T5-009 |
| T3-011 | Graph API | API needed for frontend | T3-010 | 2 | Queries done | Endpoints work | Graph REST API endpoints respond correctly | hirveabhishek2006-design | Unblocks T3-016, T5-009 |
| T3-013 | Investigation Timeline | Timeline needed | T3-009, T1-013 | 2 | Storage + audit done | Timeline works | Investigation timeline generated correctly | hirveabhishek2006-design | Unblocks T5-010 |
| T3-014 | Entity API | API needed for frontend | T3-009 | 2 | Storage done | Endpoints work | Entity REST API endpoints respond correctly | hirveabhishek2006-design | Unblocks T5-008, T5-013 |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T3-009 | T3-008 (Graph Schema) | Waiting for Pannkajyadhav333 |
| T3-010 | T3-009 (Graph Storage) | Blocked until T3-009 done |
| T3-011 | T3-010 (Graph Queries) | Blocked until T3-010 done |
| T3-013 | T3-009 (Graph Storage), T1-013 (Audit Event Model) | Waiting for Pannkajyadhav333, ANDY15K |
| T3-014 | T3-009 (Graph Storage) | Blocked until T3-009 done |

## What I Can Work On While Waiting

- T3-016 backup (graph tests)
- Graph query design
- PR reviews for team-intelligence

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T3-011 | T5-009 (Graph View) | team-product |
| T3-011 | T3-016 (Graph Tests) | team-intelligence |
| T3-013 | T5-010 (Timeline) | team-product |
| T3-014 | T5-008 (Entity Viewer) | team-product |
| T3-014 | T5-013 (Report Generation) | team-product |

## What I Must Not Modify

- `packages/schemas/` — owned by team-core
- `services/core/` — owned by team-core
- `connectors/` — owned by team-connectors
- `services/ai/` — owned by team-ai-verification
- `apps/web/` — owned by team-product

## Branch Naming

`feature/t3-009-graph-storage`

## PR Target

`team/3-team-intelligence`

## Who Reviews

1. Team Head Intern: hirveabhishek2006-design
2. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/parthvichare20.md`
3. Read your task in `docs/tasks/team-3-*.md`
4. Read your team guide in `docs/teams/team-3-team-intelligence.md`
5. Create your branch
6. Begin implementation
