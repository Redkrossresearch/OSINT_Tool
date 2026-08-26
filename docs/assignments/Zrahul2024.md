# Assignment: Zrahul2024

## Identity

- **Name:** Rahul
- **GitHub:** Zrahul2024
- **Team:** Team 1 (team-core)
- **Head Intern:** Preetam-06 (Preetam-06)
- **Role:** Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T1-007 | Source Schema | Source types needed | T1-003 | 1 | T1-003 done | Source types defined | Source schema validates correctly with Zod | Preetam-06 | Unblocks T1-008, T1-009 |
| T1-008 | Observation Schema | CRITICAL: unblocks Teams 2,3 | T1-003, T1-007 | 2 | T1-007 done | Observation types defined | Observation schema validates correctly, contract between teams | Preetam-06 | Unblocks T2-001, T2-005 through T2-010, T3-003, T3-007 |
| T1-010 | Evidence Provenance Model | Provenance types needed | T1-003 | 1 | T1-003 done | Provenance types defined | Provenance schema validates correctly | Preetam-06 | None |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T1-007 | T1-003 (Shared Zod Schema Package) | Waiting for Dinesh-Kumar-Ved |
| T1-008 | T1-007 (Source Schema) | Blocked until T1-007 done |
| T1-010 | T1-003 (Shared Zod Schema Package) | Waiting for Dinesh-Kumar-Ved |

## What I Can Work On While Waiting

- T1-008 backup (observation schema review)
- Observation contract design
- PR reviews for team-core members

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T1-008 | T2-001 (Connector Interface) | team-connectors |
| T1-008 | T2-005 through T2-010 (all connectors) | team-connectors |
| T1-008 | T3-003 (Entity Extraction) | team-intelligence |
| T1-008 | T3-007 (Relationship Extraction) | team-intelligence |

## What I Must Not Modify

- `connectors/` — owned by team-connectors
- `services/intelligence/` — owned by team-intelligence
- `services/ai/` — owned by team-ai-verification
- `apps/web/` — owned by team-product

## Branch Naming

`feature/t1-007-source-schema`

## PR Target

`team/1-team-core`

## Who Reviews

1. Team Head Intern: Preetam-06
2. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/Zrahul2024.md`
3. Read your task in `docs/tasks/team-1-*.md`
4. Read your team guide in `docs/teams/team-1-team-core.md`
5. Create your branch
6. Begin implementation
