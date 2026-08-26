# Tasks — Team 3: Intelligence + Entity + Graph

## T3-001 — Entity Schema

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Define entity type definitions, attributes, and Zod validation schemas.
**Why:** Entity types are the foundation of intelligence extraction.

**Primary Owner:** `hirveabhishek2006-design`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** Team lead

### Dependencies
T1-003 (Schema package)

### Inputs
- Schema package structure

### Outputs
- `packages/entities/entity-types.ts`
- `packages/entities/entity-schema.ts`
- Unit tests

### Allowed Files
- `packages/entities/`
- `packages/entities/__tests__/`

### Do Not Modify
- `packages/schemas/` (Team 1 owns)

### Implementation Guidance
1. Define entity types: Person, Company, Domain, IP, Email, URL, Repository, Technology, Location
2. Define type-specific attributes
3. Create Zod schemas for each type
4. Add confidence scoring fields

### AI Instructions
Ask AI to explain Zod discriminated unions for entity types.

### Tests
- All entity types defined
- Validation works per type
- Types exported correctly

### Documentation
- Entity type reference

### Acceptance Criteria
- [ ] All entity types defined
- [ ] Validation works
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-002 — Entity Normalization

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Implement entity normalization and canonicalization logic.
**Why:** Entities from different sources need consistent formatting for resolution.

**Primary Owner:** `hirveabhishek2006-design`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** `katkarsujal1-design`

### Dependencies
T3-001

### Inputs
- Entity types

### Outputs
- `services/intelligence/src/services/entity-normalizer.ts`
- Unit tests

### Allowed Files
- `services/intelligence/src/services/`
- `services/intelligence/src/__tests__/`

### Do Not Modify
- Entity type definitions

### Implementation Guidance
1. Lowercase normalization
2. Whitespace trimming
3. Unicode normalization (NFC)
4. Domain format normalization (remove trailing dot)
5. IP format normalization
6. Email normalization

### AI Instructions
Ask AI to explain Unicode normalization and string canonicalization.

### Tests
- Same input produces same output
- Different cases normalize identically
- Edge cases handled (empty strings, special chars)

### Documentation
- Normalization rules documentation

### Acceptance Criteria
- [ ] Entities normalized consistently
- [ ] Same input → same output
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-003 — Entity Extraction

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Implement entity extraction from observation data.
**Why:** Extracting entities from raw data is the first step of intelligence analysis.

**Primary Owner:** `katkarsujal1-design`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** `hirveabhishek2006-design`

### Dependencies
T3-001, T1-008 (Observation schema)

### Inputs
- Entity types, Observation schema

### Outputs
- `services/intelligence/src/services/entity-extractor.ts`
- Unit tests

### Allowed Files
- `services/intelligence/src/services/`
- `services/intelligence/src/__tests__/`

### Do Not Modify
- Entity type definitions

### Implementation Guidance
1. Pattern-based extraction (regex, heuristics)
2. Domain extraction from URLs
3. Email extraction
4. IP address extraction
5. Name extraction (simplified for MVP)
6. Return entities with confidence scores

### AI Instructions
Ask AI to explain regex patterns for entity extraction.

### Tests
- Entities extracted from observation data
- Confidence scores assigned
- Multiple entity types from single observation
- False positives handled

### Documentation
- Extraction rules documentation

### Acceptance Criteria
- [ ] Entities extracted
- [ ] Confidence scores assigned
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-004 — Entity Confidence

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Implement confidence scoring for extracted entities.
**Why:** Confidence scores indicate how certain the system is about an entity.

**Primary Owner:** `katkarsujal1-design`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** `hirveabhishek2006-design`

### Dependencies
T3-001

### Inputs
- Entity types

### Outputs
- `services/intelligence/src/services/confidence-scorer.ts`
- Unit tests

### Allowed Files
- `services/intelligence/src/services/`
- `services/intelligence/src/__tests__/`

### Do Not Modify
- Entity type definitions

### Implementation Guidance
1. Define confidence scoring rules
2. Factor: source reliability, pattern strength, context
3. Score range: 0.0–1.0
4. Threshold for auto-accept vs human review

### AI Instructions
Ask AI to explain confidence scoring methodologies.

### Tests
- Scores within 0.0–1.0
- Higher confidence for stronger patterns
- Threshold logic works

### Documentation
- Confidence scoring documentation

### Acceptance Criteria
- [ ] Confidence scores work
- [ ] Range enforced
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-005 — Entity Resolution

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Implement entity resolution (same-entity detection across sources).
**Why:** The same real-world entity may appear differently across sources.

**Primary Owner:** `raunaksin9890-gif`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** `hirveabhishek2006-design`

### Dependencies
T3-003, T3-004

### Inputs
- Entity extraction, normalization

