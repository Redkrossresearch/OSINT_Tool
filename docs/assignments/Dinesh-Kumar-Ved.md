# Assignment: Dinesh-Kumar-Ved

## Identity

- **Name:** Dinesh Kumar Ved
- **GitHub:** Dinesh-Kumar-Ved
- **Team:** Team 1 (team-core)
- **Head Intern:** Preetam-06 (Preetam-06)
- **Role:** Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T1-003 | Shared Zod Schema Package | CRITICAL: 42 tasks depend on this | T1-002 | 2 | T1-002 done | Package builds, types exported | Package installs, builds, and exports all schema types | Preetam-06 | Unblocks T1-004, T1-006, T1-007, T1-010, T3-001, T4-001, T5-001 |
| T1-004 | Case Schema | Case types needed | T1-003 | 1 | T1-003 done | Case types defined | Case schema validates correctly with Zod | Preetam-06 | Unblocks T1-005 |
| T1-006 | Objective Schema | Objective types needed | T1-003 | 1 | T1-003 done | Objective types defined | Objective schema validates correctly with Zod | Preetam-06 | None |
| T1-012 | Evidence Metadata | Metadata types needed | T1-009 | 1 | T1-009 done | Metadata types defined | Evidence metadata schema validates correctly | Preetam-06 | None |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T1-003 | T1-002 (Workspace/Package Configuration) | Waiting for Preetam-06 |
| T1-004 | T1-003 (Shared Zod Schema Package) | Blocked until T1-003 done |
| T1-006 | T1-003 (Shared Zod Schema Package) | Blocked until T1-003 done |
| T1-012 | T1-009 (Evidence Schema) | Waiting for jadhavsarthak374-ai |

## What I Can Work On While Waiting

- T1-011 backup (evidence hashing)
- Schema design review and planning
- PR reviews for team-core members

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T1-003 | T1-004 (Case Schema) | team-core |
| T1-003 | T1-005 (Investigation Schema) | team-core |
| T1-003 | T1-006 (Objective Schema) | team-core |
| T1-003 | T1-007 (Source Schema) | team-core |
| T1-003 | T1-008 (Observation Schema) | team-core |
| T1-003 | T1-009 (Evidence Schema) | team-core |
| T1-003 | T1-010 (Evidence Provenance Model) | team-core |
| T1-003 | T3-001 (Entity Schema) | team-intelligence |
| T1-003 | T4-001 (Model Abstraction) | team-ai-verification |
| T1-003 | T5-001 (Next.js Application) | team-product |

## What I Must Not Modify

- `connectors/` — owned by team-connectors
- `services/intelligence/` — owned by team-intelligence
- `services/ai/` — owned by team-ai-verification
- `apps/web/` — owned by team-product

## Branch Naming

`feature/t1-003-shared-zod-schema`

## PR Target

`team/1-team-core`

## Who Reviews

1. Team Head Intern: Preetam-06
2. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/Dinesh-Kumar-Ved.md`
3. Read your task in `docs/tasks/team-1-*.md`
4. Read your team guide in `docs/teams/team-1-team-core.md`
5. Create your branch
6. Begin implementation
