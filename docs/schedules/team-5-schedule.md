# Team 5 Schedule — Frontend & Integration Layer

## Team Information

| Field | Value |
|-------|-------|
| **Team Name** | Team 5 — Frontend & Integration Layer |
| **GitHub Team** | @osint-tool/team-5 |
| **Head Intern** | Ishauparkar13 |
| **Total Tasks** | 19 |
| **Total Effort** | 39 |

## Members

| GitHub Handle | Role |
|---------------|------|
| Ishauparkar13 | Head Intern |
| aryanbhosale20 | Member |
| dakshjadyar | Member |
| Deepkasare | Member |
| krishnasondigala-sys | Member |

## Critical Path

```
T1-003 (Team 1) → T5-001 → T5-002 → T5-003/T5-004/T5-006 → T5-005 → ... → T5-013 → T5-014 → T5-017 → T5-018 → T5-019
```

## Blocked Status

> Team has MULTIPLE external blockers from Teams 1, 3, and 4:
> - **T1-003** (Schema Contract from Team 1) — blocks Wave A
> - **T1-005** (Investigation Schema from Team 1) — blocks Wave D
> - **T1-017** (Core API from Team 1) — blocks Waves C, D
> - **T1-018** (Evidence API from Team 1) — blocks Waves E, K
> - **T3-014** (Entity API from Team 3) — blocks Waves F, K
> - **T3-011** (Graph API from Team 3) — blocks Wave G
> - **T3-013** (Timeline from Team 3) — blocks Wave H
> - **T4-011** (Verification Engine from Team 4) — blocks Waves I, K
> - **T4-013** (Human-Review States from Team 4) — blocks Wave J

## Task Sequence (Dependency-Ordered)

### Wave A — Blocked on T1-003 (Team 1)
| Task | Assignee | Blocked By |
|------|----------|------------|
| T5-001 | Ishauparkar13 | T1-003 (Team 1) |

### Wave B — Blocked on T5-001
| Task | Assignee | Blocked By |
|------|----------|------------|
| T5-002 | Ishauparkar13 | T5-001 |
| T5-015 | dakshjadyar | T5-001 |
| T5-016 | dakshjadyar | T5-001 |

> **Parallel:** T5-002, T5-015, T5-016 — execute simultaneously after T5-001.

### Wave C — Blocked on T5-002 + T1-017 (Team 1)
| Task | Assignee | Blocked By |
|------|----------|------------|
| T5-003 | aryanbhosale20 | T5-002 + T1-017 (Team 1) |
| T5-004 | aryanbhosale20 | T5-002 + T1-017 (Team 1) |
| T5-006 | dakshjadyar | T5-002 + T1-017 (Team 1) |

> **Parallel:** T5-003, T5-004, T5-006 — execute simultaneously once both blockers clear.

### Wave D — Blocked on T5-002 + T1-017 + T1-005
| Task | Assignee | Blocked By |
|------|----------|------------|
| T5-005 | aryanbhosale20 | T5-002 + T1-017 (Team 1) + T1-005 (Team 1) |

### Wave E — Blocked on T5-002 + T1-018 (Team 1)
| Task | Assignee | Blocked By |
|------|----------|------------|
| T5-007 | dakshjadyar | T5-002 + T1-018 (Team 1) |

### Wave F — Blocked on T5-002 + T3-014 (Team 3)
| Task | Assignee | Blocked By |
|------|----------|------------|
| T5-008 | Deepkasare | T5-002 + T3-014 (Team 3) |

### Wave G — Blocked on T5-002 + T3-011 (Team 3)
| Task | Assignee | Blocked By |
|------|----------|------------|
| T5-009 | Deepkasare | T5-002 + T3-011 (Team 3) |

### Wave H — Blocked on T5-002 + T3-013 (Team 3)
| Task | Assignee | Blocked By |
|------|----------|------------|
| T5-010 | Deepkasare | T5-002 + T3-013 (Team 3) |

### Wave I — Blocked on T5-002 + T4-011 (Team 4)
| Task | Assignee | Blocked By |
|------|----------|------------|
| T5-011 | krishnasondigala-sys | T5-002 + T4-011 (Team 4) |

### Wave J — Blocked on T5-011 + T4-013 (Team 4)
| Task | Assignee | Blocked By |
|------|----------|------------|
| T5-012 | krishnasondigala-sys | T5-011 + T4-013 (Team 4) |

### Wave K — Multi-Team Convergence
| Task | Assignee | Blocked By |
|------|----------|------------|
| T5-013 | krishnasondigala-sys | T5-002 + T1-018 (Team 1) + T3-014 (Team 3) + T4-011 (Team 4) |

> T5-013 is the integration convergence point — requires APIs from Teams 1, 3, and 4.

### Wave L — Blocked on T5-013
| Task | Assignee | Blocked By |
|------|----------|------------|
| T5-014 | krishnasondigala-sys | T5-013 |

### Wave M — Final Convergence
| Task | Assignee | Blocked By |
|------|----------|------------|
| T5-017 | Deepkasare | T5-002 through T5-016 (all prior tasks) |

> T5-017 is the final convergence — all frontend work must complete before this.

### Wave N
| Task | Assignee | Blocked By |
|------|----------|------------|
| T5-018 | krishnasondigala-sys | T5-017 |

### Wave O
| Task | Assignee | Blocked By |
|------|----------|------------|
| T5-019 | Ishauparkar13 | T5-018 |

