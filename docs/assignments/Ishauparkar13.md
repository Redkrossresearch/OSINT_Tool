# Assignment: Ishauparkar13

## Identity

- **Name:** Ishau Parkar
- **GitHub:** Ishauparkar13
- **Team:** Team 5 (team-product)
- **Head Intern:** Ishauparkar13 (Ishauparkar13)
- **Role:** Head Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T5-001 | Next.js Application | Frontend foundation | T1-003 | 2 | T1-003 done | App starts | `pnpm dev` starts Next.js app | Ojas (ojas1216) | Unblocks T5-002 |
| T5-002 | Application Layout | Navigation needed | T5-001 | 2 | T5-001 done | Layout works | Layout renders, navigation works | Ojas (ojas1216) | Unblocks T5-003 through T5-016 |
| T5-019 | Documentation | MVP needs docs | T5-018 | 1 | Tests pass | Product documented | All UI components documented | Ojas (ojas1216) | None |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T5-001 | T1-003 (Shared Zod Schema Package) | Waiting for Dinesh-Kumar-Ved |
| T5-002 | T5-001 (Next.js Application) | Blocked until T5-001 done |
| T5-018 | T5-002 through T5-016 (all UI tasks) | Waiting for all team members |

## What I Can Work On While Waiting

- PR reviews for team-product
- Team coordination across all teams
- Component design and planning
- Review T1-003 schema package

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T5-001 | T5-002 (Application Layout) | team-product |
| T5-002 | T5-003 (Dashboard) | team-product |
| T5-002 | T5-004 (Case Creation) | team-product |
| T5-002 | T5-005 (Investigation Creation) | team-product |
| T5-002 | T5-006 (Investigation Status) | team-product |
| T5-002 | T5-007 (Evidence Viewer) | team-product |
| T5-002 | T5-008 (Entity Viewer) | team-product |
| T5-002 | T5-009 (Graph View) | team-product |
| T5-002 | T5-010 (Timeline) | team-product |
| T5-002 | T5-011 (Findings View) | team-product |
| T5-002 | T5-015 (Error/Loading States) | team-product |
| T5-002 | T5-016 (Accessibility) | team-product |

## What I Must Not Modify

- `packages/schemas/` — owned by team-core
- `services/core/` — owned by team-core
- `connectors/` — owned by team-connectors
- `services/intelligence/` — owned by team-intelligence
- `services/ai/` — owned by team-ai-verification

## Branch Naming

`feature/t5-001-nextjs-application`

## PR Target

`team/5-team-product`

## Who Reviews

1. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/Ishauparkar13.md`
3. Read your task in `docs/tasks/team-5-*.md`
4. Read your team guide in `docs/teams/team-5-team-product.md`
5. Create your branch
6. Begin implementation