### Outputs
- `services/intelligence/src/services/entity-resolver.ts`
- Unit tests

### Allowed Files
- `services/intelligence/src/services/`
- `services/intelligence/src/__tests__/`

### Do Not Modify
- Entity type definitions

### Implementation Guidance
1. Exact match after normalization
2. Fuzzy match with Levenshtein distance
3. Shared attribute matching (same email → same person)
4. Confidence scoring for matches
5. **No silent merges** — all merges logged

### CRITICAL RULE
**Never silently merge entities.** Every resolution must have confidence, evidence, reason, and source.

### AI Instructions
Ask AI to explain entity resolution algorithms (Levenshtein, Jaro-Winkler).

### Tests
- Exact matches detected
- Fuzzy matches have confidence
- Merges logged in provenance
- No silent merges

### Documentation
- Resolution algorithm documentation

### Acceptance Criteria
- [ ] Exact matches work
- [ ] Fuzzy matches have confidence
- [ ] All merges logged

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-006 — Relationship Schema

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Define relationship type definitions and validation schemas.
**Why:** Relationships connect entities and form the intelligence graph.

**Primary Owner:** `raunaksin9890-gif`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** `hirveabhishek2006-design`

### Dependencies
T3-001

### Inputs
- Entity types

### Outputs
- `packages/entities/relationship-types.ts`
- `packages/entities/relationship-schema.ts`
- Unit tests

### Allowed Files
- `packages/entities/`
- `packages/entities/__tests__/`

### Do Not Modify
- Entity type definitions

### Implementation Guidance
1. Define relationship types: OWNS, WORKS_FOR, USES, HOSTED_ON, REGISTERED_TO, MENTIONS, ASSOCIATED_WITH, RESOLVES_TO
2. Define source/target entity type constraints
3. Create Zod schemas
4. Add confidence and evidence fields

### AI Instructions
Ask AI to explain typed relationship models.

### Tests
- All relationship types defined
- Type constraints enforced
- Validation works

### Documentation
- Relationship type reference

### Acceptance Criteria
- [ ] All types defined
- [ ] Constraints enforced
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-007 — Relationship Extraction

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Implement relationship extraction from observations.
**Why:** Relationships between entities reveal connections and patterns.

**Primary Owner:** `Pannkajyadhav333`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** `hirveabhishek2006-design`

### Dependencies
T3-001, T3-006, T1-008

### Inputs
- Entity types, Relationship types, Observations

### Outputs
- `services/intelligence/src/services/relationship-extractor.ts`
- Unit tests

### Allowed Files
- `services/intelligence/src/services/`
- `services/intelligence/src/__tests__/`

### Do Not Modify
- Schema files

### Implementation Guidance
1. Pattern-based relationship extraction
2. Proximity-based co-occurrence
3. Confidence scoring
4. Evidence linking

### AI Instructions
Ask AI to explain relationship extraction patterns.

### Tests
- Relationships extracted
- Confidence scores assigned
- Evidence linked

### Documentation
- Extraction rules documentation

### Acceptance Criteria
- [ ] Relationships extracted
- [ ] Confidence scores work
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-008 — Graph Schema

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Create PostgreSQL schema for graph storage.
**Why:** Graph data needs persistent storage with efficient querying.

**Primary Owner:** `Pannkajyadhav333`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** `parthvichare20`

### Dependencies
T1-015 (Database foundation), T3-001, T3-006

### Inputs
- Database setup, entity/relationship types

### Outputs
- Prisma schema additions (entities, relationships tables)
- Migration file
- Unit tests

### Allowed Files
- `services/graph/prisma/`
- `services/graph/src/__tests__/schema.test.ts`

### Do Not Modify
- Core Prisma schema (Team 1 owns)

### Implementation Guidance
1. Entities table with JSONB attributes
2. Relationships table with source/target foreign keys
3. Indexes for traversal performance
4. Temporal fields (valid_from, valid_to)

### AI Instructions
Ask AI to explain graph storage in relational databases.

### Tests
- Schema creates tables correctly
- Migrations run without errors
- Indexes created

### Documentation
- Graph schema documentation

### Acceptance Criteria
- [ ] Schema works
- [ ] Migrations run
- [ ] Indexes created

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-009 — Graph Storage

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Implement graph storage service (add/remove entities and relationships).
**Why:** The graph service manages the intelligence graph data.

**Primary Owner:** `parthvichare20`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** `Pannkajyadhav333`

### Dependencies
T3-008

### Inputs
- Graph database schema

### Outputs
- `services/graph/src/services/graph.service.ts`
- Unit tests

### Allowed Files
- `services/graph/src/services/`
- `services/graph/src/__tests__/`

### Do Not Modify
- Schema files

### Implementation Guidance
1. Add/remove entities
2. Add/remove relationships
3. Update entity attributes
4. Maintain temporal fields

