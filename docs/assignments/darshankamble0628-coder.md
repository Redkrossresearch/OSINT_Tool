# Assignment: darshankamble0628-coder

## Identity

- **Name:** Darshan Kamble
- **GitHub:** darshankamble0628-coder
- **Team:** Team 2 (team-connectors)
- **Head Intern:** riddhisawant305-jpg (riddhisawant305-jpg)
- **Role:** Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T2-003 | Connector Registry | Discovery needed | T2-001 | 2 | T2-001 done | Registry works | Connectors can be registered and discovered | riddhisawant305-jpg | Unblocks T2-013 |
| T2-004 | Connector Configuration | Config management | T2-001 | 1 | T2-001 done | Config works | Connector configuration loaded and validated | riddhisawant305-jpg | None |
| T2-011 | Rate Limiting | Rate protection | T2-001 | 1 | T2-001 done | Rate limits work | Per-connector rate limits enforced | riddhisawant305-jpg | None |
| T2-012 | Timeout/Retry Handling | Resilience | T2-001 | 1 | T2-001 done | Retries work | Timeouts and exponential backoff work | riddhisawant305-jpg | None |
| T2-016 | Unit Tests | Quality gate | T2-005 through T2-015 | 2 | All connectors done | Coverage >= 80% | Unit test coverage meets threshold for all connectors | riddhisawant305-jpg | Unblocks T2-017 |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T2-003 | T2-001 (Connector Interface) | Waiting for riddhisawant305-jpg |
| T2-004 | T2-001 (Connector Interface) | Waiting for riddhisawant305-jpg |
| T2-011 | T2-001 (Connector Interface) | Waiting for riddhisawant305-jpg |
| T2-012 | T2-001 (Connector Interface) | Waiting for riddhisawant305-jpg |
| T2-016 | T2-005 through T2-015 (all connectors) | Waiting for all connector authors |

## What I Can Work On While Waiting

- T2-015 backup (security validation)
- Test infrastructure setup
- PR reviews for team-connectors

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T2-003 | T2-013 (Connector Health) | team-connectors |
| T2-016 | T2-017 (Integration Tests) | team-connectors |

## What I Must Not Modify

- `packages/schemas/` — owned by team-core
- `services/core/` — owned by team-core
- `services/intelligence/` — owned by team-intelligence
- `services/ai/` — owned by team-ai-verification
- `apps/web/` — owned by team-product

## Branch Naming

`feature/t2-003-connector-registry`

## PR Target

`team/2-team-connectors`

## Who Reviews

1. Team Head Intern: riddhisawant305-jpg
2. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/darshankamble0628-coder.md`
3. Read your task in `docs/tasks/team-2-*.md`
4. Read your team guide in `docs/teams/team-2-team-connectors.md`
5. Create your branch
6. Begin implementation
