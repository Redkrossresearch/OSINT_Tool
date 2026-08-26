# Team 3 Schedule — Knowledge Graph & Entity Extraction

## Team Information

| Field | Value |
|-------|-------|
| **Team Name** | Team 3 — Knowledge Graph & Entity Extraction |
| **GitHub Team** | @osint-tool/team-3 |
| **Head Intern** | hirveabhishek2006-design |
| **Total Tasks** | 18 |
| **Total Effort** | 34 |

## Members

| GitHub Handle | Role |
|---------------|------|
| hirveabhishek2006-design | Head Intern |
| katkarsujal1-design | Member |
| raunaksin9890-gif | Member |
| Pannkajyadhav333 | Member |
| parthvichare20 | Member |
| lahanesakahi-create | Member (PENDING) |

## Critical Path

```
T1-003 (Team 1) → T3-001 → T3-002/T3-004/T3-006 → T3-003 → T3-005 → T3-008 → T3-009 → T3-010 → T3-011 → ...
```

## Blocked Status

> Team has TWO external blockers:
> 1. **T1-003** (Schema Contract from Team 1) — blocks Wave A
> 2. **T1-008** (Observation Contract from Team 1) — blocks Wave C (via T3-003, T3-007)
> 3. **T1-015** (Database Foundation from Team 1) — blocks Wave D (via T3-008)

## Task Sequence (Dependency-Ordered)

### Wave A — Blocked on T1-003 (Team 1)
| Task | Assignee | Blocked By |
|------|----------|------------|
| T3-001 | hirveabhishek2006-design | T1-003 (Team 1) |

### Wave B — Blocked on T3-001
| Task | Assignee | Blocked By |
|------|----------|------------|
| T3-002 | hirveabhishek2006-design | T3-001 |
| T3-004 | katkarsujal1-design | T3-001 |
| T3-006 | raunaksin9890-gif | T3-001 |

> **Parallel:** T3-002, T3-004, T3-006 — all can execute simultaneously after T3-001.

### Wave C — Blocked on T1-008 + T3-001
| Task | Assignee | Blocked By |
|------|----------|------------|
| T3-003 | katkarsujal1-design | T1-008 (Team 1) + T3-001 |
| T3-007 | Pannkajyadhav333 | T1-008 (Team 1) + T3-001 |

> **Parallel:** T3-003, T3-007 — execute simultaneously once both blockers clear.

### Wave D — Blocked on T1-015 + T3-001 + T3-006
| Task | Assignee | Blocked By |
|------|----------|------------|
| T3-008 | Pannkajyadhav333 | T1-015 (Team 1) + T3-001 + T3-006 |

### Wave E — Blocked on T3-003 + T3-004
| Task | Assignee | Blocked By |
|------|----------|------------|
| T3-005 | raunaksin9890-gif | T3-003 + T3-004 |

### Wave F — Blocked on T3-008
| Task | Assignee | Blocked By |
|------|----------|------------|
| T3-009 | parthvichare20 | T3-008 |
| T3-012 | Pannkajyadhav333 | T3-008 |

> **Parallel:** T3-009, T3-012 — execute simultaneously after T3-008.

### Wave G — Blocked on T3-009
| Task | Assignee | Blocked By |
|------|----------|------------|
| T3-010 | parthvichare20 | T3-009 |
| T3-013 | parthvichare20 | T3-009 |
| T3-014 | parthvichare20 | T3-009 |

> **Parallel:** T3-010, T3-013, T3-014 — all assigned to same member, sequential execution required.

### Wave H — Blocked on T3-010
| Task | Assignee | Blocked By |
|------|----------|------------|
| T3-011 | parthvichare20 | T3-010 |
| T3-016 | Pannkajyadhav333 | T3-010 |

> **Parallel:** T3-011, T3-016 — execute simultaneously after T3-010.

### Wave I — Blocked on T3-005
| Task | Assignee | Blocked By |
|------|----------|------------|
| T3-015 | katkarsujal1-design | T3-005 |

### Wave J — Blocked on T3-003 through T3-014
| Task | Assignee | Blocked By |
|------|----------|------------|
| T3-017 | Pannkajyadhav333 | T3-003, T3-004, T3-005, T3-006, T3-007, T3-008, T3-009, T3-010, T3-011, T3-012, T3-013, T3-014 |

