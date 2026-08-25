# Tasks — Team 3: Intelligence + Entity + Graph

## T3-001: Entity Schema + Types

**TEAM:** 3 — Intelligence + Entity + Graph
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Define entity type definitions and validation schemas.

### Dependencies
T1-001

### Input
- Schema package structure

### Output
- `packages/entities/entity-types.ts`
- `packages/entities/entity-schema.ts`
- Unit tests

### Allowed Files
- `packages/entities/*.ts`
- `packages/entities/__tests__/*.test.ts`

### Implementation Notes
- Entity types: Person, Company, Domain, IP, Email, URL, Repository, Technology, Location
- Each type has specific attributes
- Validation via Zod

### Acceptance Criteria
- [ ] All entity types are defined
- [ ] Validation works for each type
- [ ] Types are exported correctly

---

## T3-002: Relationship Schema

**TEAM:** 3 — Intelligence + Entity + Graph
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Define relationship type definitions.

### Dependencies
T3-001

### Input
- Entity types

### Output
- `packages/entities/relationship-types.ts`
- `packages/entities/relationship-schema.ts`
- Unit tests

### Allowed Files
- `packages/entities/relationship-types.ts`
- `packages/entities/relationship-schema.ts`
- `packages/entities/__tests__/relationship.test.ts`

### Implementation Notes
- Relationship types: OWNS, WORKS_FOR, USES, HOSTED_ON, REGISTERED_TO, MENTIONS, ASSOCIATED_WITH, RESOLVES_TO
- Each has source and target entity type constraints

### Acceptance Criteria
- [ ] All relationship types are defined
- [ ] Type constraints are enforced

---

## T3-003: Entity Extraction Service

**TEAM:** 3 — Intelligence + Entity + Graph
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement entity extraction from observations.

### Dependencies
T3-001, T1-009

### Input
- Entity types, Observation schema

### Output
- `services/intelligence/src/services/entity-extractor.ts`
- Unit tests

### Allowed Files
- `services/intelligence/src/services/entity-extractor.ts`
- `services/intelligence/src/__tests__/entity-extractor.test.ts`

### Implementation Notes
- Pattern-based extraction (regex, heuristics)
- Domain extraction from URLs
- Email extraction
- IP address extraction
- Name extraction (simplified for MVP)
- Returns entities with confidence scores

### Acceptance Criteria
- [ ] Entities are extracted from observation data
- [ ] Confidence scores are assigned
- [ ] Multiple entity types from single observation

---

## T3-004: Entity Normalization

**TEAM:** 3 — Intelligence + Entity + Graph
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement entity normalization and canonicalization.

### Dependencies
T3-001

### Input
- Entity types

### Output
- `services/intelligence/src/services/entity-normalizer.ts`
- Unit tests

### Allowed Files
- `services/intelligence/src/services/entity-normalizer.ts`
- `services/intelligence/src/__tests__/entity-normalizer.test.ts`

### Implementation Notes
- Lowercase normalization
- Whitespace trimming
- Unicode normalization
- Domain format normalization
- IP format normalization

### Acceptance Criteria
- [ ] Entities are normalized consistently
- [ ] Same input produces same normalized output

---

## T3-005: Entity Resolution

**TEAM:** 3 — Intelligence + Entity + Graph
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement entity resolution (same-entity detection).

### Dependencies
T3-003, T3-004

### Input
- Entity extraction, normalization

### Output
- `services/intelligence/src/services/entity-resolver.ts`
- Unit tests

### Allowed Files
- `services/intelligence/src/services/entity-resolver.ts`
- `services/intelligence/src/__tests__/entity-resolver.test.ts`

### Implementation Notes
- Exact match after normalization
- Fuzzy match with Levenshtein distance
- Shared attribute matching (same email → same person)
- Confidence scoring for matches
- No silent merges — all merges logged

### Acceptance Criteria
- [ ] Exact matches are detected
- [ ] Fuzzy matches have confidence scores
- [ ] Merges are logged in provenance