### AI Instructions
Ask AI to explain graph CRUD operations.

### Tests
- Entities stored and retrieved
- Relationships stored and retrieved
- Temporal fields maintained

### Documentation
- Graph storage documentation

### Acceptance Criteria
- [ ] CRUD operations work
- [ ] Temporal fields work
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-010 — Graph Queries

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Implement graph query functions (traversal, path finding, neighborhood).
**Why:** Queries power the intelligence analysis and visualization.

**Primary Owner:** `parthvichare20`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** `Pannkajyadhav333`

### Dependencies
T3-009

### Inputs
- Graph storage service

### Outputs
- `services/graph/src/queries/neighborhood.ts`
- `services/graph/src/queries/pathfinding.ts`
- `services/graph/src/queries/subgraph.ts`
- Unit tests

### Allowed Files
- `services/graph/src/queries/`
- `services/graph/src/__tests__/queries/`

### Do Not Modify
- Graph service

### Implementation Guidance
1. Neighborhood query (entity + N-hop neighbors)
2. Shortest path finding
3. Subgraph extraction
4. Temporal filtering
5. Bounded traversal (max depth: 5)

### AI Instructions
Ask AI to explain graph traversal algorithms (BFS, DFS).

### Tests
- Neighborhood queries work
- Path finding works
- Traversal bounded

### Documentation
- Query documentation

### Acceptance Criteria
- [ ] All queries work
- [ ] Traversal bounded
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-011 — Graph API

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Expose graph data via REST API.
**Why:** API is how the frontend and other services consume graph data.

**Primary Owner:** `parthvichare20`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** `hirveabhishek2006-design`

### Dependencies
T3-010

### Inputs
- Graph queries

### Outputs
- `services/graph/src/routes/graph.routes.ts`
- `services/graph/src/routes/entity.routes.ts`
- API integration tests

### Allowed Files
- `services/graph/src/routes/`
- `services/graph/src/__tests__/routes/`

### Do Not Modify
- Query files

### Implementation Guidance
1. GET /api/graph/:investigation_id
2. GET /api/graph/:investigation_id/neighbors/:entity_id
3. GET /api/entities?investigation_id=xxx
4. GET /api/entities/:id
5. GET /api/relationships?investigation_id=xxx
6. Pagination support

### AI Instructions
Ask AI to explain REST API pagination patterns.

### Tests
- All endpoints respond correctly
- Filtering works
- Pagination works

### Documentation
- API endpoint documentation

### Acceptance Criteria
- [ ] All endpoints work
- [ ] Filtering works
- [ ] Pagination works

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-012 — Temporal Relationships

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Implement temporal relationship tracking (valid_from, valid_to).
**Why:** Intelligence relationships change over time. Temporal tracking captures this.

**Primary Owner:** `Pannkajyadhav333`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** `parthvichare20`

### Dependencies
T3-008

### Inputs
- Graph schema

### Outputs
- Temporal relationship logic
- Unit tests

### Allowed Files
- `services/graph/src/services/`
- `services/graph/src/__tests__/`

### Do Not Modify
- Schema files

### Implementation Guidance
1. Set valid_from on relationship creation
2. Set valid_to on relationship deactivation
3. Query current vs historical relationships
4. Handle overlapping time periods

### AI Instructions
Ask AI to explain temporal data modeling.

### Tests
- Temporal fields set correctly
- Historical queries work
- Overlapping periods handled

### Documentation
- Temporal model documentation

### Acceptance Criteria
- [ ] Temporal fields work
- [ ] Historical queries work
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-013 — Investigation Timeline

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Implement investigation timeline generation from graph events.
**Why:** Timeline provides chronological view of investigation progress.

**Primary Owner:** `parthvichare20`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** `hirveabhishek2006-design`

### Dependencies
T3-009, T1-013 (Audit events)

### Inputs
- Graph data, Audit events

### Outputs
- `services/graph/src/services/timeline.service.ts`
- `services/graph/src/routes/timeline.routes.ts`
- Unit tests

### Allowed Files
- `services/graph/src/services/`
- `services/graph/src/routes/`
- `services/graph/src/__tests__/`

### Do Not Modify
- Graph service

### Implementation Guidance
1. Chronological ordering of events
2. Include evidence timestamps, entity appearances, relationship creation
3. Filterable by event type
4. API endpoint: GET /api/timeline/:investigation_id

### AI Instructions
Ask AI to explain timeline data aggregation patterns.

### Tests
- Timeline chronologically ordered
- All event types included
- Filtering works

### Documentation
- Timeline API documentation

### Acceptance Criteria
- [ ] Timeline works
- [ ] Filtering works
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-014 — Entity API

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Expose entity data via REST API with search and filtering.
**Why:** Entity API powers the entity viewer and AI correlation.

