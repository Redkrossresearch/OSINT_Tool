# Team 2 Schedule — Connectors & Observation Pipeline

## Team Information

| Field | Value |
|-------|-------|
| **Team Name** | Team 2 — Connectors & Observation Pipeline |
| **GitHub Team** | @osint-tool/team-2 |
| **Head Intern** | riddhisawant305-jpg |
| **Total Tasks** | 18 |
| **Total Effort** | 33 |

## Members

| GitHub Handle | Role |
|---------------|------|
| riddhisawant305-jpg | Head Intern |
| yadavchinmay45-cloud | Member |
| AaryanDhotre2326 | Member |
| antarahire22-creator | Member |
| darshankamble0628-coder | Member |

## Critical Path

```
T1-008 (Team 1) → T2-001 → T2-002/T2-005/T2-007/T2-009 (Wave B) → T2-013 → T2-016 → T2-017 → T2-018
```

## Blocked Status

> **Entire team is BLOCKED until Team 1 completes T1-008 (Observation Contract).**
> No independent work can begin while waiting — all connector tasks depend on T1-008 via T2-001.

## Task Sequence (Dependency-Ordered)

### Pre-Wave: Blocked on T1-008 (Team 1)
| Task | Assignee | Blocked By |
|------|----------|------------|
| T2-001 | riddhisawant305-jpg | T1-008 (Team 1) |

### Wave A
| Task | Assignee | Blocked By |
|------|----------|------------|
| T2-001 | riddhisawant305-jpg | T1-008 |

> T2-001 is the gate task — once it unblocks, it enables all of Wave B.

### Wave B — Maximum Parallel Block (13 tasks)
| Task | Assignee | Blocked By |
|------|----------|------------|
| T2-002 | riddhisawant305-jpg | T2-001 |
| T2-003 | darshankamble0628-coder | T2-001 |
| T2-004 | darshankamble0628-coder | T2-001 |
| T2-011 | darshankamble0628-coder | T2-001 |
| T2-012 | darshankamble0628-coder | T2-001 |
| T2-014 | riddhisawant305-jpg | T2-001 |
| T2-015 | riddhisawant305-jpg | T2-001 |
| T2-005 | yadavchinmay45-cloud | T2-001 |
| T2-006 | yadavchinmay45-cloud | T2-001 |
| T2-007 | AaryanDhotre2326 | T2-001 |
| T2-008 | AaryanDhotre2326 | T2-001 |
| T2-009 | antarahire22-creator | T2-001 |
| T2-010 | antarahire22-creator | T2-001 |

> **Parallel:** All 13 tasks execute simultaneously after T2-001. This is the team's core parallel execution block.

### Wave C
| Task | Assignee | Blocked By |
|------|----------|------------|
| T2-013 | riddhisawant305-jpg | Wave B completion |

### Wave D
| Task | Assignee | Blocked By |
|------|----------|------------|
| T2-016 | darshankamble0628-coder | T2-013 |

### Wave E
| Task | Assignee | Blocked By |
|------|----------|------------|
| T2-017 | yadavchinmay45-cloud | T2-016 |

### Wave F
| Task | Assignee | Blocked By |
|------|----------|------------|
| T2-018 | riddhisawant305-jpg | T2-017 |

## Blocked Tasks

| Task | Waiting For | Status |
|------|-------------|--------|
| T2-001 | T1-008 (Team 1) | **BLOCKED — external** |
| T2-002 | T2-001 | Blocked |
| T2-003 | T2-001 | Blocked |
| T2-004 | T2-001 | Blocked |
| T2-005 | T2-001 | Blocked |
| T2-006 | T2-001 | Blocked |
| T2-007 | T2-001 | Blocked |
| T2-008 | T2-001 | Blocked |
| T2-009 | T2-001 | Blocked |
| T2-010 | T2-001 | Blocked |
| T2-011 | T2-001 | Blocked |
| T2-012 | T2-001 | Blocked |
| T2-013 | Wave B | Blocked |
| T2-014 | T2-001 | Blocked |
| T2-015 | T2-001 | Blocked |
| T2-016 | T2-013 | Blocked |
| T2-017 | T2-016 | Blocked |
| T2-018 | T2-017 | Blocked |

## Unblocked Tasks

None — all tasks depend on T1-008 (Team 1) via T2-001.

## Independent Tasks (No Cross-Team Dependencies)

None — all connector tasks depend on T1-008 via T2-001. The entire team's work is gated on Team 1's observation contract.

## Expected Handoffs (Outputs to Other Teams)

| Source Task | Recipient Team(s) | Deliverable |
|-------------|--------------------|-------------|
| T2-001 | All connector implementations | Connector Interface (internal enabler) |
| T2-005 through T2-010 | Team 3 | Observations for Entity Extraction |

## Review Points

| Review | After Task | Scope |
|--------|------------|-------|
| R2-01 | T2-001 | Connector interface contract review |
| R2-02 | Wave B (T2-002–T2-015) | All connector implementations review |
| R2-03 | T2-013 | Observation pipeline integration review |
| R2-04 | T2-017 | Data quality review — Team 3 depends on this |
| R2-05 | T2-018 | Final team completion review |

## Integration Points

| Integration | Task | With Team | Direction | Description |
|-------------|------|-----------|-----------|-------------|
| IP-1 | T2-001 | Team 1 | Inbound | Receives T1-008 observation contract |
| IP-2 | T2-005–T2-010 | Team 3 | Outbound | Sends observations for entity extraction |
| IP-3 | T2-001 | All connectors | Internal | Connector interface enables all implementations |
| IP-4 | T2-018 | Project | Outbound | Final observation pipeline output |

## Summary

```
Team 2: 18 tasks | 33 effort | 6 waves | 1 external blocker (T1-008)
Parallel group: Wave B (13 tasks) — largest parallel block in the project
Outbound handoffs: 1 major (observations to Team 3)
Team 2 is fully blocked until Team 1 delivers T1-008 — monitor T1-008 closely.
```
