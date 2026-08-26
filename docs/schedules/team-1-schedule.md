# Team 1 Schedule — Schema & API Foundation

## Team Information

| Field | Value |
|-------|-------|
| **Team Name** | Team 1 — Schema & API Foundation |
| **GitHub Team** | @osint-tool/team-1 |
| **Head Intern** | Preetam-06 |
| **Total Tasks** | 22 |
| **Total Effort** | 28 |

## Members

| GitHub Handle | Role |
|---------------|------|
| Preetam-06 | Head Intern |
| Dinesh-Kumar-Ved | Member |
| Zrahul2024 | Member |
| jadhavsarthak374-ai | Member |
| ANDY15K | Member |

## Critical Path

```
T1-001 → T1-002 → T1-003 → T1-005 → T1-013 → T1-015 → T1-016 → T1-017 → T1-019 → T1-020 → T1-021 → T1-022
```

## Task Sequence (Dependency-Ordered)

### Wave 1
| Task | Assignee | Blocked By |
|------|----------|------------|
| T1-001 | Preetam-06 | None (project start) |

### Wave 2
| Task | Assignee | Blocked By |
|------|----------|------------|
| T1-002 | Preetam-06 | T1-001 |

### Wave 3 — Parallel Block
| Task | Assignee | Blocked By |
|------|----------|------------|
| T1-003 | Dinesh-Kumar-Ved | T1-002 |
| T1-006 | Dinesh-Kumar-Ved | T1-002 |
| T1-007 | Zrahul2024 | T1-002 |
| T1-010 | Zrahul2024 | T1-002 |

> **Parallel:** T1-003, T1-006, T1-007, T1-010 — all can execute simultaneously after T1-002 completes.

### Wave 4 — Parallel Block
| Task | Assignee | Blocked By |
|------|----------|------------|
| T1-004 | Dinesh-Kumar-Ved | T1-003 |
| T1-008 | Zrahul2024 | T1-003 |
| T1-009 | jadhavsarthak374-ai | T1-003 |
| T1-005 | ANDY15K | T1-003 |

> **Parallel:** T1-004, T1-008, T1-009, T1-005 — all can execute simultaneously after T1-003 completes.

### Wave 5 — Parallel Block
| Task | Assignee | Blocked By |
|------|----------|------------|
| T1-013 | ANDY15K | T1-005 |
| T1-014 | ANDY15K | T1-005 |
| T1-011 | jadhavsarthak374-ai | T1-009 |
| T1-012 | Dinesh-Kumar-Ved | T1-004 |

> **Parallel:** T1-013, T1-014, T1-011, T1-012 — execute as soon as their individual dependencies complete.

### Wave 6
| Task | Assignee | Blocked By |
|------|----------|------------|
| T1-015 | jadhavsarthak374-ai | T1-013 |

### Wave 7
| Task | Assignee | Blocked By |
|------|----------|------------|
| T1-016 | Preetam-06 | T1-015 |

### Wave 8 — Parallel Block
| Task | Assignee | Blocked By |
|------|----------|------------|
| T1-017 | Preetam-06 | T1-016 |
| T1-018 | jadhavsarthak374-ai | T1-016 |

> **Parallel:** T1-017, T1-018 — can execute simultaneously after T1-016.

### Wave 9
| Task | Assignee | Blocked By |
|------|----------|------------|
| T1-019 | Preetam-06 | T1-017 |

### Wave 10
| Task | Assignee | Blocked By |
|------|----------|------------|
| T1-020 | jadhavsarthak374-ai | T1-019 |

### Wave 11
| Task | Assignee | Blocked By |
|------|----------|------------|
| T1-021 | ANDY15K | T1-020 |

### Wave 12
| Task | Assignee | Blocked By |
|------|----------|------------|
| T1-022 | Preetam-06 | T1-021 |

## Blocked Tasks

