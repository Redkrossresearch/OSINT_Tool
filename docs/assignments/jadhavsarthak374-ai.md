# Assignment: jadhavsarthak374-ai

## Identity

- **Name:** Sarthak Jadhav
- **GitHub:** jadhavsarthak374-ai
- **Team:** Team 1 (team-core)
- **Head Intern:** Preetam-06 (Preetam-06)
- **Role:** Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T1-009 | Evidence Schema | Evidence types needed | T1-003, T1-007 | 2 | T1-007 done | Evidence types defined | Evidence schema validates correctly with Zod | Preetam-06 | Unblocks T1-011, T1-012, T1-015, T4-008, T4-010 |
| T1-011 | Evidence Hashing | Integrity required | T1-009 | 1 | T1-009 done | SHA-256 works | SHA-256 hashing produces correct, deterministic hashes | Preetam-06 | Unblocks T1-018 |
| T1-015 | Database/Prisma Foundation | CRITICAL: all data storage | T1-001, T1-004, T1-005, T1-008, T1-009, T1-013 | 3 | All deps done | PostgreSQL + Prisma working | Prisma schema generates, migrations run, DB connects | Preetam-06 | Unblocks T1-016, T3-008, T4-014 |
| T1-018 | Evidence API | Evidence endpoints needed | T1-016, T1-011 | 2 | Services + hashing done | Evidence stored with hash | Evidence CRUD endpoints work with integrity hashing | Preetam-06 | Unblocks T1-019, T5-007, T5-013 |
| T1-020 | Unit Tests | Quality gate | T1-016, T1-017, T1-018, T1-019 | 2 | All core done | Coverage >= 80% | Unit test coverage meets threshold | Preetam-06 | Unblocks T1-021 |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T1-009 | T1-003 (Shared Zod Schema Package), T1-007 (Source Schema) | Waiting for Dinesh-Kumar-Ved, Zrahul2024 |
| T1-011 | T1-009 (Evidence Schema) | Blocked until T1-009 done |
| T1-015 | T1-001, T1-004, T1-005, T1-008, T1-009, T1-013 | Waiting for multiple team members |
| T1-018 | T1-016 (Core Service Structure), T1-011 | Waiting for Preetam-06 + own T1-011 |
| T1-020 | T1-016, T1-017, T1-018, T1-019 | Waiting for all core tasks to complete |

## What I Can Work On While Waiting

- T1-012 backup (metadata)
- Schema design review
- PR reviews for team-core members

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T1-015 | T1-016 (Core Service Structure) | team-core |
| T1-015 | T3-008 (Graph Schema) | team-intelligence |
| T1-015 | T4-014 (AI Audit Logging) | team-ai-verification |
| T1-018 | T1-019 (Validation/Error Handling) | team-core |
| T1-018 | T5-007 (Evidence Viewer) | team-product |
| T1-018 | T5-013 (Report Generation) | team-product |

## What I Must Not Modify

- `connectors/` — owned by team-connectors
- `services/intelligence/` — owned by team-intelligence
- `services/ai/` — owned by team-ai-verification
- `apps/web/` — owned by team-product

## Branch Naming

`feature/t1-009-evidence-schema`

## PR Target

`team/1-team-core`

## Who Reviews

1. Team Head Intern: Preetam-06
2. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/jadhavsarthak374-ai.md`
3. Read your task in `docs/tasks/team-1-*.md`
4. Read your team guide in `docs/teams/team-1-team-core.md`
5. Create your branch
6. Begin implementation
