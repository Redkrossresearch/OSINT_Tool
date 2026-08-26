# Assignment: riddhisawant305-jpg

## Identity

- **Name:** Riddhi Sawant
- **GitHub:** riddhisawant305-jpg
- **Team:** Team 2 (team-connectors)
- **Head Intern:** riddhisawant305-jpg (riddhisawant305-jpg)
- **Role:** Head Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T2-001 | Connector Interface | Foundation for all connectors | T1-008 | 3 | T1-008 done | Interface defined, base class works | Interface compiles, base class can be extended | Ojas (ojas1216) | Unblocks T2-002 through T2-015 |
| T2-002 | Connector Result Contract | Result format needed | T2-001, T1-008 | 2 | T2-001 done | Result types defined | Result contract validates all connector outputs | Ojas (ojas1216) | None |
| T2-013 | Connector Health | Health checks needed | T2-003 | 1 | T2-003 done | Health checks work | Health endpoint returns status for all connectors | Ojas (ojas1216) | None |
| T2-014 | Connector Logging | Activity logging needed | T2-001 | 1 | T2-001 done | Logging works | All connector actions are logged | Ojas (ojas1216) | None |
| T2-015 | Connector Security Validation | SSRF protection | T2-001 | 2 | T2-001 done | Security validation works | SSRF, path traversal, and injection blocked | Ojas (ojas1216) | None |
| T2-018 | Connector Documentation | MVP needs docs | T2-017 | 1 | Tests pass | Framework documented | All connectors documented with examples | Ojas (ojas1216) | None |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T2-001 | T1-008 (Observation Schema) | Waiting for Zrahul2024 |
| T2-002 | T2-001 (Connector Interface) | Blocked until T2-001 done |
| T2-013 | T2-003 (Connector Registry) | Waiting for darshankamble0628-coder |
| T2-014 | T2-001 (Connector Interface) | Blocked until T2-001 done |
| T2-015 | T2-001 (Connector Interface) | Blocked until T2-001 done |
| T2-017 | T2-016 (Unit Tests) | Waiting for darshankamble0628-coder |
| T2-018 | T2-017 (Integration Tests) | Blocked until T2-017 done |

## What I Can Work On While Waiting

- PR reviews for team-connectors
- Team coordination across all teams
- Connector framework refinements and design
- Review T1-008 observation schema

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T2-001 | T2-002 (Connector Result Contract) | team-connectors |
| T2-001 | T2-003 through T2-012 (all connector infra) | team-connectors |
| T2-001 | T2-005 through T2-010 (all connectors) | team-connectors |

## What I Must Not Modify

- `packages/schemas/` — owned by team-core
- `services/core/` — owned by team-core
- `services/intelligence/` — owned by team-intelligence
- `services/ai/` — owned by team-ai-verification
- `apps/web/` — owned by team-product

## Branch Naming

`feature/t2-001-connector-interface`

## PR Target

`team/2-team-connectors`

## Who Reviews

1. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/riddhisawant305-jpg.md`
3. Read your task in `docs/tasks/team-2-*.md`
4. Read your team guide in `docs/teams/team-2-team-connectors.md`
5. Create your branch
6. Begin implementation