### Wave K
| Task | Assignee | Blocked By |
|------|----------|------------|
| T3-018 | hirveabhishek2006-design | T3-017 |

## Blocked Tasks

| Task | Waiting For | Status |
|------|-------------|--------|
| T3-001 | T1-003 (Team 1) | **BLOCKED — external** |
| T3-002 | T3-001 | Blocked |
| T3-003 | T1-008 (Team 1) + T3-001 | **BLOCKED — external + internal** |
| T3-004 | T3-001 | Blocked |
| T3-005 | T3-003 + T3-004 | Blocked |
| T3-006 | T3-001 | Blocked |
| T3-007 | T1-008 (Team 1) + T3-001 | **BLOCKED — external + internal** |
| T3-008 | T1-015 (Team 1) + T3-001 + T3-006 | **BLOCKED — external + internal** |
| T3-009 | T3-008 | Blocked |
| T3-010 | T3-009 | Blocked |
| T3-011 | T3-010 | Blocked |
| T3-012 | T3-008 | Blocked |
| T3-013 | T3-009 | Blocked |
| T3-014 | T3-009 | Blocked |
| T3-015 | T3-005 | Blocked |
| T3-016 | T3-010 | Blocked |
| T3-017 | T3-003 through T3-014 | Blocked |
| T3-018 | T3-017 | Blocked |

## Unblocked Tasks

None — T3-001 is gated on T1-003 (Team 1).

## Independent Tasks While Waiting

| Phase | Tasks | Condition |
|-------|-------|-----------|
| After T1-003 | T3-001, T3-004, T3-006 | No T1-008 dependency — can start immediately |
| After T3-001 | T3-002, T3-004, T3-006 | No T1-008 dependency — can start immediately |

> Key insight: T3-004 and T3-006 do NOT depend on T1-008, only on T3-001. They can begin as soon as T3-001 completes.

## Expected Handoffs (Outputs to Other Teams)

| Source Task | Recipient Team(s) | Deliverable |
|-------------|--------------------|-------------|
| T3-014 | Team 5 | Entity API for Frontend |
| T3-011 | Team 5 | Graph API for Frontend |
| T3-013 | Team 5 | Timeline for Frontend |

## Review Points

| Review | After Task | Scope |
|--------|------------|-------|
| R3-01 | T3-001 | Knowledge graph foundation review |
| R3-02 | T3-003 | Entity extraction review (after T1-008 unblocks) |
| R3-03 | T3-008 | Database-backed graph review (after T1-015 unblocks) |
| R3-04 | T3-009 | Graph query engine review |
| R3-05 | T3-014 | Entity API review — Team 5 depends on this |
| R3-06 | T3-011 | Graph API review — Team 5 depends on this |
| R3-07 | T3-013 | Timeline output review — Team 5 depends on this |
| R3-08 | T3-018 | Final team completion review |

## Integration Points

| Integration | Task | With Team | Direction | Description |
|-------------|------|-----------|-----------|-------------|
| IP-1 | T3-001 | Team 1 | Inbound | Receives T1-003 schema contract |
| IP-2 | T3-003 | Team 1 | Inbound | Receives T1-008 observation contract |
| IP-3 | T3-008 | Team 1 | Inbound | Receives T1-015 database foundation |
| IP-4 | T3-003 | Team 2 | Inbound | Receives observations from T2-005–T2-010 |
| IP-5 | T3-014 | Team 5 | Outbound | Entity API for frontend |
| IP-6 | T3-011 | Team 5 | Outbound | Graph API for frontend |
| IP-7 | T3-013 | Team 5 | Outbound | Timeline for frontend |

## Summary

```
Team 3: 18 tasks | 34 effort | 11 waves | 3 external blockers (T1-003, T1-008, T1-015)
Parallel groups: Wave B (3 tasks), Wave C (2 tasks), Wave F (2 tasks), Wave G (3 tasks), Wave H (2 tasks)
Inbound handoffs: 3 (from Teams 1, 2)
Outbound handoffs: 3 (to Team 5)
Team 3 bridges backend data to frontend display — critical for end-to-end flow.
```