| Task | Waiting For | Status |
|------|-------------|--------|
| T1-002 | T1-001 | Blocked |
| T1-003 | T1-002 | Blocked |
| T1-004 | T1-003 | Blocked |
| T1-005 | T1-003 | Blocked |
| T1-006 | T1-002 | Blocked |
| T1-007 | T1-002 | Blocked |
| T1-008 | T1-003 | Blocked |
| T1-009 | T1-003 | Blocked |
| T1-010 | T1-002 | Blocked |
| T1-011 | T1-009 | Blocked |
| T1-012 | T1-004 | Blocked |
| T1-013 | T1-005 | Blocked |
| T1-014 | T1-005 | Blocked |
| T1-015 | T1-013 | Blocked |
| T1-016 | T1-015 | Blocked |
| T1-017 | T1-016 | Blocked |
| T1-018 | T1-016 | Blocked |
| T1-019 | T1-017 | Blocked |
| T1-020 | T1-019 | Blocked |
| T1-021 | T1-020 | Blocked |
| T1-022 | T1-021 | Blocked |

## Unblocked Tasks

| Task | Assignee | Notes |
|------|----------|-------|
| T1-001 | Preetam-06 | Project start — no dependencies |

## Independent Tasks (No Cross-Team Dependencies)

| Task | Assignee | Description |
|------|----------|-------------|
| T1-001 | Preetam-06 | Initial setup, no team dependency |
| T1-002 | Preetam-06 | Foundation work, no team dependency |
| T1-006 | Dinesh-Kumar-Ved | Parallel to T1-003, no external dependency |
| T1-007 | Zrahul2024 | Parallel to T1-003, no external dependency |
| T1-009 | jadhavsarthak374-ai | Parallel to T1-008, no external dependency |
| T1-010 | Zrahul2024 | Parallel to T1-003, no external dependency |
| T1-011 | jadhavsarthak374-ai | Internal follow-up |
| T1-012 | Dinesh-Kumar-Ved | Internal follow-up |
| T1-014 | ANDY15K | Internal follow-up |
| T1-016 | Preetam-06 | Internal integration |
| T1-019 | Preetam-06 | Internal validation |
| T1-020 | jadhavsarthak374-ai | Internal testing |
| T1-021 | ANDY15K | Internal documentation |
| T1-022 | Preetam-06 | Final handoff prep |

## Expected Handoffs (Outputs to Other Teams)

| Source Task | Recipient Team(s) | Deliverable |
|-------------|--------------------|-------------|
| T1-003 | Teams 2, 3, 4, 5 | Schema Contract |
| T1-008 | Teams 2, 3 | Observation Contract |
| T1-005 | Team 4 | Investigation Schema for Planner |
| T1-015 | Team 3 | Database Foundation for Graph |
| T1-017 | Team 5 | Core API for Frontend |
| T1-018 | Team 5 | Evidence API for Frontend |

## Review Points

| Review | After Task | Scope |
|--------|------------|-------|
| R1-01 | T1-001 | Project initialization review |
| R1-02 | T1-003 | Schema contract review — all teams depend on this |
| R1-03 | T1-005 | Investigation schema review — Team 4 blocker |
| R1-04 | T1-008 | Observation contract review — Teams 2,3 blocker |
| R1-05 | T1-015 | Database foundation review — Team 3 blocker |
| R1-06 | T1-017 | Core API review — Team 5 blocker |
| R1-07 | T1-018 | Evidence API review — Team 5 integration |
| R1-08 | T1-022 | Final team completion review |

## Integration Points

| Integration | Task | With Team | Direction | Description |
|-------------|------|-----------|-----------|-------------|
| IP-1 | T1-003 | Teams 2,3,4,5 | Outbound | Schema contract published |
| IP-2 | T1-008 | Teams 2,3 | Outbound | Observation contract published |
| IP-3 | T1-005 | Team 4 | Outbound | Investigation schema sent to planner |
| IP-4 | T1-015 | Team 3 | Outbound | Database foundation for graph system |
| IP-5 | T1-017 | Team 5 | Outbound | Core API delivered to frontend |
| IP-6 | T1-018 | Team 5 | Outbound | Evidence API delivered to frontend |

## Summary

```
Team 1: 22 tasks | 28 effort | 12 waves | 1 critical path
Parallel groups: Wave 3 (4 tasks), Wave 4 (4 tasks), Wave 5 (4 tasks), Wave 8 (2 tasks)
Outbound handoffs: 6 (to Teams 2,3,4,5)
Team 1 is the foundation team — all other teams are blocked on Team 1 outputs.
```
