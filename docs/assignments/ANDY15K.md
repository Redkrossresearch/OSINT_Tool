# Assignment: ANDY15K

## Identity

- **Name:** Andy
- **GitHub:** ANDY15K
- **Team:** Team 1 (team-core)
- **Head Intern:** Preetam-06 (Preetam-06)
- **Role:** Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T1-005 | Investigation Schema | Investigation types needed | T1-003, T1-004 | 2 | T1-004 done | State machine defined | Investigation schema validates, state machine transitions defined | Preetam-06 | Unblocks T1-013, T1-014, T4-007, T5-005 |
| T1-013 | Audit Event Model | Audit trail needed | T1-003, T1-005 | 1 | T1-005 done | Audit types defined | Audit event schema validates correctly | Preetam-06 | Unblocks T1-015, T3-013 |
| T1-014 | Investigation Lifecycle | State transitions needed | T1-005 | 2 | T1-005 done | Valid transitions enforced | All state transitions are validated, invalid transitions rejected | Preetam-06 | None |
| T1-021 | Integration Tests | Integration quality | T1-020 | 2 | Unit tests pass | Integration tests pass | Integration tests cover cross-module flows | Preetam-06 | Unblocks T1-022 |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T1-005 | T1-003 (Shared Zod Schema Package), T1-004 (Case Schema) | Waiting for Dinesh-Kumar-Ved |
| T1-013 | T1-005 (Investigation Schema) | Blocked until T1-005 done |
| T1-014 | T1-005 (Investigation Schema) | Blocked until T1-005 done |
| T1-021 | T1-020 (Unit Tests) | Waiting for jadhavsarthak374-ai |

## What I Can Work On While Waiting

- T1-020 backup (unit tests)
- Investigation state machine design
- PR reviews for team-core members

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T1-005 | T4-007 (Investigation Planner) | team-ai-verification |
| T1-005 | T5-005 (Investigation Creation) | team-product |
| T1-013 | T1-015 (Database/Prisma Foundation) | team-core |
| T1-013 | T3-013 (Investigation Timeline) | team-intelligence |
| T1-021 | T1-022 (Documentation) | team-core |

## What I Must Not Modify

- `connectors/` — owned by team-connectors
- `services/intelligence/` — owned by team-intelligence
- `services/ai/` — owned by team-ai-verification
- `apps/web/` — owned by team-product

## Branch Naming

`feature/t1-005-investigation-schema`

## PR Target

`team/1-team-core`

## Who Reviews

1. Team Head Intern: Preetam-06
2. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/ANDY15K.md`
3. Read your task in `docs/tasks/team-1-*.md`
4. Read your team guide in `docs/teams/team-1-team-core.md`
5. Create your branch
6. Begin implementation
