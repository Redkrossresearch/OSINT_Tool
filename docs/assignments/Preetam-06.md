# Assignment: Preetam-06

## Identity

- **Name:** Preetam
- **GitHub:** Preetam-06
- **Team:** Team 1 (team-core)
- **Head Intern:** Preetam-06 (Preetam-06)
- **Role:** Head Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T1-001 | Repository/Monorepo Foundation | Everything depends on this | None | 2 | Day 1 | `pnpm install`, `pnpm build`, `pnpm lint` all work | Monorepo initializes, builds, and lints without errors | Ojas (ojas1216) | Unblocks T1-002 |
| T1-002 | Workspace/Package Configuration | All teams need workspace | T1-001 | 1 | T1-001 done | All packages recognized by pnpm | All workspace packages discovered and configured | Ojas (ojas1216) | Unblocks T1-003 |
| T1-016 | Core Service Structure | API needs service layer | T1-015 | 2 | T1-015 done | All services implemented | All service modules exist and compile | Ojas (ojas1216) | Unblocks T1-017, T1-018 |
| T1-017 | Core API | Team 5 needs API | T1-016 | 3 | T1-016 done | All endpoints work | All API endpoints respond correctly | Ojas (ojas1216) | Unblocks T5-003, T5-004, T5-005, T5-006 |
| T1-019 | Validation/Error Handling | Consistent errors | T1-017, T1-018 | 2 | APIs done | Middleware works | Validation middleware catches invalid input | Ojas (ojas1216) | Unblocks T1-020 |
| T1-022 | Documentation | MVP needs docs | T1-021 | 1 | Tests pass | All APIs documented | All endpoints have API docs | Ojas (ojas1216) | None |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T1-016 | T1-015 (Database/Prisma Foundation) | Waiting for jadhavsarthak374-ai |
| T1-017 | T1-016 (Core Service Structure) | Blocked until T1-016 done |
| T1-019 | T1-017, T1-018 | Blocked until APIs done |
| T1-021 | T1-020 (Unit Tests) | Blocked until tests done |
| T1-022 | T1-021 (Integration Tests) | Blocked until integration tests done |

## What I Can Work On While Waiting

- T1-003 backup (schema review)
- Team coordination across all teams
- PR reviews for team-core members
- Documentation planning

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T1-002 | T1-003 (Shared Zod Schema Package) | team-core |
| T1-002 | T1-004 through T1-010 (all schemas) | team-core |
| T1-002 | T3-001 (Entity Schema) | team-intelligence |
| T1-002 | T4-001 (Model Abstraction) | team-ai-verification |
| T1-002 | T5-001 (Next.js Application) | team-product |
| T1-017 | T5-003 through T5-006 (all frontend pages) | team-product |

## What I Must Not Modify

- `connectors/` — owned by team-connectors
- `services/intelligence/` — owned by team-intelligence
- `services/ai/` — owned by team-ai-verification
- `apps/web/` — owned by team-product

## Branch Naming

`feature/t1-001-repo-monorepo-foundation`

## PR Target

`team/1-team-core`

## Who Reviews

1. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/Preetam-06.md`
3. Read your task in `docs/tasks/team-1-*.md`
4. Read your team guide in `docs/teams/team-1-team-core.md`
5. Create your branch
6. Begin implementation
