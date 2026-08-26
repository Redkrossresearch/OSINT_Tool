# Team Interfaces

This document defines how teams communicate through schemas, APIs, and data contracts.

---

## Interface Principle

**No team should invent an incompatible schema.**

All cross-team data flow uses shared contracts defined in `packages/schemas/` (owned by Team 1) and `packages/entities/` (owned by Team 3).

---

## Interface Map

### Team 1 → Team 2

| Interface | Type | Location | Description |
|---|---|---|---|
| Objective schema | Package | `packages/schemas/objective.ts` | What to investigate |
| Observation schema | Package | `packages/schemas/observation.ts` | How to format output |
| Source schema | Package | `packages/schemas/source.ts` | Source reference format |
| Evidence schema | Package | `packages/schemas/evidence.ts` | Evidence structure |

**Direction:** Team 1 provides schemas. Team 2 consumes them.

---

### Team 1 → Team 3

| Interface | Type | Location | Description |
|---|---|---|---|
| Observation schema | Package | `packages/schemas/observation.ts` | Input for extraction |
| Evidence schema | Package | `packages/schemas/evidence.ts` | Evidence structure |
| Entity schema | Package | `packages/entities/entity-schema.ts` | Entity types |

**Direction:** Team 1 provides schemas. Team 3 consumes them.

---

### Team 2 → Team 3

| Interface | Type | Location | Description |
|---|---|---|---|
| Observations | API/Runtime | Observation[] | Normalized data from connectors |

**Direction:** Team 2 produces observations. Team 3 consumes them for entity extraction.

---

### Team 1 → Team 4

| Interface | Type | Location | Description |
|---|---|---|---|
| Investigation model | Package | `packages/schemas/investigation.ts` | Investigation lifecycle |
| Evidence schema | Package | `packages/schemas/evidence.ts` | Evidence structure |
| Observation schema | Package | `packages/schemas/observation.ts` | Observation structure |

**Direction:** Team 1 provides schemas. Team 4 consumes them for AI analysis.

---

### Team 3 → Team 4

| Interface | Type | Location | Description |
|---|---|---|---|
| Entity API | REST | GET /api/entities | Entity data for correlation |
| Graph API | REST | GET /api/graph/:id | Relationship data for analysis |
| Entity data | Runtime | Entity[] | Entities for AI processing |

**Direction:** Team 3 provides entity/graph data. Team 4 consumes it for AI analysis.

---

### Team 3 → Team 5

| Interface | Type | Location | Description |
|---|---|---|---|
| Entity API | REST | GET /api/entities | Entity viewer data |
| Graph API | REST | GET /api/graph/:id | Graph visualization data |
| Timeline API | REST | GET /api/timeline/:id | Timeline data |

**Direction:** Team 3 provides entity/graph/timeline data. Team 5 displays it.

---

### Team 4 → Team 2

| Interface | Type | Location | Description |
|---|---|---|---|
| Research tasks | Runtime | ResearchTask[] | AI-planned collection tasks |

**Direction:** Team 4 produces research tasks. Team 2 executes them via connectors.

---

### Team 4 → Team 5

| Interface | Type | Location | Description |
|---|---|---|---|
| Findings API | REST | GET /api/findings | AI analysis results |
| Verification API | REST | GET /api/verification | Verification status |
| AI activity log | REST | GET /api/ai/log | Token usage, model calls |

**Direction:** Team 4 provides findings/verification. Team 5 displays them.

---

### Team 1 → Team 5

| Interface | Type | Location | Description |
|---|---|---|---|
| Case API | REST | GET/POST /api/cases | Case CRUD |
| Investigation API | REST | GET/POST /api/investigations | Investigation lifecycle |
| Evidence API | REST | GET /api/evidence | Evidence data |

**Direction:** Team 1 provides core APIs. Team 5 consumes them.

---

### Team 2 → Team 5

| Interface | Type | Location | Description |
|---|---|---|---|
| Connector health | REST | GET /api/connectors/health | Collection status |

**Direction:** Team 2 provides health data. Team 5 displays it.

---

## Shared Contracts

All teams must use these shared contracts:

| Contract | Owner | Location |
|---|---|---|
| Observation | Team 1 | `packages/schemas/observation.ts` |
| Evidence | Team 1 | `packages/schemas/evidence.ts` |
| Objective | Team 1 | `packages/schemas/objective.ts` |
| Source | Team 1 | `packages/schemas/source.ts` |
| Investigation | Team 1 | `packages/schemas/investigation.ts` |
| Case | Team 1 | `packages/schemas/case.ts` |
| Audit Event | Team 1 | `packages/schemas/audit-event.ts` |
| Entity Types | Team 3 | `packages/entities/entity-types.ts` |
| Relationship Types | Team 3 | `packages/entities/relationship-types.ts` |

---

## Changing an Interface

If you need to change a shared interface:

1. Propose the change in a PR to `packages/schemas/` or `packages/entities/`
2. Tag Team 1 lead for schema changes
3. Tag affected team leads
4. All affected teams must approve
5. Changes must be backward-compatible or coordinated

---

## Mock Data for Parallel Development

Teams can work in parallel using mocks:

| Team | Mock Strategy |
|---|---|
| Team 2 | Mock HTTP responses for connectors |
| Team 3 | Mock Observation[] for extraction |
| Team 4 | Mock Ollama responses for AI |
| Team 5 | Mock API responses with MSW |

**Do not block on other teams.** Use mocks and fixtures.