**Primary Owner:** `parthvichare20`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** `hirveabhishek2006-design`

### Dependencies
T3-009

### Inputs
- Graph storage service

### Outputs
- `services/graph/src/routes/entity.routes.ts`
- Entity search endpoints

### Allowed Files
- `services/graph/src/routes/`

### Do Not Modify
- Graph service

### Implementation Guidance
1. GET /api/entities — list with filtering
2. GET /api/entities/:id — detail
3. GET /api/entities/search?q=xxx — search
4. Filter by type, confidence, investigation

### AI Instructions
Ask AI to explain search API patterns.

### Tests
- All endpoints work
- Search works
- Filtering works

### Documentation
- Entity API documentation

### Acceptance Criteria
- [ ] All endpoints work
- [ ] Search works
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-015 — Resolution Tests

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Write comprehensive tests for entity resolution edge cases.
**Why:** Entity resolution is complex. Thorough testing prevents silent merges and data corruption.

**Primary Owner:** `katkarsujal1-design`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** `raunaksin9890-gif`

### Dependencies
T3-005

### Inputs
- Entity resolution service

### Outputs
- Resolution test suite
- Edge case fixtures

### Allowed Files
- `services/intelligence/src/__tests__/`

### Do Not Modify
- Source files

### Implementation Guidance
1. Test exact matches
2. Test fuzzy matches
3. Test shared attribute matches
4. Test false positive rejection
5. Test merge logging

### AI Instructions
Ask AI to explain entity resolution test patterns.

### Tests
- All edge cases covered
- No silent merges

### Documentation
- Test case documentation

### Acceptance Criteria
- [ ] Edge cases covered
- [ ] No silent merges verified

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-016 — Graph Tests

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Write comprehensive tests for graph queries and storage.
**Why:** Graph operations are complex. Tests ensure correctness.

**Primary Owner:** `parthvichare20`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** `Pannkajyadhav333`

### Dependencies
T3-010, T3-011

### Inputs
- Graph service, queries, API

### Outputs
- Graph test suite
- Test fixtures

### Allowed Files
- `services/graph/src/__tests__/`

### Do Not Modify
- Source files

### Implementation Guidance
1. Test CRUD operations
2. Test query correctness
3. Test traversal bounds
4. Test temporal queries
5. Test API endpoints

### AI Instructions
Ask AI to explain graph testing patterns.

### Tests
- All graph operations tested
- Edge cases covered

### Documentation
- Test documentation

### Acceptance Criteria
- [ ] All tests pass
- [ ] Edge cases covered

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-017 — Integration Tests

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Write end-to-end tests for the intelligence pipeline.
**Why:** Integration tests verify the full observation → entity → graph pipeline.

**Primary Owner:** `Pannkajyadhav333`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** `parthvichare20`

### Dependencies
T3-003 through T3-014

### Inputs
- All intelligence services

### Outputs
- Integration test suite
- Test data fixtures

### Allowed Files
- `tests/intelligence/integration/`

### Do Not Modify
- Source files

### Implementation Guidance
1. Test: Observations → Entities → Graph pipeline
2. Test: Entity resolution merges correctly
3. Test: Graph queries return correct results
4. Test: Timeline generation

### AI Instructions
Ask AI to explain integration testing for data pipelines.

### Tests
- Full pipeline works
- Resolution merges correctly
- Graph queries correct

### Documentation
- Integration test setup

### Acceptance Criteria
- [ ] Full pipeline works
- [ ] Resolution correct
- [ ] Tests pass

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`

---

## T3-018 — Documentation

**Team:** Team 3 — Intelligence + Entity + Graph
**Objective:** Write documentation for entity types, graph queries, and intelligence pipeline.
**Why:** Clear documentation helps developers understand and use the intelligence system.

**Primary Owner:** `hirveabhishek2006-design`
**Reviewer:** Head Intern (`hirveabhishek2006-design`)
**Backup:** Team lead

### Dependencies
T3-017

### Inputs
- All intelligence services

### Outputs
- Entity type reference
- Relationship type reference
- Graph query examples
- Resolution algorithm documentation
- API endpoint documentation

### Allowed Files
- `docs/intelligence/`

### Do Not Modify
- Source files

### Implementation Guidance
1. Document all entity types and attributes
2. Document all relationship types
3. Document graph query API with examples
4. Document resolution algorithm
5. Document confidence scoring

### AI Instructions
Ask AI to explain technical documentation for data systems.

### Tests
- Documentation is accurate
- Code examples work

### Documentation
- This IS the documentation task

### Acceptance Criteria
- [ ] Entity types documented
- [ ] Graph queries documented
- [ ] API documented

### Definition of Done
- [ ] All checks pass
- [ ] PR to `team/3-intelligence`
