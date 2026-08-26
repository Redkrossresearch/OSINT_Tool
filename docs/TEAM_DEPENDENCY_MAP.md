# Team Dependency Map

This document shows how teams depend on each other and how to work in parallel.

---

## Dependency Graph

```
Team 1 (Core + Evidence)
    ↓
    ├── packages/schemas/ ─────────────→ ALL TEAMS
    ├── Case API ─────────────────────→ Team 5
    ├── Investigation API ────────────→ Teams 3, 4, 5
    ├── Evidence API ─────────────────→ Teams 2, 3, 4
    ├── Observation schema ───────────→ Teams 2, 3, 4
    └── Objective schema ─────────────→ Teams 2, 4

Team 2 (Connectors)
    ↓
    ├── Observations ─────────────────→ Teams 3, 4
    └── Connector health ─────────────→ Team 5

Team 3 (Intelligence + Graph)
    ↓
    ├── Entity API ───────────────────→ Teams 4, 5
    ├── Graph API ────────────────────→ Teams 4, 5
    └── Timeline API ─────────────────→ Team 5

Team 4 (AI + Verification)
    ↓
    ├── Research tasks ───────────────→ Team 2
    ├── Insights ─────────────────────→ Team 3
    ├── Findings ─────────────────────→ Team 5
    └── Verification status ──────────→ Team 5

Team 5 (Product + Frontend)
    ↓
    None (final consumer)
```

---

## Parallel Development Strategy

Teams can work in parallel using:

### 1. Shared Schemas

All teams import from `packages/schemas/`. Once Team 1 publishes schemas, all teams can code against them.

### 2. Mocks and Fixtures

| Team | What to Mock |
|---|---|
| Team 2 | HTTP responses for external APIs |
| Team 3 | Observation[] data for extraction |
| Team 4 | Ollama API responses |
| Team 5 | Backend API responses (MSW) |

### 3. Interface Contracts

Teams agree on interfaces before implementation. No team waits for another to start coding — they code against the contract.

---

## Dependency Timeline

```
Week 1-2:  Team 1 ──── Schemas + DB foundation
                      Teams 2-5 ──── Read schemas, plan implementation

Week 2-4:  Team 1 ──── Core APIs
                      Team 2 ──── Connector framework + connectors (mock Observations)
                      Team 3 ──── Entity types + extraction (mock Observations)
                      Team 4 ──── Model abstraction + agents (mock Ollama)
                      Team 5 ──── Next.js setup + UI (mock APIs)

Week 4-6:  Team 1 ──── Evidence API
                      Team 2 ──── Integration testing
                      Team 3 ──── Graph storage + queries
                      Team 4 ──── Verification workflow
                      Team 5 ──── API integration

Week 6-8:  All teams ──── Integration + cross-team testing

Week 8-10: All teams ──── QA + demo preparation
```

---

## Blocking Dependencies

| If This Is Blocked | Then These Are Blocked |
|---|---|
| Team 1 schemas | Teams 2, 3, 4, 5 (partially) |
| Team 1 DB foundation | Team 3 graph storage |
| Team 1 Core API | Team 5 dashboard |
| Team 1 Evidence API | Team 2 connector testing |
| Team 2 Observations | Team 3 entity extraction |
| Team 3 Entity API | Team 4 AI correlation, Team 5 entity viewer |
| Team 3 Graph API | Team 4 AI analysis, Team 5 graph view |
| Team 4 Findings | Team 5 findings view |

---

## Non-Blocking Strategy

**No team should be idle while waiting for another.**

| Waiting For | Do This Instead |
|---|---|
| Team 1 schemas | Read draft schemas, plan implementation |
| Team 2 observations | Use mock observation fixtures |
| Team 3 entities | Use mock entity fixtures |
| Team 4 AI results | Use mock findings fixtures |
| Team 5 API | Use MSW mocks |

---

## Interface Ownership

| Interface | Owner | Modifier |
|---|---|---|
| `packages/schemas/*` | Team 1 | Team 1 only |
| `packages/entities/*` | Team 3 | Team 3 only (with Team 1 review) |
| Case API | Team 1 | Team 1 only |
| Investigation API | Team 1 | Team 1 only |
| Evidence API | Team 1 | Team 1 only |
| Connector interface | Team 2 | Team 2 only |
| Entity API | Team 3 | Team 3 only |
| Graph API | Team 3 | Team 3 only |
| Timeline API | Team 3 | Team 3 only |
| AI agent interface | Team 4 | Team 4 only |
| Verification API | Team 4 | Team 4 only |
| Frontend | Team 5 | Team 5 only |
| Report service | Team 5 | Team 5 only |