---

## T3-006: Graph Database Schema

**TEAM:** 3 — Intelligence + Entity + Graph
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Create PostgreSQL schema for graph storage.

### Dependencies
T1-002, T3-001, T3-002

### Input
- Database setup, entity/relationship types

### Output
- Prisma schema additions (entities, relationships tables)
- Migration file
- Unit tests

### Allowed Files
- `services/graph/prisma/schema.prisma`
- `services/graph/prisma/migrations/*`
- `services/graph/src/__tests__/schema.test.ts`

### Implementation Notes
- Entities table with JSONB attributes
- Relationships table with source/target foreign keys
- Indexes for traversal performance
- Temporal fields (valid_from, valid_to)

### Acceptance Criteria
- [ ] Schema creates tables correctly
- [ ] Migrations run without errors
- [ ] Indexes are created

---

## T3-007: Graph Service + Queries

**TEAM:** 3 — Intelligence + Entity + Graph
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement graph storage, querying, and traversal.

### Dependencies
T3-006

### Input
- Graph database schema

### Output
- `services/graph/src/services/graph.service.ts`
- Graph query functions
- Unit tests

### Allowed Files
- `services/graph/src/services/graph.service.ts`
- `services/graph/src/queries/*.ts`
- `services/graph/src/__tests__/graph.service.test.ts`

### Implementation Notes
- Add/remove entities
- Add/remove relationships
- Neighborhood query (entity + N-hop neighbors)
- Path finding (shortest path)
- Subgraph extraction
- Temporal filtering

### Acceptance Criteria
- [ ] Entities and relationships can be stored
- [ ] Neighborhood queries work
- [ ] Path finding works
- [ ] Temporal filtering works

---

## T3-008: Graph API

**TEAM:** 3 — Intelligence + Entity + Graph
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Expose graph data via REST API.

### Dependencies
T3-007

### Input
- Graph service

### Output
- `services/graph/src/routes/graph.routes.ts`
- API integration tests

### Allowed Files
- `services/graph/src/routes/graph.routes.ts`
- `services/graph/src/__tests__/routes/*.test.ts`

### Implementation Notes
- GET /api/graph/:investigation_id
- GET /api/graph/:investigation_id/neighbors/:entity_id
- GET /api/entities?investigation_id=xxx
- GET /api/entities/:id
- GET /api/relationships?investigation_id=xxx

### Acceptance Criteria
- [ ] All endpoints respond correctly
- [ ] Filtering works
- [ ] Pagination works

---

## T3-009: Timeline Service

**TEAM:** 3 — Intelligence + Entity + Graph
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
Implement investigation timeline generation from graph events.

### Dependencies
T3-007, T1-010

### Input
- Graph data, audit events

### Output
- `services/graph/src/services/timeline.service.ts`
- Timeline API endpoint
- Unit tests

### Allowed Files
- `services/graph/src/services/timeline.service.ts`
- `services/graph/src/routes/timeline.routes.ts`
- `services/graph/src/__tests__/timeline.service.test.ts`

### Implementation Notes
- Chronological ordering of events
- Evidence timestamps
- Entity appearance timestamps
- Relationship creation timestamps
- Filterable by event type

### Acceptance Criteria
- [ ] Timeline is chronologically ordered
- [ ] All event types are included
- [ ] Filtering works

---

## T3-010: Intelligence Integration Tests

**TEAM:** 3 — Intelligence + Entity + Graph
**OWNER:** Pending assignment
**STATUS:** NOT STARTED

### Objective
End-to-end tests for intelligence pipeline.

### Dependencies
T3-003 through T3-009

### Input
- All intelligence services

### Output
- Integration test suite
- Test data fixtures

### Allowed Files
- `services/intelligence/src/__tests__/integration/*.test.ts`
- `services/graph/src/__tests__/integration/*.test.ts`

### Acceptance Criteria
- [ ] Observations → Entities → Graph pipeline works
- [ ] Entity resolution merges correctly
- [ ] Graph queries return correct results
