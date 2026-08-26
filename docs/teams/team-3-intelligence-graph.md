# Team 3 — Intelligence + Entity + Graph

## Mission

Convert observations into structured intelligence. Extract entities, resolve them to canonical forms, build relationships, and maintain a queryable intelligence graph.

---

## Team Responsibilities

1. Entity extraction from observations
2. Entity normalization and canonicalization
3. Entity resolution (same-entity detection)
4. Confidence scoring
5. Relationship extraction
6. Graph model and storage
7. Graph queries (traversal, path, neighborhood)
8. Temporal relationships
9. Investigation timeline
10. Entity APIs
11. Graph APIs
12. Intelligence tests
13. Documentation

---

## Team Ownership

```
services/intelligence/    — Entity extraction, normalization, resolution
services/graph/           — Graph storage, queries, API
packages/entities/        — Entity type definitions and schemas
docs/intelligence/        — Intelligence documentation
```

---

## Team Boundaries

### Team 3 OWNS

- All entity logic
- All relationship logic
- Graph storage and queries
- Timeline generation
- Entity and Graph APIs

### Team 3 DOES NOT OWN

- `services/core/` — Team 1
- `services/evidence/` — Team 1
- `packages/schemas/` — Team 1
- `connectors/` — Team 2
- `services/ai/` — Team 4
- `apps/web/` — Team 5

---

## What Team 3 Must NOT Modify

- Core schemas (`packages/schemas/`) without Team 1 review
- Database migrations (Team 1 only for core DB)
- Connector implementations (`connectors/`)
- AI agent code (`services/ai/`)
- Frontend code (`apps/web/`)
- Evidence storage logic (Team 1 only)

---

## Dependencies

| Dependency | Provider | What |
|---|---|---|
| Observation schema | Team 1 | Input for entity extraction |
| Evidence schema | Team 1 | Evidence structure |
| Entity schema | Team 1 (via `packages/schemas/`) | Entity type definitions |
| Observations | Team 2 | Raw data to process |

---

## Dependents

| Team | What They Consume |
|---|---|
| Team 4 (AI) | Entities, relationships, graph data |
| Team 5 (Product) | Entity viewer, graph visualization, timeline |

---

## Interfaces With Other Teams

### Outgoing (Team 3 provides)

| Interface | Consumer | Description |
|---|---|---|
| Entity API | Team 4, Team 5 | CRUD + search for entities |
| Graph API | Team 4, Team 5 | Graph queries, traversal |
| Timeline API | Team 5 | Chronological events |
| Entity data | Team 4 | Entities for AI correlation |

### Incoming (Team 3 receives)

| Interface | Provider | Description |
|---|---|---|
| Observations | Team 2 | Raw data for extraction |
| Evidence | Team 1 | Evidence for entity linking |
| Entity schema | Team 1 | Type definitions |

---

## Entity Types

| Entity Type | Key Attributes |
|---|---|
| Person | name, aliases, emails, social_profiles |
| Company | name, domain, registration, industry |
| Domain | name, registrar, creation_date |
| IP | address, version, geolocation |
| Email | address, domain |
| URL | url, domain, path |
| Repository | owner, name, url, language |
| Technology | name, version, category |
| Location | name, coordinates, country |

---

## Relationship Types

| Relationship | Source → Target | Example |
|---|---|---|
| OWNS | Person/Company → Domain/IP/Company | "Acme owns acme.com" |
| WORKS_FOR | Person → Company | "Alice works for Acme" |
| USES | Company/Person → Technology | "Acme uses React" |
| HOSTED_ON | Domain → IP | "acme.com hosted on 1.2.3.4" |
| REGISTERED_TO | Domain → Person/Company | "acme.com registered to Acme" |
| MENTIONS | Evidence → Entity | "Report mentions Alice" |
| ASSOCIATED_WITH | Entity → Entity | "Alice associated with Acme" |
| RESOLVES_TO | Domain → IP | "acme.com resolves to 1.2.3.4" |

---

## CRITICAL RULE — Entity Resolution

**Never silently merge entities.**

Every resolution MUST have:
- `confidence` — numeric score (0.0–1.0)
- `evidence` — what evidence supports the merge
- `reason` — human-readable explanation
- `source` — which data source provided the match

---

## Task List

See `docs/tasks/team-3-intelligence.md` for the complete task list.

| Task | Title | Difficulty |
|---|---|---|
| T3-001 | Entity schema | Medium |
| T3-002 | Entity normalization | Medium |
| T3-003 | Entity extraction | Hard |
| T3-004 | Entity confidence | Medium |
| T3-005 | Entity resolution | Hard |
| T3-006 | Relationship schema | Medium |
| T3-007 | Relationship extraction | Hard |
| T3-008 | Graph schema | Medium |
| T3-009 | Graph storage | Hard |
| T3-010 | Graph queries | Hard |
| T3-011 | Temporal relationships | Medium |
| T3-012 | Investigation timeline | Medium |
| T3-013 | Entity API | Hard |
| T3-014 | Graph API | Hard |
| T3-015 | Resolution tests | Hard |
| T3-016 | Graph tests | Hard |
| T3-017 | Integration tests | Hard |
| T3-018 | Documentation | Easy |

---

## Git Workflow

1. Feature branch from `team/3-intelligence`
2. Implement feature
3. Write tests
4. Self-review
5. PR to `team/3-intelligence`
6. Team lead reviews
7. Merge to `team/3-intelligence`
8. Technical architect reviews `team/3-intelligence` → `main`

**Never push directly to `main`.**

---

## Testing Expectations

- Unit tests for entity extraction
- Unit tests for normalization
- Unit tests for resolution logic
- Integration tests for graph queries
- Contract tests against Entity/Relationship schemas
- Edge case tests (duplicate entities, conflicting data, temporal overlap)

---

## Documentation Expectations

- Entity type reference
- Relationship type reference
- Graph query examples
- Resolution algorithm documentation
- API endpoint documentation

---

## Security Rules

- No secrets in code
- All inputs validated via Zod
- Graph queries bounded (no infinite traversal)
- Entity resolution auditable
- No data modification without provenance

---

## AI Coding Rules

- Use OpenCode + Ollama (free/local only)
- No paid AI APIs
- AI explains before modifying
- AI suggests implementation plan first
- Human reviews all AI output
- AI never silently merges entities
- AI never decides resolution thresholds alone

---

## Definition of Done

- [ ] Code compiles with TypeScript strict mode
- [ ] All tests pass
- [ ] Entity resolution has confidence scores
- [ ] Every merge has evidence reference
- [ ] Graph queries are bounded
- [ ] Documentation updated
- [ ] PR reviewed and approved
- [ ] No silent entity merges

---

## Current Team Members

Head Intern: Abhishek Hirve (`hirveabhishek2006-design`)

| Member | Role | Task Allocations |
|---|---|---|
| hirveabhishek2006-design | Head Intern | T3-001, T3-002 |
| katkarsujal1-design | Intern | T3-003, T3-004 |
| raunaksin9890-gif | Intern | T3-005, T3-006 |
| Pannkajyadhav333 | Intern | T3-007, T3-008, T3-012 |
| parthvichare20 | Intern | T3-009, T3-010, T3-011, T3-013, T3-014 |
| lahanesakahi-create | PENDING VERIFICATION | |
