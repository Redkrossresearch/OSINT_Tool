# Assignment: shraddhamahindrakar217-cloud

## Identity

- **Name:** Shraddha Mahindrakar
- **GitHub:** shraddhamahindrakar217-cloud
- **Team:** Team 4 (team-ai-verification)
- **Head Intern:** sumeetmore334-rgb (sumeetmore334-rgb)
- **Role:** Intern

## Primary Tasks

| Task ID | Title | Why | Dependencies | Effort | Expected Start Condition | Expected Completion Condition | Acceptance Criteria | Reviewer | Expected Handoff |
|---------|-------|-----|--------------|--------|--------------------------|-------------------------------|---------------------|----------|------------------|
| T4-010 | Contradiction Detection | Verification core | T4-001, T1-009 | 3 | T4-001 + T1-009 done | Contradictions detected | Contradictions between evidence sources identified | sumeetmore334-rgb | Unblocks T4-011, T4-018 |
| T4-011 | Verification Engine | Verification workflow | T4-010 | 3 | Detection done | Verification works | Full verification pipeline works end-to-end | sumeetmore334-rgb | Unblocks T4-013, T5-011, T5-013 |
| T4-012 | Confidence Calculation | Scoring needed | T4-001 | 2 | T4-001 done | Scores work | Confidence scores calculated for all findings | sumeetmore334-rgb | None |
| T4-013 | Human-Review State | Review workflow | T4-011 | 2 | Verification done | States work | Human review state transitions enforced | sumeetmore334-rgb | Unblocks T5-012 |
| T4-014 | AI Audit Logging | Audit trail | T4-001, T1-015 | 2 | T4-001 + DB done | Logging works | All AI actions logged to audit trail | sumeetmore334-rgb | None |
| T4-015 | Prompt Injection Defenses | Security | T4-001 | 2 | T4-001 done | Injection detected | Prompt injection attempts detected and blocked | sumeetmore334-rgb | None |
| T4-019 | Integration Tests | Quality gate | T4-018 | 2 | Evaluation done | Integration works | AI verification integration tests pass | sumeetmore334-rgb | Unblocks T4-020 |

## What I Am Waiting For

| Blocked Task | Depends On | Status |
|-------------|------------|--------|
| T4-010 | T4-001 (Model Abstraction), T1-009 (Evidence Schema) | Waiting for sumeetmore334-rgb, jadhavsarthak374-ai |
| T4-011 | T4-010 (Contradiction Detection) | Blocked until T4-010 done |
| T4-012 | T4-001 (Model Abstraction) | Waiting for sumeetmore334-rgb |
| T4-013 | T4-011 (Verification Engine) | Blocked until T4-011 done |
| T4-014 | T4-001 (Model Abstraction), T1-015 (Database/Prisma Foundation) | Waiting for sumeetmore334-rgb, jadhavsarthak374-ai |
| T4-015 | T4-001 (Model Abstraction) | Waiting for sumeetmore334-rgb |
| T4-019 | T4-018 (Evaluation Tests) | Waiting for anujmore2006-collab |

## What I Can Work On While Waiting

- T4-019 backup (integration tests)
- Verification fixtures and test data
- PR reviews for team-ai-verification

## What Unlocks After My Tasks

| My Task | Downstream Task | Team |
|---------|----------------|------|
| T4-011 | T5-011 (Findings View) | team-product |
| T4-011 | T5-013 (Report Generation) | team-product |
| T4-013 | T5-012 (Verification View) | team-product |
| T4-019 | T4-020 (Documentation) | team-ai-verification |

## What I Must Not Modify

- `packages/schemas/` — owned by team-core
- `services/core/` — owned by team-core
- `connectors/` — owned by team-connectors
- `services/intelligence/` — owned by team-intelligence
- `apps/web/` — owned by team-product

## Branch Naming

`feature/t4-010-contradiction-detection`

## PR Target

`team/4-team-ai-verification`

## Who Reviews

1. Team Head Intern: sumeetmore334-rgb
2. Technical Architect: Ojas (ojas1216)

## How to Report Blockers

Contact your head intern, or post in the team channel.

## Start Here

1. Read `docs/INTERN_QUICK_START.md`
2. Read `docs/assignments/shraddhamahindrakar217-cloud.md`
3. Read your task in `docs/tasks/team-4-*.md`
4. Read your team guide in `docs/teams/team-4-team-ai-verification.md`
5. Create your branch
6. Begin implementation
