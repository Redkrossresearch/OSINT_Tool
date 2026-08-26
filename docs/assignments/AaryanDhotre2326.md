# Assignment: AaryanDhotre2326

## Identity

- **Name:** Aaryan Dhotre
- **GitHub:** AaryanDhotre2326
- **Team:** Team 2 (team-connectors)
- **Head Intern:** riddhisawant305-jpg (riddhisawant305-jpg)
- **Role:** Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T2-007 | DNS/RDAP Connector | DNS intelligence | T2-001, T1-008 | 2 | T2-001 done | DNS records returned | DNS/RDAP lookups return valid records | riddhisawant305-jpg | T2-016 |
| T2-008 | Certificate Intelligence Connector | CT log data | T2-001, T1-008 | 2 | T2-001 done | CT data returned | Certificate transparency data retrieved and normalized | riddhisawant305-jpg | T2-016 |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T2-007 | T2-001 (Connector Interface), T1-008 (Observation Schema) | Waiting for riddhisawant305-jpg, Zrahul2024 |
| T2-008 | T2-001 (Connector Interface), T1-008 (Observation Schema) | Waiting for riddhisawant305-jpg, Zrahul2024 |

## What I Can Work On While Waiting

- T2-017 backup (integration tests)
- Connector fixtures and test data
- PR reviews for team-connectors

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T2-007 | T2-016 (Unit Tests) | team-connectors |
| T2-008 | T2-016 (Unit Tests) | team-connectors |

## What I Must Not Modify

- `packages/schemas/` — owned by team-core
- `services/core/` — owned by team-core
- `services/intelligence/` — owned by team-intelligence
- `services/ai/` — owned by team-ai-verification
- `apps/web/` — owned by team-product

## Branch Naming

`feature/t2-007-dns-rdap-connector`

## PR Target

`team/2-team-connectors`

## Who Reviews

1. Team Head Intern: riddhisawant305-jpg
2. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/AaryanDhotre2326.md`
3. Read your task in `docs/tasks/team-2-*.md`
4. Read your team guide in `docs/teams/team-2-team-connectors.md`
5. Create your branch
6. Begin implementation