## Blocked Tasks

| Task | Waiting For | Status |
|------|-------------|--------|
| T5-001 | T1-003 (Team 1) | **BLOCKED — external** |
| T5-002 | T5-001 | Blocked |
| T5-003 | T5-002 + T1-017 (Team 1) | **BLOCKED — external + internal** |
| T5-004 | T5-002 + T1-017 (Team 1) | **BLOCKED — external + internal** |
| T5-005 | T5-002 + T1-017 (Team 1) + T1-005 (Team 1) | **BLOCKED — external + internal** |
| T5-006 | T5-002 + T1-017 (Team 1) | **BLOCKED — external + internal** |
| T5-007 | T5-002 + T1-018 (Team 1) | **BLOCKED — external + internal** |
| T5-008 | T5-002 + T3-014 (Team 3) | **BLOCKED — external + internal** |
| T5-009 | T5-002 + T3-011 (Team 3) | **BLOCKED — external + internal** |
| T5-010 | T5-002 + T3-013 (Team 3) | **BLOCKED — external + internal** |
| T5-011 | T5-002 + T4-011 (Team 4) | **BLOCKED — external + internal** |
| T5-012 | T5-011 + T4-013 (Team 4) | **BLOCKED — external + internal** |
| T5-013 | T5-002 + T1-018 (Team 1) + T3-014 (Team 3) + T4-011 (Team 4) | **BLOCKED — multi-team** |
| T5-014 | T5-013 | Blocked |
| T5-015 | T5-001 | Blocked |
| T5-016 | T5-001 | Blocked |
| T5-017 | T5-002 through T5-016 | Blocked |
| T5-018 | T5-017 | Blocked |
| T5-019 | T5-018 | Blocked |

## Unblocked Tasks

None — T5-001 is gated on T1-003 (Team 1).

## Independent Tasks While Waiting

| Phase | Tasks | Condition |
|-------|-------|-----------|
| After T1-003 | T5-001 | Can start immediately — no other dependency |
| After T5-002 | T5-015, T5-016 | No backend dependency — frontend-only work |

> T5-015 and T5-016 are pure frontend tasks that don't require any backend API — they can proceed as soon as T5-001 completes, without waiting for Teams 1, 3, or 4.

## Expected Handoffs (Outputs to Other Teams)

| Source Task | Recipient Team(s) | Deliverable |
|-------------|--------------------|-------------|
| — | — | Team 5 is the final consumer — no outbound handoffs to other teams |

> Team 5 is the integration endpoint. It consumes all outputs from Teams 1, 3, and 4 and produces the final user-facing application.

## Review Points

| Review | After Task | Scope |
|--------|------------|-------|
| R5-01 | T5-001 | Frontend foundation review |
| R5-02 | T5-002 | Core layout/routing review |
| R5-03 | T5-003/T5-004 | API integration review (Team 1 APIs) |
| R5-04 | T5-005 | Investigation planner frontend review |
| R5-05 | T5-007 | Evidence view review (Team 1 Evidence API) |
| R5-06 | T5-008 | Entity display review (Team 3 Entity API) |
| R5-07 | T5-009 | Graph visualization review (Team 3 Graph API) |
| R5-08 | T5-010 | Timeline view review (Team 3 Timeline) |
| R5-09 | T5-011 | Verification view review (Team 4 Verification Engine) |
| R5-10 | T5-013 | Full integration convergence review |
| R5-11 | T5-017 | Final integration review — all components |
| R5-12 | T5-019 | Final team completion review |

## Integration Points

| Integration | Task | With Team | Direction | Description |
|-------------|------|-----------|-----------|-------------|
| IP-1 | T5-001 | Team 1 | Inbound | Receives T1-003 schema contract |
| IP-2 | T5-003–T5-006 | Team 1 | Inbound | Receives T1-017 Core API |
| IP-3 | T5-005 | Team 1 | Inbound | Receives T1-005 Investigation Schema |
| IP-4 | T5-007, T5-013 | Team 1 | Inbound | Receives T1-018 Evidence API |
| IP-5 | T5-008, T5-013 | Team 3 | Inbound | Receives T3-014 Entity API |
| IP-6 | T5-009 | Team 3 | Inbound | Receives T3-011 Graph API |
| IP-7 | T5-010 | Team 3 | Inbound | Receives T3-013 Timeline |
| IP-8 | T5-011, T5-013 | Team 4 | Inbound | Receives T4-011 Verification Engine |
| IP-9 | T5-012 | Team 4 | Inbound | Receives T4-013 Human-Review States |
| IP-10 | T5-017 | All Teams | Convergence | Final integration of all team outputs |

## Dependency Heatmap

```
Incoming dependencies by source team:
  Team 1: T1-003, T1-005, T1-017, T1-018 (4 tasks)
  Team 3: T3-011, T3-013, T3-014 (3 tasks)
  Team 4: T4-011, T4-013 (2 tasks)
  Total: 9 external dependencies from 3 teams
```

## Summary

```
Team 5: 19 tasks | 39 effort | 15 waves | 9 external dependencies (highest in project)
Parallel groups: Wave B (3 tasks), Wave C (3 tasks)
Critical convergence: T5-013 (multi-team), T5-017 (final integration)
Outbound handoffs: 0 (Team 5 is the endpoint)
Team 5 is the integration sink — all team outputs converge here. Highest effort, most dependencies.
```
