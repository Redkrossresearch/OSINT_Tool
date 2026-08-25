# Team 3 — Intelligence + Entity + Graph

## Mission

Extract entities from observations, resolve them to canonical forms, build relationships between them, and maintain a queryable intelligence graph that powers the investigation.

---

## Responsibilities

- Entity extraction from observations
- Entity normalization and canonicalization
- Entity resolution (same-entity detection across sources)
- Confidence scoring for entities and relationships
- Relationship extraction from observations
- Temporal relationship tracking (valid_from, valid_to)
- Graph storage (PostgreSQL-based for MVP)
- Graph queries (traversal, shortest path, neighborhood)
- Graph API
- Timeline generation from graph events
- Tests
- Documentation

---

## Owned Directories

```
services/intelligence/   — Entity extraction, resolution, normalization
services/graph/          — Graph storage, queries, API
packages/entities/       — Entity type definitions and schemas
docs/intelligence/       — Intelligence documentation
```

---

## Entity Types

| Entity Type | Description | Key Attributes |
|---|---|---|
| Person | Individual human | name, aliases, emails, social_profiles |
| Company | Organization/business | name, domain, registration, industry |
| Domain | Internet domain | name, registrar, creation_date |
| IP | IP address | address, version, geolocation |
| Email | Email address | address, domain |
| URL | Web URL | url, domain, path |
| Repository | Code repository | owner, name, url, language |
| Technology | Software/hardware | name, version, category |
| Location | Physical place | name, coordinates, country |

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

## Entity Resolution Strategy (MVP)

1. **Exact match**: Same normalized string → same entity
2. **Fuzzy match**: Levenshtein distance < threshold → candidate match
3. **Shared attribute match**: Same email/domain → likely same person
4. **Confidence decay**: Each match has a confidence score
5. **No silent merges**: All merges require confidence > threshold OR human confirmation

---

## Graph Model (MVP — PostgreSQL)

```sql
-- Entities table
CREATE TABLE entities (
  id UUID PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  canonical_name TEXT NOT NULL,
  attributes JSONB NOT NULL DEFAULT '{}',
  confidence FLOAT NOT NULL DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Relationships table
CREATE TABLE relationships (
  id UUID PRIMARY KEY,
  source_entity_id UUID NOT NULL REFERENCES entities(id),
  target_entity_id UUID NOT NULL REFERENCES entities(id),
  type VARCHAR(50) NOT NULL,
  confidence FLOAT NOT NULL DEFAULT 0.0,
  evidence_id UUID NOT NULL,
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  attributes JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Dependencies

- Team 1: Evidence schema, Observation schema, Entity schema
- Team 2: Observations from connectors (input for entity extraction)

## Dependents

- Team 4 (AI): Uses graph for correlation and analysis
- Team 5 (Product): Displays entity viewer, graph visualization, timeline

---

## API Endpoints (Planned)

| Endpoint | Method | Description |
|---|---|---|
| `/api/entities` | GET | List entities for investigation |
| `/api/entities/:id` | GET | Get entity details |
| `/api/entities` | POST | Create entity (from extraction) |
| `/api/relationships` | GET | List relationships |
| `/api/graph/:investigation_id` | GET | Get full graph for investigation |
| `/api/graph/:investigation_id/neighbors/:entity_id` | GET | Get entity neighborhood |
| `/api/timeline/:investigation_id` | GET | Get timeline |

---

## Testing Strategy

- Unit tests for entity extraction
- Unit tests for normalization
- Unit tests for resolution logic
- Integration tests for graph queries
- Contract tests against Entity and Relationship schemas
- Edge case tests (duplicate entities, conflicting data, temporal overlap)
